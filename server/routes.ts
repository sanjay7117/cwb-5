import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRoomSchema, insertCanvasDataSchema, insertRoomParticipantSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Room routes
  app.post('/api/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const code = await storage.generateRoomCode();
      
      const roomData = insertRoomSchema.parse({
        code,
        createdBy: userId,
        isPublic: req.body.isPublic || true,
        allowDrawing: req.body.allowDrawing || true,
      });
      
      const room = await storage.createRoom(roomData);
      
      // Join the creator to the room
      await storage.joinRoom({
        roomId: room.id,
        userId,
      });
      
      res.json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  app.get('/api/rooms/:code', isAuthenticated, async (req: any, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });

  app.post('/api/rooms/:code/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const room = await storage.getRoomByCode(req.params.code);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      const participant = await storage.joinRoom({
        roomId: room.id,
        userId,
      });
      
      res.json(participant);
    } catch (error) {
      console.error("Error joining room:", error);
      res.status(500).json({ message: "Failed to join room" });
    }
  });

  app.post('/api/rooms/:code/leave', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const room = await storage.getRoomByCode(req.params.code);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      await storage.leaveRoom(room.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error leaving room:", error);
      res.status(500).json({ message: "Failed to leave room" });
    }
  });

  app.get('/api/rooms/:code/participants', isAuthenticated, async (req: any, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      const participants = await storage.getActiveParticipants(room.id);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  app.post('/api/rooms/:code/heartbeat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const room = await storage.getRoomByCode(req.params.code);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      await storage.updateLastSeen(room.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating heartbeat:", error);
      res.status(500).json({ message: "Failed to update heartbeat" });
    }
  });

  // Canvas data routes
  app.post('/api/rooms/:code/canvas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const room = await storage.getRoomByCode(req.params.code);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      if (!room.allowDrawing) {
        return res.status(403).json({ message: "Drawing not allowed in this room" });
      }
      
      const canvasDataEntry = insertCanvasDataSchema.parse({
        roomId: room.id,
        userId,
        tool: req.body.tool,
        data: req.body.data,
      });
      
      const savedData = await storage.saveCanvasData(canvasDataEntry);
      res.json(savedData);
    } catch (error) {
      console.error("Error saving canvas data:", error);
      res.status(500).json({ message: "Failed to save canvas data" });
    }
  });

  app.get('/api/rooms/:code/canvas', isAuthenticated, async (req: any, res) => {
    try {
      const room = await storage.getRoomByCode(req.params.code);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      const since = req.query.since ? new Date(req.query.since as string) : undefined;
      const canvasData = await storage.getCanvasData(room.id, since);
      res.json(canvasData);
    } catch (error) {
      console.error("Error fetching canvas data:", error);
      res.status(500).json({ message: "Failed to fetch canvas data" });
    }
  });

  app.delete('/api/rooms/:code/canvas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const room = await storage.getRoomByCode(req.params.code);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      if (room.createdBy !== userId) {
        return res.status(403).json({ message: "Only room creator can clear canvas" });
      }
      
      await storage.clearCanvasData(room.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing canvas:", error);
      res.status(500).json({ message: "Failed to clear canvas" });
    }
  });

  app.put('/api/rooms/:code/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const room = await storage.getRoomByCode(req.params.code);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      if (room.createdBy !== userId) {
        return res.status(403).json({ message: "Only room creator can update settings" });
      }
      
      const updates = {
        isPublic: req.body.isPublic,
        allowDrawing: req.body.allowDrawing,
      };
      
      const updatedRoom = await storage.updateRoom(room.id, updates);
      res.json(updatedRoom);
    } catch (error) {
      console.error("Error updating room settings:", error);
      res.status(500).json({ message: "Failed to update room settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

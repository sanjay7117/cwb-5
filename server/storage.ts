import {
  users,
  rooms,
  canvasData,
  roomParticipants,
  type User,
  type UpsertUser,
  type Room,
  type InsertRoom,
  type CanvasData,
  type InsertCanvasData,
  type RoomParticipant,
  type InsertRoomParticipant,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Room operations
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomByCode(code: string): Promise<Room | undefined>;
  updateRoom(id: number, updates: Partial<Room>): Promise<Room>;
  validateRoomPassword(code: string, password: string): Promise<boolean>;
  
  // Canvas data operations
  saveCanvasData(data: InsertCanvasData): Promise<CanvasData>;
  getCanvasData(roomId: number, since?: Date): Promise<CanvasData[]>;
  clearCanvasData(roomId: number): Promise<void>;
  
  // Room participant operations
  joinRoom(participant: InsertRoomParticipant): Promise<RoomParticipant>;
  leaveRoom(roomId: number, userId: string): Promise<void>;
  updateLastSeen(roomId: number, userId: string): Promise<void>;
  getActiveParticipants(roomId: number): Promise<RoomParticipant[]>;
  
  // Generate unique room code
  generateRoomCode(): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Room operations
  async createRoom(room: InsertRoom): Promise<Room> {
    const [newRoom] = await db.insert(rooms).values(room).returning();
    return newRoom;
  }

  async getRoomByCode(code: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.code, code));
    return room;
  }

  async updateRoom(id: number, updates: Partial<Room>): Promise<Room> {
    const [updatedRoom] = await db
      .update(rooms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rooms.id, id))
      .returning();
    return updatedRoom;
  }

  // Canvas data operations
  async saveCanvasData(data: InsertCanvasData): Promise<CanvasData> {
    const [canvasEntry] = await db.insert(canvasData).values(data).returning();
    return canvasEntry;
  }

  async getCanvasData(roomId: number, since?: Date): Promise<CanvasData[]> {
    if (since) {
      return await db.select().from(canvasData)
        .where(and(
          eq(canvasData.roomId, roomId),
          gte(canvasData.timestamp, since)
        ))
        .orderBy(desc(canvasData.timestamp));
    }
    
    return await db.select().from(canvasData)
      .where(eq(canvasData.roomId, roomId))
      .orderBy(desc(canvasData.timestamp));
  }

  async clearCanvasData(roomId: number): Promise<void> {
    await db.delete(canvasData).where(eq(canvasData.roomId, roomId));
  }

  // Room participant operations
  async joinRoom(participant: InsertRoomParticipant): Promise<RoomParticipant> {
    const [roomParticipant] = await db
      .insert(roomParticipants)
      .values(participant)
      .onConflictDoUpdate({
        target: [roomParticipants.roomId, roomParticipants.userId],
        set: {
          lastSeen: new Date(),
        },
      })
      .returning();
    return roomParticipant;
  }

  async leaveRoom(roomId: number, userId: string): Promise<void> {
    await db
      .delete(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          eq(roomParticipants.userId, userId)
        )
      );
  }

  async updateLastSeen(roomId: number, userId: string): Promise<void> {
    await db
      .update(roomParticipants)
      .set({ lastSeen: new Date() })
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          eq(roomParticipants.userId, userId)
        )
      );
  }

  async getActiveParticipants(roomId: number): Promise<RoomParticipant[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return await db
      .select()
      .from(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          gte(roomParticipants.lastSeen, fiveMinutesAgo)
        )
      );
  }

  // Validate room password
  async validateRoomPassword(code: string, password: string): Promise<boolean> {
    const room = await this.getRoomByCode(code);
    if (!room) return false;
    
    // If room is public, no password needed
    if (room.isPublic) return true;
    
    // For private rooms, check password
    return room.password === password;
  }

  // Generate unique room code
  async generateRoomCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let attempts = 0;
    
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      attempts++;
      
      if (attempts > 10) {
        throw new Error('Unable to generate unique room code');
      }
      
      const existing = await this.getRoomByCode(code);
      if (!existing) {
        break;
      }
    } while (true);
    
    return code;
  }
}

export const storage = new DatabaseStorage();

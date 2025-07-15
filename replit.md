# CollabBoard - Real-time Collaborative Whiteboard

## Overview

CollabBoard is a real-time collaborative whiteboard application built with React/TypeScript frontend and Express.js backend. It allows multiple users to draw, create shapes, and collaborate together in shared rooms with real-time synchronization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth with session-based authentication
- **Real-time**: Polling-based updates (no WebSockets implemented)
- **Session Storage**: PostgreSQL with connect-pg-simple

## Key Components

### Database Schema
- **Users**: Stores user profiles from Replit OAuth
- **Rooms**: Collaborative spaces with unique codes
- **Canvas Data**: Drawing actions and shapes
- **Room Participants**: Tracks active users in rooms
- **Sessions**: Session storage for authentication

### Authentication System
- Uses Replit OAuth for user authentication
- Session-based authentication with PostgreSQL storage
- Middleware protection for API routes
- Automatic session management and renewal

### Real-time Collaboration
- Polling-based synchronization every 2 seconds for canvas data
- Participant tracking with last-seen timestamps
- Room-based isolation of collaborative spaces
- Drawing action persistence and replay

### Drawing System
- Canvas-based drawing with HTML5 Canvas API
- Multiple tools: pen, shapes (rectangle, circle, line, triangle, arrow)
- Color selection and line width adjustment
- Emoji placement functionality
- Undo/redo functionality with history management

## Data Flow

1. **User Authentication**: Users authenticate via Replit OAuth
2. **Room Creation/Joining**: Users create or join rooms with unique codes
3. **Canvas Interaction**: Drawing actions are captured and sent to backend
4. **Real-time Sync**: Frontend polls backend every 2 seconds for updates
5. **Data Persistence**: All actions stored in PostgreSQL for replay

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- shadcn/ui components built on Radix UI
- Tailwind CSS for styling
- Wouter for routing
- Lucide React for icons

### Backend Dependencies
- Express.js for API server
- Drizzle ORM for database operations
- @neondatabase/serverless for PostgreSQL connection
- Replit OAuth packages for authentication
- Session management with express-session

### Database
- PostgreSQL (configured for Neon serverless)
- Drizzle migrations for schema management
- Connection pooling for performance

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with auto-reload using tsx
- Database migrations with Drizzle Kit
- Replit-specific development tooling

### Production
- Frontend built with Vite and served as static files
- Backend bundled with esbuild
- Environment-based configuration
- Database URL required for deployment

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption secret
- `REPL_ID`: Replit application ID
- `ISSUER_URL`: OAuth issuer URL

### Build Process
- Frontend: `vite build` outputs to `dist/public`
- Backend: `esbuild` bundles server to `dist/index.js`
- Database: `drizzle-kit push` for schema deployment

The application is designed to be deployed on Replit with automatic database provisioning and OAuth integration, but can be adapted for other cloud platforms with appropriate configuration changes.
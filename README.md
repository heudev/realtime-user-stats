# Realtime User Stats

Real-time user statistics tracking system built with Node.js, Socket.IO, and MongoDB.

## Features

- Real-time user counting per domain
- Maximum concurrent users tracking
- Historical data storage
- RESTful API endpoints
- Cross-domain support

## Tech Stack

- Node.js & Express.js
- Socket.IO
- MongoDB
- Docker

## Quick Start

1. Clone and install:

```bash
git clone [repository-url]
cd realtime-user-stats
```

2. Docker setup:

```bash
docker-compose up --build
```

3. Development setup:

```bash
npm install
npm run dev
```

## API Endpoints

- `GET /stats` - Get statistics for all domains

## Socket Events

- `connection` - Client connects
- `disconnect` - Client disconnects
- `traffic` - Real-time statistics updates

## Environment Variables

```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/realtime-stats
```

## Project Structure

```
src/
├── config/         # Configurations
├── models/         # Database models
├── services/       # Business logic
├── controllers/    # Request handlers
├── routes/         # API routes
├── utils/          # Utilities
└── app.js         # Entry point
```

## License

ISC

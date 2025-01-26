# Realtime User Stats

A real-time user statistics tracking system built with Node.js, Socket.IO, and MongoDB. This application allows you to track and monitor user presence across different domains in real-time.

## Features

- Real-time user counting per domain
- Maximum concurrent users tracking
- Historical data storage with timestamps
- RESTful API for statistics
- Cross-domain support
- Docker containerization

## Tech Stack

- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB
- **Containerization**: Docker
- **Time Management**: Moment.js
- **Development**: Nodemon

## Project Structure

```
src/
├── config/         # Configuration files
│   └── database.js # Database connection setup
├── models/         # Database models
│   └── Room.js     # Room schema and model
├── services/       # Business logic
│   ├── roomService.js    # Room management
│   └── socketService.js  # Socket.IO handling
├── controllers/    # Request handlers
│   └── statsController.js
├── routes/         # API routes
│   └── stats.js
├── utils/          # Utility functions
│   └── timeUtils.js
└── app.js         # Application entry point
```

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (automatically handled by Docker)

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd realtime-user-stats
```

2. Run with Docker Compose:

```bash
docker-compose up --build
```

3. For local development:

```bash
npm install
npm run dev
```

## API Endpoints

- `GET /stats`: Retrieve statistics for all domains

## Socket Events

- `connection`: Triggered when a client connects
- `disconnect`: Triggered when a client disconnects
- `traffic`: Emitted to clients with updated statistics

## Environment Variables

- `PORT`: Server port (default: 3002)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/realtime-stats)

## Docker Support

The application is containerized using Docker and includes:

- Node.js application container
- MongoDB container
- Persistent volume for MongoDB data
- Automatic container orchestration with Docker Compose

## Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

## Production

To run in production:

```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC

# Spill - Real-Time Nightlife Discovery App

Spill is a mobile application that revolutionizes how people experience nightlife by providing real-time updates and photos from bars and venues. Users can share and discover the current vibe of venues, connect with friends, and make informed decisions about their night out.

## Features

- Real-time photo sharing and updates from venues
- Live venue discovery with heat maps
- Social connections and friend groups
- Location-based venue exploration
- Interactive engagement features

## Tech Stack

### Frontend
- React Native
- Redux for state management
- React Navigation
- Native device integration (camera, GPS)

### Backend
- Node.js with Express
- PostgreSQL database
- Redis for caching
- WebSocket for real-time updates

### Infrastructure
- AWS/Google Cloud Platform
- Docker containerization
- S3 for media storage

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- React Native development environment
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spill.git
cd spill
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../mobile
npm install
```

3. Set up environment variables:
```bash
# Backend
cp .env.example .env

# Mobile
cp mobile/.env.example mobile/.env
```

4. Start the development servers:
```bash
# Backend
cd backend
npm run dev

# Mobile
cd ../mobile
npm run start
```

## Project Structure

```
spill/
├── backend/           # Node.js backend server
│   ├── src/
│   │   ├── api/      # API routes
│   │   ├── config/   # Configuration files
│   │   ├── models/   # Database models
│   │   └── services/ # Business logic
│   └── tests/        # Backend tests
├── mobile/           # React Native mobile app
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   └── utils/
│   └── tests/        # Frontend tests
└── docs/            # Documentation
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

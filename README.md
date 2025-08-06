# Five Minute Games

A React-based web application for discovering and tracking daily puzzle games, now powered by a custom .NET API backend with PostgreSQL.

## Architecture

- **Frontend**: React 18 with Tailwind CSS
- **Backend**: .NET 8 Web API with Entity Framework Core
- **Database**: PostgreSQL
- **Authentication**: JWT tokens with Google OAuth support

## Features

- **User Authentication**: Email/password and Google OAuth login
- **Game Discovery**: Browse and search through 70+ daily puzzle games
- **Favorites Management**: Save your favorite games for quick access
- **Friends System**: Add friends and see their game activity
- **Play Tracking**: Record your daily game scores and messages
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- .NET 8 SDK
- PostgreSQL 12+

**Not sure if you have these installed?** See [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md) for detailed installation verification steps.

### 1. Set Up the API

```bash
cd api
dotnet restore
```

Update `appsettings.json` with your database connection and JWT settings:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=fiveminutegames;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-jwt-key-here-make-it-long-and-secure"
  }
}
```

Run the API:

```bash
dotnet run
```

The API will be available at `https://localhost:5001` with Swagger documentation.

### 2. Set Up the React App

```bash
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Update the API URL in `.env` if needed:

```env
REACT_APP_API_URL=https://localhost:5001/api
```

Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
├── api/                          # .NET Web API
│   ├── Controllers/              # API controllers
│   ├── Models/                   # Data models and DTOs
│   ├── Services/                 # Business logic services
│   ├── Data/                     # Entity Framework DbContext
│   ├── Middleware/               # Custom middleware
│   └── Configuration/            # App configuration
├── src/
│   ├── components/               # React components
│   ├── utils/                    # Utilities and services
│   │   ├── DataContext.js        # React context for state management
│   │   └── dataService.js        # API client (replaces Firebase)
│   └── games.js                  # Game definitions
├── public/                       # Static assets
└── MIGRATION_GUIDE.md           # Firebase to API migration guide
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search/{username}` - Find user by username

### Friends & Social
- `GET /api/friends` - Get user's friends
- `POST /api/friends` - Add friend by username
- `DELETE /api/friends/{friendId}` - Remove friend

### Game Data
- `GET /api/favorites` - Get user's favorite games
- `POST /api/favorites/{gameId}` - Add game to favorites
- `GET /api/plays/today` - Get today's game plays
- `PUT /api/plays/{gameId}` - Update game play record

## Development

### Running in Development

1. Start the API:
   ```bash
   cd api && dotnet run
   ```

2. Start the React app:
   ```bash
   npm start
   ```

### Database Migrations

When making changes to entity models:

```bash
cd api
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

### Testing the API

Use the Swagger UI at `https://localhost:5001` to test API endpoints interactively.

## Migration from Firebase

This project was migrated from Firebase to a custom .NET API. See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed migration information.

### Key Changes

- **Authentication**: Firebase Auth → JWT tokens
- **Database**: Firestore → PostgreSQL with Entity Framework
- **Real-time**: Firebase listeners → API polling (can be upgraded to SignalR)
- **Hosting**: Firebase Hosting → Self-hosted API + static hosting

## Deployment

### API Deployment

1. Configure production settings in `appsettings.Production.json`
2. Set up PostgreSQL database
3. Deploy to your preferred hosting platform (Azure, AWS, etc.)
4. Configure HTTPS and domain

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy the `build` folder to static hosting (Netlify, Vercel, etc.)
3. Update `REACT_APP_API_URL` to point to your production API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Emoji Picker React
- React Colorful

### Backend
- .NET 8
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI
- BCrypt for password hashing

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
1. Check the [Migration Guide](MIGRATION_GUIDE.md)
2. Review API documentation at `https://localhost:5001`
3. Open an issue on GitHub

## Roadmap

- [ ] Real-time notifications with SignalR
- [ ] Enhanced game statistics and analytics
- [ ] Mobile app with React Native
- [ ] Advanced friend features (groups, challenges)
- [ ] Game recommendation engine
- [ ] Social features (comments, sharing)
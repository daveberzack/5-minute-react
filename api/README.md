# Five Minute Games API

A .NET 8 Web API that replaces Firebase with PostgreSQL and Entity Framework Core for the Five Minute Games application.

## Features

- **JWT Authentication** with email/password and Google OAuth support
- **PostgreSQL Database** with Entity Framework Core
- **RESTful API** endpoints for all game functionality
- **Swagger Documentation** for API exploration
- **CORS Support** for React frontend integration

## Prerequisites

- .NET 8 SDK
- PostgreSQL 12 or higher
- Visual Studio Code or Visual Studio

## Setup Instructions

### 1. Install PostgreSQL

Make sure PostgreSQL is installed and running on your system.

### 2. Configure Database Connection

Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=fiveminutegames;Username=your_username;Password=your_password"
  }
}
```

### 3. Configure JWT Settings

Update the JWT settings in `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-jwt-key-here-make-it-long-and-secure",
    "Issuer": "FiveMinuteGamesApi",
    "Audience": "FiveMinuteGamesClient",
    "ExpirationMinutes": 60,
    "RefreshExpirationDays": 7
  }
}
```

### 4. Configure Google OAuth (Optional)

If you want to enable Google authentication, update the Google settings:

```json
{
  "GoogleAuth": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret"
  }
}
```

### 5. Install Dependencies

```bash
dotnet restore
```

### 6. Create Database

The application will automatically create the database and tables on first run. Alternatively, you can use Entity Framework migrations:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 7. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001` (in development)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search/{username}` - Find user by username
- `PUT /api/users/preferences` - Update user preferences

### Friends Management
- `GET /api/friends` - Get user's friends
- `POST /api/friends` - Add friend by username
- `DELETE /api/friends/{friendId}` - Remove friend

### Favorites Management
- `GET /api/favorites` - Get user's favorite games
- `POST /api/favorites/{gameId}` - Add game to favorites
- `DELETE /api/favorites/{gameId}` - Remove game from favorites

### Game Plays
- `GET /api/plays/{date}` - Get plays for specific date
- `GET /api/plays/today` - Get today's plays
- `PUT /api/plays/{gameId}` - Update/create play for game
- `POST /api/plays` - Create new play

## Database Schema

The API uses the following PostgreSQL tables:

- **Users** - User accounts and profiles
- **UserFriends** - Friend relationships
- **UserFavorites** - User's favorite games
- **GamePlays** - Game play records by date

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token-here
```

## CORS Configuration

The API is configured to allow requests from `http://localhost:3000` by default (React development server). Update the CORS settings in `appsettings.json` for production.

## Development

### Adding New Endpoints

1. Create DTOs in `Models/DTOs/`
2. Add service methods in `Services/`
3. Create controller actions in `Controllers/`
4. Update Swagger documentation if needed

### Database Migrations

When making changes to entity models:

```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

## Production Deployment

1. Update connection strings and secrets
2. Set `ASPNETCORE_ENVIRONMENT=Production`
3. Configure proper CORS origins
4. Set up HTTPS certificates
5. Configure logging and monitoring
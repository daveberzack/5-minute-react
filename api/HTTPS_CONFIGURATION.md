# HTTPS Configuration Changes

## Summary
This document outlines the changes made to temporarily disable HTTPS for development to resolve certificate issues.

## Changes Made

### 1. Program.cs
- **Line 113**: Commented out `app.UseHttpsRedirection();` to prevent automatic HTTP to HTTPS redirects
- **Change**: 
  ```csharp
  // Temporarily disabled HTTPS redirection for development
  // app.UseHttpsRedirection();
  ```

### 2. Properties/launchSettings.json
- **Line 8**: Removed `"sslPort": 5001` from iisSettings to disable SSL port configuration
- **Profile Order**: HTTP profile remains first, making it the default when running `dotnet run`

### 3. appsettings.json
- **Line 24**: Updated CORS AllowedOrigins to only include HTTP origins for development
- **Change**: Removed `"https://localhost:3000"` from the allowed origins array

## Current Configuration
- **HTTP Port**: 5000
- **HTTPS**: Disabled
- **Default Profile**: HTTP
- **CORS**: Only allows `http://localhost:3000`

## Testing Results
✅ Application runs successfully on `http://localhost:5000`
✅ API endpoints respond correctly (tested `/api/auth/register`)
✅ No certificate errors
✅ Swagger UI available at `http://localhost:5000` (Development mode)

## Re-enabling HTTPS Later

When you're ready to implement HTTPS properly, reverse these changes:

### 1. Restore Program.cs
```csharp
app.UseHttpsRedirection();
```

### 2. Restore launchSettings.json
```json
{
  "iisSettings": {
    "iisExpress": {
      "applicationUrl": "http://localhost:5000",
      "sslPort": 5001
    }
  }
}
```

### 3. Update CORS in appsettings.json
```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "https://localhost:3000"]
  }
}
```

### 4. Generate Development Certificate
```bash
dotnet dev-certs https --trust
```

### 5. Use HTTPS Profile
```bash
dotnet run --launch-profile https
```

## Running the Application

### Current (HTTP Only)
```bash
dotnet run
# or explicitly
dotnet run --launch-profile http
```

### Future (With HTTPS)
```bash
dotnet run --launch-profile https
```

## Notes
- The application is now configured for HTTP-only development
- All certificate-related issues have been resolved
- The app can be easily switched back to HTTPS when needed
- Database migrations work correctly with the current configuration
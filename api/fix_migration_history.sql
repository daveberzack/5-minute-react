-- Fix migration history by marking the InitialCreate migration as applied
-- This tells Entity Framework that the migration has already been run

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250730001841_InitialCreate', '8.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;
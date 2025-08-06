-- This script fixes the migration history issue by marking the InitialCreate migration as applied
-- Run this script to resolve the "relation 'Users' already exists" error

-- Ensure the migrations history table exists
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- Insert the migration record to mark it as applied
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250730001841_InitialCreate', '8.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;

-- Verify the fix
SELECT "MigrationId", "ProductVersion" FROM "__EFMigrationsHistory";
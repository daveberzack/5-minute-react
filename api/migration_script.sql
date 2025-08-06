CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "Email" character varying(255) NOT NULL,
        "PasswordHash" character varying(255) NOT NULL,
        "Username" character varying(50) NOT NULL,
        "Character" character varying(10) NOT NULL,
        "Color" character varying(7) NOT NULL,
        "ShowOther" boolean NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "UpdatedAt" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE TABLE "GamePlays" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "GameId" character varying(10) NOT NULL,
        "PlayDate" date NOT NULL,
        "Score" character varying(50),
        "Message" text,
        "CreatedAt" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "UpdatedAt" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "PK_GamePlays" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_GamePlays_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE TABLE "UserFavorites" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "GameId" character varying(10) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "PK_UserFavorites" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_UserFavorites_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE TABLE "UserFriends" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "FriendId" uuid NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "PK_UserFriends" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_UserFriends_Users_FriendId" FOREIGN KEY ("FriendId") REFERENCES "Users" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_UserFriends_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE INDEX "IX_GamePlays_PlayDate" ON "GamePlays" ("PlayDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE INDEX "IX_GamePlays_UserId" ON "GamePlays" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_GamePlays_UserId_GameId_PlayDate" ON "GamePlays" ("UserId", "GameId", "PlayDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_UserFavorites_UserId_GameId" ON "UserFavorites" ("UserId", "GameId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE INDEX "IX_UserFriends_FriendId" ON "UserFriends" ("FriendId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_UserFriends_UserId_FriendId" ON "UserFriends" ("UserId", "FriendId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_Username" ON "Users" ("Username");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250730001841_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20250730001841_InitialCreate', '8.0.0');
    END IF;
END $EF$;
COMMIT;


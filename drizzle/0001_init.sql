CREATE TABLE `user` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL UNIQUE,
  `emailVerified` integer NOT NULL,
  `image` text,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL
);

CREATE TABLE `session` (
  `id` text PRIMARY KEY NOT NULL,
  `expiresAt` integer NOT NULL,
  `token` text NOT NULL UNIQUE,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL,
  `ipAddress` text,
  `userAgent` text,
  `userId` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `account` (
  `id` text PRIMARY KEY NOT NULL,
  `accountId` text NOT NULL,
  `providerId` text NOT NULL,
  `userId` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` integer,
  `refreshTokenExpiresAt` integer,
  `scope` text,
  `password` text,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL
);

CREATE TABLE `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expiresAt` integer NOT NULL,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL
);

CREATE TABLE `personal_access_tokens` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `token_hash` text NOT NULL UNIQUE,
  `name` text NOT NULL,
  `prefix` text NOT NULL,
  `created_at` integer NOT NULL,
  `revoked_at` integer
);

CREATE TABLE `projects` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `created_at` integer NOT NULL,
  `created_by` text NOT NULL REFERENCES `user`(`id`)
);

CREATE TABLE `project_members` (
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `role` text NOT NULL,
  `created_at` integer NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`)
);

CREATE TABLE `secrets` (
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `environment` text NOT NULL,
  `ciphertext` text NOT NULL,
  `version` integer NOT NULL,
  `updated_at` integer NOT NULL,
  `updated_by` text NOT NULL REFERENCES `user`(`id`),
  PRIMARY KEY (`project_id`, `environment`)
);

CREATE TABLE `invites` (
  `id` text PRIMARY KEY NOT NULL,
  `code_hash` text NOT NULL UNIQUE,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `role` text NOT NULL,
  `created_by` text NOT NULL REFERENCES `user`(`id`),
  `expires_at` integer NOT NULL,
  `used_at` integer,
  `used_by` text
);

CREATE TABLE `device_grants` (
  `id` text PRIMARY KEY NOT NULL,
  `device_code_hash` text NOT NULL UNIQUE,
  `user_code` text NOT NULL UNIQUE,
  `status` text NOT NULL,
  `user_id` text,
  `issued_token` text,
  `expires_at` integer NOT NULL,
  `created_at` integer NOT NULL
);

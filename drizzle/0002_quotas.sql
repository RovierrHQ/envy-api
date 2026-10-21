CREATE TABLE IF NOT EXISTS `write_log` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `created_at` integer NOT NULL
);

CREATE INDEX IF NOT EXISTS `write_log_user_time` ON `write_log` (`user_id`, `created_at`);

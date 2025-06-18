CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`template_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`content` text,
	`is_public` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resumes_slug_unique` ON `resumes` (`slug`);--> statement-breakpoint
CREATE INDEX `resumes_user_id_idx` ON `resumes` (`user_id`);--> statement-breakpoint
CREATE INDEX `resumes_template_id_idx` ON `resumes` (`template_id`);--> statement-breakpoint
CREATE INDEX `resumes_slug_idx` ON `resumes` (`slug`);--> statement-breakpoint
CREATE INDEX `resumes_created_at_idx` ON `resumes` (`created_at`);--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text DEFAULT 'professional' NOT NULL,
	`is_public` integer DEFAULT true NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`preview_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `templates_category_idx` ON `templates` (`category`);--> statement-breakpoint
CREATE INDEX `templates_public_idx` ON `templates` (`is_public`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`stack_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`avatar` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_stack_id_unique` ON `users` (`stack_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_stack_id_idx` ON `users` (`stack_id`);
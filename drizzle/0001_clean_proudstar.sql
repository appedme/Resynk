DROP INDEX `resumes_slug_unique`;--> statement-breakpoint
DROP INDEX `resumes_user_id_idx`;--> statement-breakpoint
DROP INDEX `resumes_template_id_idx`;--> statement-breakpoint
DROP INDEX `resumes_slug_idx`;--> statement-breakpoint
DROP INDEX `resumes_created_at_idx`;--> statement-breakpoint
ALTER TABLE `resumes` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `resumes` DROP COLUMN `is_published`;--> statement-breakpoint
DROP INDEX `templates_category_idx`;--> statement-breakpoint
DROP INDEX `templates_public_idx`;--> statement-breakpoint
ALTER TABLE `templates` DROP COLUMN `preview_url`;--> statement-breakpoint
ALTER TABLE `templates` DROP COLUMN `updated_at`;--> statement-breakpoint
DROP INDEX `users_email_unique`;--> statement-breakpoint
DROP INDEX `users_email_idx`;--> statement-breakpoint
DROP INDEX `users_stack_id_idx`;
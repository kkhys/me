CREATE TABLE `me_post` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `me_post_id` PRIMARY KEY(`id`),
	CONSTRAINT `me_post_name_unique` UNIQUE(`name`)
);

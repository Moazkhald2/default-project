CREATE TABLE `exam_questions` (
	`exam_id` text NOT NULL,
	`question_id` text NOT NULL,
	`order` integer NOT NULL,
	`points` real DEFAULT 1 NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`grade` text NOT NULL,
	`topic` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`grade` text NOT NULL,
	`topic` text NOT NULL,
	`difficulty` text NOT NULL,
	`prompt_tex` text NOT NULL,
	`figure_svg` text,
	`material_id` text,
	`answer_tex` text,
	`source` text
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`grade` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text NOT NULL,
	`student_id` text NOT NULL,
	`answers_json` text NOT NULL,
	`score` real,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);

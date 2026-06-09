CREATE TABLE "book" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL,
	"date_created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"status" varchar(100),
	"author_user_id" uuid NOT NULL
);

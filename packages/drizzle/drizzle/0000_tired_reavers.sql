CREATE TYPE "status" AS ENUM ('queued', 'completed');
CREATE TABLE "webcontent" (
	"jobID" varchar(256) PRIMARY KEY NOT NULL,
	"websiteUrl" varchar(256) NOT NULL,
	"content" varchar(256),
	"status" "status" DEFAULT 'queued'
);

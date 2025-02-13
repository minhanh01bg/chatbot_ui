-- Tạo bảng "User"
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(64) NOT NULL,
  "password" VARCHAR(64)
);

-- Tạo bảng "Chat"
CREATE TABLE IF NOT EXISTS "Chat" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMP NOT NULL,
  "title" TEXT NOT NULL,
  "userId" UUID NOT NULL REFERENCES "User"("id"),
  "visibility" VARCHAR(10) NOT NULL DEFAULT 'private'
);

-- Tạo bảng "Message"
CREATE TABLE IF NOT EXISTS "Message" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "chatId" UUID NOT NULL REFERENCES "Chat"("id"),
  "role" VARCHAR(50) NOT NULL,
  "content" JSON NOT NULL,
  "createdAt" TIMESTAMP NOT NULL
);

-- Tạo bảng "Vote"
CREATE TABLE IF NOT EXISTS "Vote" (
  "chatId" UUID NOT NULL REFERENCES "Chat"("id"),
  "messageId" UUID NOT NULL REFERENCES "Message"("id"),
  "isUpvoted" BOOLEAN NOT NULL,
  PRIMARY KEY ("chatId", "messageId")
);

-- Tạo bảng "Document"
CREATE TABLE IF NOT EXISTS "Document" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMP NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "kind" VARCHAR(10) NOT NULL DEFAULT 'text',
  "userId" UUID NOT NULL REFERENCES "User"("id"),
  CONSTRAINT "unique_document" UNIQUE ("id", "createdAt")
);

-- Tạo bảng "Suggestion"
CREATE TABLE IF NOT EXISTS "Suggestion" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "documentId" UUID NOT NULL,
  "documentCreatedAt" TIMESTAMP NOT NULL,
  "originalText" TEXT NOT NULL,
  "suggestedText" TEXT NOT NULL,
  "description" TEXT,
  "isResolved" BOOLEAN NOT NULL DEFAULT FALSE,
  "userId" UUID NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("documentId", "documentCreatedAt") REFERENCES "Document"("id", "createdAt")
);



ALTER TABLE "Document"
ADD COLUMN "text" TEXT;

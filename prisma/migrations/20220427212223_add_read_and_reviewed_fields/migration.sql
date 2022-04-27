-- AlterTable
ALTER TABLE "books" ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false;

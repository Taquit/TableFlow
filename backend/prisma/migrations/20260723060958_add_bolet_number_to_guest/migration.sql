/*
  Warnings:

  - A unique constraint covering the columns `[boletNumber]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "boletNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Guest_boletNumber_key" ON "Guest"("boletNumber");

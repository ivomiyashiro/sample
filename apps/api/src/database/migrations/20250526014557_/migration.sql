/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Sample` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sample_name_key" ON "Sample"("name");

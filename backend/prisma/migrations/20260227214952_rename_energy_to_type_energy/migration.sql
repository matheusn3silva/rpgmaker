/*
  Warnings:

  - You are about to drop the column `energy` on the `CharacterStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CharacterStatus" DROP COLUMN "energy",
ADD COLUMN     "typeEnergy" VARCHAR(20);

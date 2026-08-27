/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `birthPlace` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `residence` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `energyType` on the `CharacterStatus` table. All the data in the column will be lost.
  - You are about to drop the column `luck` on the `CharacterStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "birthDate",
DROP COLUMN "birthPlace",
DROP COLUMN "experience",
DROP COLUMN "residence",
ALTER COLUMN "level" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CharacterStatus" DROP COLUMN "energyType",
DROP COLUMN "luck";

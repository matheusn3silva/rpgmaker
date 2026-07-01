/*
  Warnings:

  - You are about to drop the column `height` on the `CharacterAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CharacterAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `CharacterAttributes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "height" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "weight" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "CharacterAttributes" DROP COLUMN "height",
DROP COLUMN "size",
DROP COLUMN "weight";

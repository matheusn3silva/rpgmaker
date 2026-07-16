/*
  Warnings:

  - You are about to drop the column `upgradeCost` on the `CharacterSkill` table. All the data in the column will be lost.
  - You are about to drop the column `upgradeType` on the `CharacterSkill` table. All the data in the column will be lost.
  - You are about to drop the column `upgradeCost` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `upgradeType` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CharacterSkill" DROP COLUMN "upgradeCost",
DROP COLUMN "upgradeType";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "upgradeCost",
DROP COLUMN "upgradeType";

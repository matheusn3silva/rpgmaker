/*
  Warnings:

  - You are about to drop the column `effortPoints` on the `CharacterStatus` table. All the data in the column will be lost.
  - You are about to drop the column `energyPoints` on the `CharacterStatus` table. All the data in the column will be lost.
  - You are about to drop the column `lifePoints` on the `CharacterStatus` table. All the data in the column will be lost.
  - You are about to drop the column `typeEnergy` on the `CharacterStatus` table. All the data in the column will be lost.
  - You are about to drop the column `peCost` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `psCost` on the `Skill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[archetype]` on the table `RPGClass` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Proficiency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `archetype` to the `RPGClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sparkFormula` to the `RPGClass` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArchetypeType" AS ENUM ('ASHEN', 'SHARD', 'LUMEN');

-- CreateEnum
CREATE TYPE "ProficiencyCategory" AS ENUM ('COMBATE', 'SOBRENATURAL', 'INVESTIGACAO', 'SOCIAL', 'PRATICA', 'ESPECIAL');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CharacterAttributes" ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CharacterStatus" DROP COLUMN "effortPoints",
DROP COLUMN "energyPoints",
DROP COLUMN "lifePoints",
DROP COLUMN "typeEnergy",
ADD COLUMN     "embers" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "energyType" VARCHAR(20),
ADD COLUMN     "soul" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spark" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "vitality" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "Proficiency" ADD COLUMN     "category" "ProficiencyCategory" NOT NULL;

-- AlterTable
ALTER TABLE "RPGClass" ADD COLUMN     "archetype" "ArchetypeType" NOT NULL,
ADD COLUMN     "sparkFormula" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "peCost",
DROP COLUMN "psCost",
ADD COLUMN     "emberCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sparkCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upgradeCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upgradeDescription" TEXT,
ADD COLUMN     "upgradeType" VARCHAR(20);

-- CreateTable
CREATE TABLE "CharacterSkill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "SkillType" NOT NULL DEFAULT 'ATIVA_ACAO',
    "description" TEXT NOT NULL,
    "sparkCost" INTEGER NOT NULL DEFAULT 0,
    "emberCost" INTEGER NOT NULL DEFAULT 0,
    "upgradeDescription" TEXT,
    "upgradeCost" INTEGER NOT NULL DEFAULT 0,
    "upgradeType" VARCHAR(20),
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "CharacterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RPGClass_archetype_key" ON "RPGClass"("archetype");

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

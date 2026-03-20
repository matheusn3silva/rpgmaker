/*
  Warnings:

  - You are about to drop the column `dexterity` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `intelligence` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `strength` on the `Character` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `RPGClass` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Skill` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `resetPasswordToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `verificationToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[classId,name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "dexterity",
DROP COLUMN "intelligence",
DROP COLUMN "strength",
ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" VARCHAR(50),
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "occupation" VARCHAR(50),
ADD COLUMN     "personality" VARCHAR(50),
ADD COLUMN     "residence" VARCHAR(50);

-- AlterTable
ALTER TABLE "RPGClass" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "resetPasswordToken" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "verificationToken" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "CharacterAttributes" (
    "id" SERIAL NOT NULL,
    "strength" INTEGER NOT NULL DEFAULT 10,
    "dexterity" INTEGER NOT NULL DEFAULT 10,
    "constitution" INTEGER NOT NULL DEFAULT 10,
    "intelligence" INTEGER NOT NULL DEFAULT 10,
    "education" INTEGER NOT NULL DEFAULT 10,
    "presence" INTEGER NOT NULL DEFAULT 10,
    "power" INTEGER NOT NULL DEFAULT 10,
    "size" VARCHAR(30),
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "CharacterAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStatus" (
    "id" SERIAL NOT NULL,
    "lifePoints" INTEGER NOT NULL DEFAULT 20,
    "effortPoints" INTEGER NOT NULL DEFAULT 1,
    "energyPoints" INTEGER NOT NULL DEFAULT 1,
    "exposureLevel" INTEGER NOT NULL DEFAULT 5,
    "initiative" INTEGER NOT NULL DEFAULT 0,
    "luck" INTEGER NOT NULL DEFAULT 0,
    "movement" INTEGER NOT NULL DEFAULT 1,
    "energy" VARCHAR(20) NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "CharacterStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proficiency" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Proficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterProficiency" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "characterId" INTEGER NOT NULL,
    "proficiencyId" INTEGER NOT NULL,

    CONSTRAINT "CharacterProficiency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterAttributes_characterId_key" ON "CharacterAttributes"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterStatus_characterId_key" ON "CharacterStatus"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "Proficiency_name_key" ON "Proficiency"("name");

-- CreateIndex
CREATE INDEX "CharacterProficiency_characterId_idx" ON "CharacterProficiency"("characterId");

-- CreateIndex
CREATE INDEX "CharacterProficiency_proficiencyId_idx" ON "CharacterProficiency"("proficiencyId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterProficiency_characterId_proficiencyId_key" ON "CharacterProficiency"("characterId", "proficiencyId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_classId_name_key" ON "Skill"("classId", "name");

-- AddForeignKey
ALTER TABLE "CharacterAttributes" ADD CONSTRAINT "CharacterAttributes_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStatus" ADD CONSTRAINT "CharacterStatus_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterProficiency" ADD CONSTRAINT "CharacterProficiency_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterProficiency" ADD CONSTRAINT "CharacterProficiency_proficiencyId_fkey" FOREIGN KEY ("proficiencyId") REFERENCES "Proficiency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

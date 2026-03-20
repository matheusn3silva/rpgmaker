/*
  Warnings:

  - The values [ATIVA/ACAO,ATIVA/BONUS,ATIVA/REACAO] on the enum `SkillType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SkillType_new" AS ENUM ('PASSIVA', 'ATIVA_ACAO', 'ATIVA_BONUS', 'ATIVA_REACAO');
ALTER TABLE "Skill" ALTER COLUMN "type" TYPE "SkillType_new" USING ("type"::text::"SkillType_new");
ALTER TYPE "SkillType" RENAME TO "SkillType_old";
ALTER TYPE "SkillType_new" RENAME TO "SkillType";
DROP TYPE "public"."SkillType_old";
COMMIT;

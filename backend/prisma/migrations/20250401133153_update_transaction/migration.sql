/*
  Warnings:

  - Added the required column `summary` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `summary` VARCHAR(191) NOT NULL;

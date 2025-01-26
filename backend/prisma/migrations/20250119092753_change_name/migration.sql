/*
  Warnings:

  - You are about to drop the column `chainId` on the `token` table. All the data in the column will be lost.
  - Added the required column `chain_id` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `token` DROP COLUMN `chainId`,
    ADD COLUMN `chain_id` VARCHAR(191) NOT NULL;

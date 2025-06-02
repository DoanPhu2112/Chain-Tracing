/*
  Warnings:

  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `type` ENUM('send', 'swap', 'approve', 'receive', 'airdrop') NOT NULL;

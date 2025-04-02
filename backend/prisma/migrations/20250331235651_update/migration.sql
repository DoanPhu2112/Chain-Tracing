/*
  Warnings:

  - The primary key for the `Chain` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rpc_url` on the `Chain` table. All the data in the column will be lost.
  - You are about to drop the column `chain_hash` on the `Eoa` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Eoa` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Graph` table. All the data in the column will be lost.
  - You are about to drop the column `story_id` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `chain_hash` on the `Smartcontract` table. All the data in the column will be lost.
  - You are about to drop the column `asset_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `chain_hash` on the `Transaction` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `Erc20token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Erc721token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Story_Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chain_id` to the `Chain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chain_id` to the `Eoa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Made the column `graph_id` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_hash` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timestamp` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chain_id` to the `Smartcontract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chain_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `report_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Eoa` DROP FOREIGN KEY `Eoa_chain_hash_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_graph_id_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_story_id_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Smartcontract` DROP FOREIGN KEY `Smartcontract_chain_hash_fkey`;

-- DropForeignKey
ALTER TABLE `Story_Transaction` DROP FOREIGN KEY `Story_Transaction_story_id_fkey`;

-- DropForeignKey
ALTER TABLE `Story_Transaction` DROP FOREIGN KEY `Story_Transaction_transaction_id_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_chain_hash_fkey`;

-- DropIndex
DROP INDEX `Eoa_chain_hash_fkey` ON `Eoa`;

-- DropIndex
DROP INDEX `Eoa_name_tag_idx` ON `Eoa`;

-- DropIndex
DROP INDEX `Report_graph_id_fkey` ON `Report`;

-- DropIndex
DROP INDEX `Report_story_id_fkey` ON `Report`;

-- DropIndex
DROP INDEX `Report_user_id_fkey` ON `Report`;

-- DropIndex
DROP INDEX `Smartcontract_chain_hash_fkey` ON `Smartcontract`;

-- DropIndex
DROP INDEX `Transaction_chain_hash_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Chain` DROP PRIMARY KEY,
    DROP COLUMN `rpc_url`,
    ADD COLUMN `chain_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`chain_id`);

-- AlterTable
ALTER TABLE `Eoa` DROP COLUMN `chain_hash`,
    DROP COLUMN `score`,
    ADD COLUMN `chain_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Graph` DROP COLUMN `title`;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `story_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `title` VARCHAR(255) NOT NULL,
    MODIFY `graph_id` INTEGER NOT NULL,
    MODIFY `amount` BIGINT NOT NULL,
    MODIFY `transaction_hash` VARCHAR(191) NOT NULL,
    MODIFY `timestamp` BIGINT NOT NULL,
    MODIFY `category` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Smartcontract` DROP COLUMN `chain_hash`,
    ADD COLUMN `chain_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `asset_id`,
    DROP COLUMN `chain_hash`,
    ADD COLUMN `amount` BIGINT NOT NULL,
    ADD COLUMN `chain_id` INTEGER NOT NULL,
    ADD COLUMN `token_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `report_id` INTEGER NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Erc20token`;

-- DropTable
DROP TABLE `Erc721token`;

-- DropTable
DROP TABLE `Story`;

-- DropTable
DROP TABLE `Story_Transaction`;

-- DropTable
DROP TABLE `tags`;

-- DropTable
DROP TABLE `token`;

-- CreateTable
CREATE TABLE `Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` CHAR(42) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `symbol` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `chain_id` INTEGER NOT NULL,

    INDEX `Token_chain_id_fkey`(`chain_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SmartContractType` (
    `contract_id` INTEGER NOT NULL,
    `type_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`contract_id`, `type_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EoaType` (
    `eoa_id` INTEGER NOT NULL,
    `type_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`eoa_id`, `type_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Smartcontract_chain_id_fkey` ON `Smartcontract`(`chain_id`);

-- CreateIndex
CREATE INDEX `Transaction_chain_id_fkey` ON `Transaction`(`chain_id`);

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_chain_id_fkey` FOREIGN KEY (`chain_id`) REFERENCES `Chain`(`chain_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Smartcontract` ADD CONSTRAINT `Smartcontract_chain_id_fkey` FOREIGN KEY (`chain_id`) REFERENCES `Chain`(`chain_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SmartContractType` ADD CONSTRAINT `SmartContractType_contract_id_fkey` FOREIGN KEY (`contract_id`) REFERENCES `Smartcontract`(`contract_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `Token`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_chain_id_fkey` FOREIGN KEY (`chain_id`) REFERENCES `Chain`(`chain_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Eoa` ADD CONSTRAINT `Eoa_chain_id_fkey` FOREIGN KEY (`chain_id`) REFERENCES `Chain`(`chain_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EoaType` ADD CONSTRAINT `EoaType_eoa_id_fkey` FOREIGN KEY (`eoa_id`) REFERENCES `Eoa`(`eoa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`report_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_graph_id_fkey` FOREIGN KEY (`graph_id`) REFERENCES `Graph`(`graph_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

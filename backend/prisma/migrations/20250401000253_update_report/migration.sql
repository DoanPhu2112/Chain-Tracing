/*
  Warnings:

  - You are about to drop the column `report_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_graph_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_report_id_fkey`;

-- DropIndex
DROP INDEX `Report_graph_id_fkey` ON `Report`;

-- DropIndex
DROP INDEX `User_report_id_fkey` ON `User`;

-- AlterTable
ALTER TABLE `Report` ADD COLUMN `user_id` INTEGER NOT NULL,
    MODIFY `graph_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `report_id`;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_graph_id_fkey` FOREIGN KEY (`graph_id`) REFERENCES `Graph`(`graph_id`) ON DELETE SET NULL ON UPDATE CASCADE;

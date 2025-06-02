-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_token_id_fkey`;

-- DropIndex
DROP INDEX `Transaction_token_id_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `token_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `Token`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

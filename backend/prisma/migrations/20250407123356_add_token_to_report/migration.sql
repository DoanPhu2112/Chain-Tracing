-- AlterTable
ALTER TABLE `Report` ADD COLUMN `token_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `Token`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

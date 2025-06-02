-- AlterTable
ALTER TABLE `Eoa` ADD COLUMN `label_source` ENUM('ethereum', 'moralis') NOT NULL DEFAULT 'ethereum';

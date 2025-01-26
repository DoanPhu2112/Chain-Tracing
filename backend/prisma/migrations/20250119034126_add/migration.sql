-- AlterTable
ALTER TABLE `Smartcontract` ADD COLUMN `label_source` ENUM('ethereum', 'moralis') NOT NULL DEFAULT 'ethereum';

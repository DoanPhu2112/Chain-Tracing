-- CreateTable
CREATE TABLE `Story` (
    `story_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`story_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Graph` (
    `graph_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`graph_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Erc20token` (
    `erc20_id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` CHAR(42) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(255) NOT NULL,
    `possible_spam` BOOLEAN NULL,
    `decimal` DECIMAL(65, 30) NOT NULL,
    `verified_contract` BOOLEAN NULL,
    `logo` VARCHAR(191) NULL,

    PRIMARY KEY (`erc20_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Erc721token` (
    `erc721_id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` CHAR(42) NOT NULL,
    `description` VARCHAR(191) NULL,
    `animation_url` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `value` VARCHAR(191) NULL,
    `traits` BIGINT NULL,

    PRIMARY KEY (`erc721_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` CHAR(42) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `symbol` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `chain_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Smartcontract` (
    `contract_id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` CHAR(42) NOT NULL,
    `source_code` MEDIUMTEXT NOT NULL,
    `is_verified` BOOLEAN NULL,
    `type` TEXT NOT NULL,
    `chain_hash` VARCHAR(191) NOT NULL,
    `name_tag` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `label_source` ENUM('ethereum', 'moralis') NOT NULL DEFAULT 'ethereum',
    `abi` TEXT NULL,

    INDEX `Smartcontract_chain_hash_fkey`(`chain_hash`),
    PRIMARY KEY (`contract_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` CHAR(66) NOT NULL,
    `block_hash` CHAR(66) NOT NULL,
    `from_address` CHAR(42) NOT NULL,
    `to_address` CHAR(42) NOT NULL,
    `asset_id` INTEGER NULL,
    `chain_hash` VARCHAR(191) NOT NULL,

    INDEX `Transaction_chain_hash_fkey`(`chain_hash`),
    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TornadoWithdrawTransaction` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` CHAR(66) NOT NULL,
    `from_address` CHAR(42) NOT NULL,
    `recipient_address` CHAR(42) NOT NULL,
    `to_address` CHAR(42) NOT NULL,
    `from_proxy` BOOLEAN NOT NULL,
    `contract_address` CHAR(42) NOT NULL,
    `timestamp` BIGINT NOT NULL,
    `value` BIGINT NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TornadoDepositTransaction` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` CHAR(66) NOT NULL,
    `from_address` CHAR(42) NOT NULL,
    `to_address` CHAR(42) NOT NULL,
    `contract_address` CHAR(42) NOT NULL,
    `timestamp` BIGINT NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Eoa` (
    `eoa_id` INTEGER NOT NULL AUTO_INCREMENT,
    `native_balance` BIGINT NOT NULL,
    `score` INTEGER NOT NULL,
    `name_tag` VARCHAR(191) NULL,
    `label` VARCHAR(191) NULL,
    `hash` VARCHAR(191) NOT NULL,
    `chain_hash` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `label_source` ENUM('ethereum', 'moralis') NOT NULL DEFAULT 'ethereum',

    INDEX `Eoa_name_tag_idx`(`name_tag`),
    INDEX `Eoa_chain_hash_fkey`(`chain_hash`),
    PRIMARY KEY (`eoa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Story_Transaction` (
    `story_transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `story_id` INTEGER NOT NULL,
    `transaction_id` INTEGER NOT NULL,
    `sequence_number` BIGINT NOT NULL,

    INDEX `Story_Transaction_story_id_fkey`(`story_id`),
    INDEX `Story_Transaction_transaction_id_fkey`(`transaction_id`),
    PRIMARY KEY (`story_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Graph_Transaction` (
    `graph_transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `graph_id` INTEGER NOT NULL,
    `transaction_id` INTEGER NOT NULL,
    `sequence_number` BIGINT NOT NULL,

    INDEX `Graph_Transaction_graph_id_fkey`(`graph_id`),
    INDEX `Graph_Transaction_transaction_id_fkey`(`transaction_id`),
    PRIMARY KEY (`graph_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chain` (
    `hash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rpc_url` VARCHAR(191) NULL,

    PRIMARY KEY (`hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `story_id` INTEGER NULL,
    `graph_id` INTEGER NULL,
    `amount` VARCHAR(191) NULL,
    `transaction_hash` VARCHAR(191) NULL,
    `timestamp` BIGINT NULL,
    `category` VARCHAR(191) NULL,
    `address` CHAR(42) NULL,
    `url` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,

    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Smartcontract` ADD CONSTRAINT `Smartcontract_chain_hash_fkey` FOREIGN KEY (`chain_hash`) REFERENCES `Chain`(`hash`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_chain_hash_fkey` FOREIGN KEY (`chain_hash`) REFERENCES `Chain`(`hash`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Eoa` ADD CONSTRAINT `Eoa_chain_hash_fkey` FOREIGN KEY (`chain_hash`) REFERENCES `Chain`(`hash`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Story_Transaction` ADD CONSTRAINT `Story_Transaction_story_id_fkey` FOREIGN KEY (`story_id`) REFERENCES `Story`(`story_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Story_Transaction` ADD CONSTRAINT `Story_Transaction_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transaction`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Graph_Transaction` ADD CONSTRAINT `Graph_Transaction_graph_id_fkey` FOREIGN KEY (`graph_id`) REFERENCES `Graph`(`graph_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Graph_Transaction` ADD CONSTRAINT `Graph_Transaction_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transaction`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_story_id_fkey` FOREIGN KEY (`story_id`) REFERENCES `Story`(`story_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_graph_id_fkey` FOREIGN KEY (`graph_id`) REFERENCES `Graph`(`graph_id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
CREATE TABLE `Smartcontract` (
    `contract_id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` CHAR(42) NOT NULL,
    `source_code` TEXT NOT NULL,
    `is_verified` BOOLEAN NULL,
    `type` TEXT NOT NULL,
    `chain_hash` VARCHAR(191) NOT NULL,
    `name_tag` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,

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

    PRIMARY KEY (`eoa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Story_Transaction` (
    `story_transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `story_id` INTEGER NOT NULL,
    `transaction_id` INTEGER NOT NULL,
    `sequence_number` BIGINT NOT NULL,

    PRIMARY KEY (`story_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chain` (
    `hash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rpc_url` VARCHAR(191) NULL,

    PRIMARY KEY (`hash`)
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

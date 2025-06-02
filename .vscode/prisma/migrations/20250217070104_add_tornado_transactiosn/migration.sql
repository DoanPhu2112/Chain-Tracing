-- CreateTable
CREATE TABLE `TornadoWithdrawTransaction` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` CHAR(66) NOT NULL,
    `from_address` CHAR(42) NOT NULL,
    `to_address` CHAR(42) NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TornadoDepositTransaction` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` CHAR(66) NOT NULL,
    `from_address` CHAR(42) NOT NULL,
    `to_address` CHAR(42) NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

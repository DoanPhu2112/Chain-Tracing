-- AlterTable
ALTER TABLE `Transaction` MODIFY `type` ENUM('send', 'swap', 'approve', 'receive', 'airdrop', 'sign', 'revoked') NOT NULL;

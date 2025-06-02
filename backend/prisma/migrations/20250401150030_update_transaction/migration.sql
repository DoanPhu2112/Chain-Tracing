/*
  Warnings:

  - You are about to drop the `EoaType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SmartContractType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EoaType` DROP FOREIGN KEY `EoaType_eoa_id_fkey`;

-- DropForeignKey
ALTER TABLE `SmartContractType` DROP FOREIGN KEY `SmartContractType_contract_id_fkey`;

-- DropTable
DROP TABLE `EoaType`;

-- DropTable
DROP TABLE `SmartContractType`;

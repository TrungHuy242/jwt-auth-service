-- DropIndex
DROP INDEX `RefreshToken_token_key` ON `refreshtoken`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE';

-- RedefineIndex
CREATE INDEX `RefreshToken_userId_idx` ON `RefreshToken`(`userId`);
DROP INDEX `RefreshToken_userId_fkey` ON `refreshtoken`;

-- AddUploadedFile
CREATE TABLE `UploadedFile` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `originalName` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INT NOT NULL,
    `folder` VARCHAR(191),
    `type` ENUM('IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `uploadedById` INT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE SET NULL
);

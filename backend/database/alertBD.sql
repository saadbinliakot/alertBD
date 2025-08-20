
CREATE DATABASE alertBD;
USE alertBD;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `AdminAction`;
DROP TABLE IF EXISTS `EmergencyAlert`;
DROP TABLE IF EXISTS `CrimeReport`;
DROP TABLE IF EXISTS `CrimeType`;
DROP TABLE IF EXISTS `Location`;
DROP TABLE IF EXISTS `User`;
SET FOREIGN_KEY_CHECKS=1;


CREATE TABLE `User` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `role` ENUM('Citizen','Police','Admin') NOT NULL DEFAULT 'Citizen',
  `latitude` DECIMAL(10,8),     -- optional current location
  `longitude` DECIMAL(11,8),    -- optional current location
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Location` (
  `location_id` INT AUTO_INCREMENT PRIMARY KEY,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `name` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `CrimeType` (
  `crime_type_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `CrimeReport` (
  `report_id` INT AUTO_INCREMENT PRIMARY KEY,
  `crime_type_id` INT NOT NULL,
  `description` TEXT,
  `datetime` DATETIME NOT NULL,
  `user_id` INT NOT NULL,
  `status` ENUM('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `location_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cr_crimetype`
    FOREIGN KEY (`crime_type_id`) REFERENCES `CrimeType`(`crime_type_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_cr_user`
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_cr_location`
    FOREIGN KEY (`location_id`) REFERENCES `Location`(`location_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX `idx_cr_status` (`status`),
  INDEX `idx_cr_datetime` (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `AdminAction` (
  `action_id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `report_id` INT NOT NULL,
  `action_type` ENUM('Verify','Reject') NOT NULL,
  `action_timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_action_admin`
    FOREIGN KEY (`admin_id`) REFERENCES `User`(`user_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_action_report`
    FOREIGN KEY (`report_id`) REFERENCES `CrimeReport`(`report_id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `EmergencyAlert` (
  `alert_id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `message` VARCHAR(255),
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_alert_sender`
    FOREIGN KEY (`sender_id`) REFERENCES `User`(`user_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX `idx_alert_geo` (`latitude`,`longitude`),
  INDEX `idx_alert_time` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


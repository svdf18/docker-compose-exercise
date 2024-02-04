-- setup.sql

CREATE DATABASE IF NOT EXISTS `blog_posts`;
USE `blog_posts`;

CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` TEXT NOT NULL,
    `post_text` LONGTEXT NOT NULL,
    `user_name` TEXT NOT NULL,
    `date_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `likes` INT NOT NULL DEFAULT 0
);

-- MySQL doesn't support IF statements directly in the INSERT syntax This hack is a workaround to ensure these rows
-- are only inserted if they don't already exist in the table
INSERT INTO `posts` (`id`, `title`, `post_text`, `user_name`, `date_posted`, `likes`) 
SELECT * FROM (SELECT 1, 'Getting Started with Docker', 'This post will guide you through the basics of Docker, including installation, setting up your first container, and understanding Docker images and Dockerfiles.', 'Alice', '2024-01-14 15:24:47', 31 UNION
               SELECT 2, 'Mastering Docker-Compose', 'Explore the advanced features of Docker-Compose, such as setting up multi-container environments, networking between containers, and using Docker-Compose in development and production.', 'Bob', '2024-01-13 15:24:47', 74 UNION
               SELECT 3, 'Docker Best Practices for Developers', 'Learn about the best practices for using Docker as a developer, including efficient image building, container orchestration, and security considerations.', 'Charlie', '2024-01-12 15:24:47', 37 UNION
               SELECT 4, 'Advanced Docker-Compose Techniques', 'Dive deeper into Docker-Compose with topics like custom configuration files, scaling services, and integrating with CI/CD pipelines.', 'Diana', '2024-01-11 15:24:47', 30) AS temp
WHERE NOT EXISTS (SELECT * FROM `posts`);

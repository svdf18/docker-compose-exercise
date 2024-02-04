run with docker-compose up -d

The very first time you run this setup you need to create the required tables in the database

Login to the db-container like this

docker exec -it NAME bash
in the container login to the MySQL client like so

mysql -u root -psecret

verify that the database blog_posts is created (show databases;) and then paste in these lines to create the table:

CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` TEXT NOT NULL,
    `post_text` LONGTEXT NOT NULL,
    `user_name` TEXT NOT NULL,
    `date_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `likes` INT NOT NULL DEFAULT 0
);



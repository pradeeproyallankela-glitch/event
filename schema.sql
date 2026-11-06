-- Run once:  mysql -u root -p < schema.sql
CREATE DATABASE IF NOT EXISTS college;
USE college;

CREATE TABLE IF NOT EXISTS events (
  event_id     INT          PRIMARY KEY,
  event_name   VARCHAR(100) NOT NULL,
  event_time   TIME         NOT NULL,
  event_date   DATE         NOT NULL,
  venue_type   VARCHAR(50)  NOT NULL,
  description  VARCHAR(500) NULL          -- optional
);

INSERT IGNORE INTO events VALUES
(1,'Annual Tech Fest','10:00:00','2026-11-05','Auditorium','Two-day technical festival with coding contests and project expo.'),
(2,'Inter-College Cricket Cup','08:30:00','2026-11-12','Outdoor Ground','Knockout cricket tournament between 8 colleges.'),
(3,'Cultural Night','18:00:00','2026-11-20','Open Air Theatre',NULL);

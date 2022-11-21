INSERT INTO movies (id, title, directorid) VALUES (0, 'Dredd', 5);

INSERT INTO movies (id, title, year, description, directorid, imageurl, featured)
VALUES (1, 'Aliens', 1986, 'Aliens description', 0, 'https://upload.wikimedia.org/wikipedia/en/f/fb/Aliens_poster.jpg', true);
INSERT INTO moviegenres (movieid, genreid) VALUES (1, 0);
INSERT INTO moviegenres (movieid, genreid) VALUES (1, 1);

INSERT INTO movies (id, title, directorid) VALUES (2, 'Natural Born Killers', 3);

INSERT INTO movies (id, title, directorid) VALUES (3, 'The Road', 6);

INSERT INTO movies (id, title, directorid, featured)
VALUES (4, 'Conan The Barbarian', 4, true);
INSERT INTO moviegenres (movieid, genreid) VALUES (4, 3);
INSERT INTO moviegenres (movieid, genreid) VALUES (4, 1);

INSERT INTO movies (id, title, directorid) VALUES (5, 'True Lies', 0);
INSERT INTO moviegenres (movieid, genreid) VALUES (5, 1);
INSERT INTO moviegenres (movieid, genreid) VALUES (5, 2);

INSERT INTO movies (id, title, directorid, featured) VALUES (6, 'Full Metal Jacket', 1, true);

INSERT INTO movies (id, title, directorid) VALUES (7, 'A Clockwork Orange', 1);

INSERT INTO movies (id, title, directorid, featured) VALUES (8, 'Blade Runner', 2, true);
INSERT INTO moviegenres (movieid, genreid) VALUES (8, 0);

INSERT INTO movies (id, title, directorid, featured) VALUES (9, 'Terminator 2: Judgment Day', 0, true);
INSERT INTO moviegenres (movieid, genreid) VALUES (9, 0);
INSERT INTO moviegenres (movieid, genreid) VALUES (9, 1);

INSERT INTO movies (id, title, directorid)
VALUES (10, 'Alien', 2);
INSERT INTO moviegenres (movieid, genreid) VALUES (10, 0);
INSERT INTO moviegenres (movieid, genreid) VALUES (10, 4);

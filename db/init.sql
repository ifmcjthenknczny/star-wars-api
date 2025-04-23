CREATE TABLE IF NOT EXISTS planets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    planet_id INTEGER REFERENCES planets(id)
);

CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS character_episodes (
    character_id INTEGER REFERENCES characters(id),
    episode_id INTEGER REFERENCES episodes(id),
    PRIMARY KEY (character_id, episode_id)
);

-- Planets
INSERT INTO planets (name) VALUES
('Tatooine'),
('Alderaan'),
('Hoth'),
('Endor'),
('Naboo'),
('Coruscant'),
('Kamino'),
('Geonosis'),
('Utapau');

-- Episodes
INSERT INTO episodes (name) VALUES ('NEWHOPE', 'EMPIRE', 'JEDI', 'CLONES', 'SITHS', 'FORCE', 'LASTJEDI', 'RISE', 'PHANTOM');

-- Characters
INSERT INTO characters (name, planet_id) VALUES ('Luke Skywalker', NULL);
INSERT INTO characters (name, planet_id) VALUES ('Darth Vader', NULL);
INSERT INTO characters (name, planet_id) VALUES ('Han Solo', NULL);
INSERT INTO characters (name, planet_id) VALUES ('Leia Organa', (SELECT id FROM planets WHERE name = 'Alderaan'));
INSERT INTO characters (name, planet_id) VALUES ('Wilhuff Tarkin', NULL);
INSERT INTO characters (name, planet_id) VALUES ('C-3PO', NULL);
INSERT INTO characters (name, planet_id) VALUES ('R2-D2', NULL);

-- Character episodes
INSERT INTO character_episodes (character_id, episode_id) VALUES
((SELECT id FROM characters WHERE name = 'Luke Skywalker'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'Luke Skywalker'), (SELECT id FROM episodes WHERE name = 'EMPIRE')),
((SELECT id FROM characters WHERE name = 'Luke Skywalker'), (SELECT id FROM episodes WHERE name = 'JEDI')),
((SELECT id FROM characters WHERE name = 'Darth Vader'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'Darth Vader'), (SELECT id FROM episodes WHERE name = 'EMPIRE')),
((SELECT id FROM characters WHERE name = 'Darth Vader'), (SELECT id FROM episodes WHERE name = 'JEDI')),
((SELECT id FROM characters WHERE name = 'Han Solo'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'Han Solo'), (SELECT id FROM episodes WHERE name = 'EMPIRE')),
((SELECT id FROM characters WHERE name = 'Han Solo'), (SELECT id FROM episodes WHERE name = 'JEDI')),
((SELECT id FROM characters WHERE name = 'Leia Organa'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'Leia Organa'), (SELECT id FROM episodes WHERE name = 'EMPIRE')),
((SELECT id FROM characters WHERE name = 'Leia Organa'), (SELECT id FROM episodes WHERE name = 'JEDI')),
((SELECT id FROM characters WHERE name = 'Wilhuff Tarkin'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'C-3PO'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'C-3PO'), (SELECT id FROM episodes WHERE name = 'EMPIRE')),
((SELECT id FROM characters WHERE name = 'C-3PO'), (SELECT id FROM episodes WHERE name = 'JEDI')),
((SELECT id FROM characters WHERE name = 'R2-D2'), (SELECT id FROM episodes WHERE name = 'NEWHOPE')),
((SELECT id FROM characters WHERE name = 'R2-D2'), (SELECT id FROM episodes WHERE name = 'EMPIRE')),
((SELECT id FROM characters WHERE name = 'R2-D2'), (SELECT id FROM episodes WHERE name = 'JEDI'));
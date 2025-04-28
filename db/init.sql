CREATE TABLE IF NOT EXISTS planets (
    name VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS characters (
    name VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    planet VARCHAR(255) REFERENCES planets(name) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS episodes (
    codename VARCHAR(32) UNIQUE NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    episode_number INTEGER UNIQUE CHECK (episode_number > 0)
);

CREATE TABLE IF NOT EXISTS character_episodes (
    character_name VARCHAR(255) REFERENCES characters(name) ON DELETE CASCADE ON UPDATE CASCADE,
    episode VARCHAR(32) REFERENCES episodes(codename) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (character_name, episode)
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
INSERT INTO episodes (codename, title, episode_number) VALUES
('PHANTOM', 'The Phantom Menace', 1),
('CLONES', 'Attack of the Clones', 2),
('SITHS', 'Revenge of the Sith', 3),
('NEWHOPE', 'A New Hope', 4),
('EMPIRE', 'The Empire Strikes Back', 5),
('JEDI', 'Return of the Jedi', 6),
('FORCE', 'The Force Awakens', 7),
('LASTJEDI', 'The Last Jedi', 8),
('RISE', 'The Rise of Skywalker', 9);

-- Characters
INSERT INTO characters (name, planet) VALUES
('Luke Skywalker', NULL),
('Darth Vader', NULL),
('Han Solo', NULL),
('Leia Organa', 'Alderaan'),
('Wilhuff Tarkin', NULL),
('C-3PO', NULL),
('R2-D2', NULL);

-- Character episodes
INSERT INTO character_episodes (character_name, episode) VALUES
('Luke Skywalker', 'NEWHOPE'),
('Luke Skywalker', 'EMPIRE'),
('Luke Skywalker', 'JEDI'),
('Darth Vader', 'NEWHOPE'),
('Darth Vader', 'EMPIRE'),
('Darth Vader', 'JEDI'),
('Han Solo', 'NEWHOPE'),
('Han Solo', 'EMPIRE'),
('Han Solo', 'JEDI'),
('Leia Organa', 'NEWHOPE'),
('Leia Organa', 'EMPIRE'),
('Leia Organa', 'JEDI'),
('Wilhuff Tarkin', 'NEWHOPE'),
('C-3PO', 'NEWHOPE'),
('C-3PO', 'EMPIRE'),
('C-3PO', 'JEDI'),
('R2-D2', 'NEWHOPE'),
('R2-D2', 'EMPIRE'),
('R2-D2', 'JEDI');

CREATE INDEX idx_character_name ON character_episodes(character_name);
CREATE INDEX idx_episode ON character_episodes(episode);
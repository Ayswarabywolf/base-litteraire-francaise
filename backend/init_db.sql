-- Création de l'utilisateur et des bases de données
CREATE USER hlp_user WITH PASSWORD 'hlp_password';

-- Base de données principale
CREATE DATABASE hlp_db WITH OWNER = hlp_user;
\connect hlp_db

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Droits
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hlp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hlp_user;

-- Base de données de test
CREATE DATABASE hlp_test_db WITH OWNER = hlp_user;
\connect hlp_test_db

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Droits
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hlp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hlp_user;

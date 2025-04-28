# Star Wars API

This project implements a backend API for managing Star Wars characters. It is built using NestJS, Node.js, and TypeScript, and supports basic CRUD operations. The API is designed to handle data about characters, planets, and episodes, with pagination support to manage large datasets.

## TL;DR
**What it is:** A Star Wars API built with NestJS, providing data about characters, planets, and episodes.  

**Key Tech:** NestJS, TypeScript, TypeORM, PostgreSQL, Docker.  

**To Run:**
1. Install Docker and Yarn.
2. `git clone https://github.com/ifmcjthenknczny/star-wars-api`
3. `cd star-wars-api`
4. `docker-compose up --build -d` (API at `http://localhost:3000`)  

**Dev Mode:** Same Docker setup, then `cp .env.example .env`, `docker-compose rm -s nestjs-app`, and `yarn start:dev`.  

**Access API Docs:** `http://localhost:3000/api`.  

**API Key:** Requires `x-api-key` header with value `codeandpepper` for some endpoints.  

## Used technologies
* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* Docker & Docker Compose
* Yarn
* Swagger (@nestjs/swagger)

## Setup, Installation and Running

1. Make sure you have already:
- Docker and Docker Compose installed on your machine and running.
- Yarn installed on your machine.

2. Clone the Repository:
```bash
git clone https://github.com/ifmcjthenknczny/star-wars-api
cd star-wars-api
```

3. Build and Start the Containers:
Run the following command in `star-wars-api` directory to start the application with required database (PostgreSQL) with example data locally in Docker containers:

```bash
docker-compose up --build -d
```

This will build the project and run it in detached mode. It will also implement example data and run the PostgreSQL container. API will be available at `http://localhost:3000`, as PostgreSQL willl be available at port `5432`.

## Running in watch mode

For a smoother development experience with live reloading complete the Docker setup as described in the previous section, and:

4. In main directory of a project (`star-wars-api`) run  
 ```bash
 cp .env.example .env
 ```  
 This will use default values for your local development.
5. Remove the `nestjs-app` container using Docker Compose:  
 ```bash
 docker-compose rm -s nestjs-app
 ```  
 Leave the postgresdb container running unless you intend to use a different PostgreSQL instance (in which case, update the `.env` file accordingly).
6. Start the development server using Yarn:  
```bash
yarn start:dev
```

## Environment Variables

* ```API_KEY```
Used to authenticate API requests and restrict access to certain endpoints.

* ```DATABASE_HOST```
Specifies the database server location (locally hosted in this case).

* ```DATABASE_NAME```
The name of the PostgreSQL database containing the Star Wars data.

* ```DATABASE_PASSWORD```
The password for connecting to the PostgreSQL database.

* ```DATABASE_PORT```
The port used for the PostgreSQL database (default is 5432).

* ```DATABASE_USER```
The username for authenticating with the PostgreSQL database.

* ```PORT```
The port on which the backend API server listens.

The values for these environment variables for Docker deployment are declared in `docker-compose.yml`. For local development, you can also use `.env` file.

## API Docs

The API is documented and accessible via Swagger at `http://localhost:3000/api`.

## API Key Authentication

Some endpoints are secured and require the x-api-key header for access. The default API key is:

<details>
<summary>Reveal secret</summary>

```codeandpepper```
</details>

Add the API key to your request headers like this:

<details>
<summary>Reveal secret</summary>

```x-api-key: codeandpepper```
</details>

## Database Structure

The application utilizes a PostgreSQL database with the following schema:

**1. `characters` Table:**

```sql
CREATE TABLE IF NOT EXISTS characters (
    name VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    planet VARCHAR(255) REFERENCES planets(name) DEFAULT NULL
);
```

**2. `planets` Table:**

```sql
CREATE TABLE IF NOT EXISTS planets (
    name VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY
);
```

**3. `episodes` Table:**

```sql
CREATE TABLE IF NOT EXISTS episodes (
    codename VARCHAR(32) UNIQUE NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    episode_number INTEGER UNIQUE CHECK (episode_number > 0)
);
```

**4. `character_episodes` Table:**

```sql
CREATE TABLE IF NOT EXISTS character_episodes (
    character_name VARCHAR(255) REFERENCES characters(name) ON DELETE CASCADE ON UPDATE CASCADE,
    episode VARCHAR(32) REFERENCES episodes(codename) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (character_name, episode)
);
```

## Architectural Decisions

* **REST API**: Chosen for its simplicity in implementing basic CRUD operations. It is widely popular and provides an easy way to leverage NestJS decorators for routing and handling parameters.

* **Database Choice**: PostgreSQL: PostgreSQL was selected over MongoDB due to its complexity, but it provides better scalability for future expansions. The application may eventually include more detailed information about planets and episodes, requiring a normalized database structure. This decision involves creating four tables to properly represent the relationships between the data. The creation and updating of character records are performed within a transaction to enhance system resilience against unexpected errors.

* **Normalized Data**: The database schema is designed with normalization in mind to allow the app to grow in various directions while maintaining consistency and reducing redundancy.

* **Schema vs. MongoDB Flexibility**: While MongoDB is flexible, a schema-based approach was chosen to ensure query results remain consistent and predictable. MongoDB could easily support denormalized data, but future-proofing the app with a schema will better suit the long-term goals of consistency and expandability.

* **Minimized Typo Risk**: The use of table foreign keys reduces the likelihood of typos, especially when adding new content like Star Wars characters. This approach also ensures that changes in data, such as the release of a new episode, won't require code modifications.

* **Additional Database Validation**: Postgres provides validation at the database level and ensures that data integrity is maintained and that only valid data is stored.

* **Inspiration from PokeAPI**: The architectural choices were inspired by solutions from [PokeAPI](https://pokeapi.co/), an API with a similar goal and good documentation.

* **Consistency in Data**: Planets and episodes are not automatically created when adding characters. This decision was made to maintain database consistency and avoid breaking modularity.

* **Unique Planet and Character Names**: Planet and character names are treated as unique in the database. All parts from each Star Wars trilogy were added to ensure comprehensive coverage.

* **User Permissions**: Users are allowed to retrieve data via GET requests but cannot perform POST, PUT, or DELETE operations. These endpoints are protected by an API key to ensure proper authorization and security.

## Ensuring Application Stability in Production
To ensure the application remains performant and stable as it grows, and to maintain its reliability as it scales and evolves over time with a focus on security, maintainability, and performance, several key considerations have been made for the production environment:

* **Future Expansion**: As additional data about planets becomes available, new endpoints may be added to allow updates. However, the existing endpoints already provide the necessary data retrieval functionality.

* **Endpoint Security**: To protect endpoints from unauthorized access, JWT (JSON Web Tokens) is the recommended approach. Although implementing JWT authentication was outside the scope of this task, limited access is simulated using an API key. In the future, JWT would offer better security due to its shorter expiration time.

* **Database Scalability**: The Star Wars database is not expected to grow beyond the limits of vertical scaling. However, if scaling becomes necessary, options for horizontal scaling and sharding can be explored.

* **Indexes**: Indexes were added to the database, particularly for joins. This will be beneficial as the dataset expands, ensuring better performance for complex queries.

* **Swagger Documentation**: All secured endpoints are hidden in the production Swagger UI to avoid exposing sensitive routes to unauthorized users.

* **Handling New Episodes**: When a new Star Wars episode is released, it will need to be manually added to the database. This can be automated in the future, but currently, it is done manually to ensure control and accuracy.

* **Data Cleanup**: Sample data (e.g., from the YAML configuration) will be removed in production environments, as it's only useful for testing during development.

* **Production Setup**: To ensure smooth production operation, logging and monitoring tools will be implemented for tracking performance and errors. The application will also be optimized for reading (as the data is mostly static with few creates) to minimize the load on the database.

* **Testing Strategy**: To ensure the reliability of the application, I implemented unit and integration tests. These tests help catch any bugs early on and ensure that the system behaves as expected when the application scales or new features are added.

* **Data Modeling**: I carefully structured the data to be normalized, ensuring easy future expansion. For example, I chose PostgreSQL for its strong relational capabilities, allowing me to model complex relationships between characters, planets, and episodes. This relational model will make it easier to scale and maintain data integrity as the database grows.

* **CI/CD Pipeline**: The project utilizes a Continuous Integration (CI) pipeline for automated builds and tests. Implementing Continuous Deployment (CD) in the future will enable seamless and automated releases to production, further improving stability and efficiency.

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

## Author

[Maciej Konieczny](https://github.com/ifmcjthenknczny)
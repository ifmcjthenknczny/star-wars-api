# Star Wars API

This project implements a backend API for managing Star Wars characters. It is built using NestJS, Node.js, and TypeScript, and supports basic CRUD operations. The API is designed to handle data about characters, planets, and episodes, with pagination support to manage large datasets.

## Setup and Installation

1. Make sure you have already:
- Docker and Docker Compose installed on your machine and running.
- Yarn installed on your machine.

2. Clone the Repository:
```bash
git clone https://github.com/ifmcjthenknczny/hotel-reservation-file-process
cd hotel-reservation-file-process
```

3. Build and Start the Containers:
Run the following command in `hotel-reservation-file-process` directory to start the application with required infractructure (MongoDB and Redis) locally in Docker containers:

```bash
docker-compose up --build -d
```

This will build the project and run it in detached mode. It will also implement example data and run the PostgreSQL container. API will be available at `http://localhost:3000`, as PostgreSQL willl be available at port `5432`.

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

## Architectural Decisions

* **REST API**: Chosen for its simplicity in implementing basic CRUD operations. It is widely popular and provides an easy way to leverage NestJS decorators for routing and handling parameters.

* **Database Choice**: PostgreSQL: PostgreSQL was selected over MongoDB due to its complexity, but it provides better scalability for future expansions. The application may eventually include more detailed information about planets and episodes, requiring a normalized database structure. This decision involves creating three tables to properly represent the relationships between the data.

* **Normalized Data**: The database schema is designed with normalization in mind to allow the app to grow in various directions while maintaining consistency and reducing redundancy.

* **Schema vs. MongoDB Flexibility**: While MongoDB is flexible, a schema-based approach was chosen to ensure query results remain consistent and predictable. MongoDB could easily support denormalized data, but future-proofing the app with a schema will better suit the long-term goals of consistency and expandability.

* **Minimized Typo Risk**: The use of table foreign keys reduces the likelihood of typos, especially when adding new content like Star Wars characters. This approach also ensures that changes in data, such as the release of a new episode, won't require code modifications.

* **Additional Database Validation**: Postgres provides validation at the database level and ensures that data integrity is maintained and that only valid data is stored.

* **Inspiration from PokeAPI**: The architectural choices were inspired by solutions from [PokeAPI](https://pokeapi.co/), an API with a similar goal and good documentation.

* **Consistency in Data**: Planets and episodes are not automatically created when adding characters. This decision was made to maintain database consistency and avoid breaking modularity.

* **Unique Planet and Character Names**: Planet and character names are treated as unique in the database. All parts from each Star Wars trilogy were added to ensure comprehensive coverage.

* **User Permissions**: Users are allowed to retrieve data via GET requests but cannot perform POST, PUT, or DELETE operations. These endpoints are protected by an API key to ensure proper authorization and security.

## Ensuring Application Stability in Production
To ensure the application remains performant and stable as it grows, several key considerations have been made for the production environment:

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

This approach ensures that the application will continue to function well as it scales and evolves over time, with a focus on security, maintainability, and performance.\

## Author

[Maciej Konieczny](https://github.com/ifmcjthenknczny)
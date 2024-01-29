# BeMasterVideosAPI - Modular and Scalable Development

![Alt text](/assets/image.png)

# Instructions to Run the Project

To run this project locally, follow these simple steps:

1. **Configuration File (.env):**

   - Add a configuration file named `.env` at the root of the project. You can find an example in the `.env.example` file. Make sure to provide the correct values for the necessary environment variables.

2. **Install Dependencies:**

   - Open a terminal in the project directory and run the following command to install the required dependencies:

     ```bash
     npm install
     ```

3. **Run the Project in Development Mode:**

   - To run the project in development mode, use the following command:

     ```bash
     npm run dev
     ```

4. **Build and Run the Project:**

   - If you prefer to compile the project before running it, use the following commands:

     ```bash
     npm run build
     npm start
     ```

5. **Run Tests:**

   - To execute the project's tests, use the following command:

     ```bash
     npm test
     ```

These steps ensure correct configuration and smooth execution of the project in your local environment. Enjoy exploring the application!

## Project Description

The BeMasterVideosAPI project adopts the innovative hexagonal architecture to provide a modular and highly scalable structure. Its design is divided into three fundamental layers: application, domain, and infrastructure.

## Technologies Used

- **Language:** TypeScript
- **Server:** Node.js with Express
- **Database:** PostgreSQL
- **Testing:** Jest
- **Tools:** Bcrypt, Nodemon, ESLint, Swagger

## Environment Configuration

The project uses environment variables to configure crucial aspects such as the server port, the secret key for JWT tokens, token expiration time, and the PostgreSQL database connection URL.

## Domain Layer

In this layer, fundamental entities of the application are defined, such as User, Video, Comment, and Like. Additionally, interfaces are established to be implemented in the upper layers, ensuring a clear separation of responsibilities.

## Infrastructure Layer

This layer houses use cases and associated validation logic. Use cases, like VideoManagementUseCases, encapsulate business logic and provide simplified interfaces for interacting with entities. Designed to be independent of specific technologies, it allows flexible changes in implementation, whether in the database or server infrastructure.

## Observations

- The domain and application layers are independent of external libraries, facilitating adaptability to different technologies.
- Business logic is maintained in upper layers, allowing modifications without affecting core logic.
- Use cases implement validations, from basic requirements to advanced functions like using regular expressions and UUID generation.

This architectural design provides a clear and modular structure, facilitating system maintenance and evolution.

## REST API Implementation

For this project, a REST API was chosen over GraphQL based on a previous technical test and better support for file uploads. Validations, middlewares, and authentication via JSON Web Tokens (JWT) are included. Routes are divided into public and protected, and API documentation is available in the Swagger interface.

Custom Middleware: Routes include middleware that passes the user ID to the context, ensuring verified operations and secure management.

## Database

### Implementation in the Infrastructure Layer

In this layer, the implementation uses PostgreSQL as a relational database, highlighting:

#### Database Tables

1. **users:** User information, including a password hash.
2. **videos:** Video data, with a privacy indicator.
3. **comments:** Comments associated with videos.
4. **likes:** Record of likes and dislikes, with details about the user and the video.

#### Functions and Triggers

- **check_registered_user():** Ensures only registered users can upload videos.
- **validate_video_privacy():** Validates that private videos are associated with registered users.
- **update_publish_date():** Updates the publication date when modifying video information.
- **to_invert_like():** Function and trigger that allows inverting the "like" state in the likes table.

# Video Upload and Storage

At the core of video management, the domain layer presents an intelligent interface called `FileInterface` designed for video uploads. This approach allows the system to be compatible with various storage providers, such as local servers, Amazon S3, or Google Cloud Storage, thanks to its flexibility and independence from underlying implementation.

## `FileInterface` Interface

```typescript
import { VideoFileInterface } from "../entities/entities";

export interface FileInterface {
  local_save(file: VideoFileInterface, filename: string): Promise<string>;
  server_save(localPath: string, serverPath: string): Promise<boolean>;
}
```

This elegantly simple interface defines two crucial methods: `local_save` for local storage and `server_save` for server storage. The implementation of these methods is adaptable, adjusting to the specific requirements of the system.

## Use Case - Video Upload

The `uploadVideo` method in use cases is the epicenter of video upload logic. Here, various validations are applied before proceeding with storage and database record creation.

```typescript
async uploadVideo(
  userId: string,
  title: string,
  description: string,
  credits: string,
  isPublic: boolean,
  file: VideoFileInterface
): Promise<string | Error> {
  // Title and file validations
  // File extension and size validations

  try {
    const uuid = generateUUID();
    const localPath = await this.fileRepository.local_save(
      file,
      uuid + "." + fileExtension
    );

    // Example of server upload, function with no return
    await this.fileRepository.server_save(
      localPath,
      uuid + "." + fileExtension
    );

    // Logic for inserting the video into the database
    const result = await this.videoRepository.uploadVideo(
      userId,
      title,
      description,
      credits,
      isPublic,
      localPath
    );
    return result;
  } catch (error) {
    return new Error("Error uploading video: " + error.message);
  }
}
```

This method encapsulates the complexity of file storage logic, abstracted from the specific implementation. Changing the file name to a unique UUID ensures uniqueness, and local upload is executed efficiently.

## Local Storage Implementation

The current implementation opts for local storage on the server using Express Upload.

```typescript
import { FileInterface } from "../../domain/interfaces/files";
import * as path from "path";
import { VideoFileInterface } from "../../domain/entities/entities";

export class FileRepository implements FileInterface {
  async local_save(
    file: VideoFileInterface,
    filename: string
  ): Promise<string> {
    const destinationPath = path.join(
      __dirname,
      "../../cloudStorage",
      filename
    );

    await file.mv(destinationPath, (error) => {
      if (error) {
        throw new Error("Failed to upload file");
      }
    });

    return destinationPath;
  }

  async server_save(_localPath: string, _serverPath: string): Promise<boolean> {
    // Server file upload logic (empty in this implementation)

    return true;
  }
}
```

In this specific implementation, the `local_save` function uses the `mv` method of Express Upload to move the file to the designated local destination.

This modular design provides the flexibility needed to change the storage implementation without affecting use case logic, thus simplifying system adaptation to various environments and storage requirements.

# Database Connection Pool Implementation

In the database implementation, the use of a connection pool with Sequelize has been adopted. Additionally, the Singleton pattern has been applied to ensure the same instance of the database server is used in various parts of the application.

## Connection Pool Configuration

```typescript
import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

export const pool = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
```

In this code, a connection pool is configured with the following properties:

- **max:** Maximum number of connections in the pool.
- **min:** Minimum number of connections in the pool.
- **acquire:** Maximum time, in milliseconds, a client should wait to obtain a connection from the pool.
- **idle:** Maximum time, in milliseconds, a connection can be idle in the pool before being released.

## Advantages of Using Connection Pool

### 1. **Reusing Active Connections:**

- The connection pool allows reusing active connections instead of constantly opening and closing connections. This reduces the overhead associated with opening and closing connections, improving performance.

###

2. **Efficient Resource Handling:**

- By maintaining a predefined set of connections in the pool, unnecessary creation of new connections is avoided, helping to efficiently manage server database resources.

### 3. **Concurrency Optimization:**

- By limiting the maximum number of simultaneous connections and setting timeouts, congestion situations are avoided, and concurrency is optimized, especially in environments with multiple concurrent requests.

## Singleton Pattern

The Singleton pattern has been applied in creating the instance of the database server. This ensures that, within the application scope, the same instance of the database is always used, avoiding unnecessary creation of multiple instances.

This approach ensures consistency in database access, maintains centralized control, and facilitates global management of connections in the application.

# User Registration Test Cases - Use Cases

In the hexagonal architecture adopted for the project, testing has been facilitated by conducting tests directly on instances of use cases. This has allowed testing the user registration functionality effectively, using the same database connection pool and generating instances of the necessary interfaces for use case execution.

## Test Descriptions

The tests focus on the `registerUser` use case, which handles the registration of new users in the application. Varied test cases have been designed to ensure robustness and proper validation of data.

### Test Case 1 - Successful Registration

```typescript
it("should register a user when all fields are valid", async () => {
  await expect(
    useCases.registerUser(
      "John",
      "Doe",
      "johndoe123",
      "StrongPass123",
      "john.doe@example.com"
    )
  ).resolves.toBe(true);
});
```

This test case verifies that a user registers successfully when all valid fields are provided.

### Error Test Cases

Multiple error test cases have been designed to validate different error conditions, such as missing fields, incorrect length, invalid characters, weak passwords, and incorrect email addresses.

```typescript
// Examples of error test cases
test("should throw an error when any field is missing", async () => {
  // ... Test code ...
});

test("should throw an error when any field has less than 3 characters", async () => {
  // ... Test code ...
});

test("should throw an error when the password exceeds 15 characters", async () => {
  // ... Test code ...
});

// Other error test cases...
```

These test cases ensure that the system responds appropriately to different incorrect input situations, providing meaningful error messages.

## Advantages of Testing in Hexagonal Architecture

1. **Reuse of Connection Pool:**

   - By conducting tests on instances of use cases that use the same database connection pool, the need to constantly open and close connections is avoided. This improves the efficiency and speed of test execution.

2. **Isolation of Business Logic:**

   - Hexagonal architecture allows isolating business logic in use cases, making it easier to write tests focused on specific functionality without worrying about the underlying implementation.

3. **Flexibility and Maintenance:**

   - The separation of layers allows making changes to the underlying implementation (e.g., the database) without affecting tests or business logic. This improves flexibility and facilitates long-term system maintenance.

The conducted tests demonstrate a robust approach to ensuring the quality and reliability of the user registration functionality in the application.

# User Permissions and Restrictions Control

In this project, a robust system of permissions and restrictions control has been implemented to ensure that users can only perform actions allowed by rules established in the business logic.

## User Restrictions

### Access to Private Videos

When a user marks a video as private, only that specific user has the privilege to view that video. Other users do not have access to videos that have been designated as private.

### Deletion of Comments and Videos

Deletion operations, whether of comments or videos, are restricted so that only the original owners have the right to perform them. For example, a user can only delete their own comments and videos. This approach ensures that critical actions are limited to authorized users, protecting data integrity and the user experience.

#### Observations

- Extensions like "uuid-ossp" are used for UUID generation.
- Functions and triggers implement independent logic, providing the database with the ability to perform specific validations and actions.
- The implementation reflects the logical relationship between entities, ensuring database consistency.

[Additional Links](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/) [GraphQL vs REST](https://blog.logrocket.com/graphql-vs-rest-api-why-you-shouldnt-use-graphql/) [ESLint Documentation](https://eslint.org/docs/latest/rules/)

import { VideoManagementUseCases } from "../application/useCases";
import { pool } from "../infrastructure/postgres/config";
import { PostgresRepository } from "../infrastructure/repositories/postgresRepository";
import { FileRepository } from "../infrastructure/repositories/simulatedServiceCloud";

const postgresRepositoryInstance = new PostgresRepository(pool);
const simulatedServiceCloudInstance = new FileRepository();
const useCases = VideoManagementUseCases.create(
  postgresRepositoryInstance,
  simulatedServiceCloudInstance
);

describe("VideoManagementUseCases - registerUser", () => {
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

  test("should throw an error when any field is missing", async () => {
    await expect(
      useCases.registerUser(
        "",
        "Doe",
        "john_doe",
        "Password123",
        "john.doe@example.com"
      )
    ).rejects.toThrow("All fields are required!");

    await expect(
      useCases.registerUser(
        "John",
        "",
        "john_doe",
        "Password123",
        "john.doe@example.com"
      )
    ).rejects.toThrow("All fields are required!");
  });

  test("should throw an error when any field has less than 3 characters", async () => {
    await expect(
      useCases.registerUser(
        "Jo",
        "Doe",
        "john_doe",
        "Password123",
        "john.doe@example.com"
      )
    ).rejects.toThrow("All fields must have at least 3 characters");

    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "jo",
        "Password123",
        "john.doe@example.com"
      )
    ).rejects.toThrow("All fields must have at least 3 characters");
  });

  test("should throw an error when password exceeds 15 characters", async () => {
    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "john_doe",
        "Password12345678901",
        "john.doe@example.com"
      )
    ).rejects.toThrow("Password cannot exceed 15 characters");
  });

  test("should throw an error when username contains spaces", async () => {
    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "john doe",
        "Password123",
        "john.doe@example.com"
      )
    ).rejects.toThrow("Username cannot contain spaces");
  });

  test("should throw an error when password is not strong enough", async () => {
    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "john_doe",
        "weakpassword",
        "john.doe@example.com"
      )
    ).rejects.toThrow(
      "Password must be 5 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one number"
    );
  });

  test("should throw an error when username is not alphanumeric", async () => {
    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "john_doe!",
        "Password123",
        "john.doe@example.com"
      )
    ).rejects.toThrow("Username must only contain letters and numbers");
  });

  test("should throw an error when email is invalid or exceeds 30 characters", async () => {
    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "john_doe",
        "Password123",
        "invalidemail@example"
      )
    ).rejects.toThrow("Username must only contain letters and numbers");

    await expect(
      useCases.registerUser(
        "John",
        "Doe",
        "john_doe",
        "Password123",
        "john.doe@example.com".repeat(5)
      )
    ).rejects.toThrow("Username must only contain letters and numbers");
  });
});

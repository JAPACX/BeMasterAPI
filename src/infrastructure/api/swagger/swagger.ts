export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reel Master API",
      version: "1.0.0",
      description: "Reel Master API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./src/infrastructure/api/swagger/swaggerDefinitions.ts"],
};

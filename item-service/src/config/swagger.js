import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Laptop Catalog Service API",
      version: "1.0.0",
      description: "Laptop catalog and management service",
      contact: {
        name: "Catalog Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3004",
        description: "Development server",
      },
      {
        url: "http://localhost:3000/v1",
        description: "API Gateway",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        Laptop: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Laptop ID" },
            Brand: { type: "string", description: "Laptop brand" },
            Model: { type: "string", description: "Laptop model" },
            Spec: { type: "string", description: "Key specifications" },
            price: {
              type: "number",
              format: "float",
              description: "Laptop price",
            },
            category: {
              type: "string",
              description: "Laptop category (e.g., Gaming, Ultrabook)",
            },
            description: {
              type: "string",
              description: "Laptop description",
            },
            image_url: {
              type: "string",
              format: "uri",
              description: "Product image URL",
            },
            coverImage: {
              type: "string",
              format: "uri",
              description: "Product image URL (alias)",
            },
          },
        },
        LaptopInput: {
          type: "object",
          required: ["Brand", "Model", "Spec", "price", "category"],
          properties: {
            Brand: { type: "string" },
            Model: { type: "string" },
            Spec: { type: "string" },
            price: { type: "number", format: "float", minimum: 0 },
            category: { type: "string" },
            description: { type: "string" },
            image_url: { type: "string", format: "uri" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

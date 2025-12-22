import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookVerse Book Service API",
      version: "1.0.0",
      description: "Book catalog and management service for BookVerse",
      contact: {
        name: "BookVerse Team",
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
        Book: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Book ID",
            },
            title: {
              type: "string",
              description: "Book title",
            },
            author: {
              type: "string",
              description: "Book author",
            },
            price: {
              type: "number",
              format: "float",
              description: "Book price",
            },
            category: {
              type: "string",
              description: "Book category/genre",
            },
            description: {
              type: "string",
              description: "Book description",
            },
            publication_year: {
              type: "integer",
              description: "Year of publication",
            },
            image_url: {
              type: "string",
              format: "uri",
              description: "Book cover image URL",
            },
            coverImage: {
              type: "string",
              format: "uri",
              description: "Book cover image URL (alias)",
            },
          },
        },
        BookInput: {
          type: "object",
          required: ["title", "author", "price", "category"],
          properties: {
            title: {
              type: "string",
            },
            author: {
              type: "string",
            },
            price: {
              type: "number",
              format: "float",
              minimum: 0,
            },
            category: {
              type: "string",
            },
            description: {
              type: "string",
            },
            publication_year: {
              type: "integer",
            },
            image_url: {
              type: "string",
              format: "uri",
            },
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

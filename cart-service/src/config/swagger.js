import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookVerse Cart Service API",
      version: "1.0.0",
      description: "Shopping cart management service for BookVerse",
      contact: {
        name: "BookVerse Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
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
        serviceToken: {
          type: "apiKey",
          in: "header",
          name: "X-Service-Token",
        },
      },
      schemas: {
        Cart: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Cart ID",
            },
            user: {
              type: "string",
              description: "User ID",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CartItem",
              },
            },
            total: {
              type: "number",
              format: "float",
              description: "Total cart price",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Cart item ID",
            },
            book: {
              type: "object",
              description: "Book details",
              properties: {
                _id: { type: "string" },
                title: { type: "string" },
                author: { type: "string" },
                price: { type: "number" },
                coverImage: { type: "string" },
              },
            },
            quantity: {
              type: "integer",
              minimum: 1,
              description: "Item quantity",
            },
            subtotal: {
              type: "number",
              format: "float",
              description: "Item subtotal",
            },
          },
        },
        AddToCartRequest: {
          type: "object",
          required: ["bookId", "quantity"],
          properties: {
            bookId: {
              type: "string",
              description: "Book ID to add",
            },
            quantity: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
        },
        UpdateCartItemRequest: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: {
              type: "integer",
              minimum: 1,
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
    security: [
      {
        cookieAuth: [],
      },
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookVerse Order Service API",
      version: "1.0.0",
      description: "Order processing and management service for BookVerse",
      contact: {
        name: "BookVerse Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3002",
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
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Order ID",
            },
            userId: {
              type: "string",
              description: "User ID",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            totalPrice: {
              type: "number",
              format: "float",
              description: "Total order price",
            },
            name: {
              type: "string",
              description: "Customer name",
            },
            shippingAddress: {
              type: "string",
              description: "Shipping address",
            },
            orderNote: {
              type: "string",
              description: "Order note",
            },
            status: {
              type: "string",
              enum: ["pending", "success", "fail"],
              description: "Order status",
            },
            payment: {
              type: "object",
              properties: {
                cardNumber: { type: "string" },
                CVV: { type: "string" },
                expiredDate: { type: "string" },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            bookId: {
              type: "string",
              description: "Book ID",
            },
            title: {
              type: "string",
              description: "Book title",
            },
            quantity: {
              type: "integer",
              minimum: 1,
            },
            price: {
              type: "number",
              format: "float",
              description: "Price at time of purchase",
            },
          },
        },
        CreateOrderRequest: {
          type: "object",
          required: [
            "name",
            "shippingAddress",
            "cardNumber",
            "CVV",
            "expiredDate",
          ],
          properties: {
            name: {
              type: "string",
              description: "Customer name",
            },
            shippingAddress: {
              type: "string",
              description: "Shipping address",
            },
            orderNote: {
              type: "string",
              description: "Optional order note",
            },
            cardNumber: {
              type: "string",
              description: "Credit card number",
            },
            CVV: {
              type: "string",
              description: "Card CVV",
            },
            expiredDate: {
              type: "string",
              description: "Card expiration date (MM/YY)",
            },
          },
        },
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["pending", "success", "fail"],
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

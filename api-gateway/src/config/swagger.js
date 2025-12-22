import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LaptopVerse API Gateway",
      version: "2.0.0",
      description:
        "Central API Gateway for microservices - routes requests to Auth, Laptop, Cart, and Order services",
      contact: {
        name: "Catalog Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
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
    },
    tags: [
      {
        name: "Health",
        description: "Health check and service status",
      },
      {
        name: "Auth",
        description: "Authentication endpoints (proxied to Auth Service)",
      },
      {
        name: "Laptops",
        description: "Laptop catalog endpoints (proxied to Laptop Service)",
      },
      {
        name: "Cart",
        description: "Shopping cart endpoints (proxied to Cart Service)",
      },
      {
        name: "Orders",
        description: "Order management endpoints (proxied to Order Service)",
      },
    ],
  },
  apis: ["./src/server.js", "./src/config/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

import swaggerJSDoc from "swagger-jsdoc";
import { API_DOCS_HOST, BASE_PATH_API } from "../../config";

const swaggerDefinition = {
  info: {
    title: "Shopping commerce API Docs",
    version: "1.0.0",
    description: "Shopping commerce API Docs",
  },
  host: API_DOCS_HOST,
  basePath: BASE_PATH_API,
  produces: ["application/json"],
  consumes: ["application/json"],
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
    myCookie: {
      type: "apiKey",
      name: "Cookie",
      in: "header",
    },
  },
  security: [{ jwt: [], myCookie: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    "backend/components/**/*.route.js",
    "backend/components/**/*.docs.js",
    "backend/components/**/*.model.js",
    "backend/api/validatorErrorHandler.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

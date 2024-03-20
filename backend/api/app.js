/* eslint-disable max-len */
/* eslint-disable new-cap */
import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import BasicAuth from "express-basic-auth";
import swaggerUI from "swagger-ui-express";
import compression from "compression";
import bodyParser from "body-parser";
import cloudinary from 'cloudinary';

import routeV1 from "./v1/endpoint";
import redisClient from "../util/Redis";
import swaggerSpecV1 from "./v1/docs";
import ResponseHandler from "../response";
import errorHandler from "./errorHandler";

const app = new express();

import {
  NODE_ENV,
  CORS_OPTIONS,
  MORGAN_FORMAT,
  DEFAULT_LANGUAGE,
  PASSWORD_API_DOCS,
  USERNAME_API_DOCS,
  BASE_PATH_API,
  STATIC_PATH_FOLDER,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET
} from "../config";

app.use(cors(CORS_OPTIONS));

app.use(
  `${BASE_PATH_API + STATIC_PATH_FOLDER}`,
  express.static(path.resolve(__dirname, "../../public/images"))
);

redisClient.connect();

if (["DEVELOPMENT"].indexOf(NODE_ENV) !== -1) {
  app.use(
    morgan(MORGAN_FORMAT, {
      skip: (req, res) => {
        if (req.originalUrl.includes("api-docs")) {
          return true;
        }
        return res.statusCode < 400;
      },
      stream: process.stderr,
    })
  );
  app.use(
    morgan(MORGAN_FORMAT, {
      skip: (req, res) => {
        if (req.originalUrl.includes("api-docs")) {
          return true;
        }
        return res.statusCode >= 400;
      },
      stream: process.stdout,
    })
  );
} else {
  app.use(
    morgan(MORGAN_FORMAT, {
      skip: (req, res) => res.statusCode < 400,
      stream: process.stderr,
    })
  );
  app.use(
    morgan(MORGAN_FORMAT, {
      skip: (req, res) => res.statusCode >= 400,
      stream: process.stdout,
    })
  );
}

app.use(
  "/api-docs",
  BasicAuth({
    users: { [USERNAME_API_DOCS]: PASSWORD_API_DOCS },
    challenge: true,
  }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpecV1, { customSiteTitle: "Shopping Document" })
);

app.use(compression());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: false }));

// Setting up cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept"
  );
  res.RH = new ResponseHandler(res);
  next();
});

app.use((req, res, next) => {
  const language = req.header("Content-Language");
  req.lang = language || DEFAULT_LANGUAGE;
  next();
});

app.use(BASE_PATH_API, routeV1);
app.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "pong",
  });
});

app.use(errorHandler);

export default app;

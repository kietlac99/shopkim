/* eslint-disable max-len */
export const {PORT} = process.env;

export const API_DOCS_HOST = process.env.API_DOCS_HOST || `localhost:${PORT}`;

export const {MONGO_URI} = process.env;

export const {NODE_ENV} = process.env;

export const MORGAN_FORMAT = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

export const {
  SENDER_EMAIL,
  PASSWORD_SENDER_EMAIL,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN
} = process.env;

let serverOrigin = process.env.SERVER_ORIGIN;

try {
  serverOrigin = JSON.parse(serverOrigin);
} catch (e) {
  console.log(`Server Origin is ${serverOrigin}`);
}

export const CORS_OPTIONS = {
  origin: serverOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Accept-Language',
};

export const BASE_PATH_API = '/api/v1';

export const STATIC_PATH_FOLDER = '/public/images';

export const DEFAULT_LANGUAGE = 'vi';

export const {

  // Redis
  REDIS_URL,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,

  // Swagger UI
  USERNAME_API_DOCS,
  PASSWORD_API_DOCS,

  // JWT
  JWT_SECRET,
  JWT_EXPIRES_TIME,
  REDIS_USER_TOKEN_KEY_EXPIRES_TIME,

  // SMTP
  SMTP_HOST,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,

  //CLOUDINARY
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,

  // FRONTEND URL
  FRONTEND_URL,

  FILE_UPLOAD_DESTINATION,

  // STRIPE API
  STRIPE_SECRET_KEY,
  STRIPE_API_KEY
} = process.env;

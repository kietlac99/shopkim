/* eslint-disable max-len */
import http from 'http';
import mongoose from 'mongoose';
import app from './api/app';
import colors from 'colors';

import logger from './api/logger';
// import dummySomeData from './util/seeder';

import {
  PORT,
  NODE_ENV,
  MONGO_URI,
} from './config';

const httpServer = http.createServer(app, (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });
  response.end('Welcome to API Shopping Ecommerce!');
});

mongoose
    .connect(MONGO_URI)
    .then(async () => {
      logger.info('Mongodb connected');
      // if (
      //     process.env.NODE_ENV === 'DEVELOPMENT'
      //     || process.env.NODE_ENV === 'PRODUCTION'
      // ) {
      //     dummySomeData().catch((error) => {
      //         console.error('dummSomeData error');
      //         console.error(error);
      //     });
      // }
    })
    .catch((error) => {
      console.log(error);
      console.log('Please make sure Mongodb is installed and running!');
      process.exit(1);
    });

httpServer.listen(PORT, async (error) => {
  if (error) {
    console.log(`Cannot start server: ${error}`);
  } else {
    console.log(colors.green(`Server started on PORT: ${PORT} in ${NODE_ENV} mode.`));
  }
});

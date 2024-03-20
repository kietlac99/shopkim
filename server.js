require('@babel/register');
require('@babel/polyfill');
const path = require('path');

const dotEnvConfigs = {
    path: path.resolve(process.cwd(), '.env')
};

require('dotenv').config(dotEnvConfigs);

const init = () => {
    if(process.env.NODE_ENV === 'DEVELOPMENT'
    || process.env.NODE_ENV === 'PRODUCTION') {
        require('./init');
    }
};

init();
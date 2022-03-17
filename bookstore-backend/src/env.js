require('dotenv').config({
    path: 'config/dev.env',
});

const env = {
    GRAPHQL_PORT: process.env.GRAPHQL_PORT,
    PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT,
    PRISMA_SECRET: process.env.PRISMA_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    CLIENT_HOST: process.env.CLIENT_HOST,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
    HOST_NAME: process.env.HOST_NAME,
    HOST_NAME_IMG: process.env.HOST_NAME_IMG,
};

export default env;

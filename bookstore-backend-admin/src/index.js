import { GraphQLServer } from 'graphql-yoga';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers/index';
import env from './env';
import sgMailer from "@sendgrid/mail";
import mySqlConnection from './DB/DBContext';

sgMailer.setApiKey(env.SENDGRID_API_KEY);

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(httpContext) {
        return {
            prisma,
            httpContext,
            env,
            mySqlConnection,
            sgMailer
        }
    },
    fragmentReplacements
});

server.start({
    port: env.GRAPHQL_PORT
}, () => console.log(`Running on port ${env.GRAPHQL_PORT}`));
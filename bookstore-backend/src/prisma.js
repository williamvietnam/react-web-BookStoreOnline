import {Prisma} from 'prisma-binding';
import { fragmentReplacements } from './resolvers';
import env from './env';

const prisma = new Prisma({
    typeDefs: './src/generated/prisma.graphql',
    endpoint: env.PRISMA_ENDPOINT,
    secret: env.PRISMA_SECRET,
    fragmentReplacements
})

export default prisma;
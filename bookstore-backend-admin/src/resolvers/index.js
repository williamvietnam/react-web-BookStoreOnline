import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import User from './User';
import {extractFragmentReplacements} from 'prisma-binding';

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User
}

const fragmentReplacements = extractFragmentReplacements(resolvers);

export {resolvers,fragmentReplacements};
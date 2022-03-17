const Subscription = {
    bookReview: {
        subscribe(parent, { where }, { prisma }, info){
            return prisma.subscription.bookReview({
                where
            }, info);
        }
    }
}

export default Subscription;
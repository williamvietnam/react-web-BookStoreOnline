import getUserId from '../utils/getUserId';
import checkAdmin, { getUserRole } from '../utils/adminAuth';
import prisma from '../prisma';

const Query = {
    async getBooks(parent, args, { prisma }, info) {
        let opArgs = {}
        const { where, orderBy, first, skip, selection } = args;
        opArgs.where = where;
        opArgs.orderBy = orderBy;
        opArgs.first = first;
        opArgs.skip = skip;
        const books = await prisma.query.books(opArgs, selection);
        const count = await prisma.query.booksConnection({ where }, `{aggregate {count}}`);
        const totalCount = count.aggregate.count;
        return {
            books,
            totalCount
        }
    },
    async getBook(parent, { id }, { prisma }, info) {
        const book = await prisma.query.book({
            where: {
                id
            }
        }, info);
        return book;
    },
    async getCategories(parent, args, { prisma }, info) {
        const { where, orderBy, first, skip } = args;
        const categories = await prisma.query.bookCategories({
            where,
            orderBy,
            first,
            skip
        }, info);
        return categories;
    },
    async getCategoriesPaging(parent, args, { prisma }, info) {
        const { where, orderBy, first, skip } = args;
        const categories = await prisma.query.bookCategories({
            where,
            orderBy,
            first,
            skip
        }, `{id name createdAt updatedAt}`);
        const count = await prisma.query.bookCategoriesConnection({ where }, `{aggregate {count}}`);
        return {
            categories,
            totalCount: count.aggregate.count
        }
    },
    async getCategory(parent, { id }, { prisma, info }) {
        return prisma.query.bookCategory({
            where: {
                id
            }
        }, info);
    },
    async getAuthors(parent, args, { prisma }, info) {
        const { where, orderBy, first, skip } = args;
        const opArgs = {
            where,
            orderBy,
            first,
            skip
        }
        return prisma.query.authors(opArgs, info);
    },
    async getAuthorsPaging(parent, args, { prisma }, info) {
        const { where, orderBy, first, skip } = args;
        const opArgs = {
            where,
            orderBy,
            first,
            skip
        }
        const totalCount = await prisma.query.authorsConnection({
            where
        }, `{aggregate{count}}`);
        const authors = await prisma.query.authors(opArgs);
        return {
            authors,
            totalCount: totalCount.aggregate.count
        }
    },
    async getAuthor(parent, { id }, { prisma }, info) {
        return prisma.query.author({
            where: {
                id
            }
        }, info);
    },
    async getCollections(parent, args, { prisma }, info) {
        const { name, orderBy, first, skip } = args;
        const opArgs = {
            orderBy,
            first,
            skip
        }
        if (name) {
            opArgs.where = {
                name_contains: name
            }
        }
        const totalCount = await prisma.query.collectionsConnection({
            where: {
                name_contains: name
            }
        }, `{aggregate{count}}`);
        const collections = await prisma.query.collections(opArgs);
        return {
            collections,
            totalCount: totalCount.aggregate.count
        }
    },
    async getCollection(parent, { id }, { prisma }, info) {
        return prisma.query.collection({
            where: {
                id
            }
        }, info);
    },
    async getBookReviewsByBook(parent, { bookId, orderBy, first, skip }, { prisma }, info) {
        const bookReviews = await prisma.query.bookReviews({
            where: {
                book: {
                    id: bookId
                }
            },
            orderBy,
            first,
            skip
        }, `{id reviewHeader reviewText rating createdAt updatedAt author{id username avatar} replies(orderBy: updatedAt_ASC){id text author{id fullName username avatar} updatedAt}}`);
        const totalCount = await prisma.query.bookReviewsConnection({
            where: {
                book: {
                    id: bookId
                }
            }
        }, `{aggregate {count}}`);
        const fiveStar = await prisma.query.bookReviewsConnection({ where: { rating: 5, book: { id: bookId } } }, `{aggregate {count}}`);
        const fourStar = await prisma.query.bookReviewsConnection({ where: { rating: 4, book: { id: bookId } } }, `{aggregate {count}}`);
        const threeStar = await prisma.query.bookReviewsConnection({ where: { rating: 3, book: { id: bookId } } }, `{aggregate {count}}`);
        const twoStar = await prisma.query.bookReviewsConnection({ where: { rating: 2, book: { id: bookId } } }, `{aggregate {count}}`);
        const oneStar = await prisma.query.bookReviewsConnection({ where: { rating: 1, book: { id: bookId } } }, `{aggregate {count}}`);
        return {
            bookReviews,
            totalCount: totalCount.aggregate.count,
            fiveStar: fiveStar.aggregate.count,
            fourStar: fourStar.aggregate.count,
            threeStar: threeStar.aggregate.count,
            twoStar: twoStar.aggregate.count,
            oneStar: oneStar.aggregate.count
        }
    },
    async getBookReviews(parent, { where, orderBy, first, skip }, { prisma }, info) {
        const bookReviews = await prisma.query.bookReviews({
            where,
            orderBy,
            first,
            skip
        }, `{id reviewHeader reviewText rating createdAt updatedAt book{id title thumbnail} author{id username avatar} replies(orderBy: updatedAt_ASC){id text author{id fullName username avatar} updatedAt}}`);
        const totalCount = await prisma.query.bookReviewsConnection({
            where
        }, `{aggregate {count}}`);
        return {
            bookReviews,
            totalCount: totalCount.aggregate.count,
        }
    },
    async getUserAddresses(parent, args, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        return prisma.query.userAddresses({
            where: {
                user: {
                    id: userId
                }
            }
        }, info);
    },
    async getUserAddressesAdmin(parent, {where,orderBy,skip,first, selection}, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId,prisma);
        if (userRole!=="Admin") throw new Error("Unauthorized");
        const addresses =  prisma.query.userAddresses({
            where,
            orderBy,
            skip,
            first
        }, selection);
        const totalCount = await prisma.query.userAddressesConnection({
            where
        }, `{aggregate{count}}`);
        return {
            addresses,
            totalCount: totalCount.aggregate.count
        }
    },
    async getPublishers(parent, { where, orderBy, first, skip }, { prisma }, info) {
        return prisma.query.publishers({
            where,
            orderBy,
            first,
            skip
        }, info);
    },
    async getPublisher(parent, { id }, { prisma }, info) {
        return prisma.query.publisher({
            where: {
                id
            }
        }, info);
    },
    async getPublishersPaging(parent, { where, orderBy, first, skip }, { prisma,httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId,prisma);
        if (userRole!=="Admin") throw new Error("Unauthorized");
        const publishers = await prisma.query.publishers({
            where,
            orderBy,
            first,
            skip
        });
        console.log(JSON.stringify(publishers))
        const totalCount = await prisma.query.publishersConnection({
            where
        }, `{aggregate{count}}`);
        return {
            publishers,
            totalCount: totalCount.aggregate.count
        }
    },
    async getItemStockQty(parent, { id }, { prisma }, info) {
        const book = await prisma.query.book({
            where: {
                id
            }
        }, `{availableCopies}`);
        return {
            qty: book.availableCopies,
            id
        };
    },
    async getProvinces(parent, args, { prisma }, info) {
        return prisma.query.provinces(undefined, info);
    },
    async getDistricts(parent, { provinceId }, { prisma }, info) {
        return prisma.query.districts({
            where: {
                province: {
                    id: provinceId
                }
            }
        }, info);
    },
    async getWards(parent, { districtId }, { prisma }, info) {
        return prisma.query.wards({
            where: {
                district: {
                    id: districtId
                }
            }
        }, info);
    },
    async getOrders(parent, { where, orderBy, first, skip, selection }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole === "User") {
            const orders = await prisma.query.orders({
                where: where ? {
                    ...where,
                    customer: {
                        id: userId
                    }
                } : {
                        customer: {
                            id: userId
                        }
                    },
                orderBy,
                first,
                skip
            }, selection);
            const totalCount = await prisma.query.ordersConnection({
                where: where ? {
                    ...where,
                    customer: {
                        id: userId
                    }
                } : {
                        customer: {
                            id: userId
                        }
                    }
            }, `{aggregate{count}}`);
            return {
                orders,
                totalCount: totalCount.aggregate.count
            }
        } else {
            const orders = await prisma.query.orders({
                where,
                orderBy,
                first,
                skip
            }, selection);
            const totalCount = await prisma.query.ordersConnection({
                where
            }, `{aggregate{count}}`);
            return {
                orders,
                totalCount: totalCount.aggregate.count
            }
        }
    },
    async getOrderById(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const role = await getUserRole(userId, prisma);
        if (role === "User") {
            const orders = await prisma.query.orders({
                where: {
                    id,
                    customer: {
                        id: userId
                    }
                },
            }, info);
            if (orders.length === 0) {
                throw new Error("Đơn hàng không tồn tại.");
            }
            return orders[0];
        } else if (role === "Admin") {
            return prisma.query.order({
                where: {
                    id
                },
            }, info);
        } else {
            throw new Error("Bạn không có quyền xem đơn hàng này.")
        }
    },
    async getReviewRepliesByReview(parent, { reviewId }, { prisma }, info) {
        return prisma.query.bookReviewReplies({
            where: {
                bookReview: {
                    id: reviewId
                }
            }
        }, info);
    },
    async getWishList(parent, args, { prisma, httpContext, info }) {
        const userId = getUserId(httpContext);
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        }, `{id wishList{id title thumbnail reviews{id rating}}}`);
        return {
            statusCode: 200,
            message: "Đã bỏ khỏi danh sách ưa thích",
            data: {
                books: user.wishList
            }
        }
    },
    async getBestSeller(parent, { first, skip, dateFrom, dateTo }, { mySqlConnection }, info) {
        let books = [];
        let totalCount = 0;
        const getBooks = () => new Promise((res, rej) => {
            mySqlConnection.query(`
            CALL Proc_GetBestSeller(${skip},${first}, ${dateFrom ? `'${dateFrom}'` : 'null'}, ${dateTo ? `'${dateTo}'` : 'null'} );
            `, (err, res0, fields) => {
                if (err) {
                    console.log(err);
                    rej(err);
                }
                books = res0[0];
                mySqlConnection.query(`
                CALL Proc_CountBestSeller(${dateFrom ? `'${dateFrom}'` : 'null'}, ${dateTo ? `'${dateTo}'` : 'null'});
                `, (err, res1, fields) => {
                    if (err) {
                        console.log(err);
                        rej(err);
                    }
                    totalCount = res1[0][0].totalCount;
                    res({
                        books,
                        totalCount
                    });
                });
            });

        });
        try {
            const result = await getBooks();
            if (result.books && result.books.length > 0) {
                const books1 = await prisma.query.books({
                    where: {
                        id_in: result.books.map(item => item.id)
                    }
                }, `{
                    id
                    title
                    basePrice
                    description
                    thumbnail
                    images
                    dimensions
                    translator
                    format
                    isbn
                    sku
                    publishedDate
                    availableCopies
                    pages
                    discounts{
                      id
                      from
                      to
                      discountRate
                    }
                    publisher{
                      id
                      name
                    }
                    authors{
                      id
                      pseudonym
                    }
                    categories{
                      id
                      name
                    }
                  }`)
                return {
                    books: books1,
                    totalCount
                }
            }
            throw new Error();
        } catch (ex) {
            return {
                books: [],
                totalCount: 0
            }
        }
    },
    async getBestSellerList(parent, { first, skip, dateFrom, dateTo }, { mySqlConnection }, info) {
        let books = [];
        let totalCount = 0;
        const getBooks = () => new Promise((res, rej) => {
            mySqlConnection.query(`
            CALL Proc_GetBestSeller(${skip},${first}, ${dateFrom ? `'${dateFrom}'` : 'null'}, ${dateTo ? `'${dateTo}'` : 'null'} );
            `, (err, res0, fields) => {
                if (err) {
                    console.log(err);
                    rej(err);
                }
                books = res0[0];
                mySqlConnection.query(`
                CALL Proc_CountBestSeller(${dateFrom ? `'${dateFrom}'` : 'null'}, ${dateTo ? `'${dateTo}'` : 'null'});
                `, (err, res1, fields) => {
                    if (err) {
                        console.log(err);
                        rej(err);
                    }
                    totalCount = res1[0][0].totalCount;
                    res({
                        books,
                        totalCount
                    });
                });
            });

        });
        try {
            const result = await getBooks();
            if (result.books && result.books.length > 0) {
                const books1 = await prisma.query.books({
                    where: {
                        id_in: result.books.map(item => item.id)
                    }
                });
                return {
                    entities: books1.map(b => {
                        const book = result.books.find(book => book.id === b.id);
                        return {
                            id: b.id,
                            title: b.title,
                            sku: b.sku,
                            totalPrice: book ? book.totalPrice : 0,
                            totalQuantity: book ? book.sum : 0
                        }
                    }),
                    totalCount
                }
            }
            throw new Error();
        } catch (ex) {
            return {
                entities: [],
                totalCount: 0
            }
        }
    },
    async getUsers(parent, { where, orderBy, first, skip, selection }, { httpContext, prisma }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole !== "Admin") {
            return {
                users: [],
                totalCount: 0
            }
        } else {
            const users = await prisma.query.users({
                where,
                orderBy,
                first,
                skip
            }, selection);
            console.log(users)
            const count = await prisma.query.usersConnection({ where }, `{aggregate{count}}`);
            return {
                users,
                totalCount: count.aggregate.count
            }
        }
    },
    async getUserById(parent, { id }, { httpContext, prisma }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole !== "Admin") {
            return {
            }
        } else {
            const user = await prisma.query.user({
                where: {
                    id
                }
            },info);
            return user
        }
    },
    async getCommonStatistics(parent, args, { httpContext, prisma }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole !== "Admin" && userRole !== "Staff") {
            return {
                customers: 0,
                income: 0,
                orders: 0,
                lowStocks: 0
            }
        } else {
            const customers = await prisma.query.usersConnection({ where: { role: "User" } }, `{aggregate{count}}`);
            const orders = await prisma.query.orders(undefined);
            let income = 0;
            if (orders.length === 1) {
                income = orders[0].grandTotal
            } else if (orders.length > 1) {
                for (let o of orders) {
                    income += o.orderStatus === "Completed" ? o.grandTotal : 0;
                }
            }
            const lowStocks = await prisma.query.booksConnection({ where: { availableCopies_lte: 20 } }, `{aggregate{count}}`);
            return {
                customers: customers.aggregate.count,
                orders: orders.length,
                income,
                lowStocks: lowStocks.aggregate.count
            }
        }
    },
    async getDiscounts(parent, args, { prisma }, info) {
        const { where, orderBy, first, skip } = args;
        const opArgs = {
            where,
            orderBy,
            first,
            skip
        }
        const totalCount = await prisma.query.discountsConnection({
            where
        }, `{aggregate{count}}`);
        const discounts = await prisma.query.discounts(opArgs);
        return {
            discounts,
            totalCount: totalCount.aggregate.count
        }
    },
    async getDiscountById(parent, { id }, { prisma }, info) {
        return prisma.query.discount({
            where: {
                id
            }
        }, info);
    }
}

export default Query;
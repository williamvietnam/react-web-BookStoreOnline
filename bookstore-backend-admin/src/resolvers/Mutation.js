import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import checkAdmin, { getUserRole } from '../utils/adminAuth';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import emailTemplate from '../sendgrid/emailTemplate';

const Mutation = {
    async createUserAdmin(parent, { data }, { prisma, env, sgMailer,httpContext }, info) {
        const userId = getUserId(httpContext);
        const role = await getUserRole(userId,prisma);
        if (role!=="Admin"){
            throw new Error("Unauthorize");
        }

        const hashed = await bcrypt.hash(data.password, 10);
        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                receiveEmailNotification: false,
                isActive: data.isActive?true:false,
                password: hashed
            }
        });
        return user;
    },
    async login(parent, { data }, { prisma, env }, info) {
        const { email, password } = data;
        const users = await prisma.query.users({
            where: {
                OR: [{
                    email
                }, {
                    username: email
                }]
            }
        });
        if (!users.length) {
            return {
                statusCode: 400,
                message: "Sai tên đăng nhập hoặc mật khẩu"
            }
        }
        const user = users[0];
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return {
                statusCode: 400,
                message: "Sai tên đăng nhập hoặc mật khẩu"
            }
        }
        if (user.role !== "Admin") {
            return {
                statusCode: 400,
                message: "Sai tên đăng nhập hoặc mật khẩu"
            }
        }
        if (!user.isActive) {
            return {
                statusCode: 405,
                message: "Tài khoản chưa được kích hoạt",
                user
            }
        }
        return {
            statusCode: 200,
            message: "OK",
            user,
            token: jwt.sign({
                userId: user.id,
            }, env.JWT_SECRET, {
                expiresIn: '2 days'
            })
        }
    },
    async updateUser(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        });
        if (!user) throw new Error('User not existed!');
        if (data.changePassword) {
            const currentPasswordMatched = await bcrypt.compare(data.currentPassword, user.password);
            if (!currentPasswordMatched) throw new Error('Password hiện tại không đúng.');
        }
        const dataToChange = {
            fullName: data.fullName,
            gender: data.gender,
            phone: data.phone,
            birthdate: data.birthdate
        }
        if (data.changePassword) {
            if (!data.password || data.password.length < 8) throw new Error('Password length is invalid');
            dataToChange.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: {
                ...dataToChange
            }
        }, info);
    },
    async updateUserAdmin(parent, { id, data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }
        const user = await prisma.query.user({
            where: {
                id
            }
        });
        if (!user) throw new Error('User not existed!');
        const dataToChange = {
            fullName: data.fullName,
            gender: data.gender,
            phone: data.phone,
            birthdate: data.birthdate,
            isActive: data.isActive,
            email: data.email,
            role: data.role
        }
        if (data.changePassword) {
            if (!data.password || data.password.length < 8) throw new Error('Password length is invalid');
            dataToChange.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.mutation.updateUser({
            where: {
                id
            },
            data: {
                ...dataToChange
            }
        }, info);
    },
    async updateBook(parent, { id, data }, { prisma, httpContext, env }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        const bookExists = await prisma.exists.Book({
            id
        });
        if (!bookExists) {
            throw new Error("Book not found");
        }
        const opArgs = {
            where: {
                id
            },
            data: {
                ...data,
            }
        }
        if (data.categories) {
            const categories = data.categories.map(item => ({
                id: item
            }));
            opArgs.data.categories = {
                set: categories
            }
        }
        if (data.authors) {
            const authors = data.authors.map(item => ({
                id: item
            }));
            opArgs.data.authors = {
                set: authors
            }
        }
        if (data.publisher) {
            const publisher = {
                connect: {
                    id: data.publisher
                }
            }
            opArgs.data.publisher = publisher;
        }
        return prisma.mutation.updateBook(opArgs, info);
    },
    async createBook(parent, { data }, { prisma, httpContext, env }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        const idsCategories = data.categories.map(item => ({
            id: item
        }));

        const idsAuthors = data.authors.map(item => ({
            id: item
        }));

        return prisma.mutation.createBook({
            data: {
                ...data,
                categories: {
                    connect: idsCategories
                },
                authors: {
                    connect: idsAuthors
                },
                publisher: {
                    connect: {
                        id: data.publisher
                    }
                }
            }
        }, info);
    },
    async createCollection(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.createCollection({
            data
        }, info)
    },
    async updateCollection(parent, { data, id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.updateCollection({
            where: {
                id
            },
            data
        }, info)
    },
    async createUserAddress(parent, { data, user }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole !== "Admin") throw new Error("Unauthorized");
        return prisma.mutation.createUserAddress({
            data: {
                ...data,
                province: {
                    connect: {
                        id: data.province
                    }
                },
                district: {
                    connect: {
                        id: data.district
                    }
                },
                ward: {
                    connect: {
                        id: data.ward
                    }
                },
                user: {
                    connect: {
                        id: user
                    }
                }
            }
        }, info);
    },
    async updateUserAddress(parent, { data, id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole === "User") {
            const addressExisted = await prisma.exists.UserAddress({
                user: {
                    id: userId
                },
                id
            })
            if (!addressExisted) throw new Error('Address not existed!');
            return prisma.mutation.updateUserAddress({
                where: {
                    id
                },
                data: {
                    ...data,
                    ward: {
                        connect: {
                            id: data.ward
                        }
                    },
                    district: {
                        connect: {
                            id: data.district
                        }
                    },
                    province: {
                        connect: {
                            id: data.province
                        }
                    }
                }
            }, info);
        } else if (userRole === "Admin") {
            const addressExisted = await prisma.exists.UserAddress({
                id
            })
            if (!addressExisted) throw new Error('Address not existed!');
            return prisma.mutation.updateUserAddress({
                where: {
                    id
                },
                data: {
                    ...data,
                    ward: {
                        connect: {
                            id: data.ward
                        }
                    },
                    district: {
                        connect: {
                            id: data.district
                        }
                    },
                    province: {
                        connect: {
                            id: data.province
                        }
                    }
                }
            }, info);
        }
    },
    async deleteUserAddress(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);
        if (userRole === "User") {
            const addressExisted = await prisma.exists.UserAddress({
                user: {
                    id: userId
                },
                id
            });
            if (!addressExisted) throw new Error('Address not existed!');
            return prisma.mutation.deleteUserAddress({
                where: {
                    id
                }
            }, info);
        } else if (userRole === "Admin") {
            const addressExisted = await prisma.exists.UserAddress({
                id
            });
            if (!addressExisted) throw new Error('Address not existed!');
            return prisma.mutation.deleteUserAddress({
                where: {
                    id
                }
            }, info);
        }
    },
    async createBookCategory(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.createBookCategory({
            data
        }, info)
    },
    async updateBookCategory(parent, { data, id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.updateBookCategory({
            where: {
                id
            },
            data
        }, info)
    },
    async createPublisher(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.createPublisher({
            data
        }, info)
    },
    async updatePublisher(parent, { data, id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.updatePublisher({
            where: {
                id
            },
            data
        }, info)
    },
    async createAuthor(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.createAuthor({
            data
        }, info)
    },
    async updateAuthor(parent, { data, id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.updateAuthor({
            where: {
                id
            },
            data
        }, info)
    },
    async deleteAuthors(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.deleteManyAuthors({
            where: {
                id_in: id
            }
        }, info)
    },
    async deleteAuthor(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        checkAdmin(userId, prisma);
        return prisma.mutation.deleteAuthor({
            where: {
                id
            }
        }, info)
    },
    async createBookReview(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        if (data.rating > 5 || data.rating <= 0) {
            throw new Error("Rating score is invalid");
        }
        return prisma.mutation.createBookReview({
            data: {
                ...data,
                book: {
                    connect: {
                        id: data.book
                    }
                },
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info);
    },
    async createOrder(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        if (data.items.length === 0) throw new Error("Đơn hàng không có sản phẩm.")
        const orderItems = await prisma.query.books({
            where: {
                id_in: data.items.map(item => item.book)
            }
        }, `{id basePrice discounts{id discountRate from to}}`);
        let subTotal = 0;
        let orderItemsInOrder = []
        for (let i = 0; i < orderItems.length; i++) {
            if (orderItems[i].availableCopies < data.items[i].quantity) {
                throw new Error("Không đủ hàng trong kho, vui lòng liên hệ người quản trị để biết thêm chi tiết");
            } else {
                let orderItemPrice = orderItems[i].basePrice;
                for (let discount of orderItems[i].discounts) {
                    if (moment(discount.from).isBefore(moment()) && moment(discount.to).isAfter(moment())) {
                        if (discount.usePercentage) {
                            orderItemPrice = (orderItemPrice - (orderItemPrice * discount.discountRate) * data.items[i].quantity)
                        } else {
                            orderItemPrice = (orderItemPrice - discount.discountAmount * data.items[i].quantity)
                        }
                    }
                }
                subTotal += orderItemPrice;
                orderItemsInOrder.push({
                    item: {
                        connect: {
                            id: data.items[i].book
                        }
                    },
                    price: orderItemPrice,
                    quantity: data.items[i].quantity
                })
            }
        }
        let grandTotal = subTotal;
        const shippingAddress = await prisma.query.userAddress({
            where: {
                id: data.shippingAddress
            }
        }, `{id fullName phone address ward{id} district{id} province{id}}`);
        console.log(shippingAddress)
        return prisma.mutation.createOrder({
            data: {
                items: {
                    create: orderItemsInOrder
                },
                orderStatus: "Ordered",
                paymentStatus: false,
                shippingMethod: {
                    connect: {
                        id: data.shippingMethod
                    }
                },
                paymentMethod: {
                    connect: {
                        id: data.paymentMethod
                    }
                },
                recipientWard: {
                    connect: {
                        id: shippingAddress.ward.id
                    }
                },
                recipientDistrict: {
                    connect: {
                        id: shippingAddress.district.id
                    }
                },
                recipientProvince: {
                    connect: {
                        id: shippingAddress.province.id
                    }
                },
                recipientFullName: shippingAddress.fullName,
                recipientPhone: shippingAddress.phone,
                recipientAddress: shippingAddress.address,
                customer: {
                    connect: {
                        id: userId
                    }
                },
                grandTotal,
                subTotal
            }
        });
    },
    async updateOrderStatus(parent, { orderId, orderStatus }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const role = await getUserRole(userId, prisma);
        if (role === "User") {
            const orders = await prisma.query.orders({
                where: {
                    customer: {
                        id: userId
                    },
                    id: orderId
                }
            });
            if (orders.length === 0) {
                throw new Error("Không tìm thấy đơn hàng.");
            }
            return prisma.mutation.updateOrder({
                where: {
                    id: orderId,
                },
                data: {
                    orderStatus,
                    orderSteps: {
                        create: [{
                            orderStatus
                        }]
                    }
                }
            }, info);
        } else if (role === "Admin") {
            return prisma.mutation.updateOrder({
                where: {
                    id: orderId,
                },
                data: {
                    orderStatus,
                    orderSteps: {
                        create: [{
                            orderStatus
                        }]
                    }
                },
            }, info);
        }
        throw new Error("Không tìm thấy đơn hàng hoặc bạn không có quyền.");
    },
    async updatePaymentStatus(parent, { orderId, paymentStatus }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const role = await getUserRole(userId, prisma);
        if (role === "User") {
            const orders = await prisma.query.orders({
                where: {
                    customer: {
                        id: userId
                    },
                    id: orderId
                }
            });
            if (orders.length === 0) {
                throw new Error("Không tìm thấy đơn hàng.");
            }
            return prisma.mutation.updateOrder({
                where: {
                    id: orderId,
                },
                data: {
                    paymentStatus
                }
            }, info);
        } else if (role === "Admin") {
            return prisma.mutation.updateOrder({
                where: {
                    id: orderId,
                },
                data: {
                    paymentStatus
                }
            }, info);
        }
        throw new Error("Không tìm thấy đơn hàng hoặc bạn không có quyền.");
    },
    async updateOrderAddress(parent, { orderId, data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const role = await getUserRole(userId, prisma);
        if (role === "Admin") {
            return prisma.mutation.updateOrder({
                where: {
                    id: orderId,
                },
                data: {
                    ...data,
                    recipientProvince: {
                        connect: {
                            id: data.recipientProvince
                        }
                    },
                    recipientDistrict: {
                        connect: {
                            id: data.recipientDistrict
                        }
                    },
                    recipientWard: {
                        connect: {
                            id: data.recipientWard
                        }
                    }
                }
            }, info);
        }
        throw new Error("Không tìm thấy đơn hàng hoặc bạn không có quyền.");
    },
    async createReviewReply(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const { text, book, bookReview } = data;
        return prisma.mutation.createBookReviewReply({
            data: {
                text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                book: {
                    connect: {
                        id: book
                    }
                },
                bookReview: {
                    connect: {
                        id: bookReview
                    }
                }
            }
        }, info);
    },
    async addBookToWishList(parent, { bookId }, { prisma, httpContext, info }) {
        const userId = getUserId(httpContext);
        const bookExists = prisma.exists.Book({
            id: bookId
        });
        if (!bookExists) {
            return {
                statusCode: 400,
                message: "Sách không tồn tại",
            }
        }
        await prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: {
                wishList: {
                    connect: [
                        {
                            id: bookId
                        }
                    ]
                }
            }
        });
        return {
            statusCode: 200,
            message: "Đã thêm vào danh sách ưa thích"
        }
    },
    async removeBookFromWishList(parent, { bookId }, { prisma, httpContext, info }) {
        const userId = getUserId(httpContext);
        const bookExists = prisma.exists.Book({
            id: bookId
        });
        if (!bookExists) {
            return {
                statusCode: 400,
                message: "Sách không tồn tại",
            }
        }
        await prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: {
                wishList: {
                    disconnect: [
                        {
                            id: bookId
                        }
                    ]
                }
            }
        });
        return {
            statusCode: 200,
            message: "Đã bỏ khỏi danh sách ưa thích"
        }
    },
    async createPasswordToken(parent, { email }, { prisma, sgMailer, env }, info) {
        const user = await prisma.query.user({
            where: {
                email
            }
        });
        if (!user) {
            return {
                statusCode: 400,
                message: "Tài khoản không tồn tại"
            }
        }
        const token = uuidv4();
        const authToken = await prisma.mutation.createAuthToken({
            data: {
                token,
                expiredAfter: 10800000,
                type: "PasswordToken",
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        await sgMailer.send({
            from: {
                email: "noreply@bookstore.vn",
                name: "Bookstore"
            },
            to: email,
            html: emailTemplate.resetPassword(`${env.CLIENT_HOST}/reset-password/${token}`),
            subject: "[Bookstore] Lấy lại mật khẩu",
        });
        return {
            statusCode: 200,
            message: "OK"
        }
    },
    async resetPassword(parent, { passwordToken, password }, { prisma }, info) {
        const authToken = await prisma.query.authToken({
            where: {
                token: passwordToken
            }
        }, `{id token expiredAfter type createdAt user{id}}`);
        if (!authToken) {
            return {
                statusCode: 400,
                message: "Token không hợp lệ"
            }
        }
        if (moment(authToken.createdAt).add(authToken.expiredAfter, 'milliseconds').isBefore(moment())) {
            return {
                statusCode: 400,
                message: "Token đã hết hạn"
            }
        }
        await prisma.mutation.updateUser({
            where: {
                id: authToken.user.id
            },
            data: {
                password: await bcrypt.hash(password, 10)
            }
        });
        return {
            statusCode: 200,
            message: "Đổi mật khẩu thành công"
        }
    },
    async deleteBooks(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.deleteManyBooks({
            where: {
                id_in: id
            }
        });
    },
    async deleteCategories(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.deleteManyBookCategories({
            where: {
                id_in: id
            }
        });
    },
    async deleteReviews(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.deleteManyBookReviews({
            where: {
                id_in: id
            }
        });
    },
    async deleteCollections(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.deleteManyCollections({
            where: {
                id_in: id
            }
        });
    },
    async createDiscount(parent, { data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.createDiscount({
            data: {
                ...data,
                from: new Date(data.from),
                to: new Date(data.to),
            }
        });
    },
    async updateDiscount(parent, { id, data }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.updateDiscount({
            where: {
                id
            },
            data: {
                ...data,
                from: data.from?new Date(data.from):undefined,
                to: data.to?new Date(data.to):undefined,
            }
        });
    },
    async deleteDiscounts(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.deleteManyDiscounts({
            where: {
                id_in: id
            }
        });
    },
    async deletePublishers(parent, { id }, { prisma, httpContext }, info) {
        const userId = getUserId(httpContext);
        const userRole = await getUserRole(userId, prisma);

        if (userRole !== "Admin") {
            throw new Error("Unauthorized");
        }

        return prisma.mutation.deleteManyPublishers({
            where: {
                id_in: id
            }
        });
    },
}

export default Mutation;

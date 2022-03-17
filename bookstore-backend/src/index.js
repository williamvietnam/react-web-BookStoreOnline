import { GraphQLServer } from 'graphql-yoga';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers/index';
import env from './env';
import sgMailer from "@sendgrid/mail";
import mySqlConnection from './DB/DBContext';
import jwt from 'jsonwebtoken';

sgMailer.setApiKey(env.SENDGRID_API_KEY);

// mySqlConnection.query(`
//  call Proc_GetBestSeller(0,3,null,null);
// `, (err,res,fields)=>{
//     if (err){
//         console.log(err);
//         throw err;
//     }
//     console.log(res[0].length)
// });

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

server.get('/account-activation/:activationToken', async (req, res) => {
    const activationToken = req.params.activationToken;
    const authToken = await prisma.query.authToken({
        where: {
            token: activationToken
        }
    }, `{id token expiredAfter type createdAt user{id}}`);
    if (!authToken) {
        res.send("Token không hợp lệ")
    }
    if (moment(authToken.createdAt).add(authToken.expiredAfter, 'milliseconds').isBefore(moment())) {
        res.send("Token đã hết hạn.")
    }
    await prisma.mutation.updateUser({
        where: {
            id: authToken.user.id
        },
        data: {
            isActive: true
        }
    });
    res.send("Tài khoản của bạn đã được kích hoạt. Giờ bạn đã có thể đăng nhập.");
});

server.post('/api/order/pickup/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.json({
                status: 401,
                message: 'Unathorized'
            });
        }
        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(token, env.JWT_SECRET);
        const order = await prisma.query.order({
            where: {
                id: orderId
            }
        }, `{id orderStatus customer{id}}`);
        if (!order || order.customer.id !== payload.userId) {
            res.json({
                status: 400,
                message: 'Không tìm thấy đơn hàng'
            });
        }
        if (order.orderStatus==="Completed"||order.orderStatus==="Canceled"){
            res.json({
                status: 400,
                message: 'Đơn hàng đã được giao thành công hoặc đã bị hủy'
            });
        }
        await prisma.mutation.updateOrder({
            where: {
                id: orderId
            },
            data: {
                orderStatus: "Completed"
            }
        });
        res.json({
            status: 200,
            message: 'OK'
        })
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

server.start({
    port: env.GRAPHQL_PORT
}, () => console.log(`Running on port ${env.GRAPHQL_PORT}`));
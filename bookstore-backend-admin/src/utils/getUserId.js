import jwt from 'jsonwebtoken';
import env from '../env';

export default function getUserId(httpContext){
    const authHeader = httpContext.request.headers.authorization;
    if (!authHeader) {
        throw new Error("Authentication required!");
    }
    const token = authHeader.replace("Bearer ","");
    const payload = jwt.verify(token, env.JWT_SECRET)
    return payload.userId;
}
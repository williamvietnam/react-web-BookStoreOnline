import jsonwebtoken from 'jsonwebtoken'

export default function isTokenValid(token) {
    try {
        let decoded = jsonwebtoken.decode(token);
        if (decoded.exp < new Date().getTime() / 1000) {
            return false;
        }
        return true;
    } catch{
        return false;
    }
}
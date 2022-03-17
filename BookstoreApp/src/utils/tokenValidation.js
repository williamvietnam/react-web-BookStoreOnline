import jwtdecode from 'jwt-decode'

export default function isTokenValid(token) {
    try {
        let decoded = jwtdecode(token);
        if (decoded.exp < new Date().getTime() / 1000) {
            return false;
        }
        return true;
    } catch(err){
        console.log(err)
        return false;
    }
}
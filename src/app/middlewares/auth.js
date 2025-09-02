import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth.js'

function authMiddleware(req, res, next){

    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({error: "Token not provided"});
    }

    const token = authToken.split(' ').at(1);

    try{
        jwt.verify(token, authConfig.secrete, (err, decoded) => {
            if(err){
                throw new Error();
            }

            req.userId = decoded.id;
            req.userName = decoded.name;
        })
    } catch(err){
        return res.status(401).json({error: "Token is invalid"})
    }

    return next();
}

export default authMiddleware;
import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import autoConfig from '../../config/auth.js'

class SessionController{
    
    async store(req, res){

        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required()
        });

        const validation = await schema.isValid(req.body);

        const errorValidate = () => {
            return res.status(401).json({error: 'Make sure your email or password are correct'});
        }

        if(!validation){
            errorValidate();
        }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(!user){
            errorValidate();
        }

        const isSamePassword = await user.comparePassword(req.body.password);

        if(!isSamePassword){
            errorValidate();
        }

        return res.status(201).json(
            {
                id: user.id, 
                name: user.name, 
                email: user.email, 
                admin: user.admin,
                token: jwt.sign({id: user.id, name: user.name}, autoConfig.secrete, {expiresIn: autoConfig.expiresIn})
            }
        );
    }
}

export default new SessionController();
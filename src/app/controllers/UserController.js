import User from '../models/User.js';
import * as Yup from 'yup';

import { v4 } from 'uuid';

class UserController{

    async store(req, res) {

        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(userExists){
            return res.status(409).json({error: 'Already exists a user using this email'});
        }

        const user = await User.create({
            id: v4(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin,
        });
    
        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
        });
    }

    async index(req, res){
        try{
            const users = await User.findAll();
            return res.status(200).json(users);
        } catch(errr) {
            throw new Error();
        }
    }

    async update(req, res){
        const schema = Yup.object({
            name: Yup.string(),
            email: Yup.string().email(),
            password: Yup.string().min(6),
            admin: Yup.boolean()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const { id } = req.params;

        const userFind = await User.findByPk(id);

        if(!userFind){
            return res.status(404).json({massage: 'Make sure that ID is correct'});
        }

        try{
            await User.update({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                admin: req.body.admin
            },{
                where: {
                    id: id
                }
            })
            return res.status(200).json({message: 'User updated successfully'});
        } catch(err){
            return res.status(404).json({error: err.errors})
        }
    }

    async delete(req, res){
        
    }
}

export default new UserController();
import * as Yup from 'yup';
import Category from '../models/Category.js';
import User from '../models/User.js';

class CategoryController{
    async store(req, res){

        const { admin: isAdmin } = await User.findByPk(req.userId);
        
        if(!isAdmin){
            return res.status(401).json({massage: "User dont has permission to acess this path"})
        }

        req.body.file = req.file?.filename;

        const schema = Yup.object({
            name: Yup.string().required(),
            file: Yup.string().required()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const { filename: path } = req.file;

        const categoryExists = await Category.findOne({
            where: {
                name: req.body.name
            }
        });

        if(categoryExists){
            return res.status(400).json({error: 'Category already exists'});
        }

        const category = await Category.create(
            {
                name: req.body.name,
                path: path
            }
        )

        return res.status(201).json(category);
    }

    async index(req, res){

        const categories = await Category.findAll();

        return res.status(200).json(categories);
    }

    async update(req, res){

        const schema = Yup.object({
            name: Yup.string()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        let path;
        if(req.file){
            path = req.file.filename
        }

        const { id } = req.params;

        const categoryFind = await Category.findByPk(id);

        if(!categoryFind){
            return res.status(404).json({massage: 'Make sure that ID is correct'});
        }


        if(req.body.name){
            const categoryName = await Category.findOne({
                where: {
                    name: req.body.name
                }
            })

            if(categoryName && categoryName.id !== Number(id)){
            return res.status(400).json({massage: 'Already exist a Category using this name'});
        }
        }

        try{
            await Category.update({
                name: req.body.name,
                path: path
            },{
                where: {
                    id: id
                }
            })
            return res.status(200).json();
        } catch(err){
            return res.status(404).json({error: err.errors})
        }
    }
}

export default new CategoryController();
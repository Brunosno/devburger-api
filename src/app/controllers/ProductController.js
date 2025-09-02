import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

class ProductController{
    async store(req, res){

        const { admin: isAdmin } = await User.findByPk(req.userId);
        
        if(!isAdmin){
            return res.status(401).json({massage: "User dont has permission to acess this path"})
        }

        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const path = req.file.filename;

        const product = await Product.create(
            {
                name: req.body.name,
                price: req.body.price,
                category_id: req.body.category_id,
                offer: req.body.offer,
                path: path
            }
        )

        return res.status(201).json(product);
    }

    async index(req, res){

        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });

        return res.status(200).json(products);
    }

    async update(req, res){

        const { admin: isAdmin } = await User.findByPk(req.userId);
        
        if(!isAdmin){
            return res.status(401).json({massage: "User dont has permission to acess this path"})
        }
        
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const { id } = req.params;

        const findProduct = await Product.findByPk(id);

        if(!findProduct){
            return res.status(404).json({massage: 'Product dont found'});
        }

        let path;

        if (req.file){
            path = req.file.filename
        }

        await Product.update(
            {
                name: req.body.name,
                price: req.body.price,
                category_id: req.body.category_id,
                offer: req.body.offer,
                path: path
            },
            {
                where: {
                    id: id
                }
            }
        );

        return res.status(200).json();

    }
}

export default new ProductController();
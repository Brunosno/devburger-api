import * as Yup from 'yup';
import Order from '../schemas/Order.js'
import Product from '../models/Product.js';
import Category from '../models/Category.js'
import User from '../models/User.js'

class OrderController{
    async store(req, res){

        const schema = Yup.object({
            products: Yup.array().required().of(Yup.object({
                id: Yup.number().required(),
                quantity: Yup.number().required()
            })),
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const { products } = req.body;

        const productsIds = products.map( p => p.id );

        const findProducts = await Product.findAll({
            where: {
                id: productsIds
            },
            include:{
                model: Category,
                as: 'category',
                attributes: ['name']
            }
        });

        const formattedProducts = findProducts.map((product) => {
            const productIndex = products.findIndex(item => item.id === product.id);

            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category.name,
                price: product.price,
                url: product.url,
                quantity: products[productIndex].quantity
            }

            return newProduct
        })

        const order = {
            user: {
                id: req.userId,
                name: req.userName
            },
            products: formattedProducts,
            status: 'Pedido Realizado'
        }
        
        const createdOrder = await Order.create(order);

        return res.status(201).json(createdOrder);
    }

    async index(req, res){

        const { admin: isAdmin } = await User.findByPk(req.userId);

        if(!isAdmin){
            return res.status(401).json({massage: "User dont has permission to acess this path"})
        }

        const orders = await Order.find();

        return res.status(200).json(orders);
    }

    async update(req, res){

        const { admin: isAdmin } = await User.findByPk(req.userId);

        if(!isAdmin){
            return res.status(401).json({massage: "User dont has permission to acess this path"})
        }

        const schema = Yup.object({
            status: Yup.string().required()
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const { id } = req.params;
        const { status } = req.body;

        try{
            await Order.updateOne({ _id: id}, { status });
        } catch(error){
            return res.status(400).json({err: error.message});
        }

        return res.status(200).json({message: 'Status Updated Sussesfully'});
    }
}

export default new OrderController();
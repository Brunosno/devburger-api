import Stripe from "stripe";
import * as Yup from 'yup';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calcularOrderAmount = (products) => {
    let total = 0;
    products.forEach( (product) => {
        total += product.price * product.quantity;
    });
    return total;
}

class PaymentIntentController{
    
    async store(req, res){
        const schema = Yup.object({
            products: Yup.array().required().of(Yup.object({
                id: Yup.number().required(),
                quantity: Yup.number().required(),
                price: Yup.number().required()
            })),
        });

        try{
            schema.validateSync(req.body, { abortEarly: false});
        } catch(err){
            return res.status(400).json({error: err.errors});
        }

        const { products } = req.body;

        const amount = calcularOrderAmount(products);

        try{
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "brl",
                automatic_payment_methods: {enabled: true},
            });

            res.json({ 
                clientSecret: paymentIntent.client_secret, 
                dpmCheckerLink:`https://dashboard.stripe.com/settings/paycment_methods/${paymentIntent.id}`
            });
        } catch(err){
            return res.status(400).json({error: err.message});
        }
    }
}

export default new PaymentIntentController();
import Sequelize from "sequelize";

import configDatabase from '../config/database.cjs';

import User from '../app/models/User.js';
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";
import mongoose from 'mongoose';

const models = [User, Product, Category];

class Database{
    constructor(){
        this.init();
        this.mongo();
    }

    init(){
        this.connection = new Sequelize(configDatabase);
        models.map(m => m.init(this.connection))
        .map(m => m.associate && m.associate(this.connection.models));
    }

    mongo(){
        this.mongoConnection = mongoose.connect('mongodb://localhost:27017/devburger', );
    }
}

export default new Database();
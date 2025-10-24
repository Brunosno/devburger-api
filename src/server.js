import app from './app.js'
import dotenv from 'dotenv';

dotenv.config();

app.listen(process.env.LOCAL_PORT, () => console.log("O server está rodando na porta 3001 ..."))

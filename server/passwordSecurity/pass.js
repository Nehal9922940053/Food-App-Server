import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';


dotenv.config()
export const SECRET_KEY = process.env.SECRET_KEY

export const hashPass = async (text) => {
    return await bcrypt.hash(text, 12);
}

export const compPass = async (text, databasePass) => {
    return bcrypt.compare(text, databasePass)
}



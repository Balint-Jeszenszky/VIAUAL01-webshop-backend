import UserModel from '../models/User';
import bcrypt from 'bcrypt';

export default async function createAdmin() {
    const adminExists = await  UserModel.exists({ role: 'ADMIN' });
    if (!adminExists) {
        const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const email = process.env.ADMIN_EMAIL;
        if (!email || !password) throw new TypeError('Admin credentials not set in .env');
        const admin = new UserModel();
        admin.name = 'admin';
        admin.username = 'admin';
        admin.email = email;
        admin.password = password;
        admin.phoneNumber = '';
        admin.address = '';
        admin.orders = [];
        admin.cart = [];
        admin.role = 'ADMIN';
        await admin.save();
    }
}
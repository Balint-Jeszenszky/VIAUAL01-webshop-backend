import { Schema, Document } from 'mongoose';
import db from '../config/db';

export interface ICompany extends Document {
    name: string,
    accessToken: string
}

export function toCompanyDTO(company: ICompany) {
    return {
        id: company._id,
        name: company.name,
        accessToken: company.accessToken
    };
}

const CompanytSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true }
});

export default db.model<ICompany>('Company', CompanytSchema);

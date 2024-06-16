import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CompanyAttrs {
  name: string;
  cnpj: string;
  registration: string;
  legalNature: string;
  creationDate: Date | null;
  updateDate: Date | null;
}

interface CompanyModel extends mongoose.Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

export interface CompanyDoc extends mongoose.Document {
  _id: string;
  name: string;
  cnpj: string;
  registration: string;
  legalNature: string;
  creationDate: Date | null;
  updateDate: Date | null;
}

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome',
    },
    cnpj: {
      type: String,
      required: true,
      description: 'CNPJ',
    },
    registration: {
      type: String,
      required: true,
      description: 'Inscrição estadual',
    },
    legalNature: {
      type: String,
      required: true,
      enum : ["PU","PR"],
      description: 'Natureza Jurídica',
    },        
    creationDate: {
      type: Date,
      description: 'Data de Criação',
    },
    updateDate: {
      type: Date,
      description: 'Data de Atualização',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

CompanySchema.set('versionKey', 'version');
CompanySchema.plugin(updateIfCurrentPlugin);

export { CompanySchema as CompanySchema };

import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PatientAttrs {
  name: string;
  cpf: string;
  phone: string;
  birthday: Date;
  creationDate: Date | null;
  updateDate: Date | null;
}

interface PatientModel extends mongoose.Model<PatientDoc> {
  build(attrs: PatientAttrs): PatientDoc;
}

export interface PatientDoc extends mongoose.Document {
  _id: string;
  name: string;
  cpf: string;
  phone: string;
  birthday: Date;
  creationDate: Date | null;
  updateDate: Date | null;
}

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome',
    },
    cpf: {
      type: String,
      required: false,
      description: 'CPF',
    },
    phone: {
      type: String,
      required: false,
      description: 'Telefone',
      minLength: [10, 'Telefone com no minímo 10 dígitos'],
      maxLength: [11, 'Telefone com no máximo 11 dígitos'],
      match: [/\d{10}/, 'O telefone só pode contar números'],
    },
    birthday: {
      type: Date,
      required: false,
      description: 'Data de Nascimento',
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

PatientSchema.set('versionKey', 'version');
PatientSchema.plugin(updateIfCurrentPlugin);

export { PatientSchema as PatientSchema };

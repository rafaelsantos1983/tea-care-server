import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PatientAttrs {
  name: string;
  cpf: string;
  birthday: Date;
  responsible: any;
}

interface PatientModel extends mongoose.Model<PatientDoc> {
  build(attrs: PatientAttrs): PatientDoc;
}

export interface PatientDoc extends mongoose.Document {
  _id: string;
  name: string;
  cpf: string;
  birthday: Date;
  responsible: any;
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
    birthday: {
      type: Date,
      required: false,
      description: 'Data de Nascimento',
    },
    responsible: {
      type: Schema.Types.ObjectId,
      description: 'Responsável pelo paciente',
      ref: 'User',
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
    timestamps: true,
  }
);

PatientSchema.set('versionKey', 'version');
PatientSchema.plugin(updateIfCurrentPlugin);

export { PatientSchema as PatientSchema };

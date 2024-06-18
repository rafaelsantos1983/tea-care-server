import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface FunctionalittyAttrs {
  name: string;
  symbol: string;
  creationDate: Date | null;
  updateDate: Date | null;
}

interface FunctionalittyModel extends mongoose.Model<FunctionalittyDoc> {
  build(attrs: FunctionalittyAttrs): FunctionalittyDoc;
}

export interface FunctionalittyDoc extends mongoose.Document {
  _id: string;
  name: string;
  symbol: string;
  creationDate: Date | null;
  updateDate: Date | null;
}

const FunctionalittySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome',
    },
    symbol: {
      type: String,
      required: true,
      description: 'Símbolo da Funcionalidade',
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

FunctionalittySchema.set('versionKey', 'version');
FunctionalittySchema.plugin(updateIfCurrentPlugin);

export { FunctionalittySchema as FunctionalittySchema };

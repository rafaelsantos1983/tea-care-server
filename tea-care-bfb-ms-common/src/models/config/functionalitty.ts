import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface FunctionalittyAttrs {
  name: string;
  symbol: string;
}

interface FunctionalittyModel extends mongoose.Model<FunctionalittyDoc> {
  build(attrs: FunctionalittyAttrs): FunctionalittyDoc;
}

export interface FunctionalittyDoc extends mongoose.Document {
  _id: string;
  name: string;
  symbol: string;
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

FunctionalittySchema.set('versionKey', 'version');
FunctionalittySchema.plugin(updateIfCurrentPlugin);

export { FunctionalittySchema as FunctionalittySchema };

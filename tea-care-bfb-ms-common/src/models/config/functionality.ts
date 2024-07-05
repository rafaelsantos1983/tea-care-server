import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface FunctionalityAttrs {
  name: string;
  symbol: string;
}

interface FunctionalityModel extends mongoose.Model<FunctionalityDoc> {
  build(attrs: FunctionalityAttrs): FunctionalityDoc;
}

export interface FunctionalityDoc extends mongoose.Document {
  _id: string;
  name: string;
  symbol: string;
}

const FunctionalitySchema = new mongoose.Schema(
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

FunctionalitySchema.set('versionKey', 'version');
FunctionalitySchema.plugin(updateIfCurrentPlugin);

export { FunctionalitySchema as FunctionalitySchema };

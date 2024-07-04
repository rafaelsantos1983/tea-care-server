import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProfileAttrs {
  name: string;
  symbol: string;
  functionalitties: [];
  updateDate: Date | null;
}

interface ProfileModel extends mongoose.Model<ProfileDoc> {
  build(attrs: ProfileAttrs): ProfileDoc;
}

export interface ProfileDoc extends mongoose.Document {
  _id: string;
  name: string;
  symbol: string;
  functionalitties: {
    id: string;
    name: string;
    symbol: string;
  };
}

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome',
    },
    symbol: {
      type: String,
      required: true,
      description: 'Símbolo do Papel',
    },
    functionalitties: {
      type: Schema.Types.ObjectId,
      ref: 'Functionalitty',
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

ProfileSchema.set('versionKey', 'version');
ProfileSchema.plugin(updateIfCurrentPlugin);

export { ProfileSchema as ProfileSchema };

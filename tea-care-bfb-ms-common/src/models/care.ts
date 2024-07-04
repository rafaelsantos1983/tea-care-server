import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Occupation } from './care-type';

interface CareAttrs {
  name: string;
  description: string;
  professional: any;
  dateAssessment: Date;
}

interface CareModel extends mongoose.Model<CareDoc> {
  build(attrs: CareAttrs): CareDoc;
}

export interface CareDoc extends mongoose.Document {
  _id: string;
  description: string;
  professional: any;
  dateAssessment: Date;
}

const CareSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      description: 'Descrição',
    },
    professional: {
      type: Schema.Types.ObjectId,
      description: 'Profissional que realizou o atendimento',
      ref: 'User',
    },
    dateAssessment: {
      type: Date,
      description: 'Data do atendimento',
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

CareSchema.set('versionKey', 'version');
CareSchema.plugin(updateIfCurrentPlugin);

export { CareSchema as CareSchema };

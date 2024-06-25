import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CareType } from './care-type';

interface CareAttrs {
  name: string;
  cpf: string;
  phone: string;
  date: Date;
}

interface CareModel extends mongoose.Model<CareDoc> {
  build(attrs: CareAttrs): CareDoc;
}

export interface CareDoc extends mongoose.Document {
  _id: string;
  description: string;
  careType: CareType;
  careProfessional: any;
  dateAssessment: Date;
}

const CareSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      description: 'Descrição',
    },
    careType: {
      type: String,
      enum: Object.values(CareType),
      required: true,
      description: 'Tipo de atendimento',
    },
    careProfessional: {
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

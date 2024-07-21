import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Survey } from './survey';
import { QualificationType } from './qualification-type';
import { UserDoc } from '../config/user';

interface CareAnswerAttrs {
  patient: any;
  qualificationType: QualificationType;
  year: number;
  month: number;
  value: number;
}

interface CareAnswerModel extends mongoose.Model<CareAnswerDoc> {
  build(attrs: CareAnswerAttrs): CareAnswerDoc;
}

export interface CareAnswerDoc extends mongoose.Document {
  _id: string;
  patient: any;
  qualificationType: QualificationType;
  year: number;
  month: number;
  value: number;
}

const CareAnswerSchema = new mongoose.Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      description: 'Paciente',
      ref: 'Patient',
    },
    qualificationType: {
      type: String,
      enum: Object.values(QualificationType),
      required: false,
      description: 'Tipo da habilidade',
    },
    year: {
      type: Number,
      required: false,
      description: 'Ano',
    },
    month: {
      type: Number,
      required: false,
      description: 'Mês',
    },
    value: {
      type: Number,
      required: false,
      description: 'Valor',
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

CareAnswerSchema.set('versionKey', 'version');
CareAnswerSchema.plugin(updateIfCurrentPlugin);

export { CareAnswerSchema as CareAnswerSchema };

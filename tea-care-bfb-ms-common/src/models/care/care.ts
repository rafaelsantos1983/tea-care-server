import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Survey } from './survey';
import { QualificationType } from './qualification-type';
import { UserDoc } from '../config/user';

interface CareAttrs {
  name: string;
  description: string;
  professional: any;
  initialDate: Date;
  finalDate: Date;
  tramit: boolean;
  absent: boolean;
  survey: Survey;
}

interface CareModel extends mongoose.Model<CareDoc> {
  build(attrs: CareAttrs): CareDoc;
}

export interface CareDoc extends mongoose.Document {
  _id: string;
  description: string;
  professional: UserDoc;
  patient: any;
  initialDate: Date;
  finalDate: Date;
  tramit: boolean;
  absent: boolean;
  survey: Survey;
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
    patient: {
      type: Schema.Types.ObjectId,
      description: 'Paciente',
      ref: 'Patient',
    },
    initialDate: {
      type: Date,
      description: 'Data de início do atendimento',
    },
    finalDate: {
      type: Date,
      description: 'Data de início do atendimento',
    },
    absent: {
      type: Boolean,
      default: false,
      description: 'Flag que indica se o antedimento o paciente estava ausente',
    },
    tramit: {
      type: Boolean,
      default: false,
      description: 'Flag que indica se o atendimento ainda está em andamento',
    },
    survey: [
      {
        qualificationType: {
          type: String,
          enum: Object.values(QualificationType),
          required: false,
          description: 'Tipo da habilidade',
        },
        answers: [
          {
            type: Number,
            required: false,
            description: 'Respostas',
          },
        ],
      },
    ],
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

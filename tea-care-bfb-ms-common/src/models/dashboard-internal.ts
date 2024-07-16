import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Survey } from './care/survey';
import { QualificationType } from './care/qualification-type';

interface DashboardInternalAttrs {
  name: string;
  description: string;
  professional: any;
  initialDate: Date;
  finalDate: Date;
  tramit: boolean;
  absent: boolean;
  survey: Survey;
}

interface DashboardInternalModel extends mongoose.Model<DashboardInternalDoc> {
  build(attrs: DashboardInternalAttrs): DashboardInternalDoc;
}

export interface DashboardInternalDoc extends mongoose.Document {
  _id: string;
  patient: any;
  rating: [
    year: number,
    qualitications: [
      qualtificationType: QualificationType,
      months: [month: number, value: number],
    ],
  ];
}

const DashboardInternalSchema = new mongoose.Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      description: 'Paciente',
      ref: 'Patient',
    },
    rating: [
      {
        year: {
          type: Number,
          required: false,
          description: 'Ano',
        },
        qualitications: [
          {
            qualificationType: {
              type: String,
              enum: Object.values(QualificationType),
              required: false,
              description: 'Tipo da habilidade',
            },
            months: [
              {
                month: {
                  type: Number,
                  required: false,
                  description: 'Mês',
                },
                value: {
                  type: Number,
                  required: false,
                  description: 'Avaliação',
                },
              },
            ],
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

DashboardInternalSchema.set('versionKey', 'version');
DashboardInternalSchema.plugin(updateIfCurrentPlugin);

export { DashboardInternalSchema as DashboardInternalSchema };

import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { QualificationType } from './care/qualification-type';
import { PatientDoc } from './care/patient';

interface DashboardInternalAttrs {
  patient: PatientDoc;
  rating: [
    qualificationType: QualificationType,
    periods: [year: Number, months: [month: Number, value: Number]],
  ];
}

interface DashboardInternalModel extends mongoose.Model<DashboardInternalDoc> {
  build(attrs: DashboardInternalAttrs): DashboardInternalDoc;
}

export interface DashboardInternalDoc extends mongoose.Document {
  _id: string;
  patient: PatientDoc;
  rating: [
    qualificationType: QualificationType,
    periods: [year: Number, months: [month: Number, value: Number]],
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
        qualificationType: {
          type: String,
          enum: Object.values(QualificationType),
          required: false,
          description: 'Tipo da habilidade',
        },
        periods: [
          {
            year: {
              type: Number,
              required: false,
              description: 'Ano',
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

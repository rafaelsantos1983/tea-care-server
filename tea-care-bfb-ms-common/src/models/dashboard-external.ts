import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { QualificationType } from './care/qualification-type';

interface DashboardExternalAttrs {
  patient: any;
  rating: [qualtificationType: QualificationType, value: Number];
}

interface DashboardExternalModel extends mongoose.Model<DashboardExternalDoc> {
  build(attrs: DashboardExternalAttrs): DashboardExternalDoc;
}

export interface DashboardExternalDoc extends mongoose.Document {
  _id: string;
  patient: any;
  rating: [qualtificationType: QualificationType, value: Number];
}

const DashboardExternalSchema = new mongoose.Schema(
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
        value: {
          type: Number,
          required: false,
          description: 'Avaliação',
        },
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

DashboardExternalSchema.set('versionKey', 'version');
DashboardExternalSchema.plugin(updateIfCurrentPlugin);

export { DashboardExternalSchema as DashboardExternalSchema };

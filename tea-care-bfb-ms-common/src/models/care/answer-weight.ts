import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { QualificationType } from './qualification-type';
import { OccupationType } from './occupation-type';

interface AnswerWeightAttrs {
  qualificationType: String;
  weights: [{ occupation: OccupationType; value: number }];
}

interface AnswerWeightModel extends mongoose.Model<AnswerWeightDoc> {
  build(attrs: AnswerWeightAttrs): AnswerWeightDoc;
}

export interface AnswerWeightDoc extends mongoose.Document {
  _id: string;
  qualificationType: String;
  weights: [{ occupation: OccupationType; value: number }];
}

const AnswerWeightSchema = new mongoose.Schema(
  {
    qualificationType: {
      type: String,
      enum: Object.values(QualificationType),
      required: false,
      description: 'Tipo da habilidade',
    },
    weights: [
      {
        occupation: {
          type: String,
          enum: Object.values(OccupationType),
          required: false,
          description: 'Tipo da Profissão',
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

AnswerWeightSchema.set('versionKey', 'version');
AnswerWeightSchema.plugin(updateIfCurrentPlugin);

export { AnswerWeightSchema as AnswerWeightSchema };

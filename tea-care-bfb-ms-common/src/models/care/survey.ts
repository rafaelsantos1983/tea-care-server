import { QualificationType } from './qualification-type';

export interface Survey {
  qualificationType: QualificationType;
  answers: Number[] | null;
}

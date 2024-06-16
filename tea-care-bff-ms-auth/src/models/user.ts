import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAttrs {
  name: string;
  cpf: string;
  phone: string;
  birthday: Date;
  creationDate: Date | null;
  updateDate: Date | null;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  _id: string;
  name: string;
  cpf: string;
  phone: string;
  birthday: Date;
  creationDate: Date | null;
  updateDate: Date | null;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome',
    },
    cpf: {
      type: String,
      required: true,
      description: 'CPF',
    },
    phone: {
      type: String,
      required: true,
      description: 'Telefone',
      minLength: [10, "Telefone com no minímo 10 dígitos"],
      maxLength: [11, "Telefone com no máximo 11 dígitos"],
      match: [/\d{10}/, "O telefone só pode contar números"]
    },    
    birthday: {
      type: Date,
      description: 'Data de Nascimento',
    },
    creationDate: {
      type: Date,
      description: 'Data de Criação',
    },
    updateDate: {
      type: Date,
      description: 'Data de Atualização',
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
  }
);

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

export { UserSchema as UserSchema };

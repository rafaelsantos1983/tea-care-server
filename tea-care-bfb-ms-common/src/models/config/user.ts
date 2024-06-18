import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  propfiles: [];
  creationDate: Date | null;
  updateDate: Date | null;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  propfiles: {
    id: string;
    name: string;
    symbol: string;
  };
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
    email: {
      type: String,
      required: true,
      description: 'E-mail',
    },
    password: {
      type: String,
      required: true,
      description: 'Senha',
    },
    cpf: {
      type: String,
      required: false,
      description: 'CPF',
    },
    phone: {
      type: String,
      required: false,
      description: 'Telefone',
      minLength: [10, 'Telefone com no minímo 10 dígitos'],
      maxLength: [11, 'Telefone com no máximo 11 dígitos'],
      match: [/\d{10}/, 'O telefone só pode contar números'],
    },
    profiles: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
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
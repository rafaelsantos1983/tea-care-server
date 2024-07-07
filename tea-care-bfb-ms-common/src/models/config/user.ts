import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { UserType as UserType } from './user-type';
import { OccupationType } from '../occupation-type';

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  type: UserType;
  propfiles: [];
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
  type: UserType;
  occupation: OccupationType;
  propfiles: [
    {
      id: string;
      name: string;
      symbol: string;
    },
  ];
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome',
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'está inválido.'],
      description: 'E-mail',
      index: true,
    },
    password: {
      type: String,
      required: false,
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
    type: {
      type: String,
      enum: Object.values(UserType),
      required: false,
      description: 'Tipo de usuário: Interno ou Externo',
    },
    occupation: {
      type: String,
      enum: Object.values(OccupationType),
      required: false,
      description: 'Profissão',
    },
    profiles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
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

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

export { UserSchema as UserSchema };

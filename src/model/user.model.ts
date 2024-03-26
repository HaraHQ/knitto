import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

type UserAttributes = {
  id?: number;
  email: string;
  password: string;
}

const User = sequelize.define<Model<UserAttributes>>('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'user',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

export default User;
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

type ProfileAttributes = {
  id?: number;
  fullName: string;
  age?: number;
  pp?: string;
  userId: number;
}

const Profile = sequelize.define<Model<ProfileAttributes>>('profile', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  }
}, {
  tableName: 'profile',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

export default Profile;
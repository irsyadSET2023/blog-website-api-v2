import { DataTypes } from "sequelize";
import postgressConnection from "../connection";

const Users = postgressConnection.define(
  "users",
  {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { timestamp: true, paranoid: true, underscored: true }
);

export default Users;

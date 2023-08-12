import { DataTypes } from "sequelize";
import postgressConnection from "../connection";
import Users from "./Users";

const Blogs = postgressConnection.define(
  "blogs",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamp: true, paranoid: true, underscored: true }
);

Blogs.belongsTo(Users, { foreignKey: "authorId" });

export default Blogs;

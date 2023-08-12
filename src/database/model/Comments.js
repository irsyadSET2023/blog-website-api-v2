import { DataTypes } from "sequelize";
import postgressConnection from "../connection";
import Users from "./Users";
import Blogs from "./Blogs";

const Comments = postgressConnection.define(
  "comments",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    commentSlug: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  { timestamp: true, paranoid: true, underscored: true }
);

Comments.belongsTo(Users, { foreignKey: "userId" });
Comments.belongsTo(Blogs, { foreignKey: "blogId" });
export default Comments;

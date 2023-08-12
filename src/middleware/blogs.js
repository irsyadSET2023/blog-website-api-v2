import { body } from "express-validator";
import { Op, where } from "sequelize";
import Blogs from "../database/model/Blogs";

export const createblogValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title Must not be Empty")
    .custom(async function (value) {
      const blog = await Blogs.findAll({
        where: { title: value },
      });
      if (blog) {
        throw new Error(
          "This title already exist. You cannot have blogs with same title"
        );
      }
    }),
  body("body").notEmpty().withMessage("Content Must not be Empty"),
];

export const updateblogValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title Must not be Empty")
    .custom(async function (value) {
      const blog = await Blogs.findAll({
        where: { title: value },
      });
      if (blog) {
        throw new Error(
          "This title already exist. You cannot have blogs with same title"
        );
      }
    }),
  body("body").notEmpty().withMessage("Content Must not be Empty"),
];

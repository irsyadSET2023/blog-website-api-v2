import { body } from "express-validator";
import User from "../../database/model/Users";
import { Op } from "sequelize";

export const loginValidator = [
  body("identifier").custom(async function (value) {
    const user = await User.findOne({
      atttibutes: ["identifier"],
      where: { [Op.or]: [{ userName: value }, { email: value }] },
    });
    if (!user) {
      throw new Error("User Does Not Exist");
    }
  }),
];

export const registorValidator = [
  body("username")
    .notEmpty()
    .withMessage("User Name must not be empty")
    .isAlpha()
    .withMessage("Must Be Alphabet Only")
    .custom(async function (value) {
      const user = await User.findOne({
        where: { userName: value },
      });
      if (user) {
        throw new Error("This User Name Already Exist");
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be email")
    .custom(async function (value) {
      const user = await User.findOne({
        // atttibutes: ["identifier"],
        where: { email: value },
      });
      if (user) {
        throw new Error("This Email Already Exist");
      }
    }),
  body("password").notEmpty().withMessage("Must not be Empty"),
];

export const updateUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be email")
    .custom(async function (value) {
      const user = await User.findOne({
        // atttibutes: ["identifier"],
        where: { email: value },
      });
      if (user) {
        throw new Error("This Email Already Exist");
      }
    }),
  body("password").notEmpty().withMessage("Must not be Empty"),
  body("username")
    .notEmpty()
    .withMessage("User Name must not be empty")
    .isAlpha()
    .withMessage("Must Be Alphabet Only")
    .custom(async function (value) {
      const user = await User.findOne({
        where: { userName: value },
      });
      if (user) {
        throw new Error("This User Name Already Exist");
      }
    }),
];

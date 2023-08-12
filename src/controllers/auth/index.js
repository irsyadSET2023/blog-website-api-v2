import query from "../../database";
import bcrypt from "bcryptjs";
import Users from "../../database/model/Users";
import { Op } from "sequelize";
import Blogs from "../../database/model/Blogs";
import Comments from "../../database/model/Comments";

async function registerUser(req, res) {
  //receive data from body
  const { email, username, password } = req.body;
  const isAdmin = req.body?.is_admin ? true : false;
  let saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const user = await Users.create({
    userName: username,
    email: email,
    password: hashedPassword,
    isAdmin: isAdmin,
  })
    .then(async (result) => {
      res.status(200).json({ message: "Account Created", data: result });
    })
    .catch(async (error) => {
      res.status(500).json({ error });
    });
}

async function updateUser(req, res) {
  const userId = req.session.auth;
  const body = req.body;
  const updatedColumns = {};

  // Construct the SET clause for the SQL query
  Object.entries(body).forEach(([key, value]) => {
    if (key === "password") {
      let saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      updatedColumns[key] = hashedPassword;
    } else {
      updatedColumns[key] = value;
    }
  });

  try {
    const updatedUser = await Users.update(updatedColumns, {
      where: { id: userId },
    });
    res.status(200).json({ message: `User ${userId} is updated`, updatedUser });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function login(req, res) {
  const { identifier, password } = req.body;
  console.log(identifier);
  const user = await Users.findOne({
    where: { [Op.or]: [{ userName: identifier }, { email: identifier }] },
  });
  console.log(user);
  const userHashedPassword = user.password;
  bcrypt.compare(password, userHashedPassword, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const serverRes = {
        message: "Login successful",
        data: user,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login Unsuccesful",
        error: "Invalid credential",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

async function logout(req, res) {
  const session = req.session.destroy();
  console.log(session);
  res.status(200).json({ message: "Successfully logout" });
}

async function deactivateAccount(req, res) {
  const userId = req.session.auth;

  try {
    const deletedUser = await Users.destroy({ where: { id: userId } });
  } catch (error) {
    res.status(500).json(error);
    return;
  }

  try {
    const deletedUserBlogs = await Blogs.destroy({
      where: { authorId: userId, deletedUserBlogs },
    });
  } catch (error) {
    res.status(500).json(error);
    return;
  }

  try {
    const deletedUserComments = await Comments.destroy({
      where: { userId: userId, deletedUserComments },
    });
  } catch (error) {
    res.status(500).json(error);
    return;
  }

  res.status(200).json({ message: `Your Account is deactivated`, deletedUser });
}

const userAuthenthication = {
  registerUser,
  updateUser,
  login,
  logout,
  deactivateAccount,
  // adminPrivillegeDelete,
};
export default userAuthenthication;

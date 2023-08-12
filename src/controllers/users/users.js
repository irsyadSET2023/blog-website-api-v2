import query from "../../database";
import bcrypt from "bcryptjs";
import Users from "../../database/model/Users";

async function getAllUsers(req, res) {
  try {
    const users = await Users.findAll();
    if (!users.length) {
      res.status(404).json({ message: "No Users Found" });
    } else {
      res.status(200).json({ message: "List of All users", users });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getSingleUser(req, res) {
  const userName = req.params.username;
  console.log(userName);
  const data = await query("SELECT * FROM users WHERE id=$1", [userName]);
  const users = data.rows;
  console.log(users);
  res.status(200).json({ users });
}

async function getUserbyName(req, res) {
  const userName = req.params.username;
  try {
    const users = await Users.findOne({ where: { userName: userName } });
    if (!users.length) {
      res.status(404).json({ message: `No User name ${userName} Found` });
    } else {
      res.status(200).json({ message: `User ${userName}`, users });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// async function updateUser(req, res) {
//   const userId = req.session.auth;
//   const body = req.body;
//   const updatedColumns = {};

//   // Construct the SET clause for the SQL query
//   Object.entries(body).forEach(([key, value]) => {
//     if (key === "password") {
//       let saltRounds = 10;
//       const hashedPassword = bcrypt.hashSync(value, saltRounds);
//       updatedColumns[key] = hashedPassword;
//     } else {
//       updatedColumns[key] = value;
//     }
//   });

//   try {
//     const updatedUser = await Users.update(updatedColumns, {
//       where: { id: userId },
//     });
//     res.status(200).json({ message: `User ${userId} is updated`, updatedUser });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }

const userController = {
  getAllUsers,
  getSingleUser,
  getUserbyName,
};
export default userController;

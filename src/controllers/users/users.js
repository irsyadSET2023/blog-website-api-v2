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

const userController = {
  getAllUsers,
  getUserbyName,
};
export default userController;

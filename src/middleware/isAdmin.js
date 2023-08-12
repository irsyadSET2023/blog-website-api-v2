import Users from "../database/model/Users";

async function isAdmin(req, res, next) {
  let user;
  try {
    user = await Users.findOne({ where: { id: req.user } });
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
  // console.log(user., "Hello");
  if (user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Invalid admin request" });
  }
}

export default isAdmin;

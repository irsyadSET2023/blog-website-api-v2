import Users from "../../database/model/Users";
import Blogs from "../../database/model/Blogs";
import Comments from "../../database/model/Comments";
import postgressConnection from "../../database/connection";

async function deleteUser(req, res) {
  const userId = req.body.user_id;
  try {
    await postgressConnection.transaction(async (t) => {
      await Users.destroy({
        where: { id: userId },
        transaction: t,
      });

      await Blogs.destroy({
        where: { authorId: userId },
        transaction: t,
      });
      await Comments.destroy({
        where: { userId: userId },
        transaction: t,
      });
    });

    res.status(200).json({ message: `Account for user ${userId} is deleted` });
    return;
  } catch (error) {
    res.status(500).json(error);
  }
}

async function restoreUser(req, res) {
  const userId = req.body.user_id;
  try {
    await postgressConnection.transaction(async (t) => {
      const restoredUser = await Users.restore({
        where: { id: userId },
        transaction: t,
      });

      if (restoredUser) {
        await Blogs.restore({
          where: { authorId: userId },
          transaction: t,
        });

        await Comments.restore({
          where: { userId: userId },
          transaction: t,
        });

        res
          .status(200)
          .json({ message: `Account ${userId} reactivated successfully.` });
        return;
      } else {
        res
          .status(404)
          .json({ message: "User not found or already restored." });
        return;
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

const adminPrivillege = {
  deleteUser,
  restoreUser,
};
export default adminPrivillege;

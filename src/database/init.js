import postgressConnection from "./connection";
import Blogs from "./model/Blogs";
import Comments from "./model/Comments";
import Users from "./model/Users";

async function syncModels() {
  await postgressConnection.authenticate();
  await Users.sync({ alter: true });
  await Blogs.sync({ alter: true });
  await Comments.sync({ alter: true });
}

async function dbInit() {
  try {
    console.debug("Connection to the database");
    await syncModels();
    console.debug("Connected to the database");
  } catch (error) {
    console.error("Failed to connect");
    process.exit(1);
  }
}

export default dbInit;

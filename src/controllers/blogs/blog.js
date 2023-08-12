import { Op } from "sequelize";
import Blogs from "../../database/model/Blogs";
import Users from "../../database/model/Users";

async function getAllBlog(req, res) {
  try {
    const blogs = await Blogs.findAll();
    if (!blogs.length) {
      res.status(404).json({ message: "No blog Found" });
    } else {
      res.status(200).json({ message: "List of All Blogs", blogs });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getBlogbyAuthorName(req, res) {
  const authorName = req.params.author_name;
  let authorsInfo;
  try {
    authorsInfo = await Users.findOne({ where: { userName: authorName } });
    if (!authorsInfo) {
      res
        .status(404)
        .json({ message: `There is no author with this name ${authorName}` });
      return;
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  try {
    const blogs = await Blogs.findAll({ where: { authorId: authorsInfo.id } });
    if (!blogs.length) {
      res.status(404).json({ message: "No blog Found", blogs, authorsInfo });
      return;
    } else {
      res
        .status(200)
        .json({ message: `List of All Blogs by ${authorName}`, blogs });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getBlogbyTitle(req, res) {
  const blogTitle = req.body.title;
  try {
    const blogs = await Blogs.findAll({ where: { title: blogTitle } });
    if (!blogs.length) {
      res.status(404).json({ message: "No blog Found", blogs, authorsInfo });
    } else {
      res
        .status(200)
        .json({ message: `List of All Blogs by title ${blogTitle}`, blogs });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function addBlog(req, res) {
  const authorId = req.session.auth;
  const blogTitle = req.body.title;
  const blogContent = req.body.body;

  const dateTime = Math.floor(Date.now());
  const blogSlug =
    Math.random().toString(36).substring(2, 8) + "_" + String(dateTime);

  try {
    const blogs = await Blogs.findAll({
      where: { [Op.and]: [{ title: blogTitle }, { authorId: authorId }] },
    });
    if (blogs.length > 0) {
      res.status(403).json({
        message:
          "This title already exist. You cannot have blogs with same title",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  await Blogs.create({
    authorId: authorId,
    title: blogTitle,
    body: blogContent,
    slug: blogSlug,
  })
    .then(function (blog) {
      res.status(200).json({ message: "Blog is Created", blog });
      return;
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
}

async function updateBlog(req, res) {
  const userId = req.session.auth;
  const blogSlug = req.body.slug;
  const body = req.body;
  const updatedColumns = {};

  console.log(typeof userId, " ", userId);

  Object.entries(body).forEach(([key, value]) => {
    updatedColumns[key] = value;
  });
  console.log(updatedColumns);
  try {
    const updatedBlog = await Blogs.update(updatedColumns, {
      where: { slug: blogSlug },
    });
    res.status(200).json({ message: "Blog is updated", updatedBlog });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteBlog(req, res) {
  const blogSlug = req.body.slug;
  await Blogs.destroy({ where: { slug: blogSlug } })
    .then(function (value) {
      res.status(200).json({ message: "Your post is deleted" });
    })
    .catch(function (error) {
      res.status(500).json({ message: "Server error", error });
    });
}

const blogController = {
  getAllBlog,
  getBlogbyAuthorName,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogbyTitle,
};
export default blogController;

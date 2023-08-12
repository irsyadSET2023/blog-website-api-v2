import { Op } from "sequelize";
import query from "../../database";
import Blogs from "../../database/model/Blogs";
import Comments from "../../database/model/Comments";

async function getAllComments(req, res) {
  try {
    const comments = await Comments.findAll();
    if (!comments.length) {
      res.status(404).json({ message: "No Comment Found" });
    } else {
      res.status(200).json({ message: "List of All Comments", comments });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getCommentsbyBlogsTitle(req, res) {
  const blogTitle = req.body.title;
  let blogInfo;
  try {
    blogInfo = await Blogs.findAll({ where: { title: blogTitle } });
    //blogInfo data structure is array
    if (!blogInfo.length) {
      res.status(404).json({ message: "Blog with this title not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  let arrBlogId = [];
  blogInfo.forEach(({ title, id }) => {
    let titleAndId = {};
    console.log(title, id);
    titleAndId.blogId = id;
    arrBlogId.push(titleAndId);
  });

  try {
    const comments = await Comments.findAll({
      where: { [Op.or]: arrBlogId },
    });
    if (!comments.length) {
      res.status(404).json({ message: "No Comment Found for this blog" });
    } else {
      res.status(200).json({ message: "List of All Comments", comments });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function postComments(req, res) {
  const userId = req.session.auth;
  const body = req.body;
  const blogSlug = body.blog_slug;
  const comment = body.comment;
  const dateTime = Math.floor(Date.now());
  const commentSlug =
    Math.random().toString(36).substring(2, 8) + "_" + String(dateTime);
  let blogId;
  try {
    const blogInfo = await Blogs.findOne({ where: { slug: blogSlug } });
    blogId = blogInfo.id;
    if (!blogInfo) {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  await Comments.create({
    userId: userId,
    comment: comment,
    blogId: blogId,
    commentSlug: commentSlug,
  })
    .then(function (value) {
      res.status(200).json({ message: "Comment is Created", value });
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
}

async function deleteComments(req, res) {
  const commentSlug = req.body.comment_slug;

  await Comments.destroy({
    where: { commentSlug: commentSlug },
  })
    .then(function (value) {
      res.status(200).json({ Message: "Comment is deleted", value });
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
}

async function editComments(req, res) {
  const commentSlug = req.body.comment_slug;
  const newComment = req.body.comment_user;

  await Comments.update(
    { comment: newComment },
    { where: { commentSlug: commentSlug } }
  )
    .then(function (value) {
      res.status(200).json({ Message: "Comment is edited", value });
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
}

const commentsController = {
  getAllComments,
  postComments,
  editComments,
  deleteComments,
  getCommentsbyBlogsTitle,
};
export default commentsController;

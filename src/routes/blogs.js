import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import blogController from "../controllers/blogs/blog";
import { createblogValidator, updateblogValidator } from "../middleware/blogs";
import { validate } from "../middleware/auth";

const blogRoutes = Router();

// ---------------------Blog------------------------------
//get all blog
blogRoutes.get("/", blogController.getAllBlog);
//get blog by authorname
blogRoutes.get("/:author_name", blogController.getBlogbyAuthorName);
//get blog by title
blogRoutes.post("/title", blogController.getBlogbyTitle);
//add blog
blogRoutes.post(
  "/",
  isAuthenticated,
  createblogValidator,
  validate,
  blogController.addBlog
);
//update blog
blogRoutes.put("/", isAuthenticated, blogController.updateBlog);
//delete blog
blogRoutes.delete("/", isAuthenticated, blogController.deleteBlog);

export default blogRoutes;

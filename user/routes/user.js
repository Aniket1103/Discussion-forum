import express from "express";
import { 
  register,
  login,
  logout,
  currentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  searchUsers
 } from "../controllers/user.js"
import { isAuthenticated } from "../middleware/auth.js";
import { errorMiddleware } from "../middleware/error.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/current").get(isAuthenticated, currentUser);
router.route("/logout").get(logout);

router.route("/getAll").get(isAuthenticated, getAllUsers, errorMiddleware);
router.route("/update").patch(isAuthenticated, updateUser, errorMiddleware);
router.route("/delete").delete(isAuthenticated, deleteUser, errorMiddleware);

router.route("/search").get(isAuthenticated, searchUsers);
router.route("/follow").post(isAuthenticated, followUser);
router.route("/unfollow").post(isAuthenticated, unfollowUser);

export default router;
import { Router } from "express";
import { validateToken } from "../middlewares/auth"; // validate if the user is authenticated
import {
  getPublicVideos,
  getUserVideos,
  loginUser,
  registerUser,
  deleteUserVideos,
  addCommentToVideo,
  likeOrUnlikeVideo,
  uploadVideo,
  deleteComment,
  getLikesByVideoId,
  getCommentsByVideoId,
} from "../controllers/controllers";

export const router = Router();

router.get("/videos", getPublicVideos);

router.get("/videos/me", validateToken, getUserVideos);

router.get("/videos/getLikes/:videoId", validateToken, getLikesByVideoId);

router.get("/videos/comments/:videoId", validateToken, getCommentsByVideoId);

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/videos/upload", validateToken, uploadVideo);

router.post("/videos/comments/:videoId", validateToken, addCommentToVideo);

router.post("/videos/likes/:videoId", validateToken, likeOrUnlikeVideo);

router.delete("/videos/:videoId", validateToken, deleteUserVideos);

router.delete("/videos/comments/:commentId", validateToken, deleteComment);

import { VideoManagementUseCases } from "../../../application/useCases";
import { Request, Handler } from "express";
import { generateToken } from "../middlewares/auth";
import { VideoFileInterface } from "../../../domain/entities/entities";
export interface VideoManagementRequest extends Request {
  useCases: VideoManagementUseCases;
  userId?: object;
}

export const getPublicVideos: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  try {
    res.send(await useCases.getPublicVideos());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUserVideos: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const userId = req.userId["username"];

  try {
    res.send(await useCases.getUserVideos(userId));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const loginUser: Handler = async (req: VideoManagementRequest, res) => {
  const useCases = req.useCases;
  const { username, password } = req.body;

  try {
    const result = await useCases.loginUser(username, password);
    if (result) {
      const token = generateToken(result as string);
      res
        .setHeader("Authorization", token)
        .json({ token: token, message: "Login successful" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const uploadVideo: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const userId = req.userId["username"];
  const { title, description, credits, isPublic } = req.body;

  try {
    const files: VideoFileInterface = req["files"];

    if (!files || Object.keys(files).length !== 1) {
      return res.status(400).send("Number of files should be 1");
    }

    const videoCode: VideoFileInterface = Object.values(files)[0];

    if (!videoCode || videoCode instanceof Array) {
      return res.status(400).send("Invalid video file");
    }

    const result = await useCases.uploadVideo(
      userId,
      title,
      description,
      credits,
      isPublic,
      videoCode
    );

    return res.send({ result: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const registerUser: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;

  const { name, last_name, username, password, email } = req.body;
  try {
    await useCases.registerUser(name, last_name, username, password, email);

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteUserVideos: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const userId = req.userId["username"];

  const { videoId } = req.params;
  try {
    const success = await useCases.deleteVideo(userId, videoId);
    res.send({ success });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const addCommentToVideo: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const { content } = req.body;
  const { videoId } = req.params;
  const userId = req.userId["username"];

  try {
    const success = await useCases.addCommentToVideo(userId, videoId, content);
    res.send({ success });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const likeOrUnlikeVideo: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const { videoId } = req.params;
  const userId = req.userId["username"];

  try {
    const success = await useCases.likeOrUnlikeVideo(userId, videoId);
    res.send({ success });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteComment: Handler = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const { commentId } = req.params;
  const userId = req.userId["username"];
  try {
    const success = await useCases.deleteComment(userId, commentId);
    res.send({ success });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getLikesByVideoId = async (req: VideoManagementRequest, res) => {
  const useCases = req.useCases;
  const { videoId } = req.params;
  try {
    res.send(await useCases.getLikesByVideoId(videoId));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getCommentsByVideoId = async (
  req: VideoManagementRequest,
  res
) => {
  const useCases = req.useCases;
  const { videoId } = req.params;
  try {
    res.send(await useCases.getCommentsByVideoId(videoId));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

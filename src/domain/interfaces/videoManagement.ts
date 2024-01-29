import { Video, Like, Comment } from "../entities/entities";

export interface VideoManagementInterface {
  getPublicVideos(): Promise<Video[] | Error>;
  getUserVideos(userId: string): Promise<Video[] | Error>;

  registerUser(
    name: string,
    last_name: string,
    username: string,
    password: string,
    email: string
  ): Promise<boolean | Error>;

  loginUser(username: string, password: string): Promise<string | Error>;

  uploadVideo(
    userId: string,
    title: string,
    description: string,
    credits: string,
    isPublic: boolean,
    url: string
  ): Promise<string | Error>;

  addCommentToVideo(
    userId: string,
    videoId: string,
    content: string
  ): Promise<boolean | Error>;

  getLikesByVideoId(videoId: string): Promise<Like[] | Error>;

  getCommentsByVideoId(videoId: string): Promise<Comment[] | Error>;

  likeOrUnlikeVideo(userId: string, videoId: string): Promise<boolean | Error>;

  deleteUser(userId: string): Promise<boolean | Error>;

  deleteVideo(userId: string, videoId: string): Promise<boolean | Error>;

  deleteComment(userId: string, commentId: string): Promise<boolean | Error>;
}

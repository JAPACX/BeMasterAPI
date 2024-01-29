import { VideoManagementInterface } from "../domain/interfaces/videoManagement";
import { FileInterface } from "../domain/interfaces/files";
import {
  Video,
  Like,
  Comment,
  VideoFileInterface,
} from "../domain/entities/entities";
import {
  generateUUID,
  isAlphanumeric,
  isValidEmail,
  isStrongPassword,
} from "../domain/utils/utils";

export class VideoManagementUseCases {
  constructor(
    private videoRepository: VideoManagementInterface,
    private fileRepository: FileInterface
  ) {}

  static create(
    videoRepository: VideoManagementInterface,
    fileRepository: FileInterface
  ): VideoManagementUseCases {
    return new VideoManagementUseCases(videoRepository, fileRepository);
  }

  async getPublicVideos(): Promise<Video[] | Error> {
    return this.videoRepository.getPublicVideos();
  }

  async getUserVideos(userId: string): Promise<Video[] | Error> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return this.videoRepository.getUserVideos(userId);
  }

  async registerUser(
    name: string,
    last_name: string,
    username: string,
    password: string,
    email: string
  ): Promise<boolean | Error> {
    if (!name || !last_name || !username || !password || !email) {
      throw new Error("All fields are required!");
    }

    if (
      name.length < 3 ||
      last_name.length < 3 ||
      username.length < 3 ||
      email.length < 3
    ) {
      throw new Error("All fields must have at least 3 characters");
    }

    if (password.length > 15) {
      throw new Error("Password cannot exceed 15 characters");
    }

    if (username.includes(" ")) {
      throw new Error("Username cannot contain spaces");
    }

    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation) {
      throw new Error(
        "Password must be 5 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one number"
      );
    }

    const usernameValidation = isAlphanumeric(username);
    if (!usernameValidation) {
      throw new Error("Username must only contain letters and numbers");
    }

    const emailValidation = isValidEmail(email);
    if (!emailValidation) {
      throw new Error("Invalid email format or length exceeds 30 characters");
    }

    await this.videoRepository.registerUser(
      name,
      last_name,
      username,
      password,
      email
    );

    return true;
  }

  async loginUser(username: string, password: string): Promise<string | Error> {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    if (username.length < 3 || password.length < 3) {
      throw new Error("All fields must have at least 3 characters");
    }

    if (username.includes(" ")) {
      throw new Error("Username cannot contain spaces");
    }

    const userId = await this.videoRepository.loginUser(username, password);

    if (userId) {
      return userId;
    } else {
      throw new Error("Invalid username or password");
    }
  }

  async uploadVideo(
    userId: string,
    title: string,
    description: string,
    credits: string,
    isPublic: boolean,
    file: VideoFileInterface
  ): Promise<string | Error> {
    if (!title || !file) {
      throw new Error("Title and video file are required");
    }

    const filename = file.name;

    const fileExtension = filename.split(".").pop()?.toLowerCase();
    if (
      !fileExtension ||
      !["mp4", "mov", "avi", "flv", "wmv", "mpeg", "mpg"].includes(
        fileExtension
      )
    ) {
      throw new Error("Invalid file extension");
    }

    const fileSize: number = parseInt(file.size);
    const maxFileSize: number = 100 * 1024 * 1024; // 100 MB
    if (fileSize > maxFileSize) {
      throw new Error("File size exceeds the maximum allowed");
    }

    try {
      const uuid = generateUUID();

      const localPath = await this.fileRepository.local_save(
        file,
        uuid + "." + fileExtension
      );

      // example if you want to upload to server, this function is void and returns nothing
      await this.fileRepository.server_save(
        localPath,
        uuid + "." + fileExtension
      );

      const result = await this.videoRepository.uploadVideo(
        userId,
        title,
        description,
        credits,
        isPublic,
        localPath
      );
      return result;
    } catch (error) {
      return new Error("Error uploading video: " + error.message);
    }
  }

  async addCommentToVideo(
    userId: string,
    videoId: string,
    content: string
  ): Promise<boolean | Error> {
    if (!videoId || !content) {
      throw new Error("Video ID and comment content are required");
    }

    if (content.length > 500) {
      throw new Error("Comment content is too long");
    }

    await this.videoRepository.addCommentToVideo(userId, videoId, content);
    return true;
  }

  async likeOrUnlikeVideo(
    userId: string,
    videoId: string
  ): Promise<boolean | Error> {
    if (!videoId) {
      return new Error("Video ID is required");
    }

    await this.videoRepository.likeOrUnlikeVideo(userId, videoId);
    return true;
  }

  async deleteUser(userId: string): Promise<boolean | Error> {
    if (!userId) {
      return new Error("User ID is required");
    }

    await this.videoRepository.deleteUser(userId);
    return true;
  }

  async deleteVideo(userId: string, videoId: string): Promise<boolean | Error> {
    if (!videoId) {
      throw new Error("Video ID is required");
    }

    await this.videoRepository.deleteVideo(userId, videoId);
    return true;
  }

  async deleteComment(
    userId: string,
    commentId: string
  ): Promise<boolean | Error> {
    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    await this.videoRepository.deleteComment(userId, commentId);
    return true;
  }

  async getLikesByVideoId(videoId: string): Promise<Like[] | Error> {
    if (!videoId) {
      throw new Error("Video ID is required");
    }

    return this.videoRepository.getLikesByVideoId(videoId);
  }

  async getCommentsByVideoId(videoId: string): Promise<Comment[] | Error> {
    if (!videoId) {
      throw new Error("Video ID is required");
    }

    return this.videoRepository.getCommentsByVideoId(videoId);
  }
}

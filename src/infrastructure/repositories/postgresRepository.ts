import { VideoManagementInterface } from "../../domain/interfaces/videoManagement";
import { Video, Like, Comment } from "../../domain/entities/entities";
import { Sequelize, QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";

export class PostgresRepository implements VideoManagementInterface {
  private pool: Sequelize;

  constructor(pool: Sequelize) {
    this.pool = pool;
  }

  async getPublicVideos(): Promise<Video[] | Error> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM videos WHERE is_public = true",
        { type: QueryTypes.SELECT }
      );

      return result as Video[];
    } catch (error) {
      throw new Error("Failed to fetch public videos");
    }
  }

  async getUserVideos(userId: string): Promise<Video[] | Error> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM videos WHERE user_id = '${userId}'`,
        { type: QueryTypes.SELECT }
      );
      return result as Video[];
    } catch (error) {
      throw new Error("Failed to fetch user videos");
    }
  }

  async registerUser(
    name: string,
    last_name: string,
    username: string,
    password: string,
    email: string
  ): Promise<boolean | Error> {
    try {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      await this.pool.query(
        `INSERT INTO users (name, last_name, username, password_hash, email)
        VALUES ('${name}', '${last_name}', '${username}', '${hashedPassword}', '${email}');`,
        { type: QueryTypes.INSERT }
      );

      return true;
    } catch (error) {
      throw new Error("User already exists");
    }
  }
  async loginUser(username: string, password: string): Promise<string | Error> {
    try {
      const userResult = await this.pool.query(
        `SELECT user_id, password_hash FROM users WHERE username = ?;`,
        {
          replacements: [username],
          type: QueryTypes.SELECT,
        }
      );

      if (userResult.length === 1) {
        const user_id = userResult[0]["user_id"];
        const password_hash = userResult[0]["password_hash"];

        const passwordMatch = await bcrypt.compare(password, password_hash);

        if (passwordMatch) {
          return user_id;
        } else {
          throw new Error("Incorrect password");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }

  async uploadVideo(
    userId: string,
    title: string,
    description: string,
    credits: string,
    isPublic: boolean,
    url: string
  ): Promise<string | Error> {
    try {
      await this.pool.query(
        `INSERT INTO videos (user_id, title, description, credits, is_public, url)
         VALUES ('${userId}', '${title}', '${description}', '${credits}', '${isPublic}', '${url}');`,
        { type: QueryTypes.INSERT }
      );

      return `Local Path where the video was saved: ${url}`;
    } catch (error) {
      throw new Error(`Failed to save info to database: ${error.message}`);
    }
  }

  async addCommentToVideo(
    userId: string,
    videoId: string,
    content: string
  ): Promise<boolean | Error> {
    try {
      await this.pool.query(
        `INSERT INTO comments (user_id, content, video_id)
       VALUES ('${userId}', '${content}', '${videoId}');`,
        { type: QueryTypes.INSERT }
      );
      return true;
    } catch (error) {
      throw new Error("Failed to add comment");
    }
  }

  async likeOrUnlikeVideo(
    userId: string,
    videoId: string
  ): Promise<boolean | Error> {
    try {
      await this.pool.query(
        `INSERT INTO likes (user_id, video_id) 
       VALUES ('${userId}', '${videoId}');`,
        { type: QueryTypes.INSERT }
      );
      return true;
    } catch (error) {
      throw new Error("Failed to like/unlike video");
    }
  }

  async deleteUser(userId: string): Promise<boolean | Error> {
    try {
      await this.pool.query(`DELETE FROM users WHERE user_id = '${userId}';`, {
        type: QueryTypes.DELETE,
      });
      return true;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }

  async deleteVideo(userId: string, videoId: string): Promise<boolean | Error> {
    try {
      const result = await this.pool.query(
        `DELETE FROM videos WHERE user_id = '${userId}' AND video_id = '${videoId}' RETURNING *;`,
        { type: QueryTypes.DELETE }
      );

      if (!result["length"]) {
        throw new Error("Video does not exist or you are not the owner");
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }

  async deleteComment(
    userId: string,
    commentId: string
  ): Promise<boolean | Error> {
    try {
      const result = await this.pool.query(
        `DELETE FROM comments WHERE user_id = '${userId}' AND comment_id = '${commentId}' RETURNING *;`,
        { type: QueryTypes.DELETE }
      );

      if (!result["length"]) {
        throw new Error("Comment does not exist or you are not the owner");
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  async getLikesByVideoId(videoId: string): Promise<Like[] | Error> {
    try {
      return await this.pool.query(
        `SELECT * FROM likes WHERE video_id = '${videoId}' WHERE is_liked = true;`,
        { type: QueryTypes.SELECT }
      );
    } catch (error) {
      throw new Error(`Failed to get likes: ${error.message}`);
    }
  }

  async getCommentsByVideoId(videoId: string): Promise<Comment[] | Error> {
    try {
      return await this.pool.query(
        `SELECT * FROM comments WHERE video_id = '${videoId}';`,
        { type: QueryTypes.SELECT }
      );
    } catch (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }
}

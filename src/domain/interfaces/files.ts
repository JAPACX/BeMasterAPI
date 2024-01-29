import { VideoFileInterface } from "../entities/entities";

export interface FileInterface {
  local_save(file: VideoFileInterface, filename: string): Promise<string>;
  server_save(localPath: string, serverPath: string): Promise<boolean>;
}

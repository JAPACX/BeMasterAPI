import { FileInterface } from "../../domain/interfaces/files";
import * as path from "path";
import { VideoFileInterface } from "../../domain/entities/entities";

export class FileRepository implements FileInterface {
  async local_save(
    file: VideoFileInterface,
    filename: string
  ): Promise<string> {
    const destinationPath = path.join(
      __dirname,
      "../../cloudStorage",
      filename
    );

    await file.mv(destinationPath, (error) => {
      if (error) {
        throw new Error("Failed to upload file");
      }
    });

    return destinationPath;
  }

  async server_save(_localPath: string, _serverPath: string): Promise<boolean> {
    // Upload the file to the server logic
    // eslint-disable-next-line no-console

    return true;
  }
}

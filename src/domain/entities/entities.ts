export class User {
  constructor(
    public userId?: string,
    public name?: string,
    public lastName?: string,
    public username?: string,
    public email?: string,
    public passwordHash?: string
  ) {}
}

export class Video {
  constructor(
    public videoId?: string,
    public title?: string,
    public description?: string,
    public credits?: string,
    public publishDate?: Date,
    public isPublic?: boolean,
    public userId?: string,
    public comments?: Comment[],
    public likes?: Like[],
    public url?: string
  ) {}
}

export class Comment {
  constructor(
    public commentId?: string,
    public content?: string,
    public userId?: string,
    public videoId?: string,
    public createdAt?: Date
  ) {}
}

export class Like {
  constructor(
    public likeId?: string,
    public userId?: string,
    public videoId?: string,
    public isLike?: boolean,
    public createdAt?: Date
  ) {}
}

export interface VideoFileInterface {
  name: string;
  data: string;
  size: string;
  mv: (a, b) => void;
}

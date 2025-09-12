import User from "./user.js";

export default class Spectator extends User {
  constructor(
    username,
    name,
    email,
    password,
    bio,
    followers,
    following,
    profilePhotoUrl,
    bannerUrl,
    phone,
    posts,
    subscribedGames,
    birthDate,
    favoriteTeamId
  ) {
    super(
      username,
      name,
      email,
      password,
      bio,
      followers,
      following,
      profilePhotoUrl,
      bannerUrl,
      phone,
      posts,
      subscribedGames
    );
    this.birthDate = birthDate;
    this.favoriteTeamId = favoriteTeamId;
  }
}
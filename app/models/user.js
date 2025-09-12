export default class User {
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
    subscribedGames
  ) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
    this.bio = bio;
    this.followers = followers;
    this.following = following;
    this.profilePhotoUrl = profilePhotoUrl;
    this.bannerUrl = bannerUrl;
    this.phone = phone;
    this.posts = posts;
    this.subscribedGames = subscribedGames;
  }
}

import Header from "@/app/components/Header";
import ProfileHeader from "@/app/components/ProfileHeader";
import PostCard from "@/app/components/PostCard";
import { notFound } from "next/navigation";
import Player from "@/app/models/player";
import Organization from "@/app/models/organization";
import Spectator from "@/app/models/spectator";

async function getUserData(id) {
  const res = await fetch(`http://localhost:3000/api/users/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }
  return res.json();
}

// Helper to create user instance from plain object
function createUserInstance(userData) {
  if (!userData) return null;
  switch (userData.type) {
    case "player":
      return new Player(...Object.values(userData));
    case "organization":
      return new Organization(...Object.values(userData));
    case "spectator":
      return new Spectator(...Object.values(userData));
    default:
      return null;
  }
}

export default async function ProfilePage({ params }) {
  const id = params.id;
  const { user: userData, posts } = await getUserData(id);

  const user = createUserInstance(userData);

  if (!user) {
    return notFound();
  }

  const userPosts = posts.map((post) => ({
    ...post,
    name: user.name,
    username: user.username,
    profilePhotoUrl: user.profilePhotoUrl,
  }));

  const loggedInUserId = "formiga"; // Simulate logged-in user

  return (
    <div>
      <Header />
      <main
        className="
        container 
        mx-auto 
        p-4 
        md:p-8 
        lg:p-12  
        max-w-4xl
      "
      >
        <ProfileHeader user={user} loggedInUserId={loggedInUserId} />

        <section className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Publicações
          </h3>
          <div className="flex flex-col gap-6">
            {userPosts.map((post) => (
              <PostCard key={`${user.username}-${post.id}`} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

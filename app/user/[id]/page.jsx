"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import ProfileHeader from "@/app/components/ProfileHeader";
import PostCard from "@/app/components/PostCard";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const {
    user: loggedInUser,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      return;
    }

    const fetchProfileData = async () => {
      if (!loggedInUser || !loggedInUser.profileId) {
        setLoading(false);
        setError("User data not available.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const postsResponse = await api.posts.getByAuthor(
          loggedInUser.profileId
        );
        setPosts(postsResponse.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [loggedInUser, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <p>Carregando conta...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <h1 className="text-red-500 text-2xl">Error: {error}</h1>
        </main>
      </div>
    );
  }

  const userPosts = posts.map((post) => ({
    ...post,
    name: loggedInUser.name,
    username: loggedInUser.username,
    profilePhotoUrl: loggedInUser.profilePhotoUrl || "/icons/user-default.png",
  }));

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
        <ProfileHeader
          user={loggedInUser}
          loggedInUserId={loggedInUser.profileId}
        />

        <section className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Publicações
          </h3>
          <div className="flex flex-col gap-6">
            {userPosts.map((post) => (
              <PostCard
                key={`${loggedInUser.username}-${post.id}`}
                post={post}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

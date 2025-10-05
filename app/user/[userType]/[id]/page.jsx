"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/components/Header";
import ProfileHeader from "@/app/components/ProfileHeader";
import PostList from "@/app/components/PostList";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const {
    user: loggedInUser,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();

  const { userType, id } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    if (!id || !userType) {
      setLoading(false);
      setError("ID ou tipo de usuário não fornecido.");
      return;
    }

    setLoading(true);
    setError(null);

    let fetchedUser = null;
    const lowerCaseUserType = userType.toLowerCase();

    try {
      switch (lowerCaseUserType) {
        case "player":
          fetchedUser = await api.players.getById(id);
          break;
        case "organization":
          fetchedUser = await api.organizations.getById(id);
          break;
        case "spectator":
          fetchedUser = await api.spectators.getById(id);
          break;
        default:
          throw new Error("Tipo de usuário inválido.");
      }

      if (!fetchedUser) {
        throw new Error("Usuário não encontrado.");
      }

      const isOwnProfile =
        loggedInUser &&
        loggedInUser.userId === fetchedUser.userId &&
        loggedInUser.userType.toLowerCase() === lowerCaseUserType;

      const updatedProfileUser = {
        ...fetchedUser,
        userType: lowerCaseUserType.toUpperCase(),
      };

      // Buscar listas de seguidores e seguindo
      let followersListResponse;
      let followingListResponse;

      if (isOwnProfile) {
        followersListResponse = await api.follow.getMyFollowers();
        followingListResponse = await api.follow.getMyFollowing();
      } else {
        // Usa userId para endpoints públicos
        followersListResponse = await api.follow.getFollowers(
          fetchedUser.userId,
          userType.toUpperCase()
        );
        followingListResponse = await api.follow.getFollowing(
          fetchedUser.userId,
          userType.toUpperCase()
        );
      }

      // Sempre usar as contagens das listas retornadas
      updatedProfileUser.followersList = followersListResponse.content || [];
      updatedProfileUser.followingList = followingListResponse.content || [];
      updatedProfileUser.followers = followersListResponse.totalElements || updatedProfileUser.followersList.length;
      updatedProfileUser.following = followingListResponse.totalElements || updatedProfileUser.followingList.length;

      setProfileUser(updatedProfileUser);

      const postsResponse = await api.posts.getByAuthor(id);

      const filteredPosts = (postsResponse.content || []).filter(
        (post) => post.authorType.toLowerCase() === lowerCaseUserType
      );
      setPosts(filteredPosts);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message || "Falha ao carregar o perfil. Tente novamente.");
      setProfileUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && id && userType) {
      fetchProfileData();
    }
  }, [id, userType, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <p>Carregando perfil...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <h1 className="text-red-500 text-2xl">Erro: {error}</h1>
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <h1 className="text-red-500 text-2xl">Perfil não encontrado.</h1>
        </main>
      </div>
    );
  }

  const handleFollowChange = () => {
    fetchProfileData();
  };

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
          user={profileUser}
          loggedInUser={loggedInUser}
          onFollowChange={handleFollowChange}
        />

        <section className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Publicações
          </h3>
          <PostList posts={posts} profileUser={profileUser} />
        </section>
      </main>
    </div>
  );
}

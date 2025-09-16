"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

  const { id } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Se não estiver autenticado e o carregamento da autenticação terminou, redireciona para o login
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      if (!id) {
        setLoading(false);
        setError("ID do usuário não fornecido.");
        return;
      }

      setLoading(true);
      setError(null);

      let fetchedUser = null;
      let userType = null;

      try {
        // Tenta buscar como Player
        try {
          fetchedUser = await api.players.getById(id);
          userType = "PLAYER";
        } catch (playerErr) {
          // Tenta buscar como Organization
          try {
            fetchedUser = await api.organizations.getById(id);
            userType = "ORGANIZATION";
          } catch (orgErr) {
            // Tenta buscar como Spectator
            try {
              fetchedUser = await api.spectators.getById(id);
              userType = "SPECTATOR";
            } catch (specErr) {
              throw new Error("Usuário não encontrado.");
            }
          }
        }

        if (!fetchedUser) {
          throw new Error("Usuário não encontrado.");
        }

        setProfileUser({ ...fetchedUser, userType });

        const postsResponse = await api.posts.getByAuthor(id);
        setPosts(postsResponse.posts || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Falha ao carregar o perfil. Tente novamente.");
        setProfileUser(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchProfileData();
    }
  }, [id, isAuthenticated, authLoading, router]);

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

  const userPosts = posts.map((post) => ({
    ...post,
    name: profileUser.name,
    username: profileUser.username,
    profilePhotoUrl: profileUser.profilePhotoUrl || "/icons/user-default.png",
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
          user={profileUser}
          loggedInUserId={loggedInUser?.profileId}
        />

        <section className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Publicações
          </h3>
          <div className="flex flex-col gap-6">
            {userPosts.map((post) => (
              <PostCard
                key={`${profileUser.username}-${post.id}`}
                post={post}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

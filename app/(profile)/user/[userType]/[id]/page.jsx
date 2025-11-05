"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import PlayerStats from "@/app/components/profile/PlayerStats";
import PostList from "@/app/components/lists/PostList";
import ProfileTabs from "@/app/components/ProfileTabs";
import TeamList from "@/app/components/profile/TeamList";
import GameList from "@/app/components/profile/GameList";
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
  const [playerStats, setPlayerStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ranking");
  const [tabLoading, setTabLoading] = useState({
    posts: false,
    teams: false,
    games: false,
  });
  const [loadedTabs, setLoadedTabs] = useState({
    posts: false,
    teams: false,
    games: false,
  });

  // Extrair valores estáveis do loggedInUser para evitar re-renders
  const loggedInUserId = loggedInUser?.userId;
  const loggedInUserType = loggedInUser?.userType;

  // Fetch tab data lazily
  const fetchTabData = useCallback(
    async (tab) => {
      if (!profileUser || !id) return;

      const lowerCaseUserType = userType.toLowerCase();

      try {
        switch (tab) {
          case "posts":
            // Check if already loaded
            setLoadedTabs((prev) => {
              if (prev.posts) return prev;

              // Set loading state
              setTabLoading((loading) => ({ ...loading, posts: true }));

              // Fetch data
              api.posts
                .getByAuthor(id)
                .then((postsResponse) => {
                  const filteredPosts = (postsResponse.content || []).filter(
                    (post) => post.authorType.toLowerCase() === lowerCaseUserType
                  );
                  setPosts(filteredPosts);
                  setTabLoading((loading) => ({ ...loading, posts: false }));
                })
                .catch((err) => {
                  console.error("Error fetching posts:", err);
                  setTabLoading((loading) => ({ ...loading, posts: false }));
                });

              return { ...prev, posts: true };
            });
            break;

          case "teams":
            if (lowerCaseUserType !== "player") return;

            setLoadedTabs((prev) => {
              if (prev.teams) return prev;

              setTabLoading((loading) => ({ ...loading, teams: true }));

              // For now, we'll fetch all teams and filter by player
              // In a real scenario, there should be an API endpoint like /players/{id}/teams
              api.teams
                .getAll({ size: 100 })
                .then((allTeamsResponse) => {
                  setTeams(allTeamsResponse.content || []);
                  setTabLoading((loading) => ({ ...loading, teams: false }));
                })
                .catch((err) => {
                  console.error("Error fetching teams:", err);
                  setTabLoading((loading) => ({ ...loading, teams: false }));
                });

              return { ...prev, teams: true };
            });
            break;

          case "games":
            setLoadedTabs((prev) => {
              if (prev.games) return prev;

              setTabLoading((loading) => ({ ...loading, games: true }));

              let gamesPromise;
              if (lowerCaseUserType === "player") {
                // Get games by player participation
                gamesPromise = api.gameParticipants.getByPlayer(id, {
                  size: 50,
                });
              } else if (lowerCaseUserType === "organization") {
                // Get games hosted by organization
                gamesPromise = api.games.getByOrganization(id, {
                  size: 50,
                });
              } else if (lowerCaseUserType === "spectator") {
                // Get games spectated
                gamesPromise = api.games.mySpectatorSubscriptions({
                  size: 50,
                });
              }

              if (gamesPromise) {
                gamesPromise
                  .then((gamesResponse) => {
                    setGames(gamesResponse.content || []);
                    setTabLoading((loading) => ({ ...loading, games: false }));
                  })
                  .catch((err) => {
                    console.error("Error fetching games:", err);
                    setTabLoading((loading) => ({ ...loading, games: false }));
                  });
              }

              return { ...prev, games: true };
            });
            break;

          default:
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${tab} data:`, err);
        setTabLoading((prev) => ({ ...prev, [tab]: false }));
      }
    },
    [profileUser, id, userType]
  );

  // Trigger tab data fetch when activeTab changes
  useEffect(() => {
    if (profileUser && activeTab !== "ranking") {
      fetchTabData(activeTab);
    }
  }, [activeTab, profileUser, fetchTabData]);

  const fetchProfileData = useCallback(async () => {
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
          try {
            const ranking = await api.rankings.getPlayerRanking(id);
            setPlayerStats(ranking);
          } catch (rankingError) {
            // Erro 404/500 é esperado quando jogadora ainda não tem ranking
            // (não participou de jogos competitivos)
            setPlayerStats(null);
          }
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
        loggedInUserId &&
        loggedInUserId === fetchedUser.userId &&
        loggedInUserType?.toLowerCase() === lowerCaseUserType;

      const updatedProfileUser = {
        ...fetchedUser,
        userType: lowerCaseUserType.toUpperCase(),
      };

      // Buscar listas de seguidores e seguindo com tratamento de erro
      let followersListResponse = { content: [], totalElements: 0 };
      let followingListResponse = { content: [], totalElements: 0 };

      try {
        if (isOwnProfile) {
          // Para o próprio perfil, usar endpoints privados
          followersListResponse = await api.follow.getMyFollowers();
          followingListResponse = await api.follow.getMyFollowing();
        } else {
          // Para outros perfis, usar endpoints públicos com userId
          if (fetchedUser.userId) {
            // Tenta buscar seguidores (endpoint público usa userId)
            try {
              followersListResponse = await api.follow.getFollowers(
                fetchedUser.userId,
                userType.toUpperCase()
              );
            } catch (followersError) {
              console.error("Erro ao buscar seguidores:", followersError);
              // Mantém valores padrão
            }

            // Tenta buscar seguindo (endpoint público usa userId)
            try {
              followingListResponse = await api.follow.getFollowing(
                fetchedUser.userId,
                userType.toUpperCase()
              );
            } catch (followingError) {
              console.error("Erro ao buscar seguindo:", followingError);
              // Mantém valores padrão
            }
          }
        }
      } catch (followError) {
        console.error("Erro ao buscar dados de follow:", followError);
        // Continua com valores padrão
      }

      // Sempre usar as contagens das listas retornadas
      updatedProfileUser.followersList = followersListResponse.content || [];
      updatedProfileUser.followingList = followingListResponse.content || [];
      updatedProfileUser.followers =
        followersListResponse.totalElements ||
        updatedProfileUser.followersList.length;
      updatedProfileUser.following =
        followingListResponse.totalElements ||
        updatedProfileUser.followingList.length;

      setProfileUser(updatedProfileUser);

      // Posts will be loaded lazily when the posts tab is activated
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message || "Falha ao carregar o perfil. Tente novamente.");
      setProfileUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [id, userType, loggedInUserId, loggedInUserType]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && id && userType) {
      fetchProfileData();
    }
  }, [id, userType, isAuthenticated, authLoading, fetchProfileData]);

  if (authLoading || loading) {
    return (
      <div>
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <p>Carregando perfil...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <h1 className="text-red-500 text-2xl">Erro: {error}</h1>
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div>
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <h1 className="text-red-500 text-2xl">Perfil não encontrado.</h1>
        </main>
      </div>
    );
  }

  const handleFollowChange = () => {
    fetchProfileData();
  };

  const handleGameUpdate = () => {
    // Refetch games when a game is updated
    setGames([]);
    fetchTabData("games");
  };

  // Calculate tab counts
  const tabCounts = {
    ranking: profileUser?.userType === "PLAYER" ? 1 : 0,
    posts: posts.length,
    teams: teams.length,
    games: games.length,
  };

  // Render tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "ranking":
        if (profileUser.userType === "PLAYER") {
          return (
            <section
              role="tabpanel"
              id="ranking-panel"
              aria-labelledby="ranking-tab"
              tabIndex={0}
            >
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                Estatísticas e Ranking
              </h3>
              <PlayerStats stats={playerStats} />
            </section>
          );
        }
        return (
          <div
            role="tabpanel"
            id="ranking-panel"
            aria-labelledby="ranking-tab"
            tabIndex={0}
            className="bg-surface-muted border border-default rounded-xl p-8 text-center"
          >
            <p className="text-secondary">
              Ranking disponível apenas para jogadoras.
            </p>
          </div>
        );

      case "posts":
        return (
          <section
            role="tabpanel"
            id="posts-panel"
            aria-labelledby="posts-tab"
            tabIndex={0}
          >
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Publicações
            </h3>
            {tabLoading.posts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-accent border-t-transparent"></div>
                <span className="ml-3 text-secondary font-medium">
                  Carregando publicações...
                </span>
              </div>
            ) : (
              <PostList posts={posts} profileUser={profileUser} />
            )}
          </section>
        );

      case "teams":
        return (
          <section
            role="tabpanel"
            id="teams-panel"
            aria-labelledby="teams-tab"
            tabIndex={0}
          >
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Times
            </h3>
            <TeamList teams={teams} isLoading={tabLoading.teams} />
          </section>
        );

      case "games":
        return (
          <section
            role="tabpanel"
            id="games-panel"
            aria-labelledby="games-tab"
            tabIndex={0}
          >
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Jogos
            </h3>
            <GameList
              games={games}
              isLoading={tabLoading.games}
              onGameUpdate={handleGameUpdate}
            />
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
        <ProfileHeader
          user={profileUser}
          loggedInUser={loggedInUser}
          onFollowChange={handleFollowChange}
        />

        {/* Profile Tabs */}
        <section className="mt-8">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={tabCounts}
          />
        </section>

        {/* Tab Content */}
        <section className="mt-6">{renderTabContent()}</section>
      </main>
    </div>
  );
}

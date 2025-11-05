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
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import ErrorState from "@/app/components/ui/ErrorState";
import { User } from "lucide-react";

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

  // Helper function to fetch posts
  const fetchPosts = useCallback(async (userId, lowerCaseUserType) => {
    try {
      const postsResponse = await api.posts.getByAuthor(userId);
      const filteredPosts = (postsResponse.content || []).filter(
        (post) => post.authorType.toLowerCase() === lowerCaseUserType
      );
      setPosts(filteredPosts);
      setLoadedTabs((prev) => ({ ...prev, posts: true }));
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, []);

  // Helper function to fetch teams
  const fetchTeams = useCallback(async (userId, lowerCaseUserType) => {
    if (lowerCaseUserType !== "player") return;

    try {
      const allTeamsResponse = await api.teams.getAll({ size: 100 });
      setTeams(allTeamsResponse.content || []);
      setLoadedTabs((prev) => ({ ...prev, teams: true }));
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  }, []);

  // Helper function to fetch games (following games/calendar pattern)
  const fetchGames = useCallback(async (userId, lowerCaseUserType) => {
    try {
      let gamesData = [];

      if (lowerCaseUserType === "player") {
        // Get player participations
        const participationsResponse = await api.gameParticipants.getByPlayer(
          userId,
          { size: 100 }
        );
        const participations = participationsResponse.content || [];

        // Extract game IDs from participations
        const gameIds = participations
          .map((p) => p.gameId || p.game?.id)
          .filter(Boolean);

        if (gameIds.length > 0) {
          // Fetch all games and filter by participation
          const allGamesResponse = await api.games.getAll({
            page: 0,
            size: 1000,
          });
          const allGames = allGamesResponse.content || [];

          gamesData = allGames
            .filter((game) => gameIds.includes(game.id))
            .map((game) => ({ ...game, isJoined: true }));
        }
      } else if (lowerCaseUserType === "organization") {
        // Get games hosted by organization
        const gamesResponse = await api.games.getByOrganization(userId, {
          size: 100,
        });
        gamesData = gamesResponse.content || [];
      } else if (lowerCaseUserType === "spectator") {
        // Get games spectated
        const gamesResponse = await api.games.mySpectatorSubscriptions({
          size: 100,
        });
        gamesData = gamesResponse.content || [];
      }

      // Sort by date
      gamesData.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));

      setGames(gamesData);
      setLoadedTabs((prev) => ({ ...prev, games: true }));
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  }, []);

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

      // Fetch ALL tab data upfront (posts, teams, games) for tab counts
      await Promise.allSettled([
        fetchPosts(id, lowerCaseUserType),
        fetchTeams(id, lowerCaseUserType),
        fetchGames(id, lowerCaseUserType),
      ]);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message || "Falha ao carregar o perfil. Tente novamente.");
      setProfileUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [
    id,
    userType,
    loggedInUserId,
    loggedInUserType,
    fetchPosts,
    fetchTeams,
    fetchGames,
  ]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && id && userType) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userType, isAuthenticated, authLoading]);

  // Define callbacks BEFORE early returns (Rules of Hooks)
  const handleFollowChange = useCallback(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleGameUpdate = useCallback(() => {
    // Refetch games when a game is updated
    if (profileUser && id && userType) {
      const lowerCaseUserType = userType.toLowerCase();
      fetchGames(id, lowerCaseUserType);
    }
  }, [profileUser, id, userType]);

  // Determine if ranking tab should be shown (only for PLAYER)
  const showRankingTab = profileUser?.userType === "PLAYER";

  // Calculate tab counts
  const tabCounts = {
    posts: posts.length,
    teams: teams.length,
    games: games.length,
  };

  const renderTabContent = useCallback(() => {
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
              <LoadingSkeleton count={3} variant="post" />
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
  }, [
    activeTab,
    profileUser,
    playerStats,
    tabLoading,
    posts,
    teams,
    games,
    handleGameUpdate,
  ]);

  // Early returns AFTER all hooks
  if (authLoading || loading) {
    return (
      <div>
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <LoadingSkeleton count={1} variant="card" className="h-48 mb-8" />
          <LoadingSkeleton count={3} variant="post" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <ErrorState
            title="Erro ao carregar perfil"
            message={error}
            onRetry={() => window.location.reload()}
            variant="error"
          />
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div>
        <main className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
          <ErrorState
            icon={<User />}
            title="Perfil não encontrado"
            message="O perfil que você está procurando não existe ou foi removido."
            variant="warning"
          />
        </main>
      </div>
    );
  }

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
            showRankingTab={showRankingTab}
          />
        </section>

        {/* Tab Content */}
        <section className="mt-6">{renderTabContent()}</section>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import PostCard from "@/app/components/cards/PostCard";
import SearchBar from "@/app/components/ui/SearchBar";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

function Feed() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const abortRef = useRef(null);

  useEffect(() => {
    const fetchResults = async (pageToLoad = 0, replace = false) => {
      try {
        if (pageToLoad === 0 && !replace) setLoading(true);
        if (pageToLoad > 0) setLoadingMore(true);
        setError(null);

        if (abortRef.current) {
          try {
            abortRef.current.abort();
          } catch (e) {}
        }
        const controller = new AbortController();
        abortRef.current = controller;

        const q = searchTerm.trim();

        const filters = selectedFilters || [];

        let usersAccum = [];
        let postsAccum = [];

        const guarded = async (fn) => {
          const res = await fn();
          if (controller.signal.aborted) throw new Error("aborted");
          return res;
        };

        if (q && filters.length === 0) {
          const p = await guarded(() =>
            api.players.search(q, { page: 0, size: 5 })
          );
          usersAccum = usersAccum.concat(
            (p.content || []).map((u) => ({ ...u, _type: "player" }))
          );

          const s = await guarded(() =>
            api.spectators.search(q, { page: 0, size: 5 })
          );
          usersAccum = usersAccum.concat(
            (s.content || []).map((u) => ({ ...u, _type: "spectator" }))
          );

          const o = await guarded(() =>
            api.organizations.search(q, { page: 0, size: 5 })
          );
          usersAccum = usersAccum.concat(
            (o.content || []).map((u) => ({ ...u, _type: "organization" }))
          );

          // posts after users
          const postsRes = await guarded(() =>
            api.posts.search(q, { page: 0, size: 20 })
          );
          postsAccum = postsRes.content || [];
          // disable infinite scroll when searching
          setHasMore(false);
        } else if (q && filters.length > 0) {
          // For each selected filter, call respective search
          const promises = [];
          if (filters.includes("posts")) {
            promises.push(
              guarded(() => api.posts.search(q, { page: 0, size: 20 })).then(
                (r) => ({ kind: "posts", data: r.content || [] })
              )
            );
          }
          if (filters.includes("players")) {
            promises.push(
              guarded(() => api.players.search(q, { page: 0, size: 20 })).then(
                (r) => ({
                  kind: "players",
                  data: (r.content || []).map((u) => ({
                    ...u,
                    _type: "player",
                  })),
                })
              )
            );
          }
          if (filters.includes("spectators")) {
            promises.push(
              guarded(() =>
                api.spectators.search(q, { page: 0, size: 20 })
              ).then((r) => ({
                kind: "spectators",
                data: (r.content || []).map((u) => ({
                  ...u,
                  _type: "spectator",
                })),
              }))
            );
          }
          if (filters.includes("organizations")) {
            promises.push(
              guarded(() =>
                api.organizations.search(q, { page: 0, size: 20 })
              ).then((r) => ({
                kind: "organizations",
                data: (r.content || []).map((u) => ({
                  ...u,
                  _type: "organization",
                })),
              }))
            );
          }

          const results = await Promise.all(promises);
          results.forEach((res) => {
            if (res.kind === "posts") postsAccum = postsAccum.concat(res.data);
            else usersAccum = usersAccum.concat(res.data);
          });
        } else {
          // paginated fetch when no search/filters
          const postsRes = await guarded(() =>
            api.posts.getAll({ page: pageToLoad, size })
          );
          postsAccum = postsRes.content || [];
          // determine hasMore
          if (postsRes.totalPages != null && postsRes.number != null) {
            setHasMore(postsRes.number < postsRes.totalPages - 1);
          } else {
            setHasMore((postsRes.content || []).length === size);
          }
        }

        setUserResults(usersAccum);
        setPosts((prev) =>
          pageToLoad === 0 ? postsAccum : prev.concat(postsAccum)
        );
      } catch (err) {
        if (err.message === "aborted") return;
        console.error("Erro ao carregar resultados:", err);
        setError(err.message || "Falha ao carregar resultados.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      const handler = setTimeout(() => {
        // if searching or filtering, do a fresh fetch
        if (searchTerm.trim() || selectedFilters.length > 0) {
          setPage(0);
          fetchResults(0, true);
        } else {
          setPage(0);
          setPosts([]);
          fetchResults(0, true);
        }
      }, 500);

      return () => {
        clearTimeout(handler);
        if (abortRef.current) {
          try {
            abortRef.current.abort();
          } catch (e) {}
        }
      };
    } else if (!authLoading && !isAuthenticated) {
      setError("Você precisa estar logado para ver o feed.");
      setLoading(false);
    }
  }, [searchTerm, isAuthenticated, authLoading, selectedFilters]);

  // infinite scroll observer
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            // fetch next page
            (async () => {
              try {
                setLoadingMore(true);
                const res = await api.posts.getAll({ page: nextPage, size });
                const nextPosts = res.content || [];
                setPosts((prev) => prev.concat(nextPosts));
                if (res.totalPages != null && res.number != null) {
                  setHasMore(res.number < res.totalPages - 1);
                } else {
                  setHasMore(nextPosts.length === size);
                }
              } catch (err) {
                console.error(err);
              } finally {
                setLoadingMore(false);
              }
            })();
          }
        });
      },
      { rootMargin: "200px" }
    );

    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [sentinelRef.current, hasMore, loadingMore, loading, page, size]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFiltersChange = (filters) => {
    setSelectedFilters(filters || []);
  };

  const getUserTypeLabel = (type) => {
    const types = {
      player: "Jogadora",
      organization: "Organização",
      spectator: "Espectador",
    };
    return types[type] || type;
  };

  return (
    <>
      <main
        className="
        container 
        mx-auto 
        p-3 sm:p-4 md:p-8 lg:p-12 
        max-w-md sm:max-w-4xl
        min-h-screen
      "
        aria-busy={loading}
      >
        <h1
          className="
          text-4xl 
          font-extrabold 
          text-primary
          leading-tight
          mb-8
          text-center
        "
        >
          Feed
        </h1>

        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onFiltersChange={handleFiltersChange}
            selectedFilters={selectedFilters}
          />
        </div>

        {loading && <LoadingSkeleton count={3} />}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <section className="flex flex-col gap-6" aria-live="polite">
            {userResults.length > 0 && (
              <div className="bg-surface border border-default p-4 rounded-md shadow-elevated">
                <h3 className="font-semibold text-primary mb-2">Usuários</h3>
                <div className="flex flex-col gap-3">
                  {userResults.map((u) => (
                    <div
                      key={`${u._type}-${u.id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={u.profilePhoto || "/icons/user-default.png"}
                        alt={u.name || u.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <a
                          href={`/user/${u._type}/${u.id}`}
                          className="font-medium text-accent hover:text-accent-strong transition-colors"
                        >
                          {u.name || u.username}
                        </a>
                        <div className="text-sm text-secondary">
                          {getUserTypeLabel(u._type)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-secondary">
                Nenhum post encontrado.
              </p>
            )}
            {/* sentinel for infinite scroll */}
            <div ref={sentinelRef} />
            {loadingMore && <LoadingSkeleton count={1} />}
          </section>
        )}
      </main>

      <Link
        href="/feed/newPost"
        aria-label="Criar novo post"
        className="
        fixed 
        bottom-4 
        right-4 
        sm:bottom-6 
        sm:right-6
        p-3 
        sm:p-4 
        rounded-full 
        bg-accent 
        text-on-brand 
        shadow-lg
        hover:bg-accent-strong
        transition-colors
        duration-200
        z-40
      "
      >
        <Plus className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2} />
      </Link>
    </>
  );
}

export default function FeedPage() {
  return <Feed />;
}

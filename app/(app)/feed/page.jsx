"use client";

import { useState } from "react";
import PostCard from "@/app/components/cards/PostCard";
import SearchBar from "@/app/components/ui/SearchBar";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import { Plus } from "lucide-react";
import Modal from "@/app/components/ui/Modal";
import NewPostForm from "@/app/components/feed/NewPostForm";
import useFeed from "@/app/hooks/useFeed";

function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    posts,
    userResults,
    loading,
    loadingMore,
    hasMore,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    setSelectedFilters,
    sentinelRef,
    error,
    prependPost,
  } = useFeed({ initialSize: 10 });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFiltersChange = (filters) => setSelectedFilters(filters || []);

  const getUserTypeLabel = (type) => {
    const types = {
      player: "Jogadora",
      organization: "Organização",
      spectator: "Espectador",
    };
    return types[type] || type;
  };

  return (
    <div>
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
            <div ref={sentinelRef} />
            {loadingMore && <LoadingSkeleton count={1} />}
          </section>
        )}
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
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
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Publicação"
      >
        <NewPostForm
          onSuccess={(created) => {
            if (created) prependPost(created);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default function FeedPage() {
  return <Feed />;
}

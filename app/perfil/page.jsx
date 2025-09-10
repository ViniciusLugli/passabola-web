import Header from "@/app/components/Header";
import ProfileHeader from "@/app/components/ProfileHeader";
import PostCard from "@/app/components/PostCard";
import vascoBanner from "@/app/media/vasco-banner.png";
import vascoLogo from "@/app/media/vasco-logo.png";

const mockUser = {
  name: "Vasco da Gama",
  username: "vascoDaGama",
  bannerUrl: vascoBanner,
  avatarUrl: vascoLogo,
  followers: "5000",
  following: "150",
  games: "50",
};

const mockPosts = [
  {
    id: 1,
    name: "Vasco da Gama",
    username: "vascoDaGama",
    avatarUrl: vascoLogo,
    content:
      "Donec vestibulum leo quis sem fringilla fermentum. Donec porttitor iaculis semper. Sed volutpat lectus ultricies, auctor sem sit amet, tincidunt nulla. Nunc ut mollis enim, quis finibus odio. Donec auctor imperdiet lectus a suscipit. Cras condimentum enim dictum posuere iaculis. Cras vitae accumsan dolor.",
    likes: 1000,
  },
  {
    id: 2,
    name: "Vasco da Gama",
    username: "vascoDaGama",
    avatarUrl: vascoLogo,
    content:
      "Donec vestibulum leo quis sem fringilla fermentum. Sed volutpat lectus ultricies, auctor sem sit amet, tincidunt nulla. Nunc ut mollis enim, quis finibus odio. Donec auctor imperdiet lectus a suscipit. Cras condimentum enim dictum posuere iaculis. Cras vitae accumsan dolor.",
    likes: 500,
  },
];

export default function ProfilePage() {
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
        mt-4 md:mt-8 
        max-w-4xl
      "
      >
        <ProfileHeader user={mockUser} />

        <section className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Suas publicações
          </h3>
          <div className="flex flex-col gap-6">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
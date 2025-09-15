import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

function PostCard({ post }) {
  const profilePhotoUrl =
    post.authorProfilePhotoUrl || "/icons/user-default.png";

  return (
    <div
      className="
        w-full 
        bg-white 
        rounded-2xl 
        shadow-lg 
        p-6 
        flex 
        flex-col 
        gap-4
      "
    >
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={profilePhotoUrl}
            alt={`Avatar de ${post.authorUsername}`}
            fill
            sizes="(max-width: 768px) 100vw, 48px"
            className="object-cover"
          />
        </div>
        <div>
          <Link href={`/user/${post.authorId}`}>
            <h4 className="font-bold text-lg text-gray-900 leading-tight hover:underline cursor-pointer">
              {post.authorUsername}{" "}
            </h4>
          </Link>
          <p className="text-sm text-gray-500">{post.authorRole}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-md">{post.content}</p>

      {post.imageUrl && (
        <div className="relative w-full h-64 mt-2 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl || "/icons/banner-default.jpeg"}
            alt="Imagem do post"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="
        flex 
        items-center 
        gap-2 
        text-gray-500 
        cursor-pointer
        transition-all 
        duration-200 
        hover:text-red-500 
        hover:scale-100
        mt-2 pt-4 border-t border-gray-100
      "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span>{post.likes}</span>
      </div>
    </div>
  );
}

export default memo(PostCard);

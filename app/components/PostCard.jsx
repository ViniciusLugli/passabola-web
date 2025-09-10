import Image from "next/image";

export default function PostCard({ post }) {
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
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={post.avatarUrl}
            alt="Avatar do perfil"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900 leading-tight">
            {post.name}
          </h4>
          <p className="text-sm text-gray-500">@{post.username}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-md">{post.content}</p>
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

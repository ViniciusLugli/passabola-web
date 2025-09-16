import Image from "next/image";
import Link from "next/link";

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image
            src={post.authorProfilePhotoUrl || "/icons/user-default.png"}
            alt="Avatar do autor"
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <Link
            href={`/user/${post.authorRole.toLowerCase()}/${post.authorId}`}
          >
            <h4 className="font-bold text-lg text-gray-900 leading-tight hover:underline cursor-pointer">
              {post.authorUsername}{" "}
            </h4>
          </Link>
          <p className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.imageUrl && (
        <div className="relative w-full h-60 rounded-lg overflow-hidden mb-4">
          <Image
            src={post.imageUrl}
            alt="Imagem da publicação"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <div className="flex justify-between text-gray-600 text-sm">
        <div className="flex items-center">
          <span>{post.likes} Curtidas</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{post.comments} Comentários</span>
          <span>{post.shares} Compartilhamentos</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;

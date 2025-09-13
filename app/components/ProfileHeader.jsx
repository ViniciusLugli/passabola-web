
import Image from "next/image";
import Link from "next/link";
import Player from "@/app/models/player";
import Organization from "@/app/models/organization";

export default function ProfileHeader({ user }) {
  const isPlayer = user instanceof Player;
  const isOrganization = user instanceof Organization;

  return (
    <div className="w-full bg-white rounded-b-2xl shadow-xl overflow-hidden relative">
      {/* Banner/Capa - Imagem do Vasco */}
      <div className="relative w-full h-40 md:h-64">
        <Image
          src={user.bannerUrl}
          alt="Banner do perfil"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Conteúdo do Perfil */}
      <div className="p-4 md:p-8 relative">
        {/* Avatar e Botão de Configurações */}
        <div className="flex justify-between items-start">
          <div
            className="
            relative 
            -mt-12 md:-mt-24 
            w-24 h-24 md:w-36 md:h-36 
            rounded-full 
            border-4 
            border-white 
            overflow-hidden
          "
          >
            <Image
              src={user.profilePhotoUrl}
              alt="Avatar do perfil"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 24vw, 15vw"
            />
          </div>
          <Link href={`/perfil/${user.username}/config`} passHref>
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 md:w-8 md:h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.527.272 1.062.426 1.637.76l-.16.12c.03-.024.06-.048.09-.072zM12 15a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
            </button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
          <div className="flex-1 text-gray-900">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {user.name}
            </h1>
            <p className="text-md text-gray-500">@{user.username}</p>
          </div>

          <div
            className="
            mt-4 md:mt-0 
            flex 
            justify-around 
            md:justify-end 
            md:gap-8 
            w-full 
            md:w-auto
          "
          >
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {user.followers}
              </p>
              <p className="text-sm text-gray-500">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {user.following}
              </p>
              <p className="text-sm text-gray-500">Seguindo</p>
            </div>
            {(isPlayer || isOrganization) && (
              <div className="text-center">
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {user.subscribedGames}
                </p>
                <p className="text-sm text-gray-500">Jogos</p>
              </div>
            )}
            {isPlayer && (
              <div className="text-center">
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {user.pastOrganization.length}
                </p>
                <p className="text-sm text-gray-500">Organizações</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

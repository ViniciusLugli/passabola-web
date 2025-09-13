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
          <Link href={`/user/${user.username}/config`} passHref>
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <img
                src="/icons/config.svg"
                alt="Configurações"
                className="w-6 h-6 md:w-8 md:h-8"
              />
            </button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
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

        <div className="mt-4">
          <p className="text-gray-700">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}

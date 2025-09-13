"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Modal from "@/app/components/Modal";

export default function ConfigForm({ user }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (passwordConfirm) {
      console.log("Saving form data:", formData);
      alert("Informações salvas com sucesso!");
      setIsModalOpen(false);
    } else {
      alert("Por favor, insira sua senha para confirmar.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações do Perfil</h1>
        <p className="text-gray-500 mb-8">Atualize suas informações pessoais.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Nome de Exibição"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <Input
            label="Nome de Usuário"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled // Usually username is not changeable
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <div className="md:col-span-2">
            <Input
              label="Telefone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-100 border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
                  value={formData.bio}
                  onChange={handleInputChange}
              ></textarea>
          </div>

          <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Segurança</h2>
              <Input
                  label="Nova Senha"
                  type="password"
                  name="password"
                  placeholder="Deixe em branco para não alterar"
              />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-800 text-white font-bold rounded-lg hover:bg-purple-900 transition-colors shadow-md"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Alterações</h2>
        <p className="text-gray-600 mb-6">Para sua segurança, por favor, insira sua senha para confirmar as alterações.</p>
        <Input
          label="Senha"
          type="password"
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmSave}
            className="px-8 py-3 bg-purple-800 text-white font-bold rounded-lg hover:bg-purple-900 transition-colors shadow-md"
          >
            Confirmar
          </button>
        </div>
      </Modal>
    </>
  );
}
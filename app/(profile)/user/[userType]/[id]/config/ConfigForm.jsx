"use client";

import Input from "@/app/components/ui/Input";
import ConfirmSaveModal from "./ConfirmSaveModal";
import { useConfigForm } from "./useConfigForm";
import { X } from "lucide-react";

export default function ConfigForm({ userId, userType }) {
  const {
    router,
    formData,
    loading,
    error,
    isModalOpen,
    passwordConfirm,
    newPassword,
    setIsModalOpen,
    setPasswordConfirm,
    setNewPassword,
    handleInputChange,
    handleSubmit,
    handleConfirmSave,
  } = useConfigForm(userId, userType);

  if (loading) {
    return <p>Carregando configurações...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="bg-surface border border-default rounded-2xl shadow-elevated p-6 md:p-10 relative">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        <h1 className="text-3xl font-bold text-primary mb-2">
          Configurações do Perfil
        </h1>
        <p className="text-secondary mb-8">
          Atualize suas informações pessoais.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
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
            disabled
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
            <Input
              label="Bio"
              type="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="md:col-span-2 border-t border-default pt-6 mt-4">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Segurança
            </h2>
            <Input
              label="Nova Senha"
              type="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Deixe em branco para não alterar"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-surface-muted text-secondary font-semibold rounded-lg border border-default hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-accent hover:bg-accent-strong font-bold rounded-lg transition-all duration-200 shadow-elevated cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      <ConfirmSaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        passwordConfirm={passwordConfirm}
        setPasswordConfirm={setPasswordConfirm}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '@/app/components/AuthLayout';
import Input from '@/app/components/Input';
import Link from 'next/link';

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    username: '',
    displayName: '',
    cnpj: '',
  });

  useEffect(() => {
    if (role && role !== 'jogadora' && role !== 'organização') {
      router.push('/register');
    }
  }, [role, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isOrganization = role === 'organização';

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log('Dados do formulário finalizados:', formData);
      router.push('/login');
    }
  };

  const step1Fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Senha' },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirme sua senha',
    },
  ];

  const step2Fields = [
    { name: 'dateOfBirth', type: 'date', placeholder: 'Data de nascimento' },
    { name: 'username', type: 'text', placeholder: 'Nome de usuário' },
    { name: 'displayName', type: 'text', placeholder: 'Nome de exibição' },
  ];

  const orgStep1Fields = [
    { name: 'cnpj', type: 'text', placeholder: 'CNPJ' },
    { name: 'password', type: 'password', placeholder: 'Senha' },
    { name: 'confirmPassword', type: 'password', placeholder: 'Confirme sua senha' },
  ];

  const orgStep2Fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'displayName', type: 'text', placeholder: 'Nome de exibição' },
    { name: 'username', type: 'text', placeholder: 'Nome de usuário' },
  ];

  const renderFields = () => {
    let fields = [];
    if (isOrganization) {
      fields = currentStep === 1 ? orgStep1Fields : orgStep2Fields;
    } else {
      fields = currentStep === 1 ? step1Fields : step2Fields;
    }

    return fields.map((field) => (
      <motion.div key={field.name} variants={itemVariants}>
        <Input
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          value={formData[field.name]}
          onChange={handleInputChange}
        />
      </motion.div>
    ));
  };

  if (!role) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthLayout>
      <motion.div
        className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl text-center flex flex-col gap-6 sm:gap-8 md:gap-10 w-full"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6"
          variants={itemVariants}
        >
          Bem-vindo ao <span className="text-purple-700">Passa a Bola</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold mb-4 sm:mb-6"
          variants={itemVariants}
        >
          Insira suas informações...
        </motion.p>

        <form onSubmit={handleNextStep} className="flex flex-col gap-4 sm:gap-6">
          {renderFields()}

          <motion.div variants={itemVariants} className="mt-4 sm:mt-6">
            <button
              type="submit"
              className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-4 sm:py-5 rounded-xl text-xl sm:text-2xl transition-colors duration-300 shadow-lg"
            >
              {currentStep === 1 ? 'CONTINUAR' : 'CRIAR CONTA'}
            </button>
          </motion.div>
        </form>

        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 md:mt-10 pt-6 border-t border-gray-200 flex flex-col items-center gap-3"
        >
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            Já tem cadastro?
          </p>
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-800 font-bold text-lg sm:text-xl transition-colors duration-200 flex items-center gap-2"
          >
            Faça seu login!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}

export default function RegisterInfoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

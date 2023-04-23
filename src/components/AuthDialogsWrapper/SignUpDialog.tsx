import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAuth } from '@/contexts/AuthContext'

const signUpFormSchema = z
  .object({
    username: z.string().min(4, 'O nome deve ter no mínimo 4 caracteres'),
    email: z.string().email('O e-mail deve ser válido'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirm: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: 'A confirmação de senha e a senha devem ser iguais',
    path: ['password'],
  })

type SignUpFormInput = z.infer<typeof signUpFormSchema>

interface SignUpDialogProps {
  onSignInOpenChange: (open: boolean) => void
  onSignUpOpenChange: (open: boolean) => void
}

export function SignUpDialog({
  onSignInOpenChange,
  onSignUpOpenChange,
}: SignUpDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    reset,
  } = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpFormSchema),
  })

  const { signUp } = useAuth()
  const [hasSignUp, setHasSignUp] = useState(false)

  async function handleSignUp({ confirm, ...data }: SignUpFormInput) {
    clearErrors()

    const code = await signUp(data)

    if (code === 'auth/success') {
      setHasSignUp(true)

      reset()
    } else if (code === 'auth/email-already-exists') {
      setError('email', { message: 'Este e-mail já está em uso' })
    } else {
      setError('root', {
        message: 'Algo deu errado. Por favor, tente novamente mais tarde',
      })
    }
  }

  function handleSignInDialogOpen() {
    onSignUpOpenChange(false)
    onSignInOpenChange(true)
  }

  return (
    <>
      <Image
        src="https://media.discordapp.net/attachments/826681789677436950/1097633179264876564/Logo_atualizada.png"
        width={248}
        height={1}
        alt="Logo"
      />

      <h1 className="text-lg font-medium tracking-wider text-white">
        Crie uma conta
      </h1>

      <form className="w-full space-y-6" onSubmit={handleSubmit(handleSignUp)}>
        <fieldset className="flex flex-col justify-start">
          <label
            className="block mb-2.5 text-base text-white"
            htmlFor="username"
          >
            Nome
          </label>
          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="username"
            {...register('username')}
          />
          {errors.username && (
            <div className="mt-1">
              <span className="font-bold text-red-500">
                {errors.username?.message}
              </span>
            </div>
          )}
        </fieldset>
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base text-white" htmlFor="email">
            E-mail
          </label>
          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="email"
            {...register('email')}
          />
          {errors.email && (
            <div className="mt-1">
              <span className="font-bold text-red-500">
                {errors.email?.message}
              </span>
            </div>
          )}
        </fieldset>
        <fieldset className="flex flex-col justify-start">
          <label
            className="block mb-2.5 text-base text-white"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="password"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <div className="mt-1">
              <span className="font-bold text-red-500">
                {errors.password?.message}
              </span>
            </div>
          )}
        </fieldset>
        <fieldset className="flex flex-col justify-start">
          <label
            className="block mb-2.5 text-base text-white"
            htmlFor="confirm"
          >
            Confirmar senha
          </label>
          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="confirm"
            type="password"
            {...register('confirm')}
          />
        </fieldset>
        <div className="flex justify-between items-center gap-4">
          {errors.root && (
            <span className="font-bold text-red-500">
              {errors.root?.message}
            </span>
          )}
          {hasSignUp && (
            <span className="font-bold text-green-400">
              Um link de confirmação foi enviado para o seu e-mail
            </span>
          )}

          <button
            className="h-10 inline-flex items-center justify-center px-6 ml-auto rounded-full font-medium transition-colors bg-amber-300 hover:bg-yellow-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cadastrar
          </button>
        </div>
      </form>

      <button
        className="font-semibold text-white hover:text-amber-300"
        onClick={handleSignInDialogOpen}
      >
        Já sou cadastrado! Acesssar conta existente...
      </button>
    </>
  )
}

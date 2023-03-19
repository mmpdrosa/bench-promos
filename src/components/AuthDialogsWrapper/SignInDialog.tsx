import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FcGoogle } from 'react-icons/fc'

import LogoImg from '@/assets/logo.svg'
import { useAuth } from '@/contexts/AuthContext'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type SignInFormInput = z.infer<typeof signInFormSchema>

interface SignInDialogProps {
  onSignInOpenChange: (open: boolean) => void
  onSignUpOpenChange: (open: boolean) => void
  onRecoverPasswordOpenChange: (open: boolean) => void
}

export function SignInDialog({
  onSignInOpenChange,
  onSignUpOpenChange,
  onRecoverPasswordOpenChange,
}: SignInDialogProps) {
  const { logIn } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormInput>({
    resolver: zodResolver(signInFormSchema),
  })

  async function handleSignIn(data: SignInFormInput) {
    clearErrors()

    try {
      await logIn(data)

      reset()

      onSignInOpenChange(false)
    } catch (err: any) {
      let message

      if (err.code === 'auth/user-not-found') {
        message = 'Email não encontrado.'
      } else if (err.code === 'auth/wrong-password') {
        message = 'Email ou senha incorretos.'
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas. Por favor, tente novamente mais tarde.'
      } else {
        message = 'Algo deu errado. Por favor, tente novamente mais tarde.'
      }

      setError('root', { message })
    }
  }

  function handleRecoverPassword() {
    onSignInOpenChange(false)
    onRecoverPasswordOpenChange(true)
  }

  function handleSignUpDialogOpen() {
    onSignInOpenChange(false)
    onSignUpOpenChange(true)
  }

  return (
    <>
      <Image src={LogoImg} width={248} alt="Logo" />

      <h1 className="text-lg font-medium tracking-wider text-white">
        Faça seu login
      </h1>

      <form className="w-full space-y-6" onSubmit={handleSubmit(handleSignIn)}>
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base text-white" htmlFor="email">
            Email
          </label>
          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="email"
            {...register('email')}
          />
        </fieldset>
        <fieldset className="flex flex-col justify-start">
          <div className="flex justify-between">
            <label
              className="block mb-2.5 text-base text-white"
              htmlFor="password"
            >
              Senha
            </label>
            <a
              className="text-zinc-300 cursor-pointer hover:text-amber-300"
              onClick={handleRecoverPassword}
            >
              Esqueceu sua senha?
            </a>
          </div>

          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="password"
            type="password"
            {...register('password')}
          />
        </fieldset>
        <div className="flex justify-between items-center">
          <span className="font-bold text-red-500">{errors.root?.message}</span>
          <button
            className={`h-10 inline-flex items-center justify-center px-6 rounded-full font-medium transition-colors bg-amber-300 hover:bg-yellow-400 ${
              isSubmitting && 'cursor-not-allowed'
            }`}
          >
            Entrar
          </button>
        </div>

        <div className="flex justify-center">
          <button className="p-1 rounded-full bg-white">
            <FcGoogle className="text-5xl" />
          </button>
        </div>
      </form>

      <div className="flex justify-between pt-8">
        <button
          className="text-white font-semibold hover:text-amber-300"
          onClick={handleSignUpDialogOpen}
        >
          Não possui conta? Cadastrar
        </button>
      </div>
    </>
  )
}

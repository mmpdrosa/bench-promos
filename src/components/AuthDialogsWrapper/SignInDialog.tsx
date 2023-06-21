import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { z } from 'zod'

import { useAuth } from '@/contexts/AuthContext'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
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
  const { logIn, logInWithGoogle } = useAuth()

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

    const code = await logIn(data)

    if (code === 'auth/success') {
      reset()

      onSignInOpenChange(false)

      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    } else {
      if (code === 'auth/email-not-verified') {
        setError('email', { message: 'E-mail não verificado' })
      } else if (code === 'auth/user-not-found') {
        setError('email', { message: 'E-mail ou senha incorretos' })
      } else if (code === 'auth/wrong-password') {
        setError('email', { message: 'E-mail ou senha incorretos' })
      } else if (code === 'auth/too-many-requests') {
        setError('root', {
          message: 'Muitas tentativas. Por favor, tente novamente mais tarde',
        })
      } else {
        setError('root', {
          message: 'Algo deu errado. Por favor, tente novamente mais tarde',
        })
      }
    }
  }

  async function handleSignInWithGoogle() {
    await logInWithGoogle()

    onSignInOpenChange(false)

    if (Notification.permission === 'default') {
      Notification.requestPermission()
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
      <div className="relative h-28 w-60 shrink-0">
        <Image
          className="object-contain"
          src="https://media.discordapp.net/attachments/826681789677436950/1097633179264876564/Logo_atualizada.png"
          fill
          alt="Logo"
        />
      </div>

      <h1 className="text-lg font-medium tracking-wider text-white">
        Faça seu login
      </h1>

      <form className="w-full space-y-6" onSubmit={handleSubmit(handleSignIn)}>
        <fieldset className="flex flex-col justify-start">
          <label className="mb-2.5 block text-base text-white" htmlFor="email">
            E-mail
          </label>
          <input
            className="h-10 border-b border-white bg-transparent px-2.5 text-lg text-white outline-none"
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
          <div className="flex justify-between">
            <label
              className="mb-2.5 block text-base text-white"
              htmlFor="password"
            >
              Senha
            </label>
            <a
              className="cursor-pointer text-zinc-300 hover:text-amber-300"
              onClick={handleRecoverPassword}
            >
              Esqueceu sua senha?
            </a>
          </div>
          <input
            className="h-10 border-b border-white bg-transparent px-2.5 text-lg text-white outline-none"
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
        <div className="flex items-center justify-between">
          <span className="font-bold text-red-500">{errors.root?.message}</span>
          <button
            className="inline-flex h-10 items-center justify-center rounded-full bg-amber-300 px-6 font-medium transition-colors disabled:cursor-not-allowed hover:bg-yellow-400"
            disabled={isSubmitting}
          >
            Entrar
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-full bg-white p-1"
            onClick={handleSignInWithGoogle}
          >
            <FcGoogle className="text-5xl" />
          </button>
        </div>
      </form>

      <div className="flex justify-between pt-8">
        <button
          className="font-semibold text-white hover:text-amber-300"
          onClick={handleSignUpDialogOpen}
        >
          Não possui conta? Cadastrar
        </button>
      </div>
    </>
  )
}

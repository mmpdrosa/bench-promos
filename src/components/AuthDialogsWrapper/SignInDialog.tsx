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
      <Image
        src="https://media.discordapp.net/attachments/826681789677436950/1097633179264876564/Logo_atualizada.png?width=550&height=253"
        width={248}
        height={1}
        alt="Logo"
      />

      <h1 className="text-lg font-medium tracking-wider text-white">
        Faça seu login
      </h1>

      <form className="w-full space-y-6" onSubmit={handleSubmit(handleSignIn)}>
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
          {errors.password && (
            <div className="mt-1">
              <span className="font-bold text-red-500">
                {errors.password?.message}
              </span>
            </div>
          )}
        </fieldset>
        <div className="flex justify-between items-center">
          <span className="font-bold text-red-500">{errors.root?.message}</span>
          <button
            className="h-10 inline-flex items-center justify-center px-6 rounded-full font-medium transition-colors bg-amber-300 hover:bg-yellow-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Entrar
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="p-1 rounded-full bg-white"
            onClick={handleSignInWithGoogle}
          >
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

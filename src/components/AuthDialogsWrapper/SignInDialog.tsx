import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
      <form className="space-y-6" onSubmit={handleSubmit(handleSignIn)}>
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base" htmlFor="email">
            Email
          </label>
          <input
            className="h-10 px-2.5 rounded text-lg outline-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px] focus:shadow-violet-800"
            id="email"
            {...register('email')}
          />
        </fieldset>
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base" htmlFor="password">
            Senha
          </label>
          <input
            className="h-10 px-2.5 rounded text-lg outline-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px] focus:shadow-violet-800"
            id="password"
            type="password"
            {...register('password')}
          />
        </fieldset>
        <div className="flex justify-between items-center">
          <span className="font-bold text-red-500">{errors.root?.message}</span>
          <button
            className={`h-10 inline-flex items-center justify-center px-6 rounded font-medium outline-none bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-200 ${
              isSubmitting && 'cursor-not-allowed'
            }`}
          >
            Entrar
          </button>
        </div>
      </form>

      <div className="flex justify-between pt-8">
        <button
          className="font-semibold hover:text-violet-500"
          onClick={handleRecoverPassword}
        >
          Esqueceu sua senha?
        </button>

        <button
          className="font-semibold hover:text-violet-500"
          onClick={handleSignUpDialogOpen}
        >
          Não possui conta? Cadastrar
        </button>
      </div>
    </>
  )
}

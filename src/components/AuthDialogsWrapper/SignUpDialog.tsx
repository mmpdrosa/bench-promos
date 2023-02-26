import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signUpFormSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: 'As senhas não são iguais.',
    path: ['confirm'],
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
    formState: { errors },
  } = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpFormSchema),
  })

  async function handleSignUp(data: SignUpFormInput) {
    console.log(data)
  }

  function handleSignInDialogOpen() {
    onSignUpOpenChange(false)
    onSignInOpenChange(true)
  }

  console.log(errors)

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(handleSignUp)}>
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base" htmlFor="username">
            Nome
          </label>
          <input
            className="h-10 px-2.5 rounded text-lg outline-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px] focus:shadow-violet-800"
            id="username"
            {...register('username')}
          />
        </fieldset>
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
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base" htmlFor="confirm">
            Confirmar senha
          </label>
          <input
            className="h-10 px-2.5 rounded text-lg outline-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px] focus:shadow-violet-800"
            id="confirm"
            type="password"
            {...register('confirm')}
          />
        </fieldset>
        <div className="flex justify-between items-center">
          <span className="font-bold text-red-500">
            {errors.confirm?.message}
          </span>
          <button className="h-10 inline-flex items-center justify-center px-6 rounded font-medium outline-none bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-200">
            Cadastrar
          </button>
        </div>
      </form>

      <button
        className="font-semibold hover:text-violet-500"
        onClick={handleSignInDialogOpen}
      >
        Já sou cadastrado! Acesssar conta existente...
      </button>
    </>
  )
}

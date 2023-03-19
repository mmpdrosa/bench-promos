import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import LogoImg from '@/assets/logo.svg'

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
      <Image src={LogoImg} width={248} alt="Logo" />

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
        </fieldset>
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
        <div className="flex justify-between items-center">
          <span className="font-bold text-red-500">
            {errors.confirm?.message}
          </span>
          <button className="h-10 inline-flex items-center justify-center px-6 rounded-full font-medium transition-colors bg-amber-300 hover:bg-yellow-400">
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

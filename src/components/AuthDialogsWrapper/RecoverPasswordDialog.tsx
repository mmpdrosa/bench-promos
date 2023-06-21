export function RecoverPasswordDialog() {
  return (
    <>
      <h1 className="mb-8 text-center text-sm font-bold text-white">
        Por favor, preencha o campo abaixo e em instantes receberá um e-mail
        contendo as instruções para recuperar sua conta.
      </h1>
      <form className="w-full space-y-6">
        <fieldset className="flex flex-col justify-start">
          <label className="mb-2.5 block text-base text-white" htmlFor="email">
            Email
          </label>
          <input
            className="h-10 border-b border-white bg-transparent px-2.5 text-lg text-white outline-none"
            id="email"
          />
        </fieldset>
        <div className="flex justify-end">
          <button className="inline-flex h-10 items-center justify-center rounded-full bg-amber-300 px-6 font-medium transition-colors hover:bg-yellow-400">
            Recuperar
          </button>
        </div>
      </form>
    </>
  )
}

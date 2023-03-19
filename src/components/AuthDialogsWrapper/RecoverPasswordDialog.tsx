export function RecoverPasswordDialog() {
  return (
    <>
      <h1 className="mb-8 text-center text-sm font-bold text-white">
        Por favor, preencha o campo abaixo e em instantes receberá um e-mail
        contendo as instruções para recuperar sua conta.
      </h1>
      <form className="w-full space-y-6">
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base text-white" htmlFor="email">
            Email
          </label>
          <input
            className="h-10 px-2.5 text-lg outline-none text-white border-b border-white bg-transparent"
            id="email"
          />
        </fieldset>
        <div className="flex justify-end">
          <button className="h-10 inline-flex items-center justify-center px-6 rounded-full font-medium transition-colors bg-amber-300 hover:bg-yellow-400">
            Recuperar
          </button>
        </div>
      </form>
    </>
  )
}

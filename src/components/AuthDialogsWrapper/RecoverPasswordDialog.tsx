export function RecoverPasswordDialog() {
  return (
    <>
      <h1 className="mb-8 text-center text-sm font-bold">
        Por favor, preencha o campo abaixo e em instantes receberá um e-mail
        contendo as instruções para recuperar sua conta.
      </h1>
      <form className="space-y-6">
        <fieldset className="flex flex-col justify-start">
          <label className="block mb-2.5 text-base" htmlFor="email">
            Email
          </label>
          <input
            className="h-10 px-2.5 rounded text-lg outline-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px] focus:shadow-violet-800"
            id="email"
          />
        </fieldset>
        <div className="flex justify-end">
          <button className="h-10 inline-flex items-center justify-center px-6 rounded font-medium outline-none bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-200">
            Recuperar
          </button>
        </div>
      </form>
    </>
  )
}

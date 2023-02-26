import { Dialog, DialogContent } from '@mui/material'
import { useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { RecoverPasswordDialog } from './RecoverPasswordDialog'
import { SignInDialog } from './SignInDialog'
import { SignUpDialog } from './SignUpDialog'
import { UserMenuAvatar } from './UserMenuAvatar'

export function AuthDialogsWrapper() {
  const { user } = useAuth()

  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [recoverPasswordOpen, setRecoverPasswordOpen] = useState(false)

  function handleSignInOpenChange(open: boolean) {
    setSignInOpen(open)
  }

  function handleSignUpOpenChange(open: boolean) {
    setSignUpOpen(open)
  }

  function handleRecoverPasswordOpenChange(open: boolean) {
    setRecoverPasswordOpen(open)
  }

  return (
    <>
      {!user ? (
        <button
          onClick={() => handleSignInOpenChange(true)}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-center bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-200"
        >
          Entrar
        </button>
      ) : (
        <UserMenuAvatar />
      )}

      <Dialog
        open={signInOpen}
        onClose={() => handleSignInOpenChange(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <SignInDialog
            onSignInOpenChange={handleSignInOpenChange}
            onSignUpOpenChange={handleSignUpOpenChange}
            onRecoverPasswordOpenChange={handleRecoverPasswordOpenChange}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={signUpOpen}
        onClose={() => handleSignUpOpenChange(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <SignUpDialog
            onSignInOpenChange={handleSignInOpenChange}
            onSignUpOpenChange={handleSignUpOpenChange}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={recoverPasswordOpen}
        onClose={() => handleRecoverPasswordOpenChange(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <RecoverPasswordDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

import { Dialog, DialogContent } from '@mui/material'
import { useState } from 'react'
import { RxChevronRight } from 'react-icons/rx'
import { HiOutlineUser } from 'react-icons/hi'

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
        <div
          className="group flex items-center gap-2 p-2 rounded-full bg-white bg-opacity-50 cursor-pointer"
          onClick={() => handleSignInOpenChange(true)}
        >
          <div className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white">
            <HiOutlineUser />
          </div>
          <span className="text-sm font-bold group-hover:underline">
            Entrar
          </span>
          <RxChevronRight />
        </div>
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

import { Dialog, DialogContent } from '@mui/material'
import { useState } from 'react'
import { HiOutlineUser } from 'react-icons/hi'
import { RxChevronRight } from 'react-icons/rx'

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
          title="Entrar"
          className="group flex cursor-pointer items-center gap-2 rounded-full bg-white p-1 dark:bg-zinc-800 dark:text-zinc-200 sm:bg-opacity-50 sm:p-2"
          onClick={() => handleSignInOpenChange(true)}
        >
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-800 dark:sm:bg-zinc-900">
            <HiOutlineUser className="dark:text-zinc-300" />
          </div>
          <span className="text-sm font-bold group-hover:underline max-sm:hidden">
            Entrar
          </span>
          <RxChevronRight className="max-sm:hidden" />
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
        <DialogContent className="flex flex-col items-center gap-6 bg-gradient-to-b from-black to-violet-500 py-8 font-sans sm:px-16">
          <SignInDialog
            onSignInOpenChange={handleSignInOpenChange}
            onSignUpOpenChange={handleSignUpOpenChange}
            onRecoverPasswordOpenChange={handleRecoverPasswordOpenChange}
          />
        </DialogContent>
      </Dialog>

      {/* <Modal
        isOpen={signInOpen}
        onRequestClose={() => handleSignInOpenChange(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 5,
          },
        }}
      >
        <SignInDialog
          onSignInOpenChange={handleSignInOpenChange}
          onSignUpOpenChange={handleSignUpOpenChange}
          onRecoverPasswordOpenChange={handleRecoverPasswordOpenChange}
        />
      </Modal> */}

      <Dialog
        open={signUpOpen}
        onClose={() => handleSignUpOpenChange(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent className="hover flex flex-col items-center gap-6 bg-gradient-to-b from-black to-violet-500 py-8 font-sans sm:px-16">
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
        <DialogContent className="flex flex-col items-center gap-6 bg-gradient-to-b from-black to-violet-500 py-8 font-sans sm:px-16">
          <RecoverPasswordDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

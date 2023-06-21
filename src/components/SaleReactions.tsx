import * as Popover from '@radix-ui/react-popover'
import { useEffect } from 'react'
import { MdAddReaction } from 'react-icons/md'
import { useQuery } from 'react-query'

import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

type EmojiMapping = {
  [key: string]: string
}

const emojiMapping: EmojiMapping = {
  like: '👍',
  dislike: '👎',
  clown: '🤡',
  shit: '💩',
  heart: '❤️',
  fire: '🔥',
  thinking: '🤔',
  rofl: '🤣',
}

interface SaleReactionsProps {
  saleId: string
  reactions?: { [key: string]: number }
}

type UserReactions = {
  sale_id: string
  content: string
}

export function SaleReactions({ saleId, reactions }: SaleReactionsProps) {
  const { user } = useAuth()

  async function handleAddReaction(reaction: string) {
    if (!user) return

    if (userReacted(saleId, reaction)) return

    const token = await user!.getIdToken()

    try {
      await api.post(
        `sales/${saleId}/reactions`,
        { content: reaction },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    } catch (err) {}

    queryClient.invalidateQueries('sales')
    queryClient.invalidateQueries(['user', 'reactions'])
  }

  async function handleToggleReaction(reaction: string) {
    if (!user) return

    const token = await user!.getIdToken()

    try {
      if (userReacted(saleId, reaction)) {
        await api.delete(`sales/${saleId}/reactions/${reaction}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await api.post(
          `sales/${saleId}/reactions`,
          { content: reaction },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      }
    } catch (err) {}

    queryClient.invalidateQueries('sales')
    queryClient.invalidateQueries(['user', 'reactions'])
  }

  const { data: userReactions, refetch } = useQuery({
    queryKey: ['user', 'reactions'],
    queryFn: async () => {
      if (!user) return

      const token = await user.getIdToken()

      const response = await api.get('/users/sales-reactions/for-all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userReactions: UserReactions[] = response.data

      return userReactions
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const userReacted = (saleId: string, reaction: string) =>
    userReactions?.some(
      (userReaction) =>
        userReaction.sale_id === saleId && userReaction.content === reaction,
    )

  return (
    <div className="flex gap-1 px-1">
      {Object.entries(reactions ?? {}).map(([key, value]) => (
        <div
          key={key}
          onClick={() => handleToggleReaction(key)}
          className={`aspect-square w-8 cursor-pointer rounded-full bg-violet-100 text-center transition-colors ${
            userReacted(saleId, key)
              ? 'bg-violet-400 text-white hover:bg-violet-400/80'
              : 'hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-500'
          }`}
        >
          <span className="block text-lg leading-none">
            {emojiMapping[key]}
          </span>
          <small className="block text-xs font-medium leading-none">
            {value}
          </small>
        </div>
      ))}

      {Object.entries(reactions ?? {}).length !==
        Object.entries(emojiMapping).length && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="border-bg-violet-100 flex aspect-square w-8 items-center justify-center rounded-full border bg-violet-100 text-center transition-colors hover:border-violet-400 dark:border-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-600">
              <MdAddReaction className="text-2xl hover:text-[26px]" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="h-8 rounded bg-white shadow dark:bg-zinc-600">
              <div className="flex">
                {Object.entries(emojiMapping).map(([key, emoji]) => (
                  <button
                    key={key}
                    onClick={() => handleAddReaction(key)}
                    className="flex aspect-square w-8 items-center justify-center hover:text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <Popover.Close />
              <Popover.Arrow
                height={8}
                width={16}
                className="fill-white shadow-sm dark:fill-zinc-600"
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  )
}

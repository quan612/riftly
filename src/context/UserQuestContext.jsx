import React, { useState, useEffect, useCallback } from 'react'

import { useDisclosure, useToast } from '@chakra-ui/react'
import Enums from '@enums/index'
import { doQuestUtility } from '@components/end-user/shared/doQuestUtility'
import { useUserQuestSubmit } from '@hooks/user/quest'
import { useRouter } from 'next/router'

export const UserQuestContext = React.createContext()

const UserQuestProvider = ({ children }) => {
  const [questSelected, questSelectedSet] = useState(null)
  const codeQuestModal = useDisclosure()
  const walletAuthQuestModal = useDisclosure()
  const nftOwnQuestModal = useDisclosure()
  const unstoppableQuestModal = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const [submitQuestData, isSubmittingQuest, onSubmit] = useUserQuestSubmit()

  const doQuest = useCallback(
    async (quest) => {
      try {
        switch (quest.type.name) {
          case Enums.CODE_QUEST:
            questSelectedSet(quest)
            codeQuestModal.onOpen()
            break
          case Enums.WALLET_AUTH:
            walletAuthQuestModal.onOpen()
            break
          case Enums.OWNING_NFT_CLAIM:
            questSelectedSet(quest)

            nftOwnQuestModal.onOpen()
            break
          case Enums.UNSTOPPABLE_AUTH:
            questSelectedSet(quest)

            unstoppableQuestModal.onOpen()
            break

          default:
          // await doQuestUtility(router, quest, onSubmit)
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Exception',
          description: `Catch error at quest: ${quest.text}. Please contact admin.`,
          position: 'top-right',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    },
    [
      // currentQuests
    ],
  )

  useEffect(() => {
    const filterUsers = async () => {}
    filterUsers()
  }, [])

  return (
    <UserQuestContext.Provider
      value={{
        codeQuestModal,
        walletAuthQuestModal,
        nftOwnQuestModal,
        unstoppableQuestModal,
        questSelected,
        isSubmittingQuest,
        doQuest,
      }}
    >
      {children}
    </UserQuestContext.Provider>
  )
}

export default UserQuestProvider

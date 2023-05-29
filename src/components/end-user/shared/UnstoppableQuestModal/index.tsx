// Modules
import { useState, useCallback } from 'react'
import UAuth from '@uauth/js'

// Components
import ModalWrapper from '../../wrappers/ModalWrapper'
import LinkableModalContent from './LinkableModalContent'
import FinishedModalContent from '../ModalCommon/FinishedModalContent'
import SubmittableModalContent from './SubmittableModalContent'

// Hooks
import { useUnstoppableAuthQuestSubmit } from '@hooks/user/quest'

enum ViewStatus {
  LINKABLE,
  SUBMITTABLE,
  SUBMITTED,
}

const { default: Resolution } = require('@unstoppabledomains/resolution')

const UnstoppableQuestModal = ({ isOpen, onClose, currentQuest }) => {
  const [error, errorSet] = useState(null)
  const [currentView, setView] = useState(ViewStatus.LINKABLE)
  const [uauthUser, setUauthUser] = useState(null)
  const [questData, isSubmittingQuest, submitQuest] = useUnstoppableAuthQuestSubmit()

  const handleOnClose = useCallback(() => {
    errorSet(null)
    onClose()
  }, [])

  const handleUnstoppableLogin = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const uauth = new UAuth({
        clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
        redirectUri: `${window.location.origin}`,
        scope: 'openid wallet',
      })
      errorSet(null)
      try {
        const authorization = await uauth.loginWithPopup()

        if (authorization) {
          const user = await uauth.user()
          setUauthUser(user.sub)
          setView(ViewStatus.SUBMITTABLE)
        } else {
          errorSet('Cannot get auth object from Unstoppable Login')
        }
      } catch (error) {
        errorSet(error.message)
      }
    }
  }, [window])

  const handleOnSubmit = useCallback(async () => {
    /** Submit this quest */

    if (!uauthUser) {
      return
    }

    const { questId } = currentQuest
    const payload = {
      questId,
      uauthUser,
    }
    const res = await submitQuest(payload)

    if (res?.isError) {
      errorSet(res.message)
    } else {
      setView(ViewStatus.SUBMITTED)
    }
  }, [uauthUser, currentQuest, submitQuest])

  return (
    <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === ViewStatus.LINKABLE && (
        <LinkableModalContent error={error} handleUnstoppableLogin={handleUnstoppableLogin} />
      )}

      {currentView === ViewStatus.SUBMITTABLE && (
        <SubmittableModalContent
          uauthUser={uauthUser}
          error={error}
          isSubmittingQuest={isSubmittingQuest}
          handleOnSubmit={handleOnSubmit}
        />
      )}

      {currentView === ViewStatus.SUBMITTED && (
        <FinishedModalContent
          text="You linked an unstoppable domain, return to challenges to claim your reward."
          handleOnClose={handleOnClose}
        />
      )}
    </ModalWrapper>
  )
}

export default UnstoppableQuestModal

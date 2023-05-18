// Modules
import { useContext, useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'

// Components
import { RiftlyTooltip } from '@components/shared/Icons'
import BlockTitle from '@components/end-user/shared/BlockTitle'

// UI
import {
  useToast,
  Box,
  FormControl,
  FormLabel,
  Switch,
  ButtonGroup,
  Button,
  useTheme,
} from '@chakra-ui/react'

// Util
import { debounce } from '@util/index'

// Store
import { Web3Context } from '@context/Web3Context'

const Settings = () => {
  const { SignOut } = useContext(Web3Context)
  const swRegistrationRef = useRef(null)
  const [switchSb, switchSbSet] = useState(false)
  const toast = useToast()
  const [disableNotification, setDisableNotification] = useState(false)

  const theme = useTheme()

  // @ts-ignore
  useEffect(async () => {
    if ('serviceWorker' in navigator) {
      const existingRegistration = await navigator.serviceWorker.getRegistration()
      if (existingRegistration) {
        swRegistrationRef.current = existingRegistration
        const existingSubscription =
          await swRegistrationRef?.current?.pushManager?.getSubscription()

        if (existingSubscription) {
          switchSbSet(true)
        } else {
          switchSbSet(false)
        }

        return
      } else {
        navigator.serviceWorker.register('./sw.js').then(
          async function (registration) {
            if (registration) {
              swRegistrationRef.current = registration
              const existingSubscription =
                await swRegistrationRef?.current?.pushManager?.getSubscription()

              if (existingSubscription) {
                switchSbSet(true)
              } else {
                switchSbSet(false)
              }
            }
          },
          function (err) {
            console.log(err)
            setDisableNotification(true)
          },
        )
      }
    } else {
      console.log('Not supporting service on this browser')
      setDisableNotification(true)
    }
  }, [])

  const handleOnSubscribeChange = async () => {
    if (swRegistrationRef.current) {
      const existingSubscription = await swRegistrationRef?.current?.pushManager?.getSubscription()

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID,
      }

      try {
        // true, subscribe

        if (!existingSubscription) {
          switchSbSet(true)
          try {
            const pushSubscription = await swRegistrationRef?.current?.pushManager?.subscribe(
              subscribeOptions,
            )

            const newSubscription = await axios
              .post(`/api/user/web-push/save-subscription`, {
                pushSubscription,
              })
              .then((r) => r.data)
              .catch((err) => {
                throw err
              })
            toast({
              title: 'Subscribed to new challenges!',
              position: 'bottom-right',
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
            //   }
          } catch (err) {
            console.log(err)
            switchSbSet(false)
          }
        }
        //false unsubscribe
        else {
          switchSbSet(false)
          const payload = existingSubscription

          await existingSubscription.unsubscribe().catch((e) => {
            throw e
          })

          const unsubscribedOp = await axios
            .post(`/api/user/web-push/remove-subscription`, {
              payload,
            })
            .then((r) => r.data)
            .catch((err) => {
              throw err
            })

          toast({
            title: 'Unsubscribed from new challenges!',
            position: 'bottom-right',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })

          // }
        }
      } catch (err) {
        switchSbSet(true)
        console.log(err)
      }
    }
  }

  const debouncedSubscribeChangeHandler = useCallback(
    debounce((e) => handleOnSubscribeChange(), 800),
    [],
  )

  const checkSwitch = () => {
    console.log(swRegistrationRef)
    if (!swRegistrationRef) {
      return true
    } else return false
  }

  return (
    <>
      <BlockTitle title="Settings" />
      <Box
        minW="100%"
        bg="brand.neutral4"
        minH="128px"
        h="100%"
        border="1px solid"
        borderRadius="16px"
        borderColor="brand.neutral3"
        position="relative"
        display="flex"
        p="24px"
        flexDirection="column"
        justifyItems="center"
        gap="16px"
      >
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="quest-alerts" mb="0" color={theme.colors.white} flex="80%">
            Notify me about new Challenges
            <RiftlyTooltip label="The permission may be overridden by browser setting, under Privacy Security" />
          </FormLabel>
          <Switch
            isChecked={switchSb}
            id="quest-alerts"
            onChange={async (e) => {
              debouncedSubscribeChangeHandler(e)
            }}
            disabled={disableNotification}
          />
        </FormControl>

        <ButtonGroup gap="16px" w="100%">
          <Button w="100%" variant="signIn">
            FAQ
          </Button>
          <Button w="100%" variant="signIn" onClick={SignOut}>
            Logout
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}

export default Settings

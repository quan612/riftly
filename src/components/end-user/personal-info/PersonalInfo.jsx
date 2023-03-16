import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import { Web3Context } from '@context/Web3Context'
import Enums from 'enums'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik'
import {
  useToast,
  Heading,
  Box,
  Container,
  Flex,
  SimpleGrid,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Switch,
  Select,
  Checkbox,
  GridItem,
  ButtonGroup,
  Button,
  Text,
  Divider,
  Icon,
  useDisclosure,
  Image,
} from '@chakra-ui/react'
import { RiftlyFace } from '@components/shared/Logo'
import axios from 'axios'

import { debounce, getTwitterAuthLink, getDiscordAuthLink } from '@util/index'
import { RiftlyTooltip } from '@components/shared/Icons'
import UploadAvatarModal from '../shared/UploadAvatarModal'
import { shortenAddress } from '@util/index'
import { WalletAuthQuestModal } from '../shared'

const PersonalInfo = ({ session }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      w="100%"
      position="relative"
      top="32px"
      gap="16px"
      paddingBottom="24px"
    >
      <AccountInfo session={session} />
      <ConnectionsInfo session={session} />
      <Settings />
    </Box>
  )
}

export default PersonalInfo

const Settings = () => {
  const { SignOut } = useContext(Web3Context)
  let swRegistrationRef = useRef(null)
  const [switchSb, switchSbSet] = useState(false)
  const toast = useToast()
  const [disableNotification, setDisableNotification] = useState(false)

  useEffect(async () => {
    if ('serviceWorker' in navigator) {
      let existingRegistration = await navigator.serviceWorker.getRegistration()
      // console.log('existingRegistration', existingRegistration)
      if (existingRegistration) {
        swRegistrationRef.current = existingRegistration
        let existingSubscription = await swRegistrationRef?.current?.pushManager?.getSubscription()

        // console.log('existingSubscription', existingSubscription)
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
              let existingSubscription =
                await swRegistrationRef?.current?.pushManager?.getSubscription()

              // console.log('existingSubscription', existingSubscription)
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
      // window.alert("Not supporting service on this browser");
    }
  }, [])

  const handleOnSubscribeChange = async () => {
    // console.log(swRegistrationRef)
    if (swRegistrationRef.current) {
      let existingSubscription = await swRegistrationRef?.current?.pushManager?.getSubscription()

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID,
      }

      try {
        // true, subscribe

        if (!existingSubscription) {
          console.log('no subscription yet, going to subscribe one then save to database')
          switchSbSet(true)
          try {
            let pushSubscription = await swRegistrationRef?.current?.pushManager?.subscribe(
              subscribeOptions,
            )

            let newSubscription = await axios
              .post(`/api/user/web-push/save-subscription`, {
                pushSubscription,
              })
              .then((r) => r.data)
              .catch((err) => {
                throw err
              })
            console.log(newSubscription)
            toast({
              title: 'Subscribed to new challenges!',
              // description: `${res.message}`,
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
          console.log('unsubscribe')
          switchSbSet(false)
          let payload = existingSubscription

          await existingSubscription.unsubscribe().catch((e) => {
            throw e
          })

          let unsubscribedOp = await axios
            .post(`/api/user/web-push/remove-subscription`, {
              payload,
            })
            .then((r) => r.data)
            .catch((err) => {
              throw err
            })

          toast({
            title: 'Unsubscribed from new challenges!',
            // description: `${res.message}`,
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
    debounce((e) => handleOnSubscribeChange(e), 800),
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
      <Heading color="white" fontWeight="600" size="md">
        Settings
      </Heading>

      <Box
        minW="100%"
        bg={'brand.neutral4'}
        minH="128px"
        h="100%"
        border="1px solid"
        borderRadius={'16px'}
        borderColor="brand.neutral3"
        position={'relative'}
        display="flex"
        p="24px"
        flexDirection="column"
        justifyItems={'center'}
        gap="16px"
      >
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="quest-alerts" mb="0" color="#fff" flex="80%">
            Notify me about new Challenges
            <RiftlyTooltip label="The permission may be overridden by browser setting, under Privacy Security" />
          </FormLabel>
          <Switch
            // isDisabled={checkSwitch()}

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

const ConnectionsInfo = ({ session }) => {
  const {
    user: { wallet, twitter, discord },
  } = session

  const getDiscordInfo = useCallback(() => {
    if (discord?.length > 0) {
      return (
        <Input
          type="text"
          fontSize="md"
          variant="riftly"
          ms="4px"
          disabled={true}
          value={discord}
        />
      )
    }
    return (
      <Button
        w="100%"
        variant="outline"
        onClick={async () => {
          let discordLink = await getDiscordAuthLink()
          return window.open(discordLink, '_self')
        }}
      >
        Connect Discord
      </Button>
    )
  })

  const getTwitterInfo = useCallback(() => {
    if (twitter?.length > 0) {
      return (
        <Input
          type="text"
          fontSize="md"
          variant="riftly"
          ms="4px"
          disabled={true}
          value={twitter}
        />
      )
    }
    return (
      <Button
        w="100%"
        variant="outline"
        onClick={async () => {
          let twitterLink = await getTwitterAuthLink()
          return window.open(twitterLink, '_self')
        }}
      >
        Connect Twitter
      </Button>
    )
  })

  // const getGoogleInfo = useCallback(() => {
  //     if (twitter.length > 0) {
  //         return (
  //             <Input
  //                 type="text"
  //                 fontSize="md"
  //                 variant="riftly"
  //                 ms="4px"
  //                 disabled={true}
  //                 value={twitter}
  //             />
  //         );
  //     }
  //     return (
  //         <Button w="100%" variant="outline">
  //             Connect Twitter
  //         </Button>
  //     );
  // });

  const getWalletInfo = useCallback(() => {
    if (wallet?.length > 0) {
      return (
        <Input
          type="text"
          fontSize="md"
          variant="riftly"
          ms="4px"
          disabled={true}
          value={wallet.length > 0 ? shortenAddress(wallet) : ''}
        />
      )
    }
    return (
      <Button
        w="100%"
        variant="outline"
        onClick={async () => {
          walletSignUpModal.onOpen()
        }}
      >
        Connect Wallet
      </Button>
    )
  })

  const walletSignUpModal = useDisclosure()

  return (
    <>
      {walletSignUpModal?.isOpen && (
        <WalletAuthQuestModal
          isSignUp={true}
          isOpen={walletSignUpModal.isOpen}
          onClose={() => {
            walletSignUpModal.onClose()
          }}
        />
      )}
      <Heading color="white" fontWeight="600" size="md">
        Connections
      </Heading>

      <Box
        minW="100%"
        bg={'brand.neutral4'}
        minH="128px"
        h="100%"
        border="1px solid"
        borderRadius={'16px'}
        borderColor="brand.neutral3"
        position={'relative'}
        display="flex"
        p="24px"
        flexDirection="column"
        justifyItems={'center'}
        gap="16px"
      >
        <SimpleGrid columns="2" gap="24px">
          <GridItem colSpan={1}>
            <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="purple.300">
              Discord
            </Text>
            {getDiscordInfo()}
          </GridItem>
          <GridItem colSpan={1}>
            <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="blue.300">
              Twitter
            </Text>
            {getTwitterInfo()}
          </GridItem>
          <GridItem colSpan={1}>
            <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="red.300">
              Google
            </Text>
            {/* <Input
              type="text"
              fontSize="md"
              variant="riftly"
              ms="4px"
              disabled={true}
              // value={'placeholder'}
            /> */}
            <Button w="100%" variant="outline" disabled={true}>
              Connect Google
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="orange.300">
              Wallet
            </Text>
            {getWalletInfo()}
          </GridItem>
        </SimpleGrid>
      </Box>
    </>
  )
}

const AccountInfo = ({ session }) => {
  const initialValues = {
    username: '',
    password: '',
    email: '',
  }

  const uploadAvatarModal = useDisclosure()
  const {
    user: { avatar, email },
  } = session

  const getUserAvatar = useCallback(
    (avatar) => {
      if (avatar && avatar.trim().length > 5) return <Image borderRadius={'50%'} src={avatar} />
      else return <RiftlyFace />
    },
    [avatar],
  )

  const getButtonState = useCallback(() => {
    if (email?.length > 0) return false
    return true
  })
  return (
    <>
      <UploadAvatarModal
        isOpen={uploadAvatarModal.isOpen}
        onClose={() => {
          uploadAvatarModal.onClose()
        }}
      />
      <Heading color="white" fontWeight="600" size="md">
        Account Information
      </Heading>

      <Box
        minW="100%"
        bg={'brand.neutral4'}
        minH="128px"
        h="100%"
        border="1px solid"
        borderRadius={'16px'}
        borderColor="brand.neutral3"
        position={'relative'}
        display="flex"
        p="24px"
        flexDirection="column"
        justifyItems={'center'}
        alignItems="center"
        gap="16px"
      >
        <Box boxSize={'96px'} position="relative">
          {getUserAvatar(avatar)}

          <Box position="absolute" boxSize="40px" right="2px" bottom="0">
            <UploadIcon handleOnClick={() => uploadAvatarModal.onOpen()} />
          </Box>
        </Box>
        <Box w="100%">
          <Formik
            initialValues={initialValues}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (fields, { setStatus }) => {
              try {
                alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))
              } catch (error) {
                console.log(error)
              }
            }}
          >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
              return (
                <Form w="100%">
                  <SimpleGrid columns="2" gap="24px" w="100%">
                    <GridItem colSpan={2}>
                      <FormikInput label="Email" name="email" value={email} />
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormikInput label="Phone Number" name="username" />
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl>
                        <FormLabel ms="4px" fontSize="md" fontWeight="bold" color="#fff">
                          Password
                        </FormLabel>
                        <Button
                          w="100%"
                          variant="outline"
                          // disabled={getButtonState()}
                          disabled={true}
                        >
                          Reset Password
                        </Button>
                      </FormControl>
                    </GridItem>
                  </SimpleGrid>
                </Form>
              )
            }}
          </Formik>
        </Box>
      </Box>
    </>
  )
}

const FormikInput = ({ label, name, value = '', type = 'text' }) => {
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold" color="#fff">
        {label}
      </FormLabel>
      <Field
        disabled={true}
        name={name}
        type={type}
        as={Input}
        fontSize="md"
        variant="riftly"
        ms="4px"
        value={value}
      />
    </FormControl>
  )
}

const UploadIcon = ({ handleOnClick }) => {
  return (
    <Icon
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      cursor={'pointer'}
      onClick={handleOnClick}
    >
      <circle cx="20" cy="20" r="19" fill="white" stroke="#1D63FF" strokeWidth="2" />
      <g clipPath="url(#clip0_13957_4815)">
        <path
          d="M14.1663 25.0416H26.833V19.5H28.4163V25.8333C28.4163 26.0433 28.3329 26.2446 28.1845 26.3931C28.036 26.5416 27.8346 26.625 27.6247 26.625H13.3747C13.1647 26.625 12.9633 26.5416 12.8149 26.3931C12.6664 26.2446 12.583 26.0433 12.583 25.8333V19.5H14.1663V25.0416ZM22.083 17.125V21.875H18.9163V17.125H14.958L20.4997 11.5833L26.0413 17.125H22.083Z"
          fill="#1D63FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_13957_4815">
          <rect width="19" height="19" fill="white" transform="translate(11 10)" />
        </clipPath>
      </defs>
    </Icon>
  )
}

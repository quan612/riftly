// Modules
import { useCallback } from 'react'
import { Form, Formik } from 'formik'
import { Session } from 'next-auth'

// Components
import { RiftlyFace } from '@components/shared/Logo'
import UploadAvatarModal from '@components/end-user/shared/UploadAvatarModal'
import UploadIcon from './UploadIcon'
import FormikInput from './FormikInput'
import { BlockTitle } from '@components/end-user/shared'

// UI
import {
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  GridItem,
  Button,
  useDisclosure,
  Image,
} from '@chakra-ui/react'

interface IAccountInfo {
  session: Session
}

const AccountInfo = ({ session }: IAccountInfo) => {
  const initialValues = {
    username: '',
    password: '',
    email: '',
  }

  const uploadAvatarModal = useDisclosure()
  const {
    user: { avatar, email },
  } = session

  const getUserAvatar = (avatar) => {
    if (avatar && avatar.trim().length > 5) return <Image borderRadius="50%" src={avatar} />
    else return <RiftlyFace />
  }

  const getButtonState = useCallback(() => {
    if (email?.length > 0) return false
    return true
  }, [email])

  const onUploadAvatarModal = useCallback(() => uploadAvatarModal.onOpen(), [uploadAvatarModal])

  const onUploadAvatarModalClose = useCallback(
    () => uploadAvatarModal.onClose(),
    [uploadAvatarModal],
  )

  const onSubmitForm = useCallback(async (fields, { setStatus }) => {
    try {
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <>
      <UploadAvatarModal isOpen={uploadAvatarModal.isOpen} onClose={onUploadAvatarModalClose} />
      <BlockTitle title="Account Information" />
      <Box
        alignItems="center"
        bg="brand.neutral4"
        border="1px solid"
        borderColor="brand.neutral3"
        borderRadius="16px"
        display="flex"
        flexDirection="column"
        gap="16px"
        h="100%"
        justifyItems="center"
        minH="128px"
        minW="100%"
        p="24px"
        position="relative"
      >
        <Box boxSize="96px" position="relative">
          {getUserAvatar(avatar)}

          <Box position="absolute" boxSize="40px" right="2px" bottom="0">
            <UploadIcon handleOnClick={onUploadAvatarModal} />
          </Box>
        </Box>
        <Box w="100%">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmitForm}
            validateOnBlur
            validateOnChange={false}
          >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
              return (
                <Form>
                  <SimpleGrid columns={2} gap="24px" w="100%">
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

export default AccountInfo

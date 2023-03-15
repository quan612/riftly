import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Image,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react'
import Card, { AdminCard } from '@components/shared/Card'
import Enums from '@enums/index'
import axios from 'axios'
import { useState, useCallback, useRef, useEffect } from 'react'
import { MdUpload } from 'react-icons/md'

const UPLOADABLE = 0
const READY = 1
const DONE = 2

const FILESIZE = 1024 * 2048

export default function AdminGeneralImageUpload(props) {
  const { title, error, touched, onConfirmUpload, uploaded, ...rest } = props

  const [currentView, setView] = useState(UPLOADABLE)

  /** temporary image to upload to an external service */
  const [imageSrc, setImageSrc] = useState()
  const [imageName, setImageName] = useState(null)

  const [uploadError, uploadErrorSet] = useState(null)
  const [isLoading, isLoadingSet] = useState(false)

  const hiddenFileInput = useRef(null)
  const imageEl = useRef(null)

  console.log('imageName', imageName)
  const handleOnChange = useCallback((changeEvent) => {
    uploadErrorSet(null)

    const reader = new FileReader()
    if (changeEvent.target.files[0].size > FILESIZE) {
      uploadErrorSet('File is too big, please try again')
      return
    }

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result)
      setView(READY)
    }
    reader.readAsDataURL(changeEvent.target.files[0])

    const fileName = changeEvent.target.files[0].name

    setImageName(fileName.substr(0, fileName.lastIndexOf('.')))
  }, [])

  useEffect(() => {
    if (uploaded) {
      setImageSrc(uploaded)
      setView(DONE)
    } else {
      if (uploaded === '' || uploaded === null) {
        setImageSrc(null)
        setView(UPLOADABLE)
      }
    }
  }, [uploaded])

  const onUploadImage = useCallback(async () => {
    isLoadingSet(true)
    try {
      uploadErrorSet(null)
      let payload = {
        imageName,
        imageSrc,
      }
      const res = await axios
        .post(`${Enums.BASEPATH}/api/admin/image-upload/general-preset`, payload)
        .then((r) => r.data)

      if (!res?.isError) {
        onConfirmUpload(res?.image)
        setView(DONE)
      } else {
        uploadErrorSet('Cannot upload to image hosting service. Please contact admin.')
      }
    } catch (error) {
      console.log(error.message)
      uploadErrorSet('Cannot upload to image hosting service. Please contact admin.')
    }
    isLoadingSet(false)
  }, [imageName, imageSrc])

  return (
    <>
      <AdminCard {...rest} alignItems="center" p="0px" py="24px">
        <FormControl
          isRequired
          isInvalid={error && touched}
          height="100%"
          flex="1"
          display="flex"
          flexDirection="column"
        >
          <FormLabel ms="4px" fontSize="md" fontWeight="bold">
            {title}
          </FormLabel>
          <Flex
            minH="100%"
            flex="1"
            direction={{ base: 'column', md: 'row' }}
            className="upload-wrapper"
          >
            {currentView === UPLOADABLE && (
              <>
                <input
                  type="file"
                  name="file"
                  accept="image/jpeg, image/png, image/gif"
                  style={{ display: 'none' }}
                  ref={hiddenFileInput}
                  onChange={handleOnChange}
                />

                <Flex
                  align="center"
                  justify="center"
                  bg={'brand.neutral5'}
                  border="2px dashed"
                  borderColor={'rgba(255, 255, 255, 0.1)'}
                  borderRadius="16px"
                  w="100%"
                  cursor="pointer"
                  py="32px"
                  onClick={(e) => {
                    e.preventDefault()
                    hiddenFileInput.current.click()
                  }}
                >
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" flex="1">
                    <Icon as={MdUpload} w="80px" h="80px" />
                    <Flex justify="center" mx="auto" mb="12px">
                      <Text fontSize="xl" fontWeight="700">
                        Upload Files
                      </Text>
                    </Flex>
                    <Text fontSize="sm" fontWeight="500" color="secondaryGray.500">
                      PNG, JPG and GIF files are allowed
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  p="1rem"
                  gap="1rem"
                >
                  <Text fontWeight="bold" textAlign="start" fontSize="2xl">
                    Upload preview image
                  </Text>
                  <Text fontSize="md" textAlign="center">
                    {`Best resolution is 500px by 500px. This image will appear on discord as
                    embeded message. Size is less than 2mb.`}
                  </Text>
                </Flex>
              </>
            )}
            {currentView === READY && (
              <>
                <Flex
                  align="center"
                  justify="center"
                  border="2px dashed"
                  borderColor={'rgba(255, 255, 255, 0.1)'}
                  borderRadius="16px"
                  w="100%"
                  minH="100%"
                  p={{ base: '16px', lg: '32px' }}
                >
                  <Image src={imageSrc} ref={imageEl} w="50%" />
                  <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    w="50%"
                    p="1rem"
                    gap="20px"
                  >
                    <Text fontWeight="bold" textAlign="start" fontSize="2xl">
                      Image Selected
                    </Text>
                    <ButtonGroup
                      display={'flex'}
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      w={{ base: '100%' }}
                      gap="16px"
                    >
                      <Button
                        minW="120px"
                        maxW="191px"
                        variant="blue"
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={async () => onUploadImage()}
                      >
                        Upload
                      </Button>
                      <Button
                        minW="120px"
                        maxW="191px"
                        variant="blue"
                        disabled={isLoading}
                        onClick={() => {
                          setView(UPLOADABLE)
                          setImageSrc(null)
                          setImageName(null)
                          uploadErrorSet(null)
                        }}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </Flex>
                </Flex>
              </>
            )}
            {currentView === DONE && (
              <>
                <Flex
                  align="center"
                  justify="center"
                  border="2px dashed"
                  borderColor={'rgba(255, 255, 255, 0.1)'}
                  borderRadius="16px"
                  w="100%"
                  p={{ base: '16px', lg: '32px' }}
                >
                  <Image src={imageSrc} ref={imageEl} />
                </Flex>
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  w="100%"
                  p="1rem"
                  gap="20px"
                >
                  <Text fontWeight="bold" textAlign="start" fontSize="2xl">
                    Current Image
                  </Text>
                  <ButtonGroup
                    display={'flex'}
                    justifyContent={'space-around'}
                    w={{ base: '100%' }}
                    gap="16px"
                  >
                    <Button
                      minW="150px"
                      maxW="191px"
                      variant="outline"
                      bg="red.300"
                      onClick={() => {
                        setView(UPLOADABLE)
                        setImageSrc(null)
                        uploadErrorSet(null)
                      }}
                    >
                      Upload new image
                    </Button>
                  </ButtonGroup>
                </Flex>
              </>
            )}
          </Flex>

          {uploadError && (
            <Box color="red.300" key="image-upload-error">
              {uploadError}
            </Box>
          )}
          <FormErrorMessage fontSize="md" name={'image'}>
            {error}
          </FormErrorMessage>
        </FormControl>
      </AdminCard>
    </>
  )
}

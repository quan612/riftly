// Chakra Imports
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Link,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
// import { HSeparator } from "components/Separator/Separator";
import React, { useState } from 'react'
import { HSeparator } from '../Separator'

// import { FaFacebook, FaTwitter } from "react-icons/fa";

export default function RightSideBar(props) {
  const { sidebarVariant, setSidebarVariant, isOpen, onClose, fixed, title, ...rest } = props
  const [switched, setSwitched] = useState(props.isChecked)

  const { colorMode, toggleColorMode } = useColorMode()

  let bgButton = useColorModeValue(
    'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
    'white',
  )
  let colorButton = useColorModeValue('white', 'gray.700')
  const secondaryButtonBg = useColorModeValue('white', 'transparent')
  const secondaryButtonBorder = useColorModeValue('gray.700', 'white')
  const secondaryButtonColor = useColorModeValue('gray.700', 'white')
  const bgDrawer = useColorModeValue('white', 'navy.800')
  const settingsRef = React.useRef()
  return (
    <>
      <Drawer
        closeOnOverlayClick={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
        finalFocusRef={settingsRef}
        blockScrollOnMount={false}
        trapFocus={false}
        variant="permanent"
      >
        <DrawerContent bg={bgDrawer}>
          <DrawerHeader pt="16px" px="24px">
            <DrawerCloseButton />
            <Text fontSize="xl" fontWeight="bold" my="12px">
              {title}
            </Text>
            {/* <Divider /> */}
            <HSeparator />
          </DrawerHeader>
          <DrawerBody w="340px" ps="24px" pe="40px">
            {props.children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

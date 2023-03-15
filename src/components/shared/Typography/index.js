import { Heading, Text } from '@chakra-ui/react'

// xs: "14px",
// sm: "16px",
// md: "20px",
// lg: "24px",

export const HeadingSm = (props) => {
  return (
    <Heading size="sm" {...props}>
      {props.children}
    </Heading>
  )
}

export const HeadingLg = (props) => {
  return (
    <Heading size="md" {...props}>
      {props.children}
    </Heading>
  )
}

export const TextSm = (props) => {
  return (
    <Text fontSize="sm" {...props}>
      {props.children}
    </Text>
  )
}

export const TextMd = (props) => {
  return (
    <Text fontSize="md" {...props}>
      {props.children}
    </Text>
  )
}

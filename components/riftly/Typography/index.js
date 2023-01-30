import { Heading, Text } from "@chakra-ui/react"

// xs: "14px",
// sm: "16px",
// md: "20px",
// lg: "24px",

export const HeadingSm = (props) => {
  return (
    <Heading
      size="sm"
      {...props}

    // fontSize={{
    //   xs: "14px",
    //   sm: "16px",
    //   md: "20px",
    //   lg: "24px",
    //   xl: "30px",
    //   "2xl": "36px",
    //   "3xl": "48px",
    //   "4xl": "60px",
    // }}

    >
      {props.children}
    </Heading>
  )
}

export const HeadingLg = (props) => {
  return (
    <Heading
      size="md"
      // fontSize={{
      //   xs: "14px",
      //   sm: "16px",
      //   md: "20px",
      //   lg: "30px",
      //   xl: "36px",
      //   "2xl": "48px",
      //   "3xl": "60px",
      //   "4xl": "72px",
      // }}
      {...props}


    >
      {props.children}
    </Heading>
  )
}

export const TextSm = (props) => {
  return (
    <Text

      fontSize="sm"
      {...props}
    >
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
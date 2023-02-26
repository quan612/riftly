import {
  Box, useStyleConfig,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

function Card(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("Card", { variant });

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default Card;

export const AdminCard = ({ children }) => {
  const bg = "brand.neutral4"
  const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");

  return (
    <Card boxShadow={shadow} py="4" bg={bg}>{children}</Card>
  )
}


export const MiniStatistics = (props) => {
  const { startContent, endContent, name, growth, value } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";

  return (
    <Card py='15px'>
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}>
        {startContent}

        <Stat my='auto' ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize={{
              base: "sm",
            }}>
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: "2xl",
            }}>
            {value}
          </StatNumber>
          {growth ? (
            <Flex align='center'>
              <Text color='green.500' fontSize='xs' fontWeight='700' me='5px'>
                {growth}
              </Text>
              <Text color='secondaryGray.600' fontSize='xs' fontWeight='400'>
                since last month
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}


export const AdminBanner = ({ children }) => {
  return (
    <Flex
      direction={{ base: "column" }}
      h="160px"
      align="center"
      backdropFilter="blur(21px)"
      borderRadius="20px"
      __css={{
        background:
          "linear-gradient(rgba(29, 99, 255, 0.5),  rgba(29, 99, 255, 0.5)), url(/img/user/banner.png)",
      }}
      backgroundPosition="center"
      backgroundSize={"cover"}
      backgroundRepeat="no-repeat"
      display={"flex"}
      flexDirection="column"
      alignItems="center"
      justifyContent={"center"}
      p={{ base: "12px", lg: "2rem" }}
    >

      {children}
    </Flex>
  );
};

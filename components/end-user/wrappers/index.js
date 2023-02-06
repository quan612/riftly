
import { Box, Flex, Container, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
export const Banner = () => {
  return (
    <Box
      minW={"100%"}
      w="100%"

      h="176px"

      display={"flex"}
      position={"relative"}
      justifyContent={"center"}
    >
      <Box
        position={"absolute"}
        h="100vh"
        w="100%"
        backgroundImage="/img/user/banner.png"
        backgroundPosition="center"
        backgroundSize={"cover"}
        backgroundRepeat="no-repeat"
      >

      </Box>

      <Box position="absolute" top="0" h="calc(100% - 32px)" display={"flex"}>
        <Box display={"flex"} alignItems="center">
          <Image src={"/img/user/Logo_white.svg"} w={"105.9px"} h="64px" fit={"fill"} />
        </Box>
      </Box>
    </Box>
  );
};

export const FloatingFooter = () => {
  const router = useRouter()
  return (
    <Box
      className="floating-menu"
      position={"fixed"}
      bottom="0"
      w="100%"
      h="96px"
      display={"flex"}
      alignItems={"center"}
      justifyContent="center"
      zIndex="99"
      pointerEvents={"none"}
    >
      <Flex
        w={{ base: "80%", md: "384px" }}
        bg={"brand.neutral3"}
        h="64px"
        borderRadius={"48px"}
        justifyContent="center"
        pointerEvents={"all"}
      >
        <Flex h="100%" w="80%">
          <Flex
            h="100%"
            w="100%"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Box
              boxSize={"24px"}
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/")

              }}
            >
              <HomeMenuIcon fill={router.pathname == "/" ? "#00BBC7" : "#1D3148"} />
            </Box>
            <Box
              boxSize={"24px"}
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/redeem")

              }}
            >
              <RedeemMenuIcon fill={router.pathname == "/redeem" ? "#00BBC7" : "#1D3148"} />
            </Box>
            <Box
              boxSize={"24px"}
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/achievements")

              }}
            >
              <AchievementMenuIcon
                fill={router.pathname == "/achievements" ? "#00BBC7" : "#1D3148"}
              />
            </Box>
            <Box
              boxSize={"24px"}
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/personal-info")

              }}
            >
              <PersonalMenuIcon
                fill={router.pathname == "/personal-info" ? "#00BBC7" : "#1D3148"}
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}


const HomeMenuIcon = ({ fill }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 20.139V13.1796C24 10.9032 24 9.76507 23.532 8.75901C23.0639 7.75296 22.1825 6.99678 20.4199 5.48441L19.0865 4.34043C15.714 1.44681 14.0277 0 12 0C9.97227 0 8.286 1.44681 4.91345 4.34043L3.58012 5.48441C1.81744 6.99678 0.936107 7.75296 0.468053 8.75901C0 9.76507 0 10.9032 0 13.1796V20.139C0 21.3384 0 21.938 0.202987 22.4111C0.47364 23.0417 0.992773 23.5429 1.64617 23.8041C2.13624 24 2.75749 24 4 24H4.44444C5.27108 24 5.68441 24 6.02352 23.9124C6.94376 23.6743 7.66256 22.9804 7.90913 22.0922C8 21.7649 8 21.3659 8 20.568V17.5651C8 15.4326 9.7908 13.7041 12 13.7041C14.2092 13.7041 16 15.4326 16 17.5651V20.568C16 21.3659 16 21.7649 16.0908 22.0922C16.3375 22.9804 17.0563 23.6743 17.9765 23.9124C18.3156 24 18.7289 24 19.5556 24H20C21.2425 24 21.8637 24 22.3539 23.8041C23.0072 23.5429 23.5264 23.0417 23.7971 22.4111C24 21.938 24 21.3384 24 20.139Z"
        fill={fill}
      />
    </svg>
  );
};

const RedeemMenuIcon = ({ fill }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.6316 0C14.6416 0 16.5694 0.798494 17.9907 2.21982C19.412 3.64115 20.2105 5.56889 20.2105 7.57895V8.8421H25.2632V11.3684H23.7891L22.8328 22.8417C22.8066 23.1573 22.6626 23.4516 22.4296 23.6661C22.1966 23.8807 21.8915 23.9998 21.5747 24H3.68842C3.37168 23.9998 3.06656 23.8807 2.83354 23.6661C2.60052 23.4516 2.45661 23.1573 2.43032 22.8417L1.47284 11.3684H0V8.8421H5.05263V7.57895C5.05263 5.56889 5.85113 3.64115 7.27245 2.21982C8.69378 0.798494 10.6215 0 12.6316 0ZM13.8947 13.8947H11.3684V18.9474H13.8947V13.8947ZM8.84211 13.8947H6.31579V18.9474H8.84211V13.8947ZM18.9474 13.8947H16.4211V18.9474H18.9474V13.8947ZM12.6316 2.52632C11.3353 2.52631 10.0886 3.02455 9.14929 3.91797C8.21003 4.81138 7.65008 6.03163 7.58526 7.32632L7.57895 7.57895V8.8421H17.6842V7.57895C17.6842 6.28264 17.186 5.03592 16.2926 4.09666C15.3991 3.1574 14.1789 2.59745 12.8842 2.53263L12.6316 2.52632Z"
        fill={fill}
      />
    </svg>
  );
};

const AchievementMenuIcon = ({ fill }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 30 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5286 18.3461C16.8146 18.5256 16.2632 19.1361 16.2632 19.8723V19.8723C16.2632 20.6792 16.9173 21.3333 17.7242 21.3333H21.5965C22.3329 21.3333 22.9298 21.9303 22.9298 22.6667V22.6667C22.9298 23.403 22.3329 24 21.5965 24H8.26318C7.5268 24 6.92985 23.403 6.92985 22.6667V22.6667C6.92985 21.9303 7.5268 21.3333 8.26318 21.3333H12.1355C12.9424 21.3333 13.5965 20.6792 13.5965 19.8723V19.8723C13.5965 19.1361 13.0451 18.5256 12.3311 18.3461C10.2492 17.823 8.36281 16.6806 6.92985 15.0557C5.21143 13.107 4.26323 10.5981 4.26318 8V2C4.26318 0.895431 5.15861 0 6.26318 0H23.5965C24.7011 0 25.5965 0.895431 25.5965 2V8C25.5965 10.5981 24.6483 13.107 22.9298 15.0557C21.4969 16.6806 19.6105 17.823 17.5286 18.3461ZM0.263184 4C0.263184 3.26362 0.860137 2.66667 1.59652 2.66667V2.66667C2.3329 2.66667 2.92985 3.26362 2.92985 4V6.66667C2.92985 7.40305 2.3329 8 1.59652 8V8C0.860137 8 0.263184 7.40305 0.263184 6.66667V4ZM26.9298 4C26.9298 3.26362 27.5268 2.66667 28.2632 2.66667V2.66667C28.9996 2.66667 29.5965 3.26362 29.5965 4V6.66667C29.5965 7.40305 28.9996 8 28.2632 8V8C27.5268 8 26.9298 7.40305 26.9298 6.66667V4Z"
        fill={fill}
      />
    </svg>
  );
};

const PersonalMenuIcon = ({ fill }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.577 12.2007C14.6092 12.2007 17.0673 9.46951 17.0673 6.10037C17.0673 2.73123 14.6092 0 11.577 0C8.54478 0 6.08667 2.73123 6.08667 6.10037C6.08667 9.46951 8.54478 12.2007 11.577 12.2007Z"
        fill={fill}
      />
      <path
        d="M22.5578 21.3513C22.5578 25.0574 16.9678 23.7914 11.5771 23.7914C6.18647 23.7914 0.596436 25.0574 0.596436 21.3513C0.596436 17.6452 6.18647 14.6409 11.5771 14.6409C16.9678 14.6409 22.5578 17.6452 22.5578 21.3513Z"
        fill={fill}
      />
    </svg>
  );
};
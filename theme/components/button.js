import { mode } from "@chakra-ui/theme-tools";




export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: "16px",
        boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
        transition: ".25s all ease",
        boxSizing: "border-box",
        _focus: {
          boxShadow: "none",
        },
        _active: {
          boxShadow: "none",
        },
      },
      variants: {
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props) => ({
          bg: mode("brand.500", "brand.400")(props),
          color: "white",
          _focus: {
            bg: mode("brand.500", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.500", "brand.400")(props),
          },
          _hover: {
            bg: mode("brand.600", "brand.400")(props),
          },
        }),
        darkBrand: (props) => ({
          bg: mode("brand.900", "brand.400")(props),
          color: "white",
          _focus: {
            bg: mode("brand.900", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.900", "brand.400")(props),
          },
          _hover: {
            bg: mode("brand.800", "brand.400")(props),
          },
        }),
        lightBrand: (props) => ({
          bg: mode("#F2EFFF", "whiteAlpha.100")(props),
          color: mode("brand.500", "white")(props),
          _focus: {
            bg: mode("#F2EFFF", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _hover: {
            bg: mode("secondaryGray.400", "whiteAlpha.200")(props),
          },
        }),
        light: (props) => ({
          bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          color: mode("secondaryGray.900", "white")(props),
          _focus: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _hover: {
            bg: mode("secondaryGray.400", "whiteAlpha.200")(props),
          },
        }),
        action: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("secondaryGray.300", "brand.400")(props),
          color: mode("brand.500", "white")(props),
          _focus: {
            bg: mode("secondaryGray.300", "brand.400")(props),
          },
          _active: { bg: mode("secondaryGray.300", "brand.400")(props) },
          _hover: {
            bg: mode("secondaryGray.200", "brand.400")(props),
          },
        }),
        setup: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("transparent", "brand.400")(props),
          border: mode("1px solid", "0px solid")(props),
          borderColor: mode("secondaryGray.400", "transparent")(props),
          color: mode("secondaryGray.900", "white")(props),
          _focus: {
            bg: mode("transparent", "brand.400")(props),
          },
          _active: { bg: mode("transparent", "brand.400")(props) },
          _hover: {
            bg: mode("secondaryGray.100", "brand.400")(props),
          },
        }),
        signIn: (props) => ({
          border: "1px solid",
          borderColor: "brand.blue",
          borderRadius: "48px",
          bg: "transparent",
          color: "white",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "brand.blue",
            _disabled: {
              bg: "transparent",
              color: "#fff",
              opacity: 0.4,
            }
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: "0.8s",
            bg: "brand.blue",
            border: "1px solid",
            borderColor: "#fff",
            color: "#fff",
          },
          _active: {
            bg: "brand.blue",
            border: "1px solid",
            borderColor: "#fff",
            color: "#fff",
          },
        }),

        blue: (props) => ({
          border: "1px solid",
          borderColor: "transparent",
          borderRadius: "48px",
          bg: "brand.blue",
          color: "#fff",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "#fff",
            color: "brand.blue",
            _disabled: {
              bg: "brand.blue",
              color: "#fff",
              opacity: 0.4,
            }
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: "0.8s",
            bg: "#fff",
            color: "brand.blue",
            _disabled: {
              bg: "brand.blue",
              color: "#fff",
              opacity: 0.4,
            }
          },
          _active: {
            bg: "#fff",
            border: "1px solid",
            borderColor: "brand.blue",
            color: "brand.blue",
          },
        }),
        "modal-close": {

        },

        "ghost-blue": (props) => ({
          borderColor: "transparent",
          bg: "transparent",
          color: "brand.blue",
          transition: "0.8s",
          marginTop: "-12px",
          outline: "none",
          _hover: {
            transition: "0.8s",
            color: "blue.300",
            textDecoration: "underline",
            _disabled: {
              bg: "brand.blue",
              color: "#fff",
              opacity: 0.4,
            }
          },
          _disabled: {
            color: "brand.blue",
            opacity: 0.6,
          },
          _focus: {
            transition: "0.8s",
            color: "blue.300",
            textDecoration: "underline",
            _disabled: {
              color: "brand.blue",
              opacity: 0.6,
            }
          },
          _active: {
            transition: "0.8s",
            color: "blue.300",
            textDecoration: "underline",
          },
        }),

        cyan: (props) => ({
          bg: "brand.cyan",
          color: "#fff",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "#fff",
            color: "brand.cyan",
          },
          _disabled: {
            cursor: "not-allowed",
            borderColor: "brand.neutral1",
            color: "brand.neutral1",
            _placeholder: { color: "brand.neutral3" },
          }
          // _focus: {
          //   bg: mode("brand.900", "brand.400")(props),
          // },
          // _active: {
          //   bg: mode("blue.400", "blue.300")(props),
          // },
        }),

        twitter: (props) => ({
          bg: mode("transparent", "transparent")(props),
          color: "white",
          border: "1px solid",
          borderColor: mode("blue.300", "blue.300")(props),
          borderRadius: "48px",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "blue.300",
            svg: {
              fill: mode("white", "blue.300"),
              transition: "0.8s",
            },
          },
          // _focus: {
          //   bg: mode("brand.900", "brand.400")(props),
          // },
          _active: {
            bg: mode("blue.400", "blue.400")(props),
          },
        }),

        discord: (props) => ({
          bg: "transparent", //mode("transparent", "purple.300")(props),
          color: "white",
          border: "1px solid",
          borderColor: "purple.300",//"mode("purple.300", "secondaryGray.400")(props),
          borderRadius: "48px",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "purple.300",
            svg: {
              fill: "white", //mode("white", "purple.300"),
              transition: "0.8s",
            },
          },
          // _focus: {
          //   bg: mode("brand.900", "brand.400")(props),
          // },
          _active: {
            bg: mode("purple.400", "purple.400")(props),
          },
        }),
        wallet: (props) => ({
          bg: mode("transparent", "transparent")(props),
          color: "white",
          border: "1px solid",
          borderColor: mode("orange.300", "orange.300")(props),
          borderRadius: "48px",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "orange.300",
            svg: {
              fill: "white",
              transition: "0.8s",
            },
          },
          // _focus: {
          //   bg: mode("brand.900", "brand.400")(props),
          // },
          _active: {
            bg: mode("orange.400", "orange.400")(props),
          },
        }),
        google: (props) => ({
          bg: mode("transparent", "transparent")(props),
          color: "white",
          border: "1px solid",
          borderColor: mode("red.300", "red.300")(props),
          borderRadius: "48px",
          transition: "0.8s",
          _hover: {
            transition: "0.8s",
            bg: "red.300",
            svg: {
              fill: "white",
              transition: "0.8s",
            },
          },
          // _focus: {
          //   bg: mode("brand.900", "brand.400")(props),
          // },
          _active: {
            bg: mode("red.400", "red.400")(props),
          },
        }),
      },
    },
  },
};

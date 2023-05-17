import { mode } from '@chakra-ui/theme-tools'

export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        w: 'auto',
        h: { base: "48px", 'xs': '24px', '2xs': '32px', 'md': '40px', 'lg': '48px' },
        minH: { base: "48px", 'xs': '24px', '2xs': '32px', 'md': '40px', 'lg': '48px' },
        paddingX: { xs: '8px', '2xs': '12px', '2sm': '16px', 'lg': '20px', '2xl': '24px' },
        fontSize: { xs: '12px', '2xs': '14px', '2sm': '16px', 'lg': '18px' },
        fontWeight: 'semibold',
        borderRadius: '48px',
        border: '1px solid',
        boxShadow: '45px 76px 113px 7px rgba(112, 144, 176, 0.08)',
        transition: '0.8s',
        boxSizing: 'border-box',
        _focus: {
          boxShadow: 'none',
        },
        _active: {
          boxShadow: 'none',
        },
      },

      variants: {
        outline: () => ({

        }),
        brand: (props) => ({
          bg: mode('brand.500', 'brand.400')(props),
          color: 'white',
          _focus: {
            bg: mode('brand.500', 'brand.400')(props),
          },
          _active: {
            bg: mode('brand.500', 'brand.400')(props),
          },
          _hover: {
            bg: mode('brand.600', 'brand.400')(props),
          },
        }),

        signIn: (props) => ({
          borderColor: 'brand.blue',
          bg: 'transparent',
          color: 'white',

          _hover: {
            transition: '0.8s',
            bg: 'brand.blue',
            _disabled: {
              bg: 'transparent',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'brand.blue',
            border: '1px solid',
            borderColor: '#fff',
            color: '#fff',
          },
          _active: {
            bg: 'brand.blue',
            border: '1px solid',
            borderColor: '#fff',
            color: '#fff',
          },
        }),
        'ghost-blue': (props) => ({
          borderColor: 'transparent',
          bg: 'transparent',
          color: 'brand.blue',
          marginTop: '-12px',
          outline: 'none',
          _hover: {
            transition: '0.8s',
            color: 'blue.300',
            textDecoration: 'underline',
            _disabled: {
              bg: 'brand.blue',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.6,
          },
          _focus: {
            transition: '0.8s',
            color: 'blue.300',
            textDecoration: 'underline',
            _disabled: {
              color: 'brand.blue',
              opacity: 0.6,
            },
          },
          _active: {
            transition: '0.8s',
            color: 'blue.300',
            textDecoration: 'underline',
          },
        }),

        'ghost-base': (props) => ({
          minWidth: '84px',
          minH: '40px',
          borderColor: 'transparent',
          bg: 'transparent',
          color: 'brand.neutral0',

          textDecoration: 'none',
          outline: 'none',
          _hover: {
            textDecoration: 'underline',
            _disabled: {
              color: '#fff',
              opacity: 0.4,
              textDecoration: 'none',
            },
          },
          _disabled: {
            textDecoration: 'none',
            color: 'brand.neutral0',
            opacity: 0.4,
          },
          _focus: {
            color: '#fff',
            textDecoration: 'underline',
            _disabled: {
              color: '#fff',
              opacity: 0.4,
              textDecoration: 'none',
            },
          },
          _active: {
            color: 'neutral0',
            textDecoration: 'underline',
          },
        }),
        blue: (props) => ({
          borderColor: 'transparent',
          bg: 'brand.blue',
          color: '#fff',
          _hover: {
            transition: '0.8s',
            bg: '#fff',
            color: 'brand.blue',
            _disabled: {
              bg: 'brand.blue',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: '#fff',
            color: 'brand.blue',
            _disabled: {
              bg: 'brand.blue',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: '#fff',
            borderColor: 'brand.blue',
            color: 'brand.blue',
          },
        }),

        cyan: (props) => ({
          borderColor: 'transparent',
          bg: 'brand.cyan',
          color: '#fff',

          _hover: {
            transition: '0.8s',
            bg: '#fff',
            color: 'brand.cyan',
            _disabled: {
              bg: 'brand.cyan',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: '#fff',
            color: 'brand.cyan',
            _disabled: {
              bg: 'brand.cyan',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: '#fff',
            border: '1px solid',
            borderColor: 'brand.blue',
            color: 'brand.blue',
          },
        }),

        twitter: (props) => ({
          borderColor: 'blue.300',
          bg: 'transparent',
          color: 'white',
          _hover: {
            transition: '0.8s',
            bg: 'blue.300',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'blue.300',
            color: '#fff',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
            _disabled: {
              bg: 'blue.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'blue.300',
          },
        }),

        discord: (props) => ({
          bg: 'transparent',
          color: 'white',
          borderColor: 'purple.300',
          _hover: {
            transition: '0.8s',
            bg: 'purple.300',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'purple.300',
            color: '#fff',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
            _disabled: {
              bg: 'purple.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'purple.300',
            borderColor: 'purple.300',
            color: '#fff',
          },
        }),
        wallet: (props) => ({
          borderColor: 'orange.300',
          bg: 'transparent',
          color: 'white',
          _hover: {
            transition: '0.8s',
            bg: 'orange.300',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'orange.300',
            color: '#fff',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
            _disabled: {
              bg: 'orange.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'orange.300',
            color: '#fff',
          },
        }),
        google: (props) => ({
          borderColor: 'red.300',
          bg: 'transparent',
          color: 'white',

          _hover: {
            transition: '0.8s',
            bg: 'red.300',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
            _disabled: {

              svg: {
                fill: 'red.300',
                transition: '0.8s',
              },
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'red.300',
            color: '#fff',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
            _disabled: {
              bg: 'red.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'red.300',
          },
        }),

        'light-blue': (props) => ({
          borderColor: 'transparent',
          bg: 'blue.300',
          color: '#fff',

          _hover: {
            transition: '0.8s',
            bg: '#fff',
            color: 'blue.300',
            _disabled: {
              bg: 'blue.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: '#fff',
            color: 'blue.300',
            _disabled: {
              bg: 'blue.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: '#fff',

            borderColor: 'blue.300',
            color: 'blue.300',
          },
        }),

        'outline-blue': (props) => ({
          borderColor: 'brand.blue',
          bg: 'transparent',
          color: '#fff',

          _hover: {
            transition: '0.8s',
            bg: 'brand.blue',
            color: '#fff',
            _disabled: {
              bg: 'transparent',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'brand.blue',
            color: '#fff',
            borderColor: '#fff',
            _disabled: {
              bg: 'transparent',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'transparent',
            borderColor: 'brand.blue',
            color: 'brand.blue',
          },
        }),

        'outline-light-blue': (props) => ({
          borderColor: 'blue.300',
          bg: 'transparent',
          color: '#fff',

          _hover: {
            transition: '0.8s',
            bg: 'blue.300',
            color: '#fff',
            _disabled: {
              bg: 'transparent',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'blue.300',
            color: '#fff',
            borderColor: '#fff',
            _disabled: {
              bg: 'transparent',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'transparent',
            borderColor: 'blue.300',
            color: 'blue.300',
          },
        }),
        'outline-green': (props) => ({
          borderColor: 'green.300',
          bg: 'transparent',
          color: 'white',
          _hover: {
            transition: '0.8s',
            bg: 'green.300',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: 'green.300',
            color: '#fff',
            svg: {
              fill: 'white',
              transition: '0.8s',
            },
            _disabled: {
              bg: 'green.300',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: 'green.300',
          },
        }),

        gray: (props) => ({
          borderColor: 'transparent',
          bg: 'gray.400',
          color: '#fff',

          _hover: {
            transition: '0.8s',
            bg: '#fff',
            color: 'gray.400',
            _disabled: {
              bg: 'gray.400',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _disabled: {
            opacity: 0.4,
          },
          _focus: {
            transition: '0.8s',
            bg: '#fff',
            color: 'gray.400',
            _disabled: {
              bg: 'gray.400',
              color: '#fff',
              opacity: 0.4,
            },
          },
          _active: {
            bg: '#fff',

            borderColor: 'gray.400',
            color: 'gray.400',
          },
        }),
      },
    },
  },
}

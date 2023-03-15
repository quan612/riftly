import { mode } from '@chakra-ui/theme-tools'
export const switchStyles = {
  components: {
    Switch: {
      baseStyle: {
        thumb: {
          fontWeight: 400,
          borderRadius: '50%',
          w: '24px',
          h: '24px',
          _checked: { transform: 'translate(22px, 0px)' },
        },
        track: {
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          w: '50px',
          h: '28px',
          p: '2px',
          ps: '2px',
          _focus: {
            boxShadow: 'none',
          },
          _checked: { bg: 'brand.blue' },
        },
      },

      variants: {
        main: (props) => ({
          track: {
            bg: mode('brand.blue', 'brand.neutral0')(props),
          },
        }),
      },
    },
  },
}

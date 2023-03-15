import { mode } from '@chakra-ui/theme-tools'
export const radioStyles = {
  components: {
    Radio: {
      parts: ['label', 'control'],
      baseStyle: {
        label: {
          wordWrap: 'unset',
        },
        control: {
          _checked: {
            color: '#00BBC7',
            borderColor: 'brand.neutral3',
            backgroundColor: 'transparent',
            _hover: {
              color: '#00BBC7',
              borderColor: 'brand.neutral3',
              backgroundColor: 'transparent',
            }
          },

        }
      },
      variants: {

      },
    },
  },
}

import { extendTheme } from '@chakra-ui/react'
import { CardComponent } from './additions/card/card'
import { buttonStyles } from './components/button'
import { radioStyles } from './components/radio'
import { badgeStyles } from './components/badge'
import { inputStyles } from './components/input'
import { progressStyles } from './components/progress'
import { sliderStyles } from './components/slider'
import { textareaStyles } from './components/textarea'
import { switchStyles } from './components/switch'
import { linkStyles } from './components/link'
import { breakpoints } from './foundations/breakpoints'
import { globalStyles } from './styles'
import { MainPanelComponent } from './additions/layout/MainPanel'
import { PanelContentComponent } from './additions/layout/PanelContent'
import { PanelContainerComponent } from './additions/layout/PanelContainer'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const riftlyColor = {
  brand: {
    neutral5: '#132436',
    neutral4: '#1D3148',
    blue: '#1D63FF',
    cyan: '#00BBC7',
    neutral3: '#2F4E6D',
    neutral2: '#597BA1',
    neutral1: '#89A4C2',
    neutral0: '#D4E0ED',
  },
}

const fonts = {
  // ...chakraTheme.fonts,
  body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  heading: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
}

export default extendTheme(
  { breakpoints }, // Breakpoints
  globalStyles,
  badgeStyles, // badge styles
  radioStyles, //radio styles
  buttonStyles, // button styles
  linkStyles, // link styles
  progressStyles, // progress styles
  sliderStyles, // slider styles
  inputStyles, // input styles
  textareaStyles, // textarea styles
  switchStyles, // switch styles
  CardComponent, // card component
  MainPanelComponent,
  PanelContentComponent,
  PanelContainerComponent,
  {
    fonts,
    colors: riftlyColor,
  },
  { config },
  {
    components: {
      Drawer: {
        variants: {
          permanent: {
            dialog: {
              pointerEvents: 'auto',
            },
            dialogContainer: {
              pointerEvents: 'none',
            },
          },
        },
      },
    },
  },
  {
    components: {
      Progress: {
        baseStyle: {
          filledTrack: {
            bg: '#1D63FF',
          },
          track: { bg: 'rgba(255, 255, 255, 0.1)' },
        },
        variants: {
          noBg: {
            filledTrack: {
              bg: '#1D63FF',
            },
            track: { bg: 'transparent' },
          },
        },
      },
    },
  },

)

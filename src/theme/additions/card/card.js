const Card = {
  baseStyle: (props) => ({
    p: '20px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    borderRadius: '20px',
    minWidth: '0px',
    wordWrap: 'break-word',
    bg: 'brand.neutral4',
    backgroundClip: 'border-box',
  }),
}

export const CardComponent = {
  components: {
    Card,
  },
}

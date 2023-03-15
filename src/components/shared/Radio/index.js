import React from 'react'

import { Radio, RadioGroup, useBreakpointValue } from '@chakra-ui/react'

export default function RiftlyRadio({ value, children, ...rest }) {
  const radioSize = useBreakpointValue({ base: 'sm', sm: 'md', lg: 'lg' })
  return (
    <Radio size={radioSize} value={value} {...rest}>
      {children}
    </Radio>
  )
}

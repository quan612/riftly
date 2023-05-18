// Modules
import { Field } from 'formik'

// UI
import { FormControl, FormLabel, Input, useTheme } from '@chakra-ui/react'

interface IFormikInput {
  label: string
  name: string
  type?: 'text'
  value?: string
}

const FormikInput = ({ label, name, type = 'text', value = '' }: IFormikInput) => {
  const theme = useTheme()

  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold" color={theme.colors.white}>
        {label}
      </FormLabel>
      <Field
        as={Input}
        disabled
        fontSize="md"
        ms="4px"
        name={name}
        type={type}
        value={value}
        variant="riftly"
      />
    </FormControl>
  )
}
export default FormikInput

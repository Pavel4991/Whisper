import { Input } from '@mantine/core'
import type { GetInputPropsReturnType } from '@mantine/form'
import type { ReactNode } from 'react'

interface AuthFieldProps {
  fieldName: string
  label: string
  error?: ReactNode
  inputProps: GetInputPropsReturnType
}

export function AuthField({ fieldName, label, error, inputProps }: AuthFieldProps) {
  return (
    <Input.Wrapper
      label={label}
      labelProps={{ fw: 400, c: 'var(--mantine-color-gray-7)' }}
      error={error}
      errorProps={{ 'data-testid': `${fieldName}-error` }}
      mb="md"
    >
      <Input
        placeholder={label}
        radius="xl"
        size="md"
        bg="var(--mantine-color-body)"
        {...inputProps}
        error={!!error}
      />
    </Input.Wrapper>
  )
}

import { useState } from 'react'
import { ZodSchema, ZodError } from 'zod'

interface ValidationError {
  campo: string
  mensagem: string
}

export function useValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValid, setIsValid] = useState(true)

  const validate = (data: unknown): data is T => {
    try {
      schema.parse(data)
      setErrors([])
      setIsValid(true)
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
        setErrors(validationErrors)
        setIsValid(false)
      }
      return false
    }
  }

  const validateAsync = async (data: unknown): Promise<T | null> => {
    try {
      const validated = await schema.parseAsync(data)
      setErrors([])
      setIsValid(true)
      return validated
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
        setErrors(validationErrors)
        setIsValid(false)
      }
      return null
    }
  }

  const clearErrors = () => {
    setErrors([])
    setIsValid(true)
  }

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find(err => err.campo === fieldName)
    return error?.mensagem
  }

  return {
    validate,
    validateAsync,
    errors,
    isValid,
    clearErrors,
    getFieldError
  }
}
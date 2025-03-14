import { useState, useCallback } from 'react';

/**
 * Hook genérico para validación de formularios.
 * Gestiona los errores de validación y proporciona métodos para validar datos.
 *
 * @param validator - Función que recibe los datos del formulario y devuelve errores
 * @returns Objeto con errores, función de validación y métodos para gestionar errores
 */
export function useFormValidation<
  TValues,
  TErrors extends Record<string, string>,
>(validator: (values: TValues) => TErrors) {
  const [errors, setErrors] = useState<TErrors>({} as TErrors);

  // Validar los valores del formulario
  const validate = useCallback(
    (values: TValues): boolean => {
      const validationErrors = validator(values);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    },
    [validator],
  );

  // Limpiar todos los errores
  const clearErrors = useCallback(() => {
    setErrors({} as TErrors);
  }, []);

  // Limpiar un error específico
  const clearFieldError = useCallback((field: keyof TErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  return {
    errors,
    setErrors,
    validate,
    clearErrors,
    clearFieldError,
  };
}

import { useState, useCallback, useEffect } from 'react';
import { useFormValidation } from './useFormValidation';

interface UseFormOptions<TValues, TErrors extends Record<string, string>> {
  initialValues: TValues;
  validator: (values: TValues) => TErrors;
  onSubmit?: (values: TValues) => Promise<boolean>;
  resetOnSubmitSuccess?: boolean;
}

/**
 * Hook genérico para gestión de formularios con validación.
 * Combina gestión de estado, validación y envío de formularios.
 *
 * @param options - Opciones de configuración del formulario
 * @returns Objeto con valores, errores y métodos para gestionar el formulario
 */
export function useForm<
  TValues extends Record<string, any>,
  TErrors extends Record<string, string>,
>({
  initialValues,
  validator,
  onSubmit,
  resetOnSubmitSuccess = false,
}: UseFormOptions<TValues, TErrors>) {
  // Estado del formulario
  const [values, setValues] = useState<TValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Utilizar el hook de validación
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation<
    TValues,
    TErrors
  >(validator);

  // Manejar cambios en los campos
  const handleChange = useCallback(
    (field: keyof TValues, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      clearFieldError(field as keyof TErrors);
      setSubmitError(null);
    },
    [clearFieldError],
  );

  // Establecer un valor específico
  const setValue = useCallback((field: keyof TValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Establecer múltiples valores a la vez
  const setMultipleValues = useCallback((newValues: Partial<TValues>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Resetear el formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    clearErrors();
    setSubmitError(null);
  }, [initialValues, clearErrors]);

  // Manejar el envío del formulario
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false;

    setSubmitError(null);
    const isValid = validate(values);
    if (!isValid) return false;

    setIsSubmitting(true);
    setSubmitCount((prev) => prev + 1);

    try {
      if (onSubmit) {
        const success = await onSubmit(values);

        if (success && resetOnSubmitSuccess) {
          resetForm();
        }

        return success;
      }
      return true;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Error al enviar el formulario',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    validate,
    values,
    onSubmit,
    resetOnSubmitSuccess,
    resetForm,
  ]);

  // Efecto para validar cuando cambian los valores y ya se ha intentado enviar
  useEffect(() => {
    if (submitCount > 0) {
      validate(values);
    }
  }, [values, submitCount, validate]);

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit,
    resetForm,
    setValue,
    setMultipleValues,
    validate: () => validate(values),
    clearErrors,
    clearFieldError: (field: keyof TErrors) => clearFieldError(field),
  };
}

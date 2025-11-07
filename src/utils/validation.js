/**
 * Valida que el email tenga un formato válido
 * @param {string} email - El email a validar
 * @returns {boolean} - True si el email es válido, false en caso contrario
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida el formulario de login
 * @param {Object} formData - Objeto con los datos del formulario
 * @param {string} formData.email - Email del usuario
 * @param {string} formData.password - Contraseña del usuario
 * @returns {Object} - Objeto con los errores encontrados
 */
export const validateLoginForm = (formData) => {
  const newErrors = {};

  if (!formData.email.trim()) {
    newErrors.email = "El email es requerido";
  } else if (!validateEmail(formData.email)) {
    newErrors.email = "El formato del email no es válido";
  }

  if (!formData.password.trim()) {
    newErrors.password = "La contraseña es requerida";
  }

  return newErrors;
};

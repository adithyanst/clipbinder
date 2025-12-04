export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateName(name) {
  return name && name.trim().length > 0;
}

export function validateUser({ email, password, name }) {
  if (!validateEmail(email)) {
    const error = new Error("Invalid email format");
    error.status = 400;
    throw error;
  }

  if (!validatePassword(password)) {
    const error = new Error("Password must be at least 6 characters");
    error.status = 400;
    throw error;
  }

  if (name && !validateName(name)) {
    const error = new Error("Invalid name");
    error.status = 400;
    throw error;
  }
}

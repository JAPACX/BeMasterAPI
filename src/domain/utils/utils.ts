export function generateUUID(): string {
  const hexChars = "0123456789abcdef";

  const getRandomHexChar = () => hexChars[Math.floor(Math.random() * 16)];

  const generateSegment = (length: number) =>
    Array.from({ length }, getRandomHexChar).join("");

  return (
    generateSegment(8) +
    "-" +
    generateSegment(4) +
    "-4" +
    generateSegment(3) +
    "-a" +
    getRandomHexChar() +
    generateSegment(3) +
    "-" +
    generateSegment(12)
  );
}

export function isStrongPassword(password: string): boolean {
  // Password must be 5 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,15}$/;
  return passwordRegex.test(password);
}

export function isAlphanumeric(username: string): boolean {
  // Username must only contain letters and numbers
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(username);
}

export function isValidEmail(email: string): boolean {
  // Invalid email format or length exceeds 30 characters
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,30}$/;
  return emailRegex.test(email) && email.length <= 30;
}

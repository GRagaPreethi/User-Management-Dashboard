export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export const validateUser = (user) => {
  const errors = {};
  if (!user.firstName || !user.firstName.trim()) {
    errors.firstName = "First name is required";
  }
  if (!user.lastName || !user.lastName.trim()) {
    errors.lastName = "Last name is required";
  }
  if (!user.email || !user.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(user.email)) {
    errors.email = "Invalid email format";
  }
  if (!user.department) {
    errors.department = "Department is required";
  }
  return Object.keys(errors).length === 0 ? null : errors;
};

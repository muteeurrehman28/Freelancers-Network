// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password requirements
export const isValidPassword = (password) => {
  // Min 6 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Validate URL format
export const isValidUrl = (url) => {
  // Simple URL validation
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlRegex.test(url);
};

// Validate job title
export const isValidJobTitle = (title) => {
  return title.trim().length >= 5 && title.trim().length <= 100;
};

// Validate job description
export const isValidJobDescription = (description) => {
  return description.trim().length >= 20 && description.trim().length <= 5000;
};

// Validate number
export const isValidNumber = (number) => {
  return !isNaN(number) && number > 0;
};

// Validate required field
export const isFieldEmpty = (field) => {
  if (Array.isArray(field)) {
    return field.length === 0;
  }
  return field === null || field === undefined || field.trim() === '';
};

// Validate registration form
export const validateRegistration = (values) => {
  const errors = {};

  if (isFieldEmpty(values.name)) {
    errors.name = 'Name is required';
  }

  if (isFieldEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (isFieldEmpty(values.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'Password must be at least 6 characters with letters and numbers';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// Validate login form
export const validateLogin = (values) => {
  const errors = {};

  if (isFieldEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (isFieldEmpty(values.password)) {
    errors.password = 'Password is required';
  }

  return errors;
};

// Validate job form
export const validateJobForm = (values) => {
  const errors = {};

  if (isFieldEmpty(values.title)) {
    errors.title = 'Title is required';
  } else if (!isValidJobTitle(values.title)) {
    errors.title = 'Title must be between 5-100 characters';
  }

  if (isFieldEmpty(values.description)) {
    errors.description = 'Description is required';
  } else if (!isValidJobDescription(values.description)) {
    errors.description = 'Description must be between 20-5000 characters';
  }

  if (isFieldEmpty(values.budget)) {
    errors.budget = 'Budget is required';
  } else if (!isValidNumber(values.budget)) {
    errors.budget = 'Budget must be a positive number';
  }

  if (isFieldEmpty(values.duration)) {
    errors.duration = 'Duration is required';
  }

  if (isFieldEmpty(values.skillsRequired) || values.skillsRequired.length === 0) {
    errors.skillsRequired = 'At least one skill is required';
  }

  return errors;
};

// Validate application form
export const validateApplicationForm = (values) => {
  const errors = {};

  if (isFieldEmpty(values.coverLetter)) {
    errors.coverLetter = 'Cover letter is required';
  } else if (values.coverLetter.trim().length < 50) {
    errors.coverLetter = 'Cover letter must be at least 50 characters';
  }

  if (isFieldEmpty(values.proposedBudget)) {
    errors.proposedBudget = 'Proposed budget is required';
  } else if (!isValidNumber(values.proposedBudget)) {
    errors.proposedBudget = 'Proposed budget must be a positive number';
  }

  return errors;
};

// Validate profile form
export const validateProfileForm = (values) => {
  const errors = {};

  if (isFieldEmpty(values.name)) {
    errors.name = 'Name is required';
  }

  if (isFieldEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (values.password && !isValidPassword(values.password)) {
    errors.password = 'Password must be at least 6 characters with letters and numbers';
  }

  if (values.profilePicture && !isValidUrl(values.profilePicture)) {
    errors.profilePicture = 'Invalid URL format';
  }

  return errors;
}; 
export const messages = {
  auth: {
    loginSuccess: 'Login successful',
    invalidCredentials: 'Invalid email or password',
    unauthorized: 'Authentication token is required',
    invalidToken: 'Invalid or expired session token',
    forbidden: 'You do not have permission to perform this action',
    emailExists: 'A user with this email already exists',
    userCreated: 'User account created successfully',
    accountDeactivated: 'Your account has been deactivated',
  },
  validation: {
    invalidEmail: 'Please enter a valid email address',
    passwordLength: 'Password must be at least 6 characters long',
    requiredFields: 'All required fields must be provided',
    invalidNumber: 'Value must be a valid number',
    invalidDate: 'Please provide a valid date',
    invalidStatus: 'Status must be active or inactive',
  },
  vehicle: {
    created: 'Vehicle added successfully',
    updated: 'Vehicle updated successfully',
    notFound: 'Vehicle not found',
    alreadyExists: 'A vehicle with this registration number already exists',
  },
  driver: {
    created: 'Driver registered successfully',
    updated: 'Driver details updated successfully',
    notFound: 'Driver not found',
    alreadyExists: 'A driver with this license number already exists',
  },
  maintenance: {
    created: 'Maintenance log created successfully',
    updated: 'Maintenance log updated successfully',
    notFound: 'Maintenance log not found',
  },
  fuelLog: {
    created: 'Fuel log recorded successfully',
    notFound: 'Fuel log not found',
  },
  expense: {
    created: 'Expense log recorded successfully',
    notFound: 'Expense log not found',
  },
  role: {
    created: 'Role created successfully',
    notFound: 'Role not found',
    alreadyExists: 'Role already exists',
  },
  user: {
    notFound: 'User not found',
  },
  general: {
    serverError: 'Internal server error occurred',
  }
};

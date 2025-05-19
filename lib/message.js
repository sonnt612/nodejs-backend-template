module.exports = {
  USER: {
    CREATE_SUCCESS: {
      head: 'Success',
      body: 'User account created successfully.'
    },
    UPDATE_SUCCESS: {
      head: 'Success',
      body: 'User account updated successfully.'
    },
    EXISTS: {
      head: 'Error',
      body: 'User already exists.'
    },
    NOT_EXISTS: {
      head: 'Error',
      body: 'User does not exist.'
    },
    NOT_CHANGE: {
      head: 'Warning',
      body: 'No changes were made to the user account.'
    },
    INCORRECT_PASSWORD: {
      head: 'Error',
      body: 'Incorrect password. Please try again.'
    },
    TOKEN_EXPIRE: {
      head: 'Session Expired',
      body: 'Your session has expired. Please log in again.'
    }
  },
  SYSTEM: {
    ERROR: {
      head: 'System Error',
      body: 'An error occurred. Please try again later.'
    },
    WRONG_PARAMS: {
      head: 'Invalid Parameters',
      body: 'Please check your input and try again.'
    },
    SUCCESS: {
      head: 'Success',
      body: 'Operation completed successfully.'
    }
  }
}

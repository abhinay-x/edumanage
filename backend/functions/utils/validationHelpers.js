// Validation helper functions for EduManage backend

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateRole = (role) => {
  const validRoles = ['super_admin', 'teacher', 'student'];
  return validRoles.includes(role);
};

const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const validateGrade = (score, maxScore) => {
  return typeof score === 'number' && 
         typeof maxScore === 'number' && 
         score >= 0 && 
         maxScore > 0 && 
         score <= maxScore;
};

const validateAttendanceStatus = (status) => {
  const validStatuses = ['present', 'absent', 'late', 'excused'];
  return validStatuses.includes(status);
};

const validateUserData = (userData) => {
  const errors = [];

  if (!userData.firstName || userData.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }

  if (!userData.lastName || userData.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }

  if (!validateEmail(userData.email)) {
    errors.push('Invalid email format');
  }

  if (!validateRole(userData.role)) {
    errors.push('Invalid role specified');
  }

  if (userData.phoneNumber && !/^\+?[\d\s-()]{10,15}$/.test(userData.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateAssignmentData = (assignmentData) => {
  const errors = [];

  if (!assignmentData.title || assignmentData.title.trim().length < 3) {
    errors.push('Assignment title must be at least 3 characters long');
  }

  if (!assignmentData.description || assignmentData.description.trim().length < 10) {
    errors.push('Assignment description must be at least 10 characters long');
  }

  if (!validateDate(assignmentData.dueDate)) {
    errors.push('Invalid due date');
  }

  if (new Date(assignmentData.dueDate) <= new Date()) {
    errors.push('Due date must be in the future');
  }

  if (!assignmentData.classId) {
    errors.push('Class ID is required');
  }

  if (!assignmentData.subjectId) {
    errors.push('Subject ID is required');
  }

  if (assignmentData.maxScore && (typeof assignmentData.maxScore !== 'number' || assignmentData.maxScore <= 0)) {
    errors.push('Max score must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateGradeData = (gradeData) => {
  const errors = [];

  if (!gradeData.studentId) {
    errors.push('Student ID is required');
  }

  if (!gradeData.assignmentId) {
    errors.push('Assignment ID is required');
  }

  if (!validateGrade(gradeData.score, gradeData.maxScore)) {
    errors.push('Invalid grade: score must be between 0 and max score');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateClassData = (classData) => {
  const errors = [];

  if (!classData.name || classData.name.trim().length < 2) {
    errors.push('Class name must be at least 2 characters long');
  }

  if (!classData.grade || classData.grade < 1 || classData.grade > 12) {
    errors.push('Grade must be between 1 and 12');
  }

  if (classData.capacity && (typeof classData.capacity !== 'number' || classData.capacity < 1)) {
    errors.push('Capacity must be a positive number');
  }

  if (!classData.academicYearId) {
    errors.push('Academic year ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

const sanitizeUserData = (userData) => {
  return {
    ...userData,
    firstName: sanitizeInput(userData.firstName),
    lastName: sanitizeInput(userData.lastName),
    email: sanitizeInput(userData.email)?.toLowerCase(),
    phoneNumber: sanitizeInput(userData.phoneNumber),
    address: sanitizeInput(userData.address),
    bio: sanitizeInput(userData.bio)
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRole,
  validateDate,
  validateGrade,
  validateAttendanceStatus,
  validateUserData,
  validateAssignmentData,
  validateGradeData,
  validateClassData,
  sanitizeInput,
  sanitizeUserData
};

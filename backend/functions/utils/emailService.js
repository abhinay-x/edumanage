const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: functions.config().email.user,
      pass: functions.config().email.password
    }
  });
};

// Email templates
const emailTemplates = {
  welcome: (userData) => ({
    subject: 'Welcome to EduManage!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to EduManage!</h2>
        <p>Dear ${userData.firstName} ${userData.lastName},</p>
        <p>Your account has been successfully created in the EduManage system.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Account Details:</h3>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> ${userData.role}</p>
          <p><strong>Employee/Student ID:</strong> ${userData.employeeId || userData.studentId || 'N/A'}</p>
        </div>
        <p>You can now log in to your dashboard and start using the system.</p>
        <p>If you have any questions, please contact your administrator.</p>
        <p>Best regards,<br>EduManage Team</p>
      </div>
    `
  }),

  assignmentDue: (assignmentData, studentData) => ({
    subject: `Assignment Due: ${assignmentData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Assignment Due Reminder</h2>
        <p>Dear ${studentData.firstName},</p>
        <p>This is a reminder that your assignment is due soon.</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${assignmentData.title}</h3>
          <p><strong>Subject:</strong> ${assignmentData.subject}</p>
          <p><strong>Due Date:</strong> ${assignmentData.dueDate}</p>
          <p><strong>Description:</strong> ${assignmentData.description}</p>
        </div>
        <p>Please make sure to submit your assignment on time.</p>
        <p>Best regards,<br>EduManage Team</p>
      </div>
    `
  }),

  gradeUpdate: (gradeData, studentData) => ({
    subject: 'New Grade Posted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Grade Update</h2>
        <p>Dear ${studentData.firstName},</p>
        <p>A new grade has been posted for your assignment.</p>
        <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${gradeData.assignmentTitle}</h3>
          <p><strong>Subject:</strong> ${gradeData.subject}</p>
          <p><strong>Grade:</strong> ${gradeData.score}/${gradeData.maxScore}</p>
          <p><strong>Percentage:</strong> ${Math.round((gradeData.score / gradeData.maxScore) * 100)}%</p>
          ${gradeData.feedback ? `<p><strong>Feedback:</strong> ${gradeData.feedback}</p>` : ''}
        </div>
        <p>You can view detailed feedback in your student portal.</p>
        <p>Best regards,<br>EduManage Team</p>
      </div>
    `
  }),

  attendanceAlert: (attendanceData, studentData, parentData) => ({
    subject: 'Attendance Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Attendance Alert</h2>
        <p>Dear ${parentData ? parentData.firstName : studentData.firstName},</p>
        <p>This is to inform you about attendance concerns.</p>
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Student: ${studentData.firstName} ${studentData.lastName}</h3>
          <p><strong>Class:</strong> ${attendanceData.className}</p>
          <p><strong>Attendance Rate:</strong> ${attendanceData.attendanceRate}%</p>
          <p><strong>Days Absent:</strong> ${attendanceData.absentDays}</p>
        </div>
        <p>Please ensure regular attendance for better academic performance.</p>
        <p>Best regards,<br>EduManage Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data);
    
    const mailOptions = {
      from: functions.config().email.user,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Bulk email function
const sendBulkEmail = async (recipients, template, data) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail(recipient.email, template, { ...data, ...recipient });
      results.push({ email: recipient.email, success: true, messageId: result.messageId });
    } catch (error) {
      results.push({ email: recipient.email, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
};

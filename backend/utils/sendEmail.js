const sendEmail = async (options) => {
  // This is a placeholder for email sending functionality
  // In a real application, you would use a service like SendGrid, Mailgun, etc.
  console.log(`Email sent to ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message: ${options.message}`);
};

module.exports = sendEmail;
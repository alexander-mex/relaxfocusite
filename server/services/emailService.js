const nodemailer = require("nodemailer")

async function sendVerificationEmail(email, verificationToken) {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `RelaxFocusite <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: `
        <div style="
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          border: 1px solid #eaeaea;
          border-radius: 0.5rem;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        ">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <!-- Logo can be added here -->
          </div>
          <h2 style="
            color: #2d3748;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
            text-align: center;
          ">Email Verification</h2>
          <p style="
            color: #4a5568;
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 1rem;
          ">Thank you for registering! Please click the link below to verify your email address:</p>
          <div style="margin: 1.5rem 0; text-align: center;">
            <a href="${verificationUrl}" style="
              background-color: #4299e1;
              color: #ffffff;
              padding: 0.75rem 1.5rem;
              text-decoration: none;
              border-radius: 0.375rem;
              display: inline-block;
              font-weight: 500;
              font-size: 1rem;
              transition: all 0.2s ease;
            " onmouseover="this.style.backgroundColor='#3182ce'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)';" onmouseout="this.style.backgroundColor='#4299e1'; this.style.transform=''; this.style.boxShadow='';">Verify Email Address</a>
          </div>
          <p style="
            color: #4a5568;
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 1rem;
          ">If you didn't register on our site, please ignore this email.</p>
          <div style="
            color: #718096;
            font-size: 0.875rem;
            margin-top: 1.5rem;
            border-top: 1px solid #eaeaea;
            padding-top: 1rem;
          ">
            <p>Best regards,<br>The RelaxFocusite Team</p>
          </div>
        </div>
      `,
    };

    const result = await transport.sendMail(mailOptions)
    console.log("Email sent:", result)
    return result
  } catch (err) {
    console.error("Email sending error:", err)
    throw err
  }
}

module.exports = { sendVerificationEmail }
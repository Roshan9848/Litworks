import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_TO = "litworks.media@gmail.com";

export async function sendBookingEmail(bookingData: any) {
  // If SMTP settings are missing, log and skip gracefully
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "SMTP configuration is missing (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping booking email notification."
    );
    return { success: false, reason: "SMTP settings not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Generate dynamic fields HTML
    let dynamicFieldsHTML = "";
    if (bookingData.dynamicFields && Object.keys(bookingData.dynamicFields).length > 0) {
      dynamicFieldsHTML = `
        <div style="margin-top: 20px; padding: 15px; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #ff7a00;">
          <h3 style="color: #ff7a00; margin-top: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Service Specific Details</h3>
          <table style="width: 100%; border-collapse: collapse; color: #ffffff;">
            ${Object.entries(bookingData.dynamicFields)
              .filter(([_, v]) => v !== undefined && v !== "")
              .map(
                ([key, value]) => `
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 40%; text-transform: capitalize; color: #a3a3a3;">${key.replace(/([A-Z])/g, ' $1')}:</td>
                <td style="padding: 6px 0; color: #ffffff;">${value}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>
      `;
    }

    const htmlContent = `
      <div style="background-color: #000000; color: #ffffff; font-family: 'Outfit', sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #333;">
        <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: 24px; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
            LIT<span style="color: #ff7a00;">WORKS</span>
          </h1>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">New Booking Inquiry</p>
        </div>
        
        <div style="padding: 20px 0;">
          <p style="color: #ccc; font-size: 15px; line-height: 1.6;">You have received a new service booking inquiry from the LITWORKS website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #ffffff;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #222; width: 35%; color: #a3a3a3;">Client Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">${bookingData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #222; color: #a3a3a3;">Phone Number:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">
                <a href="tel:${bookingData.phone}" style="color: #ff7a00; text-decoration: none;">${bookingData.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #222; color: #a3a3a3;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">
                <a href="mailto:${bookingData.email || ""}" style="color: #ff7a00; text-decoration: none;">${bookingData.email || "Not Provided"}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #222; color: #a3a3a3;">Location:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">${bookingData.city || "N/A"}, ${bookingData.state || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #222; color: #a3a3a3;">Service Requested:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ff7a00; font-weight: bold;">${bookingData.service}</td>
            </tr>
          </table>

          ${dynamicFieldsHTML}

          ${
            bookingData.notes
              ? `
            <div style="margin-top: 20px;">
              <h4 style="color: #a3a3a3; margin-bottom: 5px; font-size: 14px;">Additional Notes:</h4>
              <p style="background-color: #0d0d0d; border-left: 3px solid #ff7a00; padding: 10px 15px; color: #ccc; margin: 0; font-style: italic; font-size: 14px;">
                "${bookingData.notes}"
              </p>
            </div>
          `
              : ""
          }
        </div>

        <div style="border-top: 1px solid #333; padding-top: 20px; text-align: center; color: #555; font-size: 11px;">
          <p style="margin: 0;">This is an automated notification from LITWORKS Web Portal.</p>
          <p style="margin: 5px 0 0 0;">© 2025 LITWORKS. All Rights Reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${bookingData.name} via LITWORKS" <${SMTP_USER}>`,
      to: EMAIL_TO,
      subject: `LITWORKS Booking: ${bookingData.service} - ${bookingData.name}`,
      text: `New booking inquiry from ${bookingData.name} for ${bookingData.service}. Phone: ${bookingData.phone}, Email: ${bookingData.email}. Location: ${bookingData.city}, ${bookingData.state}.`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Booking email notification sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send booking email notification:", error);
    return { success: false, error };
  }
}

export async function sendClientConfirmationEmail(bookingData: any) {
  if (!bookingData.email) {
    console.warn("Client email is missing. Skipping client confirmation email.");
    return { success: false, reason: "Client email is missing" };
  }
  // If SMTP settings are missing, log and skip gracefully
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { success: false, reason: "SMTP settings not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const clientHtmlContent = `
      <div style="background-color: #000000; color: #ffffff; font-family: 'Outfit', sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #333;">
        <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: 24px; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
            LIT<span style="color: #ff7a00;">WORKS</span>
          </h1>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">Booking Inquiry Received</p>
        </div>
        
        <div style="padding: 20px 0;">
          <h2 style="color: #ff7a00; font-size: 18px; margin-top: 0; font-weight: normal;">Hi ${bookingData.name},</h2>
          <p style="color: #ccc; font-size: 15px; line-height: 1.6; font-weight: 300;">Thank you for reaching out to LITWORKS! We have successfully received your booking inquiry for <strong>${bookingData.service}</strong>.</p>
          <p style="color: #ccc; font-size: 15px; line-height: 1.6; font-weight: 300;">Our production team is already reviewing your details. As a key service standard, <strong>we typically respond to all inquiries within minutes</strong>. We will connect with you shortly!</p>
          
          <div style="margin-top: 25px; padding: 15px; background-color: #0a0a0a; border-radius: 8px; border: 1px solid #222;">
            <h3 style="color: #ff7a00; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Summary of Details</h3>
            <table style="width: 100%; border-collapse: collapse; color: #ffffff; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 35%; color: #a3a3a3;">Service:</td>
                <td style="padding: 6px 0; color: #ff7a00; font-weight: bold;">${bookingData.service}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #a3a3a3;">Location:</td>
                <td style="padding: 6px 0; color: #ffffff;">${bookingData.city}, ${bookingData.state}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="border-top: 1px solid #333; padding-top: 20px; text-align: center; color: #555; font-size: 11px;">
          <p style="margin: 0; color: #888;">LITWORKS Creative Media & Marketing Agency</p>
          <p style="margin: 5px 0 0 0; color: #666;">Call: +91 9110797354 | WhatsApp: +91 9866571801 | Email: litworks.media@gmail.com</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"LITWORKS Agency" <${SMTP_USER}>`,
      to: bookingData.email,
      subject: `LITWORKS Inquiry Confirmed: ${bookingData.service}`,
      text: `Hi ${bookingData.name}, thank you for reaching out to LITWORKS! We have received your inquiry for ${bookingData.service} and will connect with you within minutes.`,
      html: clientHtmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Client confirmation email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send client confirmation email:", error);
    return { success: false, error };
  }
}


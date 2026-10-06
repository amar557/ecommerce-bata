import nodemailer from "nodemailer";
import ContactMessage from "../Schema/ContactSchema.js";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || process.env.CONTACT_TO_EMAIL;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export const submitContact = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const subject = String(req.body?.subject || "").trim() || "Contact form message";
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        msg: "Name, email, and message are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      emailed: false,
    });

    const to = process.env.CONTACT_TO_EMAIL || "amarhussain391@gmail.com";
    const transporter = getTransporter();
    let emailed = false;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"BATA Store Contact" <${process.env.SMTP_USER || to}>`,
          to,
          replyTo: email,
          subject: `[Contact] ${subject}`,
          text: [
            `New contact form message`,
            ``,
            `Name: ${name}`,
            `Email: ${email}`,
            `Subject: ${subject}`,
            ``,
            `Message:`,
            message,
          ].join("\n"),
          html: `
            <h2>New contact form message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br/>")}</p>
          `,
        });
        emailed = true;
        contact.emailed = true;
        await contact.save();
      } catch (mailErr) {
        console.error("Contact email send failed:", mailErr.message);
      }
    } else {
      console.warn(
        "Contact email skipped: set SMTP_USER and SMTP_PASS in server/.env (Gmail App Password)"
      );
    }

    if (!emailed && !transporter) {
      return res.status(503).json({
        msg: "Email is not configured on the server. Add SMTP_USER and SMTP_PASS (Gmail App Password) to server/.env, then restart.",
      });
    }

    if (!emailed) {
      return res.status(500).json({
        msg: "Could not send email. Check SMTP settings in server/.env.",
      });
    }

    res.status(200).json({
      msg: "Message sent successfully. We will get back to you soon.",
      emailed: true,
    });
  } catch (error) {
    console.error("Contact submit error:", error);
    res.status(500).json({
      msg: "Failed to submit message",
      error: error.message,
    });
  }
};

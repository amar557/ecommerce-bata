import nodemailer from "nodemailer";
import NewsletterSubscriber from "../Schema/NewsletterSchema.js";

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

export const subscribeNewsletter = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({
        msg: "You are already subscribed to our newsletter.",
        alreadySubscribed: true,
      });
    }

    await NewsletterSubscriber.create({ email });

    const to = process.env.CONTACT_TO_EMAIL || "amarhussain391@gmail.com";
    const transporter = getTransporter();

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"BATA Store" <${process.env.SMTP_USER || to}>`,
          to,
          subject: "New newsletter subscription",
          text: `New subscriber: ${email}`,
          html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
        });
      } catch (mailErr) {
        console.error("Newsletter notify email failed:", mailErr.message);
      }
    }

    res.status(201).json({
      msg: "Subscribed successfully! You'll get exclusive offers in your inbox.",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({
        msg: "You are already subscribed to our newsletter.",
        alreadySubscribed: true,
      });
    }
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({
      msg: "Failed to subscribe. Please try again.",
      error: error.message,
    });
  }
};

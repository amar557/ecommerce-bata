import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, default: "Contact form message" },
    message: { type: String, required: true, trim: true },
    emailed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactSchema);
export default ContactMessage;

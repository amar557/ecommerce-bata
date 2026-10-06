import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSchema
);
export default NewsletterSubscriber;

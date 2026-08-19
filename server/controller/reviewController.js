import mongoose from "mongoose";
import Review from "../Schema/ReviewSchema.js";
import Order from "../Schema/OrderSchema.js";
import ListItem from "../Schema/ItemSchema.js";

function buildSummary(reviews) {
  const total = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const r of reviews) {
    const rating = Number(r.rating) || 0;
    if (rating >= 1 && rating <= 5) {
      distribution[rating] += 1;
      sum += rating;
    }
  }

  const average = total ? Math.round((sum / total) * 10) / 10 : 0;

  return {
    total,
    average,
    distribution,
  };
}

function formatRelativeDate(date) {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  return d.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid product id" });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [allForSummary, reviews, totalCount] = await Promise.all([
      Review.find({ productId }).select("rating"),
      Review.find({ productId })
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ productId }),
    ]);

    const summary = buildSummary(allForSummary);

    const items = reviews.map((r) => ({
      id: r._id,
      rating: r.rating,
      comment: r.comment,
      verified: Boolean(r.verified),
      name: r.userId?.name || "Customer",
      userId: r.userId?._id || null,
      date: formatRelativeDate(r.createdAt),
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      summary,
      reviews: items,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: skip + items.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ msg: "Failed to fetch reviews", error: error.message });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Please log in to leave a review" });
    }

    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid product id" });
    }

    const product = await ListItem.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const rating = Number(req.body?.rating);
    const comment = String(req.body?.comment || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be an integer from 1 to 5" });
    }
    if (comment.length < 3) {
      return res.status(400).json({ msg: "Review comment must be at least 3 characters" });
    }
    if (comment.length > 1000) {
      return res.status(400).json({ msg: "Review comment is too long" });
    }

    const purchased = await Order.exists({
      userId,
      "items.productId": productId,
    });

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.verified = Boolean(purchased);
      await existing.save();
      await existing.populate("userId", "name email");

      return res.status(200).json({
        msg: "Review updated",
        review: {
          id: existing._id,
          rating: existing.rating,
          comment: existing.comment,
          verified: existing.verified,
          name: existing.userId?.name || "Customer",
          userId: existing.userId?._id || userId,
          date: formatRelativeDate(existing.updatedAt || existing.createdAt),
          createdAt: existing.createdAt,
        },
      });
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
      verified: Boolean(purchased),
    });
    await review.populate("userId", "name email");

    res.status(201).json({
      msg: "Review submitted",
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        verified: review.verified,
        name: review.userId?.name || "Customer",
        userId: review.userId?._id || userId,
        date: formatRelativeDate(review.createdAt),
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ msg: "You already reviewed this product" });
    }
    console.error("Create review error:", error);
    res.status(500).json({ msg: "Failed to submit review", error: error.message });
  }
};

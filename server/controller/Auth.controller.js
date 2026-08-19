import userSchema from "../Schema/user.schema.js";
import bcrypt from "bcryptjs";

export const signUpUser = async function (req, res, next) {
  try {
    const { name, password, email } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        msg: "Email already registered" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new userSchema({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();

    // Generate token
    const token = user.availToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response (don't send password)
    res.status(201).json({
      success: true,
      msg: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false,
      msg: "Server error during signup" 
    });
  }
};

export const signInUser = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "Email and password are required" 
      });
    }

    // Find user
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        msg: "Email not found" 
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        msg: "Password is incorrect" 
      });
    }

    // Generate token
    const token = user.availToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(200).json({
      success: true,
      msg: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      msg: "Server error during login" 
    });
  }
};

export const userdata = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        msg: "Unauthorized" 
      });
    }

    res.status(200).json({ 
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        admin: req.user.admin,
      }
    });
  } catch (error) {
    console.error("User data error:", error);
    res.status(500).json({ 
      success: false,
      msg: "Server error" 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema
      .find({})
      .select({ password: 0 })
      .sort({ _id: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch users",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const user = await userSchema.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (name != null && String(name).trim()) {
      user.name = String(name).trim();
    }

    if (email != null && String(email).trim()) {
      const nextEmail = String(email).trim().toLowerCase();
      if (nextEmail !== user.email) {
        const exists = await userSchema.findOne({ email: nextEmail });
        if (exists && String(exists._id) !== String(user._id)) {
          return res.status(409).json({
            success: false,
            msg: "Email already in use",
          });
        }
        user.email = nextEmail;
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          msg: "Current password is required",
        });
      }
      const matches = await bcrypt.compare(currentPassword, user.password);
      if (!matches) {
        return res.status(401).json({
          success: false,
          msg: "Current password is incorrect",
        });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({
          success: false,
          msg: "New password must be at least 6 characters",
        });
      }
      user.password = await bcrypt.hash(String(newPassword), 10);
    }

    await user.save();

    const token = user.availToken();
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    };

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to update profile",
    });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      msg: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false,
      msg: "Server error during logout" 
    });
  }
};
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
      type: String, 
      required: false, 
      validate: {
        validator: function(value) {
          if (!value) return true;
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
        },
        message: "Password must be at least 8 characters long, with at least 1 letter and 1 number.",
      },
    },
    
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

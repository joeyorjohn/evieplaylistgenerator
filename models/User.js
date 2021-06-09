import mongoose from "mongoose";

/* PetSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema({
  display_name: { type: String },
  timeStamp: { type: String, default: () => Date.now() },
  access_token: { type: String },
  refresh_token: { type: String },
  scope: { type: String },
  country: { type: String },
  email: { type: String },
  id: { type: String },
  followers: { type: Number },
  product: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

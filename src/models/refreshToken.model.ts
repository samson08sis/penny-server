import { Schema, model, Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  user: Types.ObjectId;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

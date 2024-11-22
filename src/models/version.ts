import mongoose, { Document, Schema } from "mongoose";

export interface IVersion extends Document {
  softwareName: string;
  version: string;
}

const VersionSchema: Schema = new Schema(
  {
    softwareName: { type: String, required: true, unique: true },
    version: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVersion>("Version", VersionSchema);

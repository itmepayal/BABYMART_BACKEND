import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStoreLocation {
  title: string;
  address: string;
}

export interface IContact extends Document {
  mapUrl: string;

  storeLocations: IStoreLocation[];

  mobile: string;
  hotline: string;
  email: string;

  openingHours: string;

  createdAt: Date;
  updatedAt: Date;
}

interface IContactModel extends Model<IContact> {}

const storeLocationSchema = new Schema<IStoreLocation>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const contactSchema = new Schema<IContact, IContactModel>(
  {
    mapUrl: {
      type: String,
      required: [true, "Google Map URL is required"],
      trim: true,
    },

    storeLocations: {
      type: [storeLocationSchema],
      default: [],
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    hotline: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    openingHours: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model<IContact, IContactModel>(
  "Contact",
  contactSchema,
);

export default Contact;

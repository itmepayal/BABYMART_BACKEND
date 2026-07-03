import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFounder {
  name: string;
  designation: string;
  image: string;
}

export interface IFeature {
  title: string;
  description: string;
}

export interface IAbout extends Document {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  quote: string;
  quoteAuthor: string;

  sectionTitle: string;
  sectionDescription: string;
  sectionImage: string;

  features: IFeature[];

  founders: IFounder[];

  clientLogos: string[];

  createdAt: Date;
  updatedAt: Date;
}

interface IAboutModel extends Model<IAbout> {}

const featureSchema = new Schema<IFeature>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const founderSchema = new Schema<IFounder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const aboutSchema = new Schema<IAbout, IAboutModel>(
  {
    heroTitle: {
      type: String,
      required: true,
      trim: true,
    },

    heroDescription: {
      type: String,
      required: true,
    },

    heroImage: {
      type: String,
      required: true,
    },

    quote: {
      type: String,
      required: true,
    },

    quoteAuthor: {
      type: String,
      required: true,
    },

    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },

    sectionDescription: {
      type: String,
      required: true,
    },

    sectionImage: {
      type: String,
      required: true,
    },

    features: {
      type: [featureSchema],
      default: [],
    },

    founders: {
      type: [founderSchema],
      default: [],
    },

    clientLogos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const About = mongoose.model<IAbout, IAboutModel>("About", aboutSchema);

export default About;

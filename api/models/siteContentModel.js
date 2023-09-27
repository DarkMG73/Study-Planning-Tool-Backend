const mongoose = require("mongoose");

const siteContentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    active: {
      type: String,
    },
    addToNavMenu: {
      type: String,
    },
    titleOnNavMenu: {
      type: String,
    },
    text: {
      type: String,
    },
    imageOneURL: {
      type: Object,
    },
    textTwo: {
      type: String,
    },
    imageTwoURL: {
      type: Object,
    },
    textThree: {
      type: String,
    },
    imageThreeURL: {
      type: Object,
    },
    textFour: {
      type: String,
    },
    imageFourURL: {
      type: Object,
    },
    iconURL: {
      type: String,
    },
    link: {
      type: String,
    },
    tags: {
      type: String,
    },
    identifier: {
      type: String,
    },
    masterLibraryID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = siteContentSchema;

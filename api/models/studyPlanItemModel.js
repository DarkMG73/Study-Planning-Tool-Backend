const mongoose = require("mongoose");

const catalogItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    asup: {
      type: String,
    },
    author: {
      type: String,
    },
    des: {
      type: String,
    },
    demonstratedskillsdesc: {
      type: String,
    },
    demonstratedskillurl: {
      type: String,
    },
    markcomplete: {
      type: Boolean,
    },
    markforreview: {
      type: Boolean,
    },
    lectureTime: {
      type: String,
    },
    labTime: {
      type: String,
    },
    method: {
      type: String,
    },
    msup: {
      type: String,
    },
    tags: {
      type: Array,
    },
    itemnotes: {
      type: String,
    },
    platform: {
      type: String,
    },
    priority: {
      type: String,
    },
    progressbar: {
      type: String,
    },
    status: {
      type: String,
    },
    start: {
      type: String,
    },
    acomp: {
      type: String,
    },
    utl: {
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

module.exports = catalogItemSchema;

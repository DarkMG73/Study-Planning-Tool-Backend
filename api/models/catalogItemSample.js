[
  {
    title: {
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
      unique: true,
    },
    artist: {
      type: Object,
      required: true,
    },
    isDefaultPlaylist: {
      type: Boolean,
    },
    isFeaturedPlaylist: {
      type: Boolean,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    sourceURLObj: {
      type: Object,
    },
    songs: {
      type: Object,
    },
    album: {
      type: String,
    },
    description: {
      type: String,
    },

    link: {
      type: String,
    },
    producer: {
      type: Object,
    },
    label: {
      type: String,
    },
    engineer: {
      type: Object,
    },
    studio: {
      type: Object,
    },
    featuredIn: {
      type: String,
    },
    tags: {
      type: Array,
    },
    notes: {
      type: String,
    },
    identifier: {
      type: String,
    },
    masterLibraryID: {
      type: String,
    },
  },
];

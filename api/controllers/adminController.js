const download = require("image-downloader");
const path = require("path");
const allCatalogItemsList = require("../data/allCatalogItemsList.json");
const catalogItemSchema = require("../models/catalogItemModel.js");
const mongoose = require("mongoose");

// const options = {
//   url:
//     "https://www.delamar.de/wp-content/uploads/2019/01/brainworx_spl_iron.jpg",
//   dest: "/", // will be saved to /path/to/dest/image.jpg
// };
// download
//   .image(options)
//   .then(({ filename }) => {
//     console.log("------> line:9%cfilename", filename);
//     console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
//   })
//   .catch((err) => console.error(err));

module.exports.downloadPicsFromDbPhotoURL = (req, res) => {
  // console.log("IN");
  // download
  //   .image(options)
  //   .then(({ filename }) => {
  //     console.log("------> line:9%cfilename", filename);
  //     console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
  //   })
  //   .catch((err) => console.error(err));
};

/// BULK LOAD CATALOG ITEMS TO DB ///////////////////
const loadCatalogItemsToDatabase = (catalogItemsToAdd, DBName) => {
  const catalogItemsToAddArray = Object.keys(catalogItemsToAdd).map(
    (key) => catalogItemsToAdd[key]
  );
  console.log("catalogItemsToAddArray", catalogItemsToAddArray.length);
  console.log("ADMIN: Saving Bulk CatalogItems to DataBase");
  const CatalogItem = mongoose.model(DBName, catalogItemSchema);

  const newCatalogItem = new CatalogItem(catalogItemsToAddArray);
  newCatalogItem.collection
    .insertMany(catalogItemsToAddArray, {
      ordered: true,
    })
    .then((doc) => {
      console.log("ADMIN: Saving Bulk was SUCCESSFUL");
    })
    .catch((err) => {
      console.log("ADMIN: Saving Bulk err", err);
    });
};

// loadCatalogItemsToDatabase(allCatalogItemsList, "ms1-catalog-item")

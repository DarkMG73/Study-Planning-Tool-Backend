const download = require("image-downloader");
const path = require("path");
// const allStudyPlanItemsList = require("../data/allStudyPlanItemsList.json");
const studyPlanItemSchema = require("../models/studyPlanItemModel.js");
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
const loadStudyPlanItemsToDatabase = (studyPlanItemsToAdd, DBName) => {
  const studyPlanItemsToAddArray = Object.keys(studyPlanItemsToAdd).map(
    (key) => studyPlanItemsToAdd[key]
  );
  console.log("studyPlanItemsToAddArray", studyPlanItemsToAddArray.length);
  console.log("ADMIN: Saving Bulk StudyPlanItems to DataBase");
  const StudyPlanItem = mongoose.model(DBName, studyPlanItemSchema);

  const newStudyPlanItem = new StudyPlanItem(studyPlanItemsToAddArray);
  newStudyPlanItem.collection
    .insertMany(studyPlanItemsToAddArray, {
      ordered: true,
    })
    .then((doc) => {
      console.log("ADMIN: Saving Bulk was SUCCESSFUL");
    })
    .catch((err) => {
      console.log("ADMIN: Saving Bulk err", err);
    });
};

// loadStudyPlanItemsToDatabase(allStudyPlanItemsList, "studyPlan-item")

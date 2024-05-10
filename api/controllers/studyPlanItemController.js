const studyPlanItemSchema = require("../models/studyPlanItemModel.js");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const adminList = require("../data/adminList.js");
const { demoUser } = adminList;
const exitIfDemoUser = (user_id) => {
  return demoUser.includes(user_id);
};

function getStudyPlanItemModelAndCollection(user) {
  let collection = user ? user._id : "";
  // let collection = "study-plan-items";
  if (user && adminList["stud-plan-admin"].includes(user._id)) {
    collection = "demo-study-plan-items";
  } else if (user && adminList["demoUser"].includes(user._id)) {
    collection = adminList.demoAdmin;
  }

  console.log("------ Collection: ", collection);
  return mongoose.model(collection, studyPlanItemSchema);
}

//getStudyPlanItems function to get all studyPlan items
module.exports.getStudyPlanItems = asyncHandler(async (req, res) => {
  console.log("--- getStudyPlanItems ---");
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);
  const studyPlanItems = await StudyPlanItem.find({
    markcomplete: { $exists: true },
  });
  console.log("------ studyPlanItems: ", studyPlanItems);
  res.json(studyPlanItems);
});

//getStudyPlanItemById function to retrieve user by id
module.exports.getStudyPlanItemById = asyncHandler(async (req, res) => {
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);
  const studyPlanItem = await StudyPlanItem.findById(req.params.id);

  //if user id match param id send user else return error
  if (studyPlanItem) {
    res.json(studyPlanItem);
  } else {
    res.status(404).json({
      message: "StudyPlan Item not found",
      err: { code: 404, result: {}, writeErrors: [] },
    });
    res.status(404);
    return new Error("StudyPlan item not found");
  }
});

// getStudyPlanItemByHashId function to retrieve user
// by the Hash id assigned when it was created.
module.exports.getStudyPlanItemByHashId = asyncHandler(async (req, res) => {
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);
  const hashId = req.params.hashId;
  const filter = { id: hashId };
  const studyPlanItem = await StudyPlanItem.findOne(filter);

  //if user id match param id send user else send error
  if (studyPlanItem) {
    res.json(studyPlanItem);
  } else {
    res.status(404).json({
      message: "StudyPlan item not found",
      err: { code: 404, result: {}, writeErrors: [] },
    });
    res.status(404);
  }
});

/// ADD A STUDY PLAN ITEMS ////////////////////////////
module.exports.AddStudyPlanItem = asyncHandler(async (req, res, next) => {
  console.log("------ AddStudyPlanItem ------ ");
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const studyPlanItem = req.body.dataObj;
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);

  if (req.user) {
    const newStudyPlanItem = new StudyPlanItem(studyPlanItem);
    newStudyPlanItem
      .save()
      .then((doc) => {
        res.json(doc);
        return;
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the studyPlan item.",
          err: err,
        });
        return new Error("Error saving studyPlan item.");
      });
  } else {
    return res.status(401).json({
      message: "Unauthorized user 1!!",
      err: { code: 401, result: {}, writeErrors: [] },
    });
  }
});

/// ADD MANY STUDY PLAN ITEMS /////////////////////////////
module.exports.AddManyStudyPlanItems = asyncHandler(async (req, res, next) => {
  console.log("Saving Multiple StudyPlan Items");
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const studyPlanItems = req.body.outputDataArray;
  console.log("req.body", req.body);
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);

  if (req.user) {
    const newStudyPlanItem = new StudyPlanItem(studyPlanItems);
    newStudyPlanItem.collection
      .insertMany(studyPlanItems, {
        ordered: false,
      })
      .then((doc) => {
        res.json(doc);
        return;
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the studyPlan item.",
          err: err,
        });
      });
  } else {
    return res.status(401).json({
      message: "Unauthorized user 1!!",
      err: { code: 404, result: {}, writeErrors: [] },
    });
  }
});

/// UPDATE A STUDY PLAN ITEM /////////////////////////////
module.exports.UpdateStudyPlanItem = asyncHandler(async (req, res) => {
  console.log("--- UpdateStudyPlanItem ---");
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const dataObj = req.body.dataObj;
  console.log("dataObj", dataObj);
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);
  console.log("StudyPlanItem", StudyPlanItem);
  // Convert strings to numbers where needed
  function groomObjectForDB(dataObj) {
    const requiresNumber = [""];
    const requiresBoolean = ["isDefaultPlaylist", "isFeaturedPlaylist"];
    const newDataObj = {};

    const stringToBoolean = (string) => {
      switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
          return true;

        case "false":
        case "no":
        case "0":
        case null:
          return false;

        default:
          return Boolean(string);
      }
    };

    for (const key in dataObj) {
      if (requiresNumber.includes(key) && isNaN(dataObj[key])) {
        const newNumber = dataObj[key];

        newDataObj[key] = parseFloat(dataObj[key].replace('"', ""));
      } else if (requiresBoolean.includes(key)) {
        if (dataObj[key].constructor === String) {
          newDataObj[key] = stringToBoolean(dataObj[key]);
        }
      } else {
        newDataObj[key] = dataObj[key];
      }
    }

    return newDataObj;
  }

  const groomedDataObject = groomObjectForDB(dataObj);
  console.log("groomedDataObject", groomedDataObject);
  const identifier = groomedDataObject.identifier;
  console.log("identifier", identifier);
  const filter = { identifier: identifier };
  const studyPlanItem = await StudyPlanItem.findOne(filter);
  console.log("studyPlanItem", studyPlanItem);
  if (studyPlanItem.identifier === identifier) {
    StudyPlanItem.findOneAndUpdate(
      filter,
      { $set: groomedDataObject },
      { new: false },
    )
      .then((doc) => {
        res.status(200).json({ message: "It worked.", doc: doc });
        res.status(200);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the studyPlan item.",
          err: err,
        });
      });
  } else {
    res.status(404).json({
      message: "StudyPlan item not found",
      err: { code: 404, result: {}, writeErrors: [] },
    });
    res.status(404);
  }
});

module.exports.RemoveStudyPlanItem = asyncHandler(async (req, res) => {
  console.log("RemoveStudyPlanItem", req.params);
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);

  StudyPlanItem.deleteOne({ identifier: req.params.identifier })
    .then((doc) => {
      console.log("success", res);
      res.json(doc);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({
        message: "Error when trying to save the studyPlan item.",
        err: err,
      });
      return new Error("Error saving studyPlan item.");
    });
});

module.exports.RemoveAllStudyPlanItems = asyncHandler(async (req, res) => {
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const StudyPlanItem = getStudyPlanItemModelAndCollection(req.user);
  StudyPlanItem.deleteMany({})
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({
        message: "Error when trying to save the studyPlan item.",
        err: err,
      });
      return new Error("Error saving studyPlan item.");
    });
});

module.exports.StudyPlanItemModel = asyncHandler(async (req, res) => {
  const studyPlanItems = await studyPlanItemSchema;

  res.json({ model: studyPlanItems });
});

////////////////////////////////////////////////////////////////
///       ADMIN ACCESS
////////////////////////////////////////////////////////////////
//getAdminStudyPlanItems function to get all studyPlan items for the admin
module.exports.getAdminStudyPlanItems = asyncHandler(async (req, res) => {
  console.log("--- getAdminStudyPlanItems ---");
  if (!req.user)
    res.status(401).json({
      message: "Access not authorized",
      err: { code: 404, result: {}, writeErrors: [] },
    });

  if (
    adminList["stud-plan-admin"] &&
    !adminList["stud-plan-admin"].includes(req.user._id)
  )
    res.status(403).json({
      message: "Sorry, you do not have permission to access this.",
      err: { code: 403, result: {}, writeErrors: [] },
    });
  const collection = "study-plan-item";
  const StudyPlanItem = mongoose.model(collection, studyPlanItemSchema);
  const studyPlanItems = await StudyPlanItem.find({});
  res.json(studyPlanItems);
});

// getStudyPlanItems function to get all studyPlan items
module.exports.changeFieldNameInDB = asyncHandler(async (req, res) => {
  console.log("Get all studyPlan items request", req);
  const StudyPlanItem = getStudyPlanItemModelAndCollection();
  console.log("StudyPlanItem", StudyPlanItem);
  const studyPlanItems = await StudyPlanItem.update(
    { "name.additional": { $exists: true } },
    { $rename: { id: "identifier" } },
    false,
    true,
  );
  console.log("******************");
  console.log("*** The DB was updated with a name change ***");
  console.log("******************");
});

// changeFieldNameInDB();

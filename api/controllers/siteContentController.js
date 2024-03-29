const siteContentSchema = require("../models/siteContentModel.js");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const adminList = require("../data/adminList.js");
const { demoUser } = adminList;
const exitIfDemoUser = (user_id) => {
  return demoUser.includes(user_id);
};

function getSiteContentModelAndCollection(user) {
  // let collection = user ? user._id : "ms1-site-content";
  let collection = "ms1-site-contents";
  // if (user && adminList["ms1-site-content"].includes(user._id)) {
  //   collection = "ms1-site-content";
  // }
  console.log("------ Collection: ", collection);
  return mongoose.model(collection, siteContentSchema);
}

//getSiteContents function to get all catalog items
module.exports.getSiteContents = asyncHandler(async (req, res) => {
  console.log("--- getSiteContents ---");
  const SiteContent = getSiteContentModelAndCollection(req.user);
  const siteContents = await SiteContent.find({});
  res.json(siteContents);
});

//getSiteContentById function to retrieve user by id
module.exports.getSiteContentById = asyncHandler(async (req, res) => {
  const SiteContent = getSiteContentModelAndCollection(req.user);
  const siteContent = await SiteContent.findById(req.params.id);

  //if user id match param id send user else return error
  if (siteContent) {
    res.json(siteContent);
  } else {
    res.status(404).json({ message: "Catalog Item not found" });
    res.status(404);
    return new Error("Catalog item not found");
  }
});

// getSiteContentByHashId function to retrieve user
// by the Hash id assigned when it was created.
module.exports.getSiteContentByHashId = asyncHandler(async (req, res) => {
  const SiteContent = getSiteContentModelAndCollection(req.user);
  const hashId = req.params.hashId;
  const filter = { id: hashId };
  const siteContent = await SiteContent.findOne(filter);

  //if user id match param id send user else send error
  if (siteContent) {
    res.json(siteContent);
  } else {
    res.status(404).json({ message: "Catalog item not found" });
    res.status(404);
  }
});

/// ADD A CATALOG ITEMS ////////////////////////////
module.exports.AddSiteContent = asyncHandler(async (req, res, next) => {
  console.log("------ AddSiteContent ------ ");
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }

  const siteContent = req.body.dataObj;
  const SiteContent = getSiteContentModelAndCollection(req.user);

  if (req.user) {
    const newSiteContent = new SiteContent(siteContent);
    newSiteContent
      .save()
      .then((doc) => {
        res.json(doc);
        return;
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the catalog item.",
          err: err,
        });
        res.status(404);
        return new Error("Error saving catalog item.");
      });
  } else {
    return res.status(401).json({ message: "Unauthorized user 1!!" });
  }
});

/// ADD MANY CATALOG ITEMS /////////////////////////////
module.exports.AddManySiteContents = asyncHandler(async (req, res, next) => {
  console.log("Saving Multiple Catalog Items");
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const siteContents = req.body.outputDataArray;
  console.log("req.body", req.body);
  const SiteContent = getSiteContentModelAndCollection(req.user);

  if (req.user) {
    const newSiteContent = new SiteContent(siteContents);
    newSiteContent.collection
      .insertMany(siteContents, {
        ordered: false,
      })
      .then((doc) => {
        res.json(doc);
        return;
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the catalog item.",
          err: err,
        });
        res.status(404);
      });
  } else {
    return res.status(401).json({ message: "Unauthorized user 1!!" });
  }
});

/// UPDATE A CATALOG ITEM /////////////////////////////
module.exports.UpdateSiteContent = asyncHandler(async (req, res) => {
  console.log("--- UpdateSiteContent ---");
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const dataObj = req.body.dataObj;
  console.log("dataObj", dataObj);
  const SiteContent = getSiteContentModelAndCollection(req.user);
  console.log("SiteContent", SiteContent);
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
  const siteContent = await SiteContent.findOne(filter);
  console.log("siteContent", siteContent);
  if (siteContent.identifier === identifier) {
    SiteContent.findOneAndUpdate(
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
          message: "Error when trying to save the catalog item.",
          err: err,
        });
        res.status(404);
      });
  } else {
    res.status(404).json({ message: "Catalog item not found" });
    res.status(404);
  }
});

module.exports.RemoveSiteContent = asyncHandler(async (req, res) => {
  console.log("RemoveSiteContent", req.params);
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const SiteContent = getSiteContentModelAndCollection(req.user);

  SiteContent.deleteOne({ identifier: req.params.identifier })
    .then((doc) => {
      console.log("success", res);
      res.json(doc);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({
        message: "Error when trying to save the catalog item.",
        err: err,
      });
      res.status(404);
      return new Error("Error saving catalog item.");
    });
});

module.exports.RemoveAllSiteContents = asyncHandler(async (req, res) => {
  if (exitIfDemoUser(req.user._id)) {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action." });
    return;
  }
  const SiteContent = getSiteContentModelAndCollection(req.user);
  SiteContent.deleteMany({})
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({
        message: "Error when trying to save the catalog item.",
        err: err,
      });
      res.status(404);
      return new Error("Error saving catalog item.");
    });
});

module.exports.SiteContentModel = asyncHandler(async (req, res) => {
  const siteContents = await siteContentSchema;

  res.json({ model: siteContents });
});

////////////////////////////////////////////////////////////////
///       ADMIN ACCESS
////////////////////////////////////////////////////////////////
//getAdminSiteContents function to get all catalog items for the admin
module.exports.getAdminSiteContents = asyncHandler(async (req, res) => {
  console.log("--- getAdminSiteContents ---");
  if (!req.user) res.status(401).json({ message: "Access not authorized" });

  if (!adminList["ms1-site-content"].includes(req.user._id))
    res
      .status(403)
      .json({ message: "Sorry, you do not have permission to access this." });
  const collection = "ms1-site-content";
  const SiteContent = mongoose.model(collection, siteContentSchema);
  const siteContents = await SiteContent.find({});
  res.json(siteContents);
});

// getSiteContents function to get all catalog items
module.exports.changeFieldNameInDB = asyncHandler(async (req, res) => {
  console.log("Get all catalog items request", req);
  const SiteContent = getSiteContentModelAndCollection();
  console.log("SiteContent", SiteContent);
  const siteContents = await SiteContent.update(
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

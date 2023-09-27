const {
  getSiteContents,
  getSiteContentById,
  getSiteContentByHashId,
  AddSiteContent,
  AddManySiteContents,
  UpdateSiteContent,
  RemoveSiteContent,
  RemoveAllSiteContents,
  SiteContentModel,
  getAdminSiteContents,
} = require("../controllers/siteContentController.js");
const express = require("express");

const router = express.Router();

// express router method to create route for adding an catalog item
router.route("/add").post(AddSiteContent);

// express router method to create route for adding an catalog item
router.route("/add-many").post(AddManySiteContents);

// express router method to create route for removing an catalog item
router.route("/deleteAll").get(RemoveAllSiteContents);

// express router method to create route for removing an catalog item
router.route("/:identifier/delete").get(RemoveSiteContent);

// express router method to create route for updating an catalog item
router.route("/update").post(UpdateSiteContent);

// express router method to create route for updating an catalog item
router.route("/model").get(SiteContentModel);

// express router method to create route for getting all catalog items
router.route("/admin/allSiteContents").get(getAdminSiteContents);

// express router method to create route for getting users by id
router.route("/hash-id/:hashid").get(getSiteContentByHashId);

// express router method to create route for getting users by id
router.route("/:id").get(getSiteContentById);

// express router method to create route for an admin to get all tools
router.route("/").post(getSiteContents);

module.exports = router;

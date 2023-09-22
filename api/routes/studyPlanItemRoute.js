const {
  getStudyPlanItems,
  getStudyPlanItemById,
  getStudyPlanItemByHashId,
  AddStudyPlanItem,
  AddManyStudyPlanItems,
  UpdateStudyPlanItem,
  RemoveStudyPlanItem,
  RemoveAllStudyPlanItems,
  StudyPlanItemModel,
  getAdminStudyPlanItems,
} = require("../controllers/studyPlanItemController.js");
const express = require("express");

const router = express.Router();

// express router method to create route for adding an studyPlan item
router.route("/add").post(AddStudyPlanItem);

// express router method to create route for adding an studyPlan item
router.route("/add-many").post(AddManyStudyPlanItems);

// express router method to create route for removing an studyPlan item
router.route("/deleteAll").get(RemoveAllStudyPlanItems);

// express router method to create route for removing an studyPlan item
router.route("/:identifier/delete").get(RemoveStudyPlanItem);

// express router method to create route for updating an studyPlan item
router.route("/update").post(UpdateStudyPlanItem);

// express router method to create route for updating an studyPlan item
router.route("/model").get(StudyPlanItemModel);

// express router method to create route for getting all studyPlan items
router.route("/admin/allStudyPlanItems").get(getAdminStudyPlanItems);

// express router method to create route for getting users by id
router.route("/hash-id/:hashid").get(getStudyPlanItemByHashId);

// express router method to create route for getting users by id
router.route("/:id").get(getStudyPlanItemById);

// express router method to create route for an admin to get all tools
router.route("/").post(getStudyPlanItems);

module.exports = router;

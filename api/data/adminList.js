// For all cases, isAdmin=true must be set on the user.
// Admin Users have "all-catalog items" editing access.
// Super Admins have "all-catalog item" and "users" access.
const adminList = {
  "stud-plan-admin": [],
  users: [""],
  // demoUser uses demoAdmin's DB
  demoUser: ["6605bb42c88f4cf3d55e24d6"],
  demoAdmin: "660626000c85c2c46c60c6des",
};

module.exports = adminList;

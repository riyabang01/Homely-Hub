const express = require("express");
const propertyController = require("../controllers/propertyController");
const authController = require("../controllers/authController"); 

const router = express.Router();

router.route("/")
  .get(propertyController.getProperties);


router.route("/me")
  .get(authController.protect, propertyController.getUsersProperties);

 
router.route("/:id")
  .get(propertyController.getProperty);


router.route("/new")
  .post(authController.protect, propertyController.createProperty);

module.exports = router;

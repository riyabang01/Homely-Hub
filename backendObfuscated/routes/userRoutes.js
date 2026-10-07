const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");
const propertyController = require("../controllers/propertyController");

const router = express.Router();


router.route("/signup")
  .post(authController.signup);


router.route("/login")
  .post(authController.login);


router.route("/logout")
  .get(authController.logout);


router.route("/forgotPassword")
  .post(authController.forgotPassword);


router.route("/resetPassword/:token")
  .patch((req, res, next) => {
    if (authController.resetPassword) {
      return authController.resetPassword(req, res, next);
    }
    return res.status(501).json({ status: 'fail', message: 'Reset Password implementation missing in controller.' });
  });



router.route("/me")
  .get(authController.protect, (req, res) => {
      res.status(200).json({
          status: 'success',
          user: req.user
      });
  });

router.route("/updateMe")
  .patch(authController.protect, authController.updateMe);

router.route("/updateMyPassword")
  .patch(authController.protect, authController.updatePassword);

router.route("/checkout-session")
  .post(authController.protect, bookingController.getcheckOutSession);

router.route('/booking/new')
  .post(authController.protect, bookingController.createBookings);

router.route("/booking")
  .get(authController.protect, bookingController.getUserBookings);

router.route("/booking/:bookingId")
  .get(authController.protect, bookingController.getBookingDetails);

router.route("/newAccommodation")
  .post(authController.protect, propertyController.createProperty);

router.route("/myAccommodation")
  .get(authController.protect, propertyController.getUsersProperties);

module.exports = router;

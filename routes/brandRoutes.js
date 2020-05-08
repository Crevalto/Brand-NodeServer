const express = require("express");
// const User = require("../models/User");
const auth = require("../middleware/auth");

// creating a router instance to manage routes
const router = express.Router();

// getting reference to the controllers for Brand side APIs
const shotStackAddVideoToQueueController = require("../controllers/shotStackAPIs/addVideoToQueueController");
const shotStackGetRenderedVideoController = require("../controllers/shotStackAPIs/getRenderedVideo");
const vendorProductGetCategories = require("../controllers/vendorProductAPIs/getProductCategories");
const vendorProductGetProducts = require("../controllers/vendorProductAPIs/getProducts");
const userSignUpController = require("../controllers/auth/signUp");
const userSignInController = require("../controllers/auth/signIn");
const userProfileViewController = require("../controllers/auth/profileView");

// user authentication routes
router.post("/users/register", userSignUpController.signUpUser);
router.post("/users/login", userSignInController.signInUser);
// profile view route
router.get("/users/profile/:brandName", userProfileViewController.profileView);
// add video to render queue
router.post(
  "/promotionalvideo/queue",
  shotStackAddVideoToQueueController.addVideoRoRenderQueue
);
// get video render progress
router.get(
  "/promotionalvideo/getprogress",
  shotStackGetRenderedVideoController.getRenderProgress
);
// gets all the categories of products
router.get("/getcategories", vendorProductGetCategories.getCategories);
// gets all the products for given category
router.get("/getproducts", vendorProductGetProducts.getProducts);

// exporting router
module.exports = router;

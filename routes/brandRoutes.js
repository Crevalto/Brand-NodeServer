const express = require("express");
const multer = require('multer')

// declaring middlewares
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
// upload function to fetch and store the files sent locally
const upload = multer({
  storage: storage
});


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
const verifyUserController = require("../controllers/auth/userVerification");
const verifyUserSecureController = require("../controllers/auth/userVerificationSecure");
const userEditProfileController = require("../controllers/auth/editProfile");
const addItemToCartController = require("../controllers/shop/addToCart");
const getCartItems = require("../controllers/shop/getCartItems");
const brandAssetsUploadContoller = require("../controllers/brandAssets/fileUpload");
const brandAssetsGetFilesController = require("../controllers/brandAssets/getFiles");

// user authentication routes
router.post("/users/register", userSignUpController.signUpUser);
router.post("/users/login", userSignInController.signInUser);
router.post("/users/verify", verifyUserController.setUserAsVerified);
router.post("/users/verifysecure", verifyUserSecureController.otpVerification);
// profile view route
router.get("/users/profile/:brandName", userProfileViewController.profileView);
router.post("/users/edit", userEditProfileController.editProfile);
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
router.post("/getproducts", vendorProductGetProducts.getProducts);
// added a list of items and their quantities to the user cart
router.post("/addtocart", addItemToCartController.addItemToCart);
// gets all the cart items of the user
router.get("/getcartitems", getCartItems.getCartItems);
// used to upload brand assets
router.post("/brandassets/upload", upload.array('file'), brandAssetsUploadContoller.uploadFile);
// used to get the files uploaded
router.get("/brandassets/getfiles", brandAssetsGetFilesController.getFiles);
// exporting router
module.exports = router;
// creating instance of express
const express = require("express");
// creating a router instance to manage routes
const router = express.Router();

// getting reference to the controllers for Brand side APIs
const shotStackAddVideoToQueueController = require("../controllers/shotStackAPIs/addVideoToQueueController");
const shotStackGetRenderedVideoController = require("../controllers/shotStackAPIs/getRenderedVideo");
const vendroProductGetCategories = require("../controllers/vendorProductAPIs/getProductCategories");

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
router.get("/getcategories", vendroProductGetCategories.getCategories);

// exporting router
module.exports = router;

// importing packages
const Shotstack = require("shotstack-sdk");

// importing config file to get API key
const configFile = require("../../config/config");

// importing the videoRenderQueue database model
const VideoRenderQueue = require("../../models/client/videoRenderQueue");

// gets the video render urll
const getVideoURL = async (id, api) => {
  const data = await api.getRender(id);
  let status = data.response.status;
  let url = data.response.url;

  console.log("Status: " + status.toUpperCase() + "\n");

  if (status == "done") {
    console.log(">> Video URL: " + url);
    return {
      status: true,
      videoID: id,
      videoURL: url,
    };
  } else if (status == "failed") {
    console.log(
      ">> Something went wrong, rendering has terminated and will not continue."
    );
    return {
      status: false,
      errorMessage:
        "Something went wrong, rendering has terminated and will not continue.",
    };
  } else {
    console.log(
      ">> Rendering in progress, please try again shortly.\n>> Note: Rendering may take up to 1 minute to complete."
    );
    return {
      status: false,
      errorMessage: "Render in progress",
    };
  }
};

// gets video details from the database
exports.getRenderProgress = (req, res, next) => {
  const defaultClient = Shotstack.ApiClient.instance;
  const DeveloperKey = defaultClient.authentications["DeveloperKey"];
  const api = new Shotstack.EndpointsApi();

  let apiUrl = "https://api.shotstack.io/stage";

  if (!process.env.SHOTSTACK_KEY) {
    console.log(
      "API Key is required. Set using: export SHOTSTACK_KEY=your_key_here"
    );
    process.exit(1);
  }

  if (process.env.SHOTSTACK_HOST) {
    apiUrl = process.env.SHOTSTACK_HOST;
  }

  defaultClient.basePath = apiUrl;
  DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

  // getting request body
  const reqBody = req.body;

  // getting video render details
  getVideoURL(reqBody.videoId, api).then((renderProgressDetail) => {
    // updating data in database
    if (renderProgressDetail.status == true) {
      VideoRenderQueue.update(
        { videoId: reqBody.videoId },
        {
          renderedURL: renderProgressDetail.videoURL,
          renderStatus: true,
        },
        (err, numberAffected, rawResponse) => {
          //handle it
        }
      );
    }

    res.send(renderProgressDetail);
  });
};

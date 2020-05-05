// importing packages
const Shotstack = require("shotstack-sdk");

// importing config file to get API key
const configFile = require("../../config/config");

// importing the videoRenderQueue database model
const VideoRenderQueue = require("../../models/client/videoRenderQueue");

// creates and returns the final video Edit instance
const finalVideoInstance = (reqBody) => {
  // variable holding audio duration of main background audio (sec)
  let mainBgAudioDuration = 0;

  // creating assets required for the video
  let titleAsset = new Shotstack.TitleAsset();
  let pictureAsset1 = new Shotstack.ImageAsset();
  let pictureAsset2 = new Shotstack.ImageAsset();
  let videoAsset1 = new Shotstack.VideoAsset();
  let audioAsset1 = new Shotstack.AudioAsset();

  // setting asset properties
  titleAsset.setStyle("minimal").setText(reqBody.assets[0].text);
  pictureAsset1.setSrc(reqBody.assets[1].src);
  pictureAsset2.setSrc(reqBody.assets[2].src);
  videoAsset1.setSrc(reqBody.assets[3].src).setVolume(1);
  audioAsset1.setSrc(reqBody.soundTrack);

  // creating clips using the assets
  let titleClip = new Shotstack.Clip();
  let picture1Clip = new Shotstack.Clip();
  let picture2Clip = new Shotstack.Clip();
  let video1Clip = new Shotstack.Clip();
  let audio1Clip = new Shotstack.Clip();

  // assigning assets for each clip
  titleClip.setAsset(titleAsset).setStart(mainBgAudioDuration).setLength(5);
  mainBgAudioDuration += 5;
  picture1Clip
    .setAsset(pictureAsset1)
    .setStart(mainBgAudioDuration)
    .setLength(5);
  mainBgAudioDuration += 5;
  picture2Clip
    .setAsset(pictureAsset2)
    .setStart(mainBgAudioDuration)
    .setLength(5);
  mainBgAudioDuration += 5;
  video1Clip
    .setAsset(videoAsset1)
    .setStart(mainBgAudioDuration)
    .setLength(reqBody.assets[3].length);
  mainBgAudioDuration += 5;
  audio1Clip.setAsset(audioAsset1).setStart(0).setLength(15);

  // creating track with all the clips
  let track = new Shotstack.Track();
  track.setClips([
    audio1Clip,
    titleClip,
    picture1Clip,
    picture2Clip,
    video1Clip,
  ]);

  // inserting track in the timeline
  let timeline = new Shotstack.Timeline();
  timeline.setBackground("#000000").setTracks([track]);

  // creating output file
  let output = new Shotstack.Output();
  output.setFormat("mp4").setResolution("sd").setAspectRatio("9:16");

  // creating edit file and assigning the timeline and output
  let edit = new Shotstack.Edit();
  edit.setTimeline(timeline).setOutput(output);

  // returning the edit file
  return edit;
};

// sends a post request to the ShotStack server to add video to queue
const postViewToQueue = async (api, edit) => {
  try {
    const data = await api.postRender(edit);
    // returning videoId
    return {
      status: true,
      videoId: data.response.id,
    };
  } catch (e) {
    // returning videoId
    return {
      status: false,
      errror: e,
    };
  }
};

// adds the video to renderQueue
exports.addVideoRoRenderQueue = (req, res, next) => {
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

  // constructing video edit instance
  const videoEditInstance = finalVideoInstance(reqBody);

  // sending video to edit queue
  postViewToQueue(api, videoEditInstance).then((videoQueueResponse) => {
    if (videoQueueResponse.status === true) {
      // constructing new data object
      const newRenderQueueData = {
        brandAssociated: reqBody.brandAssociated,
        merchantAssociated: reqBody.vendorAssociated,
        videoId: videoQueueResponse.videoId,
        renderStatus: false,
        renderedURL: "",
      };
      // creating scheme object to insert into database
      const renderQueueDataObject = new VideoRenderQueue(newRenderQueueData);
      // saving data into database
      renderQueueDataObject.save();
    }

    // sending response based on videoQueue operation response
    res.send(videoQueueResponse);
  });
};

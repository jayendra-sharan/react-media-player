import { loadReactMediaPlayer } from "./App";

(function (w) {
  w.initMediaPlayer = function (options) {
    loadReactMediaPlayer ({
      container: options.container,
      source: options.source,
      isAudio: options.isAudio,
      poster: options.poster,
      autoPlay: options.autoPlay,
      mute: options.mute
    });
  }
}) (window);

window.initMediaPlayer ({
  container: "root",
  // 42 seconds
  source: "https://msinernal1s3eu.s3.amazonaws.com/pulse/hub/attachments/1604380/TinyTake10-08-2018-02-17-41.mp4?version=1534320919996",
  // sample
  // source: "https://qamangospring.s3.amazonaws.com/pulse/branding10aug/attachments/963301/SampleVideo_1280x720_1mb+%281%29.mp4?version=1536257633987",
  // audio
  // source: "https://qamangospring.s3.amazonaws.com/pulse/branding10aug/attachments/963363/transcoder/SampleAudio_0.4mb.mp3?version=1536258329218",
  isAudio: false,
  poster: "",
  autoPlay: true,
  mute: true
})
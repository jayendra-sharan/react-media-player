import { loadReactMediaPlayer } from "./App";

(function (w) {
  w.initMediaPlayer = function (options) {
    if (!options.container) {
      alert ("You have not provided container to mount media player.");
      return;
    }
    if (!options.source) {
      alert ("You have not provided a source of media.");
      return;
    }
    loadReactMediaPlayer ({
      container: options.container,
      source: options.source,
      isAudio: options.isAudio || false,
      poster: options.poster || "",
      autoPlay: options.autoPlay || false,
      mute: options.mute || false
    });
  }
}) (window);

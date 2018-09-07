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

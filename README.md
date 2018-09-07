# react-media-player
A minimalist media player with basic controls

# Props
```
  container: String value of id of the container where media player has to be loaded.
  source: Source of audio/video
  poster: Link of poster, if available,
  autoPlay: Boolean,
  mute: Boolean, start with mute or unmute
```

# Sample
```
window.initMediaPlayer ({
  container: "root",
  source: "https://example.com/<video_source_url>.mp4",
  poster: "",
  autoPlay: true,
  mute: true
});
```

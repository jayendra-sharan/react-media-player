import React from "react";
import styled from "styled-components";
import MediaFooter from "./toolbar/MediaFooter";
import "font-awesome/css/font-awesome.css";
import OnScreenToolbar from "./toolbar/OnScreenToolbar";
import ProgressBarDraggable from "./toolbar/ProgressBarDraggable";


const StyledMain = styled.figure`
  position: relative;
  height: 100%;
  background: #000000;
`;

const StyledVideo = styled.video`
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const StyledAudioContainer = styled.div`
  display:block
  background: url(/audiowave.png) no-repeat;
  background-position: center;
  height: 100%;
`;
const StyledAudio = styled.audio`
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const StyledMediaFooter = styled.div`
  transition: opacity 1s;
`;

class Main extends React.Component {
  constructor () {
    super ();
    this.state = {
      mediaLoaded: false,
      supportsVideo: false,
      defaultControl: true,
      videoDuration: 0,
      progressValue: 0,
      bufferedValue: 0,
      playing: false,
      progressTime: '',
      fullTime: '',
      isMute: false,
      autoPlay: false,
      currentVolume: 0,
      offsetLeft: 0,
      isFullScreen: false,
      step: 10,
      showControls: true
    }
    this._bindFunctions ();
  }

  _bindFunctions () {
    this._togglePlayPause = this._togglePlayPause.bind (this);
    this._onLoadedMetadata = this._onLoadedMetadata.bind (this);
    this._onTimeUpdate = this._onTimeUpdate.bind (this);
    this._toggleMute = this._toggleMute.bind (this);
    this._updateVolume = this._updateVolume.bind (this);
    this._seekPosition = this._seekPosition.bind (this);
    this._toggleFullScreen = this._toggleFullScreen.bind (this);
    this._onkeyUp = this._onkeyUp.bind (this);
    this._hideControlsAndMouse = this._hideControlsAndMouse.bind (this);
    this._showControlsAndMouse = this._showControlsAndMouse.bind (this);
  }

  componentDidMount () {
    const supportsVideo = !!document.createElement ("video").canPlayType;
    this.setState ({
      supportsVideo,
      defaultControl: !supportsVideo,
      autoPlay: this.props.autoPlay,
      isMute: this.props.isMute,
      playing: this.props.autoPlay,
      isAudio: this.props.isAudio
    });
    document.addEventListener ("keyup", this._onkeyUp);
    this.interval = setInterval (this._hideControlsAndMouse, 5000);
  }

  componentWillUnmount () {
    document.removeEventListener ("keyup", this._onkeyUp)
    clearInterval (this.interval);
  }

  _getMediaFooter () {
    return styled.div`
        opacity: 0;
        transition: opacity 2s;
        ${StyledMain}:hover & {
          opacity: 1;
        }
    `;
  }

  _hideControlsAndMouse () {
    this.setState ({
      showControls: false
    });
  }

  _showControlsAndMouse () {
    this.setState ({
      showControls: true
    });
  }

  _onkeyUp (e) {
    switch (e.which) {
      case 32:
        this._togglePlayPause ();
      case 39:
        this._seekPosition (this.state.step, true);
        break;
      case 37:
        this._seekPosition ( -1 * this.state.step, true);
        break;
      default:
        break
    }
  }

  _togglePlayPause () {
    if (this.videoEl.paused || this.videoEl.ended) {
      this.videoEl.play ();
      this.setState ({
        playing: true
      });
    } else {
      this.videoEl.pause ();
      this.setState ({
        playing: false
      });
    }
  }

  _toggleMute () {
    let isMute = this.videoEl.muted;
    this.videoEl.muted = !isMute;
    this.setState ({
      isMute: !isMute,
      currentVolume: !isMute ? 0 : this.videoEl.volume
    })
  }

  _onLoadedMetadata () {
    this.setState ({
      videoDuration: this.videoEl.duration,
      fullTime: this._convertDurationToMinutesAndSeconds (this.videoEl.duration),
      progressTime: this._convertDurationToMinutesAndSeconds (this.videoEl.currentTime),
      isMute: this.props.mute,
      currentVolume: this.videoEl.volume - 0.3
    });
    this.videoEl.muted = this.props.mute;
    this.videoEl.volume = 0.7;
  }

  _onTimeUpdate () {
    const { currentTime } = this.videoEl;
    if (currentTime) {
      this.setState ({
        mediaLoaded: true
      });
    }
    const bufferedValue = this.videoEl.buffered.end (0);
    this.setState ({
      progressValue: currentTime,
      bufferedValue,
      progressTime: this._convertDurationToMinutesAndSeconds (currentTime)
    });
    if (currentTime === this.state.videoDuration) {
      this.setState ({
        playing: false
      });
    }
    // loop
    // if (currentTime === this.state.videoDuration) {
    //   this._togglePlayPause ();
    // }
  }

  /**
   * @description function to seek position
   * @param {number} position new position in percentage
   * @param {Boolean} relative indicates whether seek position is relative or absolute.
   */
  _seekPosition (position, relative) {
    let newPosition = 0;
    newPosition = relative ? (this.state.progressValue + position) : position
    this.videoEl.currentTime = newPosition;
    this.setState ({
      progressValue: newPosition
    });
  }

  _convertDurationToMinutesAndSeconds (duration) {
    let mins = 0,
        secs = 0;
    mins = parseInt (duration / 60);
    secs = parseInt (duration % 60);
    mins = mins < 10 ? ('0' + mins) : ('' + mins);
    secs = secs < 10 ? ('0' + secs) : ('' + secs);
    return `${mins}:${secs}`;
  }
  
  _updateVolume (newLevel) {
    if ( newLevel >= 0 && newLevel <= 1) {
      this.setState ({
        currentVolume: newLevel
      });
      this.videoEl.volume = newLevel;
      console.info ("new volume: ", newLevel);
    }
  }

  _toggleFullScreen () {
    let fullScreenEnabled = !!( document.fullscreenEnabled ||
                                document.mozFullScreenEnabled ||
                                document.msFullscreenEnabled ||
                                document.webkitSupportsFullscreen ||
                                document.webkitFullscreenEnabled ||
                                document.createElement('video').webkitRequestFullScreen);
    if (this._isFullScreen ()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      this.setState ({
        isFullScreen: false
      });
    } else {  
      if (this.videoEl.parentNode.requestFullscreen) this.videoEl.parentNode.requestFullscreen();
      else if (this.videoEl.parentNode.mozRequestFullScreen) this.videoEl.parentNode.mozRequestFullScreen();
      else if (this.videoEl.parentNode.webkitRequestFullScreen) this.videoEl.parentNode.webkitRequestFullScreen();
      else if (this.videoEl.parentNode.msRequestFullscreen) this.videoEl.parentNode.msRequestFullscreen();
      this._setFullscreenData(true);
      this.setState ({
        isFullScreen: true
      });
    }
  }

  _isFullScreen () {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  }
  
  _setFullscreenData (state) {
    this.videoEl.parentNode.setAttribute('data-fullscreen', !!state);
  }

  render () {
    return (
      <StyledMain onMouseMove={ this._showControlsAndMouse } style={{ cursor: this.state.showControls ? "default" : "none"}}>
        {
          !this.state.mediaLoaded &&
          <div className="js-css-loader-parent">
              <div className="js-css-loader"></div>
          </div>
        }
        {
          this.state.isAudio ?
              <StyledAudioContainer>
                  <StyledAudio
                  autoPlay={ this.state.autoPlay }
                  innerRef={ x => this.videoEl = x }
                  controls={ this.state.defaultControl }
                  src={ this.props.source }
                  onLoadedMetadata={ this._onLoadedMetadata }
                  onTimeUpdate={ this._onTimeUpdate }
                  >
                  Sorry, your browser doesn't support embedded videos.
                </StyledAudio>
              </StyledAudioContainer>
              :
              <StyledVideo
              autoPlay={ this.state.autoPlay }
              innerRef={ x => this.videoEl = x }
              controls={ this.state.defaultControl }
              src={ this.props.source }
              onLoadedMetadata={ this._onLoadedMetadata }
              onTimeUpdate={ this._onTimeUpdate }
              >
              Sorry, your browser doesn't support embedded videos.
            </StyledVideo>
        }
        <OnScreenToolbar
          playing={ this.state.playing }
          togglePlayPause={ this._togglePlayPause }
          />
        {
          this.state.supportsVideo && this.state.fullTime &&
          <StyledMediaFooter style={{ opacity: this.state.showControls ? "1" : "0"}}>
            <ProgressBarDraggable
              videoEl={ this.videoEl }
              seekPosition={ this._seekPosition }
              progressValue={ this.state.progressValue }
              bufferedValue={ this.state.bufferedValue }
              maxValue={ this.state.videoDuration }
            />
            <MediaFooter
              isAudio={ this.state.isAudio }
              playing={ this.state.playing }
              videoDuration={ this.state.videoDuration }
              fullTime={ this.state.fullTime }
              progressValue={ this.state.progressValue }
              progressTime={ this.state.progressTime }
              videoEl={ this.videoEl }
              togglePlayPause={ this._togglePlayPause }
              toggleMute={ this._toggleMute }
              isMute={ this.state.isMute }
              currentVolume={ this.state.currentVolume }
              updateVolume={ this._updateVolume }
              toggleFullScreen={ this._toggleFullScreen }
              isFullScreen={ this.state.isFullScreen }
              seekPosition={ this._seekPosition }/>
          </StyledMediaFooter>
        }
      </StyledMain>
    )
  }
}

export default Main;
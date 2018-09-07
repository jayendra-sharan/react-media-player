import React from 'react';
import styled from "styled-components";
import VolumeDragger from './VolumeDragger';
import ReactTooltip from 'react-tooltip'

const StyledFooter = styled.ul`
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  list-style: none;
  padding: 0px;
  margin: 0;
  display: flex;
  width: 100%;
  height: 40px;
`;

const StyledBasicButton = styled.li`
  width: 40px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
`;

const StyledButton = StyledBasicButton.extend`
  &:hover {
    border-bottom: 2px solid #ffffff;
  }
`;

const StyledTime = StyledBasicButton.extend`
  width: 75px;
  font-size: 10px;
`;

const StyledVolumeButton = StyledBasicButton.extend`
  &:hover {
    border-bottom: 2px solid #ffffff;
  }
`

const StyledVolumeBar = StyledBasicButton.extend`
  width: 0px;
  align-items: center;
  cursor: default;
  transition: width 1s;
  transition-delay: 1s;
  & * {
    opacity: 0;
    transition: opacity 1s;
    transition-delay: 1s;
  }
  ${StyledVolumeButton}:hover + & {
    width: 100px;
    transition-delay: 0s;
  }
  &:hover {
    width: 100px;
    transition-delay: 0s;
    & * {
      opacity: 1;
      transition-delay: 0s;
    }
  }
  ${StyledVolumeButton}:hover + & * {
    opacity: 1;
    transition-delay: 0s;
  }
`;

const StyldedFullScreenButton = StyledButton.extend`
  position: absolute;
  right: 15px;
`

const StyledRewindButton = StyledButton.extend`
  display: flex;
  position: relative;
`

const StyledForwardButton = StyledButton.extend`
  display: flex;
  position: relative;
`

class MediaFooter extends React.Component {
  constructor () {
    super ();
    this.state = {
      progressValue: 0,
      step: 10

    }
    this._bindFunctions ();
  }

  _bindFunctions () {
    this._togglePlayPause = this._togglePlayPause.bind (this);
    this._toggleMute = this._toggleMute.bind (this);
    this._rewind = this._rewind.bind (this);
    this._forward = this._forward.bind (this);
  }

  _togglePlayPause () {
    this.props.togglePlayPause ();
  }

  _toggleMute () {
    this.props.toggleMute ();
  }

  _rewind () {
    this.props.seekPosition (-1 * this.state.step, true);
  }

  _forward () {
    this.props.seekPosition (this.state.step, true);
  }

  render () {
    const { 
            isAudio,
            updateVolume,
            playing,
            isMute,
            progressTime,
            fullTime,
            currentVolume,
            toggleFullScreen,
            isFullScreen } = this.props;
    return (
      <StyledFooter>
        <StyledButton
          data-for="playbtn"
          data-tip={ playing ? "Pause" : "Play"}
          onClick={ this._togglePlayPause }
          >
          <ReactTooltip id="playbtn" getContent={ () => playing ? "Pause" : "Play"}/>
          <i className={`fa fa-${ playing ? "pause" : "play"}`}></i>
        </StyledButton>
        <StyledRewindButton
          onClick={ this._rewind }>
          <i className="fa fa-backward" />
        </StyledRewindButton>
        <StyledForwardButton
          onClick={ this._forward }>
          <i className="fa fa-forward" />
        </StyledForwardButton>
        <StyledVolumeButton
          data-for="mutebtn"
          onClick={ this._toggleMute }
          data-tip={ isMute ? "Unmute" : "Mute"}
          >
          <ReactTooltip id="mutebtn" getContent={ () => isMute ? "Unmute" : "Mute"}/>
          <i className={`fa fa-volume-${ isMute ? "off" : (currentVolume >= 0.5 ? "up" : "down")}`}></i>
        </StyledVolumeButton>
        <StyledVolumeBar>
          <VolumeDragger
            updateVolume={ level => {
              updateVolume (level)
            }}
            currentVolume={ currentVolume }
          />
        </StyledVolumeBar>
        <StyledTime>
          {`${progressTime} / ${fullTime}`}
        </StyledTime>
        <StyldedFullScreenButton
          style={{display : `${isAudio ? "none" : "flex"}`}}
          data-for="fullscrbtn"
          data-tip={ isFullScreen ? "Exit Full Screen" : "Full Screen"}
          onClick={ e => {
            toggleFullScreen ()
          }}>
            <i className={`fa fa-${isFullScreen ? "compress" : "expand"}`} />
        </StyldedFullScreenButton>
        <ReactTooltip id="fullscrbtn" getContent={ () => isFullScreen ? "Exit Full Screen" : "Full Screen"}/>
      </StyledFooter>
    )
  }
}

export default MediaFooter;

import React from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { getOffsetLeft } from "../Util";

const StyledContainer = styled.div`
  background: rgba(0, 0, 0, 0.4);
  height: 10px;
  position: absolute;
  z-index: 0;
  width: 100%;
  bottom: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

class ProgressBarDraggable extends React.Component {
  constructor () {
    super ();
    this.state = {
      progressWidth: 0,
      progressValue: 0,
      maxValue: 0,
      bufferedWidth: 0,
      bufferedValue: 0
    }
    this._bindFunctions ();
    this.offsetLeft = 0;
    this.elem = null;
    this.start = 0;
  }

  _bindFunctions () {
    this._onMouseDown = this._onMouseDown.bind (this);
    this._onMouseUp = this._onMouseUp.bind (this);
    this._onMouseMove = this._onMouseMove.bind (this);
    this._onProgressBarClick = this._onProgressBarClick.bind (this);
  }

  componentWillReceiveProps (nextProps) {
    const progressWidth = (nextProps.progressValue / nextProps.maxValue) * 100;
    const bufferedWidth = (nextProps.bufferedValue / nextProps.maxValue) * 100;
    this.setState ({
      progressValue: nextProps.progressValue,
      progressWidth,
      bufferedValue: nextProps.bufferedValue,
      bufferedWidth,
      maxValue: nextProps.maxValue,
      resizableWidth: (progressWidth * this.progressBar.offsetWidth / 100)
    });
  }

  _getStyledBuffered () {
    return styled.div`
      height: 4px;
      width: ${this.state.bufferedWidth}%;
      z-index: 1;
      background: rgba(255, 255, 255, 0.5);
    `;
  }

  _getStyledProgressBr () {
    return styled.div`
      height: 4px;
      position: absolute;
      background: #f00;
      z-index: 4;
      width: ${this.state.resizableWidth}px;
    `;
  }

  _getStyledIndicator () {
      return styled.div`
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 1);
      border-radius: 100%;
      position: absolute;
      top: -4px;
      left: ${this.state.resizableWidth}px;
      opacity: 0;
      box-shadow: 0px 0px 4px 2px #ffffff;
      ${StyledContainer}:hover & {
        opacity: 1;
      }
    `
  }

  _onMouseDown (e) {
    e = e || window.event;
    if (e.pageX) {
      this.start = e.pageX 
    } else if (e.clientX) {
      this.start = e.clientX
    }
    this.offsetLeft = this.state.resizableWidth;
    document.body.onmousemove = this._onMouseMove
    document.body.onmouseup = this._onMouseUp
  }

  _onMouseMove (e) {
      e = e || window.event;
      let end = 0;
      if (e.pageX) end = e.pageX;
      else if(e.clientX) end = e.clientX;

      let diff = end - this.start;
      this.setState ({
        resizableWidth: (diff + this.offsetLeft)
      })
  }

  _onMouseUp (e) {
    document.body.onmousemove = document.body.onmouseup = null;
    const l = getOffsetLeft (this.progressBar);
    const currentPos = this.state.resizableWidth;
    let seekPosition = (currentPos / this.progressBar.offsetWidth) * this.state.maxValue;
    this.props.seekPosition (seekPosition);
  }

  _onProgressBarClick (e) {
    const l = getOffsetLeft (this.progressBar);
    const x = e.clientX;
    let clickedPos = x - l;
    clickedPos = (clickedPos / this.progressBar.offsetWidth) * this.state.maxValue
    this.props.seekPosition (clickedPos);
  }

  render () {
    const StyledBuffered = this._getStyledBuffered ();
    const StyledProgressBar = this._getStyledProgressBr ();
    const StyledIndicator = this._getStyledIndicator ();
    return (
      <StyledContainer innerRef={ x => this.progressBar = x } onClick={ this._onProgressBarClick }>
        <StyledProgressBar>
          <StyledIndicator
            onMouseDown={this._onMouseDown}>
          </StyledIndicator>
        </StyledProgressBar>
        <StyledBuffered />
      </StyledContainer>
    )
  }
}

export default ProgressBarDraggable;

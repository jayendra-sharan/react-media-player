import React from "react";
import styled from "styled-components";
import { ResizableBox } from 'react-resizable';
import { getOffsetLeft } from "../Util";

const StyleContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  height: 10px;
  position: absolute;
  z-index: 0;
  width: 100%;
  bottom: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledProgressBar = styled.div`
  height: 2px;
  width: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  z-index: 0;
`;

const StyledTip = styled.div`
  width: 6px;
  height: 6px;
  right: 0;
  border-radius: 100%;
  background: #ffffff;
  position: absolute;
  bottom: -1.5px;

  ${StyleContainer}:hover & {
    box-shadow: 0 0 2px 2px #ffffff;
  }
`;

class ProgressBar extends React.Component {
  constructor () {
    super ();
    this.state = {
      progressWidth: 0,
      progressValue: 0,
      maxValue: 0,
      bufferedWidth: 0,
      bufferedValue: 0,
      height: 4,
      cancelClickSeek: false
    }
    this._bindFunctions ();
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

  _getStyledProgress () {
    return styled.div`
      height: 4px;
      position: absolute;
      z-index: 2;
      background: #ff0000;
      width: ${this.state.progressWidth}%;
    `;
  }

  _getStyledBuffered () {
    return styled.div`
      height: 4px;
      width: ${this.state.bufferedWidth}%;
      z-index: 1;
      background: rgba(255, 255, 255, 0.5);
    `;
  }

  _bindFunctions () {
    this._onClick = this._onClick.bind (this);
    this._onResizeStart = this._onResizeStart.bind (this);
    this._onResizeStop = this._onResizeStop.bind (this);
  }


  _onClick (e) {
    const l = getOffsetLeft (this.progressBar);
    const x = e.clientX;
    let clickedPos = x - l;
    clickedPos = (clickedPos / this.progressBar.offsetWidth) * this.state.maxValue
    !this.state.cancelClickSeek && this.props.seekPosition (clickedPos);
  }

  _onResizeStart (event, {element, size}) {
    this.setState ({
      cancelClickSeek: true
    })
  }

  _onResizeStop (event, {element, size}) {
    const newPosition = (size.width / this.progressBar.offsetWidth) * this.state.maxValue;
    // this.props.seekPosition (newPosition);
    this.setState ({
      cancelClickSeek: false
    });
  }

  render () {
    const StyledBuffered = this._getStyledBuffered ();
    return (
      <StyleContainer
        onMouseUp={ (e => {
          debugger
        }).bind (this)}
        onClick={ this._onClick }>
        <StyledProgressBar
          innerRef={ x => this.progressBar = x }
        />
        <div className="seek-handler">
          <ResizableBox
            onResizeStart={ this._onResizeStart }
            onResizeStop={ this._onResizeStop }
            axis="x"
            width={ this.state.resizableWidth || 0 }
            height={ this.state.height }>
            <StyledTip />
          </ResizableBox>
          {/* <StyledProgress /> */}
        </div>
        <StyledBuffered />
      </StyleContainer>
    )
  }
}

export default ProgressBar;

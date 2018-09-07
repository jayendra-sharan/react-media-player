import React from "react";
import styled from "styled-components";
import { getOffsetLeft } from "../Util";
import { ResizableBox } from 'react-resizable';

const StyledVolumeBase = styled.div`
  width: 100%;
  height: 10px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

class VolumeDragger extends React.Component {
  constructor () {
    super ();
    this.state = {
      currentVolume: 0,
      left: 0,
      width: 0,
      cancelClickUpdate: false
    }
    this._bindFunctions ();
  }

  componentDidMount () {
    this.setState ({
      currentVolume: this.props.currentVolume,
      width: this.props.currentVolume * 100,
      left: (this.props.currentVolume * 100) - 3
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState ({
      currentVolume: nextProps.currentVolume,
      width: nextProps.currentVolume * 100,
      left: (this.props.currentVolume * 100) - 3
    })
  }

  _getVolumeBar () {
    return styled.div`
      background: rgba(255, 255, 255, 0.5);
      height: 1.5px;
      position: absolute;
      width: 100px;
      cursor: pointer;
    `;
  }

  _bindFunctions () {
    this._onVolumeBarClick = this._onVolumeBarClick.bind (this);
    this._onResize = this._onResize.bind (this);
  }

  _onVolumeBarClick (e) {
    !this.state.cancelClickUpdate && this._updateVolumeLevel (e)
  }

  _updateVolumeLevel (e) {
    const offsetLeft = getOffsetLeft (this.volumeBar);
    const pageX = e.pageX;
    const newLevel = (pageX - offsetLeft) / 100;
    this.props.updateVolume (newLevel);
  }

  _onResize (e, data) {
    console.info (data);
    this.setState ({
      width: data.size.width,
      cancelClickUpdate: true
    });
    this.props.updateVolume (data.size.width/100);
    this.setState ({
      cancelClickUpdate: false
    });
  }

  render () {
    const StyledVolumeBar = this._getVolumeBar ();
    return (
      <StyledVolumeBase
        innerRef={ x => this.volumeBar = x }
        onClick={ this._onVolumeBarClick }>
        <StyledVolumeBar />
        <ResizableBox
          axis="x"
          onResize={ this._onResize }
          width={this.state.width} height={3} >
        </ResizableBox>
      </StyledVolumeBase>
    )
  }
}

export default VolumeDragger;

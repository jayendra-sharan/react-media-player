import React from "react";
import styled from "styled-components";

const StyledToolbar = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const StyledButton = styled.div`
  width: 100px;
  height: 100px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  border-radius: 100%;
  font-size: 60px;
  padding-left: 10px;
`;

class OnScreenToolbar extends React.Component {
  constructor () {
    super ();
    this.state = {
      show: false
    }
  }

  componentWillReceiveProps (nextProps) {
      this.setState ({
        show: !nextProps.playing
      });
  }

  render () {
    const { playing, togglePlayPause } = this.props;
    return (
      <StyledToolbar
        onClick={ e => {
          togglePlayPause ()
        }}
      >
        {
          this.state.show &&
            <StyledButton>
              <i className={`fa fa-${playing ? "pause" : "play"}`}></i>
            </StyledButton>
        }
      </StyledToolbar>
    )
  }
}

export default OnScreenToolbar;

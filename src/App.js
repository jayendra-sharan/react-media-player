import React, { Component } from 'react';
import Main from "./main/Main";
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();

export const loadReactMediaPlayer = (options) => {

  ReactDOM.render(
    <Main
      source={ options.source }
      autoPlay={ options.autoPlay }
      mute={ options.mute }
      isAudio={ options.isAudio }
      />,
    document.getElementById(options.container)
  );
}
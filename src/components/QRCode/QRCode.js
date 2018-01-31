import React, { Component } from 'react';
import TheQRCode from 'qrcode.react';

import './QRCode.css';


export default class QRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="qr-code-container">
        <div className="qr-code-text">Please scan this QR Code in WeChat</div>
        <TheQRCode value="https://cryptic-dusk-76421.herokuapp.com/" className="qr-code" />
      </div>
    );
  }
}

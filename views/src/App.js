import React, { Component } from 'react';
import Gallery from './components/Gallery';
import axios from 'axios';
import logo from './assets/logo.svg';
import upload from './assets/up-arrow.svg';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '',
      status: null
    }
  }

  handleUpload = () => {
    const formData = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    formData.append('image', this.state.file);

    axios.post('http://localhost:3001/api/upload', formData, config)
      .then((res) => {
        if (res.status) {
          setTimeout(() => {
            this.setState({
              status: res.status
            });
          }, 500)
        }
      });
  }

  handleFile = (e) => {
    this.setState({
      file: e.target.files[0] },
      () => {
        this.handleUpload();
      }
    );
  }

  render() {
    return ([
      <header key="0">
        <div className="header-inner">
          <div className="logo">
            <img src={logo} alt="Kuvapalo logo" />
            <span>Kuvapalo</span>
          </div>
          <div className="upload">
            <label htmlFor="image">
            <img
              src={upload}
              alt="Upload icon"
            />
              Upload Image
            </label>
            <input
              onChange={this.handleFile}
              type="file"
              id="image"
              name="image"
              accept=".jpg, .jpeg, .png"
            />
          </div>
        </div>
      </header>,
      <div key="1" className="wrapper">
        <Gallery
          status={this.state.status}
        />
      </div>
    ])
  }
}

export default App;

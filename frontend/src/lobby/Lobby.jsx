import React, {Component} from "react";
import {STRINGS} from "../config";
//import FileUpload from "./FileUpload";
import MilanesApp from "./MilanesApp";

export default class Lobby extends Component {
  
  render() {
    document.title = STRINGS.BRANDING.SITE_TITLE;

    return (
      <div className="main_container">
        <div className="lobby">      
          <MilanesApp/>
          {/*<FileUpload/>*/}
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import EXIF from "exif-js";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { imageSrc: null, exifData: [] };
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="EXIF.reader"
            showMenuIconButton={false}
            iconElementRight={
              <IconButton onClick={() => app.quit()}>
                <NavigationClose />
              </IconButton>
            }
          />
          <div style={{ margin: "50px", textAlign: "center" }}>
            <div>Select your Image</div>
            <div>
              <FloatingActionButton containerElement={"label"}>
                <ContentAdd />
                <input
                  type="file"
                  accept="image/*"
                  style={{ opacity: 0, height: 0, width: 0 }}
                  onChange={event => this.readExif(event)}
                />
              </FloatingActionButton>
            </div>
            <img
              id="image"
              src={this.state.imgSrc}
              style={{ width: "200px" }}
              ref={img => {
                this.previewImage = img;
              }}
            />
            <h3> Exif Information </h3>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Key</TableHeaderColumn>
                  <TableHeaderColumn>Value</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.exifData.map(item => (
                  <TableRow selectable={false} key={"row-" + item.key}>
                    <TableRowColumn>{item.key}</TableRowColumn>
                    <TableRowColumn>{item.value.toString()}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  readExif = event => {
    const fs = window.require("fs");
    const file = event.target.files[0];

    let data = fs.readFileSync(file.path);
    let base64Image = new Buffer(data).toString("base64");
    this.setState({
      imgSrc: "data:image/gif;base64," + base64Image
    });

    EXIF.getData(file, () => {
      let myExifData = [];
      Object.keys(file.exifdata).forEach(key => {
        let value = file.exifdata[key];
        myExifData.push({ key: key, value: value });
      });
      this.setState({ exifData: myExifData });
    });
  };
}

export default App;

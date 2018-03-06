import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import MapsBeenhere from "material-ui/svg-icons/maps/beenhere";
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
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ component }) => <div>{component}</div>;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null,
      exifData: [],
      gps: { lat: null, long: null }
    };
  }

  render() {
    return (
      <MuiThemeProvider>
        <div style={{ height: "100%" }}>
          <AppBar
            title="EXIF.reader"
            showMenuIconButton={false}
            iconElementRight={
              <IconButton
                onClick={() => {
                  const remote = window.require("electron").remote;
                  remote.getCurrentWindow().close();
                }}
              >
                <NavigationClose />
              </IconButton>
            }
          />
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              maxHeight: "calc(100% - 100px - 64px)",
              overflowY: "auto"
            }}
          >
            <h4>Select your Image</h4>
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
            <br />
            <img
              id="image"
              src={this.state.imgSrc}
              style={{ width: "200px" }}
              ref={img => {
                this.previewImage = img;
              }}
            />
            {this.state.exifData.length > 0 ? (
              <div>
                <h3> Exif Information </h3>
                {this.state.gps.lat && this.state.gps.long ? (
                  <div
                    style={{ width: "500px", height: "200px", margin: "auto" }}
                  >
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: "AIzaSyA3h-aBE-93nRaOWbaJdkIRYXIrpy_ql_M"
                      }}
                      defaultCenter={{
                        lat: this.state.gps.lat,
                        lng: this.state.gps.long
                      }}
                      defaultZoom={17}
                    >
                      <AnyReactComponent
                        lat={this.state.gps.lat}
                        lng={this.state.gps.long}
                        component={<MapsBeenhere style={{ top: "-10px" }} />}
                      />
                    </GoogleMapReact>
                  </div>
                ) : null}
                <Table>
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                  >
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
            ) : (
              <h2>no exif data</h2>
            )}
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
      let GPSLatitude;
      let GPSLongitude;
      Object.keys(file.exifdata).forEach(key => {
        let value = file.exifdata[key];
        myExifData.push({ key: key, value: value });
        key === "GPSLatitude" ? (GPSLatitude = value) : null;
        key === "GPSLongitude" ? (GPSLongitude = value) : null;
      });
      this.setState({ exifData: myExifData });

      if (GPSLatitude !== undefined && GPSLongitude !== undefined) {
        let latDegrees = GPSLatitude[0].numerator;
        let latMinutes = GPSLatitude[1].numerator;
        let latSeconds = GPSLatitude[2].numerator;
        let longDegrees = GPSLongitude[0].numerator;
        let longMinutes = GPSLongitude[1].numerator;
        let longSeconds = GPSLongitude[2].numerator;
        this.setState({
          gps: {
            lat: latDegrees + latMinutes / 60 + latSeconds / 3600,
            long: longDegrees + longMinutes / 60 + longSeconds / 3600
          }
        });
        console.log(this.state.gps.lat);
        console.log(this.state.gps.long);
      } else {
        this.setState({
          gps: {
            lat: null,
            long: null
          }
        });
      }
    });
  };
}

export default App;

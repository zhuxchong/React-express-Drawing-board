import React from "react";
import axios from "axios";
import ColorPicker from "../components/ColorPicker";
import SnackBar from "../components/SnackBar";
import "./drawingComponent.css";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const colorArray = ["black", "red", "yellow", "blue"];
class DrawingComponent extends React.PureComponent {
  constructor() {
    super();
    this.tempRecord = [];
    this.record = [];
    this.width = 2;
    this.color = "black";
    this.state = {
      color: "black",
      canvas: "",
      ctx: "",
      flag: false,
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      dot_flag: false,
      saveSuccess: undefined,
      image: new Image(),
      refresh: 0,
      currClick: 0,
      totalClick: 0,
      openSnackBar: false,
      snackBarMsg: "",
      loading: false,
      loadingMsg: ""
    };
  }

  componentWillUnmount() {
    this.refs.canvas.removeEventListener("mouseout", this.eventTrigger);
    this.refs.canvas.removeEventListener("mousemove", this.eventTrigger);
    this.refs.canvas.removeEventListener("mousedown", this.eventTrigger);
    this.refs.canvas.removeEventListener("mouseup", this.eventTrigger);
  }

  componentDidMount() {
    this.refs.canvas.width = this.refs.canvas.offsetWidth;
    this.refs.canvas.height = this.refs.canvas.offsetHeight;

    this.refs.canvas.addEventListener("mouseout", this.eventTrigger, false);
    this.refs.canvas.addEventListener("mousemove", this.eventTrigger, false);
    this.refs.canvas.addEventListener("mousedown", this.eventTrigger, false);
    this.refs.canvas.addEventListener("mouseup", this.eventTrigger, false);
    this.getDataFromDB();
  }
  getDataFromDB = () => {
    this.loadingHandle(true, "Loading");
    axios
      .get("image/init")
      .then(res => {
        if (res.data === "Welcome") {
          this.snackerBarHandle("Welcome", true);
        } else {
          this.setState({ totalClick: res.data.Click });
          // let yImg = new Image();
          // yImg.src = res.data.Image;
          // yImg.onload = () => {
          //   this.refs.canvas.getContext("2d").drawImage(yImg, 0, 0);
          // };
          //////////////////above loading the previous pict which is not editable////////////////////
          //////////////////below loading the previous pict which is  editable////////////////////
          this.record = res.data.Track;
          this.resetImage();
          this.snackerBarHandle("Loading successfully", true);
        }
      })
      .catch(e => {
        this.snackerBarHandle("Loading successfully");
        console.error(e);
      });
  };

  eventTrigger = e => {
    this.findxy(e);
  };

  setColor = color => {
    this.setState({ color });
  };
  findxy = e => {
    if (e.type === "mousedown") {
      this.setState({
        currClick: this.state.currClick + 1,
        totalClick: this.state.totalClick + 1
      });
      //handle dot suitation
      this.setState(
        {
          currX: e.clientX - this.refs.canvas.offsetLeft,
          currY: e.clientY - this.refs.canvas.offsetTop,
          flag: true,
          dot_flag: true
        },
        () => {
          this.tempRecord = [
            {
              dot: true,

              currX: e.clientX - this.refs.canvas.offsetLeft,
              currY: e.clientY - this.refs.canvas.offsetTop,
              color: this.state.color,
              width: this.width
            }
          ];
          if (this.state.dot_flag) {
            this.pointdraw(
              this.state.currX,
              this.state.currY,
              this.state.color,
              this.width
            );
          }
        }
      );
    }
    if (e.type === "mouseup" || e.type === "mouseout") {
      this.setState(
        {
          flag: false
        },
        () => {
          this.record =
            this.tempRecord.length === 0
              ? this.record
              : [...this.record, this.tempRecord];
          this.tempRecord = [];
        }
      );
    }
    if (e.type === "mousemove") {
      if (this.state.flag) {
        this.simulateMovingDraw(
          this.state.currX,
          this.state.currY,
          e.clientX - this.refs.canvas.offsetLeft,
          e.clientY - this.refs.canvas.offsetTop
        );
      }
    }
  };

  simulateMovingDraw = (prevX, prevY, currX, currY) => {
    this.setState(
      {
        prevX: prevX,
        prevY: prevY,
        currX: currX,
        currY: currY
      },
      function() {
        this.tempRecord = [
          ...this.tempRecord,
          {
            dot: false,
            prevX: prevX,
            prevY: prevY,
            currX: currX,
            currY: currY,
            color: this.state.color,
            width: this.width
          }
        ];
        this.draw(
          this.state.prevX,
          this.state.prevY,
          this.state.currX,
          this.state.currY,
          this.state.color,
          this.width
        );
      }
    );
  };

  pointdraw = (currX, currY, color, width) => {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = color; //choose color
    ctx.fillRect(currX, currY, width, width);
    ctx.closePath();
    this.setState({
      dot_flag: false
    });
  };
  draw = (prevX, prevY, currX, currY, color, width) => {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(prevX, prevY); //initial position
    ctx.lineTo(currX, currY); //current position
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();
  };
  resetImage = () => {
    this.record.map((recordItem, index) => {
      return recordItem.map(i => {
        if (i.dot) {
          this.pointdraw(i.currX, i.currY, i.color, i.width);
          return null;
        } else {
          this.draw(i.prevX, i.prevY, i.currX, i.currY, i.color, i.width);
          return null;
        }
      });
    });
  };
  undo = () => {
    this.clearImg(true);
    this.record.splice(-1, 1);
    this.resetImage();
  };

  save = () => {
    this.loadingHandle(true, "Saving");
    axios
      .put("image/save", {
        image: this.refs.canvas.toDataURL(),
        click: this.state.totalClick,
        track: this.record
      })
      .then(res => {
        this.snackerBarHandle("Save successfully", true);
      })
      .catch(e => this.snackerBarHandle("Save failed"));
  };

  clearImg = undo => {
    if (!undo) {
      this.record = [];
    }
    this.refs.canvas
      .getContext("2d")
      .clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
  };

  loadingHandle = (open, msg) => {
    this.setState({
      loading: open,
      loadingMsg: msg
    });
  };
  snackerBarHandle = (msg, success) => {
    success
      ? this.setState({
          saveSuccess: true,
          openSnackBar: true,
          snackBarMsg: msg,
          loading: false
        })
      : this.setState({
          saveSuccess: false,
          openSnackBar: true,
          snackBarMsg: msg,
          loading: false
        });
  };
  resetAll = () => {
    this.loadingHandle(true, "Resetting");
    axios
      .delete("image/delete")
      .then(r => {
        this.clearImg();
        this.setState({ totalClick: 0, currClick: 0 });
        this.snackerBarHandle("Reset successfully", true);
      })
      .catch(r => this.snackerBarHandle("Reset failed"));
  };
  render() {
    return (
      <React.Fragment>
        <div
          id="app-detail"
          onClick={this.sentMessageToServ}
          onLoad={this.init}
        >
          <div id="tools">
            <span>Current click : {this.state.currClick}</span>

            <span> Total click : {this.state.totalClick}</span>
            <div id="color-tools">
              <div id="selectColor">Choose Color</div>
              {colorArray.map((i, index) => {
                return (
                  <ColorPicker
                    key={index}
                    selected={this.state.color}
                    color={i}
                    handleColorChange={this.setColor}
                  />
                );
              })}
            </div>
          </div>
          <canvas ref="canvas" id="canvas" />
          <div style={{ margin: "10px auto" }}>
            <Button color="primary" onClick={this.save}>
              save
            </Button>
            <Button color="secondary" onClick={this.undo}>
              undo
            </Button>

            <Button onClick={() => this.clearImg(false)}>Reset</Button>
          </div>
          <Button onClick={this.resetAll}>Reset ALL</Button>
        </div>
        {this.state.loading && (
          <div
            style={{
              position: "fixed",
              left: "50%",
              top: "50%"
            }}
          >
            <CircularProgress />
            <span>{this.state.loadingMsg}...</span>
          </div>
        )}

        <SnackBar
          openSnackBar={this.state.openSnackBar}
          success={this.state.saveSuccess}
          closeSnackBar={() => {
            this.setState({
              openSnackBar: false
            });
          }}
          message={this.state.snackBarMsg}
        />
      </React.Fragment>
    );
  }
}

export default DrawingComponent;

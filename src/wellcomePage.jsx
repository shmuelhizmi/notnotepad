import React, { Component } from "react";
import Draggable from "react-draggable";
import { Spinner, Card, H1, Divider, ButtonGroup, H3 } from "@blueprintjs/core";

export default class WellcomePage extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "#2732A7",
          position: "relative",
          width: "100%",
          height: "100%"
        }}
      >
        <div
          className="bp3-dark"
          style={{
            backgroundColor: "#587BD6",
            position: "absolute",
            top: "10%",
            width: "100%",
            height: "80%",
            border: "1px solid #D9956E"
          }}
        >
          <Card
            elevation={4}
            style={{
              position: "relative",
              top: "10%",
              left: "25%",
              width: "50%",
              height: "60%"
            }}
          >
            <ButtonGroup
              style={{
                position: "relative",
                height: "100%"
              }}
            >
              <Draggable>
                <H1 style={{ marginTop: "30%" }}>
                  wellcome to NotNotePad
                  <H3>large project may take a wilde to load...</H3>
                </H1>
              </Draggable>
              <Divider />
              <Draggable>
                <div style={{ position: "relative", padding: "25%" }}>
                  <Spinner size={175}></Spinner>
                </div>
              </Draggable>
            </ButtonGroup>
          </Card>
        </div>
        <Draggable>
          <img
            alt="monaco editor"
            src="./media/editors/monaco.svg"
            width={100}
            height={100}
            draggable="false"
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="md editor"
            src="./media/editors/md.png"
            width={100}
            height={100}
            draggable="false"
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="ckeditor5 editor"
            src="./media/editors/ckeditor5.png"
            width={100}
            height={100}
            draggable="false"
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="ckeditor4 editor"
            src="./media/editors/ckeditor4.png"
            width={100}
            height={100}
            draggable="false"
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="blockly editor"
            src="./media/editors/blockly.svg"
            width={100}
            height={100}
            draggable="false"
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="json tree editor"
            src="./media/editors/jsonview.svg"
            width={100}
            height={100}
            draggable="false"
          ></img>
        </Draggable>
      </div>
    );
  }
}

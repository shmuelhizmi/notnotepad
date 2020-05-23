import React, { Component } from "react";
import Draggable from "react-draggable";
import { Spinner, Card, H1, ButtonGroup, H3, Tag } from "@blueprintjs/core";

export default class WellcomePage extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "#2732A7",
          position: "relative",
          width: "100%",
          height: "100%",
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
            border: "1px solid #D9956E",
          }}
        >
          <Card
            elevation={4}
            style={{
              position: "relative",
              top: "10%",
              left: "25%",
              width: "50%",
              height: "60%",
            }}
          >
            <ButtonGroup
              style={{
                position: "relative",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "55% 45%",
              }}
            >
              <div style={{ marginTop: "30%" }}>
                <Draggable>
                  <div>
                    <H1>wellcome to NotNotePad</H1>
                    <H3>large project may take a while to load...</H3>
                    <Tag intent="warning">
                      {" "}
                      recommend to use in chrome or firefox{" "}
                    </Tag>
                  </div>
                </Draggable>
              </div>
              <div style={{ marginTop: "30%" }}>
                <Draggable>
                  <div>
                    <Spinner size={125}></Spinner>
                  </div>
                </Draggable>
              </div>
            </ButtonGroup>
          </Card>
        </div>
        <Draggable>
          <img
            alt="monaco editor"
            src={window.location.origin + "/media/editors/monaco.svg"}
            width={100}
            height={100}
            draggable={false}
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="md editor"
            src={window.location.origin + "/media/editors/md.png"}
            width={100}
            height={100}
            draggable={false}
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="ckeditor5 editor"
            src={window.location.origin + "/media/editors/ckeditor5.png"}
            width={100}
            height={100}
            draggable={false}
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="ckeditor4 editor"
            src={window.location.origin + "/media/editors/ckeditor4.png"}
            width={100}
            height={100}
            draggable={false}
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="blockly editor"
            src={window.location.origin + "/media/editors/blockly.svg"}
            width={100}
            height={100}
            draggable={false}
          ></img>
        </Draggable>
        <Draggable>
          <img
            alt="json tree editor"
            src={window.location.origin + "/media/editors/jsonview.svg"}
            width={100}
            height={100}
            draggable={false}
          ></img>
        </Draggable>
      </div>
    );
  }
}

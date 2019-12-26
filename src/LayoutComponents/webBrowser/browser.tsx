import React, { Component } from "react";
import {
  Button,
  InputGroup,
  Navbar,
  NavbarGroup,
  Alignment
} from "@blueprintjs/core";
interface BrowserState {
  currentUrl: string;
  input: string;
  rerender: number;
}
interface BrowserProps {
  url: string;
}

export default class Browser extends Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props);
    this.state = {
      currentUrl: props.url,
      input: props.url,
      rerender: 1
    };
  }
  componentWillReceiveProps(props: BrowserProps) {
    this.setState({ input: props.url, currentUrl: props.url });
  }
  render() {
    return (
      <div>
        <Navbar>
          <NavbarGroup align={Alignment.CENTER}>
            <Button
              minimal
              icon="arrow-left"
              onClick={() => {
                this.setState({
                  currentUrl: this.props.url,
                  input: this.props.url
                });
              }}
            />
            <Button
              minimal
              icon="circle"
              onClick={() => {
                this.setState({ rerender: this.state.rerender + 1 });
              }}
            />
            <InputGroup
              fill
              value={this.state.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ input: e.target.value });
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.keyCode === 13) {
                  this.setState({ currentUrl: this.state.input });
                }
              }}
            ></InputGroup>
          </NavbarGroup>
        </Navbar>
        <div style={{ backgroundColor: "#fff" }}>
          <iframe
            key={this.state.rerender}
            title="now"
            style={{
              border: "none",
              marginTop: "5%",
              height: "100%",
              width: "100%"
            }}
            src={"https://" + this.state.currentUrl}
          />
        </div>
      </div>
    );
  }
}

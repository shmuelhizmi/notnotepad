import React, { Component } from "react";
import randomstring from "randomstring";
import Browser from "../webBrowser/browser";
import { connect } from "react-redux";
import {
  setNowEnable,
  setNowToken,
  setNowUrl
} from "../../states/services/now";
import Now from "../../APIS/now/now";
import StorageManager, {
  codeDir,
  secretDir
} from "../../Storage/storageManager";
import {
  InputGroup,
  Divider,
  ButtonGroup,
  Button,
  HTMLTable,
  Tag,
  ControlGroup,
  Collapse,
  H4,
  Spinner
} from "@blueprintjs/core";

interface NowPanelState {
  url: string;
  enable: boolean;
  token: string;
  requestLoginState: requestLoginState;
  email: string;
  projectId: string;
  existingToken: string;
  activeCode: string;
  activeToken: string;
}
interface NowPanelProps {
  enable: boolean;
  token: string;
  url: string;
  setNowToken: (token: string) => void;
  setNowUrl: (url: string) => void;
  setNowEnable: (enable: boolean) => void;
}
interface nowState {
  enabled: boolean;
  url: string;
  token: string;
}
interface reduxState {
  theme: string;
  now: nowState;
}

type requestLoginState =
  | "registration"
  | "verification"
  | "ready"
  | "publish"
  | "loading";
class NowPanel extends Component<NowPanelProps, NowPanelState> {
  nowClient: Now;
  storage: StorageManager;
  constructor(props: NowPanelProps) {
    super(props);
    this.state = {
      url: props.url,
      enable: props.enable,
      token: props.token,
      activeCode: "",
      activeToken: "",
      email: "",
      existingToken: "",
      projectId: "nnp-" + randomstring.generate(5),
      requestLoginState: props.enable ? "ready" : "registration"
    };
    this.storage = new StorageManager();
    this.nowClient = new Now(
      this.state.enable && this.state.token ? this.state.token : ""
    );
  }
  componentDidMount() {
    if (this.storage.syncFileExists("now", secretDir)) {
      this.updateToken(this.storage.syncGetFile("now", secretDir));
    }
  }
  sendVerfiction = () => {
    this.setState({ requestLoginState: "loading" });
    this.nowClient
      .requestLogin(this.state.email, this.state.projectId)
      .then(res => {
        this.setState({ activeCode: res.securityCode, activeToken: res.token });
        this.setState({ requestLoginState: "verification" });
      });
  };
  verify = () => {
    this.setState({ requestLoginState: "loading" });
    this.nowClient
      .verifyLogin(this.state.email, this.state.activeToken)
      .then(token => {
        this.storage.syncSetFile("now", token, secretDir);
        this.updateToken(token);
      });
  };

  updateToken = (newToken: string) => {
    this.props.setNowToken(newToken);
    this.props.setNowEnable(true);
    this.setState({ requestLoginState: "ready", enable: true });
    this.nowClient.setToken(newToken);
  };
  publish = () => {
    this.setState({ requestLoginState: "loading" });
    const files = this.storage.syncListFilesToFilesArray("", codeDir);
    this.nowClient.deploy(files, "notpad").then(url => {
      this.setState({
        url: url,
        requestLoginState: "publish"
      });
      this.props.setNowUrl(url);
    });
  };

  render() {
    return (
      <div>
        <Collapse isOpen={this.state.requestLoginState === "loading"}>
          <Divider />
          <Spinner size={120}></Spinner>
          <Divider />
        </Collapse>
        <Collapse isOpen={this.state.requestLoginState === "registration"}>
          <div style={{ margin: "5%" }}>
            <H4 style={{ textAlign: "center" }}>create new project token</H4>
            <Divider></Divider>
            <ControlGroup>
              <InputGroup
                rightElement={<Tag minimal>project id</Tag>}
                fill
                placeholder="project id"
                defaultValue={this.state.projectId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ projectId: e.target.value });
                }}
              ></InputGroup>
              <InputGroup
                rightElement={<Tag minimal>email</Tag>}
                fill
                placeholder="e-mail"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ email: e.target.value });
                }}
              ></InputGroup>
              <Button
                onClick={this.sendVerfiction}
                disabled={this.state.enable}
                text="Make access token"
              ></Button>
            </ControlGroup>
            <Divider></Divider>
            <ControlGroup>
              <Tag>OR..</Tag>
              <InputGroup
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ existingToken: e.target.value });
                }}
                fill
                placeholder="enter existing now token"
              ></InputGroup>
              <Button
                text="apply"
                onClick={() => {
                  this.storage.syncSetFile(
                    "now",
                    this.state.existingToken,
                    secretDir
                  );
                  this.updateToken(this.state.existingToken);
                }}
              ></Button>
            </ControlGroup>
          </div>
          <Divider></Divider>
        </Collapse>
        <Collapse
          isOpen={
            this.state.requestLoginState === "verification" ? true : false
          }
        >
          <div
            style={{
              textAlign: "center"
            }}
          >
            <p>
              you shuld now recover email from "now@zeit.co" with code
              verfication
            </p>
            <p>
              code :"{this.state.activeCode}" please prees on the VERIFY button
            </p>
            <p>and click continue </p>
          </div>
          <ControlGroup>
          <Button text="back" onClick={()=>this.setState({ requestLoginState: "registration"})}></Button>
          <Button fill text="continue" onClick={this.verify}></Button>
          </ControlGroup>
          <Divider></Divider>
        </Collapse>
        <ButtonGroup fill>
          <Button onClick={this.publish} disabled={!this.state.enable}>
            <HTMLTable>
              <thead>
                <tr>
                  <th>
                    <img
                      width="25"
                      alt="now"
                      height="25"
                      src="./media/oauth/zeit-black-triangle.svg"
                    ></img>
                  </th>
                  <th>
                    <p>Publish</p>
                  </th>
                </tr>
              </thead>
            </HTMLTable>
          </Button>
        </ButtonGroup>
        <Divider></Divider>
        <Collapse isOpen={this.state.enable && this.state.url !== ""}>
          <Browser url={this.state.url}></Browser>
        </Collapse>
      </div>
    );
  }
}
export default connect(
  (s: reduxState) => {
    return { enable: s.now.enabled, token: s.now.token, url: s.now.url };
  },
  { setNowEnable, setNowToken, setNowUrl }
)(NowPanel);

import React from "react";
import CodeEditor from "../../CodeEditor";
import {
  Navbar,
  NavbarGroup,
  NumericInput,
  ControlGroup,
  Alignment,
  Tag,
  H1,
  IPanelProps,
  Button,
  PanelStack,
  Text,
  InputGroup,
  Divider
} from "@blueprintjs/core";
import "./JsonObjectEditor.scss";
import { Cell, Table, Column, EditableCell } from "@blueprintjs/table";
import "@blueprintjs/table/lib/css/table.css";

export default class JsonObjectEditor extends CodeEditor {
  constructor(props) {
    super(props);
    this.state = { ...this.state };
  }
  componentDidMount = () => {
    this.setState({ editor: "JsonObjectEditor" });
  };
  componentWillUnmount = () => {
    this.saveEditorDataFromState();
  };
  updateCode = code => {
    const newCode = JSON.stringify(code);
    this.setState({
      code: newCode
    });
    this.updateDocument(newCode);
  };
  makeJSON(code) {
    try {
      return JSON.parse(code);
    } catch {
      return { name: this.state.documentName };
    }
  }
  public render() {
    console.log(this.state.code);
    const code = JSON.parse(this.state.code);
    if (typeof code === "object") {
      return (
        <>
          <PanelStack
            className="fill"
            initialPanel={{
              component: ObjectView,
              title: "ROOT",
              props: { value: code, onChange: this.updateCode }
            }}
          />
        </>
      );
    } else {
      return (
        <H1 style={{ textAlign: "center" }}>
          JSON OBJECT EDITOR ONLY SUPPORT JSON OBJECTS
        </H1>
      );
    }
  }
}

class ObjectView extends React.Component<
  IPanelProps & { value: object; onChange: (value) => void },
  { value: object }
> {
  state = {
    value: this.props.value
  };
  public render() {
    return (
      <div>
        <div className="grid-container">
          {Object.keys(this.state.value).map(
            (name, index) =>
              typeof this.state.value[name] === "object" && (
                <div key={index}>
                  <Button
                    icon={
                      Array.isArray(this.state.value[name])
                        ? "numbered-list"
                        : "cube"
                    }
                    style={{
                      height: 100,
                      width: 120,
                      margin: 10
                    }}
                    onClick={() =>
                      this.openObject(this.state.value[name], name)
                    }
                  >
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 80,
                        overflow: "hidden"
                      }}
                    >
                      {name}
                    </div>
                  </Button>
                </div>
              )
          )}
        </div>
        <Divider />

        <Table
          className="table-fill-width"
          numRows={
            Object.keys(this.state.value).filter(
              value => typeof this.state.value[value] !== "object"
            ).length
          }
        >
          <Column name="name" cellRenderer={this.renderNameCell}></Column>
          <Column name="value" cellRenderer={this.renderCell}></Column>
        </Table>
      </div>
    );
  }

  private renderCell = (rowIndex: number) => {
    const filterdValues = Object.keys(this.state.value).filter(
      value => typeof this.state.value[value] !== "object"
    );
    return (
      <EditableCell
        onChange={value => {
          if (typeof this.state.value[filterdValues[rowIndex]] === "number") {
            this.state.value[filterdValues[rowIndex]] = Number(value);
          }
          if (typeof this.state.value[filterdValues[rowIndex]] === "boolean") {
            this.state.value[filterdValues[rowIndex]] = Boolean(value);
          }
          if (typeof this.state.value[filterdValues[rowIndex]] === "string") {
            this.state.value[filterdValues[rowIndex]] = value;
          }
          this.setState(this.state);
          this.props.onChange(this.state.value);
        }}
        value={this.state.value[filterdValues[rowIndex]]}
      ></EditableCell>
    );
  };
  private renderNameCell = (rowIndex: number) => {
    const filterdValues = Object.keys(this.state.value).filter(
      value => typeof this.state[value] !== "object"
    );

    return <Cell>{filterdValues[rowIndex]}</Cell>;
  };

  private openObject(value: object, name: string) {
    this.props.openPanel({
      component: ObjectView,
      props: {
        value,
        onChange: value => {
          this.state.value[name] = value;
          this.setState(this.state);
          this.props.onChange(this.state.value);
        }
      },
      title: "Settings"
    });
  }
}

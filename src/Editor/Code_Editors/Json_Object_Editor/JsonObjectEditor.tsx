import React from "react";
import CodeEditor from "../../CodeEditor";
import {
  H1,
  IPanelProps,
  Button,
  PanelStack,
  Divider,
} from "@blueprintjs/core";
import "./JsonObjectEditor.scss";
import { Table, Column, EditableCell } from "@blueprintjs/table";
import "@blueprintjs/table/lib/css/table.css";

interface CompiledObject {
  type: "object";
  name?: string;
  childrens: ((
    | CompiledObject
    | CompiledArray
    | CompiledString
    | CompiledNumber
    | CompiledBoolean
  ) & {
    name: string;
    index: number;
  })[];
}

interface CompiledArray {
  type: "array";
  name?: string;
  childrens: ((
    | CompiledObject
    | CompiledArray
    | CompiledString
    | CompiledNumber
    | CompiledBoolean
  ) & { index: number })[];
}

interface CompiledString {
  type: "string";
  name?: string;
  value: string;
}

interface CompiledNumber {
  type: "number";
  name?: string;
  value: number;
}

interface CompiledBoolean {
  type: "boolean";
  name?: string;
  value: boolean;
}

// @ts-ignore
type JsonValue = string | Array<JsonValue> | object | number | boolean;

const compileJson: (
  value: JsonValue
) =>
  | CompiledObject
  | CompiledArray
  | CompiledString
  | CompiledNumber
  | CompiledBoolean = (value) => {
  try {
    switch (typeof value) {
      case "object": {
        if (!Array.isArray(value)) {
          const result: CompiledObject = {
            type: "object",
            childrens: Object.keys(value).map((name, index) => ({
              ...compileJson(value[name]),
              name,
              index,
            })),
          };
          return result;
        } else {
          const result: CompiledArray = {
            type: "array",
            childrens: value.map((child, index) => ({
              ...compileJson(child),
              index,
            })),
          };
          return result;
        }
      }
      case "string": {
        const result: CompiledString = { type: "string", value };
        return result;
      }
      case "number": {
        const result: CompiledNumber = { type: "number", value };
        return result;
      }
      case "boolean": {
        const result: CompiledBoolean = { type: "boolean", value };
        return result;
      }
    }
  } catch (e) {
    const result: CompiledObject = { type: "object", childrens: [] };
    return result;
  }
};

const comileToJson: (
  value:
    | CompiledObject
    | CompiledArray
    | CompiledString
    | CompiledNumber
    | CompiledBoolean
) => JsonValue = (value) => {
  try {
    switch (value.type) {
      case "object": {
        const result: object = {};
        value.childrens.forEach(
          (child) => (result[child.name] = comileToJson(child))
        );
        return result;
      }
      case "array": {
        const result = [];
        value.childrens.forEach((child) => result.push(comileToJson(child)));
        return result;
      }
      case "string" || "number" || "boolean": {
        return value.value;
      }
    }
  } catch (e) {
    return {};
  }
};
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
  updateCode = (code) => {
    const newCode = JSON.stringify(comileToJson(code));
    this.setState({
      code: newCode,
    });
    this.updateDocument(newCode);
  };

  public render() {
    let code;
    try {
      code = compileJson(JSON.parse(this.state.code));
    } catch (e) {
      code = compileJson(JSON.parse("{}"));
    }
    if (typeof code === "object") {
      return (
        <>
          <PanelStack
            className="fill"
            initialPanel={{
              component: ObjectView,
              title: "ROOT",
              props: { value: code, onChange: this.updateCode },
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
  IPanelProps & {
    value: CompiledObject | CompiledArray;
    onChange: (value) => void;
  },
  { value: object }
> {
  state = {
    value: this.props.value,
  };
  public render() {
    return (
      <div>
        <div className="grid-container">
          {
            // @ts-ignore
            this.state.value.childrens.map(
              (value, index) =>
                value.type === "object" && (
                  <div key={value.index}>
                    <Button
                      icon={"cube"}
                      style={{
                        height: 100,
                        width: 120,
                        margin: 10,
                      }}
                      onClick={() =>
                        this.openObject(
                          value,
                          value.name || "index - " + (value.index + 1)
                        )
                      }
                    >
                      <div
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 80,
                          overflow: "hidden",
                        }}
                      >
                        {value.name || "index - " + (value.index + 1)}
                      </div>
                    </Button>
                  </div>
                )
            )
          }
          {
            // @ts-ignore
            this.state.value.childrens.map(
              (value, index) =>
                value.type === "array" && (
                  <div key={value.index}>
                    <Button
                      icon={"numbered-list"}
                      style={{
                        height: 100,
                        width: 120,
                        margin: 10,
                      }}
                      onClick={() =>
                        this.openObject(
                          value,
                          value.name || "index - " + (value.index + 1)
                        )
                      }
                    >
                      <div
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 80,
                          overflow: "hidden",
                        }}
                      >
                        {value.name || "index - " + (value.index + 1)}
                      </div>
                    </Button>
                  </div>
                )
            )
          }
        </div>
        <Divider />
        {this.state.value.childrens.filter(
          (value) =>
            value.type === "number" ||
            value.type === "boolean" ||
            value.type === "string"
        ).length > 0 && (
          <Table
            className="table-fill-width"
            numRows={
              this.state.value.childrens.filter(
                (value) =>
                  value.type === "number" ||
                  value.type === "boolean" ||
                  value.type === "string"
              ).length
            }
          >
            <Column name="name" cellRenderer={this.renderNameCell}></Column>
            <Column name="value" cellRenderer={this.renderCell}></Column>
          </Table>
        )}
      </div>
    );
  }

  private renderCell = (rowIndex: number) => {
    // @ts-ignore
    const filterdValues: (
      | CompiledBoolean
      | CompiledNumber
      | CompiledString
    )[] = this.state.value.childrens.filter(
      (value) =>
        value.type === "number" ||
        value.type === "boolean" ||
        value.type === "string"
    );
    const toStringBool = (value) => (value ? "true" : "false");
    return (
      <EditableCell
        onChange={(value) => {
          if (filterdValues[rowIndex].type === "number") {
            filterdValues[rowIndex].value = Number(value);
          }
          if (filterdValues[rowIndex].type === "string") {
            filterdValues[rowIndex].value = value;
          }
          if (filterdValues[rowIndex].type === "boolean") {
            filterdValues[rowIndex].value = value === "true" ? true : false;
          }
          this.setState(this.state);
          this.props.onChange(this.state.value);
        }}
        // @ts-ignore
        value={
          filterdValues[rowIndex].type === "boolean"
            ? toStringBool(filterdValues[rowIndex].value)
            : filterdValues[rowIndex].value
        }
      ></EditableCell>
    );
  };
  private renderNameCell = (rowIndex: number) => {
    const filterdValues = this.state.value.childrens.filter(
      (value) =>
        value.type === "number" ||
        value.type === "boolean" ||
        value.type === "string"
    );

    return (
      <EditableCell
        value={
          filterdValues[rowIndex].name ||
          "index - " + filterdValues[rowIndex].index
        }
        onChange={(value) => {
          if (filterdValues[rowIndex].name) {
            filterdValues[rowIndex].name = value;
            this.props.onChange(this.state.value);
          }
        }}
      />
    );
  };

  private openObject(value: CompiledObject | CompiledArray, name: string) {
    this.props.openPanel({
      component: ObjectView,
      props: {
        value,
        onChange: (value) => {
          // eslint-disable-next-line react/no-direct-mutation-state
          this.state.value[name] = value;
          this.setState(this.state);
          this.props.onChange(this.state.value);
        },
      },
      title: name,
    });
  }
}

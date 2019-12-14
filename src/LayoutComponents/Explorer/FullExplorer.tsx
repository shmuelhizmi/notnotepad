import React from "react";
import { Classes, Tree, Drawer, Button, ButtonGroup } from "@blueprintjs/core";
import Explorer, { ExplorerProps } from "./Explorer";
import CreateFile from "./Action/Create";
import DeleteFile from "./Action/Delete";
import RenameFile from "./Action/Rename";

interface FullExplorerProps extends ExplorerProps {
  isOpen: boolean;
}

class FullExplorer extends Explorer {
  constructor(props: FullExplorerProps) {
    super(props);
    this.state = {
      ...this.state,
      isOpen: props.isOpen
    };
  }

  close = () => {
    this.setState({ isOpen: false });
  };
  open = () => {
    this.setState({ isOpen: true });
  };
  render() {
    return (
      <div>
        <Button
          minimal
          style={{ width: "100%" }}
          icon="menu-open"
          title="open full explorer"
          onClick={this.open}
        >
          launch full explorer
        </Button>
        <Drawer
          onClose={this.close}
          isOpen={this.state.isOpen}
          title="Full explorer"
          icon="box"
        >
          <ButtonGroup fill>
            <Button icon="add" onClick={this.openCreateFileDialog}>
              Create file
            </Button>
            <Button onClick={this.OpenRenameFileDialog} icon="text-highlight">
              Rename file
            </Button>
            <Button onClick={this.openDeleteFileDialog} icon="remove">
              Delete file
            </Button>
          </ButtonGroup>
          <Tree
            //style={{ backgroundColor: "rgb(39,44,41,0.5)" }}
            contents={this.state.nodes}
            onNodeClick={this.handleNodeClick}
            onNodeDoubleClick={this.handleNodeDoubleClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
            className={Classes.ELEVATION_0}
          ></Tree>
          <ButtonGroup fill minimal>
            <Button icon="download" onClick={() => {}}>
              download file code
            </Button>
            <Button icon="download" onClick={() => {}}>
              download file data
            </Button>
            <Button
              icon="download"
              onClick={() => {
                this.storage.download();
              }}
            >
              download project data
            </Button>
          </ButtonGroup>
          <Button
            fill
            large
            icon="build"
            onClick={() => {
              this.storage.downloadCode();
            }}
          >
            compile and dowload project
          </Button>
        </Drawer>
        <div>
          <CreateFile
            key={Math.random()}
            isOpen={this.state.createFileDialogIsOpen}
            selected={this.state.selected}
            onClose={this.closeCreateFileDialog}
          ></CreateFile>
          <DeleteFile
            key={Math.random()}
            isOpen={this.state.deleteFileDialogIsOpen}
            selected={this.state.selected}
            selectedIsDirectory={this.state.selectedIsDirectory}
            onClose={this.closeDeleteFileDialog}
          ></DeleteFile>
          <RenameFile
            key={Math.random()}
            isOpen={this.state.renameDialogIsOpen}
            selected={this.state.selected}
            selectedIsDirectory={this.state.selectedIsDirectory}
            onClose={this.closeRenameFileDialog}
          ></RenameFile>
        </div>
      </div>
    );
  }
}

export default FullExplorer;
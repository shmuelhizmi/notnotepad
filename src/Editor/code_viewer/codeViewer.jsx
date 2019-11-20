import React, { PureComponent } from "react";
import Highlighter, { defaultProps } from "prism-react-renderer";
class CodeViewer extends Component {
  constructor(props) {
    super(props);
    this.IDkey = props.IDkey;
    state = {langusage : props.langusage,
        code = props.code
    };
  }
  render() {
    return <div></div>;
  }
}

export default CodeViewer;

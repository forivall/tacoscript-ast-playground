/*eslint no-new-func: 0*/
import Editor from './Editor';
import React from 'react';

export default class TransformOutput extends React.Component {
  static propTypes = {
    transformer: React.PropTypes.object,
    transformCode: React.PropTypes.string,
    code: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      result: '',
      error: null,
    };
  }

  componentDidMount() {
    this.props.transformer.transform(this.props).then(
      result => this.setState({result: result}),
      error => this.setState({error: error})
    );
  }

  componentWillReceiveProps(nextProps) {
    var propsChanged = false;
    for (let prop of (nextProps.transformer.transformProps: Array)) {
      if (this.props[prop] !== nextProps[prop]) {
        propsChanged = true;
        break;
      }
    }
    if (propsChanged) {
      if (console.clear) {
        console.clear();
      }
      nextProps.transformer.transform(nextProps).then(
        result => {
          let error = null;
          if (typeof result !== 'string') {
            result = '';
            error = new Error('Transform did not return a string.');
          }
          this.setState({result, error});
        },
        error => {
          console.error(error);
          this.setState({error});
        }
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.result !== nextState.result ||
      this.state.error !== nextState.error;
  }

  render() {
    return (
      <div className="output highlight">
        {this.state.error ?
          <Editor
            highlight={false}
            key="error"
            lineNumbers={false}
            readOnly={true}
            defaultValue={this.state.error.message}
          /> :
          <Editor
            highlight={false}
            key="output"
            readOnly={true}
            defaultValue={this.state.result}
          />
        }
      </div>
    );
  }
}

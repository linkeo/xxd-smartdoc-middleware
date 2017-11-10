import React from 'react';
import { Input, Form } from 'antd';

const { Item } = Form;

class ParamInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: null,
      help: null,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { value } = e.target;
    const { type, onChange, options } = this.props;
    const { isRequired } = options || {};
    let valid = true;
    if (value) {
      switch (type && type.toLowerCase()) {
        case 'int':
        case 'integer':
          valid = Number.isSafeInteger(Number(value));
          if (valid) {
            this.setState({ status: 'success', help: null });
          } else {
            this.setState({ status: 'error', help: '请提供一个整数' });
          }
          break;
        case 'number':
        case 'float':
        case 'double':
          valid = !Number.isNaN(Number(value));
          if (valid) {
            this.setState({ status: 'success', help: null });
          } else {
            this.setState({ status: 'error', help: '请提供一个数字' });
          }
          break;
        case 'json':
          try {
            JSON.parse(value);
          } catch (err) {
            valid = false;
          }
          if (valid) {
            this.setState({ status: 'success', help: null });
          } else {
            this.setState({ status: 'error', help: 'JSON格式不正确' });
          }
          break;
        default:
          this.setState({ status: 'success', help: null });
          break;
      }
    } else if (isRequired) {
      this.setState({ status: 'error', help: '这个参数为必填项' });
    } else {
      this.setState({ status: null, help: null });
    }
    if (onChange) { onChange(value, valid); }
  }

  render() {
    const { type } = this.props;
    const { status, help } = this.state;

    switch (type && type.toLowerCase()) {
      case 'int':
      case 'integer':
      case 'number':
      case 'double':
        return (
          <Item
            className="param-input"
            hasFeedback
            validateStatus={status}
            help={help}
          ><Input {...this.props} type="number" onChange={this.onChange} /></Item>
        );
      default:
        return (
          <Item
            className="param-input"
            hasFeedback
            validateStatus={status}
            help={help}
          ><Input {...this.props} type="textarea" onChange={this.onChange} autosize={{ minRows: 1, maxRows: 6 }} /></Item>
        );
    }
  }
}

ParamInput.parse = (type, value) => {
  switch (type && type.toLowerCase()) {
    case 'int':
    case 'integer': return Math.floor(Number(value));
    case 'number':
    case 'float':
    case 'double': return Number(value);
    default: return value;
  }
};

export default ParamInput;

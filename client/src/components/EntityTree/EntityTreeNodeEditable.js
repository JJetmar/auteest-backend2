import React, { Component } from 'react';
import {Select, Input, InputNumber, Checkbox, Button, Row, Col, Form} from 'antd';
import { Trans, withI18n, I18n } from '@lingui/react'
import { simpleTypes } from '../../constants/json-schema';
import EntityTreeNodeReadonly from "./EntityTreeNodeReadonly";
import { connect } from 'dva'

const { Option } = Select;

@withI18n()
@connect(({ entitySchema, loading }) => ({ entitySchema, loading }))
class EntityTreeNodeEditable extends Component {
  constructor(props) {
    super(props);
    this.noCancelableElements = {};
    this.cancelableElements = {};
    this.state = {
      inEdit: false,
      item: {
        declaration: {
          type: "string"
        },
        ...(props.item || {})
      }
    }
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  handleClick = (e) => {
    e.stopPropagation();

    const cancelableElements = Object.values(this.cancelableElements);
    for (const element of cancelableElements) {
      if(!element)
        return false;

      if (element.contains && element.contains(e.target)) {
        return false;
      }
    }

    const noCancelableElements = Object.values(this.noCancelableElements);
    const foundWrapper = noCancelableElements.find(element => {
      if(!element)
        return false;

      if (element.contains){
        return element.contains(e.target)
      }
      if (element.rcSelect && element.rcSelect.getPopupDOMNode()) {
        return element.rcSelect.getPopupDOMNode().contains(e.target);
      }
      return false
    });
    this.setState({
      inEdit: !!foundWrapper,
    });
  }

  render() {
    const { form, item, index, entitySchema, dispatch } = this.props;
    const { getFieldDecorator } = form;
    const { inEdit } = this.state;
    const isType = (types) => {
      return inEdit && types.includes(item.declaration.type);
    };

    const valueToState = (state, name) => {
      return {
        onChange: (e) => {
          debugger
          const target = e && e.target? e.target : { value: e };
          state[name] = target.type === 'checkbox' ? target.checked : target.value;

          dispatch({
            type: "updateAttribute",
            payload: this.state.item
          });
        }
      }
    };

    return (
      <div ref={node=> this.noCancelableElements.node = node}>
        {getFieldDecorator(`attributes[${index}].pseudoId`, { initialValue: item.pseudoId })(<div hidden><Input /></div>)}
        {getFieldDecorator(`attributes[${index}].parentId`, { initialValue: item.parentId })(<div hidden><Input /></div>)}
        <Row type="flex" style={{flexWrap: "nowrap"}}>
          <Col style={{width: "100%"}}>
            <Row style={{ display: (inEdit ? "inherit" : "none" )}}>
              <Col span={15}>
                {getFieldDecorator(`attributes[${index}].name`, { initialValue: item.name})(
                  <Input placeholder="Attribute name" {...valueToState(item, "name")} autoFocus={true} />
                )}
              </Col>
              <Col span={9}>
                {getFieldDecorator(`attributes[${index}].declaration.type`, { initialValue: item.declaration.type })(
                  <Select
                    style={{width: "100%", margin: "0 4px"}}
                    disabled={item.declaration.type === "object"}
                    {...valueToState(item.declaration, "type")}
                    ref={el => this.noCancelableElements.type = el}
                  >
                    {
                      Object.keys(simpleTypes).filter(typeName => {
                        if (item.declaration.type === "object") {
                          return typeName === "object";
                        }
                        return typeName !== "object";
                      }).map(type => (
                        <Option key={type} value={type}>
                          { simpleTypes[type] }
                        </Option>
                      ))
                    }
                  </Select>
                )}
              </Col>
          </Row>
          <Row style={{display: (inEdit ? "none" : "block")}}>
            <Col>
              <EntityTreeNodeReadonly item={item} />
            </Col>
          </Row>
        </Col>
        <Col style={{width: "auto", marginLeft: "8px"}}>
          <div ref={node=> this.cancelableElements.options = node}>
            <Button
              icon="close"
              size={"small"}
              onClick={() => this.props.onDelete()}/>
          </div>
        </Col>
      </Row>
      <div style={{ display: (inEdit ? "inherit" : "none" )}}>
        <Row>
          <Col span={12}>
            <Form.Item label="Required" labelCol={{span: 12}} wrapperCol={{span: 12}} style={{ marginBottom: 0 }}>
              {getFieldDecorator(`attributes[${index}].required`, { initialValue: item.required })(
                <Checkbox {...valueToState(item, "required")} defaultChecked={item.required} />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* DATA TYPE: STRING */}
        {
        <Row hidden={!isType(["string"])}>
          <Col span={24}>
            <Form.Item label="Regexp" labelCol={{span: 6}} wrapperCol={{span: 18}} style={{ marginBottom: 0 }}>
              {getFieldDecorator(`attributes[${index}].declaration.pattern`, { initialValue: item.declaration.pattern })(
                <Input defaulValue={item.declaration.pattern} {...valueToState(item.declaration, "pattern")}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        }
        {/* DATA TYPE: INTEGER or STRING */}
        {
          <Row hidden={!isType(["string"])}>
            <Col span={12}>
              <Form.Item label="Minimum" labelCol={{span: 12}} wrapperCol={{span: 12}} style={{ marginBottom: 0 }}>
                {getFieldDecorator(`attributes[${index}].declaration.minLength`, { initialValue: item.declaration.minLength})(
                  <InputNumber
                    min={isType(["string" ? 0 : null])} {...valueToState(item.declaration, "minLength")}
                    type={"number"}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Maximum" labelCol={{span: 12}} wrapperCol={{span: 12}} style={{ marginBottom: 0 }}>
                {getFieldDecorator(`attributes[${index}].declaration.maxLength`, { initialValue: item.declaration.maxLength})(
                  <InputNumber
                    min={this.state.item.declaration.minLength || 0}
                    {...valueToState(item.declaration, "maxLength")}
                    type={"number"}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        }
        {/* DATA TYPE: INTEGER or NUMBER*/}
          {
          <Row hidden={!isType(["integer", "number"])}>
          <Col span={12}>
            <Form.Item label="Minimum" labelCol={{span: 12}} wrapperCol={{span: 12}} style={{ marginBottom: 0 }}>
            {getFieldDecorator(`attributes[${index}].declaration.minimum`, { initialValue: item.declaration.minimum})(
            <InputNumber
              min={isType(["string" ? 0 : null])} {...valueToState(item.declaration, "minimum")}
              type={"number"}
              />
            )}
          </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Maximum" labelCol={{span: 12}} wrapperCol={{span: 12}} style={{ marginBottom: 0 }}>
            {getFieldDecorator(`attributes[${index}].declaration.maximum`, { initialValue: item.declaration.maximum})(
            <InputNumber
              min={this.state.item.declaration.minimum || 0}
              {...valueToState(item.declaration, "maximum")}
              type={"number"}
              />
            )}
          </Form.Item>
          </Col>
          </Row>
          }
        </div>
      </div>
    );
  };
}

export default EntityTreeNodeEditable;

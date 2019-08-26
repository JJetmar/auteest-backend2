import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, List, Typography, Button, Tooltip, Popconfirm} from 'antd'
import { Color } from 'utils'
import { Page, Editor, ScrollBar } from 'components'
import { withI18n } from '@lingui/react'
import { router } from 'utils'
import { Trans } from '@lingui/react'
import { Form, Input, Select} from 'antd';
import { Radio } from 'antd';

import styles from './index.less'
import ModalForm from "../../components/ModalForm/modal-form";

const { Title } = Typography;

const testModal = {
  CREATE: "create",
  DETAIL: "detail",
  UPDATE: "update"
};

@withI18n()
@connect(({ app, tests, loading }) => ({ tests, loading }))
class Tests extends Component {
  showModal(modalType, itemId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'tests/showModal',
      payload: {
        modalType,
        itemId
      }
    });
  }

  deleteItem(itemId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'tests/delete',
      payload: {
        id: itemId
      }
    });
  }

  runItem(itemId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'tests/run',
      payload: {
        id: itemId
      }
    });
  }

  onChangeType(e) {
    this.setState({ type: e.target.value })
  }

  render() {
    const { loading, i18n, tests, dispatch} = this.props;

    const { modalType, list, modalVisible, selectedItem, entitySchemas, pagination } = tests;

    return (
      <Page
        className={styles.tests}
      >
        <Row gutter={24}>
          <Col md={24}>
            <Page inner>
              <Row type="flex" justify="space-between">
                <Col>
                  <Title><Trans>Tests</Trans></Title>
                </Col>
                <Col>
                  <Button type="primary" icon="plus" size="large" onClick={() => this.showModal(testModal.CREATE)}> <Trans>Add Item</Trans></Button>
                </Col>
              </Row>
              <List
                itemLayout="vertical"
                size="large"
                loading={loading.models.testList}
                pagination={{
                  onChange: (page) => {
                    dispatch({
                      type: `tests/changePage`,
                      payload: {
                        page
                      }
                    })
                  },
                  pageSize: pagination.pageSize,
                  current: pagination.page,
                  total: pagination.total,
                  hideOnSinglePage: true
                }}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    extra={[
                      <Popconfirm placement="left" title={i18n.t`Are you sure, to run this test "${item.name}"`} onConfirm={() => this.runItem(item.id)} okText={i18n.t`Yes`} cancelText={i18n.t`No`} key={`${item.id}-run-button`}>
                        <Button type="success" icon="play-circle" size="small"> <Trans>Run</Trans></Button>
                      </Popconfirm>,
                      <Button type="primary" icon="edit" size="small" style={{marginLeft: "12px"}} key={`${item.id}-update-button`} onClick={() => this.showModal("update", item.id)}> <Trans>Update</Trans></Button>,
                      <Popconfirm placement="left" title={i18n.t`Do you really want to delete this item?`} onConfirm={() => this.deleteItem(item.id)} okText={i18n.t`Yes`} cancelText={i18n.t`No`} key={`${item.id}-delete-button`}>
                        <Button type="danger" icon="delete" size="small" style={{marginLeft: "12px"}}> <Trans>Delete</Trans></Button>
                      </Popconfirm>
                    ]}
                  >
                    <Tooltip placement="right" title={item.description}>
                      <a onClick={() => this.showModal("detail", item.id)}>
                        {item.name}
                      </a>
                    </Tooltip>
                  </List.Item>
                )}
              />
              {modalVisible &&
                <ModalForm
                  title={i18n.t`Tests`}
                  content={(form) => (
                    <div>
                      <Form.Item>
                        <Col style={{width: "100%"}}>
                          {form.getFieldDecorator(`name`, { initialValue: selectedItem.name})(
                            <Input name placeholder="Test name" />
                          )}
                        </Col>
                        <Col style={{width: "100%"}}>
                          {form.getFieldDecorator(`entitySchema`, { initialValue: selectedItem.entitySchema})(
                            <Select placeholder={"Select Entity schema"}
                                    showSearch={true}
                                    filterOption={(input, option) =>
                                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                              { entitySchemas.map(es => <Select.Option key={es.id}>{es.name}</Select.Option>)}
                            </Select>
                          )}
                        </Col>
                        <Col style={{width: "100%"}}>
                        {form.getFieldDecorator(`endpoint`, { initialValue: selectedItem.endpoint})(
                          <Input name placeholder="Endpoint" type={"url"}/>
                        )}
                        </Col>
                        <Col style={{width: "100%"}}>
                          {form.getFieldDecorator(`seed`, { initialValue: selectedItem.seed})(
                            <Input name placeholder="Seed"/>
                          )}
                        </Col>
                        <Col style={{width: "100%"}}>
                          <Row type="flex" justify="center">
                            <Col>
                              {form.getFieldDecorator(`type`, { initialValue: selectedItem.type})(
                                <Radio.Group onChange={this.onChangeType.bind(this)} >
                                  <Radio value={"rest"}>REST</Radio>
                                  <Radio value={"soap"}>SOAP</Radio>
                                </Radio.Group>
                              )}
                            </Col>
                          </Row>
                        </Col>
                        { selectedItem.type === "soap" || (this.state && this.state.type === "soap") ? (
                          <div>
                            {form.getFieldDecorator(`httpMethod`,  { initialValue: "POST"} )(
                              <Input type={"hidden"} />
                            )}
                            <Col>
                              {form.getFieldDecorator(`soapTemplate`, { initialValue: selectedItem.soapTheme})(
                                <Input.TextArea autosize={true}/>
                              )}
                            </Col>
                          </div>
                        ) : (
                          <Col>
                            {form.getFieldDecorator(`httpMethod`, { initialValue: selectedItem.httpMethod})(
                              <Select placeholder={"Select a HTTP method"}>
                                <Select.Option key={"POST"}>{"POST"}</Select.Option>
                                <Select.Option key={"PUT"}>{"PUT"}</Select.Option>
                                <Select.Option key={"DELETE"}>{"DELETE"}</Select.Option>
                              </Select>
                            )}
                          </Col>
                        )}
                      </Form.Item>
                    </div>
                  )}
                  onSubmit={(item) => {
                    dispatch({
                      type: `tests/${modalType}`,
                      payload: {
                        id: selectedItem ? selectedItem.id : undefined,
                        ...item
                      }
                    })
                  }}
                  onCancel={() => {
                    dispatch({
                      type: 'tests/hideModal',
                    })
                  }}
                />
              }
            </Page>
          </Col>
        </Row>
      </Page>
    )
  }
}

export default Tests;

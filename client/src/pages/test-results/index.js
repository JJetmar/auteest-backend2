import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, List, Typography, Button, Collapse, Tooltip, Popconfirm, Icon, Form } from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import { withI18n } from '@lingui/react'
import { router } from 'utils'
import { Trans } from '@lingui/react'

const { Panel } = Collapse;

import styles from './index.less'
import ModalForm from "../../components/ModalForm/modal-form";

const { Title } = Typography;

const testResultsModal = {
  CREATE: "create",
  DETAIL: "detail",
  UPDATE: "update"
};

@withI18n()
@connect(({ app, testResults, loading }) => ({ testResults, loading }))
class TestResults extends Component {
  showModal(modalType, itemId) {
    debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'testResults/showModal',
      payload: {
        modalType,
        itemId
      }
    });
  }

  deleteItem(itemId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'testResults/delete',
      payload: {
        id: itemId
      }
    });
  }

  render() {
    const { loading, i18n, testResults, dispatch} = this.props;

    const { modalType, list, modalVisible, selectedItem, pagination } = testResults;

    const validPanelStyle = {
      background: '#97e28d',
      overflow: 'hidden'
    };

    const invalidPanelStyle = {
      background: '#ff7979',
      overflow: 'hidden'
    };

    return (
      <Page
        className={styles.testResults}
      >
        <Row gutter={24}>
          <Col md={24}>
            <Page inner>
              <Row type="flex" justify="space-between">
                <Col>
                  <Title><Trans>Test Results</Trans></Title>
                </Col>
              </Row>
              <List
                itemLayout="vertical"
                size="large"
                loading={loading.models.testResultsList}
                pagination={{
                  onChange: (page) => {
                    dispatch({
                      type: `testResults/changePage`,
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
                      <Popconfirm placement="left" title={i18n.t`Do you really want to delete this item?`} onConfirm={() => this.deleteItem(item.id)} okText={i18n.t`Yes`} cancelText={i18n.t`No`} key={`${item.id}-delete-button`}>
                        <Button type="danger" icon="delete" size="small" style={{marginLeft: "12px"}}> <Trans>Delete</Trans></Button>
                      </Popconfirm>
                    ]}
                  >
                    <Tooltip placement="right" title={item.description}>
                      <a onClick={() => this.showModal("detail", item.id)}>
                        {item.testName} ({new Date(item.start).toLocaleDateString()} - {new Date(item.start).toLocaleTimeString()})
                      </a>
                    </Tooltip>
                  </List.Item>
                )}
              />
              {modalVisible &&
                <ModalForm
                  title={i18n.t`Test results`}
                  //title={ "entities.updateEntitySchema"}
                  confirmLoading={loading.effects[`testResults/${modalType}`]}
                  width={"80%"}
                  content={(form) =>
                    <Collapse>
                      {
                        selectedItem.results.map(result =>
                          <Panel
                            header={`${result.variation.join("-")} (${result.duration/1000}s)`}
                            extra={
                              result.valid ? <Icon type="check-circle" theme="twoTone" twoToneColor="green"/>
                                : <Icon type="exclamation-circle" theme="twoTone" twoToneColor="red"/>
                            }
                            style={result.valid ? validPanelStyle : invalidPanelStyle }
                          >
                            <Row>
                              <Col span={12}>
                                <Title level={4}><Trans>Request</Trans></Title>
                                <pre>
                                  {JSON.stringify(result.request, null, 2)}
                                </pre>
                              </Col>
                              <Col span={12}>
                                <Title level={4}><Trans>Response</Trans></Title>
                                <pre>
                                  {JSON.stringify(result.response, null, 2)}
                                </pre>
                              </Col>
                            </Row>
                          </Panel>
                        )
                      }
                    </Collapse>
                  }
                  onSubmit={(item) => {
                    console.log(item);
                    dispatch({
                      type: `testResults/${modalType}`,
                      payload: {
                        id: selectedItem ? selectedItem.id : undefined,
                        ...item
                      }
                    })
                  }}
                  onCancel={() => {
                    dispatch({
                      type: 'testResults/hideModal',
                    })}
                  }
                />
              }
            </Page>
          </Col>
        </Row>
      </Page>
    )
  }
}

export default TestResults;

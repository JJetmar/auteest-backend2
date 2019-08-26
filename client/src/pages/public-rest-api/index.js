import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, List, Typography, Button, Modal, Tooltip, Card, Popconfirm, Form } from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import { withI18n } from '@lingui/react'
import { router } from 'utils'
import { Trans } from '@lingui/react'

import styles from './index.less'
import ModalForm from "../../components/ModalForm/modal-form";

const { Title } = Typography;

const entitySchemaModal = {
  CREATE: "create",
  DETAIL: "detail",
  UPDATE: "update"
};

@withI18n()
@connect(({ app, entitySchema, loading }) => ({ entitySchema, loading }))
class PublicRestApi extends Component {
  showModal(modalType, itemId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'entitySchema/showModal',
      payload: {
        modalType,
        itemId
      }
    });
  }

  deleteItem(itemId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'entitySchema/delete',
      payload: {
        id: itemId
      }
    });
  }

  render() {
    const { loading, i18n, entitySchema, dispatch} = this.props;

    const { modalType, list, modalVisible, selectedItem, pagination } = entitySchema;

    return (
      <Page
        className={styles.entitySchema}
      >
        <Row gutter={24}>
          <Col md={24}>
            <Page inner>
              <Row type="flex" justify="space-between">
                <Col>
                  <Title><Trans>Entity schemas</Trans></Title>
                </Col>
                <Col>
                  <Button type="primary" icon="plus" size="large" onClick={() => this.showModal(entitySchemaModal.CREATE)}> <Trans>Add item</Trans></Button>
                </Col>
              </Row>
              <List
                itemLayout="vertical"
                size="large"
                loading={loading.models.entitySchemaList}
                pagination={{
                  onChange: (page) => {
                    dispatch({
                      type: `entitySchema/changePage`,
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
                title={i18n.t`Public Rest API`}
                width={"70%"}
                confirmLoading={loading.effects[`entitySchema/${modalType}`]}
                content={(form) => <div>
                  <Card title={"GET"}>
                    <p>{`http://localhost:3000/public-api/${selectedItem.name}/xxxxxxxxx`}</p>
                  </Card>

                  <Card title={"POST"}>
                    <p>{`http://localhost:3000/public-api/${selectedItem.name}`}</p>
                  </Card>

                  <Card title={"PUT"}>
                    <p>{`http://localhost:3000/public-api/${selectedItem.name}//xxxxxxxxx`}</p>
                  </Card>

                  <Card title={"DELETE"}>
                    <p>{`http://localhost:3000/public-api/${selectedItem.name}//xxxxxxxxx`}</p>
                  </Card>
                </div>

                }
                onSubmit={(item) => {
                  dispatch({
                    type: 'entitySchema/hideModal',
                  })}
                }
                onCancel={() => {
                  dispatch({
                    type: 'entitySchema/hideModal',
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

export default PublicRestApi;

import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, List, Typography, Button, Modal, Tooltip, Popconfirm, Form } from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import { withI18n } from '@lingui/react'
import { router } from 'utils'

import styles from './index.less'
import EntityTree from "../../components/EntityTree/EntityTree";
import ModalForm from "../../components/ModalForm/modal-form";

const { Title } = Typography;

const entitySchemaModal = {
  CREATE: "create",
  DETAIL: "detail",
  UPDATE: "update"
};

@withI18n()
@connect(({ app, entitySchema, loading }) => ({ entitySchema, loading }))
class Entities extends Component {
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
                  <Title>Entity schemas</Title>
                </Col>
                <Col>
                  <Button type="primary" icon="plus" size="large" onClick={() => this.showModal(entitySchemaModal.CREATE)}>Create new</Button>
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
                    extra={[
                      <Button type="primary" icon="edit" size="small" key={`${item.id}-update-button`} onClick={() => this.showModal("update", item.id)}>Update</Button>,
                      <Popconfirm placement="left" title={i18n.t`Do you really want to delete this item?`} onConfirm={() => this.deleteItem(item.id)} okText={i18n.t`Yes`} cancelText={i18n.t`No`} key={`${item.id}-delete-button`}>
                        <Button type="danger" icon="delete" size="small" style={{marginLeft: "12px"}}>Delete</Button>
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
                  title={<h2>{modalType} entity schema</h2>}
                  confirmLoading={loading.effects[`entitySchema/${modalType}`]}
                  content={(form) =>
                    <EntityTree
                      tree={selectedItem}
                      editable={[entitySchemaModal.CREATE, entitySchemaModal.UPDATE].includes(modalType)}
                      form={form}
                    />
                  }
                  onSubmit={(item) => {
                    dispatch({
                      type: `entitySchema/${modalType}`,
                      payload: {
                        id: selectedItem ? selectedItem.id : undefined,
                        ...item
                      }
                    })
                  }}
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

export default Entities;

import React from 'react';
import { Modal, Form } from 'antd';

const ModalForm = Form.create()(
  class extends React.Component {
    submit() {
      const { onSubmit, form } = this.props;

      if (onSubmit) {
        form.validateFields((error, value) => {
          onSubmit(value);
        });
      }
    }

    render() {
      const { onCancel, form, okText, title, confirmLoading, content, width } = this.props;
      return (
        <Modal
          title={title}
          okText={okText}
          onCancel={onCancel}
          confirmLoading={confirmLoading}
          onOk={ () => this.submit() }
          visible={!!content}
          width={width}
        >
          <Form onSubmit={() => this.submit()}>
            { (content(form)) }
          </Form>
        </Modal>
      );
    }
  }
);

export default ModalForm;

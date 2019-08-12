import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

import { Button} from 'antd';
import { Trans } from '@lingui/react'

class EntityTreeNodeAdd extends PureComponent {
  render() {
    return (
      <Button icon="add" onClick={this.props.onClick} size="small" style={{opacity:0.5}}>
        <Trans>entities.addAttribute</Trans>
      </Button>
    );
  }
};


export default EntityTreeNodeAdd;

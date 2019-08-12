import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n} from '@lingui/react'
import { simpleTypes } from '../../constants/json-schema';

@withI18n()
class EntityTreeNodeReadonly extends Component {
  render() {
    return (
      <div>
        { this.props.item.name }&nbsp;
        &lt;{ simpleTypes[this.props.item.declaration.type] }&gt;
        {this.props.item.required?`:`:""}{this.props.item.required?(<Trans>Required</Trans>):""}
      </div>
    );
  };
}

export default EntityTreeNodeReadonly;

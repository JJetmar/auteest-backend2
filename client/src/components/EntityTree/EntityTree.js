import React, { Component } from "react";
import PropTypes from 'prop-types';
import {Divider, Input, Tree} from "antd";
import EntityTreeNodeEditable from "./EntityTreeNodeEditable";
import EntityTreeNodeAdd from "./EntityTreeNodeAdd";
import styles from "./EntityTree.less";
import { Trans, withI18n } from '@lingui/react';
import EntityTreeNodeReadonly from "./EntityTreeNodeReadonly";
const uuidv1 = require('uuid/v1');
import { connect } from 'dva'

const { TreeNode } = Tree;

@withI18n()
@connect(({ entitySchema }) => ({ entitySchema }))
class EntityTree extends Component {
  propTypes = {
    tree: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.noCancelableElements = {};

    const { tree } = props;
    this.state = {
      tree: {
        attributes: [],
        ...tree
      },
      selectedNode: null,
      newAttribute: 1
    };
  }

  onDragEnter(info) {
  }

  onDrop = (info) => {
    if (info.node.isDisabled()) {
      return;
    }
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const attributes = this.state.tree.attributes;

    const dragAttribute = attributes.find(attribute => (attribute.id || attribute.pseudoId) === dragKey);
    const dropAttribute = attributes.find(attribute => (attribute.id || attribute.pseudoId) === dropKey);

    let dropIndex = attributes.indexOf(dropAttribute);
    let dragIndex = attributes.indexOf(dragAttribute);

    const lastParent = attributes.find(attribute => (attribute.id || attribute.pseudoId) === (dragAttribute.parentId));
    dragAttribute.parentId = info.dropToGap ? dropAttribute.parentId : dropAttribute.id || dropAttribute.pseudoId;

    const levelAttributes = attributes.filter(attribute => attribute.parentId === dragAttribute.parentId);
    const dropToGapAfter = info.dropToGap && info.dropPosition + 1 > levelAttributes.indexOf(dropAttribute);
    const dropAfter = dropIndex > dragIndex;

    attributes.splice(dragIndex, 1);

    if (info.dropToGap) {
      attributes.splice(dropIndex + (dropAfter ? -1 : 0) + (dropToGapAfter ? 1 : 0), 0, dragAttribute);
    } else {
      attributes.push(dragAttribute);
      if (lastParent) {
        lastParent.declaration.typek = "string";
      }
      dropAttribute.declaration.type = "object"
    }

    this.setState({tree: this.state.tree});

    const { dispatch } = this.props;
      dispatch({
      type: 'entitySchema/changeTree',
      payload: this.state.tree
    });

  }

  addChildren(parentId) {
    debugger
    this.setState(state => {
      state.tree.attributes.push({
        name: `NewParameter${this.state.newAttribute}`, parentId, pseudoId: uuidv1(), declaration: {
          type: "string"
        }
      });
      state.newAttribute++;
      return state;
    });
  }

  deleteChildren(attributeToDelete) {
    const childrenAttributes = this.props.tree.attributes.filter(
      attr => attr.parentId === (attributeToDelete.id || attributeToDelete.pseudoId)
    );

    let deleteConfirmed = false;
    if (childrenAttributes.length > 0) {
      deleteConfirmed = confirm("Really?");
    }
    let newTree = this.props.tree;
    if( childrenAttributes.length === 0 || deleteConfirmed) {
      newTree.attributes = newTree.attributes.filter(
        attr => (attr.id || attr.pseudoId) !== (attributeToDelete.id || attributeToDelete.pseudoId)
      );
    }

    //this.setState({tree: this.state.tree});
    const { dispatch } = this.props;
    dispatch({
      type: 'entitySchema/changeTree',
      payload: {
        selectedItem: newTree
      }
    });
    this.forceUpdate()
  }

  renderEntityTreeNode(attributes = [], attributeCounter, parentId = null) {
    const nodes = [];

    // Children
    for (const attribute of attributes.filter(attribute => attribute.parentId == parentId)) {
      let entityTreeNode;
      if (this.props.editable) {
        entityTreeNode = <EntityTreeNodeEditable item={attribute} onDelete={() => this.deleteChildren(attribute)} form={this.props.form} index={attributeCounter.counter++}/>;
      } else {
        entityTreeNode = <EntityTreeNodeReadonly item={attribute} />;
      }

      const children = attributes.filter(subAttribute => subAttribute.parentId === attribute.id || attribute.pseudoId);

      nodes.push((
        <TreeNode key={ attribute.id || attribute.pseudoId } title={entityTreeNode} disabled={!this.props.editable}>
          {children.length && this.renderEntityTreeNode(attributes, attributeCounter, attribute.id || attribute.pseudoId )}
        </TreeNode>
      ));
    }

    if (this.props.editable && (nodes.length > 0 || !parentId)) {
      const add = (<Divider className={"add-button"}>
        <EntityTreeNodeAdd onClick={() => { this.addChildren(parentId)}} />
      </Divider>);
      nodes.push(<TreeNode key={ `${parentId}-add` } title={add} disabled={true} />);
    }
    return nodes;
  };

  render() {
    let name = "New Entity";
    const attributeCounter = { counter: 0 };
    const { form, editable } = this.props;
    const tree = this.props.tree;
    const { getFieldDecorator } = form;

    return (
      <div>
        { tree.id && getFieldDecorator('id', { initialValue: tree.id })(<div hidden><Input /></div>)}
        { !editable ? <h2>{tree.name}</h2> :
           getFieldDecorator(`name`, { initialValue: tree.name }) (
            <Input size="large" placeholder="Entity name" />
          )
        }
        <Tree
          defaultExpandAll={true}
          draggable
          blockNode
          onDragEnter={this.onDragEnter}
          autoExpandParent={false}
          onDrop={this.onDrop}
          className={styles.entityTree}
        >
          {this.renderEntityTreeNode(tree.attributes, attributeCounter)}
        </Tree>
      </div>
    );
  }
}

export default EntityTree;

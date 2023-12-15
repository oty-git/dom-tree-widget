import React, {useState} from 'react';
import './DomWidget.scss';
import {v4 as uuidv4} from 'uuid';

const DomWidget = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);

  const handleParseDom = () => {
    if (nodes.length > 0) {
      setNodes([]);
      setSelectedNode(null);
      return;
    }

    const semanticTags = Array.from(
      document.querySelectorAll(
        'header, footer, nav, aside, main, article, section'
      )
    );

    setNodes(semanticTags);
  };

  const handleNodeClick = (node) => {
    if (selectedNode && selectedNode !== node) {
      selectedNode.style.border = 'none';
      selectedNode.style.color = 'initial';
    }

    node.style.border = '2px solid red';
    node.scrollIntoView({behavior: 'smooth'});

    setSelectedNode(node);
  };

  const renderNode = (node, renderedNodes, isChildNode = false) => {
    const keyId = `${node.tagName.toLowerCase()}_${node.textContent}`;

    if (renderedNodes.has(keyId)) {
      // Node is already rendered, treat it as a leaf node
      return null;
    }

    renderedNodes.add(keyId);

    return (
      <div key={keyId}>
        <p
          className={`dom-tree-element ${
            isChildNode ? 'dom-tree-element_child' : ''
          }`}
          style={{color: node === selectedNode ? 'red' : 'initial'}}
          onClick={() => handleNodeClick(node)}
        >
          {node.tagName.toLowerCase()}
        </p>
        {Array.from(node.children).map((childNode, childIndex) =>
          renderNode(childNode, renderedNodes, true)
        )}
      </div>
    );
  };

  const renderTree = () => {
    const renderedNodes = new Set();
    return nodes.map((node) => renderNode(node, renderedNodes));
  };

  return (
    <div className="dom-widget-container">
      <div>
        <button onClick={handleParseDom}>
          {nodes.length > 0 ? 'Hide DOM Tree' : 'Show DOM Tee'}
        </button>
      </div>
      {nodes.length > 0 && (
        <div className="dom-tree-container">
          <div className="dom-tree">{renderTree()}</div>
        </div>
      )}
      {selectedNode && (
        <div className="selected-node">
          Selected Node: {selectedNode.tagName.toLowerCase()}
        </div>
      )}
    </div>
  );
};

export default DomWidget;

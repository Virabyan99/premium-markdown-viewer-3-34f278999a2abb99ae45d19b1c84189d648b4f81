'use client';

import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';
import React from 'react';

export class HighlightedCodeNode extends DecoratorNode<React.ReactNode> {
  __html: string;

  static getType(): string {
    return 'highlighted-code';
  }

  static clone(node: HighlightedCodeNode): HighlightedCodeNode {
    return new HighlightedCodeNode(node.__html, node.__key);
  }

  constructor(html: string, key?: NodeKey) {
    super(key);
    this.__html = html;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'not-prose';
    return div;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): React.ReactNode {
    return <div className="not-prose" dangerouslySetInnerHTML={{ __html: this.__html }} />;
  }

  static importJSON(serializedNode: any): HighlightedCodeNode {
    return new HighlightedCodeNode(serializedNode.html);
  }

  exportJSON(): any {
    return {
      type: 'highlighted-code',
      html: this.__html,
      version: 1,
    };
  }
}

export function $createHighlightedCodeNode(html: string): HighlightedCodeNode {
  return new HighlightedCodeNode(html);
}

export function $isHighlightedCodeNode(node: LexicalNode | null | undefined): node is HighlightedCodeNode {
  return node instanceof HighlightedCodeNode;
}
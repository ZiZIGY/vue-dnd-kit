import type { IDragElement, IDraggingElement } from '@vue-dnd-kit/core';
import { CSSProperties, HTMLAttributes } from 'vue';

export interface IHTMLBuilderElement<T = keyof HTMLElementTagNameMap> {
  id: string;
  tag: T;
  style?: CSSProperties;
  children?: IHTMLBuilderElement<T>[];
  attributes?: Omit<HTMLAttributes, 'style'>;
  visible?: boolean;
  isExpanded?: boolean;
}

export interface IHTMLBuilderDraggable extends Omit<IHTMLBuilderElement, 'id'> {
  type: 'created';
}

export interface IHTMLBuilderProvider {
  activeElement: Ref<IHTMLBuilderElement | null>;
}

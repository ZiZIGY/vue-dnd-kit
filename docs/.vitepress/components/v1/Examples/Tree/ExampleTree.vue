<script setup lang="ts">
  import {
    Tree,
    TreeItem,
    TreeArrow,
    TreeDragHandle,
  } from '@vue-dnd-kit/components/src/templates/Tree';
  import { ref } from 'vue';

  interface ITreeNode {
    id: number;
    name: string;
    type: 'folder' | 'file';
    children?: ITreeNode[];
    expanded?: boolean;
  }

  const treeData = ref<ITreeNode[]>([
    {
      id: 1,
      name: 'Documents',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: 2,
          name: 'Work',
          type: 'folder',
          expanded: true,
          children: [
            { id: 3, name: 'Project A', type: 'folder' },
            { id: 4, name: 'Project B', type: 'folder' },
            { id: 5, name: 'report.pdf', type: 'file' },
          ],
        },
        {
          id: 6,
          name: 'Personal',
          type: 'folder',
          children: [
            { id: 7, name: 'Photos', type: 'folder' },
            { id: 8, name: 'Videos', type: 'folder' },
            { id: 9, name: 'notes.txt', type: 'file' },
          ],
        },
        { id: 10, name: 'presentation.pptx', type: 'file' },
      ],
    },
    {
      id: 11,
      name: 'Downloads',
      type: 'folder',
      children: [
        { id: 12, name: 'setup.exe', type: 'file' },
        { id: 13, name: 'document.docx', type: 'file' },
      ],
    },
    {
      id: 14,
      name: 'Pictures',
      type: 'folder',
      children: [
        { id: 15, name: 'Screenshots', type: 'folder' },
        { id: 16, name: 'Wallpapers', type: 'folder' },
      ],
    },
  ]);
</script>

<template>
  <div class="tree-container">
    <Tree
      :data="treeData"
      item-key="id"
      nesting-key="children"
      v-slot="{ item }"
    >
      <div class="tree-node">
        <div class="node-content">
          <div
            class="node-icon"
            :class="item.type"
          >
            <span v-if="item.type === 'folder'">📁</span>
            <span v-else>📄</span>
          </div>

          <span class="node-name">{{ item.name }}</span>
        </div>
      </div>
    </Tree>
  </div>
</template>

<style>
  .tree-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tree-node {
    margin-bottom: 4px;
  }

  .node-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    user-select: none;
  }

  .node-content:hover {
    background: #f8f9fa;
  }

  .node-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .node-name {
    flex: 1;
    font-size: 14px;
    color: #1a1a1a;
  }

  .drag-handle {
    opacity: 0;
    cursor: grab;
    color: #6c757d;
    font-size: 12px;
    transition: opacity 0.2s ease;
  }

  .node-content:hover .drag-handle {
    opacity: 1;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  /* Indentation for nested items */
  .tree-node .tree-node {
    margin-left: 20px;
  }

  .tree-node .tree-node .tree-node {
    margin-left: 20px;
  }
</style>

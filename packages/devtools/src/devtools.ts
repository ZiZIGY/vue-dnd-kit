import { App, DevtoolsPluginApi, setupDevtoolsPlugin } from '@vue/devtools-api';

import { createContainer } from './utils/container';
import { createElements } from './utils/elements';
import { createHovered } from './utils/hovered';
import { createPointer } from './utils/pointer';
import { createStore } from './utils/store';
import { createZones } from './utils/zones';
import { useDnDStore } from '@vue-dnd-kit/core';
import { watch } from 'vue';

const stateType = 'DnD Kit State';
const inspectorId = 'dnd-kit-inspector';

export function setupDevtools(app: App) {
  setupDevtoolsPlugin(
    {
      id: 'vue-dnd-kit-devtools',
      label: 'Vue DnD Kit',
      packageName: '@vue-dnd-kit/devtools',
      homepage: 'https://github.com/zizigy/vue-dnd-kit',
      componentStateTypes: [stateType],
      icon: 'https://raw.githubusercontent.com/zizigy/vue-dnd-kit/main/public/logo.svg',
      app,
    } as any,
    (api: DevtoolsPluginApi<any>) => {
      const store: ReturnType<typeof useDnDStore> = app.__VUE_DND_KIT_STORE__;

      api.addInspector({
        id: inspectorId,
        label: 'DnD Kit',
        icon: 'drag_indicator',
      });

      api.on.getInspectorTree((payload) => {
        if (payload.inspectorId === inspectorId) {
          payload.rootNodes = [
            {
              id: 'root',
              label: 'DnD Store',
              children: [
                {
                  id: 'pointer',
                  label: 'Pointer',
                },
                {
                  id: 'elements',
                  label: 'Elements',
                },
                {
                  id: 'zones',
                  label: 'Zones',
                },
                {
                  id: 'container',
                  label: 'Container',
                },
                {
                  id: 'hovered',
                  label: 'Hovered',
                },
              ],
            },
          ];
        }
      });

      api.on.getInspectorState((payload) => {
        if (payload.inspectorId === inspectorId && payload.nodeId === 'root') {
          payload.state = createStore(store);
        }
        if (
          payload.inspectorId === inspectorId &&
          payload.nodeId === 'pointer'
        ) {
          payload.state = createPointer(store);
        }
        if (
          payload.inspectorId === inspectorId &&
          payload.nodeId === 'elements'
        ) {
          payload.state = createElements(store);
        }
        if (payload.inspectorId === inspectorId && payload.nodeId === 'zones') {
          payload.state = createZones(store);
        }
        if (
          payload.inspectorId === inspectorId &&
          payload.nodeId === 'container'
        ) {
          payload.state = createContainer(store);
        }
        if (
          payload.inspectorId === inspectorId &&
          payload.nodeId === 'hovered'
        ) {
          payload.state = createHovered(store);
        }
      });

      watch(
        () => store,
        () => api.sendInspectorState(inspectorId),
        { deep: true }
      );

      // api.addTimelineLayer({
      //   id: timelineLayerId,
      //   color: 0x41b86a,
      //   label: 'DnD Kit Events',
      // });

      // const devtools = {
      //   trackStart: (label: string) => {
      //     const groupId = 'track' + trackId++;

      //     api.addTimelineEvent({
      //       layerId: timelineLayerId,
      //       event: {
      //         time: Date.now(),
      //         data: { label },
      //         title: label,
      //         groupId,
      //       },
      //     });

      //     return () => {
      //       api.addTimelineEvent({
      //         layerId: timelineLayerId,
      //         event: {
      //           time: Date.now(),
      //           data: { label, done: true },
      //           title: label,
      //           groupId,
      //         },
      //       });
      //     };
      //   },
      // };

      // return devtools;
    }
  );
}

export default setupDevtools;

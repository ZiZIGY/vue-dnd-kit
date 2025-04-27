import { App, DevtoolsPluginApi, setupDevtoolsPlugin } from '@vue/devtools-api';

import { createElements } from './utils/elements';
import { createPointer } from './utils/pointer';
import { createStore } from './utils/store';
import { createZones } from './utils/zones';
import { useDnDStore } from '@vue-dnd-kit/core';
import { watch } from 'vue';

const stateType = 'DnD Kit State';
const inspectorId = 'dnd-kit-inspector';
const timelineLayerId = 'dnd-kit-timeline';

export function setupDevtools(app: App) {
  let trackId = 0;

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
      api.addInspector({
        id: inspectorId,
        label: 'DnD Kit',
        icon: 'drag_indicator',
        actions: [
          {
            icon: 'drag_indicator',
            tooltip: 'Elements',
            action: () => {
              console.log(app);
            },
          },
        ],
      });

      const store: ReturnType<typeof useDnDStore> = app.__VUE_DND_KIT_STORE__;

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
                  children: [],
                },
                {
                  id: 'elements',
                  label: 'Elements',
                },
                {
                  id: 'zones',
                  label: 'Zones',
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
      });

      watch(
        () => store,
        () => api.sendInspectorState(inspectorId),
        { deep: true }
      );

      api.addTimelineLayer({
        id: timelineLayerId,
        color: 0x41b86a,
        label: 'DnD Kit Events',
      });

      const devtools = {
        trackStart: (label: string) => {
          const groupId = 'track' + trackId++;

          api.addTimelineEvent({
            layerId: timelineLayerId,
            event: {
              time: Date.now(),
              data: { label },
              title: label,
              groupId,
            },
          });

          return () => {
            api.addTimelineEvent({
              layerId: timelineLayerId,
              event: {
                time: Date.now(),
                data: { label, done: true },
                title: label,
                groupId,
              },
            });
          };
        },
      };

      console.log('Vue DnD Kit DevTools успешно инициализированы');

      return devtools;
    }
  );
}

export default setupDevtools;

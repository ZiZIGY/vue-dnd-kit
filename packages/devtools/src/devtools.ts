import { App, DevtoolsPluginApi, setupDevtoolsPlugin } from '@vue/devtools-api';

const stateType = 'DnD Kit State';
const inspectorId = 'dnd-kit-inspector';
const timelineLayerId = 'dnd-kit-timeline';

export function setupDevtools(app: App) {
  let trackId = 0;

  // Используем тип any для descriptor и api, чтобы избежать ошибок рекурсии типов
  setupDevtoolsPlugin(
    {
      id: 'vue-dnd-kit-devtools',
      label: 'Vue DnD Kit',
      packageName: 'vue-dnd-kit',
      homepage: 'https://github.com/zizigy/vue-dnd-kit',
      componentStateTypes: [stateType],
      icon: 'https://raw.githubusercontent.com/zizigy/vue-dnd-kit/main/public/logo.svg',
      app,
    } as any,
    (api: DevtoolsPluginApi<any>) => {
      // Создаем инспектор
      api.addInspector({
        id: inspectorId,
        label: 'DnD Kit',
        icon: 'drag_indicator',
      });

      // Добавляем дерево для инспектора
      api.on.getInspectorTree((payload: any) => {
        if (payload.inspectorId === inspectorId) {
          payload.rootNodes = [
            {
              id: 'root',
              label: 'DnD Kit',
            },
          ];
        }
      });

      // Добавляем информацию о состоянии
      api.on.getInspectorState((payload: any) => {
        if (payload.inspectorId === inspectorId && payload.nodeId === 'root') {
          payload.state = {
            Информация: [
              {
                key: 'Статус',
                value: 'Работает',
              },
            ],
          };
        }
      });

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

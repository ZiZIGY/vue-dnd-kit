/**
 * `import '@vue-dnd-kit/devtools/auto'`: sets the plugin up for every app a
 * `DnDProvider` renders in, without `app.use()`. Import it before the apps mount (first
 * in the entry file). Production builds drop it.
 */

import { autoSetupDnDDevtools } from './index';

autoSetupDnDDevtools();

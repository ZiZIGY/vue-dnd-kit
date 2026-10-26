/**
 * `import '@vue-dnd-kit/devtools/auto'`: makes the page report to the devtools tab without
 * `app.use()`. Import it before the apps mount (first in the entry file). Production
 * builds drop it.
 */

import { autoSetupDnDDevtools } from './index';

autoSetupDnDDevtools();

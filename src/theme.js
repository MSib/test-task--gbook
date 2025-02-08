import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

export const CustomAura = definePreset(Aura, {
  css: () => `
  .p-panel .p-panel-header {
    display: none;
    padding-bottom: 0;
  }
  .p-panel .p-panel-content {
    padding-top: 1.125rem;
  }
`,
})

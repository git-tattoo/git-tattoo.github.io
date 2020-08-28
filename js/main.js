import { grid_init } from './grid.js'
import { layout_init } from './layout.js'
import { presets_init } from './presets.js'
import { stripe_init } from './stripe.js'

function main() {
  grid_init();
  layout_init();
  presets_init();
  stripe_init();
}

main();

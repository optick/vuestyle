/**
 * @jest-environment node
 */
import { readFileSync } from 'fs'
import { join } from 'path'

import Vue from 'vue/dist/vue'
import { createRenderer } from 'vue-server-renderer'

import VueStyletronServer from '../server'
import HelloMessage from './fixtures/HelloMessage.vue'

// Create a renderer instance with the test template.
const template = readFileSync(join(__dirname, './fixtures/index.html'), 'utf-8')
const renderer = createRenderer({ template })

const vueStyletron = new VueStyletronServer()

Vue.use(vueStyletron)

test('server generates styles and classes', async () => {
  try {
    // Create and mount the app with styletron as an option.
    const app = new Vue({ render: h => h(HelloMessage) })

    // Generate the page HTML from the renderer and stylesheet HTML.
    let html = await renderer.renderToString(app)

    // Insert the generated stylesheet into the HTML string.
    html = vueStyletron.insertStyles(html)

    // Epect the generated HTML to have generated styles and classes.
    expect(html).toMatchSnapshot()
  } catch (err) {
    fail(err)
  }
})

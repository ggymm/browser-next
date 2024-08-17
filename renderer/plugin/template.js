import fs from 'fs'
import path from 'path'

const resolve = (p) => path.resolve(process.cwd(), p)
const relative = (p) => path.relative(process.cwd(), p)

const getHtmlContent = async (payload) => {
  const { path, entry, title } = payload

  try {
    let html = fs.readFileSync(path, { encoding: 'utf8' })
    if (html && entry) {
      html = html.replace(`#TITLE#`, title)
      html = html.replace(`</body>`, `<script type="module" src="/${entry}"></script>\n</body>`)
      return html
    }
  } catch (e) {
    console.error(e)
  }
}

export const virtualHtmlTemplatePlugin = (options) => {
  return {
    name: 'vite-plugin-virtual-html-template',
    load(id) {
      if (path.extname(id) === '.html') {
        const rel = relative(id)
        const name = path.join(path.dirname(rel), path.basename(rel, '.html'))

        const page = options['pages'][name]
        if (page) {
          return getHtmlContent({
            data: options.data,
            path: resolve(page['template'] || 'public/index.html'),
            entry: page.entry || 'main',
            title: page.title || 'Index'
          })
        }
      }

      return null
    },
    resolveId(id) {
      if (path.extname(id) === '.html') {
        const rel = relative(id)
        const name = path.join(path.dirname(rel), path.basename(rel, '.html'))

        const page = options['pages'][name]
        if (page) {
          return id
        }
      }
      return null
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req['_parsedUrl']['pathname']

        let name
        if (url === '/') {
          name = 'index'
        } else {
          name = path.join(path.dirname(url), path.basename(url, '.html')).slice(1)
        }

        const page = options['pages'][name]
        if (!page) {
          return next()
        }

        res.end(
          await getHtmlContent({
            data: options.data,
            path: resolve(page['template'] || 'public/index.html'),
            entry: page.entry || 'main',
            title: page.title || 'Index'
          })
        )
      })
    }
  }
}

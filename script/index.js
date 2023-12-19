const next = require('next')
const Koa = require('koa')
const Router = require('@koa/router')

const app = next({ dev: true })
const handle = app.getRequestHandler()
const port = 3000
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.all('(.*)', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
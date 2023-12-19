import path from 'path'
import fs from 'fs'

export function GET(request) {
  console.log('🚀 ~ request:', request)
  const filePath = path.resolve('./public/test.html')
  const tpl = fs.readFileSync(filePath, 'utf8')
  const resp = new Response(tpl, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })

  return resp
}
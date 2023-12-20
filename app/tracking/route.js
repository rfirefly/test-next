import path from 'path'
import fs from 'fs'
import { NextResponse } from 'next/server'

export function GET(request) {
  // console.log('🚀 ~ request:', request)
  // const filePath = path.resolve('./public/test.html')
  // const tpl = fs.readFileSync(filePath, 'utf8')
  // const resp = new NextResponse(tpl, {
  //   headers: {
  //     'content-type': 'application/liquid;charset=UTF-8',
  //   },
  // })


  // return resp

  return NextResponse.json({ name: 'test', age: 18 })
}
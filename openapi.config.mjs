import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/request'",
  schemaPath: 'http://127.0.0.1:8000/api/v1/openapi.json',
  serversPath: './src',
})

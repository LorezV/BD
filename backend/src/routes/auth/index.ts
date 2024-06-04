import { FastifyInstance } from 'fastify'

import login from './login'
import refresh from './refresh'
import register from './register'

export default async function init(instance: FastifyInstance) {
  await instance.register(login, { prefix: '/login' })
  await instance.register(refresh, { prefix: '/refresh' })
  await instance.register(register, { prefix: '/register' })
}

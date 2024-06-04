import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyCors from '@fastify/cors'
import prisma from './prisma'

import routes from './routes'
import { getSwaggerOptions, swaggerUiOptions } from './utils'

async function main() {
  await prisma.$connect()

  const app = fastify({
    trustProxy: true,
    ignoreTrailingSlash: true,
    ajv: {
      customOptions: {
        strict: true,
      },
    },
    serializerOpts: {
      ajv: {
        strict: true,
      },
    },
  })

  await app.register(fastifyCors, {
    origin: '*',
  })
  await app.register(fastifySwagger, getSwaggerOptions())
  await app.register(fastifySwaggerUi, swaggerUiOptions)
  app.register(routes, { prefix: '/api' })

  app.listen({ port: 3000, host: '0.0.0.0' }, (error: unknown, address: string) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    console.log({ routing: app.printRoutes() }, `Server listening on ${address}`)
  })
}

main().catch((error) => {
  console.error({ error }, 'ERROR_INIT_APP')
  process.exit(1)
})

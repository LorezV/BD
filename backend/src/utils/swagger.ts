import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'

export function getSwaggerOptions(): FastifyDynamicSwaggerOptions {
  return {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'PRODACSTS',
        description: `API for PRODACSTS`,
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Localhost server',
        },
      ],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  }
}

export const swaggerUiOptions = {
  routePrefix: '/swagger',
  uiConfig: {
    validatorUrl: null,
  },
}

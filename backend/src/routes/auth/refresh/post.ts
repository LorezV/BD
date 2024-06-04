import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { Token } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateToken, verifyToken } from '../../../utils/token'

interface IBody {
  refreshToken: string
}

export async function post(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<Token> {
  const { refreshToken } = request.body

  try {
    const payload = await verifyToken(refreshToken)
    if (payload.type !== 'REFRESH') {
      return reply.code(404).send('INVALID_TOKEN_TYPE')
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    })
    if (!user) {
      return reply.code(404).send('INVALID_TOKEN')
    }

    const tokenPair = generateToken(user.id)

    const token = await prisma.token.create({
      data: {
        userId: user.id,
        accessToken: tokenPair.accessToken,
        accessTokenExpiredAt: tokenPair.accessTokenExpiredAt,
        refreshToken: tokenPair.refreshToken,
        refreshTokenExpiredAt: tokenPair.refreshTokenExpiredAt,
      },
    })

    return token
  } catch (error: unknown) {
    return reply.code(404).send('INVALID_TOKEN')
  }
}

export default async function init(instance: FastifyInstance) {
  instance.post(
    '/',
    {
      schema: {
        tags: ['auth'],
        body: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              accessToken: { type: 'string' },
              accessTokenExpiredAt: { type: 'string', format: 'date-time' },
              refreshToken: { type: 'string' },
              refreshTokenExpiredAt: { type: 'string', format: 'date-time' },
              userId: { type: 'number' },
            },
          },
        },
      },
    },
    post,
  )

  return Promise.resolve()
}

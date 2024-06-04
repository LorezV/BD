import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { Token } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateToken } from '../../../utils/token'

interface IBody {
  email: string
  password: string
}

export async function post(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<Token> {
  const { email, password } = request.body

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  if (!user) {
    return reply.code(404).send({
      error: 'USER_NOT_FOUND',
    })
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return reply.code(401).send({
      error: 'INVALID_CREDENTIALS',
    })
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
            email: { type: 'string' },
            password: { type: 'string' },
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

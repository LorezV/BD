import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { Token } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateToken } from '../../../utils/token'

interface IBody {
  email: string
  phoneNumber: string
  password: string
  firstName: string
  lastName: string
}

export async function post(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<Token> {
  const { email, phoneNumber, password, firstName, lastName } = request.body

  const candidate = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber: phoneNumber }],
    },
  })
  if (candidate) {
    return reply.code(409).send({
      error: 'USER_EXISTS',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      firstName: firstName,
      lastName: lastName,
      typeId: 2,
    },
  })

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
            phoneNumber: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
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

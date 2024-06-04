import { FastifyReply, FastifyRequest } from 'fastify'
import { verifyToken } from '../utils/token'
import { User } from '@prisma/client'
import prisma from '../prisma'

export async function authHook(request: FastifyRequest) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token)

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        Type: true,
      },
    })

    return user
  } catch (error: unknown) {
    console.log(error)
    return null
  }
}

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  const user = await authHook(request)
  if (!user) {
    return reply.code(401).send({ error: 'UNAUTHORIZED' })
  }

  return user
}

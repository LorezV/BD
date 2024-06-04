import { User } from '@prisma/client'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { authGuard } from '../../../hooks'
import prisma from '../../../prisma'

interface IBody {
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
}

export async function remove(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<User> {
  const user = await authGuard(request, reply)

  await prisma.user.delete({
    where: { id: user.id },
  })

  return reply.status(200).send()
}

export default async function init(instance: FastifyInstance) {
  instance.delete(
    '/',
    {
      schema: {
        tags: ['user'],
      },
    },
    remove,
  )

  return Promise.resolve()
}

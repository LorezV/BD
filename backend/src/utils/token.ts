import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'

const SECRET_KEY = 'SECRET_KEY'

export function generateToken(userId: number) {
  const accessToken = jwt.sign({ userId, type: 'ACCESS' }, SECRET_KEY, { expiresIn: '30 minutes' })
  const refreshToken = jwt.sign({ userId, type: 'REFRESH' }, SECRET_KEY, { expiresIn: '30 days' })

  return {
    accessToken,
    accessTokenExpiredAt: dayjs().add(30, 'minute').toDate(),
    refreshToken,
    refreshTokenExpiredAt: dayjs().add(30, 'day').toDate(),
  }
}

export async function verifyToken(token: string) {
  const dbToken = await prisma.token.findFirst({
    where: { OR: [{ accessToken: token }, { refreshToken: token }] },
  })
  if (!dbToken) {
    throw new Error('Token not found')
  }

  const verify = jwt.verify(token, SECRET_KEY) as { userId: number; type: 'ACCESS' | 'REFRESH' }

  return verify
}

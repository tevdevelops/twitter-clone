import { getUserByUsername } from '~~/server/db/users'
import { generateTokens, sendRefreshToken } from '~~/server/utils/jwt'
import bcrypt from 'bcrypt'
import { userTransformer } from '~~/server/transformers/user'
import { createRefreshToken } from '~~/server/db/refreshTokens'
import { sendError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { username, password } = body
  if (!username || !password) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Invalid Params',
      })
    )
  }

  // Is User Registered already?
  const user = await getUserByUsername(username)

  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Username or password is invalid',
      })
    )
  }
  // Compare passwords with username
  const doesPasswordMatch = await bcrypt.compare(password, user.password)

  if (!doesPasswordMatch) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Username or password is invalid',
      })
    )
  }
  // Generate tokens
  // access token
  // refresh token
  const { accessToken, refreshToken } = generateTokens(user)

  // Save it inside db
  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
  })

  // Add http only cookie
  sendRefreshToken(event, refreshToken)

  return {
    access_token: accessToken,
    user: userTransformer(user),
  }
})

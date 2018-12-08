import sillyname from 'sillyname'
import LRU from 'lru-cache'
import ms from 'ms'

import { sanitizeUserId } from './util'

const USERS_CACHE_SIZE = 1000
const USERS_CACHE_TTL = ms('10 minutes')

module.exports = async bp => {
  const knex = await bp.db.get()

  const knownUsersCache = LRU({
    maxAge: USERS_CACHE_TTL,
    max: USERS_CACHE_SIZE
  })

  const createNewUser = userId => {
    const [first_name, last_name] = sillyname().split(' ')

    return bp.db.saveUser({
      first_name,
      last_name,
      profile_pic: null,
      id: userId,
      platform: 'webchat'
    })
  }

  const getOrCreateUser = async userId => {
    userId = sanitizeUserId(userId)

    let user = knownUsersCache.get(userId)
    if (user) {
      return user
    }

    user = await knex('users')
      .where({
        platform: 'webchat',
        userId
      })
      .then()
      .get(0)

    if (!user) {
      try {
        user = await createNewUser(userId)
      } catch (err) {
        bp.logger.error(err.message, err.stack)
        throw new Error(`User ${userId} not found`)
      }
    }

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    knownUsersCache.set(userId, user)
    return user
  }

  async function getUserProfile(userId) {
    const realUserId = userId.startsWith('webchat:') ? userId.substr(8) : userId

    const user = await knex('users')
      .where({
        platform: 'webchat',
        userId: realUserId
      })
      .then()
      .get(0)

    return user
  }

  const ensureUserExists = async userId => {
    await getOrCreateUser(userId)
  }

  return { getOrCreateUser, getUserProfile, ensureUserExists }
}

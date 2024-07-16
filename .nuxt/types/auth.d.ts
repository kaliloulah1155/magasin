declare module '#auth' {
  const getServerSession: typeof import('C:/laragon/www/pos/magasin/node_modules/@sidebase/nuxt-auth/dist/runtime/server/services').getServerSession
  const getToken: typeof import('C:/laragon/www/pos/magasin/node_modules/@sidebase/nuxt-auth/dist/runtime/server/services').getToken
  const NuxtAuthHandler: typeof import('C:/laragon/www/pos/magasin/node_modules/@sidebase/nuxt-auth/dist/runtime/server/services').NuxtAuthHandler
interface SessionData {
  id: string | number
}
}
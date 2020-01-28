import { guess } from 'guess-webpack/api'

export default function (Vue, options, { isClient, router }) {
  if (isClient && process.env.NODE_ENV !== 'development') {
    router.afterEach(() => {
      Vue.nextTick(() => {
        const predictions = Object.keys(guess()).sort((a, b) => a.probability - b.probability)

        for (const path of predictions) {
          console.log(`Prefetching ${path}`)
          Vue.prototype.$fetch(path, { shouldPrefetch: true })
        }
      })
    })
  }
}

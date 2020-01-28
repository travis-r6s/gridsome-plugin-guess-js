import { guess } from 'guess-webpack/api'

export default function (Vue, options, { isClient, router }) {
  if (isClient) {
    router.afterEach(() => {
      Vue.nextTick(() => {
        const predictions = Object.keys(guess()).sort((a, b) => a.probability - b.probability)

        for (const path of predictions) {
          console.log(`Prefetching ${path}`)
          Vue.prototype.$fetch(path, { shouldPrefetch: true })
          router.getMatchedComponents(path).forEach(Component => {
            if (typeof Component === 'function') {
              try {
                Component()
                Component.__prefetched = true
              } catch (e) {
                console.error(`Could not preload ${path}`)
              }
            }
          })
        }
      })
    })
  }
}

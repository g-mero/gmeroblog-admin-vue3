const prefix = 'gmAdmin_'

const regPrefix = new RegExp(`/^${prefix}/s`)

const Gsession = {
  set(key: string, value: string) {
    sessionStorage.setItem(`${prefix + key}`, value)
  },
  get(key: string) {
    return sessionStorage.getItem(prefix + key)
  },
  remove(key: string) {
    sessionStorage.removeItem(prefix + key)
  },
  clear() {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i) || ''
      if (regPrefix.test(key)) {
        sessionStorage.removeItem(key)
      }
    }
  }
}

export default Gsession

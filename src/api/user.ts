import http from './http'

/**
 * 用户登陆
 * @param data 用户名密码
 * @returns
 */
export function userLogin(data: { username: string; password: string }) {
  console.log(http.defaults.baseURL)

  return http.post('login', data)
}

export function userLogout() {
  return http.get('users/logout')
}

// 检查token
export function checkToken() {
  return new Promise<boolean>((resolve, reject) => {
    http
      .get('users/check')
      .then((res) => {
        if (res.data.status === 200) resolve(true)
        else resolve(false)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

import { ElNotification } from 'element-plus'

import 'element-plus/es/components/notification/style/css'

const notice = {
  success(message: string) {
    ElNotification({
      title: '成功',
      message,
      type: 'success'
    })
  },
  warning(message: string) {
    ElNotification({
      title: '警告',
      message,
      type: 'warning'
    })
  },
  info(message: string) {
    ElNotification({
      title: '提示',
      message,
      type: 'info'
    })
  },
  error(message: string) {
    ElNotification({
      title: '错误',
      message,
      type: 'error'
    })
  }
}

export default notice

import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

const messageBox = {
  confirm(msg: string, onFinish: (confirm: boolean) => void) {
    ElMessageBox.confirm(msg, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        onFinish(true)
      })
      .catch(() => {
        onFinish(false)
      })
  }
}

export default messageBox

import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

const message = (msg: string) => {
  ElMessage(msg)
}

message.error = (msg: string) => {
  ElMessage.error(msg)
}

message.success = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'success'
  })
}

message.warning = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'warning'
  })
}

message.info = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'info'
  })
}

export default message

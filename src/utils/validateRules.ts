import type { FormItemRule } from 'element-plus'

const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/

export const rulePassword: FormItemRule[] = [
  {
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!REGEXP_PWD.test(value)) {
        callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

function isJson(str: string) {
  try {
    console.log(1)

    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const ruleJson: FormItemRule[] = [
  {
    validator: (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isJson(value)) {
        callback(new Error('不是json格式'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

export const ruleTitle: FormItemRule[] = [
  { required: true, message: '请输入标题', trigger: 'blur' },
  { min: 2, max: 25, message: '标题长度再2到25之间', trigger: 'blur' }
]

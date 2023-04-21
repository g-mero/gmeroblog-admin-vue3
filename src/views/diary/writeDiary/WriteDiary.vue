<script setup lang="ts">
import { apiDelDiary, apiGetDiary, apiGetDiarydates, apiPostDiary, apiPutDiary } from '@/api/diary'
import { MdEditor } from '@/components/MdEditor'
import AppMain from '@/layout/appMain/AppMain.vue'
import message from '@/utils/message'
import notice from '@/utils/notice'
import { ruleJson } from '@/utils/validateRules'
import { dayjs, type FormInstance } from 'element-plus'
import { ref, watch } from 'vue'

const onPostDiary = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    const content = baseSettings.value.content
    if (valid && content) {
      const postData = {
        time: baseSettings.value.time,
        extra: baseSettings.value.extra,
        desc: '',
        content
      }

      apiPostDiary(postData)
        .then(() => {
          notice.success(`${postData.time}的日记上传成功`)
          baseSettings.value.isExist = true
          getDiaryDates(dayjs(postData.time))
        })
        .catch((e) => {
          notice.error(`上传失败: ${e}`)
        })
    } else {
      message.error('表单校验失败,请检查')
      return false
    }
  })
}

const onPutDiary = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    const sets = baseSettings.value
    if (valid && sets.content) {
      const postData = {
        time: sets.time,
        extra: sets.extra,
        desc: '',
        content: sets.content
      }

      apiPutDiary(sets.time, postData)
        .then(() => {
          notice.success(`${postData.time}的日记更新成功`)
        })
        .catch((e) => {
          notice.error(`更新失败: ${e}`)
        })
    } else {
      message.error('表单校验失败,请检查')
      return false
    }
  })
}

const onDelDiary = () => {
  const time = baseSettings.value.time
  apiDelDiary(baseSettings.value.time)
    .then(() => {
      notice.success(`${time}的日记成功删除`)
      baseSettings.value.isExist = false
      baseSettings.value.content = ''
      getDiaryDates(dayjs(time))
    })
    .catch((e) => {
      notice.error(`删除失败: ${e}`)
    })
}

const now = dayjs()

const baseSettings = ref({
  time: now.format('YYYY-MM-DD'),
  extra: '',
  content: '',
  isExist: false
})

watch(
  () => baseSettings.value.time,
  (time) => {
    baseSettings.value.content = ''
    getDiary(time)
  }
)

const ruleFormRef = ref<FormInstance>()

const rules = {
  extra: ruleJson
}

let diaryDates = ref<string[]>([])

// 重设已存在日记表
const getDiaryDates = (dayjs: dayjs.Dayjs) => {
  apiGetDiarydates(dayjs.format('YYYY'), dayjs.format('MM')).then((res) => {
    diaryDates.value = res
  })
}

const getDiary = (time: string) => {
  apiGetDiary(time)
    .then((res) => {
      baseSettings.value.content = res.content
      baseSettings.value.extra = res.extra
      baseSettings.value.isExist = true
    })
    .catch(() => {
      baseSettings.value.content = ''
      baseSettings.value.extra = ''
      baseSettings.value.isExist = false
    })
}

getDiaryDates(now)
getDiary(now.format('YYYY-MM-DD'))

/**
 *
 * @param date 当前的日期
 * @param mode 触发事件的面板 year month
 * @param view 当前的面板
 */
const handelPanelChange = (date: any /* , mode: string, view: string */) => {
  const tmp = dayjs(date)

  getDiaryDates(tmp)
}

const hasDiary = (cell: any) => {
  return diaryDates.value.includes(cell.dayjs.format('YYYY-MM-DD'))
}
</script>

<template>
  <AppMain>
    <template #header>
      <ElButton v-if="baseSettings.isExist" type="danger" plain @click="onDelDiary">删除</ElButton>
      <ElButton
        type="primary"
        plain
        size="large"
        @click="baseSettings.isExist ? onPutDiary(ruleFormRef) : onPostDiary(ruleFormRef)"
        >{{ baseSettings.isExist ? '更新' : '发布' }}</ElButton
      >
    </template>
    <div>
      <ElForm labelWidth="auto" :rules="rules" :model="baseSettings" ref="ruleFormRef">
        <ElFormItem label="日期" required>
          <ElDatePicker
            v-model="baseSettings.time"
            placeholder="Pick a day"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            :clearable="false"
            popper-class="diary-date-picker"
            @panel-change="handelPanelChange"
          >
            <template #default="cell">
              <div class="cell" :class="{ current: cell.isCurrent }">
                <span class="text">{{ cell.text }}</span>
                <span v-if="hasDiary(cell)" class="holiday" />
              </div>
            </template>
          </ElDatePicker>
        </ElFormItem>
        <!--         <ElFormItem label="额外补充" prop="extra">
          <ElInput
            v-model="baseSettings.extra"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 25 }"
          />
        </ElFormItem> -->
      </ElForm>

      <MdEditor height="600px" v-model="baseSettings.content" theme="light"></MdEditor>
    </div>
  </AppMain>
</template>

<style scoped>
.cell {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;
}
.cell .text {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0 auto;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
.cell.current .text {
  background: #626aef;
  color: #fff;
}

.cell .holiday {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--el-color-danger);
  border-radius: 50%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

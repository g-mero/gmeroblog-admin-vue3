<script setup lang="ts">
import { apiGetDiary, apiGetDiarydates, type PostDiaryData } from '@/api/diary'
import GmIcon from '@/components/Icon/GmIcon.vue'
import router from '@/router'
import { mdPreview } from '@/utils/article'
import notice from '@/utils/notice'
import { dayjs } from 'element-plus'
import { isString } from 'lodash-es'
import { ref, watch } from 'vue'

import './style.scss'

document.title = '日记'

const currDiary = ref<PostDiaryData>({
  time: '2000-05-04',
  content: '',
  desc: '',
  extra: ''
})

const loading = ref(true)

const diaryDates = ref<string[]>([])

const getDiary = (date?: string) => {
  loading.value = true
  apiGetDiary(date || 'latest')
    .then((res) => {
      currDiary.value = res
      afterVars.value.currDate = res.time
      setAfterVars()
    })
    .catch((e) => {
      notice.error(`读取日记出现错误： ${e}`)
    })
    .finally(() => {
      loading.value = false
    })
}

const getDiaryDates = (date?: string) => {
  apiGetDiarydates('', '')
    .then((res) => {
      diaryDates.value = res
      getDiary(date)
    })
    .catch((e) => {
      notice.error(`读取日期出现错误： ${e}`)
    })
}

const afterVars = ref({
  lastDate: '',
  nextDate: '',
  currDate: dayjs().format('YYYY-MM-DD')
})

watch(
  () => afterVars.value.currDate,
  (date) => {
    getDiary(date)
  }
)

function setAfterVars() {
  const dates = diaryDates.value
  const index = dates.indexOf(afterVars.value.currDate)
  const lastIndex = index - 1
  const nextIndex = index + 1

  afterVars.value.lastDate = lastIndex >= 0 ? dates[lastIndex] : ''
  afterVars.value.nextDate = nextIndex < dates.length ? dates[nextIndex] : ''
}

// 获取路由参数
const currDate = router.currentRoute.value.query.date

if (isString(currDate) && currDate) {
  getDiaryDates(currDate)
} else {
  getDiaryDates()
}
</script>

<template>
  <div class="diary-wrapper">
    <div class="diary-main">
      <el-container>
        <el-header class="header"
          ><div class="toolbar">
            <div class="left">
              <ElTooltip
                :content="afterVars.lastDate"
                placement="top"
                :disabled="afterVars.lastDate === ''"
              >
                <ElButton
                  text
                  :disabled="afterVars.lastDate === ''"
                  @click="afterVars.currDate = afterVars.lastDate"
                >
                  <GmIcon icon="solar:round-alt-arrow-left-linear" size="2em" />
                </ElButton>
              </ElTooltip>
            </div>
            <div class="center">
              <el-select-v2
                v-model="afterVars.currDate"
                :options="diaryDates.map((v) => ({ value: v, label: v }))"
                placeholder="Please select"
                filterable
              />
            </div>
            <div class="right">
              <ElTooltip
                :content="afterVars.nextDate"
                placement="top"
                :disabled="afterVars.nextDate === ''"
              >
                <ElButton
                  text
                  :disabled="afterVars.nextDate === ''"
                  @click="afterVars.currDate = afterVars.nextDate"
                >
                  <GmIcon icon="solar:round-alt-arrow-right-linear" size="2em" />
                </ElButton>
              </ElTooltip>
            </div></div
        ></el-header>
        <ElScrollbar height="70vh" v-loading="loading">
          <el-main>
            <div class="diary-content" v-html="mdPreview(currDiary?.content || '')"></div>
          </el-main>
        </ElScrollbar>
      </el-container>
    </div>
  </div>
</template>

<style scoped lang="scss">
.diary-wrapper {
  height: 100%;

  display: flex;
  flex-direction: column;

  background-color: #ecf9ff;

  align-items: center;
  justify-content: center;
}

.diary-main {
  width: 80%;
  background-color: #fffbeb;
}

.header {
  height: auto;
  background-color: #ffe7cc;
  border-radius: 1rem;
  padding: 0.2rem;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

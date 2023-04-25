<script setup lang="ts">
import { apiGetArts, type ArticleData, apiDeleteArt, apiGetArt, apiPatchArt } from '@/api/articles'
import AppMain from '@/layout/appMain/AppMain.vue'
import DataShowTable from '@/components/DataShowTable/DataShowTable.vue'
import router from '@/router'
import message from '@/utils/message'
import notice from '@/utils/notice'
import { ref, watch } from 'vue'
import messageBox from '@/utils/messageBox'
import { genDesc, md2html } from '@/utils/article'
import LoadingDialog from '@/components/LoadingDialog/LoadingDialog.vue'
import { dayjs } from 'element-plus'
import GmIcon from '@/components/Icon/GmIcon.vue'
import { cateStore } from '@/stores/cate'
import { getConfig } from '@/utils/config'

// 存储文章数据
const data = ref<ArticleData[]>([])

const loading = ref(true)

const total = ref(0)

const pageSize = 20

const currentPage = ref(1)

watch(currentPage, () => {
  getArts()
})

// 获取文章
const getArts = () => {
  loading.value = true
  apiGetArts(pageSize, currentPage.value)
    .then((res) => {
      data.value = res.data
      total.value = res.total
    })
    .catch((e) => {
      message.error(e)
    })
    .finally(() => {
      loading.value = false
    })
}

getArts()

// 选择的文章
const selectedData = ref<ArticleData[]>([])

// 多选时的回调
const handleSelectionChange = (val: ArticleData[]) => {
  selectedData.value = val
}

// 删除多选
const deleteSelection = () => {
  loading.value = true
  let success = 0
  let error = 0
  const selection = selectedData.value
  selection.forEach((v) => {
    apiDeleteArt(v.id)
      .then(() => {
        success += 1
      })
      .catch(() => {
        error += 1
      })
      .finally(() => {
        if (success + error === selection.length) {
          getArts()
          if (error) notice.warning(`${error} 篇文章删除失败`)
          notice.success(`成功删除了${success}篇文章`)
        }
      })
  })
}

const handleDelete = (row: ArticleData) => {
  loading.value = true
  apiDeleteArt(row.id)
    .then(() => {
      notice.success('删除成功')
      getArts()
    })
    .catch((e) => {
      loading.value = false
      notice.error(e)
    })
}

const handelEdit = (row: ArticleData) => {
  router.push({ name: 'edit-arts', params: { id: row.id } })
}

const resetHtmlContentProgress = ref({
  success: 0,
  error: 0,
  total: 0
})

const resetHtmlContentProgressShow = ref(false)

const handelResetHtmlContent = () => {
  const arts = selectedData.value
  messageBox.confirm(
    `你选择了${arts.length}篇文章，确认的话会重新生成这些文章的html内容，` +
      `这是不可逆的，建议只在文章渲染器更换时执行该操作`,
    async (confirm) => {
      // 这里使用async await进行同步操作
      if (confirm) {
        resetHtmlContentProgressShow.value = true
        resetHtmlContentProgress.value = {
          success: 0,
          error: 0,
          total: arts.length
        }

        for (let i = 0; i < arts.length; i++) {
          const art = arts[i]

          const res = await apiGetArt(art.id).catch(() => {
            resetHtmlContentProgress.value.error += 1
          })

          if (res) {
            const htmlContent = md2html(res.content)
            let desc = undefined
            if (res.desc === '') desc = genDesc(htmlContent)
            await apiPatchArt(art.id, {
              html_content: htmlContent,
              desc
            })
              .then(() => {
                resetHtmlContentProgress.value.success += 1
              })
              .catch(() => {
                resetHtmlContentProgress.value.error += 1
              })
          }
        }
      }
    }
  )
}
</script>

<template>
  <app-main>
    <div class="arts-table">
      <data-show-table
        v-model:current-page="currentPage"
        :page-count="Math.ceil(total / pageSize)"
        :data="data"
        :on-selection-change="handleSelectionChange"
        :loading="loading"
      >
        <template #header-left>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteSelection()"
            v-if="selectedData.length > 0"
          >
            <template #reference>
              <el-button
                type="danger"
                :disabled="selectedData.length === 0"
                :loading="loading"
                plain
                >删除所选</el-button
              >
            </template>
          </el-popconfirm>
          <el-button
            v-if="selectedData.length > 0"
            type="primary"
            :loading="loading"
            plain
            @click="handelResetHtmlContent"
            >重置文章html</el-button
          >
          <el-input v-else placeholder="按标题检索">
            <template #append>
              <el-button text><GmIcon icon="solar:magnifer-linear" /></el-button>
            </template>
          </el-input>
        </template>
        <template #cell-left="scope">
          <div class="entity-wrapper">
            <div class="entity-title">
              <el-text truncated>
                <a
                  :href="`${getConfig().SiteUrl}/article/${scope.row.id}`"
                  class="goto-btn"
                  target="_blank"
                  ><GmIcon icon="solar:square-arrow-right-up-linear"
                /></a>

                <span
                  class="goto-edit"
                  @click="router.push({ name: 'edit-arts', params: { id: `${scope.row.id}` } })"
                  >{{ scope.row.title }}</span
                >
              </el-text>
            </div>
            <div class="entity-body">
              {{ dayjs(scope.row.updated_at).format('YYYY-MM-DD') }}
              {{ cateStore.cateMap.get(scope.row.cid)?.name }}
            </div>
          </div>
        </template>
        <template #cell-right="scope">
          <el-button size="small" type="primary" @click="handelEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </data-show-table>
    </div>
    <loading-dialog
      :data="resetHtmlContentProgress"
      v-model="resetHtmlContentProgressShow"
    ></loading-dialog>
  </app-main>
</template>

<style scoped lang="scss">
.entity-wrapper {
  display: flex;
  flex-direction: column;
  padding-right: 1rem;

  .entity-body {
    display: flex;
    font-size: 0.8em;
    opacity: 0.75;
  }

  .entity-title {
    > span {
      position: relative;
      padding-right: 1.1rem;
    }

    .goto-btn {
      position: absolute;
      height: auto;
      top: 0.2rem;
      right: 0;
      opacity: 0;
      transition: all 0.25s ease-in-out;
      padding: 0;

      &:hover {
        color: aqua;
      }
    }

    .goto-edit {
      cursor: pointer;

      &:hover {
        opacity: 0.75;
      }
    }

    &:hover {
      .goto-btn {
        opacity: 1;
      }
    }
  }
}
</style>

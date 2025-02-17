<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book.js'

const store = useBookStore()
const { closeDialogDetail } = store
const { book, bookDialogDetail } = storeToRefs(store)

/** State of the book dialog @type {import('vue').Ref<boolean>} */
const dialog = ref(bookDialogDetail.value ?? false)

/** Close book dialog */
const hideDialog = () => {
  dialog.value = false
}

watch(dialog, (value) => {
  if (!value) {
    closeDialogDetail()
  }
})

watch(bookDialogDetail, () => {
  dialog.value = bookDialogDetail.value
})
</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      :style="{ width: '600px' }"
      :modal="true"
      header="Информация о книге"
      class="@container"
      pt:header:class="p-4"
      pt:footer:class="p-4"
    >
      <div class="grid grid-flow-row-dense grid-cols-2 gap-y-4 @max-md:grid-cols-1">
        <div class="order-1">
          <Divider align="left" type="solid">
            <b>Название</b>
          </Divider>
          <p class="px-6 @max-md:px-0">{{ book?.volumeInfo.title }}</p>
        </div>

        <div class="order-3 @max-md:order-2">
          <Divider align="left" type="solid">
            <b>Авторы</b>
          </Divider>
          <p class="px-6 @max-md:px-0">{{ book?.volumeInfo.authors?.join(', ') }}</p>
        </div>

        <div class="order-2 @max-md:order-3">
          <Divider align="left" type="solid">
            <b>Дата публикации</b>
          </Divider>
          <p class="px-6 @max-md:px-0">{{ book?.volumeInfo.publishedDate }}</p>
        </div>

        <div class="order-4">
          <Divider align="left" type="solid">
            <b>Категории</b>
          </Divider>
          <p class="px-6 @max-md:px-0">{{ book?.volumeInfo.categories?.join(', ') }}</p>
        </div>

        <div class="col-span-full order-5">
          <Divider align="left" type="solid">
            <b>Описание</b>
          </Divider>
          <p class="px-6 @max-md:px-0">{{ book?.volumeInfo.description }}</p>
        </div>
      </div>
      <template #footer>
        <Button label="Закрыть" icon="pi pi-times" text @click="hideDialog" class="" />
      </template>
    </Dialog>
  </div>
</template>

<style></style>

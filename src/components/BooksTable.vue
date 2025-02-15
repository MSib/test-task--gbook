<script setup>
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book.js'
import BookDetails from '@/components/BookDetails.vue'

const store = useBookStore()
const { openDialogDetail } = store
const { books, loading } = storeToRefs(store)
/** Indent taking into account the button "Load more" @type {string} */
const SCROLL_HEIGHT_INDENT = 'calc(100dvh - 6.6rem)'

const onSelect = (event) => {
  openDialogDetail(event.data)
}
</script>

<template>
  <div class="card">
    <DataTable
      :value="books"
      :loading="loading"
      @rowSelect="onSelect"
      selectionMode="single"
      dataKey="id"
      showGridlines
      resizableColumns
      columnResizeMode="expand"
      tableStyle="min-width: 50rem"
      scrollable
      :scrollHeight="SCROLL_HEIGHT_INDENT"
    >
      <Column field="volumeInfo.title" header="Название" class="whitespace-normal"></Column>
      <Column :field="(item) => item.volumeInfo.authors?.join(', ')" header="Авторы" class="whitespace-normal"></Column>
      <Column field="volumeInfo.publishedDate" header="Дата публикации"></Column>
      <Column
        :field="(item) => item.volumeInfo.categories?.join(', ')"
        header="Категории"
        class="whitespace-normal"
      ></Column>
      <BookDetails />
    </DataTable>
  </div>
</template>

<style scoped></style>

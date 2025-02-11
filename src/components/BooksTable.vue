<script setup>
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book.js'

const store = useBookStore()
const { books, loading } = storeToRefs(store)
/** Indent taking into account the button "Load more" @type {string} */
const SCROLL_HEIGHT_INDENT = 'calc(100dvh - 6.6rem)'
</script>

<template>
  <div class="card">
    <DataTable
      :value="books"
      :loading="loading"
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
    </DataTable>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book.js'
import BookDetails from '@/components/BookDetails.vue'
import BookEdit from '@/components/BookEdit.vue'

const store = useBookStore()
const { openDialogDetail, openDialogEdit } = store
const { books, loading } = storeToRefs(store)
/** Indent taking into account the button "Load more" @type {string} */
const SCROLL_HEIGHT_INDENT = 'calc(100dvh - 6.6rem)'

const cm = ref()
const selectedBook = ref()
const menuModel = ref([
  { label: 'Редактировать', icon: 'pi pi-fw pi-pencil', command: () => editBook(selectedBook.value) },
])

const onSelect = (event) => {
  openDialogDetail(event.data)
}

const editBook = (book) => {
  openDialogEdit(book)
}

const onRowContextMenu = (event) => {
  cm.value.show(event.originalEvent)
}
</script>

<template>
  <div class="card">
    <ContextMenu ref="cm" :model="menuModel" @hide="selectedBook = null" />
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
      contextMenu
      v-model:contextMenuSelection="selectedBook"
      @rowContextmenu="onRowContextMenu"
    >
      <Column field="volumeInfo.title" header="Название" class="whitespace-normal"></Column>
      <Column :field="(item) => item.volumeInfo.authors?.join(', ')" header="Авторы" class="whitespace-normal"></Column>
      <Column field="volumeInfo.publishedDate" header="Дата публикации"></Column>
      <Column
        :field="(item) => item.volumeInfo.categories?.join(', ')"
        header="Категории"
        class="whitespace-normal"
      ></Column>
      <Column :exportable="false" style="width: 5rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded @click="editBook(slotProps.data)" aria-label="Редактировать" />
        </template>
      </Column>
      <BookDetails />
      <BookEdit />
    </DataTable>
  </div>
</template>

<style scoped></style>

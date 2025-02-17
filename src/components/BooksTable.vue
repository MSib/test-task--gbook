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
/** Context menu. */
const cm = ref()
/** Currently selected book. */
const selectedBook = ref()
/** Model for the context menu, containing menu items. */
const menuModel = ref([
  { label: 'Редактировать', icon: 'pi pi-fw pi-pencil', command: () => onEdit(selectedBook.value) },
])

/**
 * Forwards data from an event and opens dialog.
 * @param {Object} event - The event object containing the selected book.
 * @param {import('@/types.js').Book} event.data - Selected book.
 */
const onSelect = (event) => {
  openDialogDetail(event.data)
}

/**
 * Forwards data from an event and opens dialog.
 * @param {import('@/types.js').Book} book - The book to edit.
 */
const onEdit = (book) => {
  openDialogEdit(book)
}

/**
 * Handles the context menu event for a row in the table.
 * @param {Object} event - The context menu event triggered by right-clicking on a row.
 * @param {MouseEvent} event.originalEvent - The original event.
 */
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
          <Button icon="pi pi-pencil" outlined rounded @click="onEdit(slotProps.data)" aria-label="Редактировать" />
        </template>
      </Column>
      <BookDetails />
      <BookEdit />
    </DataTable>
  </div>
</template>

<style scoped></style>

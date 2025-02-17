<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
// @ts-ignore
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useBookStore } from '@/stores/book.js'

const store = useBookStore()
const { loadBooks } = store
const { loading, lastSearchParams } = storeToRefs(store)

const initialValues = ref({
  search: lastSearchParams.value?.query || '',
})

const resolver = ref(
  zodResolver(
    z.object({
      search: z
        .string()
        .min(1, { message: 'Запрос не может быть пустым' })
        .max(250, { message: 'Слишком длинный запрос' }),
    })
  )
)

const onFormSubmit = ({ valid, values }) => {
  if (valid) {
    loadBooks({ query: values.search })
  }
}
</script>

<template>
  <Panel header="Header" class="my-2 sm:m-2" pt:content:class="p-4">
    <div class="card flex flex-col items-center gap-5">
      <Toast />
      <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col justify-center gap-4 sm:gap-0 w-full sm:flex-row sm:flex-wrap"
      >
        <div class="flex flex-col gap-1">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
              class="w-full sm:min-w-md sm:rounded-r-none"
              name="search"
              type="text"
              placeholder="Введите текст"
            />
          </IconField>
          <Message v-if="$form.search?.invalid" severity="error" size="small" variant="simple">{{
            $form.search.error.message
          }}</Message>
        </div>
        <Button
          class="min-w-56 sm:min-w-fit px-5 place-self-center sm:rounded-l-none sm:place-self-start"
          type="submit"
          label="Найти"
          :loading="loading"
        />
      </Form>
    </div>
  </Panel>
</template>

<style scoped></style>

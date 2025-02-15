<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/book.js'
import HeaderMenu from '@/components/HeaderMenu.vue'

const route = useRoute()
const router = useRouter()
const store = useBookStore()
const { setCurrentRoute, setCurrentRouter } = store

setCurrentRoute(route)
setCurrentRouter(router)
</script>

<template>
  <header>
    <HeaderMenu />
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>

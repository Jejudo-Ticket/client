<template>
  <component :is="headerComponent" />
  <RouterView />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/layout/Header.vue'
import AuthHeader from '@/components/layout/AuthHeader.vue'

const route = useRoute()
const authStore = useAuthStore()

// 앱 초기화 시 저장된 토큰 로드
onMounted(() => {
  authStore.loadToken()
})

// auth 페이지에서는 AuthHeader, 그 외 페이지에서는 Header 컴포넌트 사용
const headerComponent = computed(() => {
  if (['login', 'join'].includes(route.name)) {
    return AuthHeader
  }
  return Header
})
</script>

<style scoped></style>

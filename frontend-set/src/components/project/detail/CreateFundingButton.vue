<template>
  <div v-if="authStore.isFinanceRole()" class="bg-white rounded-xl shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">펀딩 생성</h3>
    <p class="text-gray-600 text-sm mb-4">
      이 프로젝트로 펀딩을 시작하고 싶으신가요? 지금 바로 펀딩을 생성해보세요.
    </p>
    <button
      @click="goToFundingCreate"
      class="w-full bg-blue-500 text-white px-4 py-3 rounded-button font-medium hover:bg-blue-600 cursor-pointer whitespace-nowrap transition-all"
    >
      <i class="fas fa-coins mr-2"></i>
      펀딩 생성하기
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const props = defineProps({
  projectId: Number,
})

const router = useRouter()
const authStore = useAuthStore()

const goToFundingCreate = async () => {
  try {
    // 프로젝트 정보 가져오기
    const response = await axios.get(`/project/list/detail/${props.projectId}/full`)
    const projectType = response.data.basicInfo.projectType
    
    // 프로젝트 타입에 따라 다른 페이지로 라우팅
    let routePath = ''
    switch (projectType) {
      case 'Savings':
      case '적금형':
        routePath = '/funding/create/savings'
        break
      case 'Loan':
      case '대출형':
        routePath = '/funding/create/loan'
        break
      case 'Challenge':
      case '챌린지형':
        routePath = '/funding/create/challenge'
        break
      case 'Donation':
      case '기부형':
        routePath = '/funding/create/donation'
        break
      default:
        console.error('알 수 없는 프로젝트 타입:', projectType)
        alert('프로젝트 타입을 확인할 수 없습니다.')
        return
    }
    
    router.push(`${routePath}?projectId=${props.projectId}`)
  } catch (error) {
    console.error('프로젝트 정보 조회 실패:', error)
    alert('프로젝트 정보를 불러올 수 없습니다.')
  }
}
</script>
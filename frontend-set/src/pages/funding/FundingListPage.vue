<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <div class="container mx-auto px-4 sm:px-6 lg:px-32 py-8">
      <!-- 마감 임박 섹션 생략 가능 -->

      <!-- 탭 메뉴 -->
      <TabMenu :tabs="tabOptions" v-model="activeTab" />

      <!-- 검색/정렬/카테고리 필터 -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0"
        >
          <SearchBox
            v-model="searchQuery"
            placeholder="검색어를 입력하세요"
            @search="handleSearch"
          />
          <SortSelect :options="sortOptions" v-model="selectedSort" />
        </div>
        <CategoryFilter :categories="categories" v-model="selectedCategory" />
      </div>

      <!-- 펀딩 카드 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
        <FundingCard v-for="project in displayedProjects" :key="project.id" v-bind="project" />
      </div>

      <!-- 페이지네이션 -->
      <Pagination v-model="currentPage" :totalPages="totalPages" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import FundingCard from '@/components/funding/FundingCard.vue'
import TabMenu from '@/components/common/TabMenu.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import SortSelect from '@/components/common/SortSelect.vue'
import CategoryFilter from '@/components/common/CategoryFilter.vue'
import Pagination from '@/components/common/Pagination.vue'

const tabOptions = [
  { value: 'Launch', label: '진행중인 펀딩' },
  { value: 'End', label: '종료된 펀딩' },
]
const activeTab = ref('Launch')
const selectedCategory = ref('전체')
const searchQuery = ref('')
const selectedSort = ref('latest')
const currentPage = ref(1)
const totalPages = ref(1)

const allProjects = ref([])

const categories = ref(['전체', '적금형', '대출형', '기부형', '챌린지형'])

const categoryMap = {
  전체: undefined,
  적금형: 'Savings',
  대출형: 'Loan',
  기부형: 'Donation',
  챌린지형: 'Challenge',
}

// axios 인스턴스 설정
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // withCredentials: false, 
})

onMounted(loadFundings)
watch([activeTab, selectedCategory], () => {
  currentPage.value = 1
  loadFundings()
})

// fundType이 '전체'일 때는 undefined로 보내서 필터링 안 하도록 처리
async function loadFundings() {
  try {
    const params = {
      progress: activeTab.value, // 'LAUNCH' or 'END' 등 서버가 기대하는 값으로
    }
    if (selectedCategory.value !== '전체') {
      params.fundType = categoryMap[selectedCategory.value] // 반드시 매핑된 값으로 보내야 함
    }

    const response = await api.get('/fund/list', { params })
    allProjects.value = response.data.map(mapToProjectCardFormat)
    totalPages.value = Math.ceil(allProjects.value.length / 10)
  } catch (err) {
    console.error('펀딩 데이터를 불러오는 중 오류 발생:', err)
  }
}

const displayedProjects = computed(() => {
  let filtered = allProjects.value

  if (searchQuery.value) {
    filtered = filtered.filter(
      (p) => p.title.includes(searchQuery.value) || p.description.includes(searchQuery.value),
    )
  }

  if (selectedSort.value === 'popular') {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes)
  } else if (selectedSort.value === 'deadline') {
    filtered = [...filtered].sort((a, b) => a.daysLeft - b.daysLeft)
  }

  const start = (currentPage.value - 1) * 10
  return filtered.slice(start, start + 10)
})

function handleSearch() {
  currentPage.value = 1
}

// DTO → 카드 컴포넌트용 데이터 변환 함수
function mapToProjectCardFormat(fund) {
  return {
    id: fund.fundId,
    title: fund.name,
    description: fund.financialInstitution,
    daysLeft: getDaysLeft(fund.endAt),
    likes: fund.retryVotesCount,
    progress: calculateProgress(fund.launchAt, fund.endAt),
    category: fund.fundType,
    image: fund.thumbnail,
    link: `/funding/${fund.fundId}`,
  }
}

function getDaysLeft(endAt) {
  const end = new Date(endAt)
  const now = new Date()
  const diff = end - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function calculateProgress(launchAt, endAt) {
  const start = new Date(launchAt)
  const end = new Date(endAt)
  const now = new Date()
  const total = end - start
  const passed = now - start
  return Math.min(100, Math.floor((passed / total) * 100))
}
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

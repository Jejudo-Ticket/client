<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
    <!-- 메인 로그인 영역 -->
    <div class="flex items-center justify-center h-[calc(100vh-4rem)] px-4">
        <!-- 로그인 카드 -->
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <!-- 로그인 헤더 -->
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
                <p class="text-gray-600">Fund:ing에 오신 것을 환영합니다</p>
            </div>
            <!-- 로그인 폼 -->
            <form @submit.prevent="handleLogin" class="space-y-6">
                <!-- 이메일 입력 필드 -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2"
                        >이메일</label
                    >
                    <div class="relative">
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="이메일을 입력해주세요"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                            :class="{ 'border-red-500 focus:ring-red-500': emailError }"
                            @blur="validateEmail"
                        />
                        <i
                            class="fas fa-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                        ></i>
                    </div>
                    <p v-if="emailError" class="text-red-500 text-xs mt-1">
                        {{ emailError }}
                    </p>
                </div>
                <!-- 비밀번호 입력 필드 -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
                        >비밀번호</label
                    >
                    <div class="relative">
                        <input
                            id="password"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="비밀번호를 입력해주세요"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                            :class="{
                                'border-red-500 focus:ring-red-500': passwordError,
                            }"
                            @blur="validatePassword"
                        />
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <i
                                :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                                class="text-sm"
                            ></i>
                        </button>
                    </div>
                    <p v-if="passwordError" class="text-red-500 text-xs mt-1">
                        {{ passwordError }}
                    </p>
                </div>
                <!-- 로그인 버튼 -->
                <button
                    type="submit"
                    :disabled="isLoading || !isFormValid"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 !rounded-button transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:transform-none disabled:shadow-none cursor-pointer whitespace-nowrap"
                >
                    <span v-if="isLoading" class="flex items-center justify-center">
                        <i class="fas fa-spinner fa-spin mr-2"></i>
                        로그인 중...
                    </span>
                    <span v-else>로그인</span>
                </button>
            </form>
            <!-- 에러 메시지 -->
            <div v-if="loginError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm text-center">{{ loginError }}</p>
            </div>
            <!-- 하단 링크 영역 -->
            <div class="mt-8">
                <!-- 비밀번호 찾기 / 회원가입 링크 -->
                <div class="flex items-center justify-end gap-2 text-sm">
                    <a
                        href="#"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    >
                        비밀번호 찾기
                    </a>
                    <span class="text-gray-400">|</span>
                    <a
                        href="https://readdy.ai/home/cb2c7bc4-bc93-4247-9521-a5e098400181/176a112f-751d-4869-b1c5-244ebb7d5f93"
                        data-readdy="true"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    >
                        회원가입
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const loginError = ref('')

const router = useRouter()
const authStore = useAuthStore()

const isFormValid = computed(() => {
    return email.value && password.value && !emailError.value && !passwordError.value
})

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.value) {
        emailError.value = '이메일을 입력해주세요'
    }
    // else if (!emailRegex.test(email.value)) {
    //     emailError.value = '올바른 이메일 형식을 입력해주세요'
    // }
    else {
        emailError.value = ''
    }
}

const validatePassword = () => {
    if (!password.value) {
        passwordError.value = '비밀번호를 입력해주세요'
    } else if (password.value.length < 6) {
        passwordError.value = '비밀번호는 6자 이상이어야 합니다'
    } else {
        passwordError.value = ''
    }
}

const handleLogin = async () => {
    validateEmail()
    validatePassword()

    if (!isFormValid.value) {
        return
    }

    isLoading.value = true
    loginError.value = ''

    try {
        // 실제 로그인 로직은 여기에 구현
        // await new Promise((resolve) => setTimeout(resolve, 1500))
        await axios
            .post('/member/login', {
                email: email.value,
                password: password.value,
            })
            .then((res) => {
                console.log('✅res.data:', res.data)

                authStore.login(res.data)
                console.log('✅authStore token:', authStore.loadToken())
                console.log('✅res accesstoken:', res.data)
            })

        // 로그인 성공 시 리다이렉트 또는 상태 변경
        console.log('로그인 성공:', {
            email: email.value,
            password: password.value,
        })

        router.push('/')
    } catch (error) {
        loginError.value = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.\!rounded-button {
    border-radius: 8px;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    -moz-appearance: textfield;
}

@media (max-width: 640px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>

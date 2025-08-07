import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(false)
    const token = ref('')
    const userRole = ref('')

    function login(data) {
        isLoggedIn.value = true
        token.value = data.token || data.accessToken
        userRole.value = data.userRole || data.role || ''
        localStorage.setItem('jwt', token.value)
        localStorage.setItem('userRole', userRole.value)
    }

    function logout() {
        isLoggedIn.value = false
        token.value = ''
        userRole.value = ''
        localStorage.removeItem('jwt')
        localStorage.removeItem('userRole')
    }

    function loadToken() {
        const savedToken = localStorage.getItem('jwt')
        const savedRole = localStorage.getItem('userRole')
        if (savedToken) {
            token.value = savedToken
            userRole.value = savedRole || ''
            isLoggedIn.value = true
        }
    }

    function isFinanceRole() {
        return userRole.value === 'ROLE_FINANCE'
    }

    return {
        isLoggedIn,
        token,
        userRole,
        login,
        logout,
        loadToken,
        isFinanceRole,
    }
})

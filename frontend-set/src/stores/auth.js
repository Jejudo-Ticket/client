import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(false)
    const token = ref('')
    const userRole = ref('')

    function login(receivedToken, role = '') {
        isLoggedIn.value = true
        token.value = receivedToken
        userRole.value = role
        localStorage.setItem('jwt', receivedToken)
        localStorage.setItem('userRole', role)
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

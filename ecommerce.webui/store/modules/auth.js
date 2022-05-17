import request from '@/services/request'
import Cookies from 'js-cookie'

const state = {
    isLoggedIn : false
}

const getters = {
    isAuthenticated(state){
        return state.isLoggedIn
    }
}

const mutations = {
    setIsLoggedIn(state, data){
        state.isLoggedIn = data
    }
}

const actions = { 
    initAuth(vuexContext, req){ 
        let token ;
        if (req) {
            // Server Üzerinde Calisiyoruz....
            if (!req.headers.cookie) {
                return;
            }
            token = req.headers.cookie.split(";").find(c => c.trim().startsWith("bearerToken="))
            if (token) {
                token = token.split("=")[1]
                vuexContext.commit('setIsLoggedIn', true)
            }
            console.log("req.headers.cookie ", token)
        }
        else{
            // clientda çalışıyor
            token = Cookies.get('bearerToken')
            if (token) {
                vuexContext.commit('setIsLoggedIn', true)
            }
        }
    },
    async registerAction({ commit }, inputData) {
        console.log("inputData ", inputData)
        const email = inputData.email
        const password = inputData.password
        const password_confirmation = inputData.password_confirmation
        const name = inputData.name
        const { data, error } = await request(`/register`, 'post', { name, email, password, password_confirmation})

        if (data) {
            Cookies.set('bearerToken', data.token)
            this.$router.push("/products")
            // commit('setAddProjectAction', { ...response })
            console.log(data, error)
        } 
    },
    async loginAction({ commit }, inputData) {
        const email = inputData.email
        const password = inputData.password
        const { data, error } = await request(`/login`, 'post', { email, password  })

        if (data) {
            Cookies.set('bearerToken', data.token)
            console.log('data', data)
            this.$router.push("/products")
            // commit('setAddProjectAction', { ...response })
            console.log("res: ",data, error)
        }
        
    },
}

export default {
    state, getters, mutations, actions
}
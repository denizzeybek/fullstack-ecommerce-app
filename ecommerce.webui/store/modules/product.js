import request from '@/services/request'
// import Cookies from 'js-cookie'

const state = {
    productList : [],
    productListGeneral : [],
    categoryNames : [], 
    productDetail : [],
    categoryList : []
}

const getters = {
    getProductList(state){
        return state.productList
    },
    getProductDetail(state){
        return state.productDetail
    },
    getCategoryList(state){
        return state.categoryList
    }
}

const mutations = {
    setProductList(state, data){
        state.productList = data
        state.productListGeneral = data
    }, 
    setSearchProductList(state, data){
        state.productList = data
        if(data == null){
            state.productList = state.productListGeneral
        }
    },
    setFilterList(state, type){
        state.productList = state.productListGeneral

        if(type != null){
            let productListArray = state.productList
            let newArray = productListArray.filter(product => product.category === type);
            // console.log("productListArray ", newArray)
            state.productList = newArray
        }   
        else{
            console.log("here")
            state.productList = state.productListGeneral
        }
    },
    setCategoryNames(state){
        let productListArray = state.productList
        let categoryNamesList = []
        for (var i = 0; i < productListArray.length; i++) {
            categoryNamesList.push(productListArray[i].name);
        }
        // console.log('categoryNamesList ', categoryNamesList)
        state.categoryNames = categoryNamesList
    },
    setProductDetail(state, data){
        state.productDetail = []
        state.productDetail.push(data)
    },
    setCategoryList(state, data){
        let result = data.map(a => a.category);
        return state.categoryList = result
    }
}

const actions = {
    async getProductListAction({commit}){
        const { data, error } = await request(`/products`, 'get')
        if (data) {
            // console.log(data, error)
            commit('setProductList', data)
        } 
    },
    async updateProductAction({commit}, input){
        let id = input.id
        const { data, error } = await request(`/updateProduct/`+id, 'put')
        if (data) {
            // console.log(data, error)
            commit('setProductList', data)
        } 
    },
    async deleteProductAction({commit}, id){ 
        const { data, error } = await request(`/deleteProduct/`+id, 'delete')
        if (data) {
            // console.log(data, error)
            commit('setProductList', data)
            this.$router.push('/products')
        } 
    },
    filterProductListAction({commit}, type){
        commit('setFilterList', type)
    },
    filterCategoryNameAction({commit}){
        commit('setCategoryNames')
    },
    async searchAction({commit}, searchData){
        // console.log("searchData ", searchData)
        const { data, error } = await request(`/products/search/` + searchData, 'get')
        if (data) {
            // console.log(data, error)
            commit('setSearchProductList', data)
        } 
        else{
            commit('setSearchProductList')
        }
    },
    async productDetailAction({commit}, id){
        const { data, error } = await request(`/products/` + id, 'get')
        if (data) {
            console.log(data, error)
            commit('setProductDetail', data)
        }  
    },
    async getCategoryListAction({commit}){
        const { data, error } = await request(`/getCategoryList`, 'get')
        if (data) {
            console.log(" category: ",data, error)
            commit('setCategoryList', data)
        }  
    },
    async updateProductAction({commit}, input){
        let id = input.id
        let name = input.name
        let description = input.description
        let price = input.price
        let category = input.category

        const { data, error } = await request(`/updateProduct/` + id, 'put', {name, description, price, category})
        if (data) {
            console.log("data: ",data, error)
            commit('setProductDetail', data)
        }  
    }
}

export default {
    state, getters, mutations, actions
}
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/H5YouKu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'H5YouKu',
      component: HelloWorld
    }
  ]
})

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Account from '../components/account/Account'
import Book from '../components/book/Book'
import Course from '../components/course/Course'
import Student from '../components/student/Student'
import Teacher from '../components/teacher/Teacher'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/findAccounts',
        component: Account
      },
      {
        path: '/findBooks',
        component: Book
      },
      {
        path: '/findCourses',
        component: Course
      },
      {
        path: '/findStudents',
        component: Student
      },
      {
        path: '/findTeachers',
        component: Teacher
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

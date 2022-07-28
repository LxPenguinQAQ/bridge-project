import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//路由懒加载
function resolveView(view) {
	return () => import(`@/views/${view}`)
}

const routes = [
	{
		path: '/',
		name: 'home',
		component: resolveView('Home'),
	},
	{
		path: '/Register',
		name: 'register',
		component: resolveView('Register')
	},
	{
		path: '/Skill',
		name: 'skill',
		component: resolveView('Skill')
	},
	{
		path: '/BtnPage',
		name: 'btnPage',
		component: resolveView('BtnPage')
	},
	{
		path: '/NodeTablePage',
		name: 'nodeTablePage',
		component: resolveView('NodeTablePage')
	},
	{
		path: '/CoordinatorTablePage',
		name: 'coordinatorTablePage',
		component: resolveView('CoordinatorTablePage')
	},
	{
		path: '/Temp',
		name: 'temp',
		component: resolveView('Temp')
	},
	{
		path: '/Star',
		name: 'star',
		component: resolveView('Star')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

// 添加路由守卫，需要携带token才能路由
router.beforeEach(({name}, from, next)=> {
	if (name === 'home' || name === 'register' || name === 'temp') {
		next();
	} else {
		if (sessionStorage.getItem('Token')) {
			next();
		} else {
			new Vue().$Message.info("please login")
			next('/');
		}
	}
})

export default router

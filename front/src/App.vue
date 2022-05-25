<template>
	<keep-alive>
		<router-view></router-view>
	</keep-alive>
</template>

<script>
	import Home from "./views/Home.vue"
	import BtnPage from "./views/BtnPage.vue"
	import Register from "./views/Register"
	import NodeTablePage from "./views/NodeTablePage.vue"
	export default {
		name: "App",
		components: {Home, BtnPage, Register, NodeTablePage}
	}
</script>

<style lang="css">
	
</style>

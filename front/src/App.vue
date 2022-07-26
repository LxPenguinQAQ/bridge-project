<template>
	<div :class="style">
		<Star v-if="isShow"/>
		<button @click="changeBackground" class="change">切换背景</button>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
	import Home from "./views/Home.vue"
	import BtnPage from "./views/BtnPage.vue"
	import Register from "./views/Register"
	import NodeTablePage from "./views/NodeTablePage.vue"
	import Star from "./views/Star.vue"
	export default {
		name: "App",
		components: {Home, BtnPage, Register, NodeTablePage, Star},
		data() {
			return {
				isShow: false,
				style: "main_1",
			}
		},
		methods: {
			changeBackground() {
				this.isShow = !this.isShow;
				this.style = this.style === "main_1" ? "main_2" : "main_1"; 
			}
		},
	}
</script>

<style>
	h2 {
		text-align: center;
		font-size: 25px;
		line-height: 50px;
	}

	button.change {
		position: fixed;
		left: 10px;
		bottom: 10px;
	}

	div.main_1 {
		background-color: #E9EEF3;
		min-height: 100%;
	}

	div.main_2 {
		background: radial-gradient(200% 100% at bottom center, #f7f7b6, #e96f92, #1b2947);
		background: radial-gradient(220% 105% at top center, #1b2947 10%, #75517d 40%, #e96f92 65%, #f7f7b6);
		background-attachment: fixed;
		min-height: 100%;
	}
</style>

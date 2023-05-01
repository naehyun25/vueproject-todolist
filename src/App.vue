<template>
	<nav class="navbar navbar-light bg-light">
		<div class="container-fluid justify-content-start">
			<router-link
				:to="{ name: 'Home' }"
				class="navbar-brand red"
				>망고노트</router-link
			>
			<div class="navbar-nav">
				<router-link
					class="nav-link active"
					:to="{ name: 'Todos' }"
					>망고의 일정목록</router-link
				>
			</div>
		</div>
	</nav>
	<div class="container">
		<router-view />
	</div>
	<Toast
		v-if="showToast"
		:message="toastMessage"
		:type="toastAlertType" />
</template>
<script>
	import Toast from "@/components/Toast.vue";
	import { useToast } from "@/composables/toast";
	export default {
		components: { Toast },
		setup() {
			const { showToast, toastMessage, toastAlertType, triggerToast } = useToast();
			return {
				showToast,
				toastMessage,
				toastAlertType,
				triggerToast,
			};
		},
	};
</script>
<style></style>

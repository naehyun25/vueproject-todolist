<template>
	<h1 v-if="editing">일정 상세 페이지</h1>
	<div v-if="loading">Loading...</div>
	<form
		v-else
		@submit.prevent="onSave">
		<div class="row">
			<div class="col-6">
				<Input
					label="일정명"
					:subject="todo.subject"
					:error="subjectError"
					@update-subject="updateTodoSubject" />
			</div>
			<div
				v-if="editing"
				class="col-6">
				<div class="form-group">
					<label>수행상태: </label>
					<button
						class="btn"
						:class="todo.completed ? 'btn-success' : 'btn-danger'"
						type="button"
						@click="toggleTodoStatus">
						{{ todo.completed ? "완료" : "미완료" }}
					</button>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label>일정내용:</label
					><textarea
						class="form-control"
						cols="30"
						rows="10"
						v-model="todo.body"></textarea>
				</div>
			</div>
		</div>
		<button
			class="btn btn-primary"
			:disabled="!todoUpdate">
			{{ editing ? "저장" : "등록" }}
		</button>
		<button
			class="btn btn-outline-dark ms-2"
			@click="moveToTodoListPage">
			취소
		</button>
	</form>
	<transition name="fade">
		<Toast
			v-if="showToast"
			:message="toastMessage"
			:type="toastAlertType" />
	</transition>
</template>
<script>
	import { useRoute, useRouter } from "vue-router";
	import axios from "@/axios";
	import { ref, computed, onUnmounted, watchEffect } from "vue";
	import _ from "lodash";
	import Toast from "@/components/Toast.vue";
	import Input from "@/components/Input.vue";

	export default {
		props: {
			editing: { type: Boolean, default: false },
		},
		components: {
			Input,
			Toast,
		},
		setup(props) {

			const subjectError = ref("");
			const originalTodo = ref(null);
			const route = useRoute();
			const routers = useRouter();
			const todo = ref({
				subject: "",
				completed: false,
				body: "",
			});
			const loading = ref(false);
			const todoId = route.params.id;
			const url = "todos/";

			const showToast = ref(false);
			const toastMessage = ref("");
			const toastAlertType = ref("");
			const timeout = ref(null);

			watchEffect(() => {
				subjectError.value;
			});
			onUnmounted(() => {
				clearTimeout(timeout.value);
			});

			const triggerToast = (msg, type = "info") => {
				toastMessage.value = msg;
				toastAlertType.value = type;
				showToast.value = true;
				timeout.value = setTimeout(() => {
					toastMessage.value = "";
					toastAlertType.value = "";
					showToast.value = false;
				}, 5000);
			};

			const todoUpdate = computed(() => {
				return !_.isEqual(todo.value, originalTodo.value);
			});
			const toggleTodoStatus = () => {
				todo.value.completed = !todo.value.completed;
			};

			const onSave = () => {
				subjectError.value = "";
				if (!todo.value.subject) {
					subjectError.value = "일정명은 필수입력사항 입니다";
					return;
				}
				let response;
				axios({
					method: props.editing ? "put" : "post",
					url: props.editing ? `${url}${todoId}` : `${url}`,
					data: {
						subject: todo.value.subject,
						completed: todo.value.completed,
						body: todo.value.body,
					},
				})
					.then((res) => {
						console.log(props.editing);
						const message = `${props.editing ? "수정에" : "등록에"} 성공하였습니다`;
						triggerToast(message);
						if (!props.editing) {
							routers.push({
								name: "Todos",
							});
						} else {
							originalTodo.value = { ...res.data };
						}
					})
					.catch((err) => {
						console.error(err);
						triggerToast("일시적으로 오류가 발생했습니다. 잠시후 다시 이용해주세요", "danger");
					});
			};

			const getTodo = () => {
				loading.value = true;
				axios
					.get(`${url}${todoId}`)
					.then((res) => {
						todo.value = { ...res.data };
						originalTodo.value = { ...res.data };
						loading.value = false;
					})
					.catch((err) => {
						console.error(err);
						loading.value = false;
					});
			};
			if (props.editing) {
				getTodo();
			}

			const moveToTodoListPage = () => {
				routers.push({
					name: "Todos",
				});
			};

			const updateTodoSubject = (newVal) => {
				console.log("🐱‍🐉😻", newVal);
				todo.value.subject = newVal;
			};

			return {
				onSave,
				updateTodoSubject,
				toggleTodoStatus,
				triggerToast,
				subjectError,
				todo,
				toastAlertType,
				loading,
				moveToTodoListPage,
				todoUpdate,
				showToast,
				toastMessage,
			};
		},
	};
</script>
<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: all 1s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: translateY(-30px);
	}

	.fade-enter-to,
	.fade-leave-from {
		opacity: 1;
		transform: translateY(0px);
	}
</style>

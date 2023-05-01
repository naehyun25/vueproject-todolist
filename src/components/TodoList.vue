<template>
	<List :items="todos">
		<template #default="{ item, index }">
			<div
				class="d-flex p-2 align-item-center"
				@click="moveToPage(item.id)"
				style="cursor: pointer">
				<div class="flex-grow-1">
					<input
						type="checkbox"
						class="ml-2 mr-2"
						:checked="item.completed"
						@change="toggleTodo(index, $event)"
						@click.stop />
					<span :class="{ todo: item.completed }">{{ item.subject }}</span>
				</div>
				<div>
					<button
						class="btn btn-danger btn-sm"
						@click.stop="openModal(item.id)">
						삭제
					</button>
				</div>
			</div>
		</template>
	</List>
	<teleport to="#mango">
		<Modal
			v-if="showModal"
			@close="closeModal"
			@delete="deleteTodo" />
	</teleport>
</template>

<script>
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import Modal from "@/components/DeleteModal.vue";
	import List from "@/components/List.vue";

	export default {
		props: {
			todos: {
				type: Array,
				required: true,
			},
		},
		components: {
			Modal,
			List,
		},
		emits: ["toggle-todo", "delete-todo"],
		setup(props, { emit }) {
			const router = useRouter();
			let showModal = ref(false);
			let todoDelteId = ref(null);
			const toggleTodo = (index, event) => {
				emit("toggle-todo", index, event.target.checked);
			};
			const deleteTodo = () => {
				emit("delete-todo", todoDelteId.value);
				showModal.value = false;
				todoDelteId.value = null;
			};
			const moveToPage = (todoId) => {
				router.push({
					name: "Todo",
					params: {
						id: todoId,
					},
				});
			};
			const openModal = (id) => {
				todoDelteId.value = id;
				showModal.value = true;
			};
			const closeModal = () => {
				todoDelteId.value = null;
				showModal.value = false;
			};

			return {
				closeModal,
				toggleTodo,
				openModal,
				deleteTodo,
				showModal,
				moveToPage,
			};
		},
	};
</script>

<style>
	.form-check-label {
		cursor: pointer;
	}
</style>

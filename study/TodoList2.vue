<template>
    <div class="card" v-for="(i,index) in todos" :key="i.id">
        <div class="card-body p-2">
            <div class="d-flex">
                <div class="form-check flex-grow-1">
                    <label class="form-check-label" :class="{ todo: i.completed }">
                        <input :value="todos.completed" type="checkbox" class="form-check-input" @change="toggleTodo(index)" />
                        <!-- <input v-model="i.completed" type="checkbox" class="form-check-input"> -->
                        <!-- vue는 단방향 바인딩이여야함 // v-model 은 양방향 바인딩 //그래서 :value로 바꿔줌 -->
                        {{ i.subject }}
                    </label>
                </div>
                <div><button class="btn btn-danger btn-sm" @click="deleteTodo(i)">삭제</button></div>
            </div>
        </div>
    </div>
</template>
<!-- 
    자식이 부모에게 전달할 때는 emits 
    부모가 전달할때는 prop
-->

<script>
export default {
    props: {
        todos: {
            todos: Array,
            required: true,
        }
    },
    emits: ["toggle-todo"],
    seup(props, { emit }) {
        const toggleTodo = (index) => {
            emit("toggle-todo", index)
        }
        return { toggleTodo }
    }
}
</script>

<style></style>

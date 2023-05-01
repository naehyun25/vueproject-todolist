import { ref, onUnmounted, computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  const toastMessage = computed(() => store.state.toastMessage);
  const toastAlertType = computed(() => store.state.toastAlertType);
  const showToast = computed(() => store.state.showToast);
  const timeout = computed(() => store.state.timeout);

  onUnmounted(() => { clearTimeout(timeout.value) })
  const triggerToast = (message, type = 'info') => {
    store.dispatch('triggerToast', { message, type })
  }
  return {
    showToast, toastMessage, toastAlertType, triggerToast, timeout
  }
}

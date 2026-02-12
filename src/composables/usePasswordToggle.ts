import { ref } from 'vue';

export function usePasswordToggle(initial = false) {
    const showPass = ref(initial);
    const icon = () => showPass.value ? 'mdi-eye' : 'mdi-eye-off';
    const type = () => showPass.value ? 'text' : 'password';
    return { showPass, icon, type };
}
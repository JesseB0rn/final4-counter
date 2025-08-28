import { ref, watch } from "vue";

/**
 * useLocalStorage composable for Vue 3 (TypeScript)
 * @param key The localStorage key to use
 * @returns A ref bound to the value in localStorage
 */
export function useLocalStorage<T>(key: string, initialValue?: T) {
  const storedValue = localStorage.getItem(key);
  let parsedValue: T | undefined;
  try {
    parsedValue = storedValue ? JSON.parse(storedValue) : undefined;
  } catch (e) {
    parsedValue = undefined;
  }
  const data = ref<T | undefined>(parsedValue ?? initialValue);

  watch(
    data,
    (newVal) => {
      if (newVal === undefined) {
        localStorage.removeItem(key);
      } else {
        console.log(`Setting localStorage key "${key}" to`, newVal);
        localStorage.setItem(key, JSON.stringify(newVal));
      }
    },
    { deep: true }
  );

  return data;
}

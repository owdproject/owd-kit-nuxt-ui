<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  message: string
  onSuccess: () => void
}>()

const isOpen = ref(true)
</script>

<template>
  <UModal v-model="isOpen" prevent-close>
    <UCard :ui="{ ring: '', divide: 'y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
        </div>
      </template>

      <div class="flex items-start space-x-4">
        <div class="text-blue-500 flex-shrink-0 mt-0.5">
          <UIcon name="i-heroicons-information-circle" class="w-6 h-6" />
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300">
          {{ message }}
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="primary" @click="onSuccess">
            OK
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<template>
  <div>
    <div class="flex justify-between items-center">
      <label for="with-corner-hint" class="block text-sm font-medium mb-2 dark:text-white"
        >{{props.label}}</label>
      <span class="block text-sm text-gray-500 mb-2">{{props.hint}}</span>
    </div>
    <input
      :type="props.type"
      :id="label+'id'"
      class="py-3 px-4 block w-full border-gray-600 ring-1 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
      :placeholder="props.placeholder"
      :value="props.value"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>
<script setup lang="ts">
const props= defineProps({
  label: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }

})

</script>

<style scoped></style>

<template>
  <div>
    <label
      v-if="props.label"
      for=""
      class="block pl-3 ml-px text-sm font-medium text-gray-700"
    >
      {{ props.label }}
    </label>

    <input
      :type="props.type"
      :value="props.modelValue"
      class="block px-4 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      :placeholder="props.placeholder"
      @input="(event) => emits('update:modelValue', event.target.value)"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },

  placeholder: {
    type: String,
    default: '',
  },

  label: {
    type: String,
  },

  type: {
    type: String,
    default: 'text',
  },
})

const emits = defineEmits(['update:modelValue'])
</script>

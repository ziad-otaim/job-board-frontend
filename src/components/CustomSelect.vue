<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: [String, Number], // The current selected value
  options: {
    // Options for the select dropdown
    type: Array,
    required: true,
    default: () => [],
  },
  label: {
    // Optional label for the select
    type: String,
    default: "",
  },
  placeholder: {
    // Optional placeholder text
    type: String,
    default: "Select an option...",
  },
});

const emits = defineEmits(["update:modelValue"]);

const selectedValue = ref(props.modelValue);

watch(selectedValue, (newValue) => {  
  emits("update:modelValue", newValue);
});
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label">{{ label }}</label>
    <select class="form-select" v-model="selectedValue">
      <option disabled value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

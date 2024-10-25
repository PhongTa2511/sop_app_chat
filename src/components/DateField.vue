<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <VMenu
    v-model="menu"
    transition="scale-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ props: on }">
      <VTextField
        v-bind="on"
        readonly=""
        :label="props.label"
        :model-value="dateStr"
        :rules="rules"
        append-inner-icon="mdi-calendar"
        :density="props.density"
        @click="menu = true"
        @click:append-inner="menu = true"
        :style="'width:' + props.width"
        :disabled="disabled"
      />
    </template>

    <VDatePicker2 v-model="selectedDate" expanded mode="date" locale="vi" />
  </VMenu>
</template>

<script setup>
import { useDate } from "@/utils/date";
import { computed } from "vue";
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: {
    type: Date,
  },
  rules: {
    type: Array,
  },
  label: {
    type: String,
  },
  density: {
    type: String,
    default: "compact",
  },
  width: {
    type: String,
    default: "180px",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
const selectRef = ref(null);
const date = useDate();
const menu = ref(null);

const selectedDate = computed({
  get() {
    if (props.modelValue) {
      return props.modelValue;
    } else {
      return null;
    }
  },
  set: (value) => {
    emit("update:modelValue", value);
    emit("change", value);
  },
});

watch(selectedDate, (newValue, oldValue) => {
  menu.value = false;
});

const dateStr = computed(() => {
  if (props.modelValue) {
    return date.formatDate(props.modelValue, "DD/MM/yyyy");
  }

  return null;
});
</script>

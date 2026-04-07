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
        :readonly="readonly"
        :label="props.label"
        :model-value="dateStr"
        :rules="rules"
        append-inner-icon="mdi-calendar"
        :density="props.density"
        :style="'width:' + props.width"
        :disabled="disabled"
        :class="className"
        @click="menu = !readonly"
        @click:append-inner="menu = !readonly"
      />
    </template>

    <VDatePicker2
      v-model="selectedDate"
      mode="date"
      locale="vi"
    />
  </VMenu>
</template>

<script setup>
import { useDate } from "@/utils/date"
import { computed, ref, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
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
  readonly: {
    type: Boolean,
    default: false,
  },
  className: {
    type: Object,
    default: {},
  },
})

const emit = defineEmits(["update:modelValue", "change"])
const date = useDate()
const menu = ref(null)

const selectedDate = computed({
  get() {
    if (props.modelValue) {
      return props.modelValue
    } else {
      return null
    }
  },
  set: value => {
    emit("update:modelValue", value)
    emit("change", value)
  },
})

watch(selectedDate, (newValue, oldValue) => {
  menu.value = false
})

const dateStr = computed(() => {
  if (props.modelValue) {
    return date.formatDate(new Date(props.modelValue), "DD/MM/yyyy")
  }

  return null
})
</script>

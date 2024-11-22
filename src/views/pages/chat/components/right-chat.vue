<template>
  <div v-if="groupInfo">
    <div class="d-flex align-center justify-center">
      <v-avatar size="80">
        <v-img
          alt="John"
          src="https://cdn.vuetifyjs.com/images/john.jpg"
        ></v-img>
      </v-avatar>
    </div>

    <div class="text-center font-weight-bold text-h6">
      {{ groupInfo.GroupName }}
    </div>
    <div class="text-center text-subtitle-2">
      {{ groupInfo.TimeShow }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupInfo: Object,
  },
};
</script>

<style></style>

<template>
  <div class="layout-wrapper layout-blank">
    <RouterView />
  </div>
  <Notifications />
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>

<template>
  <v-row>
    <v-col :lg="8" :cols="12">
      <v-select placeholder="Chọn máy chấm công" class="mb-3"></v-select>
      <CardSolid />

      <VCard class="mt-6">
        <div class="d-flex flex-column-reverse flex-md-row">
          <div>
            <VCardItem>
              <VCardTitle>Stumptown Roasters</VCardTitle>
            </VCardItem>

            <VCardText class="d-flex align-center flex-wrap text-body-1">
              <VRating
                :model-value="5"
                readonly
                class="me-3"
                density="compact"
              />
              <span>5 Star | 98 reviews</span>
            </VCardText>

            <VCardText>
              Before there was a United States of America, there were coffee
              houses, because how are you supposed to build.
            </VCardText>

            <VCardActions>
              <VBtn>Location</VBtn>
              <VBtn>Reviews</VBtn>
            </VCardActions>
          </div>

          <div class="ma-auto pa-5">
            <VImg :width="176" :src="pages5" class="rounded" />
          </div>
        </div>
      </VCard>
    </v-col>
    <v-col :lg="4" :cols="12">
      <v-card>
        <v-card-title class="mt-3">Danh sách checkin</v-card-title>

        <v-list
          lines="two"
          height="calc(100vh - 230px)"
          style="overflow-y: scroll"
        >
          <v-list-item v-for="item in items" :key="item.title" link>
            <template v-slot:prepend>
              <v-avatar>
                <v-img
                  alt="John"
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                ></v-img>
              </v-avatar>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>

            <template v-slot:append>
              <v-list-item-action>
                <v-btn
                  v-if="item.status == 1"
                  color="success"
                  icon="mdi-check-circle-outline"
                  variant="text"
                ></v-btn>
                <v-btn
                  v-else
                  color="error"
                  icon="mdi-alert-circle"
                  variant="text"
                ></v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CardSolid from "../cards/card-basic/CardSolid.vue";
export default {
  components: {
    CardSolid,
  },
  data() {
    return {
      items: [
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Bùi Văn Thành",
          subtitle: "08:00 01-09-2014",
          status: 1,
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Recipes",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Work",
          subtitle: "08:00 01-09-2014",
          status: 1,
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Bùi Văn Thành",
          subtitle: "08:00 01-09-2014",
          status: 1,
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Recipes",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Work",
          subtitle: "08:00 01-09-2014",
          status: 1,
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Bùi Văn Thành",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Recipes",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Work",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Bùi Văn Thành",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Recipes",
          subtitle: "08:00 01-09-2014",
        },
        {
          icon: "mdi-folder",
          iconClass: "bg-grey-lighten-1 text-white",
          title: "Work",
          subtitle: "08:00 01-09-2014",
        },
      ],
    };
  },
};
</script>

<style></style>

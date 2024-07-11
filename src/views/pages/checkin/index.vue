<template>
  <v-row>
    <v-col :lg="8" :cols="12">
      <v-select placeholder="Chọn máy chấm công"></v-select>
      <div style="line-height: 48px">Checkin gần nhất</div>
      <CardSolid />

      <VCard class="mt-6">
        <VCardItem>
          <VCardTitle class="mb-4">Thống kê trong ngày</VCardTitle>
          <v-row>
            <v-col :cols="4">
              <v-card color="primary" class="py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <p>
                    <span class="text-h2 font-weight-medium">189</span>
                  </p>

                  <p class="text-sm">
                    Checkin <br />
                    Đúng giờ
                  </p>
                </div>
              </v-card>
            </v-col>
            <v-col :cols="4">
              <v-card color="error" class="py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <p>
                    <span class="text-h2 font-weight-medium">11</span>
                  </p>

                  <p class="text-sm">
                    Checkin <br />
                    Quá giờ
                  </p>
                </div>
              </v-card>
            </v-col>
            <v-col :cols="4">
              <v-card color="secondary" class="py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <p>
                    <span class="text-h2 font-weight-medium">9</span>
                  </p>

                  <p class="text-sm">
                    Checkin <br />
                    Chưa đến
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </VCardItem>
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

<style>
.custom {
  color: #71dd374d;
}
</style>

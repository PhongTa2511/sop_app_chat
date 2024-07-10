<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 30px">TẤT CẢ NHÂN VIÊN</div>
        <div class="d-flex">
          <v-select
            placeholder="Chọn chi nhánh"
            density="compact"
            style="width: 300px"
            class="mr-2"
          ></v-select>

          <span>
            <v-menu
              v-model="isMenuSearch"
              activator="parent"
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="tonal"
                  style="height: 40px"
                  class="mr-1"
                  v-bind="props"
                  ><v-icon> mdi-account-plus </v-icon>
                </v-btn>
              </template>
              <v-card width="300">
                <v-card-text>
                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="loadding"
                    @click="searchHistoryUser"
                  >
                    Thêm file excel</v-btn
                  >
                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="loadding"
                    @click="searchHistoryUser"
                  >
                    Thêm nhân viên</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-menu>
          </span>
        </div>
      </div>
      <VCard>
        <v-data-table
          :items-length="desserts.length"
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="desserts"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="calc(100vh - 210px)"
        >
          <template v-slot:item.UnitPrice="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.UnitPrice) }}
          </template>
          <template v-slot:item.Amount="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.Amount) }}
          </template>
          <template v-slot:item.AmountVAT="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.AmountVAT) }}
          </template>
        </v-data-table>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
export default {
  data() {
    return {
      isMenuSearch: false,
      desserts: [
        {
          name: "African Elephant",
          species: "Loxodonta africana",
          diet: "Herbivore",
          habitat: "Savanna, Forests",
        },
        // ... more items
      ],
      headers: [
        { title: "STT", sortable: false, key: "Key", align: "center" },
        { title: "Mã sp", key: "name", sortable: false, align: "center" },
        { title: "Sản phẩm", key: "species", sortable: false },
        { title: "SL", key: "diet", sortable: false, align: "center" },
        { title: "Giá", key: "habitat", sortable: false, align: "center" },
      ],
    };
  },
};
</script>

<style></style>

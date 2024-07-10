<template>
  <VRow>
    <VCol cols="6">
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 38px">DANH SÁCH CHI NHÁNH</div>
        <v-btn variant="tonal">
          <v-icon> mdi-plus-box-multiple </v-icon>
        </v-btn>
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
          height="250px"
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

    <VCol cols="6">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 38px">PHÒNG BAN TRONG CHI NHÁNH</div>
        <v-btn variant="tonal">
          <v-icon> mdi-plus-box-multiple </v-icon>
        </v-btn>
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
          height="250px"
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
    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 38px">NHÂN VIÊN TRONG PHÒNG BAN</div>
        <v-btn variant="tonal">
          <v-icon> mdi-plus-box-multiple </v-icon>
        </v-btn>
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
          height="500px"
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

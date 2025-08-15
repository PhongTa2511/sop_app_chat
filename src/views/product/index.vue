<template>
  <v-card class="py-4">
    <v-data-table
      :items-per-page="pageSize"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      :search="inputSearch"
      height="calc(100vh - 210px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-3">
          <!-- <span>
            <v-select
              v-model="optionStatus"
              :items="optionStatusLst"
              label="Địa bàn"
              item-title="label"
              item-value="value"
              class="ml-1"
              style="width: 220px !important"
              hide-details
            ></v-select>
          </span> -->

          <span>
            <v-text-field
              v-model="inputSearch"
              label="Tìm kiếm"
              hide-details
              style="width: 250px !important"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </span>

          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            style="height: 42px"
            @click="getProductLst"
          ></v-btn>
        </div>
      </template>

      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <!-- <v-icon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="editSchedule(item)"
          >mdi-note-edit</v-icon
        > -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { GetProductLst } from "@/api/productApi";
import {
  formatDate,
  formatDateDisplayDDMMYY,
  formatDateUpload,
} from "@/helpers/getTime";
export default {
  data() {
    return {
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Mã BFO", key: "BFO", sortable: false },
        { title: "Sản phẩm", key: "ProductName", sortable: false },
        { title: "Số lô", key: "Lotcode", sortable: false },
        { title: "Sl", key: "Quantity", sortable: false },
        { title: "Đơn vị", key: "Unit", sortable: false },
        { title: "Trạng thái", key: "StatusText", sortable: false, width: 120 },
        {
          title: "Hạn dùng",
          key: "ExpDateShow",
          sortable: false,
          width: 100,
        },
        {
          title: "Quyết định",
          key: "Decision",
          sortable: false,
        },
        {
          title: "Ghi chú",
          key: "Note",
          sortable: false,
        },
      ],
      pageSize: 10,
      currentPage: 1,
      productLst: [],
      totalLength: 0,
    };
  },
  methods: {
    getProductLst() {
      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: this.inputSearch,
      };
      GetProductLst(requestData).then((res) => {
        if (res.RespCode == 0) {
          this.productLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            };
          });
          this.totalLength = res.TotalRows;
        }
      });
    },
  },
  created() {
    this.getProductLst();
  },
};
</script>

<style></style>

<template>
  <v-card class="py-2 pb-0">
    <v-data-table-server
      :items-per-page="pageSize"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 250px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      :loading="loadding"
      fixed-header
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-1 px-2">
          <span>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                >
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-text-field
                    v-model="product"
                    label="Sản phẩm"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="name2"
                    label="Tên xuất khẩu"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="country"
                    label="Nước xk"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="area"
                    label="Khu vực"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-text-field
                    v-model="storeType"
                    label="Phân loại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-btn block class="rounded mt-2" @click="getProductLst"
                    >Tìm kiếm</v-btn
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </span>

          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getProductLst"
          ></v-btn>
          <!-- <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="openCreateProductDialog"
          ></v-btn> -->
        </div>
      </template>

      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowInfo(item)"
          >mdi-note-edit</v-icon
        >
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import { GetDefaultValue } from "@/api/default";
import { GetProductLst } from "@/api/productApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
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
        { title: "Mã", key: "ProductID", sortable: false },
        { title: "Sản phẩm", key: "ProductName", sortable: false },
        { title: "Tên xuất khẩu", key: "ProductExport", sortable: false },
        { title: "Nước xk", key: "Country", sortable: false },
        { title: "Khu vực", key: "Area", sortable: false, width: 120 },
        { title: "Phân loại", key: "StoreType", sortable: false },

        {
          title: "Người tạo",
          key: "CreateName",
          sortable: false,
        },
      ],
      pageSize: 25,
      currentPage: 1,
      productLst: [],
      totalLength: 0,
      loadding: false,
      product: "",
      name2: "",
      country: "",
      area: "",
      storeType: "",
      areaLst: [],
      typeStorageLst: [],
      productDefaultLst: [],
      isCreateProductDialog: false,
      newProduct: {},
    };
  },
  watch: {
    pageSize(value) {
      this.getProductLst();
    },
    currentPage(value) {
      this.getProductLst();
    },
    "newProduct.Country"(value) {
      this.newProduct.Area = this.areaLst.find(
        (p) => p.ValueName == value
      ).ValueName2;
    },
  },
  methods: {
    btShowInfo(data) {
      this.$router.push("/thong-tin-san-pham/" + data.ProductID);
    },

    btPage(data) {
      this.currentPage = data;
    },
    btRow(data) {
      this.pageSize = data;
    },
    getProductLst() {
      this.loadding = true;
      const searchString = [
        this.product,
        this.name2,
        this.country,
        this.area,
        this.storeType,
      ].join("|");
      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString + "|3",
      };
      GetProductLst(requestData).then((res) => {
        if (res.RespCode == 0) {
          this.productLst = res.Data.map((item, index) => {
            var num = this.pageSize * (this.currentPage - 1);
            return {
              ...item,
              Key: index + 1 + num,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            };
          });
          this.totalLength = res.TotalRows;
        }
        this.loadding = false;
      });
    },
    getDefaultValue() {
      GetDefaultValue({
        Table: "Khu vực",
      }).then((res) => {
        this.areaLst = res.DefaultValueLst;
      });
      GetDefaultValue({ Table: "Phân loại đối tượng" }).then((res) => {
        if (res.RespCode == 0) {
          this.typeStorageLst = res.DefaultValueLst;
        }
      });
      GetDefaultValue({ Table: "Sản phẩm" }).then((res) => {
        if (res.RespCode == 0) {
          this.productDefaultLst = res.DefaultValueLst;
        }
      });
    },
    openCreateProductDialog() {
      this.isCreateProductDialog = true;
    },
  },
  created() {
    this.getProductLst();
    this.getDefaultValue();
  },
};
</script>

<style></style>

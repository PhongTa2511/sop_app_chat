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
                    label="Số đăng ký"
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
                  <v-select
                    label="Trạng thái"
                    v-model="statusProduct"
                    :items="statusLst"
                    item-value="value"
                    item-title="text"
                    class="mt-2"
                  ></v-select>
                  <v-btn block class="rounded mt-2" @click="getProductLst2"
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
            @click="getProductLst2"
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

      <template v-slot:item.ProductID="{ item }">
        <div>
          {{ item.Key }}.
          <strong>
            {{ item.ProductName }}
          </strong>
        </div>
        <div>
          <v-chip size="x-small" color="primary">{{ item.ProductID }}</v-chip>
          <v-chip size="x-small" color="green">{{ item.StoreType }}</v-chip>
        </div>
        <div>
          {{ item.DangBaoChe }}
        </div>
      </template>
      <template v-slot:item.TieuChuanChatLuong="{ item }">
        <div>
          <strong>
            {{ item.TieuChuanChatLuong }}
          </strong>
          <v-chip size="x-small" color="red" v-if="item.HanDung">
            {{ item.HanDung }}
          </v-chip>
        </div>
      </template>
      <template v-slot:item.ProductExport="{ item }">
        <div>
          {{ item.ProductExport }}
        </div>
        <div style="color: green">
          {{ formatDateDisplayDDMMYY(item.NgayCapSoDangKy) }}
        </div>
        <div style="color: red">
          {{
            item.NgayHetHanSoDangKyHienTai.includes("T00:00:00")
              ? formatDateDisplayDDMMYY(item.NgayHetHanSoDangKyHienTai)
              : item.NgayHetHanSoDangKyHienTai
          }}
        </div>
        <div v-if="item.DotCap">
          <v-chip size="x-small" color="orange"
            >Đợt cấp: {{ item.DotCap }}</v-chip
          >
        </div>
      </template>
      <template v-slot:item.Action="{ item }">
        <div class="flex">
          <v-btn
            color="orange"
            size="x-small"
            style="cursor: pointer"
            @click="btShowInfo(item)"
            icon="mdi-note-edit"
            class="mr-1"
          ></v-btn>
          <v-btn
            color="red"
            size="x-small"
            style="cursor: pointer"
            icon="mdi-delete"
            @click="openDeleteDialog(item)"
          ></v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import { GetDefaultValue } from "@/api/default";
import { GetProductLst2 } from "@/api/productApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
export default {
  data() {
    return {
      headers: [
        { title: "Mã", key: "ProductID", sortable: false, width: 180 },
        { title: "Số đăng ký", key: "ProductExport", sortable: false },
        { title: "Hoạt chất", key: "HoatChat", sortable: false },

        {
          title: "Nồng độ, hàm lượng",
          key: "NongDoHamLuong",
          sortable: false,
        },

        { title: "Quy cách", key: "QuyCachDongGoi", sortable: false },
        { title: "TCCL", key: "TieuChuanChatLuong", sortable: false },

        {
          title: "",
          key: "Action",
          sortable: false,
          width: 100,
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
      statusLst: [
        {
          text: "Active",
          value: 100,
        },
        {
          text: "Stop",
          value: 0,
        },
      ],
      typeStorageLst: [],
      productDefaultLst: [],
      isCreateProductDialog: false,
      newProduct: {},
      statusProduct: 100,
    };
  },
  watch: {
    pageSize(value) {
      this.getProductLst2();
    },
    currentPage(value) {
      this.getProductLst2();
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
    formatDateDisplayDDMMYY,
    getProductLst2() {
      this.loadding = true;
      const searchString = [
        this.product,
        this.name2,
        "Việt Nam",
        this.area,
        this.storeType,
        this.statusProduct,
      ].join("|");
      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString,
      };
      GetProductLst2(requestData).then((res) => {
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
      // GetDefaultValue({
      //   Table: "Khu vực",
      // }).then((res) => {
      //   this.areaLst = res.DefaultValueLst;
      // });
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
    this.getProductLst2();
    this.getDefaultValue();
  },
};
</script>

<style></style>

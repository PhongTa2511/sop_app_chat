<template>
  <VCard class="py-2 pb-0">
    <VDataTableServer
      :items-per-page="pageSize"
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 250px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      @update:itemsPerPage="btRow"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      @update:page="btPage"
      :loading="loadding"
      fixed-header
    >
      <template #top>
        <div class="d-flex flex-wrap gap-1 px-2">
          <span>
            <VMenu :close-on-content-click="false">
              <template #activator="{ props }">
                <VBtn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                />
              </template>
              <VList>
                <VListItem>
                  <VTextField
                    v-model="product"
                    label="Sản phẩm"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />

                  <VTextField
                    v-model="name2"
                    label="Số đăng ký"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />

                  <VTextField
                    v-model="area"
                    label="Khu vực"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VTextField
                    v-model="storeType"
                    label="Phân loại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VSelect
                    v-model="statusProduct"
                    label="Trạng thái"
                    :items="statusLst"
                    item-value="value"
                    item-title="text"
                    class="mt-2"
                  />
                  <VBtn block class="rounded mt-2" @click="getProductLst2"
                    >Tìm kiếm</VBtn
                  >
                </VListItem>
              </VList>
            </VMenu>
          </span>

          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getProductLst2"
          />
          <!--
            <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="openCreateProductDialog"
            ></v-btn> 
          -->
        </div>
      </template>

      <template #item.ProductID="{ item }">
        <div>
          {{ item.Key }}.
          <strong>
            {{ item.ProductName }}
          </strong>
        </div>
        <div>
          <VChip size="x-small" color="primary">
            {{ item.ProductID }}
          </VChip>
          <VChip size="x-small" color="green">
            {{ item.StoreType }}
          </VChip>
        </div>
        <div>
          {{ item.DangBaoChe }}
        </div>
      </template>
      <template #item.TieuChuanChatLuong="{ item }">
        <div>
          <strong>
            {{ item.TieuChuanChatLuong }}
          </strong>
          <VChip v-if="item.HanDung" size="x-small" color="red">
            {{ item.HanDung }}
          </VChip>
        </div>
      </template>
      <template #item.ProductExport="{ item }">
        <div>
          {{ item.ProductExport }}
        </div>
        <div style="color: green">
          {{ item.NgayCapSoDangKy }}
        </div>
        <div style="color: red">
          {{
            item.NgayHetHanSoDangKyHienTai?.includes("T00:00:00")
              ? formatDateDisplayDDMMYY(item.NgayHetHanSoDangKyHienTai)
              : item.NgayHetHanSoDangKyHienTai
          }}
        </div>
        <div v-if="item.DotCap">
          <VChip size="x-small" color="orange">
            Đợt cấp: {{ item.DotCap }}
          </VChip>
        </div>
      </template>
      <template #item.Action="{ item }">
        <div class="flex">
          <VBtn
            color="orange"
            size="x-small"
            style="cursor: pointer"
            icon="mdi-note-edit"
            class="mr-1"
            @click="btShowInfo(item)"
          />
          <VBtn
            color="red"
            size="x-small"
            style="cursor: pointer"
            icon="mdi-delete"
            @click="openDeleteDialog(item)"
          />
        </div>
      </template>
    </VDataTableServer>
  </VCard>
  <VDialog v-model="isDeleteDialog" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Xóa sản phẩm</span>
      </VCardTitle>
      <VCardText> Bạn có chắc chắn muốn xóa sản phẩm này? </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="grey" @click="isDeleteDialog = false"> Hủy </VBtn>
        <VBtn color="red" @click="confirmDelete"> Xóa </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { GetDefaultValue } from "@/api/default";
import { DelProduct, GetProductLst2 } from "@/api/productApi";
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
      isDeleteDialog: false,
      productToDelete: null,
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
  created() {
    this.getProductLst2();
    this.getDefaultValue();
  },
  methods: {
    delProduct(data) {
      DelProduct({
        ProductID: data.ProductID,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            type: "success",
          });
          this.getProductLst();
        } else {
          notify({
            title: "Thất bại",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    confirmDelete() {
      this.delProduct(this.productToDelete);
      this.isDeleteDialog = false;
      this.productToDelete = null;
    },
    openDeleteDialog(item) {
      this.productToDelete = item;
      this.isDeleteDialog = true;
    },
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
};
</script>

<style></style>

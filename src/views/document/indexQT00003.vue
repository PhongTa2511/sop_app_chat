<template>
  <VCard class="pt-2">
    <VDataTableServer
      :items-per-page="rowspPage"
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
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
        <div class="d-flex flex-wrap gap-2 px-2">
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
                    label="Tên sản phẩm"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />

                  <VTextField
                    v-model="type"
                    label="Phân loại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />

                  <VTextField
                    v-model="dosage"
                    label="Dạng bào chế"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />

                  <VTextField
                    v-model="ingredient"
                    label="Hoạt chất"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VTextField
                    v-model="numberRegister"
                    label="Số đăng ký"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VTextField
                    v-model="employeeNCV"
                    label="NCV phụ trách"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VTextField
                    v-model="employeeDKT"
                    label="ĐKT phụ trách"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />

                  <VBtn
                    block
                    class="rounded mt-2"
                    @click="getDocumentQT00003Lst"
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
            @click="getDocumentQT00003Lst"
          />
        </div>
      </template>
      <template #item.Status="{ item }">
        <VChip :color="getStatus(item.Status).color">
          {{ getStatus(item.Status).text }}
        </VChip>
      </template>
      <template #item.Action="{ item }">
        <VIcon
          color="green"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowProcess(item)"
        >
          mdi-progress-check
        </VIcon>
      </template>
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btPushToDocinfo(item)"
        >
          mdi-note-edit
        </VIcon>
      </template>
      <template #item.DocumentID="{ item }">
        {{ item.DocumentID }}
        <div style="color: rgb(var(--v-theme-primary))">
          {{ item.MaRD }}
        </div>
      </template>
    </VDataTableServer>
  </VCard>
</template>

<script>
import { GetDocumentQT00003Lst } from "@/api/briefApi";

export default {
  data() {
    return {
      searchDocumentID: "",
      fileLst: [],
      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,

      dataAll: [],
      loadding: false,
      headers: [
        {
          title: "STT",
          key: "Key",
          sortable: false,
          align: "center",
          width: 80,
        },
        { title: "Mã hồ sơ", key: "DocumentID", sortable: false },
        {
          title: "Tên sản phẩm",
          key: "TenSanPham",
          sortable: false,
          minWidth: 150,
        },
        { title: "PL", key: "PhanLoai", sortable: false },
        {
          title: "Dạng bào chế",
          key: "DangBaoChe",
          sortable: false,
          minWidth: 120,
        },
        { title: "Hoạt chất", key: "HoatChat", sortable: false, minWidth: 200 },
        {
          title: "Nồng độ, hàm lượng",
          key: "NongDoHamLuong",
          sortable: false,
          minWidth: 280,
        },
        {
          title: "Quy cách đóng gói",
          key: "QuyCachDongGoi",
          sortable: false,
          minWidth: 340,
        },
        {
          title: "TCCL",
          key: "TieuChuanChatLuong",
          sortable: false,
        },
        {
          title: "ĐK bảo quản",
          key: "DieuKienBaoQuan",
          sortable: false,
          minWidth: 120,
        },
        { title: "Hạn dùng", key: "HanDung", sortable: false, minWidth: 100 },
        {
          title: "Đăng ký",
          key: "NhaDangKy",
          sortable: false,
          minWidth: 100,
        },
        {
          title: "Sản xuất",
          key: "NhaSanXuat",
          sortable: false,
          minWidth: 100,
        },
        {
          title: "Phân phối",
          key: "NhaPhanPhoi",
          sortable: false,
          minWidth: 100,
        },
        {
          title: "Số đăng ký",
          key: "SoDangKy",
          sortable: false,
          minWidth: 150,
        },
        {
          title: "Ngày cấp số đk",
          key: "NgayCapSoDangKy",
          sortable: false,
          minWidth: 130,
        },
        {
          title: "Quyết định cấp số",
          key: "QuyetDinhCapSo",
          sortable: false,
          minWidth: 150,
        },
        {
          title: "HH số đk hiện tại",
          key: "NgayHetHanSoDangKyHienTai",
          sortable: false,
          minWidth: 150,
        },
        {
          title: "Thuốc ksđb",
          key: "PhanLoaiThuocKiemSoatDacBiet",
          sortable: false,
          minWidth: 80,
        },
        {
          title: "TT sản xuất",
          key: "TinhTrangSanXuat",
          sortable: false,
          minWidth: 150,
        },
        {
          title: "NCV phụ trách",
          key: "NghienCuuVienPhuTrachSanPham",
          sortable: false,
          minWidth: 150,
        },
        {
          title: "ĐKT phụ trách",
          key: "DangKyThuocPhuTrachSanPham",
          sortable: false,
          minWidth: 150,
        },
        {
          title: "CVDY công bố",
          key: "CVDYCongBoOnlineLienQuanNhan",
          sortable: false,
          minWidth: 120,
        },
        {
          title: "Cập nhật TT01/2018/BYT",
          key: "NhanToaHoSoDaCapNhatTT01",
          sortable: false,
        },

        { title: "Đợt Cấp", key: "DotCap", sortable: false },
        {
          title: "Hạn dùng cho XK",
          key: "HanDungChoXK",
          sortable: false,
          minWidth: 120,
        },
        {
          title: "Tiêu chuẩn được duyệt",
          key: "TieuChuanDuocDuyet",
          sortable: false,
          minWidth: 120,
        },
        { title: "Ghi chú", key: "GhiChu", sortable: false, minWidth: 120 },
        {
          title: "Phân Loại TTBYT",
          key: "PhanLoaiTTBYT",
          sortable: false,
          minWidth: 120,
          align: "center",
        },
      ],
      employeeDKT: "",
      employeeNCV: "",
      numberRegister: "",
      ingredient: "",
      dosage: "",
      type: "",
      product: "",
    };
  },
  watch: {
    pageNumber(value) {
      this.getDocumentQT00003Lst();
    },
    rowspPage(value) {
      this.getDocumentQT00003Lst();
    },
  },
  created() {
    this.getDocumentQT00003Lst();
  },
  methods: {
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },

    btPushToDocinfo(data) {
      this.$router.push("/thong-tin/" + data.DocumentID);
    },

    getDocumentQT00003Lst() {
      this.loadding = true;

      GetDocumentQT00003Lst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search:
          this.product +
          "|" +
          this.type +
          "|" +
          this.dosage +
          "|" +
          this.ingredient +
          "|" +
          this.numberRegister +
          "|" +
          this.employeeNCV +
          "|" +
          this.employeeDKT,
      }).then((res) => {
        this.fileLst = res.Data.map((item, index) => {
          var num = (this.pageNumber - 1) * this.rowspPage;

          return {
            ...item,
            Key: index + 1 + num,
            // NgayCapSoDangKy: item.NgayCapSoDangKy,
            // NgayHetHanSoDangKyHienTai:
            //   item.NgayHetHanSoDangKyHienTai == "Vô thời hạn"
            //     ? item.NgayHetHanSoDangKyHienTai
            //     : formatDateDDMMYY(item.NgayHetHanSoDangKyHienTai),
          };
        });
        this.totalLength = res.TotalRows;
        this.loadding = false;
      });
    },
  },
};
</script>

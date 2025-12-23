<template>
  <v-card class="pt-2">
    <v-data-table-server
      :items-per-page="rowspPage"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
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
        <div class="d-flex flex-wrap gap-2 px-2">
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
                    label="Tên sản phẩm"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="type"
                    label="Phân loại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="dosage"
                    label="Dạng bào chế"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="ingredient"
                    label="Hoạt chất"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-text-field
                    v-model="numberRegister"
                    label="Số đăng ký"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-text-field
                    v-model="employeeNCV"
                    label="NCV phụ trách"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-text-field
                    v-model="employeeDKT"
                    label="ĐKT phụ trách"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-btn
                    block
                    class="rounded mt-2"
                    @click="getDocumentQT00003Lst"
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
            @click="getDocumentQT00003Lst"
          ></v-btn>
        </div>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip :color="getStatus(item.Status).color">
          {{ getStatus(item.Status).text }}</v-chip
        >
      </template>
      <template v-slot:item.Action="{ item }">
        <v-icon
          color="green"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowProcess(item)"
          >mdi-progress-check</v-icon
        >
      </template>
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btPushToDocinfo(item)"
          >mdi-note-edit</v-icon
        >
      </template>
      <template v-slot:item.DocumentID="{ item }">
        {{ item.DocumentID }}
        <div style="color: rgb(var(--v-theme-primary))">{{ item.MaRD }}</div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import { GetDocumentQT00003Lst } from "@/api/briefApi";
import { formatDateDDMMYY } from "@/helpers/getTime";

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
            NgayCapSoDangKy: formatDateDDMMYY(item.NgayCapSoDangKy),
            NgayHetHanSoDangKyHienTai:
              item.NgayHetHanSoDangKyHienTai == "Vô thời hạn"
                ? item.NgayHetHanSoDangKyHienTai
                : formatDateDDMMYY(item.NgayHetHanSoDangKyHienTai),
          };
        });
        this.totalLength = res.TotalRows;
        this.loadding = false;
      });
    },
  },
  created() {
    this.getDocumentQT00003Lst();
  },
};
</script>

<template>
  <v-card class="pt-4">
    <v-data-table-server
      :items-per-page="rowspPage"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
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
      :loading="loadding"
      fixed-header
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-3">
          <span>
            <v-text-field
              v-model="searchDocumentID"
              label="Mã hồ sơ"
              hide-details
              style="width: 250px !important"
              clearable
            ></v-text-field>
          </span>
          <!-- <span>
            <v-text-field
              v-model="searchJobName"
              label="Công việc"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchNote"
              label="Hồ sơ"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="searchEmployeeName"
              label="Nhân viên"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-select
              v-model="optionStatus"
              placeholder="Trạng thái"
              density="compact"
              :items="optionStatusLst"
              item-value="value"
              item-title="label"
              chips
              style="width: 150px !important"
            ></v-select>
          </span> -->
          <!-- <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-playlist-plus"
            size="small"
            @click="isShowCreateDocument = true"
          ></v-btn> -->
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
    </v-data-table-server>
  </v-card>
  <!-- <v-dialog v-model="isShowProcess" width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Quá trình thực hiện</div>

        <v-btn
          icon="mdi-close"
          variant="text"
          rounded-full
          size="small"
          color="gray"
          @click="isShowProcess = false"
        ></v-btn>
      </v-card-title>
      <v-card-text>
        <v-card class="layout-card">
          <div
            v-for="(item, index) in processLst"
            :key="index"
            class="mx-2 my-2"
          >
            <div class="d-flex">
              <v-chip
                class="mr-2"
                :color="
                  item.Status == 1
                    ? 'blue'
                    : item.Status == 4
                    ? 'green'
                    : item.Status == 5
                    ? 'red'
                    : 'gray'
                "
              >
                {{ item.StepOrder }}
              </v-chip>
              {{ item.StepName }}
            </div>
            <v-sheet
              v-for="(job, indjob) in item.StepLst"
              :key="indjob"
              class="px-1 py-1 mt-1"
              rounded
              :border="
                job.Status == 1
                  ? 'blue md'
                  : job.Status == 4
                  ? 'green md'
                  : job.Status == 5
                  ? 'red md'
                  : 'gray md'
              "
            >
              <div class="text-body-2 position-relative">
                {{ job.JobName }}
                <v-icon
                  v-if="job.Status == 4"
                  class="position-absolute right-0"
                  color="green"
                  size="small"
                  >mdi-check-circle-outline</v-icon
                >
                <v-icon
                  v-if="job.Status == 5"
                  class="position-absolute right-0"
                  color="red"
                  size="small"
                  >mdi-close-circle-outline</v-icon
                >
              </div>
              <div v-for="(ass, indass) in job.AssignLst" :key="indass">
                <div class="text-caption" v-if="ass.UserRole == 'Xử lý'">
                  <div>
                    <v-icon color="blue" size="small">mdi-account-edit</v-icon>
                    {{ ass.FullName }}
                    <v-icon color="blue" size="small" v-if="job.TimeModifyShow"
                      >mdi-clock</v-icon
                    >
                    {{ job.TimeModifyShow }}
                  </div>
                  <div v-html="job.Report"></div>
                </div>
                <div class="text-caption" v-if="ass.UserRole == 'Phê duyệt'">
                  <div>
                    <v-icon color="red" size="small">mdi-account-check</v-icon>
                    {{ ass.FullName }}
                    <v-icon color="red" size="small" v-if="job.TimeApproveShow"
                      >mdi-clock</v-icon
                    >
                    {{ job.TimeApproveShow }}
                  </div>
                  <div v-html="job.NoteApprove"></div>
                </div>
                <div class="file-lst" v-if="ass.FileLst.length > 0">
                  <v-menu
                    location="end"
                    v-for="(file, indfile) in ass.FileLst"
                    :key="indfile"
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip color="gray" v-bind="props" class="mr-1">
                        {{ file.MineFile }}
                      </v-chip>
                    </template>

                    <v-list>
                      <v-list-item v-if="isPreviewSupported(file.MineFile)">
                        <v-list-item-title>
                          <v-btn
                            @click="previewFile(file)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-title>
                          <v-btn
                            @click="downloadFile(file)"
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-download</v-icon> Tải
                            ngay
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-sheet>
            <v-divider class="my-2" color="blue"></v-divider>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowConfirm" width="400">
    <v-card>
      <v-card-title>Phê duyệt hồ sơ</v-card-title>
      <v-card-text>
        <v-select
          v-model="statusConfirm"
          :items="optionConfirmLst"
          item-text="label"
          item-value="value"
          label="Trạng thái"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowConfirm = false" text>Hủy</v-btn>
        <v-btn color="green" @click="confirmBrief">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowCreateDocument" max-width="600">
    <v-card>
      <v-card-title>Tạo hồ sơ mới</v-card-title>
      <v-card-text>
        <v-select
          placeholder="Chọn loại quy trình"
          density="compact"
          v-model="createDocument.TypeDoc"
          :items="procedureLst"
          item-value="ProcedureID"
          item-title="ProcedureName"
          chips
          class="mb-2"
        ></v-select>
        <v-textarea
          v-model="createDocument.Note"
          label="Mô tả"
          required
          :rows="2"
          class="mb-2"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowCreateDocument = false" text>Hủy</v-btn>
        <v-btn color="green" @click="btCreateDocument">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowFile" persistent width="800">
    <v-card>
      <v-card-item>
        <div v-if="isLoading">Đang tải...</div>
        <div v-else>
          <strong>{{ nameFile }}</strong>
          <div v-if="fileMine == '.pdf'">
            <iframe
              :src="
                'https://docs.google.com/gview?embedded=true&url=' +
                encodeURIComponent(fileUrl)
              "
              width="100%"
              height="600px"
            ></iframe>
          </div>
          <div v-else>
            <div
              v-html="docContent"
              style="height: calc(100vh - 200px); overflow: auto"
            ></div>
          </div>
        </div>
      </v-card-item>
      <v-card-actions>
        <v-btn @click="isShowFile = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>

<script>
import {
  GetDocumentQT00003Lst,
  UpdateGSPDocument,
  CreateGSPDocument,
} from "@/api/briefApi";

import { GetProcedureLst } from "@/api/procedureApi";
import { ProcessDocument } from "@/api/documentJobApi";
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime";
import {
  fetchXlsxContent,
  fetchDoc,
  isPreviewSupported,
  downloadFile,
} from "@/utils/function";
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
          minWidth: 200,
        },
        {
          title: "Quy cách đóng gói",
          key: "QuyCachDongGoi",
          sortable: false,
          minWidth: 280,
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
        {
          title: "Bản TC nộp đi",
          key: "BanTieuChuanNopDiTrongHSBS",
          sortable: false,
          minWidth: 120,
        },
        // { title: "Hạn dùng cho XK", key: "HanDungChoXK", sortable: false },
        {
          title: "Gia hạn hay chưa",
          key: "DaCoGiaHanHayChua",
          sortable: false,
          minWidth: 100,
        },
        {
          title: "SĐK gia hạn",
          key: "SDKGiaHan",
          sortable: false,
          minWidth: 120,
        },
      ],
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
        Search: this.searchDocumentID,
      }).then((res) => {
        this.fileLst = res.Data.map((item, index) => {
          var num = (this.pageNumber - 1) * this.rowspPage;
          return {
            ...item,
            Key: index + 1 + num,
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

<style lang="scss" scoped>
.layout-card {
  min-height: 250px;
  max-height: calc(100vh - 150px);
  overflow-y: scroll;
  margin-bottom: -10px;
  margin-top: -20px;
  &::-webkit-scrollbar-track-piece {
    background: #ffffff;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bec5ce;
    border-radius: 20px;
  }
  .file-lst {
    display: flex;
    overflow: scroll;
    padding: 4px 0;
    margin-bottom: 4px;
    &::-webkit-scrollbar-track-piece {
      background: #ffffff;
    }

    &::-webkit-scrollbar {
      width: 8px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #bec5ce;
      border-radius: 20px;
    }
    .v-chip {
      min-width: 60px;
    }
  }
  .file {
    margin-right: 4px;
    // margin-bottom: 4px;
    max-width: 250px !important;
    min-width: 60px;
    white-space: normal;
    position: relative;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>

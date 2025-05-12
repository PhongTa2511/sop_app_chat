<template>
  <v-card class="pt-4">
    <v-card-title class="pt-0 pl-3">Danh sách phiếu khiếu nại</v-card-title>
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
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-3">
          <span>
            <v-text-field
              v-model="searchString"
              label="Tìm kiếm"
              hide-details
              style="width: 250px !important"
              clearable
            ></v-text-field>
          </span>

          <!-- <span>
            <v-select
              v-model="optionStatus"
              placeholder="Trạng thái"
              density="compact"
              :items="optionStatusLst"
              item-value="value"
              item-title="label"
              chips
              style="width: 220px !important"
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
            @click="getDocumentFormLstPublic"
          ></v-btn>
        </div>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip :color="getStatus(item.Status).color" size="small">
          {{ getStatus(item.Status).text }}</v-chip
        >
      </template>

      <template v-slot:item.Key="{ item }">
        {{ item.Key }}

        <v-btn
          size="x-small"
          icon
          @click="btPushToDocinfo(item)"
          class="mr-1"
          v-if="item.DocumentID"
        >
          <v-icon>mdi-list-box</v-icon>
          <v-tooltip activator="parent" location="top">Xem hồ sơ</v-tooltip>
        </v-btn>
        <v-btn
          v-else
          size="x-small"
          class="mr-1"
          icon
          @click="btShowCreateDocument(item)"
          color="green"
        >
          <v-icon>mdi-note-plus</v-icon>
          <v-tooltip activator="parent" location="top"
            >Tạo hồ sơ xử lý khiếu nại</v-tooltip
          >
        </v-btn>
        <v-btn size="x-small" icon @click="btShowForm(item)" color="orange">
          <v-icon>mdi-account-file-text</v-icon>
          <v-tooltip activator="parent" location="top"
            >Xem thông tin phiếu khiếu nại</v-tooltip
          >
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>

  <v-dialog v-model="isShowCreateDocument" max-width="500">
    <v-card>
      <v-card-title>Tạo hồ sơ xử lý khiếu nại</v-card-title>
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
  <v-dialog v-model="isShowFile" persistent width="600">
    <v-card class="px-6 py-4">
      <v-card-title class="pl-2">Thông tin phiếu khiếu nại</v-card-title>
      <v-form ref="form" v-if="formFields.length">
        <div v-for="field in formFields" :key="field.RowID" class="mb-2">
          <v-text-field
            v-if="field.Type === 1"
            v-model="field.TextResult"
            :label="field.Parameter"
            readonly
          />

          <v-select
            v-else-if="field.Type === 2"
            v-model="field.TextResult"
            :label="field.Parameter"
            :items="parseOptions(field.OptionAnswer)"
            item-title="Name"
            item-value="Name"
            readonly
            hide-details
          />
        </div>
      </v-form>
      <v-card-actions>
        <v-btn @click="isShowFile = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  GetGSPDocumentLst,
  UpdateGSPDocument,
  CreateGSPDocument,
} from "@/api/briefApi";
import { GetDocumentFormLstPublic } from "@/api/documentFormApi";

import { GetProcedureLst } from "@/api/procedureApi";
import {
  formatDate,
  formatDateDisplay,
  formatDateDisplayDDMMYY,
  formatDateHHDDMM,
} from "@/helpers/getTime";
import {
  fetchXlsxContent,
  fetchDoc,
  isPreviewSupported,
  downloadFile,
} from "@/utils/function";
export default {
  data() {
    return {
      fileLst: [],
      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,
      optionStatusLst: [
        { value: 1, label: "Mới tạo" },
        { value: 2, label: "Đang làm" },
        { value: 4, label: "Hoàn thành" },
        { value: 0, label: "Tất cả" },
      ],

      dataAll: [],
      loadding: false,

      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 120,
        },
        { title: "Phiếu", key: "NameForm", sortable: false },
        { title: "Đơn vị khiếu nại", key: "ComName", sortable: false },
        { title: "Sản phẩm khiếu nại", key: "ProductName", sortable: false },
        { title: "Người khiếu nại", key: "PersonName", sortable: false },
        {
          title: "Thời gian",
          key: "TimeCreateShow",
          sortable: false,
          width: 160,
        },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],

      productExcelLst: [],
      isShowCreateDocument: false,
      createDocument: {
        name: "",
        description: "",
      },

      isLoading: false,
      searchString: "",
      formFields: [],
      isShowFile: false,
      rowForm: 0,
    };
  },
  watch: {
    pageNumber(value) {
      this.getDocumentFormLstPublic();
    },
    rowspPage(value) {
      this.getDocumentFormLstPublic();
    },
  },
  methods: {
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    btShowForm(data) {
      console.log(data);

      this.formFields = data.DocumentFormLineLst;
      this.isShowFile = true;
    },
    parseOptions(optionAnswer) {
      return optionAnswer.split(";").map((item) => {
        const [Name, Value] = item.split(":");
        return { Name, Value };
      });
    },
    btShowCreateDocument(data) {
      this.rowForm = data.RowID;
      this.isShowCreateDocument = true;
    },
    btPushToDocinfo(data) {
      this.$router.push("/thong-tin/" + data.DocumentID);
    },

    getDocumentFormLstPublic() {
      this.loadding = true;

      GetDocumentFormLstPublic({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: this.searchString,
      }).then((res) => {
        this.fileLst = res.Data.map((item, index) => {
          var num = (this.pageNumber - 1) * this.rowspPage;
          return {
            ...item,
            Key: index + 1 + num,
            TimeCreateShow: formatDateDisplay(item.TimeCreate),
          };
        });
        this.totalLength = res.TotalRows;
      });
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "blue" };
      }
      if (status == 4) {
        return { text: "Đã tạo HS", color: "success" };
      }

      return { text: "Tạm dừng", color: "more" };
    },

    btCreateDocument() {
      CreateGSPDocument({
        DocumentInfo: {
          TypeDoc: this.createDocument.TypeDoc,
          Note: this.createDocument.Note,
          Data: this.productExcelLst,
          ComID: this.rowForm,
        },
      }).then((res) => {
        // Updated to use createDocument
        if (res.RespCode === 0) {
          notify({
            title: "Tạo hồ sơ",
            text: "Hồ sơ đã được tạo thành công",
            type: "success",
          });
          this.isShowCreateDocument = false; // Close dialog
          this.getDocumentFormLstPublic(); // Refresh the document list
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },

    getProcedureLst() {
      GetProcedureLst({
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      })
        .then((res) => {
          if (res.RespCode === 0) {
            this.procedureLst = res.Data.filter((p) =>
              "QT01022,QT01023,QT01024".includes(p.ProcedureID)
            ); // Assuming you want to store the result in procedureLst
          } else {
            notify({
              title: "Error",
              text: res.RespText,
              type: "error",
            });
          }
        })
        .catch((error) => {
          notify({
            title: "Error",
            text: "Failed to fetch procedure list.",
            type: "error",
          });
          console.error(error);
        });
    },
  },
  created() {
    this.getDocumentFormLstPublic();
    this.getProcedureLst(); // Call the new method to fetch procedure list
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

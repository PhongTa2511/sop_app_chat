<template>
  <v-card class="py-4">
    <div
      class="d-flex justify-space-between mb-4 mx-4"
      v-if="productInfo.WarehouseName"
    >
      <div>
        <div class="text-h5" style="white-space: normal">
          Sản phẩm:
          {{ productInfo.WarehouseName }}
        </div>
      </div>
      <div>
        <v-tooltip text="Lưu thông tin">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="green"
              class="mr-2"
              icon="mdi-content-save-outline"
              @click="btUpdateStorage"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-row class="px-4">
      <v-col cols="4">
        <v-text-field
          v-model="productInfo.WarehouseName"
          label="Tên sản phẩm"
          readonly
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="d-flex align-center">
        <v-text-field
          v-model="productInfo.Country"
          label="Quốc gia"
          variant="outlined"
          hide-details
          density="compact"
          readonly
        ></v-text-field>
        <v-tooltip text="Xem law">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              class="ml-1"
              icon="mdi-file-certificate"
              @click="btShowPushLaw"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-col>

      <v-col cols="4">
        <v-text-field
          v-model="productInfo.Name2"
          label="Tên xuất khẩu"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productInfo.Area"
          label="Khu vực"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productInfo.StoreType"
          label="Phân loại"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productInfo.AddrLv1"
          label="Quy cách"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productInfo.Session"
          label="Quy định giấy tờ pháp lý"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="productInfo.CertNumber"
          label="Thông tin MAH"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="productInfo.TypeGSP"
          label="Loại sản phẩm"
          placeholder="Loại sản phẩm"
          density="compact"
          :items="typeLst"
          item-value="ValueName"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="productInfo.AddrLv2"
          label="Loại hoàn thiện"
          placeholder="Loại hoàn thiện"
          density="compact"
          :items="typeSuccessLst"
          item-value="ValueName"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="productInfo.Status"
          label="Trạng thái"
          placeholder="Trạng thái"
          density="compact"
          :items="productStatusLst"
          item-value="ValueName2"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <VDateField
          v-model:modelValue="productInfo.CertDate"
          width="100%"
          label="Ngày cấp giấy phép"
        />
      </v-col>
      <v-col cols="4">
        <VDateField
          v-model:modelValue="productInfo.AddrLv3"
          width="100%"
          label="Ngày hết hạn"
        />
      </v-col>
    </v-row>
  </v-card>
  <v-row class="mt-2">
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Danh sách hồ sơ</div>
          <v-btn
            color="green"
            icon="mdi-plus"
            size="x-small"
            @click="btShowAddNew()"
          >
          </v-btn>
        </div>

        <v-list v-if="documentLst.length > 0">
          <v-list-item
            v-for="(item, index) in documentLst"
            :key="index"
            :title="item.DocName + ' - ' + item.Conclusion"
            active="true"
            :color="
              item.Status == 4
                ? 'green'
                : item.Status == 6
                ? 'orange'
                : item.Status == 0
                ? 'red'
                : 'blue'
            "
            @click="selectDoc(item)"
          >
            <template v-slot:subtitle>
              <span style="color: green">{{ item.DateRecept }} </span>
              -
              <span style="color: red">{{ item.DateExpired }} </span>
            </template>
            <template v-slot:title>
              {{ item.DocName + " - " + item.Conclusion }}
            </template>
            <template v-slot:prepend>
              <v-btn
                rounded="full"
                icon
                size="x-small"
                class="mr-2"
                color="grey"
                >{{ item.Key }}</v-btn
              >
            </template>
            <template v-slot:append>
              <v-icon v-if="item.Status == 4" color="green"
                >mdi-check-circle-outline</v-icon
              >
              <v-icon v-if="item.Status == 1 || item.Status == 2" color="blue"
                >mdi-account-box-edit-outline</v-icon
              >
              <v-icon v-if="item.Status == 6" color="orange"
                >mdi-account-tie</v-icon
              >
              <v-icon v-if="item.Status == 0" color="red"
                >mdi-close-circle-outline</v-icon
              >
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Danh sách file</div>
          <v-btn
            color="green"
            icon="mdi-link-plus"
            size="x-small"
            @click="$refs.fileInput.click()"
          >
          </v-btn>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.rar"
            @change="handleFileUpload"
            style="display: none"
          />
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center py-8" v-if="fileLst.length == 0">
          <v-icon color="red" size="large"> mdi-text-box-search </v-icon>
          <div>Chưa có file nào</div>
        </div>
        <div v-else>
          <v-list v-if="fileLst.length > 0">
            <v-list-item
              v-for="(item, index) in fileLst"
              :key="index"
              :title="item.NameFile"
            >
              <template v-slot:prepend>
                <v-btn icon size="small" class="mr-2" color="green">{{
                  item.MineFile
                }}</v-btn>
              </template>
              <template v-slot:title>{{ item.NameFile }}</template>
              <template v-slot:subtitle>
                <span style="color: rgba(var(--v-theme-grey)); font-size: 12px"
                  >{{ item.TimeCreate }}
                </span>
              </template>
              <template v-slot:append>
                <!-- <v-icon color="green" size="small">mdi-dots-grid</v-icon> -->
                <v-menu location="end">
                  <template v-slot:activator="{ props }">
                    <!-- <v-chip color="orange" v-bind="props">
                      {{ item.NameFile }}
                    </v-chip> -->
                    <v-icon color="green" v-bind="props" size="small"
                      >mdi-dots-grid</v-icon
                    >
                  </template>

                  <v-list>
                    <v-list-item v-if="isPreviewSupported(item.MineFile)">
                      <v-list-item-title>
                        <v-btn
                          @click="previewFile(item)"
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
                          @click="downloadFile(item)"
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

                    <v-list-item>
                      <v-list-item-title>
                        <v-btn
                          @click="deleteFile(item)"
                          size="small"
                          rounded="8"
                          color="red"
                          block
                        >
                          <v-icon class="mr-1">mdi-file-document-remove</v-icon>
                          Xóa file
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="isShowAddNew" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Thêm mới thông tin</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Tên sản phẩm"
          v-model="newDocument.WarehouseName"
          class="mb-2"
        ></v-text-field>

        <v-select
          v-model="newDocument.TypeDoc"
          label="Loại hồ sơ"
          placeholder="Nhập thông tin"
          density="compact"
          :items="proceduceLst"
          item-value="ProcedureID"
          item-title="ProcedureName"
          chips
          clearable
          class="mb-2"
        ></v-select>
        <v-date-input
          v-model="newDocument.DateRecept"
          label="Ngày bắt đầu"
          variant="outlined"
          hide-details
          density="compact"
          prepend-icon=""
        ></v-date-input>
        <v-text-field
          class="mt-2"
          label="Ghi chú"
          v-model="newDocument.Note"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowAddNew = false">Hủy</v-btn>
        <v-btn color="green" @click="btCreateGSPDocument">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowFile" persistent width="800">
    <v-card>
      <v-card-item>
        <div v-if="isLoading">Đang tải...</div>
        <div v-else>
          <strong>{{ nameFile }}</strong>

          <div style="">
            <div
              v-html="docContent"
              style="overflow-y: auto; height: calc(100vh - 200px); width: 100%"
            ></div>
          </div>
        </div>
      </v-card-item>
      <v-card-actions>
        <v-btn @click="isShowFile = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GetWareHouseByID, UpdateWareHouse } from "@/api/productApi";
import { GetProcedureLst } from "@/api/procedureApi";
import { GetDefaultValue } from "@/api/default";
import { GetGSPDocumentByStoreID, CreateGSPDocument } from "@/api/briefApi";
import { formatDateDisplayDDMMYY, formatDate } from "@/helpers/getTime";
import { urlUploadFile } from "./function";
import { GetDocumentFile, DelDocumentFile } from "@/api/documentFileApi";
import Axios from "axios";
import {
  fetchXlsxContent,
  fetchDoc,
  isPreviewSupported,
  downloadFileProduct,
} from "@/utils/function";
export default {
  data() {
    return {
      headers: [],
      desserts: [],
      productInfo: {},
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      isShowAddNew: false,
      newDocument: {},
      documentLst: [],
      proceduceLst: [],
      typeSuccessLst: [],
      typeLst: [],
      productStatusLst: [],
      fileLst: [],
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
    };
  },

  methods: {
    btShowPushLaw() {
      this.$router.push({
        path: "/quoc-gia",
        query: {
          country: this.productInfo.Country,
        },
      });
    },
    deleteFile(file) {
      DelDocumentFile({
        Data: file.RowID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.fileLst = this.fileLst.filter((p) => p.RowID != file.RowID);

          notify({
            title: "Thành công",
            text: "Xóa file thành công",
            type: "success",
          });
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    async previewFile(file) {
      if (!this.isPreviewSupported(file.MineFile)) {
        alert("File này không hỗ trợ xem trước.");
        return;
      }
      this.isLoading = true;
      this.nameFile = file.NameFile.toUpperCase();
      this.docContent = "";
      const fileExtension = file.MineFile.toLowerCase();
      this.fileMine = fileExtension;
      const previewUrl = `https://rd.icpc1hn.work/api/File/GetProductFile?FileName=${file.LinkFile}`;
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl;
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl
        );
      } else if (fileExtension === ".docx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchDoc(this.fileUrl);
      } else if (fileExtension === ".xlsx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchXlsxContent(this.fileUrl);
      } else if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        this.isShowFile = true;
        this.docContent = `<img lazy src="${previewUrl}" alt="Image preview" width="100%" />`;
      }
      this.isLoading = false;
    },

    downloadFile(file) {
      downloadFileProduct(file);
    },
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension);
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const params = new FormData();
        params.append("file", file);

        Axios.post(urlUploadFile(this.$route.params.id), params).then((res) => {
          if (res.data.RespCode == 0) {
            this.getDocumentFile();

            notify({
              title: "File",
              text: "Thêm file thành công",
              type: "success",
            });
          } else {
            notify({
              title: "File",
              text: res.data.RespText,
              type: "error",
            });
          }
        });
      }
    },
    getDocumentFile() {
      GetDocumentFile({
        ProcedureID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.fileLst = res.Data;
        }
      });
    },
    selectDoc(data) {
      this.$router.push("/thong-tin/" + data.DocumentID);
    },
    getDefaultValue() {
      GetDefaultValue({ Table: "Loại sản phẩm" }).then((res) => {
        if (res.RespCode == 0) {
          this.typeLst = res.DefaultValueLst.filter((p) => p.Status > 0);
        }
      });
      GetDefaultValue({ Table: "Loại hoàn thiện" }).then((res) => {
        if (res.RespCode == 0) {
          this.typeSuccessLst = res.DefaultValueLst.filter((p) => p.Status > 0);
        }
      });
      GetDefaultValue({ Table: "ProductStatus" }).then((res) => {
        if (res.RespCode == 0) {
          this.productStatusLst = res.DefaultValueLst.filter(
            (p) => p.Status > 0
          ).map((item) => {
            return {
              ...item,
              ValueName2: parseInt(item.ValueName2),
            };
          });
        }
      });
    },
    updateGSPDocument(status) {
      UpdateGSPDocument({
        DocumentInfo: {
          DocumentID: this.$route.params.id,
          Status: status,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật thành công",
            type: "success",
          });
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    btShowAddNew() {
      this.isShowAddNew = true;
      this.newDocument = {
        WarehouseName: this.productInfo.WarehouseName,
        WarehouseID: this.productInfo.WarehouseID,
        DateRecept: new Date(),
      };
    },
    btCreateGSPDocument() {
      CreateGSPDocument({
        DocumentInfo: {
          WarehouseID: this.newDocument.WarehouseID,
          TypeDoc: this.newDocument.TypeDoc,
          DateRecept: formatDate(this.newDocument.DateRecept),
          Note: this.newDocument.Note,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowAddNew = false;
          this.newDocument = {};
          this.getGSPDocumentByStoreID(this.productInfo.WarehouseID);
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "more" };
      }
      if (status == 2) {
        return { text: "Đang làm", color: "success" };
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" };
      }
      if (status == 6) {
        return { text: "Khách check", color: "orange" };
      }
    },
    btUpdateStorage() {
      UpdateWareHouse({
        WarehouseInfo: {
          ...this.productInfo,
          CertDate: formatDate(this.productInfo.CertDate),
          AddrLv3: formatDate(this.productInfo.AddrLv3),
          Status: this.productInfo.Status,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
    getWareHouseByID() {
      GetWareHouseByID({
        WarehouseID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.productInfo = {
            ...res.Data,
          };
          this.getGSPDocumentByStoreID(this.productInfo.WarehouseID);
        }
      });
    },
    getGSPDocumentByStoreID(data) {
      GetGSPDocumentByStoreID({
        WarehouseID: data,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.documentLst = res.DocumentLst.filter((p) => p.Status > 0).map(
            (item, index) => {
              return {
                ...item,
                Key: index + 1,
                DateRecept: formatDateDisplayDDMMYY(item.DateRecept),
                DateExpired: formatDateDisplayDDMMYY(item.DateExpired),
              };
            }
          );
        }
      });
    },
    getProcedureLst() {
      GetProcedureLst({ PageNumber: 1, RowspPage: 1000, Search: "" }).then(
        (res) => {
          if (res.RespCode == 0) {
            this.proceduceLst = res.Data;
          }
        }
      );
    },
  },
  created() {
    this.getWareHouseByID();
    this.getProcedureLst();
    this.getDefaultValue();
    this.getDocumentFile();
  },
};
</script>

<style lang="scss" scoped>
.layout-card {
  min-height: 250px;
  max-height: 500px;
  overflow-y: scroll;
  border-radius: 8px !important;
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
}
</style>

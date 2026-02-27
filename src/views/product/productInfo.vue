<template>
  <v-card class="py-4" v-if="productInfo">
    <div
      class="d-flex justify-space-between mx-4"
      v-if="productInfo.DocumentFormLineLst"
    >
      <div>
        <div class="text-h5" style="white-space: normal">
          Sản phẩm:
          {{
            productInfo.DocumentFormLineLst.find(
              (p) => p.Parameter == "Tên sản phẩm",
            )?.TextResult || ""
          }}
        </div>
      </div>
      <div>
        <v-tooltip text="Lưu thông tin">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="x-small"
              color="green"
              icon="mdi-content-save-outline"
              @click="updateDocumentForm(productInfo)"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-card flat v-if="productInfo.TypeForm == 1">
      <v-row class="px-4 py-4">
        <v-col
          lg="4"
          md="6"
          cols="12"
          v-for="(line, indexline) in productInfo.DocumentFormLineLst"
          :key="indexline"
        >
          <v-text-field
            v-if="line.Type == 1"
            :label="line.Parameter"
            v-model="line.TextResult"
            :class="{ 'blur-text': line.IsPrivate == 1 }"
            :readonly="line.IsPrivate == 1"
          ></v-text-field>
          <v-autocomplete
            v-if="line.Type == 2"
            v-model="line.TextResult"
            :label="line.Parameter"
            :items="line.Options"
            item-value="Name"
            item-title="Name"
            chips
            hide-details
            multiple
            :class="{ 'blur-text': line.IsPrivate == 1 }"
            :readonly="line.IsPrivate == 1"
          ></v-autocomplete>
          <v-autocomplete
            v-if="line.Type == 3"
            v-model="line.TextResult"
            :label="line.Parameter"
            :items="line.Options"
            item-value="value"
            item-title="text"
            chips
            hide-details
            multiple
            :class="{ 'blur-text': line.IsPrivate == 1 }"
            :readonly="line.IsPrivate == 1"
          ></v-autocomplete>
          <div v-if="line.Type == 4">
            <V-DateField
              v-model:modelValue="line.TextResult"
              :label="line.Parameter"
              width="100%"
              :className="{ 'blur-text': line.IsPrivate == 1 }"
              :readonly="line.IsPrivate == 1"
            />
          </div>
        </v-col>
      </v-row>
    </v-card>
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
              {{ item.DocName + " - " + item.DocumentID }}
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

  <v-dialog v-model="isShowAddNew" max-width="500px">
    <v-card>
      <v-card-title>
        <h5 class="text-h6 pt-2">Thêm mới thông tin</h5>
      </v-card-title>
      <v-card-text class="pt-0 pb-2">
        <v-text-field
          label="Tên sản phẩm"
          v-model="newDocument.ProductName"
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
        <v-btn size="small" @click="isShowAddNew = false">Hủy</v-btn>
        <v-btn size="small" color="green" @click="btCreateGSPDocument"
          >Lưu</v-btn
        >
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
import { CreateGSPDocument, GetDocumentByProID } from "@/api/briefApi";
import { GetDefaultValue } from "@/api/default";
import { DelDocumentFile, GetDocumentFile } from "@/api/documentFileApi";
import {
  GetDocumentFormByProductID,
  UpdateDocumentForm,
} from "@/api/documentFormApi";
import { GetProcedureLst } from "@/api/procedureApi";
import { GetProductLst } from "@/api/productApi";
import { GetUserLstByTeamID } from "@/api/user";
import { formatDate, formatDateDisplayDDMMYY } from "@/helpers/getTime";
import {
  downloadFileProduct,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";
import Axios from "axios";
import { urlUploadFile } from "./function";
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
      const previewUrl = `https://sop.idtp.work/api/File/GetProductFile?FileName=${file.LinkFile}`;
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl;
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl,
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
        ProductID: this.$route.params.id,
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
            (p) => p.Status > 0,
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
        ProductName: this.productInfo.DocumentFormLineLst.find(
          (p) => p.Parameter == "Tên sản phẩm",
        )?.TextResult,
        ProductID: this.$route.params.id,
        DateRecept: new Date(),
      };
    },
    btCreateGSPDocument() {
      CreateGSPDocument({
        DocumentInfo: {
          ProductID: this.$route.params.id,
          TypeDoc: this.newDocument.TypeDoc,
          DateRecept: formatDate(this.newDocument.DateRecept),
          Note: this.newDocument.Note,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowAddNew = false;
          this.newDocument = {};
          this.getDocumentByProID(this.productInfo.ProductID);
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
    updateDocumentForm(data) {
      if (this.isLoadingFile) return;
      this.isLoadingFile = true;
      var dataLine = data.DocumentFormLineLst.map((item) => {
        if (item.Type == 2 || item.Type == 3) {
          let textArr = [];

          if (Array.isArray(item.TextResult)) {
            // trường hợp TextResult là mảng thật
            textArr = item.TextResult;
          } else if (
            typeof item.TextResult === "string" &&
            item.TextResult !== ""
          ) {
            try {
              // parse string -> array
              textArr = JSON.parse(item.TextResult);
            } catch (e) {
              // fallback: tách theo dấu phẩy nếu JSON sai format
              textArr = item.TextResult.split(",");
            }
          }
          return {
            ...item,
            TextResult: textArr.join(" | "),
          };
        } else if (item.Type == 4) {
          return {
            ...item,
            TextResult: item.TextResult ? formatDate(item.TextResult) : null,
          };
        } else {
          return { ...item };
        }
      });

      // ------------------------------------------------------------------
      // 🔥 CHECK BẮT BUỘC: Nếu IsValue == 1 thì TextResult phải có giá trị
      // ------------------------------------------------------------------
      let invalid = dataLine.some((line) => {
        return (
          line.IsValue == 1 &&
          (!line.TextResult || line.TextResult.trim() === "")
        );
      });

      if (invalid) {
        notify({
          title: "Thiếu dữ liệu",
          text: "Các trường bắt buộc chưa nhập đầy đủ",
          type: "error",
        });
        return; // ⛔ Không gọi API
      }
      UpdateDocumentForm({
        DocumentFormInfo: {
          ...data,
          DocumentFormLineLst: dataLine,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getDocumentFormByID();
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
    getDocumentFormByID() {
      GetDocumentFormByProductID({
        FormID: this.$route.params.id,
      }).then(async (res) => {
        if (res.RespCode == 0) {
          var item = res.DocumentFormInfo;

          if (item.TypeForm == 1) {
            const newLines = [];
            for (const ele of item.DocumentFormLineLst) {
              let options = [];
              if (ele.OptionAnswer) {
                options = JSON.parse(ele.OptionAnswer);
              }

              if (ele.Type == 3) {
                if (ele.OptionLine == 1) {
                  options = await this.getUserLstByTeamID2(ele.OptionText);
                }
                if (ele.OptionLine == 2) {
                  options = await this.getDefaultValue2(ele.OptionText);
                }
                if (ele.OptionLine == 3) {
                  options = await this.getProductLst();
                }
              }
              newLines.push({
                ...ele,
                Options: options,
              });
            }

            item.DocumentFormLineLst = newLines;
          }
          this.productInfo = {
            ...item,
          };
          this.isLoadingFile = false;
          this.getDocumentByProID(this.$route.params.id);
        }
      });
    },
    async getDefaultValue2(table) {
      const res = await GetDefaultValue({
        Table: table,
      });

      if (res.RespCode == 0) {
        return res.DefaultValueLst.map((item) => ({
          ...item,
          value: item.ValueName,
          text: item.ValueName,
        }));
      }

      return [];
    },
    async getUserLstByTeamID2(teamID) {
      const res = await GetUserLstByTeamID({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
        TeamID: teamID,
      });

      if (res.RespCode == 0) {
        return res.Data.map((item) => ({
          ...item,
          value: item.UserName,
          text: item.FullName,
        }));
      }
      return [];
    },
    async getProductLst() {
      const requestData = {
        PageNumber: 1,
        RowspPage: 1000000,
        Search: "||||",
      };

      const res = await GetProductLst(requestData);

      if (res.RespCode == 0) {
        this.productLst = res.Data.map((item, index) => ({
          ...item,
          Key: index + 1,
          value: item.WarehouseID,
          text: item.WarehouseName,
        }));
        return this.productLst;
      }

      return [];
    },
    getDocumentByProID(data) {
      GetDocumentByProID({
        ProductID: data,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.documentLst = res.Data.filter((p) => p.Status > 0).map(
            (item, index) => {
              return {
                ...item,
                Key: index + 1,
                DateRecept: formatDateDisplayDDMMYY(item.DateRecept),
                DateExpired: formatDateDisplayDDMMYY(item.DateExpired),
              };
            },
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
        },
      );
    },
  },
  created() {
    this.getDocumentFormByID();
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

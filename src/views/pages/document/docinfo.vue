<template>
  <v-card class="py-4">
    <div class="d-flex justify-space-between mb-4 mx-4" v-if="docInfo.TypeDoc">
      <div>
        <div class="text-h5" style="white-space: normal">
          Hồ sơ:
          {{ docInfo.DocName }}
          <v-chip
            style="margin-top: -10px"
            :color="getStatus(docInfo.Status).color"
          >
            {{ getStatus(docInfo.Status).text }}</v-chip
          >
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-note</v-icon> Mô tả:
          {{ docInfo.Note }}
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-clipboard-text-clock</v-icon>
          Hạn xử lý:
          {{ docInfo.DateExpired }}
        </div>
      </div>
      <div>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              color="blue"
              icon="mdi-dots-grid"
              v-bind="props"
            ></v-btn>
          </template>
          <v-list>
            <!-- <v-list-item>
              <v-btn size="small" color="blue" rounded="4" block>
                Bắt đầu
              </v-btn>
            </v-list-item> -->
            <v-list-item>
              <v-btn
                size="small"
                color="gray"
                rounded="4"
                block
                @click="updateGSPDocument(3)"
              >
                Tạm dừng
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                size="small"
                color="green"
                rounded="4"
                block
                @click="updateGSPDocument(4)"
              >
                Hoàn thành
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                size="small"
                color="red"
                rounded="4"
                block
                @click="updateGSPDocument(0)"
              >
                Hủy hồ sơ
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept=".xls,.xlsx"
      @change="handleFileUpload"
      style="display: none"
    />
    <v-tabs v-model="tab" grow>
      <v-tab
        v-for="(item, index) in formTabLst"
        :key="index"
        :text="item.NameForm"
        :value="item"
        show-arrows
      ></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="(item, index) in formTabLst"
        :key="index"
        :value="item"
      >
        <v-card flat v-if="tab.TypeForm == 2">
          <v-data-table
            no-data-text="Không có dữ liệu"
            :headers="headers"
            :items="desserts"
            min-height="calc( 210px)"
            items-per-page-text="Số dòng 1 trang"
            sort-asc-icon="mdi-menu-up"
            sort-desc-icon="mdi-menu-down"
            hide-default-footer
          >
            <template v-slot:top="{ item }">
              <div class="mx-auto mt-2">
                <v-btn size="small" color="blue" rounded="md" @click="btShowAdd"
                  >Thêm mới</v-btn
                >

                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      size="small"
                      color="green"
                      rounded="md"
                      class="mx-2"
                      v-bind="props"
                      >Thêm Excel</v-btn
                    >
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-btn
                        prepend-icon="mdi-microsoft-excel"
                        size="small"
                        color="gray"
                        rounded="4"
                        block
                        @click="btExportExcel"
                      >
                        <template v-slot:prepend>
                          <v-icon color="blue"></v-icon>
                        </template>
                        Excel Mẫu
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn
                        prepend-icon="mdi-microsoft-excel"
                        size="small"
                        color="gray"
                        rounded="4"
                        block
                        @click="triggerFileInputClick"
                      >
                        <template v-slot:prepend>
                          <v-icon color="green"></v-icon>
                        </template>
                        Thêm Excel
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn
                  size="small"
                  color="green"
                  rounded="md"
                  @click="updateDocumentForm(tab)"
                  >Lưu thông tin</v-btn
                >
              </div>
            </template>

            <template v-slot:item.Key="{ item }">
              {{ item.Key }}
              <v-icon
                color="orange"
                size="small"
                style="cursor: pointer"
                @click="openEditDialog(item)"
                >mdi-note-edit</v-icon
              >
              <v-icon
                color="red"
                size="small"
                style="cursor: pointer"
                @click="deleteDessert(item.Key)"
                >mdi-delete</v-icon
              >
            </template>
          </v-data-table>
        </v-card>
        <v-card flat v-if="tab.TypeForm == 1">
          <div class="d-flex justify-center mt-2">
            <v-btn
              rounded="4"
              color="green"
              size="small"
              @click="updateDocumentForm(tab)"
              >Lưu thông tin</v-btn
            >
          </div>
          <v-row class="px-4 py-4">
            <v-col
              lg="4"
              md="6"
              cols="12"
              v-for="(line, indexline) in tab.DocumentFormLineLst"
              :key="indexline"
            >
              <v-text-field
                :label="line.Parameter"
                v-model="line.TextResult"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
  <v-row class="mt-2">
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Thông tin các bước</div>
          <v-btn
            rounded="full"
            color="green"
            icon="mdi-progress-check"
            size="x-small"
            @click="btShowProcess()"
          >
          </v-btn>
        </div>
        <v-divider class="my-2"></v-divider>
        <div v-for="(item, index) in processLst" :key="index" class="mx-2 my-2">
          <div class="d-flex">
            <v-chip class="mr-2">
              {{ item.StepOrder }}
            </v-chip>
            {{ item.StepName }}
            <v-spacer></v-spacer>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  rounded="full"
                  color="blue"
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  size="x-small"
                >
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn
                    prepend-icon="mdi-information-box"
                    size="small"
                    color="gray"
                    rounded="4"
                    block
                    @click="btShowInfoStep(item)"
                  >
                    <template v-slot:prepend>
                      <v-icon color="blue"></v-icon>
                    </template>
                    Thông tin
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-divider class="my-2" color="blue"></v-divider>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="text-h6">Các file liên quan</div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center py-8">
          <v-icon color="red" size="large"> mdi-text-box-search </v-icon>
          <div>Chưa có file nào đính kèm</div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="isShowInfoStep" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h5 text-medium-emphasis">
            <v-chip :color="stepInfo.Status == 1 ? 'blue' : ''">
              Bước {{ stepInfo.StepOrder }}
            </v-chip>
            {{ stepInfo.StepName }}
          </div>

          <div
            v-if="stepInfo.Description"
            class="text-subtitle-1 py-1 px-2"
            style="white-space: normal"
          >
            Mô tả: {{ stepInfo.Description }}
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          rounded="full"
          color="gray"
          size="small"
          @click="isShowInfoStep = false"
        ></v-btn
      ></v-card-title>
      <v-card-text v-for="(item, index) in workLst" :key="index">
        <v-divider style="margin-top: -20px" class="mb-2"></v-divider>
        <v-form ref="editForm">
          <div class="text-h6">
            {{ item.Key }}. {{ item.JobName }}

            <v-chip style="margin-top: -10px" v-if="item.Status == 0"
              >Chưa giao việc</v-chip
            >
            <v-chip
              style="margin-top: -10px"
              color="blue"
              v-if="item.Status == 1"
              >Đang làm</v-chip
            >
            <v-chip
              style="margin-top: -10px"
              color="green"
              v-if="item.Status == 4"
              >Hoàn thành</v-chip
            >
          </div>
          <div class="text-p">Mô tả: {{ item.DesJob }}</div>

          <v-row>
            <v-col :lg="6">
              <span>Cài đặt xử lý</span>
              <v-select
                v-model="item.UserJob.GroupEmploy"
                placeholder="Nhóm xử lý"
                density="compact"
                :items="groupLst"
                item-value="ValueName"
                item-title="ValueName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
              ></v-select>
              <v-select
                v-model="item.UserJob.UserID"
                :items="userLst"
                placeholder="Người xử lý"
                item-value="UserName"
                item-title="FullNameCode"
                chips
                style="max-width: 280px"
                class="mb-2"
              ></v-select>
              <v-text-field
                v-model="item.UserJob.QuotaTime"
                label="Hạn xử lý"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
              ></v-text-field>
            </v-col>
            <v-col :lg="6">
              <span>Cài đặt phê duyệt</span>
              <v-select
                v-model="item.UserMana.GroupEmploy"
                :items="groupLst"
                placeholder="Nhóm phê duyệt"
                density="compact"
                item-value="ValueName"
                item-title="ValueName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
              ></v-select>
              <v-select
                v-model="item.UserMana.UserID"
                :items="userLst"
                placeholder="Người phê duyệt"
                density="compact"
                item-value="UserName"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
              ></v-select>
              <v-text-field
                v-model="item.UserMana.QuotaTime"
                label="Hạn phê duyệt"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex justify-center my-4">
            <v-btn
              variant="outlined"
              rounded="8"
              size="small"
              @click="btAddUserInWork(item)"
              color="blue"
              class="mr-1"
              >Gán người xử lý</v-btn
            >
            <v-btn
              variant="outlined"
              rounded="8"
              size="small"
              @click="btSendMailAddUserInWork(item)"
              color="green"
              class="ml-1"
              >Gửi mail thực hiện</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowAddNew" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Thêm mới thông tin</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="(header, index) in headers.filter((p) => p.title != 'STT')"
            :key="index"
            cols="12"
          >
            <v-text-field
              v-if="header.type == 1"
              :label="header.title"
              v-model="newDocument[header.key]"
            ></v-text-field>
            <v-select
              v-if="header.type == 2"
              v-model="newDocument[header.key]"
              :label="header.title"
              placeholder="Nhập thông tin"
              density="compact"
              :items="header.options"
              item-value="Name"
              item-title="Name"
              chips
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowAddNew = false">Hủy</v-btn>
        <v-btn color="green" @click="addNewDocument">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowEdit" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Chỉnh sửa thông tin</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="(header, index) in headers.filter((p) => p.title != 'STT')"
            :key="index"
            cols="12"
          >
            <v-text-field
              v-if="header.type == 1"
              :label="header.title"
              v-model="editDocument[header.key]"
            ></v-text-field>
            <v-select
              v-if="header.type == 2"
              v-model="editDocument[header.key]"
              :label="header.title"
              placeholder="Nhập thông tin"
              density="compact"
              :items="header.options"
              item-value="Name"
              item-title="Name"
              chips
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowEdit = false">Hủy</v-btn>
        <v-btn color="green" @click="updateDocument">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowProcess" width="600">
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
              <v-chip class="mr-2">
                {{ item.StepOrder }}
              </v-chip>
              {{ item.StepName }}
            </div>
            <v-sheet
              v-for="(job, indjob) in item.StepLst"
              :key="indjob"
              class="px-1 py-1"
              rounded
              border="green md"
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
</template>

<script>
import { GSPGetGSPDocumentInfoByID, UpdateGSPDocument } from "@/api/briefApi";
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime";
import {
  ProcessDocument,
  GetDocumentJobByDocID,
  AddAssignLst,
  SendMailAddAssignLst,
} from "@/api/documentJobApi";
import { GetDefaultValue } from "@/api/default";
import { GetUserLstAll } from "@/api/user";
import {
  GetDocumentFormByDocID,
  UpdateDocumentForm,
} from "@/api/documentFormApi";
import { exportExcel } from "./function";
import XLSX from "xlsx";

export default {
  data() {
    return {
      headers: [],
      desserts: [],
      docInfo: {},
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      processLst: [],
      isShowInfoStep: false,
      stepInfo: {},
      workLst: [],
      userLst: [],
      groupLst: [],
      formTabLst: [],
      tab: "",
      isShowAddNew: false,
      newDocument: {},
      isShowEdit: false,
      editDocument: {},
      isShowProcess: false,
    };
  },
  methods: {
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension);
    },
    downloadFile(file) {
      downloadFile(file);
    },
    previewFile(file) {
      previewFile(file);
      this.isLoading = false;
    },
    fetchDoc(url) {
      fetchDoc(url);
    },
    fetchXlsxContent(url) {
      fetchXlsxContent(url);
    },
    btExportExcel() {
      exportExcel(this.headers);
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.log(data);

          this.desserts = this.convertToReq(data).map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        };
        reader.readAsBinaryString(file);
      }
    },

    convertToReq(data) {
      var lstReq = [];
      for (var i = 1; i < data.length; i++) {
        if (data[i][1]) {
          var req = {};
          this.headers.forEach((ele, index) => {
            req["Line" + index] = data[i][index];
          });

          lstReq.push(req);
        }
      }
      return lstReq;
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
    getdefault() {
      GetDefaultValue({ Table: "Phòng ban" }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst = res.DefaultValueLst;
        }
      });
      GetUserLstAll({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
      }).then((res) => {
        this.userLst = res.Data.map((item) => {
          return {
            ...item,
            FullNameCode: item.FullName + " - " + item.EmployeeCode,
          };
        });
      });
    },
    btShowInfoStep(data) {
      this.isShowInfoStep = true;
      this.stepInfo = data;
      this.getDocumentJobByDocID(data.StepID);
    },
    getDocumentJobByDocID(stepID) {
      GetDocumentJobByDocID({
        DocumentID: this.$route.params.id,
        StepID: stepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.workLst = res.DocumentJobLst.map((item, index) => {
            var userJob = null;
            var a = item.UserAssignLst.find((p) => p.UserRole == "Xử lý");
            if (a) {
              userJob = a;
            }
            var a = item.AssignLst.find((p) => p.UserRole == "Xử lý");
            if (a) {
              userJob = a;
            }
            var userMana = null;
            var b = item.UserAssignLst.find((p) => p.UserRole == "Phê duyệt");
            if (b) {
              userMana = b;
            }
            var b = item.AssignLst.find((p) => p.UserRole == "Phê duyệt");
            if (b) {
              userMana = b;
            }
            return {
              ...item,
              Key: index + 1,
              UserJob: userJob ?? {},
              UserMana: userMana ?? {},
            };
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
        return { text: "Đang làm", color: "blue" };
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "success" };
      }
    },
    btShowProcess() {
      this.isShowProcess = true;
    },
    processDocument() {
      ProcessDocument({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.processLst = res.DocumentJobLst.map((item, index) => {
            item.StepLst = item.StepLst.map((job, indjob) => {
              return {
                ...job,
                TimeModifyShow: formatDateHHDDMM(job.TimeModify),
                TimeApproveShow: formatDateHHDDMM(job.TimeApprove),
              };
            });
            return {
              ...item,
            };
          });
        }
      });
    },
    getDocumentInfoByID() {
      GSPGetGSPDocumentInfoByID({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.docInfo = res.Data;
          this.processDocument();
        }
      });
    },
    btAddUserInWork(data) {
      var asi = [];
      if (data.UserJob.UserID) {
        asi.push(data.UserJob);
      }
      if (data.UserMana.UserID) {
        asi.push(data.UserMana);
      }
      AddAssignLst({
        DocumentID: data.DocumentID,
        StepID: data.StepID,
        WorkID: data.WorkID,
        AssignLst: asi,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Gán nhân sự thành công",
            type: "success",
          });
        }
      });
    },
    btSendMailAddUserInWork(data) {
      var asi = [];
      if (data.UserJob.UserID) {
        asi.push(data.UserJob);
      }
      if (data.UserMana.UserID) {
        asi.push(data.UserMana);
      }
      SendMailAddAssignLst({
        DocumentID: data.DocumentID,
        StepID: data.StepID,
        WorkID: data.WorkID,
        AssignLst: asi,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Gán nhân sự thành công",
            type: "success",
          });
        }
      });
    },
    getDocumentFormByDocID() {
      GetDocumentFormByDocID({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.formTabLst = res.DocumentFormLst.map((item) => {
            if (item.TypeForm == 1) {
              if (item.DocumentFormLineLst.length == 0) {
                item.DocumentFormLineLst = item.DNFormLineLst;
              }
            }
            if (item.TypeForm == 2) {
              this.headers = [
                {
                  title: "STT",
                  sortable: false,
                  key: "Key",
                  align: "center",
                  width: 100,
                },
              ];
              for (var i = 0; i < item.DNFormLineLst.length; i++) {
                const line = item.DNFormLineLst[i];
                this.headers.push({
                  title: line.Parameter,
                  sortable: false,
                  key: "Line" + line.Required,
                  align: "center",
                  type: line.Type,
                  options: line.Type == 2 ? JSON.parse(line.OptionAnswer) : [],
                });
              }
              var len = item.DocumentFormLineLst.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex((obj) => obj.IDFormLine === item.IDFormLine)
              );
              console.log("anhthanfh", len);
              len = len.length;
              for (var i = 0; i < len; i++) {
                var itemlst = item.DocumentFormLineLst.filter(
                  (p) => p.IDFormLine == i
                );
                var itemde = {};
                itemlst.forEach((ele, inle) => {
                  itemde["Line" + (inle + 1)] = ele.TextResult;
                });
                this.desserts.push(itemde);
              }
              this.desserts = this.desserts.map((item, index) => {
                return {
                  ...item,
                  Key: index + 1,
                };
              });
            }

            return {
              ...item,
            };
          });
          if (this.formTabLst.length > 0) {
            this.tab = this.formTabLst[0];
          }
        }
      });
    },
    addNewDocument() {
      this.isShowAddNew = false;
      this.desserts.push(this.newDocument);
      this.desserts = this.desserts.map((item, index) => {
        return {
          ...item,
          Key: index + 1,
        };
      });
      console.log(this.desserts);
    },
    btShowAdd() {
      this.isShowAddNew = true;
    },
    updateDocumentForm(data) {
      var docForm = {
        DocumentID: this.$route.params.id,
        IDForm: data.IDForm,
        ProcedureID: this.docInfo.TypeDoc,
        NameForm: data.NameForm,
        Description: data.Description,
        TypeForm: data.TypeForm,
      };
      var docFormLine = [];
      if (data.TypeForm == 2) {
        this.desserts.forEach((item, ind) => {
          var len = this.headers.filter((p) => p.title != "STT").length;
          for (let index = 1; index <= len; index++) {
            var line = {
              DocumentID: this.$route.params.id,
              IDForm: data.IDForm,
              StepID: data.StepID,
              WorkID: data.WorkID,
              Parameter: item.title,
              Type: item.type,
              OptionAnswer: JSON.stringify(item.options),
              Required: index,
              TextResult: item["Line" + index],
              IDFormLine: ind,
            };
            docFormLine.push(line);
          }
        });
        docForm.DocumentFormLineLst = docFormLine;
      }
      if (data.TypeForm == 1) {
        docForm.DocumentFormLineLst = data.DocumentFormLineLst;
      }

      UpdateDocumentForm({
        DocumentFormInfo: docForm,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Lưu thông tin thành công",
            type: "success",
          });
        }
      });
    },
    openEditDialog(item) {
      this.isShowEdit = true;
      this.editDocument = { ...item };
    },
    updateDocument() {
      this.isShowEdit = false;
      this.desserts.push(this.editDocument);
      this.desserts = this.desserts.map((item, index) => {
        return {
          ...item,
          Key: index + 1,
        };
      });
      console.log(this.desserts);
    },
    deleteDessert(key) {
      this.desserts = this.desserts.filter((item) => item.Key !== key);
    },
    triggerFileInputClick() {
      this.$refs.fileInput.click();
    },
  },
  created() {
    this.getDocumentInfoByID();
    this.getDocumentFormByDocID();
    this.getdefault();
  },
};
</script>

<style lang="scss" scoped>
.layout-card {
  min-height: 250px;
  max-height: 500px;
  overflow-y: scroll;
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

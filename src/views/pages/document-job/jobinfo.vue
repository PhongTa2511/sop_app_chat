<template>
  <v-row>
    <v-col :lg="8" cols="12">
      <v-card class="layout-card">
        <v-card-title class="text-h6 py-4">
          <div class="d-flex justify-sm-space-between">
            <div>Thông tin công việc</div>

            <v-btn
              color="blue"
              icon="mdi-list-box"
              style="height: 42px"
            ></v-btn>
          </div>
          <div class="text-subtitle-1">
            <v-chip color="blue">{{ dataJobInfo.ProcedureID }}</v-chip>
            {{ dataJobInfo.ProcedureName }}
          </div>
          <div class="mt-2 text-subtitle-1">
            <v-chip color="red">{{ dataJobInfo.StepID }}</v-chip>
            {{ dataJobInfo.StepName }}
          </div>
          <div class="mt-2 text-subtitle-1">
            <v-chip color="green">{{ dataJobInfo.WorkID }}</v-chip>
            {{ dataJobInfo.JobName }}
          </div>
        </v-card-title>
        <v-data-table
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="desserts"
          hide-default-footer
        >
          <template v-slot:top>
            <div class="d-flex justify-sm-space-between text-button px-6">
              <div>Danh sách sản phẩm</div>

              <v-btn
                color="green"
                icon="mdi-microsoft-excel"
                style="height: 42px; margin-top: -12px"
              ></v-btn>
            </div>
          </template>
          <template v-slot:item.Status="{ item }">
            <v-chip color="green" size="small" v-if="item.Status == 1">
              Đang làm
            </v-chip>
            <v-chip color="red" size="small" v-if="item.Status == 0">
              Xóa
            </v-chip>
          </template>
          <template v-slot:item.Quantity="{ item }">
            <div>{{ item.Quantity }}</div>
            <div>{{ item.Unit }}</div>
          </template>
          <template v-slot:item.StatusText="{ item }">
            <div>{{ item.StatusText }}</div>
            <div>{{ item.ExpDateShow }}</div>
          </template>
          <template v-slot:item.Action="{ item }">
            <v-icon color="primary" size="small" @click="btShowDel(item.raw)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <v-divider></v-divider>
        <div class="px-2 py-2 pb-4">
          <div class="mt-2 px-2 text-subtitle-2">
            <v-icon color="blue" class="" size="small">mdi-clock</v-icon>
            Bắt đầu: {{ dataJobInfo.TimeStart }}
          </div>
          <div class="mt-2 px-2 text-subtitle-2">
            <v-icon color="blue" class="" size="small">mdi-file</v-icon>

            Mô tả: {{ dataJobInfo.DesJob }}
          </div>
        </div>
        <div
          class="px-4 pb-4"
          v-if="
            userJob &&
            userJob.FullName &&
            userJob.UserID &&
            dataJobInfo.Status == 1
          "
        >
          <v-row>
            <v-col lg="8">
              <div class="text-h6">Nội dung báo cáo</div>
              <div class="pb-1 text-subtitle-2">
                <v-icon color="blue" size="small">mdi-account-edit</v-icon>
                {{ userJob.FullName }}
              </div>
              <div class="pb-1 text-subtitle-2">
                <v-icon color="green" size="small"
                  >mdi-clock-time-four-outline</v-icon
                >
                {{ userJob.TimeCreate }}
              </div>
              <div class="pb-1 text-subtitle-2">
                <v-icon color="orange" size="small">mdi-timer-sand</v-icon>
                Định mức:
                {{ userJob.QuotaTime }} Ngày
              </div>
              <editor
                api-key="6w0abawgyowzfiuqw8k55c3k1nnkmg6evr9u8219zn2kf9ob"
                v-model="dataJobInfo.Report"
                :init="editorConfig"
                style="z-index: 1000000"
              >
              </editor>
            </v-col>
            <v-col lg="4">
              <div class="d-flex justify-sm-space-between">
                <div>Tệp đính kèm</div>
                <v-btn
                  color="blue"
                  style="height: 42px"
                  icon="mdi-link-plus"
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
              <v-chip-group
                color="green"
                column
                v-if="userJob && userJob.FileLst && userJob.FileLst.length > 0"
              >
                <v-menu
                  location="end"
                  v-for="(item, index) in userJob.FileLst"
                  :key="index"
                >
                  <template v-slot:activator="{ props }">
                    <v-chip color="orange" v-bind="props">
                      {{ item.NameFile }}
                    </v-chip>
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
              </v-chip-group>
              <div v-else class="text-center py-4">
                <v-icon color="red" class="my-2" size="large"
                  >mdi-note-search</v-icon
                >
                <p>Chưa có file nào</p>
              </div>
            </v-col>
          </v-row>

          <div class="pt-2">
            <v-btn
              color="blue"
              class="mr-2"
              rounded="8"
              @click="reportDocumentJob"
              >Báo cáo</v-btn
            >
          </div>
        </div>
        <div v-else>
          <div v-if="dataJobInfo.Report">
            <div class="text-h6">Nội dung báo cáo</div>
            <div>{{ userJob.FullName }}</div>
            <div v-html="dataJobInfo.Report"></div>
          </div>
        </div>
        <div
          class="px-4 pb-4"
          v-if="
            userMana &&
            userMana.FullName &&
            userMana.UserID &&
            dataJobInfo.Status == 3
          "
        >
          <v-row>
            <v-col lg="8">
              <div class="text-h6">Nội dung phê duyệt</div>
              <div v-if="userMana">
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="red" size="small">mdi-account-check</v-icon>
                  {{ userMana.FullName }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="green" size="small"
                    >mdi-clock-time-four-outline</v-icon
                  >
                  {{ userMana.TimeCreate }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="orange" size="small">mdi-timer-sand</v-icon>
                  Định mức:
                  {{ userMana.QuotaTime }} Ngày
                </div>
              </div>

              <editor
                api-key="6w0abawgyowzfiuqw8k55c3k1nnkmg6evr9u8219zn2kf9ob"
                v-model="dataJobInfo.NoteApprove"
                :init="editorConfig"
                style="z-index: 1000000"
              >
              </editor>
            </v-col>
            <v-col lg="4">
              <div class="d-flex justify-sm-space-between">
                <div>Tệp đính kèm</div>
                <v-btn
                  color="blue"
                  style="height: 42px"
                  icon="mdi-link-plus"
                  @click="$refs.fileInput2.click()"
                >
                </v-btn>

                <input
                  ref="fileInput2"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.rar"
                  @change="handleFileUpload2"
                  style="display: none"
                />
              </div>
              <v-divider class="my-2"></v-divider>
              <v-chip-group
                color="green"
                column
                v-if="
                  userMana && userMana.FileLst && userMana.FileLst.length > 0
                "
              >
                <v-menu
                  location="end"
                  v-for="(item, index) in userMana.FileLst"
                  :key="index"
                >
                  <template v-slot:activator="{ props }">
                    <v-chip color="orange" v-bind="props">
                      {{ item.NameFile }}
                    </v-chip>
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
              </v-chip-group>
              <div v-else class="text-center py-4">
                <v-icon color="red" class="my-2" size="large"
                  >mdi-note-search</v-icon
                >
                <p>Chưa có file nào</p>
              </div>
            </v-col>
          </v-row>

          <div class="pt-2">
            <v-btn
              color="green"
              class="mr-2"
              rounded="8"
              @click="approveDocumentJob(4)"
              >Phê duyệt</v-btn
            >
            <v-btn color="red" rounded="8" @click="approveDocumentJob(5)"
              >Từ chối</v-btn
            >
          </div>
        </div>
        <div v-else>
          <div v-if="dataJobInfo.NoteApprove">
            <div class="text-h6">Nội dung phê duyệt</div>
            <div>{{ userMana.FullName }}</div>
            <div v-html="dataJobInfo.NoteApprove"></div>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col :lg="4" cols="12">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Quá trình thực hiện</div>
          <!-- <v-btn
            rounded="full"
            color="green"
            icon="mdi-progress-check"
            size="x-small"
          >
          </v-btn> -->
        </div>
        <v-divider class="my-2"></v-divider>
        <div v-for="(item, index) in processLst" :key="index" class="mx-2 my-2">
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
                <v-chip
                  v-for="(file, indfile) in ass.FileLst"
                  :key="indfile"
                  size="small"
                  class="file"
                >
                  {{ file.MineFile }}
                </v-chip>
              </div>
            </div>
          </v-sheet>
          <v-divider class="my-2" color="blue"></v-divider>
        </div>
      </v-card>
    </v-col>
  </v-row>
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
            <div v-html="docContent"></div>
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
import { GSPGetGSPDocumentInfoByID } from "@/api/briefApi";
import { formatDateDisplayDDMMYY, formatDateHHDDMM } from "@/helpers/getTime";
import {
  ProcessDocument,
  GetDocumentJobInfo,
  ReportDocumentJob,
  ApproveDocumentJob,
} from "@/api/documentJobApi";
import Editor from "@tinymce/tinymce-vue";
import { getUserName, getToken } from "@/utils/auth";
import Axios from "axios";
import { urlUploadFile } from "./function";
import mammoth from "mammoth";
import XLSX from "xlsx";
import { DelDocumentFile, GetDocumentFile } from "@/api/documentFileApi";
export default {
  components: {
    Editor,
  },
  data() {
    return {
      username: getUserName(),
      token: getToken(),
      editorConfig: {
        plugins:
          " preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars link table pagebreak nonbreaking insertdatetime advlist lists wordcount charmap emoticons",
        toolbar:
          " undo redo |  bold italic underline   fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | emoticons image media  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap ",

        paste_block_drop: true,
        branding: false,
      },
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Mã BFO", key: "BFO", sortable: false },
        { title: "Sản phẩm", key: "ProductName", sortable: false, width: 300 },
        { title: "Số lô", key: "Lotcode", sortable: false },
        { title: "Sl", key: "Quantity", sortable: false },
        { title: "Trạng thái", key: "StatusText", sortable: false, width: 300 },
        {
          title: "Quyết định",
          key: "Decision",
          sortable: false,
          width: 100,
        },
        {
          title: "Ghi chú",
          key: "Note",
          sortable: false,
          width: 100,
        },
      ],
      desserts: [],
      search: "",
      dataJobInfo: {},
      userJob: {},
      userMana: {},
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
      processLst: [],
    };
  },
  methods: {
    isPreviewSupported(fileExtension) {
      const cleanedExtension = fileExtension.trim().toLowerCase();
      const supportedExtensions = [
        ".pdf",
        ".docx",
        ".xlsx",
        ".png",
        ".jpg",
        ".jpeg",
      ];
      return supportedExtensions.includes(cleanedExtension);
    },
    downloadFile(file) {
      const previewUrl = `https://crm.icpc1hn.work/GSPDTPAPI/File/GetDocumentFile?FileName=${file.LinkFile}`;
      window.open(previewUrl);
    },
    deleteFile(file) {
      DelDocumentFile({
        Data: file.RowID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.userJob.FileLst = this.userJob.FileLst.filter(
            (p) => p.RowID != file.RowID
          );
          this.userMana.FileLst = this.userMana.FileLst.filter(
            (p) => p.RowID != file.RowID
          );
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
    processDocument(docID) {
      ProcessDocument({
        DocumentID: docID,
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
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const params = new FormData();
        params.append("file", file);

        Axios.post(urlUploadFile(this.$route.params.id), params).then((res) => {
          if (res.data.RespCode == 0) {
            this.getDocumentFile(
              this.dataJobInfo.DocumentID,
              this.userJob.UserID
            );

            notify({
              title: "File",
              text: "Thêm file hồ sơ thành công",
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
    handleFileUpload2(event) {
      const file = event.target.files[0];
      if (file) {
        const params = new FormData();
        params.append("file", file);

        Axios.post(urlUploadFile(this.$route.params.id), params).then((res) => {
          if (res.data.RespCode == 0) {
            this.getDocumentFile2(
              this.dataJobInfo.DocumentID,
              this.userMana.UserID
            );

            notify({
              title: "File",
              text: "Thêm file hồ sơ thành công",
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
    getDocumentFile(docID, UserID) {
      GetDocumentFile({
        DocumentID: docID,
        RowID: this.$route.params.id,
        UserID: UserID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.userJob.FileLst = res.Data;
        }
      });
    },
    getDocumentFile2(docID, UserID) {
      GetDocumentFile({
        DocumentID: docID,
        RowID: this.$route.params.id,
        UserID: UserID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.userMana.FileLst = res.Data;
        }
      });
    },
    getDocumentJobInfo() {
      GetDocumentJobInfo({ RowID: this.$route.params.id }).then((res) => {
        if (res.RespCode == 0) {
          this.dataJobInfo = res.Data;
          this.desserts = res.Data.ProductLst.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            };
          });
          this.userJob = this.dataJobInfo.AssignLst.find(
            (p) => p.UserRole == "Xử lý"
          );
          this.userMana = this.dataJobInfo.AssignLst.find(
            (p) => p.UserRole == "Phê duyệt"
          );
          this.processDocument(this.dataJobInfo.DocumentID);
        }
      });
    },
    reportDocumentJob() {
      if (this.dataJobInfo.Report && this.dataJobInfo.Report != "") {
        ReportDocumentJob({
          ID: this.$route.params.id,
          Note: this.dataJobInfo.Report,
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getDocumentJobInfo();
            notify({
              title: "Thành công",
              text: "Báo cáo thành công",
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
      } else {
        notify({
          title: "Lỗi",
          text: "Chưa nhập nội dung báo cáo",
          type: "error",
        });
      }
    },
    approveDocumentJob(status) {
      if (this.dataJobInfo.Report && this.dataJobInfo.Report != "") {
        ApproveDocumentJob({
          ID: this.$route.params.id,
          Status: status,
          NoteApprove: this.dataJobInfo.NoteApprove,
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getDocumentJobInfo();
            notify({
              title: "Thành công",
              text: "Phê duyệt thành công",
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
      } else {
        notify({
          title: "Lỗi",
          text: "Chưa nhập nội dung phê duyệt",
          type: "error",
        });
      }
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
      const previewUrl = `https://crm.icpc1hn.work/GSPDTPAPI/File/GetDocumentFile?FileName=${file.LinkFile}`;
      console.log(previewUrl);

      // Check for supported file types
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        // this.docContent = `<iframe :src="${this.fileUrl}" width="100%" height="600px"></iframe>`;
      } else if (fileExtension === ".docx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        await this.fetchDoc(this.fileUrl);
      } else if (fileExtension === ".xlsx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        await this.fetchXlsxContent(this.fileUrl);
      } else if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        this.isShowFile = true;
        this.docContent = `<img lazy src="${previewUrl}" alt="Image preview" width="100%" />`;
      }
      this.isLoading = false;
    },
    async fetchDoc(url) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        this.docContent = result.value;
      } catch (error) {
        console.error("Error loading document:", error);
      }
    },
    async fetchXlsxContent(url) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        var html = XLSX.utils.sheet_to_html(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        html = html
          .replace(
            /<table/g,
            `<table style='border: 1px solid black; border-collapse: collapse; text-align:center'`
          )
          .replace(
            /<th/g,
            `<th style='border: 1px solid black; border-collapse: collapse; padding:8px'`
          )
          .replace(
            /<td/g,
            `<td style='border: 1px solid black; border-collapse: collapse; padding:8px'`
          );
        console.log(html);

        this.docContent = html;
      } catch (error) {
        console.error("Error loading spreadsheet:", error);
      }
    },
  },
  created() {
    this.getDocumentJobInfo();
  },
};
</script>

<style lang="scss" scoped>
.layout-card {
  min-height: 250px;
  max-height: calc(100vh - 150px);
  overflow-y: scroll;
  margin-bottom: -10px;
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

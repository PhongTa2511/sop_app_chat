<template>
  <v-row>
    <input
      ref="fileInputExcel"
      type="file"
      accept=".xls,.xlsx"
      @change="handleFileUploadExcel"
      style="display: none"
    />
    <v-col :lg="8" cols="12">
      <v-card class="layout-card">
        <v-card-title class="text-h6 py-4">
          <div class="d-flex justify-sm-space-between">
            <div>Thông tin công việc</div>

            <v-btn
              color="blue"
              icon="mdi-list-box"
              size="small"
              @click="$router.push('/thong-tin/' + dataJobInfo.DocumentID)"
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
                    <v-btn
                      size="small"
                      color="blue"
                      rounded="md"
                      @click="btShowAdd"
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
                            @click="triggerFileInputClickExcel"
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
                    v-if="line.Type == 1"
                    :label="line.Parameter"
                    v-model="line.TextResult"
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
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
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
            <v-col lg="8" md="8" cols="12">
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
            <v-col lg="4" md="4" cols="12">
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
          <div v-if="dataJobInfo.Report" class="px-4">
            <v-row>
              <v-col lg="8" md="8" cols="12">
                <div class="text-h6">Nội dung báo cáo</div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="blue" size="small">mdi-account-edit</v-icon>
                  {{ userJob.FullName }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="green" size="small"
                    >mdi-clock-time-four-outline</v-icon
                  >
                  {{ dataJobInfo.TimeModify }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="orange" size="small">mdi-timer-sand</v-icon>
                  Định mức:
                  {{ userJob.QuotaTime }} Ngày
                </div>
                <div
                  v-html="dataJobInfo.Report"
                  class="border-md px-2 py-1 rounded"
                ></div>
              </v-col>
              <v-col lg="4" md="4" cols="12">
                <div class="d-flex justify-sm-space-between">
                  <div>Tệp đính kèm</div>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-chip-group
                  color="green"
                  column
                  v-if="
                    userJob && userJob.FileLst && userJob.FileLst.length > 0
                  "
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
            <v-col lg="8" md="8" cols="12">
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
            <v-col lg="4" md="4" cols="12">
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
          <div v-if="dataJobInfo.NoteApprove" class="px-4">
            <v-row>
              <v-col lg="8" md="8" cols="12">
                <div class="text-h6">Nội dung phê duyệt</div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="red" size="small">mdi-account-edit</v-icon>
                  {{ userMana.FullName }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="green" size="small"
                    >mdi-clock-time-four-outline</v-icon
                  >
                  {{ dataJobInfo.TimeApprove }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <v-icon color="orange" size="small">mdi-timer-sand</v-icon>
                  Định mức:
                  {{ userMana.QuotaTime }} Ngày
                </div>
                <div
                  v-html="dataJobInfo.NoteApprove"
                  class="border-md px-2 py-1 rounded"
                ></div>
              </v-col>
              <v-col lg="4" md="4" cols="12">
                <div class="d-flex justify-sm-space-between">
                  <div>Tệp đính kèm</div>
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
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col :lg="4" cols="12">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Quá trình thực hiện</div>
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

import { DelDocumentFile, GetDocumentFile } from "@/api/documentFileApi";
import {
  previewFile,
  fetchXlsxContent,
  fetchDoc,
  isPreviewSupported,
  downloadFile,
} from "@/utils/function";
import {
  GetDocumentFormByDocID,
  UpdateDocumentForm,
} from "@/api/documentFormApi";
import { exportExcel } from "./function";
import XLSX from "xlsx";
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
      headers: [],
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
      formTabLst: [],
      tab: "",
      editDocument: {},
      isShowEdit: false,
      newDocument: {},
      isShowAddNew: false,
    };
  },
  methods: {
    updateDocumentForm(data) {
      var docForm = {
        DocumentID: this.dataJobInfo.DocumentID,
        IDForm: data.IDForm,
        ProcedureID: this.dataJobInfo.ProcedureID,
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
              DocumentID: this.dataJobInfo.DocumentID,
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
    btExportExcel() {
      exportExcel(this.headers);
    },
    handleFileUploadExcel(event) {
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
    openEditDialog(item) {
      this.isShowEdit = true;
      this.editDocument = { ...item };
    },
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
          this.userJob = this.dataJobInfo.AssignLst.find(
            (p) => p.UserRole == "Xử lý"
          );
          this.userMana = this.dataJobInfo.AssignLst.find(
            (p) => p.UserRole == "Phê duyệt"
          );
          this.processDocument(this.dataJobInfo.DocumentID);
          this.getDocumentFormByDocID(this.dataJobInfo.DocumentID);
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
    getDocumentFormByDocID(docID) {
      GetDocumentFormByDocID({
        DocumentID: docID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.formTabLst = res.DocumentFormLst.map((item) => {
            if (item.TypeForm == 1) {
              item.DocumentFormLineLst = item.DNFormLineLst.map((ele) => {
                var options = [];
                if (ele.OptionAnswer) {
                  options = JSON.parse(ele.OptionAnswer);
                }

                var check = item.DocumentFormLineLst.find(
                  (p) => p.Required == ele.Required
                );
                if (check) {
                  return {
                    ...check,
                    Options: options,
                  };
                } else {
                  return {
                    ...ele,
                    Options: options,
                  };
                }
              });
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
    deleteDessert(key) {
      this.desserts = this.desserts.filter((item) => item.Key !== key);
    },
    triggerFileInputClick() {
      this.$refs.fileInput.click();
    },
    triggerFileInputClickExcel() {
      this.$refs.fileInputExcel.click();
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

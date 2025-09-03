<template>
  <v-row class="mt-2 pr-3" style="height: calc(100vh - 112px)">
    <v-col :lg="8" cols="12" class="">
      <v-card class="layout-card">
        <v-card-title class="text-h6 py-2 pl-4 pr-0">
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
            <v-chip color="blue">Quy trình</v-chip>
            {{ dataJobInfo.ProcedureName }}
          </div>
          <div class="mt-2 text-subtitle-1">
            <v-chip color="red">Bước {{ dataJobInfo.StepOrder }}</v-chip>
            {{ dataJobInfo.StepName }}
          </div>
          <div class="mt-2 text-subtitle-1">
            <v-chip color="green">Công việc</v-chip>
            {{ dataJobInfo.JobName }}
          </div>
          <div class="mt-2 text-subtitle-1">
            <v-chip color="orange">Hồ sơ</v-chip>
            {{ dataJobInfo.Note }}
          </div>
        </v-card-title>
        <v-tabs v-model="tab" grow v-if="formTabLst.length > 0">
          <v-tab
            v-for="(item, index) in formTabLst"
            :key="index"
            :text="item.NameForm"
            :value="item"
            show-arrows
          ></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" v-if="formTabLst.length > 0">
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
                items-per-page="1000"
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
                    @click="deleteDessert(item)"
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
          </v-tabs-window-item>
        </v-tabs-window>
        <v-divider></v-divider>
        <div class="px-2 py-2 pb-2">
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
            dataJobInfo.Status == 1 &&
            userJob.UserID == userName
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
              <div class="quill">
                <QuillEditor
                  v-model:content="dataJobInfo.Report"
                  contentType="html"
                  theme="snow"
                  toolbar="minimal"
                  style="border: none"
                >
                </QuillEditor>
              </div>
            </v-col>
            <v-col lg="4" md="4" cols="12">
              <div class="d-flex justify-sm-space-between">
                <div>Tệp đính kèm</div>
                <v-btn
                  color="blue"
                  icon="mdi-link-plus"
                  size="small"
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
              @click="openStepDialog(0)"
              >Báo cáo</v-btn
            >
          </div>
        </div>
        <div v-else>
          <div v-if="dataJobInfo.Report" class="px-4">
            <v-row>
              <v-col lg="8" md="8" cols="12">
                <div class="text-h6">
                  Nội dung báo cáo
                  <v-chip
                    color="green"
                    v-if="dataJobInfo.Status == 3 || dataJobInfo.Status == 4"
                    >Đã báo cáo</v-chip
                  >
                </div>
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
            dataJobInfo.Status == 3 &&
            userMana.UserID == userName
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

              <div class="quill">
                <QuillEditor
                  v-model:content="dataJobInfo.NoteApprove"
                  contentType="html"
                  theme="snow"
                  toolbar="minimal"
                  style="border: none"
                >
                </QuillEditor>
              </div>
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
              @click="openStepDialog(4)"
              >Phê duyệt</v-btn
            >
            <v-btn color="red" rounded="8" @click="openStepDialog(5)"
              >Từ chối</v-btn
            >
          </div>
        </div>
        <div v-else>
          <div v-if="dataJobInfo.NoteApprove" class="px-4">
            <v-row>
              <v-col lg="8" md="8" cols="12">
                <div class="text-h6">
                  Nội dung phê duyệt
                  <v-chip color="green" v-if="dataJobInfo.Status == 4"
                    >Đã duyệt</v-chip
                  >
                  <v-chip color="red" v-if="dataJobInfo.Status == 5"
                    >Đã từ chối</v-chip
                  >
                </div>
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
    <v-col :lg="4" cols="12" class="px-0">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Quá trình thực hiện</div>
        </div>
        <v-divider class="my-2"></v-divider>
        <div v-for="(item, index) in processLst" :key="index" class="mx-2 my-2">
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
    </v-col>
  </v-row>
  <input
    ref="fileInputExcel"
    type="file"
    accept=".xls,.xlsx"
    @change="handleFileUploadExcel"
    style="display: none"
  />
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
            <v-autocomplete
              v-if="header.type == 3"
              v-model="editDocument[header.key]"
              :label="header.title"
              :items="header.options"
              item-value="value"
              item-title="text"
              chips
              hide-details
              multiple
            ></v-autocomplete>
            <div v-if="header.type == 4">
              <V-DateField
                v-model:modelValue="editDocument[header.key]"
                :label="header.title"
                width="100%"
              />
            </div>
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
  <v-dialog v-model="isShowSteps" width="600">
    <v-card>
      <v-card-title>Danh sách các bước thực hiện</v-card-title>
      <v-card-text style="margin-top: -24px">
        <v-list>
          <v-list-item v-for="(step, index) in stepLst" :key="index">
            <v-checkbox
              v-model="step.Checked"
              :label="step.StepOrder + '. ' + step.StepName"
              color="blue"
              class="px-3"
              hide-details
            ></v-checkbox>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowSteps = false">Đóng</v-btn>
        <v-btn color="green" @click="btConfirm">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  ApproveDocumentJob,
  GetDocumentJobInfo,
  ProcessDocument,
  ReportDocumentJob,
} from "@/api/documentJobApi";
import { formatDateHHDDMM } from "@/helpers/getTime";
import { getUserName } from "@/utils/auth";
import Editor from "@tinymce/tinymce-vue";
import Axios from "axios";
import { urlUploadFile } from "./function";

import { GetDefaultValue } from "@/api/default";
import { DelDocumentFile, GetDocumentFile } from "@/api/documentFileApi";
import {
  GetDocumentFormByDocID,
  UpdateDocumentForm,
} from "@/api/documentFormApi";
import { GetWareHouseLst } from "@/api/productApi";
import { GetUserLstByTeamID } from "@/api/user";
import logo from "@/assets/images/logos/dtp-logo.png";
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";
import XLSX from "xlsx";
import { exportExcel } from "./function";

export default {
  components: {
    Editor,
  },
  data() {
    return {
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
      stepLst: [],
      isShowSteps: false,
      userName: getUserName(),
      isLoadingFile: false,
      logo: logo,
    };
  },
  watch: {
    tab(value) {
      if (value.headers && value.desserts) {
        this.headers = value.headers;
        var lengthMax = 0;
        this.desserts = value.desserts.map((item, index) => {
          var line = "";
          for (var header = 0; header < this.headers.length; header++) {
            line = item[this.headers[header].key];
            if (header > 0) {
              var checkText = this.checkNumberTypeOrPhone(line);
              item["Line" + header] = checkText.value;
              if (!checkText.isValid) {
                if (checkText.value) {
                  if (
                    checkText.value.length > lengthMax &&
                    checkText.value.length < 80
                  ) {
                    lengthMax = checkText.value.length;
                    this.headers[header].minWidth = 200;
                  }
                  if (
                    checkText.value.length > lengthMax &&
                    checkText.value.length >= 80
                  ) {
                    this.headers[header].minWidth = 300;
                    lengthMax = checkText.value.length;
                  }
                }
              }
            }
          }
          return {
            ...item,
          };
        });
      }
    },
  },
  methods: {
    updateDocumentForm(data) {
      this.isLoadingFile = true;
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
        docForm.DocumentFormLineLst = data.DocumentFormLineLst.map((item) => {
          if (item.Type == 2) {
            var textAnswer =
              item.TextResult && item.TextResult != ""
                ? item.TextResult.join(" | ")
                : "";
            return {
              ...item,
              TextResult: textAnswer,
            };
          } else {
            return {
              ...item,
            };
          }
        });
      }

      UpdateDocumentForm({
        DocumentFormInfo: docForm,
      })
        .then((res) => {
          this.isLoadingFile = false;
          if (res.RespCode == 0) {
            notify({
              title: "Thành công",
              text: "Lưu thông tin thành công",
              type: "success",
            });
          }
        })
        .catch(() => {
          this.isLoadingFile = false;
        });
    },
    checkNumberTypeOrPhone(str) {
      if (/[^0-9.,+\s]/.test(str)) {
        return { isValid: true, type: "Text", value: str };
      }
      const isPhone = /^[+]?[0-9]{9,15}$/.test(str);
      if (isPhone) {
        return { isValid: true, type: "Text", value: str }; // Là số điện thoại
      }
      const cleanedStr = str.replace(/[,.]/g, "");
      const num = parseFloat(cleanedStr);
      if (isNaN(num)) {
        return { isValid: false, type: null, value: str }; // Không hợp lệ
      }
      if (Number.isInteger(num)) {
        return {
          isValid: true,
          type: "Int",
          value: new Intl.NumberFormat("en-US").format(num),
        }; // Số nguyên
      } else {
        return {
          isValid: true,
          type: "Float",
          value: new Intl.NumberFormat("en-US").format(num),
        }; // Số thập phân
      }
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
          this.desserts = this.convertToReq(data).map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              Status: 1,
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
            let value = data[i][index];
            if (typeof value === "number") {
              if (Number.isInteger(value)) {
                value = Math.round(value);
              } else {
                value = parseFloat(value.toFixed(2));
              }
            }

            req["Line" + index] = value;
          });

          lstReq.push(req);
        }
      }
      return lstReq;
    },
    addNewDocument() {
      this.isShowAddNew = false;
      this.desserts.push(this.newDocument);
      this.desserts = this.desserts.map((item, index) => {
        return {
          ...item,
          Key: index + 1,
          Status: 1,
        };
      });
    },
    btShowAdd() {
      this.isShowAddNew = true;
    },
    openEditDialog(item) {
      this.isShowEdit = true;
      this.editDocument = { ...item };
    },
    updateDocument() {
      this.isShowEdit = false;
      const index = this.desserts.findIndex(
        (p) => p.Key === this.editDocument.Key
      );
      if (index !== -1) {
        this.desserts[index] = { ...this.editDocument };
      }
    },
    deleteDessert(data) {
      data.Status = 0;
    },
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension);
    },
    downloadFile(file) {
      downloadFile(file);
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
      const previewUrl = `https://sop.idtp.work/api/File/GetDocumentFile?FileName=${file.LinkFile}`;
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
          Data: this.stepLst.filter((p) => p.Checked),
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getDocumentJobInfo();
            this.isShowSteps = false;
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
      if (this.dataJobInfo.NoteApprove && this.dataJobInfo.NoteApprove != "") {
        ApproveDocumentJob({
          ID: this.$route.params.id,
          Status: status,
          NoteApprove: this.dataJobInfo.NoteApprove,
          Data: this.stepLst.filter((p) => p.Checked),
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getDocumentJobInfo();
            this.isShowSteps = false;
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
    openStepDialog(status) {
      var proStepLst = this.processLst.filter(
        (item, index, self) =>
          index === self.findIndex((el) => el.StepID === item.StepID)
      );
      if (status == 4) {
        this.stepLst = proStepLst
          .filter(
            (p) => parseInt(p.StepOrder) > parseInt(this.dataJobInfo.StepOrder)
          )
          .map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              Checked: false,
            };
          });

        if (this.dataJobInfo.StepNext && this.dataJobInfo.StepNext != "") {
          this.approveDocumentJob(4);
        } else {
          if (this.stepLst.length == 0) {
            this.approveDocumentJob(4);
          } else {
            this.isShowSteps = true;
            this.statusJob = status;
          }
        }
      }
      if (status == 5) {
        this.stepLst = proStepLst.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
            Checked: false,
          };
        });
        if (this.dataJobInfo.StepBack && this.dataJobInfo.StepBack != "") {
          this.approveDocumentJob(5);
        } else {
          if (this.stepLst.length == 0) {
            this.approveDocumentJob(5);
          } else {
            this.isShowSteps = true;
            this.statusJob = status;
          }
        }
      }
      if (status == 0) {
        this.stepLst = proStepLst
          .filter(
            (p) => parseInt(p.StepOrder) > parseInt(this.dataJobInfo.StepOrder)
          )
          .map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              Checked: true,
            };
          });
        if (this.dataJobInfo.AssignLst.length > 1) {
          this.reportDocumentJob();
        } else {
          if (this.dataJobInfo.StepNext && this.dataJobInfo.StepNext != "") {
            this.reportDocumentJob();
          } else {
            if (this.stepLst.length == 0) {
              this.reportDocumentJob();
            } else {
              this.isShowSteps = true;
              this.statusJob = status;
            }
          }
        }
      }
    },
    btConfirm() {
      if (this.statusJob == 4 || this.statusJob == 5) {
        this.approveDocumentJob(this.statusJob);
      } else {
        this.reportDocumentJob();
      }
    },
    async getDocumentFormByDocID() {
      const res = await GetDocumentFormByDocID({
        DocumentID: this.$route.params.id,
      });

      if (res.RespCode == 0) {
        this.formTabLst = [];

        for (const item of res.DocumentFormLst) {
          if (item.TypeForm == 1) {
            const newLines = [];

            // duyệt qua DNFormLineLst (cấu hình form gốc)
            for (const ele of item.DNFormLineLst) {
              let options = [];

              if (ele.OptionAnswer) {
                options = JSON.parse(ele.OptionAnswer);
              }

              // tìm bản ghi đã lưu trong DocumentFormLineLst
              const check = item.DocumentFormLineLst.find(
                (p) => p.Required == ele.Required
              );

              if (check) {
                // ưu tiên lấy từ DocumentFormLineLst
                let text = "";
                if (check.Type == 2) {
                  text =
                    check.TextResult && check.TextResult !== ""
                      ? check.TextResult.split(" | ")
                      : [];
                } else {
                  text = check.TextResult;
                }

                if (check.Type == 3) {
                  if (check.OptionLine == 1) {
                    options = await this.getUserLstByTeamID(check.OptionText);
                  }
                  if (check.OptionLine == 2) {
                    options = await this.getDefaultValue(check.OptionText);
                  }
                  if (check.OptionLine == 3) {
                    options = await this.getProductLst();
                  }
                }

                newLines.push({
                  ...check,
                  Options: options,
                  TextResult: text,
                });
              } else {
                // nếu DocumentFormLineLst không có thì fallback DNFormLineLst
                if (ele.Type == 3) {
                  if (ele.OptionLine == 1) {
                    options = await this.getUserLstByTeamID(ele.OptionText);
                  }
                  if (ele.OptionLine == 2) {
                    options = await this.getDefaultValue(ele.OptionText);
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
            }

            item.DocumentFormLineLst = newLines;
          }

          // giữ nguyên xử lý TypeForm == 2 (table)
          if (item.TypeForm == 2) {
            item.headers = [
              { title: "STT", sortable: false, key: "Key", align: "center" },
            ];

            for (const line of item.DNFormLineLst) {
              if (line.IsPrivate == 0) {
                item.headers.push({
                  title: line.Parameter,
                  sortable: false,
                  key: "Line" + line.Required,
                  align: "left",
                  type: line.Type,
                  options: line.Type == 2 ? JSON.parse(line.OptionAnswer) : [],
                });
              }
            }

            const len = item.DocumentFormLineLst.filter(
              (obj, index, self) =>
                index === self.findIndex((o) => o.IDFormLine === obj.IDFormLine)
            );

            item.desserts = len.map((l, i) => {
              const itemlst = item.DocumentFormLineLst.filter(
                (p) => p.IDFormLine == l.IDFormLine && p.IsPrivate == 0
              );

              const itemde = {};
              itemlst.forEach((ele, inle) => {
                itemde["Line" + (inle + 1)] = ele.TextResult;
              });

              return { ...itemde, Key: i + 1, Status: 1 };
            });
          }

          this.formTabLst.push(item);
        }

        if (this.formTabLst.length > 0) {
          this.tab = this.formTabLst[0];
        }
      }
    },
    async getUserLstByTeamID(teamID) {
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

      const res = await GetWareHouseLst(requestData);

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
    async getDefaultValue(table) {
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
  .quill {
    height: 200px;
    border: 2px solid rgb(var(--v-theme-grey));
    border-radius: 8px;
  }
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  border-radius: 8px;
}
</style>

<style lang="scss">
.ql-toolbar.ql-snow {
  border: none !important;
}
</style>

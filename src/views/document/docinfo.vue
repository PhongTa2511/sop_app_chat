<template>
  <v-card class="py-4 pb-0">
    <div class="d-flex justify-space-between mx-4" v-if="docInfo.TypeDoc">
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
        <v-tooltip text="Bắt đầu" v-if="isShowStart">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="green"
              class="mr-1"
              icon="mdi-gesture-double-tap"
              @click="isShowSteps = true"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Trao đổi">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="red"
              class="mr-1"
              icon="mdi-chat"
              @click="btChat"
            ></v-btn>
          </template>
        </v-tooltip>
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
                color="success"
                rounded="4"
                block
                @click="updateGSPDocument(2)"
              >
                Đang làm
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
                @click="confirmCancelDocument"
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
            :items="desserts.filter((p) => p.Status > 0)"
            height="calc(100vh - 310px)"
            items-per-page-text="Số dòng 1 trang"
            sort-asc-icon="mdi-menu-up"
            sort-desc-icon="mdi-menu-down"
            :items-per-page="rowspPage"
            :items-length="desserts.length"
            @update:itemsPerPage="btRow"
            @update:page="btPage"
            fixed-header
            :items-per-page-options="[
              { value: 10, title: '10' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: 10000, title: 'All' },
            ]"
          >
            <template v-slot:top="{ item }">
              <div class="mx-auto mt-2">
                <v-btn size="small" color="blue" rounded="md" @click="btShowAdd"
                  >Thêm mới
                </v-btn>

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
                  >Lưu thông tin
                </v-btn>
                <v-btn
                  size="small"
                  class="ml-2"
                  color="green"
                  rounded="md"
                  @click="btExportExcel1(tab)"
                >
                  Xuất Excel
                </v-btn>
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
  </v-card>
  <v-row class="mt-0">
    <v-col cols="12" md="6" class="pr-1">
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
            <v-spacer></v-spacer>
            <v-chip
              >{{
                item.StepLst.filter((p) => p.Status == 4 || p.Status == 5)
                  .length
              }}/{{ item.StepLst.length }}</v-chip
            >
            <v-btn
              rounded="full"
              color="blue"
              v-bind="props"
              icon="mdi-dots-vertical"
              size="x-small"
              @click="btShowInfoStep(item)"
            >
              <template v-slot:prepend>
                <v-icon color="blue"></v-icon>
              </template>
            </v-btn>
            <!-- <v-menu>
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
            </v-menu> -->
          </div>

          <v-divider class="my-2" color="blue"></v-divider>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" class="pl-1">
      <v-card class="py-2 px-2 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Các nhóm thực hiện</div>
          <v-tooltip text="Lưu thông tin" v-if="teamLst.length > 0">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-small"
                color="green"
                class="mr-1"
                icon="mdi-account-check"
                @click="updateDocumentAssign()"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>

        <v-divider class="my-2"></v-divider>
        <div class="text-center py-8" v-if="teamLst.length == 0">
          <v-icon color="red" size="large"> mdi-text-box-search </v-icon>
          <div>Chưa có nhóm nào trong quy trình</div>
        </div>
        <div v-else>
          <div v-for="(item, index) in teamLst" :key="index" class="mx-2 my-2">
            <div class="d-flex" style="color: rgb(var(--v-theme-blue))">
              {{ item.TeamName }}
            </div>
            <div>
              <v-autocomplete
                placeholder="Người đại diện"
                density="compact"
                v-model="item.UserID"
                :items="item.UserLst"
                item-value="UserName"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
                clearable
                hide-details
              ></v-autocomplete>
            </div>
            <!-- <v-divider class="my-2" color="blue"></v-divider> -->
          </div>
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
                v-model="item.UserJob.ComID"
                placeholder="Nhóm xử lý"
                density="compact"
                :items="groupLst"
                item-value="TeamID"
                item-title="TeamName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
                clearable
              ></v-select>
              <v-autocomplete
                v-model="item.UserJob.UserID"
                :items="getUserLstByTeamID(item.UserJob.ComID)"
                placeholder="Người xử lý"
                item-value="UserName"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
                clearable
                hide-details
              ></v-autocomplete>
              <v-text-field
                v-model="item.UserJob.QuotaTime"
                label="Hạn xử lý"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
                clearable
              ></v-text-field>
            </v-col>
            <v-col :lg="6">
              <span>Cài đặt phê duyệt</span>
              <v-select
                v-model="item.UserMana.ComID"
                :items="groupLst"
                placeholder="Nhóm phê duyệt"
                density="compact"
                item-value="TeamID"
                item-title="TeamName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
                clearable
              ></v-select>
              <v-autocomplete
                v-model="item.UserMana.UserID"
                :items="getUserLstByTeamID(item.UserMana.ComID)"
                placeholder="Người phê duyệt"
                density="compact"
                item-value="UserName"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
                clearable
                hide-details
              ></v-autocomplete>
              <v-text-field
                v-model="item.UserMana.QuotaTime"
                label="Hạn phê duyệt"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
                clearable
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
  <v-dialog v-model="isShowSteps" width="600">
    <v-card>
      <v-card-title>Danh sách các bước thực hiện</v-card-title>
      <v-card-text style="margin-top: -24px">
        <v-list>
          <v-radio-group v-model="stepStart">
            <v-radio
              v-for="(step, index) in processLst"
              :key="index"
              :label="step.StepOrder + '. ' + step.StepName"
              :value="step.StepID"
              color="blue"
              class="px-3"
              hide-details
            ></v-radio>
          </v-radio-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowSteps = false">Đóng</v-btn>
        <v-btn color="green" @click="startDocument">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowCancelDialog" max-width="400px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Xác nhận</span>
        <v-btn
          variant="text"
          size="x-small"
          icon="mdi-close"
          color="grey"
          @click="isShowCancelDialog = false"
        ></v-btn>
      </v-card-title>
      <v-card-text> Bạn có chắc chắn muốn hủy hồ sơ này không? </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowCancelDialog = false">Hủy</v-btn>
        <v-btn color="red" @click="cancelDocument">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isLoadingFile" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item
        prepend-icon="$vuetify-outline"
        title="Đang lưu thông tin..."
      >
        <template v-slot:prepend>
          <div class="pe-4">
            <v-img
              :aspect-ratio="1"
              class="bg-white"
              :src="logo"
              width="44"
              cover
            ></v-img>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="green"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script>
import {
  GSPGetGSPDocumentInfoByID,
  UpdateDocumentAssign,
  UpdateGSPDocument,
} from "@/api/briefApi";
import {
  GetDocumentFormByDocID,
  UpdateDocumentForm,
} from "@/api/documentFormApi";
import {
  AddAssignLst,
  GetDocumentJobByDocID,
  ProcessDocument,
  SendMailAddAssignLst,
  StartDocument,
} from "@/api/documentJobApi";
import { CreateGroup } from "@/api/messageApi";
import { GetTeamLstDocID, GetTeamLstProID } from "@/api/teamApi";
import logo from "@/assets/images/logos/dtp-logo.png";
import { formatDate, formatDateHHDDMM } from "@/helpers/getTime";
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";
import XLSX from "xlsx";
import { exportExcel } from "./function";
import { exportExcel1 } from "./function1";
// import { exportExcel1 } from "./function1";
export default {
  data() {
    return {
      headers: [],
      desserts: [],
      docInfo: {},
      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,
      processLst: [],
      isShowInfoStep: false,
      stepInfo: {},
      workLst: [],
      userLstWork: [],
      userLstMana: [],
      groupLst: [],
      teamLst: [],
      formTabLst: [],
      tab: "",
      isShowAddNew: false,
      newDocument: {},
      isShowEdit: false,
      editDocument: {},
      isShowProcess: false,
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
      isShowStart: false,
      stepStart: "",
      isShowSteps: false,
      isShowCancelDialog: false,
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
    btExportExcel1(tab, header) {
      exportExcel1(
        this.desserts.filter((p) => p.Status > 0),
        this.headers
      );
    },
    getUserLstByTeamID(teamID) {
      if (teamID) {
        var data = this.groupLst.find((p) => p.TeamID == teamID);
        if (data) {
          return this.groupLst.find((p) => p.TeamID == teamID).UserLst;
        }
      }
      return [];
    },
    updateDocumentAssign() {
      UpdateDocumentAssign({
        Data: this.teamLst,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
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
    btChat() {
      if (this.docInfo.GroupID) {
        this.$router.push({
          path: "/nhan-tin",
          query: { docID: this.docInfo.DocumentID },
        });
      } else {
        CreateGroup({
          Data: {
            DocumentID: this.docInfo.DocumentID,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.$router.push({
              path: "/nhan-tin",
              query: { docID: this.docInfo.DocumentID },
            });
          }
        });
      }
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
    updateGSPDocument(status) {
      UpdateGSPDocument({
        DocumentInfo: {
          ...this.docInfo,
          DateExpired: formatDate(this.docInfo.DateExpired),
          DateRecept: formatDate(this.docInfo.DateRecept),
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
      GetTeamLstProID({
        ProcedureID: this.docInfo.TypeDoc,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst = res.Data;
        }
      });
      GetTeamLstDocID({
        ProcedureID: this.docInfo.DocumentID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.teamLst = res.Data;
        }
      });
    },
    btShowInfoStep(data) {
      this.isShowInfoStep = true;
      this.stepInfo = data;
      this.getDocumentJobByDocID(data.StepID, data.RowID);
    },
    getDocumentJobByDocID(stepID, rowID) {
      GetDocumentJobByDocID({
        DocumentID: this.$route.params.id,
        StepID: stepID,
        RowID: rowID,
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
          this.isShowStart = true;
          this.processLst = res.DocumentJobLst.map((item, index) => {
            if (item.StepLst.length > 0) {
              this.isShowStart = false;
            }
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
          this.getdefault();
        }
      });
    },
    btAddUserInWork(data) {
      var asi = [];
      if (data.UserJob.UserID && data.UserJob.ComID && data.UserJob.QuotaTime) {
        asi.push({
          ...data.UserJob,
          UserRole: "Xử lý",
        });
      } else {
        notify({
          title: "Nhắc nhờ",
          text: "Vui lòng nhập thông tin người xử lý",
          type: "warn",
        });
        return;
      }
      if (data.UserMana.UserID) {
        if (
          data.UserMana.UserID &&
          data.UserMana.ComID &&
          data.UserMana.QuotaTime
        ) {
          asi.push({
            ...data.UserMana,
            UserRole: "Phê duyệt",
          });
        } else {
          notify({
            title: "Nhắc nhờ",
            text: "Vui lòng nhập thông tin người phê duyệt",
            type: "warn",
          });
          return;
        }
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
      if (data.UserJob.UserID && data.UserJob.ComID && data.UserJob.QuotaTime) {
        asi.push({
          ...data.UserJob,
          UserRole: "Xử lý",
        });
      } else {
        notify({
          title: "Nhắc nhờ",
          text: "Vui lòng nhập thông tin người xử lý",
          type: "warn",
        });
        return;
      }
      if (data.UserMana.UserID) {
        if (
          data.UserMana.UserID &&
          data.UserMana.ComID &&
          data.UserMana.QuotaTime
        ) {
          asi.push({
            ...data.UserMana,
            UserRole: "Phê duyệt",
          });
        } else {
          notify({
            title: "Nhắc nhờ",
            text: "Vui lòng nhập thông tin người phê duyệt",
            type: "warn",
          });
          return;
        }
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
              item.DocumentFormLineLst = item.DNFormLineLst.map((ele) => {
                var options = [];
                if (ele.OptionAnswer) {
                  options = JSON.parse(ele.OptionAnswer);
                }

                var check = item.DocumentFormLineLst.find(
                  (p) => p.Required == ele.Required
                );
                if (check) {
                  var text = "";
                  if (check.Type == 2) {
                    text =
                      check.TextResult && check.TextResult != ""
                        ? check.TextResult.split(" | ")
                        : [];
                  } else {
                    text = check.TextResult;
                  }
                  return {
                    ...check,
                    Options: options,
                    TextResult: text,
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
              item.headers = [
                {
                  title: "STT",
                  sortable: false,
                  key: "Key",
                  align: "center",
                },
              ];

              for (var i = 0; i < item.DNFormLineLst.length; i++) {
                const line = item.DNFormLineLst[i];
                item.headers.push({
                  title: line.Parameter,
                  sortable: false,
                  key: "Line" + line.Required,
                  align: "left",
                  type: line.Type,
                  options: line.Type == 2 ? JSON.parse(line.OptionAnswer) : [],
                });
              }
              var len = item.DocumentFormLineLst.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex((obj) => obj.IDFormLine === item.IDFormLine)
              );
              var numlen = len.length;
              item.desserts = [];
              for (var i = 0; i < numlen; i++) {
                var itemlst = item.DocumentFormLineLst.filter(
                  (p) => p.IDFormLine == len[i].IDFormLine
                );
                var itemde = {};
                itemlst.forEach((ele, inle) => {
                  itemde["Line" + (inle + 1)] = ele.TextResult;
                });
                item.desserts.push(itemde);
              }
              item.desserts = item.desserts.map((item, index) => {
                return {
                  ...item,
                  Key: index + 1,
                  Status: 1,
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
          Status: 1,
        };
      });
    },
    btShowAdd() {
      this.isShowAddNew = true;
    },
    updateDocumentForm(data) {
      this.isLoadingFile = true;
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
              Status: item.Status,
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
    triggerFileInputClick() {
      this.$refs.fileInput.click();
    },
    startDocument() {
      StartDocument({
        DocumentID: this.$route.params.id,
        StepID: this.stepStart,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowSteps = false;
          this.getDocumentInfoByID();
          notify({
            title: "Thành công",
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
    confirmCancelDocument() {
      this.isShowCancelDialog = true;
    },
    cancelDocument() {
      this.isShowCancelDialog = false;
      this.updateGSPDocument(0);
    },
  },
  created() {
    this.getDocumentInfoByID();
    this.getDocumentFormByDocID();
  },
};
</script>

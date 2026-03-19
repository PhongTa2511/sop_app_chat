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
          <v-btn
            color="warning"
            size="x-small"
            icon="mdi-edit"
            @click="isShowUpdateNote = true"
          ></v-btn>
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-clipboard-text-clock</v-icon>
          Hạn xử lý:
          {{ formatDateDDMMYY(docInfo.DateExpired) }}
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
                <v-tooltip text="Thêm mới từng dòng">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="blue"
                      class="mr-1"
                      size="small"
                      icon="mdi-playlist-plus"
                      @click="btShowAdd"
                    ></v-btn>
                  </template>
                </v-tooltip>
                <v-menu>
                  <template #activator="{ props: menuProps }">
                    <v-tooltip text="Thêm bằng file excel">
                      <template #activator="{ props: tooltipProps }">
                        <v-btn
                          v-bind="{ ...menuProps, ...tooltipProps }"
                          size="small"
                          color="green"
                          class="mr-1"
                          icon="mdi-table-large-plus"
                        />
                      </template>
                    </v-tooltip>
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-btn
                        prepend-icon="mdi-microsoft-excel"
                        size="small"
                        color="grey"
                        rounded="4"
                        block
                        @click="btExportExcel"
                      >
                        <template #prepend>
                          <v-icon color="blue" />
                        </template>
                        Excel Mẫu
                      </v-btn>
                    </v-list-item>

                    <v-list-item>
                      <v-btn
                        prepend-icon="mdi-microsoft-excel"
                        size="small"
                        color="grey"
                        rounded="4"
                        block
                        @click="triggerFileInputClick"
                      >
                        <template #prepend>
                          <v-icon color="green" />
                        </template>
                        Thêm Excel
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-tooltip text="Xuất excel">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="small"
                      color="red"
                      class="mr-1"
                      icon="mdi-table-arrow-right"
                      @click="btExportExcel1(tab)"
                    ></v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip
                  text="Bảng kê nguyên phụ liệu"
                  v-if="tab.IDForm == 'F005083'"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="small"
                      color="purple"
                      class="mr-1"
                      icon="mdi-database-outline"
                      @click="isShowMaterial = true"
                    ></v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Lưu thông tin">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="green"
                      class="mr-1"
                      size="small"
                      icon="mdi-content-save-check"
                      @click="updateDocumentForm(tab)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
            <template
              v-for="hea in headers.filter((h) => h.type == 5 || h.type == 6)"
              :key="hea.key"
              v-slot:[`item.${hea.key}`]="{ item }"
            >
              <v-icon
                v-if="hea.type === 5 && item[hea.key]"
                color="green"
                size="x-small"
                icon="mdi-eye"
                @click="btShowImage(JSON.parse(item[hea.key]).LinkFile)"
              >
              </v-icon>

              <v-btn
                v-else-if="hea.type === 6 && item[hea.key]"
                color="blue"
                size="x-small"
                icon="mdi-download"
                @click="btDownloadFile(JSON.parse(item[hea.key]).LinkFile)"
              >
              </v-btn>
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
              <div v-if="line.Type == 5">
                <div class="d-flex align-center">
                  <v-btn
                    v-if="line.TextResult"
                    class="mr-2 cursor-pointer"
                    color="primary"
                    @click="btShowImage(line.OptionText)"
                    icon="mdi-eye"
                    size="small"
                  >
                  </v-btn>

                  <v-file-input
                    :clearable="false"
                    single-line
                    :model-value="line"
                    accept="image/png, image/jpeg, image/bmp"
                    :label="line.Parameter"
                    prepend-icon=""
                    append-inner-icon="mdi-image"
                    @update:model-value="
                      (file) => handleFileUploadForm(file, line)
                    "
                  >
                    <template v-slot:selection="{}">
                      {{ line.DateResult ?? line.Parameter }}
                    </template>
                  </v-file-input>
                </div>
              </div>
              <div v-if="line.Type == 6">
                <div class="d-flex align-center">
                  <v-btn
                    v-if="line.TextResult"
                    class="mr-2 cursor-pointer"
                    color="primary"
                    @click="btDownloadFile(line.OptionText)"
                    icon="mdi-download"
                    size="small"
                  >
                  </v-btn>
                  <v-file-input
                    :clearable="false"
                    :single-line="true"
                    :model-value="line"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    :label="line.Parameter"
                    prepend-icon=""
                    append-inner-icon="mdi-file"
                    @update:model-value="
                      (file) => handleFileUploadForm(file, line)
                    "
                    ><template v-slot:selection="{}">
                      {{ line.DateResult ?? line.Parameter }}
                    </template>
                  </v-file-input>
                </div>
              </div>
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
          <!-- <v-btn
            rounded="full"
            color="green"
            icon="mdi-progress-check"
            size="x-small"
            @click="btShowProcess()"
          >
          </v-btn> -->
          <v-tooltip text="Quá trình thực hiện">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-small"
                color="green"
                class="mr-1"
                icon="mdi-progress-check"
                @click="btShowProcess()"
              ></v-btn>
            </template>
          </v-tooltip>
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
              icon="mdi-dots-vertical"
              size="x-small"
              @click="btShowInfoStep(item)"
            >
              <template v-slot:prepend>
                <v-icon color="blue"></v-icon>
              </template>
            </v-btn>
          </div>

          <v-divider class="my-2" color="blue"></v-divider>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" class="pl-1">
      <v-card class="py-2 px-2 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Các nhóm thực hiện</div>
          <!-- <v-tooltip text="Lưu thông tin" v-if="teamLst.length > 0">
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
          </v-tooltip> -->
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
                @update:modelValue="updateDocumentAssign"
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
          @click="
            isShowInfoStep = false;
            this.processDocument();
          "
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
            <v-col :lg="7">
              <span>Cài đặt xử lý</span>
              <v-select
                v-model="item.UserJob.ComID"
                placeholder="Nhóm xử lý"
                density="compact"
                :items="groupLst"
                item-value="TeamID"
                item-title="TeamName"
                chips
                class="mb-2 mt-2 w-100"
                clearable
              ></v-select>
              <v-autocomplete
                v-model="item.UserJob.UserID"
                :items="getUserLstByTeamID(item.UserJob?.ComID) || []"
                placeholder="Người xử lý"
                item-value="UserName"
                item-title="FullName"
                chips
                class="mb-2 w-100"
                hide-details
                multiple
                closable-chips
              >
              </v-autocomplete>
              <v-text-field
                v-model="item.UserJob.QuotaTime"
                label="Hạn xử lý"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                class="mb-2 w-100"
                clearable
              ></v-text-field>
            </v-col>
            <v-col :lg="5">
              <span>Cài đặt phê duyệt</span>
              <v-select
                v-model="item.UserMana.ComID"
                :items="groupLst"
                placeholder="Nhóm phê duyệt"
                density="compact"
                item-value="TeamID"
                item-title="TeamName"
                chips
                class="mb-2 mt-2 w-100"
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
                class="mb-2 w-100"
                closable-chips
                hide-details
              ></v-autocomplete>
              <v-text-field
                v-model="item.UserMana.QuotaTime"
                label="Hạn phê duyệt"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                class="w-100"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex justify-center my-4" v-if="item.Status != 4">
            <v-btn
              variant="tonal"
              rounded="8"
              size="small"
              @click="btAddUserInWork(item)"
              color="blue"
              class="mr-1"
              >Gán người xử lý</v-btn
            >
            <v-btn
              variant="tonal"
              rounded="8"
              size="small"
              @click="btAddUserInWork2(item)"
              color="green"
              class="ml-1"
              >Bắt đầu công việc</v-btn
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
            class="pb-0"
          >
            <v-text-field
              v-if="header.type == 1"
              :label="header.title"
              v-model="newDocument[header.key]"
            ></v-text-field>
            <v-autocomplete
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
              hide-details=""
            ></v-autocomplete>

            <V-DateField
              v-if="header.type == 4"
              v-model:modelValue="newDocument[header.key]"
              :label="header.title"
              width="100%"
            />

            <div class="d-flex align-center" v-if="header.type == 5">
              <v-btn
                v-if="newDocument[header.key]"
                class="mr-2 cursor-pointer"
                color="primary"
                @click="
                  btShowImage(JSON.parse(newDocument[header.key]).LinkFile)
                "
                icon="mdi-eye"
                size="small"
              >
              </v-btn>

              <v-file-input
                :clearable="false"
                single-line
                :model-value="tab"
                accept="image/png, image/jpeg, image/bmp"
                :label="header.title"
                prepend-icon=""
                append-inner-icon="mdi-image"
                @update:model-value="
                  (file) => handleFileUploadForm2(file, tab, header.key)
                "
              >
                <template v-slot:selection="{}">
                  {{
                    newDocument[header.key]
                      ? JSON.parse(newDocument[header.key]).FileName
                      : header.title
                  }}
                </template>
              </v-file-input>
            </div>

            <div class="d-flex align-center" v-if="header.type == 6">
              <v-btn
                v-if="newDocument[header.key]"
                class="mr-2 cursor-pointer"
                color="primary"
                @click="
                  btDownloadFile(JSON.parse(newDocument[header.key]).LinkFile)
                "
                icon="mdi-download"
                size="small"
              >
              </v-btn>
              <v-file-input
                :clearable="false"
                :single-line="true"
                :model-value="tab"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                :label="header.title"
                prepend-icon=""
                append-inner-icon="mdi-file"
                @update:model-value="
                  (file) => handleFileUploadForm2(file, tab, header.key)
                "
                ><template v-slot:selection="{}">
                  {{
                    newDocument[header.key]
                      ? JSON.parse(newDocument[header.key]).FileName
                      : header.title
                  }}
                </template>
              </v-file-input>
            </div>
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
            class="pb-0"
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
            <V-DateField
              v-if="header.type == 4"
              v-model:modelValue="editDocument[header.key]"
              :label="header.title"
              width="100%"
            />

            <div class="d-flex align-center" v-if="header.type == 5">
              <v-btn
                v-if="editDocument[header.key]"
                class="mr-2 cursor-pointer"
                color="primary"
                @click="
                  btShowImage(JSON.parse(editDocument[header.key]).LinkFile)
                "
                icon="mdi-eye"
                size="small"
              >
              </v-btn>

              <v-file-input
                :clearable="false"
                single-line
                :model-value="tab"
                accept="image/png, image/jpeg, image/bmp"
                :label="header.title"
                prepend-icon=""
                append-inner-icon="mdi-image"
                @update:model-value="
                  (file) => handleFileUploadForm2(file, tab, header.key)
                "
              >
                <template v-slot:selection="{}">
                  {{
                    editDocument[header.key]
                      ? JSON.parse(editDocument[header.key]).FileName
                      : header.title
                  }}
                </template>
              </v-file-input>
            </div>

            <div class="d-flex align-center" v-if="header.type == 6">
              <v-btn
                v-if="editDocument[header.key]"
                class="mr-2 cursor-pointer"
                color="primary"
                @click="
                  btDownloadFile(JSON.parse(editDocument[header.key]).LinkFile)
                "
                icon="mdi-download"
                size="small"
              >
              </v-btn>
              <v-file-input
                :clearable="false"
                :single-line="true"
                :model-value="tab"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                :label="header.title"
                prepend-icon=""
                append-inner-icon="mdi-file"
                @update:model-value="
                  (file) => handleFileUploadForm2(file, tab, header.key)
                "
                ><template v-slot:selection="{}">
                  {{
                    editDocument[header.key]
                      ? JSON.parse(editDocument[header.key]).FileName
                      : header.title
                  }}
                </template>
              </v-file-input>
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
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props: tooltipProps }">
                          <v-chip
                            color="gray"
                            class="mr-1"
                            v-bind="{ ...props, ...tooltipProps }"
                          >
                            {{ file.MineFile }}
                          </v-chip>
                        </template>

                        <span>{{ file.NameFile }}</span>
                      </v-tooltip>
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
  <v-dialog v-model="isPreview" max-width="600">
    <v-card>
      <v-card-title>Hình ảnh đã upload</v-card-title>
      <v-card-text class="text-center">
        <v-img :src="previewImage" max-height="400" contain />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green" text @click="btDownloadFile(previewImage)"
          >Tải ảnh</v-btn
        >
        <v-btn text @click="isPreview = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowMaterial" width="1000">
    <v-card>
      <v-card-title class="d-flex">
        <span> Phân ra nguyên phụ liệu </span>
        <v-spacer />
      </v-card-title>
      <v-card-text class="py-0">
        <div class="d-flex">
          <v-text-field
            v-model="searchParams.ProductID"
            label="Mã Sản Phẩm"
            class="mr-2"
            prepend-inner-icon="mdi-package-variant"
          ></v-text-field>
          <v-btn
            icon="mdi-magnify"
            size="small"
            @click="fetchInitialMaterials"
            :loading="loading"
          ></v-btn>
          <v-btn
            @click="fetchInitialMaterials"
            :loading="loading"
            prepend-icon="mdi-refresh"
            rounded="sm"
            color="green"
            class="ml-2"
          >
            Lấy DS Gốc
          </v-btn>
        </div>
        <v-data-table
          :headers="materialheaders"
          :items="materials"
          :loading="loading"
          hover
          class="elevation-0"
          no-data-text="Không có dữ liệu nguyên phụ liệu"
          :items-per-page="15"
          height="calc(100vh - 320px)"
          fixed-header=""
          fixed-footer=""
        >
          <template v-slot:item.ProductName="{ item }">
            <div class="text-subtitle-2 font-weight-medium">
              {{ item.ProductName }}
            </div>
            <div class="caption grey--text font-italic">
              <v-chip
                size="small"
                rounded="sm"
                class="font-mono font-weight-bold"
                :color="item.isExpanded ? '' : 'green'"
              >
                {{ item.ProductID.trim() }}
              </v-chip>
              ĐVT: {{ item.UnitOfMeasure.trim() }}
            </div>
          </template>

          <!-- Định mức (Inline Edit) -->
          <template v-slot:item.Quantity="{ item }">
            <div
              v-if="editingField !== item.ProductID.trim() + '_qty'"
              @click="startEdit(item, 'qty')"
              class="editable-cell justify-end font-mono"
            >
              {{ formatNumber(item.Quantity) }}
            </div>
            <v-text-field
              v-else
              v-model.number="item.Quantity"
              dense
              hide-details
              type="number"
              class="inline-edit-input"
              autofocus
              @blur="stopEdit(item)"
              @keyup.enter="stopEdit(item)"
              width="100px"
            ></v-text-field>
          </template>

          <!-- Giá tiền (Inline Edit) -->
          <template v-slot:item.UnitPrice="{ item }">
            <div
              v-if="editingField !== item.ProductID.trim() + '_price'"
              @click="startEdit(item, 'price')"
              class="editable-cell justify-end font-mono"
            >
              {{ formatNumber(item.UnitPrice) }}
            </div>
            <v-text-field
              v-else
              v-model.number="item.UnitPrice"
              dense
              hide-details
              type="number"
              class="inline-edit-input"
              autofocus
              @blur="stopEdit(item)"
              @keyup.enter="stopEdit(item)"
              width="100px"
            ></v-text-field>
          </template>

          <!-- Đơn vị tiền (Dropdown Edit) -->
          <template v-slot:item.UnitMoney="{ item }">
            <div
              v-if="editingField !== item.ProductID.trim() + '_money'"
              @click="startEdit(item, 'money')"
              class="editable-cell justify-center"
            >
              <v-chip x-small :color="getMoneyColor(item.UnitMoney)">{{
                item.UnitMoney || "VND"
              }}</v-chip>
            </div>
            <v-select
              v-else
              v-model="item.UnitMoney"
              :items="['VND', 'USD', 'EUR']"
              dense
              hide-details
              class="inline-edit-input"
              autofocus
              @update:modelValue="updateExchange(item)"
              width="100px"
            ></v-select>
          </template>

          <!-- Tỉ giá (Tự động hoặc Nhập tay) -->
          <template v-slot:item.Exchange="{ item }">
            <div
              @click="startEdit(item, 'ex')"
              class="editable-cell justify-end font-mono"
            >
              {{ formatNumber(item.Exchange) }}
            </div>
          </template>

          <!-- Trị giá (Read Only) -->
          <template v-slot:item.Total="{ item }">
            <div
              class="font-weight-black primary--text font-mono text-right pr-2"
            >
              {{ formatNumber(item.Total) }}
            </div>
          </template>

          <!-- Custom Row: Thao tác -->
          <template v-slot:item.actions="{ item }">
            <v-menu location="start">
              <!-- Nút mở menu -->
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" size="x-small" />
              </template>

              <!-- Danh sách action -->
              <v-list density="compact">
                <v-list-item
                  @click="expandMaterial(item)"
                  :disabled="expandingId === item.ProductID.trim()"
                >
                  <template #prepend>
                    <v-icon color="primary">mdi-plus-circle</v-icon>
                  </template>
                  <v-list-item-title>Phân rã thành phần</v-list-item-title>

                  <template #append>
                    <v-progress-circular
                      v-if="expandingId === item.ProductID.trim()"
                      size="16"
                      indeterminate
                    />
                  </template>
                </v-list-item>

                <v-divider />

                <v-list-item @click="deleteItem(item)">
                  <template #prepend>
                    <v-icon color="red">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title class="text-red">
                    Xóa thành phần
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
        <div class="mt-2 grey--text">
          <v-icon small color="grey" class="mr-1 mb-1"
            >mdi-information-outline</v-icon
          >
          Các dòng màu xám là kết quả của việc phân rã từ một mã nguyên liệu
          khác.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowMaterial = false">Đóng</v-btn>
        <v-btn color="green" @click="btApplyMaterial(materials)"
          >Xác nhận</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Delete Confirmation -->
  <v-dialog v-model="deleteDialog" max-width="350px">
    <v-card>
      <v-card-title class="headline text-center red lighten-5 red--text">
        Xác nhận xóa
      </v-card-title>
      <v-card-text class="text-center pt-4">
        Bạn có chắc chắn muốn xóa nguyên liệu này khỏi bảng kê không?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey " @click="deleteDialog = false">Không</v-btn>
        <v-btn color="red" @click="confirmDelete">Xóa ngay</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowUpdateNote" width="600">
    <v-card>
      <v-card-title>Cập nhật mô tả</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="docInfo.Note"
          label="Nhập mô tả"
          variant="outlined"
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="isShowUpdateNote = false">Đóng</v-btn>
        <v-btn color="green" @click="updateGSPDocument(this.docInfo.Status)"
          >Xác nhận</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  GetDocumentInfoByID,
  UpdateDocumentAssign,
  UpdateGSPDocument,
} from "@/api/briefApi";
import { GetDefaultValue } from "@/api/default";
import {
  GetDocumentFormByDocID,
  UpdateDocumentForm,
} from "@/api/documentFormApi";
import {
  AddAssignLst,
  GetDocumentJobByDocID,
  ProcessDocument,
  StartDocument,
  StartJob,
} from "@/api/documentJobApi";
import { CreateGroup } from "@/api/messageApi";
import { GetProductLst } from "@/api/productApi";
import { GetTeamLstDocID, GetTeamLstProID } from "@/api/teamApi";
import { GetUserLstByTeamID } from "@/api/user";
import logo from "@/assets/images/logos/dtp-logo.png";
import {
  formatDate,
  formatDateDDMMYY,
  formatDateHHDDMM,
} from "@/helpers/getTime";
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
import Axios from "axios";
import { urlUploadFileFormLine } from "./function";

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
      isPreview: false,
      previewImage: "",
      isShowMaterial: false,
      searchParams: {
        ProductID: "",
        Quantity: 1,
        UnitOfMeasure: "ONG",
        ShowBTP: 1,
      },
      materialheaders: [
        // { title: "Mã NL", key: "ProductID", width: "80px" },
        { title: "Nguyên Phụ Liệu", key: "ProductName" },
        { title: "Định mức", key: "Quantity", align: "end" },
        // { title: "Đơn vị", key: "UnitOfMeasure", align: "end" },
        { title: "Giá tiền", key: "UnitPrice", align: "end" },
        { title: "ĐV tiền", key: "UnitMoney", align: "end" },
        { title: "Đơn giá", key: "Exchange", align: "end" },
        { title: "Trị giá", key: "Total", align: "end" },
        { title: "Thao tác", key: "actions", sortable: false, align: "center" },
      ],
      materials: [],
      loading: false,
      error: null,
      expandingId: null,
      // Edit & Delete State
      editDialog: false,
      deleteDialog: false,
      editedItem: {
        ProductID: "",
        ProductName: "",
        Quantity: 0,
      },
      editedIndex: -1,
      itemToDelete: null,
      rates: {
        USD: 1,
        EUR: 27120,
        VND: 25450,
      },
      editingField: null,
      isShowUpdateNote: false,
      isLoadding: false,
    };
  },
  watch: {
    async tab(value) {
      var item = value;
      if (item.TypeForm == 1) {
        const newLines = [];
        for (const ele of item.DNFormLineLst) {
          let options = [];
          if (ele.OptionAnswer && [1, 2, 3, 4].includes(ele.Type)) {
            options = JSON.parse(ele.OptionAnswer);
          }
          const check = item.DocumentFormLineLst.find(
            (p) => p.Required == ele.Required,
          );
          if (check) {
            let text = "";
            if (check.Type == 2 || check.Type == 3) {
              text =
                check.TextResult && check.TextResult !== ""
                  ? check.TextResult?.split(" | ")
                  : [];
            } else if (check.Type == 4) {
              text =
                check.TextResult && check.TextResult !== ""
                  ? new Date(check.TextResult)
                  : null;
            } else {
              text = check.TextResult;
            }

            if (check.Type == 3) {
              if (check.OptionLine == 1) {
                options = await this.getUserLstByTeamID2(check.OptionText);
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
            if (ele.Type == 3) {
              if (ele.OptionLine == 1) {
                options = await this.getUserLstByTeamID2(ele.OptionText);
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
            index === self.findIndex((o) => o.IDFormLine === obj.IDFormLine),
        );

        item.desserts = len.map((l, i) => {
          const itemlst = item.DocumentFormLineLst.filter(
            (p) => p.IDFormLine == l.IDFormLine && p.IsPrivate == 0,
          );

          const itemde = {};
          itemlst.forEach((ele, inle) => {
            if (ele.Type == 6 || ele.Type == 5) {
              itemde["Line" + (inle + 1)] = ele.TextResult
                ? JSON.stringify({
                    FileID: ele.TextResult,
                    LinkFile: ele.OptionText,
                    FileName: ele.DateResult,
                  })
                : "";
            } else {
              itemde["Line" + (inle + 1)] = ele.TextResult;
            }
          });

          return { ...itemde, Key: i + 1, Status: 1 };
        });
      }
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
  mounted() {
    this.fetchExchangeRates();
  },
  computed: {
    likesAllFruit() {
      return (
        this.officeName && this.officeName.length === this.officeLst.length
      );
    },
    likesSomeFruit() {
      return this.officeName && this.officeName.length > 0;
    },
  },
  methods: {
    toggle(data) {
      if (this.likesAllFruit) {
        data.UserID = [];
      } else {
        data.UserID = getUserLstByTeamID(data?.ComID).map(
          (item) => item.UserName,
        );
      }
    },
    btApplyMaterial(data) {
      if (!data || !Array.isArray(data)) {
        console.error("Invalid data passed to btApplyMaterial:", data);
        return;
      }
      this.desserts = data.map((item, index) => {
        return {
          Key: index + 1,
          ["Line" + 1]: item.ProductName,
          ["Line" + 2]: item.ProductID,
          ["Line" + 3]: null,
          ["Line" + 4]: item.UnitOfMeasure,
          ["Line" + 5]: item.Quantity,
          ["Line" + 6]: item.UnitPrice,
          ["Line" + 7]: item.UnitMoney,
          ["Line" + 8]: item.Exchange,
          ["Line" + 9]: null,
          ["Line" + 10]: this.formatNumber(item.Total),
          ["Line" + 11]: null,
          ["Line" + 12]: null,
          ["Line" + 13]: null,
          ["Line" + 14]: null,
          ["Line" + 15]: null,
          Status: 1,
        };
      });
      this.isShowMaterial = false;
    },
    async fetchExchangeRates() {
      try {
        // Lấy tỷ giá từ API công khai
        const response = await Axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD",
        );
        if (response.data && response.data.rates.VND) {
          const usdToVnd = response.data.rates.VND;
          const usdToEur = response.data.rates.EUR;
          this.rates.VND = usdToVnd;
          this.rates.EUR = usdToEur;
          this.rates.USD = 1;
        }
      } catch (e) {
        console.warn("Không thể lấy tỷ giá tự động, dùng mặc định");
      }
    },
    async callApi(id, qty, unit) {
      const url =
        "https://icpc1hn.work/APIHDDT/KHReport/GetRawMaterialByProduct";
      const payload = {
        UserName: "api-kh",
        Token: "8e565ea5-95b1-482f-a78b-bec0c34b7156",
        ProductLst: [
          {
            ProductID: id.trim(),
            ProductID2: "",
            Quantity: Number(qty),
            UnitOfMeasure: unit.trim(),
          },
        ],
        ShowBTP: this.searchParams.ShowBTP,
      };
      try {
        const response = await Axios.post(url, payload);
        return response.data;
      } catch (err) {
        // Xử lý lỗi Axios chuyên sâu
        let msg = "Lỗi kết nối server.";
        if (err.response) {
          msg = `Server phản hồi lỗi: ${err.response.status}`;
        } else if (err.request) {
          msg = "Không nhận được phản hồi từ server.";
        }
        throw new Error(msg);
      }
    },

    async fetchInitialMaterials() {
      this.loading = true;
      this.error = null;
      try {
        const data = await this.callApi(
          this.searchParams.ProductID,
          this.searchParams.Quantity,
          this.searchParams.UnitOfMeasure,
        );
        this.materials = (data.ProductLst || []).map((m) =>
          this.processItem(m),
        );
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    processItem(item, isChild = false) {
      const unitMoney = item.UnitMoney || "USD";
      return {
        ...item,
        ProductID: item.ProductID.trim(),
        UnitPrice: item.UnitPrice || 0,
        UnitMoney: unitMoney,
        ExchangeRate: this.rates[unitMoney] || 1,
        isExpanded: isChild,
      };
    },
    getMoneyColor(unit) {
      if (unit === "USD") return "blue";
      if (unit === "EUR") return "green";
      return "grey";
    },

    startEdit(item, field) {
      // Đảm bảo ProductID là duy nhất để tránh nhảy ô input
      this.editingField = item.ProductID.trim() + "_" + field;
    },

    stopEdit(item) {
      if (!item || typeof item !== "object") {
        console.error("Invalid item passed to stopEdit:", item);
        return;
      }
      item.Exchange = (item.UnitPrice ?? 0) / (item.ExchangeRate ?? 0);
      item.Total = (Number(item.Quantity) || 0) * (Number(item.Exchange) || 0);
      this.editingField = null;
    },
    updateExchange(item) {
      if (!item) {
        console.error("Invalid item passed to updateExchange:", item);
        return;
      }

      const newRate = this.rates[item.UnitMoney] || 1;
      item.ExchangeRate = newRate;
      this.stopEdit(item); // Pass the item here
    },

    async expandMaterial(parentItem) {
      const pId = parentItem.ProductID.trim();
      const parentQuantity = parentItem.Quantity;
      this.expandingId = pId;

      try {
        const reqQty =
          parentItem.TotalQuantity ||
          parentItem.Quantity * this.searchParams.Quantity;
        const data = await this.callApi(pId, reqQty, parentItem.UnitOfMeasure);
        const newItems = data.ProductLst || [];
        if (newItems.length === 0) {
          this.error = `Mã ${pId} không có cấu trúc con để phân rã.`;
          return;
        }
        const map = new Map();
        this.materials.forEach((m) => {
          if (m.ProductID.trim() !== pId) map.set(m.ProductID.trim(), m);
        });

        newItems.forEach((newItem) => {
          const id = newItem.ProductID.trim();
          const processed = this.processItem(newItem, true);
          processed.Quantity = newItem.Quantity * parentQuantity;

          if (map.has(id)) {
            const existing = map.get(id);
            existing.Quantity += processed.Quantity;
          } else {
            map.set(id, processed);
          }
        });

        this.materials = Array.from(map.values());
      } catch (err) {
        console.error(err);
      } finally {
        this.expandingId = null;
      }
    },

    deleteItem(item) {
      this.itemToDelete = item;
      this.deleteDialog = true;
    },

    confirmDelete() {
      const index = this.materials.indexOf(this.itemToDelete);
      if (index > -1) {
        this.materials.splice(index, 1);
      }
      this.deleteDialog = false;
      this.itemToDelete = null;
    },
    formatNumber(num) {
      if (num === null || num === undefined || isNaN(num)) return "0";
      return new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }).format(num);
    },
    btDownloadFile(url) {
      console.log("url", url);

      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    btShowImage(link) {
      this.previewImage = link;
      this.isPreview = true;
    },
    handleFileUploadForm2(file, line, headerKey) {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      Axios.post(
        urlUploadFileFormLine(line.IDForm, this.docInfo.DocumentID),
        formData,
      ).then((res) => {
        if (res.data.RespCode === 0) {
          var fileinfo = {
            FileID: res.data.FileID,
            LinkFile: res.data.LinkFile,
            FileName: res.data.FileName,
          };
          this.newDocument[headerKey] = JSON.stringify(fileinfo);
          this.editDocument[headerKey] = JSON.stringify(fileinfo);

          console.log(this.newDocument);

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
    },
    handleFileUploadForm(file, line) {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      Axios.post(
        urlUploadFileFormLine(line.IDForm, this.docInfo.DocumentID),
        formData,
      ).then((res) => {
        if (res.data.RespCode === 0) {
          line.TextResult = res.data.FileID;
          line.OptionText = res.data.LinkFile;
          line.DateResult = res.data.FileName;

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
    },
    btExportExcel1(tab, header) {
      exportExcel1(
        this.desserts.filter((p) => p.Status > 0),
        this.headers,
      );
    },
    getUserLstByTeamID(teamID) {
      if (teamID) {
        var data = this.groupLst.find((p) => p.TeamID == teamID);
        if (data && Array.isArray(data.UserLst)) {
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
      // Nếu chứa ký tự chữ → Text
      if (/[^0-9.,+\s]/.test(str)) {
        return { isValid: true, type: "Text", value: str };
      }

      // Nếu là số điện thoại
      const isPhone = /^[+]?[0-9]{9,15}$/.test(str);
      if (isPhone) {
        return { isValid: true, type: "Text", value: str };
      }

      // Nếu có dấu . hoặc , → giữ nguyên
      if (/[.,]/.test(str)) {
        return { isValid: true, type: "Text", value: str };
      }

      // Nếu bắt đầu bằng 0 → giữ nguyên
      if (/^0\d+/.test(str)) {
        return { isValid: true, type: "Text", value: str };
      }

      const num = parseFloat(str);

      if (isNaN(num)) {
        return { isValid: false, type: null, value: str };
      }

      if (Number.isInteger(num)) {
        return {
          isValid: true,
          type: "Int",
          value: new Intl.NumberFormat("en-US").format(num),
        };
      }

      return {
        isValid: true,
        type: "Float",
        value: new Intl.NumberFormat("en-US").format(num),
      };
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
            GroupName:
              (this.docInfo.Note != ""
                ? this.docInfo.Note
                : this.docInfo.DocName) +
              " - " +
              this.docInfo.DocumentID,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.$router.push({
              path: "/tin-nhan",
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
          this.isShowUpdateNote = false;
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
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
            var a = item.UserAssignLst.filter((p) => p.UserRole == "Xử lý");
            if (a.length > 0) {
              userJob = {
                ...a[0],
                UserID: a.filter((i) => i.UserID).map((i) => i.UserID),
              };
            }

            var a = item.AssignLst.filter((p) => p.UserRole == "Xử lý");
            if (a.length > 0) {
              userJob = {
                ...a[0],
                UserID: a.filter((i) => i.UserID).map((i) => i.UserID),
              };
            }

            var userMana = null;
            var b = item.UserAssignLst.find((p) => p.UserRole == "Phê duyệt");
            if (b && b.ComID != 0) {
              userMana = b;
            }
            var b = item.AssignLst.find((p) => p.UserRole == "Phê duyệt");
            if (b && b.ComID != 0) {
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
      GetDocumentInfoByID({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.docInfo = res.Data;
          this.processDocument();
          this.getdefault();
          this.getDocumentFormByDocID();
        }
      });
    },
    btAddUserInWork(data) {
      if (this.isLoadding) return;
      this.isLoadding = true;
      const asi = [];
      const hasJob = data.UserJob && data.UserJob.UserID; // có chọn người xử lý?
      const hasMana = data.UserMana && data.UserMana.UserID; // có chọn người phê duyệt?

      // 1️⃣ Không chọn ai cả → báo lỗi
      if (!hasJob && !hasMana) {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng chọn người xử lý hoặc người phê duyệt",
          type: "warn",
        });
        return;
      }

      // 2️⃣ Validate người xử lý (nếu có)
      if (hasJob) {
        if (
          !data.UserJob.ComID ||
          data.UserJob.ComID == 0 ||
          !data.UserJob.QuotaTime
        ) {
          notify({
            title: "Nhắc nhở",
            text: "Người xử lý: Vui lòng chọn nhóm và hạn xử lý",
            type: "warn",
          });
          return;
        }
        for (var item of data.UserJob.UserID) {
          asi.push({
            ...data.UserJob,
            UserRole: "Xử lý",
            UserID: item,
          });
        }
      }

      // 3️⃣ Validate người phê duyệt (nếu có)
      if (hasMana) {
        if (
          !data.UserMana.ComID ||
          data.UserMana.ComID == 0 ||
          !data.UserMana.QuotaTime
        ) {
          notify({
            title: "Nhắc nhở",
            text: "Người phê duyệt: Vui lòng chọn nhóm và hạn xử lý",
            type: "warn",
          });
          return;
        }

        asi.push({
          ...data.UserMana,
          UserRole: "Phê duyệt",
        });
      }

      // 4️⃣ Submit
      AddAssignLst({
        DocumentID: data.DocumentID,
        StepID: data.StepID,
        WorkID: data.WorkID,
        AssignLst: asi,
      })
        .then((res) => {
          if (res.RespCode == 0) {
            notify({
              title: "Thành công",
              text: "Gán nhân sự thành công",
              type: "success",
            });
            this.getDocumentJobByDocID(
              this.stepInfo.StepID,
              this.stepInfo.RowID,
            );
          }
        })
        .finally(() => {
          this.isLoadding = false;
        });
    },
    btAddUserInWork2(data) {
      if (this.isLoadding) return;
      this.isLoadding = true;
      const asi = [];
      const hasJob = data.UserJob && data.UserJob.UserID;

      const hasMana = data.UserMana && data.UserMana.UserID;

      // 1️⃣ Không chọn ai cả → báo lỗi
      if (!hasJob && !hasMana) {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng chọn người xử lý hoặc người phê duyệt",
          type: "warn",
        });
        return;
      }

      // 2️⃣ Validate người xử lý (nếu có)
      if (hasJob) {
        if (
          !data.UserJob.ComID ||
          data.UserJob.ComID == 0 ||
          !data.UserJob.QuotaTime
        ) {
          notify({
            title: "Nhắc nhở",
            text: "Người xử lý: Vui lòng chọn nhóm và hạn xử lý",
            type: "warn",
          });
          return;
        }
        for (var item of data.UserJob.UserID) {
          asi.push({
            ...data.UserJob,
            UserRole: "Xử lý",
            UserID: item,
          });
        }
      }

      // 3️⃣ Validate người phê duyệt (nếu có)
      if (hasMana) {
        if (
          !data.UserMana.ComID ||
          data.UserMana.ComID == 0 ||
          !data.UserMana.QuotaTime
        ) {
          notify({
            title: "Nhắc nhở",
            text: "Người phê duyệt: Vui lòng chọn nhóm và hạn xử lý",
            type: "warn",
          });
          return;
        }

        asi.push({
          ...data.UserMana,
          UserRole: "Phê duyệt",
        });
      }
      // console.log("asi", asi);
      // return;
      // 4️⃣ Submit
      StartJob({
        DocumentID: data.DocumentID,
        StepID: data.StepID,
        WorkID: data.WorkID,
        AssignLst: asi,
      })
        .then((res) => {
          if (res.RespCode == 0) {
            notify({
              title: "Thành công",
              text: "Gán nhân sự thành công",
              type: "success",
            });
            this.getDocumentJobByDocID(
              this.stepInfo.StepID,
              this.stepInfo.RowID,
            );
          }
        })
        .finally(() => {
          this.isLoadding = false;
        });
    },
    async getDocumentFormByDocID() {
      const res = await GetDocumentFormByDocID({
        DocumentID: this.$route.params.id,
      });

      if (res.RespCode == 0) {
        this.formTabLst = res.DocumentFormLst.map((item) => {
          return {
            ...item,
          };
        });

        if (this.formTabLst.length > 0) {
          this.tab = this.formTabLst[0];
        }
        this.isLoadingFile = false;
      }
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
    addNewDocument() {
      var headDate = this.headers.filter((p) => p.type == 4);
      for (var item of headDate) {
        var newLine = this.newDocument[item.key];
        this.newDocument[item.key] = formatDateDDMMYY(newLine);
      }
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
      if (this.isLoadingFile) return;
      this.isLoadingFile = true;
      var docForm = {
        ...data,
        DocumentID: this.$route.params.id,
        IDForm: data.IDForm,
        ProcedureID: this.docInfo.TypeDoc,
        NameForm: data.NameForm,
        Description: data.Description,
        TypeForm: data.TypeForm,
      };
      var docFormLine = [];
      if (data.TypeForm == 2) {
        var data = this.desserts.filter((p) => p.Status != 0);
        data.forEach((item, ind) => {
          console.log("header", this.headers);

          var len = this.headers.filter((p) => p.title != "STT").length;
          for (let index = 1; index <= len; index++) {
            if (
              this.headers[index].type == 5 ||
              this.headers[index].type == 6
            ) {
              var line = {
                DocumentID: this.$route.params.id,
                IDForm: data.IDForm,
                StepID: data.StepID,
                WorkID: data.WorkID,
                Parameter: item.title,
                Type: this.headers[index].type,
                OptionAnswer: JSON.stringify(item.options),
                Required: index,
                TextResult: item["Line" + index]
                  ? JSON.parse(item["Line" + index]).FileID
                  : "",
                IDFormLine: ind,
                Status: item.Status,
                OptionLine: item.OptionLine,
                OptionText: item["Line" + index]
                  ? JSON.parse(item["Line" + index]).LinkFile
                  : "",
                DateResult: item["Line" + index]
                  ? JSON.parse(item["Line" + index]).FileName
                  : "",
                IsValue: item.IsValue,
              };
              docFormLine.push(line);
            } else {
              var line = {
                DocumentID: this.$route.params.id,
                IDForm: data.IDForm,
                StepID: data.StepID,
                WorkID: data.WorkID,
                Parameter: item.title,
                Type: this.headers[index].type,
                OptionAnswer: JSON.stringify(item.options),
                Required: index,
                TextResult: item["Line" + index],
                IDFormLine: ind,
                Status: item.Status,
                OptionLine: item.OptionLine,
                OptionText: item.OptionText,
                IsValue: item.IsValue,
              };
              docFormLine.push(line);
            }
          }
        });
        docForm.DocumentFormLineLst = docFormLine;
      }

      if (data.TypeForm == 1) {
        docForm.DocumentFormLineLst = data.DocumentFormLineLst.map((item) => {
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
      }
      // ------------------------------------------------------------------
      // 🔥 CHECK BẮT BUỘC: Nếu IsValue == 1 thì TextResult phải có giá trị
      // ------------------------------------------------------------------
      let invalid = docForm.DocumentFormLineLst.some((line) => {
        const value = line.TextResult;

        // ép về string để trim an toàn
        const safeValue =
          value === null || value === undefined ? "" : String(value).trim();

        return line.IsValue == 1 && safeValue === "";
      });

      if (invalid) {
        this.isLoadingFile = false;
        notify({
          title: "Thiếu dữ liệu",
          text: "Các trường bắt buộc chưa nhập đầy đủ",
          type: "error",
        });
        return; // ⛔ Không gọi API
      }

      // ------------------------------------------------------------------
      // Gọi API cập nhật
      // ------------------------------------------------------------------
      UpdateDocumentForm({
        DocumentFormInfo: docForm,
      })
        .then((res) => {
          if (res.RespCode == 0) {
            notify({
              title: "Thành công",
              text: "Lưu thông tin thành công",
              type: "success",
            });
            this.getDocumentFormByDocID();
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
        (p) => p.Key === this.editDocument.Key,
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
    formatDateDDMMYY,
  },
  created() {
    this.getDocumentInfoByID();
  },
};
</script>

<style>
.blur-text input {
  filter: blur(5px);
}
.blur-text .v-chip {
  filter: blur(5px); /* làm mờ luôn chip */
}
.row-expanded {
  background-color: #f1f8ff !important;
}
</style>

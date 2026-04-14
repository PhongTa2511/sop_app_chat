<template>
  <div>
    <VRow class="pr-3">
      <VCol :lg="8" cols="12" class="">
        <VCard class="layout-card">
          <VCardTitle class="text-h6 py-2 pl-4 pr-0">
            <div class="d-flex justify-sm-space-between">
              <div>Công việc định kỳ</div>

              <VBtn
                color="blue"
                icon="mdi-list-box"
                size="small"
                class="mr-2"
                @click="$router.push('/viec-dinh-ky')"
              />
            </div>
            <div class="text-subtitle-1">
              <VChip color="blue" class="rounded"> Thông tin </VChip>
              {{ dataJobInfo.Title }}
            </div>
            <div
              v-if="dataJobInfo.RecurrenceType == 0"
              class="mt-2 text-subtitle-1"
            >
              <VChip color="red" class="rounded"> Không lặp lại </VChip>
            </div>
            <div
              v-if="dataJobInfo.RecurrenceType == 1"
              class="mt-2 text-subtitle-1"
            >
              <VChip color="green" class="rounded"> Lặp theo ngày </VChip> Chu
              kỳ {{ dataJobInfo.IntervalN }} ngày
            </div>
            <div
              v-if="dataJobInfo.RecurrenceType == 2"
              class="mt-2 text-subtitle-1"
            >
              <VChip color="green" class="rounded"> Lặp theo tuần </VChip> Chu
              kỳ {{ dataJobInfo.IntervalN }} tuần - Thứ:
              {{ dataJobInfo.WeekdaysCsv }}
            </div>
            <div
              v-if="dataJobInfo.RecurrenceType == 3"
              class="mt-2 text-subtitle-1"
            >
              <VChip color="green" class="rounded"> Lặp theo tháng </VChip> Chu
              kỳ {{ dataJobInfo.IntervalN }} tháng - Ngày:
              {{ dataJobInfo.DayOfMonth }}
            </div>
          </VCardTitle>
          <VDivider />
          <div
            v-if="dataJobInfo.Status == 1 && dataJobInfo.AssignID == userName"
            class="px-4 pb-4 mt-4"
          >
            <VRow>
              <VCol lg="8" md="8" cols="12">
                <div class="text-h6">Nội dung báo cáo</div>
                <div class="pb-1 text-subtitle-2">
                  <VIcon color="blue" size="small"> mdi-account-edit </VIcon>
                  {{ dataJobInfo.AssignName }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <VIcon color="green" size="small">
                    mdi-clock-time-four-outline
                  </VIcon>
                  Bắt đầu: {{ formatDateDDMMYY(dataJobInfo.StartDate) }}
                </div>
                <div class="pb-1 text-subtitle-2">
                  <VIcon color="orange" size="small"> mdi-timer-sand </VIcon>
                  Hạn:
                  {{ formatDateDDMMYY(dataJobInfo.TimeQuotaAssign) }}
                </div>
                <div class="quill" @click="handleContentImageClick">
                  <QuillEditor
                    v-model:content="dataJobInfo.Report"
                    content-type="html"
                    theme="snow"
                    toolbar="minimal"
                    style="border: none"
                  />
                </div>
              </VCol>
              <VCol lg="4" md="4" cols="12">
                <div class="d-flex justify-sm-space-between">
                  <div>Tệp đính kèm</div>
                  <VBtn
                    color="blue"
                    icon="mdi-link-plus"
                    size="small"
                    @click="$refs.fileInput.click()"
                  />

                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.rar"
                    style="display: none"
                    @change="handleFileUpload"
                  />
                </div>
                <VDivider class="my-2" />
                <VChipGroup
                  v-if="
                    dataJobInfo &&
                    dataJobInfo.DataAssign &&
                    dataJobInfo.DataAssign.length > 0
                  "
                  color="green"
                  column
                >
                  <VMenu
                    v-for="(item, index) in dataJobInfo.DataAssign"
                    :key="index"
                    location="end"
                  >
                    <template #activator="{ props }">
                      <VChip color="orange" v-bind="props">
                        {{ item.NameFile }}
                      </VChip>
                    </template>

                    <VList>
                      <VListItem v-if="isPreviewSupported(item.MineFile)">
                        <VListItemTitle>
                          <v-btn
                            @click="previewFile(item)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </v-btn>
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
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
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
                          <v-btn
                            @click="deleteFile(item)"
                            size="small"
                            rounded="8"
                            color="red"
                            block
                          >
                            <v-icon class="mr-1"
                              >mdi-file-document-remove</v-icon
                            >
                            Xóa file
                          </v-btn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </VChipGroup>
                <div v-else class="text-center py-4">
                  <VIcon color="red" class="my-2" size="large">
                    mdi-note-search
                  </VIcon>
                  <p>Chưa có file nào</p>
                </div>
              </VCol>
            </VRow>

            <div class="pt-2">
              <VBtn
                color="blue"
                class="mr-2"
                rounded="8"
                @click="openStepDialog(3)"
              >
                Báo cáo
              </VBtn>
            </div>
          </div>
          <div v-else>
            <div v-if="dataJobInfo.Report" class="px-4 mt-4">
              <VRow>
                <VCol lg="8" md="8" cols="12">
                  <div class="text-h6">
                    Nội dung báo cáo
                    <VChip
                      v-if="dataJobInfo.Status == 3 || dataJobInfo.Status == 4"
                      color="green"
                    >
                      Đã báo cáo
                    </VChip>
                  </div>
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="blue" size="small"> mdi-account-edit </VIcon>
                    {{ dataJobInfo.AssignName }}
                  </div>
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="green" size="small">
                      mdi-clock-time-four-outline
                    </VIcon>
                    Báo cáo lúc: {{ formatDateDisplay(dataJobInfo.TimeModify) }}
                  </div>
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="orange" size="small"> mdi-timer-sand </VIcon>
                    Hạn xử lý:
                    {{ formatDateDisplay(dataJobInfo.TimeQuotaAssign) }}
                  </div>
                  <div
                    class="border-md px-2 py-1 rounded report-content"
                    style="overflow: auto"
                    v-html="dataJobInfo.Report"
                    @click="handleContentImageClick"
                  />
                </VCol>
                <VCol lg="4" md="4" cols="12">
                  <div class="d-flex justify-sm-space-between">
                    <div>Tệp đính kèm</div>
                  </div>
                  <VDivider class="my-2" />
                  <VChipGroup
                    v-if="
                      dataJobInfo &&
                      dataJobInfo.DataAssign &&
                      dataJobInfo.DataAssign.length > 0
                    "
                    color="green"
                    column
                  >
                    <VMenu
                      v-for="(item, index) in dataJobInfo.DataAssign"
                      :key="index"
                      location="end"
                    >
                      <template #activator="{ props }">
                        <VChip color="orange" v-bind="props">
                          {{ item.NameFile }}
                        </VChip>
                      </template>

                      <VList>
                        <VListItem v-if="isPreviewSupported(item.MineFile)">
                          <VListItemTitle>
                            <v-btn
                              @click="previewFile(item)"
                              size="small"
                              rounded="8"
                              class="mb-1"
                            >
                              <v-icon class="mr-1">mdi-file-eye</v-icon> Xem
                              trước
                            </v-btn>
                          </VListItemTitle>
                        </VListItem>

                        <VListItem>
                          <VListItemTitle>
                            <v-btn
                              @click="downloadFile(item)"
                              size="small"
                              rounded="8"
                              color="green"
                              block
                              class="mb-1"
                            >
                              <v-icon class="mr-1">mdi-file-download</v-icon>
                              Tải ngay
                            </v-btn>
                          </VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VChipGroup>
                  <div v-else class="text-center py-4">
                    <VIcon color="red" class="my-2" size="large">
                      mdi-note-search
                    </VIcon>
                    <p>Chưa có file nào</p>
                  </div>
                </VCol>
              </VRow>
            </div>
          </div>
          <div
            v-if="dataJobInfo.Status == 3 && dataJobInfo.ApproveID === userName"
            class="px-4 pb-4"
          >
            <VRow>
              <VCol lg="8" md="8" cols="12">
                <div class="text-h6">Nội dung phê duyệt</div>
                <div v-if="dataJobInfo.ApproveID">
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="red" size="small"> mdi-account-check </VIcon>
                    {{ dataJobInfo.ApproveName }}
                  </div>
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="green" size="small">
                      mdi-clock-time-four-outline
                    </VIcon>
                    Đã báo cáo lúc
                    {{ formatDateDisplay(dataJobInfo.TimeModify) }}
                  </div>
                </div>

                <div class="quill" @click="handleContentImageClick">
                  <QuillEditor
                    v-model:content="dataJobInfo.NoteApprove"
                    content-type="html"
                    theme="snow"
                    toolbar="minimal"
                    style="border: none"
                  />
                </div>
              </VCol>
              <VCol lg="4" md="4" cols="12">
                <div class="d-flex justify-sm-space-between">
                  <div>Tệp đính kèm</div>
                  <VBtn
                    color="blue"
                    style="height: 42px"
                    icon="mdi-link-plus"
                    @click="$refs.fileInput2.click()"
                  />

                  <input
                    ref="fileInput2"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.rar"
                    style="display: none"
                    @change="handleFileUpload2"
                  />
                </div>
                <VDivider class="my-2" />
                <VChipGroup
                  v-if="
                    dataJobInfo &&
                    dataJobInfo.DataApprove &&
                    dataJobInfo.DataApprove.length > 0
                  "
                  color="green"
                  column
                >
                  <VMenu
                    v-for="(item, index) in dataJobInfo.DataApprove"
                    :key="index"
                    location="end"
                  >
                    <template #activator="{ props }">
                      <VChip color="orange" v-bind="props">
                        {{ item.NameFile }}
                      </VChip>
                    </template>

                    <VList>
                      <VListItem v-if="isPreviewSupported(item.MineFile)">
                        <VListItemTitle>
                          <v-btn
                            @click="previewFile(item)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </v-btn>
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
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
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
                          <v-btn
                            @click="deleteFile(item)"
                            size="small"
                            rounded="8"
                            color="red"
                            block
                          >
                            <v-icon class="mr-1"
                              >mdi-file-document-remove</v-icon
                            >
                            Xóa file
                          </v-btn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </VChipGroup>
                <div v-else class="text-center py-4">
                  <VIcon color="red" class="my-2" size="large">
                    mdi-note-search
                  </VIcon>
                  <p>Chưa có file nào</p>
                </div>
              </VCol>
            </VRow>

            <div class="pt-2">
              <VBtn
                color="green"
                class="mr-2"
                rounded="8"
                @click="openStepDialog(4)"
              >
                Phê duyệt
              </VBtn>
              <VBtn color="red" rounded="8" @click="openStepDialog(5)">
                Từ chối
              </VBtn>
            </div>
          </div>
          <div v-else>
            <!-- <div v-if="dataJobInfo.Report" class="px-4">
              <VRow>
                <VCol lg="8" md="8" cols="12">
                  <div class="text-h6">
                    Nội dung báo cáo
                    <VChip v-if="dataJobInfo.Status == 3" color="green">
                      Đã báo cáo
                    </VChip>
                  </div>
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="red" size="small"> mdi-account-edit </VIcon>
                    {{ dataJobInfo.AssignName }}
                  </div>
                  <div class="pb-1 text-subtitle-2">
                    <VIcon color="green" size="small">
                      mdi-clock-time-four-outline
                    </VIcon>
                    {{ formatDateDisplay(dataJobInfo.TimeModify) }}
                  </div>
                  <div
                    class="border-md px-2 py-1 rounded"
                    v-html="dataJobInfo.Report"
                  />
                </VCol>
                <VCol lg="4" md="4" cols="12">
                  <div class="d-flex justify-sm-space-between">
                    <div>Tệp đính kèm</div>
                  </div>
                  <VDivider class="my-2" />
                  <VChipGroup
                    v-if="
                      dataJobInfo &&
                      dataJobInfo.DataAssign &&
                      dataJobInfo.DataAssign.length > 0
                    "
                    color="green"
                    column
                  >
                    <VMenu
                      v-for="(item, index) in dataJobInfo.DataAssign"
                      :key="index"
                      location="end"
                    >
                      <template #activator="{ props }">
                        <VChip color="orange" v-bind="props">
                          {{ item.NameFile }}
                        </VChip>
                      </template>

                      <VList>
                        <VListItem v-if="isPreviewSupported(item.MineFile)">
                          <VListItemTitle>
                            <v-btn
                              @click="previewFile(item)"
                              size="small"
                              rounded="8"
                              class="mb-1"
                            >
                              <v-icon class="mr-1">mdi-file-eye</v-icon> Xem
                              trước
                            </v-btn>
                          </VListItemTitle>
                        </VListItem>

                        <VListItem>
                          <VListItemTitle>
                            <v-btn
                              @click="downloadFile(item)"
                              size="small"
                              rounded="8"
                              color="green"
                              block
                              class="mb-1"
                            >
                              <v-icon class="mr-1">mdi-file-download</v-icon>
                              Tải ngay
                            </v-btn>
                          </VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VChipGroup>
                  <div v-else class="text-center py-4">
                    <VIcon color="red" class="my-2" size="large">
                      mdi-note-search
                    </VIcon>
                    <p>Chưa có file nào</p>
                  </div>
                </VCol>
              </VRow>
            </div> -->
            <div v-if="dataJobInfo.ApproveName" class="px-4">
              <VIcon color="red" size="small"> mdi-account-check </VIcon>
              {{ dataJobInfo.ApproveName }}
              <span v-if="dataJobInfo.TimeApprove" class="ml-2 text-caption">
                ({{ formatDateDisplay(dataJobInfo.TimeApprove) }})
              </span>
            </div>
            <div v-if="dataJobInfo.NoteApprove" class="px-4">
              <VRow>
                <VCol lg="8" md="8" cols="12">
                  <div class="text-h6">
                    Nội dung phê duyệt
                    <VChip v-if="dataJobInfo.Status == 4" color="green">
                      Đã duyệt
                    </VChip>
                    <VChip v-if="dataJobInfo.Status == 5" color="red">
                      Đã từ chối
                    </VChip>
                  </div>
                  <div
                    class="border-md px-2 py-1 rounded report-content"
                    style="overflow: auto"
                    v-html="dataJobInfo.NoteApprove"
                  />
                </VCol>
                <VCol lg="4" md="4" cols="12">
                  <div class="d-flex justify-sm-space-between">
                    <div>Tệp đính kèm</div>
                  </div>
                  <VDivider class="my-2" />
                  <VChipGroup
                    v-if="
                      dataJobInfo &&
                      dataJobInfo.DataApprove &&
                      dataJobInfo.DataApprove.length > 0
                    "
                    color="green"
                    column
                  >
                    <VMenu
                      v-for="(item, index) in dataJobInfo.DataApprove"
                      :key="index"
                      location="end"
                    >
                      <template #activator="{ props }">
                        <VChip color="orange" v-bind="props">
                          {{ item.NameFile }}
                        </VChip>
                      </template>

                      <VList>
                        <VListItem v-if="isPreviewSupported(item.MineFile)">
                          <VListItemTitle>
                            <v-btn
                              @click="previewFile(item)"
                              size="small"
                              rounded="8"
                              class="mb-1"
                            >
                              <v-icon class="mr-1">mdi-file-eye</v-icon> Xem
                              trước
                            </v-btn>
                          </VListItemTitle>
                        </VListItem>

                        <VListItem>
                          <VListItemTitle>
                            <v-btn
                              @click="downloadFile(item)"
                              size="small"
                              rounded="8"
                              color="green"
                              block
                              class="mb-1"
                            >
                              <v-icon class="mr-1">mdi-file-download</v-icon>
                              Tải ngay
                            </v-btn>
                          </VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VChipGroup>
                  <div v-else class="text-center py-4">
                    <VIcon color="red" class="my-2" size="large">
                      mdi-note-search
                    </VIcon>
                    <p>Chưa có file nào</p>
                  </div>
                </VCol>
              </VRow>
            </div>
          </div>
        </VCard>
      </VCol>
      <VCol :lg="4" cols="12" class="px-0">
        <VCard class="py-2 px-4 layout-card">
          <div class="d-flex justify-space-between">
            <div class="text-h6">Quá trình thực hiện</div>
          </div>
          <VDivider class="my-2" />

          <VSheet
            v-for="(job, indjob) in processLst"
            :key="indjob"
            class="px-1 py-1 mt-1"
            rounded
            :border="
              job.Status == 1
                ? 'blue md'
                : job.Status == 3
                  ? 'orange md'
                  : job.Status == 4
                    ? 'green md'
                    : job.Status == 5
                      ? 'red md'
                      : 'gray md'
            "
          >
            <div class="text-md position-relative">
              <div class="d-flex">
                <VChip
                  class="mr-2"
                  :color="
                    job.Status == 1
                      ? 'blue'
                      : job.Status == 3
                        ? 'orange md'
                        : job.Status == 4
                          ? 'green'
                          : job.Status == 5
                            ? 'red'
                            : 'gray'
                  "
                >
                  {{ job.TimeRepeat }}
                </VChip>
                {{ job.Title }}
              </div>
              <VIcon
                v-if="job.Status == 4"
                class="position-absolute right-0 top-0"
                color="green"
                size="small"
              >
                mdi-check-circle-outline
              </VIcon>
              <VIcon
                v-if="job.Status == 5"
                class="position-absolute right-0 top-0"
                color="red"
                size="small"
              >
                mdi-close-circle-outline
              </VIcon>
            </div>

            <div class="text-caption">
              <div>
                <VIcon color="blue" size="small"> mdi-account-edit </VIcon>
                {{ job.AssignName }}
                <VIcon v-if="job.TimeModify" color="blue" size="small">
                  mdi-clock
                </VIcon>
                {{ formatDateDisplay(job.TimeModify) }}
              </div>
              <div class="report-content" style="overflow: auto" v-html="job.Report" @click="handleContentImageClick" />
            </div>
            <div v-if="job.DataAssign.length > 0" class="file-scroll">
              <div class="d-inline-flex">
                <VMenu
                  v-for="(file, indfile) in job.DataAssign"
                  :key="indfile"
                  location="end"
                >
                  <template #activator="{ props }">
                    <VTooltip location="top">
                      <template #activator="{ props: tooltipProps }">
                        <VChip
                          color="gray"
                          class="mr-1 flex-shrink-0"
                          v-bind="{ ...props, ...tooltipProps }"
                        >
                          {{ file.MineFile }}
                        </VChip>
                      </template>

                      <span>{{ file.NameFile }}</span>
                    </VTooltip>
                  </template>
                </VMenu>
              </div>
            </div>
            <div v-if="job.ApproveName" class="text-caption mt-1">
              <div>
                <VIcon
                  :color="
                    job.Status == 4
                      ? 'green'
                      : job.Status == 5
                        ? 'red'
                        : 'orange'
                  "
                  size="small"
                >
                  mdi-account-check
                </VIcon>
                {{ job.ApproveName }}
                <VIcon
                  v-if="job.TimeApprove"
                  :color="job.Status == 4 ? 'green' : 'red'"
                  size="small"
                  class="ml-1"
                >
                  mdi-clock
                </VIcon>
                {{ job.TimeApprove ? formatDateDisplay(job.TimeApprove) : '' }}
              </div>
              <div
                v-if="job.NoteApprove"
                class="report-content"
                style="overflow: auto"
                v-html="job.NoteApprove"
                @click="handleContentImageClick"
              />
            </div>
            <div v-if="job.DataApprove.length > 0" class="file-scroll">
              <VMenu
                v-for="(file, indfile) in job.DataApprove"
                :key="indfile"
                location="end"
              >
                <template #activator="{ props }">
                  <VTooltip location="top">
                    <template #activator="{ props: tooltipProps }">
                      <VChip
                        color="gray"
                        class="mr-1"
                        v-bind="{ ...props, ...tooltipProps }"
                      >
                        {{ file.MineFile }}
                      </VChip>
                    </template>

                    <span>{{ file.NameFile }}</span>
                  </VTooltip>
                </template>

                <VList>
                  <VListItem v-if="isPreviewSupported(file.MineFile)">
                    <VListItemTitle>
                      <VBtn size="small" @click="previewFile(file)" rounded="8">
                        <VIcon class="mr-1">mdi-file-eye</VIcon> Xem trước
                      </VBtn>
                    </VListItemTitle>
                  </VListItem>

                  <VListItem>
                    <VListItemTitle>
                      <VBtn
                        size="small"
                        @click="downloadFile(file)"
                        rounded="8"
                        color="green"
                        block
                      >
                        <VIcon class="mr-1">mdi-file-download</VIcon> Tải ngay
                      </VBtn>
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </div>
          </VSheet>
        </VCard>
      </VCol>
    </VRow>
    <input
      ref="fileInputExcel"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="handleFileUploadExcel"
    />
  </div>

  <VDialog v-model="isShowFile" persistent width="800">
    <VCard>
      <VCardItem>
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
            />
          </div>
          <div v-else>
            <div
              style="height: calc(100vh - 200px); overflow: auto"
              v-html="docContent"
            />
          </div>
        </div>
      </VCardItem>
      <VCardActions>
        <VBtn @click="isShowFile = false"> Đóng </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="isPreview" max-width="900">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Hình ảnh chi tiết</span>
      </VCardTitle>
      <VCardText class="text-center overflow-hidden py-4">
        <VImg :src="previewImage" max-height="80vh" contain class="mx-auto" />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <!-- <VBtn color="blue" variant="tonal" @click="handleDownload(previewImage)">
          Tải ảnh
        </VBtn> -->
        <VBtn variant="text" @click="isPreview = false"> Đóng </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  ApproveRecurringJobInfo,
  GetProgressByRecID,
  GetRecurringTaskByID,
  ReportRecurringJobInfo,
} from "@/api/recurringJobApi";
import { formatDateDDMMYY, formatDateDisplay } from "@/helpers/getTime";
import Editor from "@tinymce/tinymce-vue";
import Axios from "axios";
import { urlUploadRecurringFile } from "./function";

import { DelDocumentFile } from "@/api/documentFileApi";
import { getUserName } from "@/utils/auth";
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";

export default {
  components: {
    Editor,
  },
  data() {
    return {
      dataJobInfo: {},
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
      processLst: [],
      isPreview: false,
      previewImage: "",
      userName: getUserName(),
    };
  },

  created() {
    this.getRecurringTaskByID();
  },
  methods: {
    formatDateDisplay,
    formatDateDDMMYY,
    btDownloadFile(url) {
      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
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

      const previewUrl = `https://sop.idtp.work/api/File/GetRecurringFile?FileName=${file.LinkFile}`;
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
    deleteFile(file) {
      DelDocumentFile({
        Data: file.RowID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.dataJobInfo.DataAssign = this.dataJobInfo.DataAssign.filter(
            (p) => p.RowID != file.RowID,
          );
          this.dataJobInfo.DataApprove = this.dataJobInfo.DataApprove.filter(
            (p) => p.RowID != file.RowID,
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
    getProgressByRecID(templateID) {
      GetProgressByRecID({
        TemplateID: templateID,
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.processLst = res.Data.map((item, index) => {
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

        Axios.post(urlUploadRecurringFile(this.$route.params.id), params).then(
          (res) => {
            if (res.data.RespCode == 0) {
              this.getRecurringTaskByID();

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
          },
        );
      }
    },
    handleFileUpload2(event) {
      const file = event.target.files[0];
      if (file) {
        const params = new FormData();

        params.append("file", file);

        Axios.post(urlUploadRecurringFile(this.$route.params.id), params).then(
          (res) => {
            if (res.data.RespCode == 0) {
              this.getRecurringTaskByID();

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
          },
        );
      }
    },
    getRecurringTaskByID() {
      GetRecurringTaskByID({ RecurringID: this.$route.params.id }).then(
        (res) => {
          if (res.RespCode == 0) {
            this.dataJobInfo = res.Data;
            this.getProgressByRecID(this.dataJobInfo.TemplateID);
          }
        },
      );
    },
    reportRecurringJobInfo() {
      if (this.dataJobInfo.Report && this.dataJobInfo.Report != "") {
        ReportRecurringJobInfo({
          RecurringJobID: this.$route.params.id,
          Report: this.dataJobInfo.Report,
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getRecurringTaskByID();
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
    approveRecurringJobInfo(status) {
      if (this.dataJobInfo.NoteApprove && this.dataJobInfo.NoteApprove != "") {
        ApproveRecurringJobInfo({
          RecurringJobID: this.$route.params.id,
          Status: status,
          NoteApprove: this.dataJobInfo.NoteApprove,
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getRecurringTaskByID();
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
    handleDownload(url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png";
      link.click();
    },
    handleContentImageClick(event) {
      if (event.target.tagName === "IMG") {
        this.previewImage = event.target.src;
        this.isPreview = true;
      }
    },
    openStepDialog(status) {
      if (status == 4) {
        this.approveRecurringJobInfo(4);
      }
      if (status == 5) {
        this.approveRecurringJobInfo(5);
      }
      if (status == 3) {
        this.reportRecurringJobInfo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-card {
  overflow-y: auto; /* Bật cuộn Card để tránh bị đè nút khi ô soạn thảo giãn ra và tránh tràn footer */

  .quill {
    min-height: 200px;
    height: auto !important;
    border: 2px solid rgb(var(--v-theme-grey));
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    :deep(.ql-container) {
      height: auto !important;
      min-height: 150px;
      flex: 1;
      display: flex;
      flex-direction: column;
      border: none !important;
    }

    :deep(.ql-editor) {
      height: auto !important;
      min-height: 150px;
      max-height: 450px;
      overflow-y: auto !important;
    }
  }
}
.report-content, .ql-editor {
  :deep(img), img {
    max-height: 150px;
    max-width: 100% !important;
    height: auto !important;
    cursor: zoom-in;
    border-radius: 4px;
    transition: transform 0.2s;
    display: block;
    margin-block: 8px;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }

  table {
    overflow-x: auto;
    max-width: 100%;
    display: block;
  }
}
</style>

<style lang="scss">
.ql-toolbar.ql-snow {
  border: none !important;
}
.file-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap; 
  padding-bottom: 4px;
  margin-top: 8px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }
}
.report-content,
.ql-editor {
  overflow-x: auto;
  max-width: 100%;
  word-break: break-word;

  ul,
  ol {
    padding-left: 40px !important;
    margin-top: 10px;
    margin-bottom: 10px;
    list-style-position: outside;
  }

  ul {
    list-style-type: disc !important;
  }

  ol {
    list-style-type: decimal !important;
  }

  li {
    margin-bottom: 6px;
    line-height: 1.6;
  }

  table {
    border-radius: 8px;
    border-collapse: collapse;
    font-family: arial, sans-serif;
    inline-size: 100%;
    margin-block: 10px;
  }

  img {
    max-height: 150px;
    max-width: 100% !important;
    height: auto !important;
    cursor: zoom-in;
    border-radius: 4px;
    transition: transform 0.2s;
    margin-block: 8px;
    display: block;

    &:hover {
      transform: scale(1.02);
    }
  }
}
</style>

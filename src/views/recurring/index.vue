<template>
  <VCard class="py-2">
    <div class="d-flex flex-wrap gap-2 px-2">
      <span>
        <VTextField
          v-model="searchJob"
          label="Tìm kiếm"
          hide-details
          style="width: 250px !important"
          clearable
        />
      </span>

      <VBtn
        color="green"
        variant="tonal"
        icon="mdi-reload"
        size="small"
        @click="getRecurringJobLst"
      />
      <VBtn
        color="green"
        variant="tonal"
        icon="mdi-plus"
        size="small"
        @click="openDialog"
      />
    </div>
    <VRow class="mx-0 my-0">
      <VCol v-for="(item, index) in dataRecurringLst" :key="index" lg="3">
        <VCard border flat class="mx-auto" max-width="384">
          <VCardTitle class="px-4 py-2 pb-0">
            {{ item.Title }}
          </VCardTitle>

          <VCardSubtitle class="mb-2">
            <span class="subheading me-1"
              >Bắt đầu {{ formatDateDDMMYY(item.StartDate) }}</span
            >
            <VIcon class="me-1 text-green pb-1" icon="mdi-clock-check" />
          </VCardSubtitle>

          <div class="mx-4">
            <div class="justify-self-end">
              <VIcon
                class="me-1 text-green pb-1"
                icon="mdi-check-circle-outline"
              />
              <span class="subheading me-2"
                ><VTooltip text="Đã duyệt" activator="parent" />{{
                  item.JobSuccess
                }}</span
              >
              <span class="me-1">·</span>
              <VIcon
                class="me-1 text-red pb-1"
                icon="mdi-close-circle-outline"
              />
              <span class="subheading me-2"
                ><VTooltip text="Đã từ chối" activator="parent" />{{
                  item.JobError
                }}</span
              >
              <span class="me-1">·</span>
              <VIcon
                class="me-1 text-orange pb-1"
                icon="mdi-account-file-text"
              />
              <span class="subheading me-2"
                ><VTooltip text="Đã báo cáo" activator="parent" />{{
                  item.JobReport
                }}</span
              >
              <span class="me-1">·</span>
              <VIcon class="me-1 text-blue pb-1" icon="mdi-account-edit" />
              <span class="subheading"
                ><VTooltip text="Đang làm" activator="parent" />{{
                  item.JobProgress
                }}</span
              >
            </div>
          </div>

          <VDivider class="mx-4 my-1" />
          <div class="mx-4 d-flex justify-space-between align-center">
            <div class="my-1">
              <VIcon size="small" color="blue" class="me-1 mb-1">
                mdi-sync </VIcon
              ><span>
                <VTooltip
                  :text="
                    'Chu kỳ lặp ' +
                    (item.RecurrenceType == 2 ? item.WeekdaysCsv : '')
                  "
                  activator="parent"
                />{{ item.IntervalN }}
                {{
                  item.RecurrenceType == 1
                    ? "Ngày"
                    : item.RecurrenceType == 2
                      ? "Tuần"
                      : item.RecurrenceType == 3
                        ? "Tháng"
                        : "Không"
                }}
              </span>
              <span class="mx-1"> - </span>
              <VIcon size="small" color="purple" class="mb-1">
                mdi-pencil-circle-outline
              </VIcon>
              <span>
                <VTooltip text="Số lần lặp" activator="parent" />
                Lần {{ item.TimeRepeat }}
              </span>
            </div>
          </div>

          <VDivider class="mx-4 my-1" />

          <VCardSubtitle class="mb-0">
            <span class="subheading"
              >Tài khoản liên quan ({{ item.Data.length }})</span
            >
          </VCardSubtitle>
          <div class="px-4 mb-0">
            <VChip
              v-for="(user, i) in item.Data"
              :key="i"
              class="mr-0"
              size="small"
              :color="user.UserRole == 'Phê duyệt' ? 'green' : 'orange'"
            >
              {{ user.AssignName[0] }}

              <VTooltip activator="parent" location="top">
                Thực hiện: {{ user.AssignName }}
              </VTooltip>
            </VChip>
          </div>
          <VDivider class="mx-4 my-2" />

          <VCardActions>
            <div>
              <VTooltip
                v-if="item.Status == 1 || item.Status == 2"
                location="top"
              >
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="green"
                    icon="mdi-check"
                    class="mr-1"
                    @click="showConfirm('success', item)"
                  />
                </template>
                <span>Hoàn thành</span>
              </VTooltip>
              <VTooltip v-if="item.Status == 1" location="top">
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="flat"
                    rounded="sm"
                    size="x-small"
                    color="purple"
                    icon="mdi-cursor-pointer"
                    class="mr-1"
                    @click="showConfirm('start', item)"
                  />
                </template>
                <span>Bắt đầu ngay</span>
              </VTooltip>

              <VTooltip
                v-if="item.Status == 1 || item.Status == 2"
                location="top"
              >
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="red"
                    text="Xóa"
                    icon="mdi-delete"
                    @click="showConfirm('delete', item)"
                  />
                </template>
                <span>Xóa</span>
              </VTooltip>
            </div>
            <VSpacer />
            <VTooltip location="top">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  variant="tonal"
                  rounded="sm"
                  size="x-small"
                  color="green"
                  icon="mdi-progress-check"
                  @click="btShowProgress(item)"
                />
              </template>
              <span>Quá trình thực hiện</span>
            </VTooltip>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
  <VDialog v-model="isShowAddNew" max-width="450px" persistent>
    <VCard>
      <VCardTitle class="pt-4">
        <span class="text-h6 text-primary"> Tạo công việc định kỳ </span>
      </VCardTitle>

      <VCardText class="py-0">
        <VRow>
          <VCol cols="12" class="pb-0">
            <v-textarea
              v-model="recurringInfo.Title"
              label="Nhập nội dung công việc"
            ></v-textarea>
          </VCol>

          <VCol cols="12" class="pb-0">
            <VDateField
              v-model.modelValue="recurringInfo.StartDate"
              label="Ngày bắt đầu nhắc việc"
              width="100%"
            />
          </VCol>
          <VCol cols="12" class="pb-0">
            <v-select
              label="Chọn kiểu lặp lại"
              :items="[
                { label: 'Không lặp lại', value: 0 },
                { label: 'Hàng ngày', value: 1 },
                { label: 'Hàng tuần', value: 2 },
                { label: 'Hàng tháng', value: 3 },
              ]"
              item-title="label"
              item-value="value"
              v-model="recurringInfo.RecurrenceType"
              chips
              closable-chips
            ></v-select>
          </VCol>

          <VCol cols="12" class="pb-0" v-if="recurringInfo.RecurrenceType == 2">
            <v-select
              label="Chọn thứ"
              :items="[
                { label: 'Thứ 2', value: 2 },
                { label: 'Thứ 3', value: 3 },
                { label: 'Thứ 4', value: 4 },
                { label: 'Thứ 5', value: 5 },
                { label: 'Thứ 6', value: 6 },
                { label: 'Thứ 7', value: 7 },
                { label: 'Chủ nhật', value: 8 },
              ]"
              item-title="label"
              item-value="value"
              v-model="recurringInfo.WeekdaysCsv"
              chips
              closable-chips
              multiple=""
            ></v-select>
          </VCol>
          <VCol cols="12" v-if="recurringInfo.RecurrenceType == 3" class="pb-0">
            <VTextField
              v-model="recurringInfo.DayOfMonth"
              label="Ngày giao việc"
              type="number"
              variant="outlined"
              dense
              prefix="Ngày"
            />
          </VCol>
          <VCol cols="12" v-if="recurringInfo.RecurrenceType != 0" class="pb-0">
            <VTextField
              v-model="recurringInfo.IntervalN"
              label="Chu kỳ"
              type="number"
              variant="outlined"
              dense
              :suffix="
                recurringInfo.RecurrenceType == 1
                  ? 'ngày'
                  : recurringInfo.RecurrenceType == 2
                    ? 'tuần'
                    : 'tháng'
              "
            />
          </VCol>

          <VCol cols="12" class="pt-2">
            <div>
              <VBtn
                prepend-icon="mdi-user-edit"
                append-icon="mdi-plus"
                size="small"
                color="orange"
                @click="addUserJob"
                rounded="8"
                variant="flat"
              >
                Thực hiện
              </VBtn>
              <div
                class="pt-2"
                v-if="
                  recurringInfo.UserJobLst &&
                  recurringInfo.UserJobLst.length > 0
                "
              >
                <VChip
                  v-for="(item, index) in recurringInfo.UserJobLst"
                  :key="index"
                  class="mr-1 mb-1 rounded"
                  color="orange"
                  variant="tonal"
                >
                  <VIcon icon="mdi-account-circle-outline" start />
                  {{ item.FullName }}
                  <VIcon
                    icon="mdi-close"
                    end
                    @click="removeUserJob(item.UserID)"
                  />
                </VChip>
              </div>
            </div>
            <div class="mt-1">
              <VBtn
                prepend-icon="mdi-user-check"
                append-icon="mdi-plus"
                size="small"
                color="green"
                @click="addUserMana"
                rounded="8"
                variant="flat"
              >
                Phê duyệt
              </VBtn>
              <div class="pt-2">
                <VChip
                  v-for="(item, index) in recurringInfo.UserManaLst"
                  :key="index"
                  class="mr-1 rounded"
                  color="green"
                  variant="tonal"
                >
                  <VIcon icon="mdi-account-circle-outline" start />
                  {{ item.FullName }}
                  <VIcon
                    icon="mdi-close"
                    end
                    @click="removeUserMana(item.UserID)"
                  />
                </VChip>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn text="Hủy" @click="isShowAddNew = false" />
        <VBtn color="green" text="Lưu" @click="updateStepArising" />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="isShowAddUserJob" max-width="400px">
    <VCard>
      <VCardTitle>Thêm người thực hiện</VCardTitle>
      <VCardText class="py-0">
        <VRow>
          <VCol cols="7" class="pr-0">
            <VSelect
              v-model="selectedTeam"
              :items="teamOptions"
              label="Nhóm thực hiện"
              item-title="TeamName"
              item-value="TeamID"
              clearable
              class="mb-2"
            />
          </VCol>
          <VCol cols="5">
            <VTextField v-model="quotaTime" suffix="ngày" label="Hạn" />
          </VCol>
        </VRow>

        <VAutocomplete
          v-model="selectedUser"
          :items="userOptions"
          label="Chọn người thực hiện"
          item-title="FullName"
          item-value="UserName"
          clearable
          multiple
          hide-details
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text="Hủy" @click="isShowAddUserJob = false" />
        <VBtn color="green" text="Thêm" @click="confirmAddUserJob" />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="isShowAddUserMana" max-width="400px">
    <VCard>
      <VCardTitle>Thêm người phê duyệt</VCardTitle>
      <VCardText class="py-0">
        <VRow>
          <VCol cols="7" class="pr-0">
            <VSelect
              v-model="selectedTeam"
              :items="teamOptions"
              label="Nhóm phê duyệt"
              item-title="TeamName"
              item-value="TeamID"
              clearable
              class="mb-2"
            />
          </VCol>
          <VCol cols="5">
            <VTextField v-model="quotaTime" suffix="ngày" label="Hạn" />
          </VCol>
        </VRow>

        <VAutocomplete
          v-model="selectedUser"
          :items="userOptions"
          label="Chọn người phê duyệt"
          item-title="FullName"
          item-value="UserName"
          clearable
          hide-details
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text="Hủy" @click="isShowAddUserMana = false" />
        <VBtn color="green" text="Thêm" @click="confirmAddUserMana" />
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Progress dialog: shows detailed status and participant list -->
  <VDialog v-model="progressDialog.show" max-width="920px" scrollable>
    <VCard class="dtp-progress-dialog">
      <VCardTitle class="dtp-progress-title">
        <div class="d-flex align-center justify-space-between w-100">
          <div>
            <div class="text-h6">Quá trình thực hiện</div>
          </div>

          <VBtn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            @click="progressDialog.show = false"
          />
        </div>
      </VCardTitle>
      <VDivider />
      <VCardText class="dtp-progress-body">
        <div v-if="progressDialog.item">
          <VRow dense class="mb-1">
            <VCol
              v-for="card in progressSummaryCards"
              :key="card.key"
              cols="6"
              sm="6"
              md="3"
            >
              <VCard
                variant="tonal"
                :color="card.color"
                class="dtp-summary-card"
              >
                <VCardText
                  class="d-flex align-center justify-space-between py-3"
                >
                  <div class="d-flex flex-column">
                    <div class="text-caption text-medium-emphasis">
                      {{ card.label }}
                    </div>
                    <div class="text-h5 font-weight-bold">
                      {{ progressDialog.job?.[card.key] || 0 }}
                    </div>
                  </div>
                  <VIcon :icon="card.icon" size="28" />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
          <v-chip
            color="purple"
            v-if="progressDialog.job?.Title"
            class="text-caption text-medium-emphasis rounded mb-2"
          >
            JOB: {{ progressDialog.job.Title }}
          </v-chip>
          <VAlert
            v-if="!progressDialog.item.length"
            type="info"
            variant="tonal"
            class="mb-2"
            title="Không có lịch sử"
            text="Chưa có bước nào được ghi nhận cho công việc này."
          />

          <div v-else class="d-flex flex-column gap-2">
            <v-sheet
              v-for="(job, gi) in progressDialog.item"
              :key="gi"
              class="dtp-progress-item"
              rounded="lg"
              :border="getJobBorder(job.Status)"
            >
              <div class="d-flex justify-space-between">
                <div class="d-flex align-center gap-2">
                  <VChip
                    v-if="job.TimeRepeat"
                    variant="tonal"
                    color="purple"
                    class="rounded"
                  >
                    {{ job.TimeRepeat }}
                  </VChip>
                  <v-chip
                    class="text-caption text-medium-emphasis d-flex align-center flex-wrap gap-2 rounded"
                    color="purple"
                  >
                    <span class="d-flex align-center gap-1 text">
                      <VIcon color="purple" size="small"
                        >mdi-calendar-clock</VIcon
                      >
                      Tạo lúc: {{ formatDateDDMMYY(job.TimeCreate) }}
                    </span>
                  </v-chip>
                </div>

                <div class="text-right">
                  <VChip
                    size="small"
                    class="rounded"
                    variant="tonal"
                    :color="getJobStatusMeta(job.Status).color"
                  >
                    {{ getJobStatusMeta(job.Status).label }}
                  </VChip>
                </div>
              </div>

              <div class="dtp-progress-meta">
                <div class="dtp-section-title">
                  <VIcon size="22" icon="mdi-account-edit" color="blue" />
                  {{ job.AssignName }}
                  <span v-if="job.TimeModify" class="d-flex align-center gap-1">
                    <VIcon color="blue" size="small">mdi-clock</VIcon>
                    {{ formatDateDisplay(job.TimeModify) }}
                  </span>
                </div>
                <v-sheet
                  v-if="job.Report"
                  class="dtp-html-box mt-2"
                  rounded="lg"
                  border
                >
                  <div v-html="job.Report" />
                </v-sheet>
                <div v-else class="text-caption text-medium-emphasis mt-2">
                  Chưa có báo cáo.
                </div>
              </div>

              <div v-if="job.DataAssign?.length" class="dtp-progress-section">
                <div class="dtp-file-chips">
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
                            variant="tonal"
                            class="dtp-file-chip"
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
                          <VBtn
                            @click="previewFile(file)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
                          <VBtn
                            @click="downloadFile(file)"
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-download</v-icon> Tải
                            ngay
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
              </div>

              <div v-if="job.ApproveID" class="dtp-progress-section">
                <div class="dtp-section-title">
                  <VIcon size="22" icon="mdi-account-check" color="red" />
                  {{ job.ApproveName }}
                  <span
                    v-if="job.TimeApprove"
                    class="d-flex align-center gap-1"
                  >
                    <VIcon color="red" size="small">mdi-clock</VIcon>
                    {{ formatDateDisplay(job.TimeApprove) }}
                  </span>
                </div>

                <v-sheet
                  v-if="job.NoteApprove"
                  class="dtp-html-box mt-2"
                  rounded="lg"
                  border
                >
                  <div v-html="job.NoteApprove" />
                </v-sheet>
              </div>

              <div v-if="job.DataApprove?.length" class="dtp-progress-section">
                <div class="dtp-file-chips">
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
                            variant="tonal"
                            class="dtp-file-chip"
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
                          <VBtn
                            @click="previewFile(file)"
                            size="small"
                            rounded="8"
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>
                          <VBtn
                            @click="downloadFile(file)"
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                          >
                            <v-icon class="mr-1">mdi-file-download</v-icon> Tải
                            ngay
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
              </div>
            </v-sheet>
          </div>
        </div>
      </VCardText>
      <VDivider />
      <VCardActions>
        <VSpacer />
        <VBtn variant="tonal" @click="progressDialog.show = false">Đóng</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Dialog xác nhận -->
  <VDialog v-model="confirmDialog.show" max-width="400px">
    <VCard>
      <VCardTitle class="text-h6"> Xác nhận </VCardTitle>
      <VCardText>
        {{
          confirmDialog.type === "success"
            ? "Bạn có chắc chắn muốn đánh dấu công việc này là hoàn thành?"
            : confirmDialog.type === "start"
              ? "Bạn có chắc chắn muốn bắt đầu công việc này?"
              : "Bạn có chắc chắn muốn xóa công việc này?"
        }}
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text="Hủy" @click="confirmDialog.show = false" />
        <VBtn
          v-if="confirmDialog.type === 'success'"
          color="green"
          text="Xác nhận"
          @click="updateStepStatus(4, confirmDialog.item)"
        />
        <VBtn
          v-if="confirmDialog.type === 'start'"
          color="purple"
          text="Xác nhận"
          @click="startStepArisingConfirm"
        />
        <VBtn
          v-if="confirmDialog.type === 'delete'"
          color="red"
          text="Xác nhận"
          @click="updateStepStatus(0, confirmDialog.item)"
        />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  GetProgressByRecID,
  GetRecurringJobLst,
  UpdateRecurringJobInfo,
  UpdateRecurringJobStatus,
} from "@/api/recurringJobApi";
import { GetTeamLstUserID } from "@/api/teamApi";
import { GetUserLstByTeamID } from "@/api/user";
import {
  formatDate,
  formatDate00,
  formatDateDDMMYY,
  formatDateDisplay,
} from "@/helpers/getTime";
export default {
  data() {
    return {
      isShowAddNew: false,
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      searchJob: "",
      recurringInfo: {},
      isShowAddUserJob: false,
      isShowAddUserMana: false,
      selectedUser: null,
      selectedTeam: null,
      quotaTime: 0,
      userOptions: [],
      teamOptions: [],
      dataRecurringLst: [],
      confirmDialog: {
        show: false,
        type: "", // 'success' | 'delete'
        item: null,
      },
      progressDialog: {
        show: false,
        item: null,
        job: null,
      },
      progressSummaryCards: [
        {
          key: "JobSuccess",
          label: "Đã duyệt",
          color: "green",
          icon: "mdi-check-circle-outline",
        },
        {
          key: "JobProgress",
          label: "Đang làm",
          color: "blue",
          icon: "mdi-account-edit",
        },
        {
          key: "JobReport",
          label: "Đã báo cáo",
          color: "orange",
          icon: "mdi-file-document-outline",
        },
        {
          key: "JobError",
          label: "Bị từ chối",
          color: "red",
          icon: "mdi-close-circle-outline",
        },
      ],
    };
  },
  watch: {
    "recurringInfo.RecurrenceType"(newVal) {
      if (newVal !== 2) {
        this.recurringInfo.WeekdaysCsv = [];
      } else {
        this.recurringInfo.WeekdaysCsv = [];
      }
      if (newVal !== 3) {
        this.recurringInfo.DayOfMonth = null;
      } else {
        this.recurringInfo.DayOfMonth = 1;
      }
    },
    "recurringInfo.WeekdaysCsv"(newVal) {
      if (this.recurringInfo.RecurrenceType === 2 && newVal.length > 0) {
        this.recurringInfo.WeekdaysCsv = newVal.sort((a, b) => a - b);
      }
    },
    selectedTeam(value) {
      if (value) {
        GetUserLstByTeamID({
          PageNumber: 1,
          RowspPage: 150,
          TeamID: value,
        }).then((res) => {
          if (res.RespCode === 0) {
            this.userOptions = res.Data;
          }
        });
      } else {
        this.userOptions = [];
      }
    },
  },
  created() {
    this.getRecurringJobLst();
  },
  methods: {
    formatDateDisplay,
    getProgressByRecID(templateID) {
      GetProgressByRecID({
        TemplateID: templateID,
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      }).then((res) => {
        if (res.RespCode === 0) {
          this.progressDialog.item = res.Data;
          this.progressDialog.show = true;
        }
      });
    },
    formatDateDDMMYY,
    formatDateTime(value) {
      if (!value) return "";
      const d = new Date(value);
      if (isNaN(d)) return String(value);
      return d.toLocaleString();
    },
    getJobStatusMeta(status) {
      const s = Number(status);

      if (s === 4) {
        return {
          key: "success",
          label: "Đã duyệt",
          color: "green",
          icon: "mdi-check-circle-outline",
        };
      }
      if (s === 1) {
        return {
          key: "progress",
          label: "Đang làm",
          color: "blue",
          icon: "mdi-account-edit",
        };
      }
      if (s === 3) {
        return {
          key: "report",
          label: "Đã báo cáo",
          color: "orange",
          icon: "mdi-file-document-outline",
        };
      }
      if (s === 5) {
        return {
          key: "error",
          label: "Bị từ chối",
          color: "red",
          icon: "mdi-close-circle-outline",
        };
      }

      return {
        key: "pending",
        label: "Chưa xử lý",
        color: "gray",
        icon: "mdi-clock-outline",
      };
    },
    getJobBorder(status) {
      const meta = this.getJobStatusMeta(status);
      return meta.color === "gray" ? "gray md" : `${meta.color} md`;
    },

    updateStepArising() {
      // basic validation
      if (!this.recurringInfo || !this.recurringInfo.Title) {
        notify({
          title: "Lỗi",
          text: "Vui lòng nhập nội dung công việc",
          type: "error",
        });
        return;
      }
      if (!this.recurringInfo.StartDate) {
        notify({
          title: "Lỗi",
          text: "Vui lòng chọn ngày bắt đầu",
          type: "error",
        });
        return;
      }

      const payload = {
        Title: this.recurringInfo.Title,
        StartDate: formatDate(this.recurringInfo.StartDate),
        RecurrenceType: this.recurringInfo.RecurrenceType,
        IntervalN: this.recurringInfo.IntervalN,
        WeekdaysCsv: this.recurringInfo.WeekdaysCsv
          ? this.recurringInfo.WeekdaysCsv.join(",")
          : null,
        DayOfMonth: this.recurringInfo.DayOfMonth,
        Data: this.recurringInfo.UserJobLst || [],
        ApproveID:
          (this.recurringInfo.UserManaLst &&
            this.recurringInfo.UserManaLst[0]?.UserID) ||
          null,
        TeamApproveID:
          (this.recurringInfo.UserManaLst &&
            this.recurringInfo.UserManaLst[0]?.TeamID) ||
          null,
      };

      UpdateRecurringJobInfo({ Data: payload }).then((res) => {
        if (res && res.RespCode === 0) {
          notify({
            title: "Thành công",
            text: "Lưu công việc định kỳ thành công",
            type: "success",
          });
          this.getRecurringJobLst();
          this.isShowAddNew = false;
        } else {
          notify({
            title: "Lỗi",
            text: (res && res.Message) || "Lưu thất bại",
            type: "error",
          });
        }
      });
    },

    updateStepStatus(status, item) {
      if (!item) return;
      const payload = {
        RecurringJobID: item.RowID,
        Status: status,
      };

      UpdateRecurringJobStatus(payload).then((res) => {
        if (res && res.RespCode === 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật trạng thái thành công",
            type: "success",
          });
          this.getRecurringJobLst();
          this.confirmDialog.show = false;
        } else {
          notify({
            title: "Lỗi",
            text: (res && res.Message) || "Cập nhật thất bại",
            type: "error",
          });
        }
      });
    },
    getRecurringJobLst() {
      GetRecurringJobLst({
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: this.searchJob,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.dataRecurringLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        }
      });
    },
    showConfirm(type, item) {
      this.confirmDialog.type = type;
      this.confirmDialog.item = item;
      this.confirmDialog.show = true;
    },
    startStepArisingConfirm() {
      this.startStepArising();
    },

    startStepArising() {
      const item = this.confirmDialog.item;
      if (!item) return;
      const id = item.RowID;
      UpdateRecurringJobStatus({ RecurringJobID: id, Status: 2 }).then(
        (res) => {
          if (res && res.RespCode === 0) {
            notify({
              title: "Thành công",
              text: "Bắt đầu công việc",
              type: "success",
            });
            this.getRecurringJobLst();
            this.confirmDialog.show = false;
          } else {
            notify({
              title: "Lỗi",
              text: (res && res.Message) || "Bắt đầu thất bại",
              type: "error",
            });
          }
        },
      );
    },
    btShowProgress(item) {
      this.getProgressByRecID(item.RowID);
      this.progressDialog.job = item;
    },

    openDialog() {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      this.recurringInfo = {
        StartDate: formatDate00(date),
        RecurrenceType: 0,
        IntervalN: 1,
      };

      this.isShowAddNew = true;
    },
    getTeamLstUserID() {
      if (this.teamOptions.length > 0) return;
      GetTeamLstUserID({}).then((res) => {
        if (res.RespCode === 0) {
          this.teamOptions = res.Data;

          if (!this.selectedTeam && this.teamOptions.length > 0) {
            this.selectedTeam = this.teamOptions[0].TeamID;
          }
        }
      });
    },

    addUserJob() {
      this.isShowAddUserJob = true;
      this.quotaTime = 1;
      this.getTeamLstUserID();
    },
    addUserMana() {
      this.isShowAddUserMana = true;
      this.quotaTime = 1;
      this.getTeamLstUserID();
    },
    confirmAddUserJob() {
      if (this.selectedUser && this.selectedTeam) {
        if (!this.recurringInfo.UserJobLst) {
          this.recurringInfo.UserJobLst = [];
        }
        var userLst = this.userOptions || [];
        for (let index = 0; index < this.selectedUser.length; index++) {
          const element = this.selectedUser[index];
          var userInfo = userLst.find((p) => p.UserName == element);
          var exist = this.recurringInfo.UserJobLst.find(
            (p) => p.UserID == element,
          );
          if (!exist) {
            this.recurringInfo.UserJobLst.push({
              FullName: userInfo.FullName,
              Quota: this.quotaTime,
              UserID: userInfo.UserName,
              UserRole: "Xử lý",
              TeamID: this.selectedTeam,
            });
          }
        }

        this.selectedUser = null;
        this.selectedTeam = null;
        this.isShowAddUserJob = false;
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
          type: "error",
        });
      }
    },
    removeUserJob(phone) {
      this.recurringInfo.UserJobLst = this.recurringInfo.UserJobLst.filter(
        (p) => p.UserID != phone,
      );
    },
    confirmAddUserMana() {
      if (this.selectedUser && this.selectedTeam) {
        this.recurringInfo.UserManaLst = [];

        var userLst = this.userOptions || [];

        var userInfo = userLst.find((p) => p.UserName == this.selectedUser);
        this.recurringInfo.UserManaLst.push({
          FullName: userInfo.FullName,
          QuotaTime: this.quotaTime,
          UserID: userInfo.UserName,
          UserRole: "Phê duyệt",
          TeamID: this.selectedTeam,
        });

        this.selectedUser = null;
        this.selectedTeam = null;
        this.isShowAddUserMana = false;
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
          type: "error",
        });
      }
    },
    removeUserMana(phone) {
      this.recurringInfo.UserManaLst = this.recurringInfo.UserManaLst.filter(
        (p) => p.UserID != phone,
      );
    },
  },
};
</script>

<style scoped>
.dtp-progress-title {
  padding-block: 12px;
}

.dtp-progress-body {
  padding-block: 16px;
}

.dtp-summary-card {
  border-radius: 12px;
}

.dtp-progress-item {
  padding: 8px;
}

.dtp-job-title {
  font-weight: 600;
}

.dtp-progress-meta {
  margin-top: 10px;
}

.dtp-progress-section {
  margin-top: 12px;
}

.dtp-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  margin-bottom: 6px;
}

.dtp-file-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dtp-file-chip {
  max-width: 100%;
}

.dtp-html-box {
  padding: 8px 12px;
  padding-bottom: 6px;
  background: rgb(var(--v-theme-background));
}

.dtp-html-box :deep(img) {
  max-width: 100%;
  height: auto;
}

.dtp-html-box :deep(pre),
.dtp-html-box :deep(code) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>

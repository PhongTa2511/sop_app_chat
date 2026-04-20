<template>
  <VCard class="py-2">
    <div class="d-flex flex-wrap align-center gap-2 px-3 pt-1">
      <VTextField
        v-model="searchJob"
        class="dtp-recurring-search"
        label="Tìm kiếm"
        placeholder="Tìm theo tiêu đề…"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
        @keyup.enter="getRecurringJobLst"
      />
      <VSpacer />
      <VTooltip text="Tải lại" location="top">
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            aria-label="Tải lại"
            @click="getRecurringJobLst"
          />
        </template>
      </VTooltip>
      <VTooltip text="Tạo mới" location="top">
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            color="green"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            aria-label="Tạo công việc định kỳ"
            @click="openDialog"
          />
        </template>
      </VTooltip>
    </div>
    <VRow class="mx-2 my-0" dense>
      <VCol v-if="!dataRecurringLst || dataRecurringLst.length === 0" cols="12">
        <div class="dtp-empty-state text-center py-8">
          <VIcon icon="mdi-calendar-sync" size="44" class="mb-2" />
          <div class="text-body-1 font-weight-medium">
            Chưa có công việc định kỳ
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Nhấn nút <strong>+</strong> để tạo mới.
          </div>
        </div>
      </VCol>
      <VCol
        v-for="(item, index) in dataRecurringLst"
        :key="item.RowID ?? item.TemplateID ?? index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <VCard
          class="dtp-recurring-card mx-auto h-100 d-flex flex-column"
          :border="getJobBorder(item.Status)"
        >
          <VCardItem class="px-4 pt-2 pb-0">
            <template #title>
              <span class="dtp-recurring-title">{{ item.Title }}</span>
            </template>
            <template #subtitle>
              <div class="d-flex align-center gap-2">
                <VIcon
                  icon="mdi-calendar-start"
                  size="16"
                  class="text-medium-emphasis"
                />
                <span class="text-body-2 text-medium-emphasis">
                  Bắt đầu: {{ formatDateDDMMYY(item.StartDate) }}
                </span>
              </div>
            </template>
          </VCardItem>
          <VCardText class="pt-0 pb-2 px-4">
            <div class="d-flex flex-wrap gap-2">
              <VTooltip :text="getRecurrenceTooltip(item)" location="top">
                <template #activator="{ props }">
                  <VChip
                    v-bind="props"
                    size="small"
                    color="blue"
                    variant="tonal"
                  >
                    <VIcon start icon="mdi-sync" />
                    {{ getRecurrenceLabel(item) }}
                  </VChip>
                </template>
              </VTooltip>
              <VChip
                v-if="Number(item.RecurrenceType) === 2"
                size="small"
                variant="outlined"
                color="primary"
              >
                <VIcon start icon="mdi-calendar-week" />
                Thứ {{ item.WeekdaysCsv }}
              </VChip>
              <VChip
                v-if="Number(item.RecurrenceType) === 3"
                size="small"
                variant="outlined"
                color="primary"
              >
                <VIcon start icon="mdi-calendar-month" />
                Ngày {{ item.DayOfMonth }}
              </VChip>
              <VChip size="small" variant="outlined" color="purple">
                <VIcon start icon="mdi-repeat" />
                Lần #{{ item.TimeRepeat ?? 0 }}
              </VChip>
            </div>
            <div class="dtp-recurring-metrics mt-3">
              <div
                v-for="card in progressSummaryCards"
                :key="card.key"
                class="dtp-recurring-metric"
              >
                <VIcon :icon="card.icon" :color="card.color" size="18" />
                <div class="dtp-recurring-metric-value">
                  {{ item[card.key] ?? 0 }}
                </div>
              </div>
            </div>
            <div class="dtp-recurring-section mt-3">
              <div class="dtp-section-title">
                <VIcon size="18" color="blue" icon="mdi-account-multiple" />
                <span>Thực hiện</span>
                <span class="text-medium-emphasis"
                  >({{ item.Data?.length ?? 0 }})</span
                >
              </div>
              <div
                v-if="item.Data && item.Data.length > 0"
                class="dtp-recurring-avatars"
              >
                <template v-for="(user, i) in item.Data.slice(0, 8)" :key="i">
                  <VTooltip location="top">
                    <template #activator="{ props }">
                      <VAvatar
                        v-bind="props"
                        size="28"
                        :color="
                          user.UserRole === 'Phê duyệt' ? 'green' : 'orange'
                        "
                        class="text-white"
                      >
                        <span class="text-caption">
                          {{ getInitials(user.AssignName) }}
                        </span>
                      </VAvatar>
                    </template>
                    <span>{{ user.AssignName }}</span>
                  </VTooltip>
                </template>
                <VChip
                  v-if="item.Data.length > 8"
                  size="x-small"
                  variant="outlined"
                >
                  +{{ item.Data.length - 8 }}
                </VChip>
              </div>
              <div v-else class="text-caption text-medium-emphasis">
                Chưa có người thực hiện
              </div>
            </div>
            <div class="d-flex align-center gap-2 mt-2">
              <VIcon size="18" color="error" icon="mdi-account-check" />
              <span class="text-body-2">Người duyệt:</span>
              <span class="text-body-2 font-weight-medium">
                {{ item.ApproveName || "—" }}
              </span>
            </div>
          </VCardText>
          <VDivider class="mx-4 my-1" />
          <VCardActions class="px-4 pt-1 pb-3 mt-auto">
            <div class="d-flex align-center gap-1">
              <VTooltip
                v-if="item.Status == 1 || item.Status == 2"
                text="Hoàn thành"
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
                    aria-label="Hoàn thành"
                    @click="showConfirm('success', item)"
                  />
                </template>
              </VTooltip>
              <VTooltip
                v-if="item.Status == 1"
                text="Bắt đầu ngay"
                location="top"
              >
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="purple"
                    icon="mdi-cursor-pointer"
                    aria-label="Bắt đầu ngay"
                    @click="showConfirm('start', item)"
                  />
                </template>
              </VTooltip>
              <VTooltip
                v-if="item.Status == 1 || item.Status == 2"
                text="Xóa"
                location="top"
              >
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="red"
                    icon="mdi-delete"
                    aria-label="Xóa"
                    @click="showConfirm('delete', item)"
                  />
                </template>
              </VTooltip>
            </div>
            <VSpacer />
            <div class="d-flex align-center gap-1">
              <VTooltip
                text="Cập nhật thông tin công việc định kỳ"
                location="top"
              >
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="green"
                    icon="mdi-update"
                    aria-label="Cập nhật thông tin công việc định kỳ"
                    @click="openDialog(item)"
                  />
                </template>
              </VTooltip>
              <VTooltip text="Quá trình thực hiện" location="top">
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="green"
                    icon="mdi-progress-check"
                    aria-label="Quá trình thực hiện"
                    @click="btShowProgress(item)"
                  />
                </template>
              </VTooltip>
            </div>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
    <VDataTableServer
      v-model:items-per-page="rowspPage"
      v-model:page="pageNumber"
      :items-length="totalLength"
      :items="dataRecurringLst"
      :headers="[]"
      class="dtp-pagination-table"
      items-per-page-text="Số dòng 1 trang"
      :items-per-page-options="[
        { value: 16, title: '16' },
        { value: 32, title: '32' },
        { value: 64, title: '64' },
        { value: 10000, title: 'All' },
      ]"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
    >
      <template #thead />
      <template #tbody />
    </VDataTableServer>
  </VCard>
  <VDialog v-model="isShowAddNew" max-width="450px" persistent>
    <VCard>
      <VCardTitle class="pt-4">
        <span class="text-h6 text-primary">
          {{ recurringInfo.RowID ? "Cập nhật" : "Tạo" }} công việc định kỳ
        </span>
      </VCardTitle>
      <VCardText class="py-0">
        <VRow>
          <VCol cols="12" class="pb-0">
            <VTextarea
              v-model="recurringInfo.Title"
              label="Nhập nội dung công việc"
            />
          </VCol>
          <VCol cols="12" class="pb-0">
            <VDateField
              v-model.modelValue="recurringInfo.StartDate"
              label="Ngày bắt đầu nhắc việc"
              width="100%"
            />
          </VCol>
          <VCol cols="12" class="pb-0">
            <VSelect
              v-model="recurringInfo.RecurrenceType"
              label="Chọn kiểu lặp lại"
              :items="[
                { label: 'Không lặp lại', value: 0 },
                { label: 'Hàng ngày', value: 1 },
                { label: 'Hàng tuần', value: 2 },
                { label: 'Hàng tháng', value: 3 },
              ]"
              item-title="label"
              item-value="value"
              chips
              closable-chips
            />
          </VCol>
          <VCol v-if="recurringInfo.RecurrenceType == 2" cols="12" class="pb-0">
            <VSelect
              v-model="recurringInfo.WeekdaysCsv"
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
              chips
              closable-chips
              multiple=""
            />
          </VCol>
          <VCol v-if="recurringInfo.RecurrenceType == 3" cols="12" class="pb-0">
            <VTextField
              v-model="recurringInfo.DayOfMonth"
              label="Ngày giao việc"
              type="number"
              variant="outlined"
              dense
              prefix="Ngày"
            />
          </VCol>
          <VCol v-if="recurringInfo.RecurrenceType != 0" cols="12" class="pb-0">
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
              <div class="d-flex justify-space-between">
                <VBtn
                  prepend-icon="mdi-user-edit"
                  append-icon="mdi-plus"
                  size="small"
                  color="orange"
                  rounded="8"
                  variant="flat"
                  @click="addUserJob"
                >
                  Thực hiện
                </VBtn>

                <VTooltip text="Xóa nhiều" location="top">
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      size="small"
                      color="red"
                      rounded="8"
                      variant="flat"
                      @click="deleteMultipleUserJob"
                    >
                      <VIcon icon="mdi-delete" />
                    </VBtn>
                  </template>
                </VTooltip>
              </div>

              <div
                v-if="
                  recurringInfo.UserJobLst &&
                  recurringInfo.UserJobLst.length > 0
                "
                class="pt-2"
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
                rounded="8"
                variant="flat"
                @click="addUserMana"
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
        >
          <template #chip="{ props, item }">
            <VChip
              v-bind="props"
              :text="`${item.raw.FullName} - ${item.raw.EmployeeCode || item.raw.UserName || ''}`"
            />
          </template>
          <template #item="{ props, item }">
            <VListItem v-bind="props">
              <template #title>
                <div class="d-flex justify-space-between align-center">
                  <span>{{ item.raw.FullName }}</span>
                  <span class="text-caption text-grey font-weight-bold ml-2">{{
                    item.raw.EmployeeCode || item.raw.UserName || ""
                  }}</span>
                </div>
              </template>
            </VListItem>
          </template>
        </VAutocomplete>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text="Chọn tất cả" @click="toggleSelectAllUsers" />
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
        >
          <template #selection="{ props, item }">
            <div
              class="v-select__selection-text d-flex justify-space-between w-100"
            >
              <span>{{ item.raw.FullName }}</span>
              <span class="ml-2 text-grey">{{
                item.raw.EmployeeCode || item.raw.UserName || ""
              }}</span>
            </div>
          </template>
          <template #item="{ props, item }">
            <VListItem v-bind="props">
              <template #title>
                <div class="d-flex justify-space-between align-center">
                  <span>{{ item.raw.FullName }}</span>
                  <span class="text-caption text-grey ml-2">{{
                    item.raw.EmployeeCode || item.raw.UserName || ""
                  }}</span>
                </div>
              </template>
            </VListItem>
          </template>
        </VAutocomplete>
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
          <VChip
            v-if="progressDialog.job?.Title"
            color="purple"
            class="text-caption text-medium-emphasis rounded mb-2"
          >
            JOB: {{ progressDialog.job.Title }}
          </VChip>
          <VAlert
            v-if="!progressDialog.item.length"
            type="info"
            variant="tonal"
            class="mb-2"
            title="Không có lịch sử"
            text="Chưa có bước nào được ghi nhận cho công việc này."
          />
          <div v-else class="d-flex flex-column gap-2">
            <VSheet
              v-for="(job, gi) in progressDialog.item"
              :key="gi"
              class="dtp-progress-item"
              rounded="lg"
              :border="getJobBorder(job.Status)"
            >
              {{ console.log("job:", job) }}
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
                  <VChip
                    class="text-caption text-medium-emphasis d-flex align-center flex-wrap gap-2 rounded"
                    color="purple"
                  >
                    <span class="d-flex align-center gap-1 text">
                      <VIcon color="purple" size="small"
                        >mdi-calendar-clock</VIcon
                      >
                      Tạo lúc: {{ formatDateDDMMYY(job.TimeCreate) }}
                    </span>
                  </VChip>
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
                <VSheet
                  v-if="job.Report"
                  class="dtp-html-box mt-2"
                  rounded="lg"
                  border
                >
                  <div v-html="job.Report" />
                </VSheet>
                <div v-else class="text-caption text-medium-emphasis mt-2">
                  Chưa có báo cáo.
                </div>
              </div>
              <div v-if="job.DataAssign?.length" class="dtp-progress-section">
                <div class="dtp-section-title">
                  <VIcon size="16" color="orange" icon="mdi-paperclip" />
                  <span class="text-caption font-weight-medium"
                    >File báo cáo</span
                  >
                </div>
                <div class="dtp-file-chips">
                  <VMenu
                    v-for="(file, indfile) in job.DataAssign"
                    :key="indfile"
                    location="end"
                  >
                    <template #activator="{ props }">
                      <VChip
                        color="orange"
                        variant="tonal"
                        class="dtp-file-chip"
                        :title="file.NameFile"
                        v-bind="props"
                      >
                        <VIcon start size="14"> mdi-file-outline </VIcon>
                        {{ file.NameFile || file.MineFile }}
                      </VChip>
                    </template>
                    <VList>
                      <VListItem v-if="isPreviewSupported(file.MineFile)">
                        <VListItemTitle>
                          <VBtn
                            size="small"
                            rounded="8"
                            class="mb-1"
                            @click="previewFile(file)"
                          >
                            <VIcon class="mr-1"> mdi-file-eye </VIcon> Xem trước
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                      <VListItem>
                        <VListItemTitle>
                          <VBtn
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                            @click="downloadFile(file)"
                          >
                            <VIcon class="mr-1"> mdi-file-download </VIcon> Tải
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
                <VSheet
                  v-if="job.NoteApprove"
                  class="dtp-html-box mt-2"
                  rounded="lg"
                  border
                >
                  <div v-html="job.NoteApprove" />
                </VSheet>
              </div>
              <div v-if="job.DataApprove?.length" class="dtp-progress-section">
                <div class="dtp-section-title">
                  <VIcon size="16" color="green" icon="mdi-paperclip" />
                  <span class="text-caption font-weight-medium"
                    >File phê duyệt</span
                  >
                </div>
                <div class="dtp-file-chips">
                  <VMenu
                    v-for="(file, indfile) in job.DataApprove"
                    :key="indfile"
                    location="end"
                  >
                    <template #activator="{ props }">
                      <VChip
                        color="green"
                        variant="tonal"
                        class="dtp-file-chip"
                        :title="file.NameFile"
                        v-bind="props"
                      >
                        <VIcon start size="14"> mdi-file-outline </VIcon>
                        {{ file.NameFile || file.MineFile }}
                      </VChip>
                    </template>
                    <VList>
                      <VListItem v-if="isPreviewSupported(file.MineFile)">
                        <VListItemTitle>
                          <VBtn
                            size="small"
                            rounded="8"
                            class="mb-1"
                            @click="previewFile(file)"
                          >
                            <VIcon class="mr-1"> mdi-file-eye </VIcon> Xem trước
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                      <VListItem>
                        <VListItemTitle>
                          <VBtn
                            size="small"
                            rounded="8"
                            color="green"
                            block
                            class="mb-1"
                            @click="downloadFile(file)"
                          >
                            <VIcon class="mr-1"> mdi-file-download </VIcon> Tải
                            ngay
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
              </div>
            </VSheet>
          </div>
        </div>
      </VCardText>
      <VDivider />
      <VCardActions>
        <VSpacer />
        <VBtn variant="tonal" @click="progressDialog.show = false"> Đóng </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <!-- Dialog xem trước file -->
  <VDialog v-model="isShowFile" persistent width="800">
    <VCard>
      <VCardItem>
        <div v-if="isLoading">Đang tải...</div>
        <div v-else>
          <strong>{{ nameFile }}</strong>
          <div
            style="height: calc(100vh - 200px); overflow: auto; margin-top: 8px"
            v-html="docContent"
          />
        </div>
      </VCardItem>
      <VCardActions>
        <VSpacer />
        <VBtn @click="isShowFile = false"> Đóng </VBtn>
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
import {
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";
import { notify } from "@kyvg/vue3-notification";

export default {
  data() {
    return {
      isShowAddNew: false,
      rowspPage: 16,
      pageNumber: 1,
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
      isShowFile: false,
      fileUrl: "",
      fileMine: "",
      nameFile: "",
      docContent: "",
      isLoading: false,
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
  computed: {
    areAllUsersSelected() {
      return (
        Array.isArray(this.selectedUser) &&
        this.userOptions.length > 0 &&
        this.selectedUser.length === this.userOptions.length
      );
    },
  },
  computed: {
    totalPage() {
      if (!this.totalLength || this.totalLength === 0) return 1;

      return Math.ceil(this.totalLength / this.rowspPage);
    },
  },
  watch: {
    "recurringInfo.RecurrenceType"(newVal) {
      if (Number(newVal) !== 2) {
        this.recurringInfo.WeekdaysCsv = [];
      }
      if (Number(newVal) !== 3) {
        this.recurringInfo.DayOfMonth = null;
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
    pageNumber(value) {
      this.getRecurringJobLst();
    },
    rowspPage(value) {
      this.getRecurringJobLst();
    },
  },
  created() {
    this.getRecurringJobLst();
  },
  methods: {
    // toggleSelectAllUsers() {
    //   if (!this.userOptions.length) return;
    //   if (this.areAllUsersSelected) {
    //     this.selectedUser = [];
    //   } else {
    //     this.selectedUser = this.userOptions.map((user) => user.UserName);
    //   }
    // },
    deleteMultipleUserJob() {
      this.recurringInfo.UserJobLst = [];
    },
    formatDateDisplay,
    getProgressByRecID(templateID) {
      GetProgressByRecID({
        TemplateID: templateID,
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      }).then((res) => {
        if (res.RespCode === 0) {
          console.error("DEBUG PROGRESS DATA:", res.Data);
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
      if (s === 5) {
        return {
          key: "error",
          label: "Từ chối",
          color: "red",
          icon: "mdi-check-circle-outline",
        };
      }
      if (s === 4) {
        return {
          key: "success",
          label: "Đã duyệt",
          color: "green",
          icon: "mdi-check-circle-outline",
        };
      }
      if (s === 3) {
        return {
          key: "progress",
          label: "Đã báo cáo",
          color: "orange",
          icon: "mdi-account-edit",
        };
      }
      if (s === 1) {
        return {
          key: "report",
          label: "Đang làm",
          color: "blue",
          icon: "mdi-file-document-outline",
        };
      }

      return {
        key: "pending",
        label: "Chưa xử lý",
        color: "",
        icon: "mdi-clock-outline",
      };
    },
    getJobBorder(status) {
      const meta = this.getJobStatusMeta(status);

      return meta.color === "" ? "md" : `${meta.color} md`;
    },
    getRecurrenceLabel(item) {
      const type = Number(item?.RecurrenceType);
      const interval = Number(item?.IntervalN) || 0;
      if (type === 1) return `Mỗi ${interval || 1} ngày`;
      if (type === 2) return `Mỗi ${interval || 1} tuần`;
      if (type === 3) return `Mỗi ${interval || 1} tháng`;

      return "Không lặp";
    },
    getRecurrenceTooltip(item) {
      const type = Number(item?.RecurrenceType);
      if (type === 2 && item?.WeekdaysCsv) {
        return `Chu kỳ lặp • Thứ ${item.WeekdaysCsv}`;
      }
      if (type === 3 && item?.DayOfMonth) {
        return `Chu kỳ lặp • Ngày ${item.DayOfMonth}`;
      }

      return "Chu kỳ lặp";
    },
    getInitials(name) {
      const raw = String(name || "").trim();
      if (!raw) return "—";
      const parts = raw.split(/\s+/).filter(Boolean);
      if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();

      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
        RowID: this.recurringInfo.RowID || 0,
        TemplateID:
          this.recurringInfo.TemplateID || this.recurringInfo.RowID || 0,
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
        ApproveName:
          (this.recurringInfo.UserManaLst &&
            this.recurringInfo.UserManaLst[0]?.FullName) ||
          null,
        TeamApproveID:
          (this.recurringInfo.UserManaLst &&
            this.recurringInfo.UserManaLst[0]?.TeamID) ||
          null,
        Status: this.recurringInfo.Status || 1,
        JobSuccess: this.recurringInfo.JobSuccess || 0,
        JobError: this.recurringInfo.JobError || 0,
        JobProgress: this.recurringInfo.JobProgress || 0,
        JobReport: this.recurringInfo.JobReport || 0,
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
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: this.searchJob,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.totalLength = Number(
            res.TotalRows ||
              res.TotalLength ||
              res.TotalRow ||
              (res.Data ? res.Data.length : 0),
          );
          this.dataRecurringLst = res.Data.map((item, index) => {
            const num = (this.pageNumber - 1) * this.rowspPage;

            return {
              ...item,
              Key: index + 1 + num,
            };
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
    toggleSelectAllUsers() {
      if (!this.userOptions.length) return;
      if (!Array.isArray(this.selectedUser)) {
        this.selectedUser = [];
      }

      if (this.areAllUsersSelected) {
        this.selectedUser = [];

        return;
      }

      this.selectedUser = this.userOptions.map((user) => user.UserName);
    },
    openDialog(item = null) {
      if (item && item.Title) {
        // cập nhật
        this.recurringInfo = {
          RowID: item.RowID || item.TemplateID,
          Title: item.Title,
          StartDate: item.StartDate,
          RecurrenceType: Number(item.RecurrenceType) || 0,
          IntervalN: Number(item.IntervalN) || 1,
          WeekdaysCsv: item.WeekdaysCsv
            ? item.WeekdaysCsv.split(",").map(Number)
            : [],
          DayOfMonth: Number(item.DayOfMonth) || 1,

          // lấy danh sách người thực hiện từ item.Data
          UserJobLst: (item.Data || []).map((u) => ({
            FullName: u.AssignName || u.FullName,
            UserID: u.AssignID || u.UserID,
            TeamID: u.TeamID,
            UserRole: u.UserRole || "Xử lý",
          })),

          // lấy danh sách người duyệt từ item.ApproveID
          UserManaLst: item.ApproveID
            ? [
                {
                  FullName: item.ApproveName,
                  UserID: item.ApproveID,
                  UserRole: "Phê duyệt",
                  TeamID: item.TeamApproveID,
                },
              ]
            : [],
          Status: item.Status,
          JobSuccess: item.JobSuccess,
          JobError: item.JobError,
          JobProgress: item.JobProgress,
          JobReport: item.JobReport,
        };
        this.isShowAddNew = true;
      } else {
        const date = new Date();

        date.setDate(date.getDate() + 1);
        this.recurringInfo = {
          StartDate: formatDate00(date),
          RecurrenceType: 0,
          IntervalN: 1,
          DayOfMonth: 1,
          WeekdaysCsv: [],
          UserJobLst: [],
          UserManaLst: [],
        };
        this.isShowAddNew = true;
      }
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
    removeUserJob(userId) {
      this.recurringInfo.UserJobLst = this.recurringInfo.UserJobLst.filter(
        (p) => p.UserID != userId,
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
    removeUserMana(userId) {
      this.recurringInfo.UserManaLst = this.recurringInfo.UserManaLst.filter(
        (p) => p.UserID != userId,
      );
    },
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension);
    },
    downloadFile(file) {
      const url = `https://sop.idtp.work/api/File/GetRecurringFile?FileName=${file.LinkFile}`;

      window.open(url, "_blank", "noopener,noreferrer");
    },
    async previewFile(file) {
      if (!isPreviewSupported(file.MineFile)) {
        this.downloadFile(file);

        return;
      }
      this.isLoading = true;
      this.nameFile = file.NameFile || file.MineFile;
      this.docContent = "";
      this.fileMine = (file.MineFile || "").trim().toLowerCase();

      const previewUrl = `https://sop.idtp.work/api/File/GetRecurringFile?FileName=${file.LinkFile}`;

      this.fileUrl = previewUrl;
      if (this.fileMine === ".pdf") {
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" +
            encodeURIComponent(previewUrl),
          "_blank",
        );
      } else if (this.fileMine === ".docx") {
        this.isShowFile = true;
        this.docContent = await fetchDoc(previewUrl);
      } else if (this.fileMine === ".xlsx") {
        this.isShowFile = true;
        this.docContent = await fetchXlsxContent(previewUrl);
      } else if ([".png", ".jpg", ".jpeg"].includes(this.fileMine)) {
        this.isShowFile = true;
        this.docContent = `<img src="${previewUrl}" alt="Xem trước" style="max-width:100%" />`;
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.dtp-recurring-search {
  inline-size: min(420px, 100%);
}

.dtp-recurring-card {
  border-radius: 12px;
  background: white !important;
}

.dtp-recurring-title {
  font-weight: 650;
  line-height: 1.25;
}

.dtp-recurring-metrics {
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding-inline: 2px;
}

.dtp-recurring-metric {
  display: flex;
  align-items: center;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  gap: 4px;
  padding-block: 8px;
  padding-inline: 6px;
}

.dtp-recurring-metric-value {
  font-weight: 700;
  line-height: 1.1;
}

.dtp-recurring-metric-label {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 12px;
  line-height: 1.2;
}

.dtp-recurring-section {
  margin-block-start: 10px;
}

.dtp-recurring-avatars {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-block-start: 6px;
}

.dtp-empty-state {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.03);
}

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
  margin-block-start: 10px;
}

.dtp-progress-section {
  margin-block-start: 12px;
}

.dtp-section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  gap: 6px;
  margin-block-end: 6px;
}

.dtp-file-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dtp-file-chip {
  max-inline-size: 100%;
}

.dtp-html-box {
  background: rgb(var(--v-theme-background));
  padding-block: 8px;
  padding-block-end: 6px;
  padding-inline: 12px;
  overflow-x: auto;
  max-width: 100%;

  :deep(ul),
  :deep(ol) {
    padding-left: 35px !important;
    margin-top: 8px;
    margin-bottom: 8px;
    list-style-type: disc !important;
  }

  :deep(ol) {
    list-style-type: decimal !important;
  }

  :deep(li) {
    margin-bottom: 4px;
    line-height: 1.6;
  }
}

.dtp-html-box :deep(img) {
  block-size: auto;
  max-inline-size: 100%;
}

.dtp-html-box :deep(pre),
.dtp-html-box :deep(code) {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.dtp-select-all-item {
  font-weight: 600;
}

.dtp-pagination-table {
  background: transparent !important;

  :deep(.v-table__wrapper) {
    display: none;
  }

  :deep(.v-data-table-footer) {
    padding-top: 0;
    padding-bottom: 0;
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>

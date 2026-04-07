<template>
  <VCard>
    <VDialog
      v-model="isShowCreate"
      max-width="500px"
      persistent
    >
      <VCard>
        <VCardTitle>Tạo quy trình mới</VCardTitle>
        <VCardText>
          <VForm ref="form">
            <VTextField
              v-model="createProcedure.ProcedureName"
              label="Tên quy trình(*)"
              placeholder="Nhập trên quy trình"
              required
              class="mb-2"
            />
            <VTextarea
              v-model="createProcedure.Description"
              label="Mô tả"
              placeholder="Nhập mô tả quy trình"
              :rows="2"
            />
            <VAutocomplete
              v-model="createProcedure.TeamLst"
              class="mt-2"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              label="Chọn nhóm liên quan"
              placeholder="Chọn quy trình"
              multiple=""
              filterable
            />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowCreate = false">
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="btCreateProcedure"
          >
            Xác nhận
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isShowUpdate"
      max-width="500px"
      persistent
    >
      <VCard>
        <VCardTitle>Cập nhật quy trình</VCardTitle>
        <VCardText>
          <VForm ref="form">
            <VTextField
              v-model="createProcedure.ProcedureName"
              label="Tên quy trình(*)"
              placeholder="Nhập trên quy trình"
              required
              class="mb-2"
            />
            <VTextarea
              v-model="createProcedure.Description"
              label="Mô tả"
              placeholder="Nhập mô tả quy trình"
              :rows="2"
            />
            <VAutocomplete
              v-model="createProcedure.TeamLst"
              class="mt-2"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              label="Chọn nhóm liên quan"
              placeholder="Chọn quy trình"
              multiple=""
            />
            <!--
              <v-radio-group v-model="createProcedure.Status">
              <v-radio label="Đang hoạt động" :value="1"></v-radio>
              <v-radio label="Dừng hoạt động" :value="0"></v-radio>
              </v-radio-group> 
            -->
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowUpdate = false">
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="btEditProcedure"
          >
            Cập nhật
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isShowConfirmDelete"
      max-width="500px"
      persistent
    >
      <VCard>
        <VCardTitle>Xác nhận xóa</VCardTitle>
        <VCardText> Bạn có chắc chắn muốn xóa quy trình này? </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowConfirmDelete = false">
            Hủy
          </VBtn>
          <VBtn
            color="red"
            @click="confirmDelete"
          >
            Xóa
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VCardTitle class="px-4 py-3">
      <div class="d-flex flex-wrap align-center gap-2">
        <h6 class="text-h6 mb-0 w-100 w-sm-auto">
          DANH SÁCH QUY TRÌNH
        </h6>

        <VSpacer class="d-none d-sm-block" />

        <div class="d-none d-sm-flex align-center gap-2">
          <div style="width: 160px;">
            <VTextField
              v-model="procedureName"
              label="Quy trình"
              hide-details
              density="compact"
              variant="outlined"
            />
          </div>
          <div style="width: 320px;">
            <VAutocomplete
              v-model="teamName"
              label="Nhóm"
              hide-details
              density="compact"
              variant="outlined"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              clearable
            />
          </div>
          <div style="width: 160px;">
            <VTextField
              v-model="employeeName"
              label="Nhân viên"
              hide-details
              density="compact"
              variant="outlined"
            />
          </div>
        </div>

        <div class="d-flex align-center gap-1 mt-2 mt-sm-0">
          <VDialog
            v-model="isShowMobileFilter"
            max-width="500px"
          >
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                color="primary"
                icon="mdi-filter-variant"
                size="small"
                variant="tonal"
                class="d-sm-none"
              />
            </template>
            <VCard>
              <VCardTitle>Bộ lọc tìm kiếm</VCardTitle>
              <VCardText>
                <VRow dense>
                  <VCol cols="12">
                    <VTextField
v-model="procedureName"
                                label="Quy trình"
variant="outlined"
/>
                  </VCol>
                  <VCol cols="12">
                    <VAutocomplete
v-model="teamName"
                                   label="Nhóm"
variant="outlined" :items="teamlst" item-title="TeamName" item-value="TeamID" clearable
/>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
v-model="employeeName"
                                label="Nhân viên"
variant="outlined"
/>
                  </VCol>
                </VRow>
              </VCardText>
              <VCardActions>
                <VSpacer />
                <VBtn
                  color="grey"
                  @click="isShowMobileFilter = false"
                >
                  Đóng
                </VBtn>
                <VBtn
                  color="primary"
                  @click="btSearch"
                >
                  Tìm kiếm
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>

          <VBtn
            color="blue"
            icon="mdi-file-document-multiple"
            size="small"
            class="mx-1"
            variant="tonal"
            @click="btShowCopyProcedure"
          />
          <VBtn
            color="green"
            icon="mdi-playlist-plus"
            size="small"
            variant="flat"
            @click="btShowCreateProcedure"
          />
        </div>
      </div>
    </VCardTitle>
    <VDataTableServer
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="desserts"
      items-per-page-text=""
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-length="dataLength"
      height="calc(100vh - 250px)"
      :loading="loadding"
      :items-per-page="rowspPage"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
      fixed-header
      mobile-breakpoint="md"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
    >
      <template #item.Key="{ item }">
        <div class="d-flex flex-wrap">
          <div class="mr-2 mt-1">
            {{ item.Key }}
          </div>
          
          <div>
            <VTooltip
              text="Xóa"
              location="top"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  color="red"
                  class="mr-1 mb-1"
                  icon="mdi-trash-can"
                  size="x-small"
                  @click="btShowDel(item)"
                />
              </template>
            </VTooltip>

            <VTooltip
              text="Sửa quy trình"
              location="top"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  color="orange"
                  class="mr-1 mb-1"
                  icon="mdi-square-edit-outline"
                  size="x-small"
                  @click="btShowEditProcedure(item)"
                />
              </template>
            </VTooltip>

            <VTooltip
              text="Danh sách Bước"
              location="top"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  color="green"
                  size="x-small"
                  class="mr-1 mb-1"
                  icon="mdi-format-list-numbered"
                  @click="btShowLstPhase(item)"
                />
              </template>
            </VTooltip>

            <VTooltip
              text="Danh sách Form"
              location="top"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  color="blue"
                  size="x-small"
                  class="mr-1 mb-1"
                  icon="mdi-form-select"
                  @click="btShowLstForm(item)"
                />
              </template>
            </VTooltip>
          </div>
        </div>
      </template>

      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status == 1"
          color="blue"
          size="small"
        >
          Mới tạo
        </VChip>
        <VChip
          v-if="item.Status == 2"
          color="orange"
          size="small"
        >
          Chỉnh sửa
        </VChip>
      </template>

      <template #item.CreateName="{ item }">
        <div>{{ item.CreateName }}</div>
        <VChip
          color="green"
          size="x-small"
          class="mt-1"
        >
          {{ item.TimeCreate }}
        </VChip>
      </template>

      <template #item.ProcedureID="{ item }">
        <div class="font-weight-medium">
          {{ item.ProcedureName }}
        </div>
        <VChip
          color="green"
          size="x-small"
          class="mt-1"
        >
          {{ item.ProcedureID }}
        </VChip>
      </template>

      <template #item.TeamLst="{ item }">
        <div
          class="d-flex flex-wrap"
          style="gap: 4px;"
        >
          <VChip
            v-for="tem in item.Data"
            :key="tem.TeamID"
            size="x-small"
            color="blue"
          >
            {{ tem.TeamName }}
          </VChip>
        </div>
      </template>
    </VDataTableServer>
  </VCard>

  <VDialog
    v-model="isShowCopyProcedure"
    max-width="500px"
    persistent
  >
    <VCard>
      <VCardTitle>Nhân bản quy trình</VCardTitle>
      <VCardText>
        <VAutocomplete
          v-model="selectedProcedureToCopy"
          :items="desserts"
          item-title="ProcedureName"
          item-value="ProcedureID"
          label="Chọn quy trình để nhân bản"
          placeholder="Chọn quy trình"
          filterable
          clearable
          hide-details=""
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn @click="isShowCopyProcedure = false">
          Hủy
        </VBtn>
        <VBtn
          color="green"
          @click="btCopyProcedure"
        >
          Nhân bản
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  CopyProcedure,
  CreateProcedure,
  DelProcedure,
  GetProcedureLst,
  UpdateProcedure,
} from "@/api/procedureApi"
import { GetTeamLst } from "@/api/teamApi"
import { formatDateDisplayDDMMYY } from "@/helpers/getTime"

export default {
  data() {
    return {
      // ĐÃ GIỮ NGUYÊN BẢNG HEADERS CỦA BẠN
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 140 }, // Tăng nhẹ width để Desktop không bị chật
        { title: "Quy trình", key: "ProcedureID", sortable: false },
        { title: "Mô tả", key: "Description", sortable: false },
        { title: "Nhóm", key: "TeamLst", sortable: false },
        { title: "Người tạo", key: "CreateName", sortable: false, align: "center" },
      ],
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      search: "",
      dataLength: 0,
      loadding: false,

      createProcedure: {},
      isShowUpdate: false,
      isShowCreate: false,
      procedureLst: [],
      isShowConfirmDelete: false,
      procedureToDelete: null,
      isShowCopyProcedure: false,
      selectedProcedureToCopy: null,
      teamlst: [],
      searchProcedure: "",

      filterTeamID: null,

      procedureName: "",
      teamName: "",
      employeeName: "",
      isShowMobileFilter: false,
    }
  },
  watch: {
    pageNumber(newValue) {
      this.getProcedure()
    },
    rowspPage(newValue) {
      this.getProcedure()
    },
    procedureName() {
      this.getProcedure()
    },
    teamName() {
      this.getProcedure()
    },
    employeeName() {
      this.getProcedure()
    },
    filterTeamID(){
      this.pageNumber = 1
      this.getProcedure()
    },
  },
  created() {
    this.getProcedure()
    this.getTeamLst()
  },
  created() {
    this.getProcedure()
    this.getTeamLst()
  },
  methods: {
    btSearch() {
      this.isShowMobileFilter = false
      this.getProcedure()
    },
    getTeamLst() {
      GetTeamLst({ RowspPage: 10000, PageNumber: 1 }).then(res => {
        if (res.RespCode == 0) {
          this.teamlst = res.Data
        }
      })
    },
    btCopyProcedure() {
      if (this.selectedProcedureToCopy) {
        CopyProcedure({
          Data: this.selectedProcedureToCopy,
        })
          .then(res => {
            if (res.RespCode == 0) {
              this.isShowCopyProcedure = false
              this.getProcedure()
              notify({
                title: "Thành công",
                text: "Nhân bản quy trình thành công",
                type: "success",
              })
            } else {
              notify({
                title: "Lỗi",
                text: res.RespText || "Không thể nhân bản quy trình",
                type: "error",
              })
            }
          })
          .catch(error => {
            notify({
              title: "Lỗi",
              text: "Có lỗi xảy ra khi nhân bản quy trình",
              type: "error",
            })
          })
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng chọn quy trình để nhân bản",
          type: "warning",
        })
      }
    },
    btShowCopyProcedure() {
      this.isShowCopyProcedure = true
      this.selectedProcedureToCopy = null
    },
    btPage(data) {
      this.pageNumber = data
    },
    btRow(data) {
      this.rowspPage = data
    },

    btShowLstForm(data) {
      this.$router.push("/form/" + data.ProcedureID)
    },
    btShowLstPhase(data) {
      this.$router.push("/buoc/" + data.ProcedureID)
    },

    btShowCreateProcedure() {
      this.isShowCreate = true
      this.createProcedure = {}
    },
    btCreateProcedure() {
      if (this.createProcedure.ProcedureName) {
        CreateProcedure({
          ProcedureInfo: {
            ProcedureName: this.createProcedure.ProcedureName,
            Description: this.createProcedure.Description,
          },
          TeamLst: this.createProcedure.TeamLst.join(","),
        }).then(res => {
          if (res.RespCode == 0) {
            this.isShowCreate = false
            this.createProcedure = {}
            this.getProcedure()
            notify({
              title: "Thành công",
              text: "Tạo quy trình mới thành công",
              type: "success",
            })
          }
        })
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng nhập đầy đủ thông tin",
          type: "warning",
        })
      }
    },
    btShowEditProcedure(data) {
      this.isShowUpdate = true
      this.createProcedure = data
    },
    btEditProcedure() {
      if (this.createProcedure.ProcedureName) {
        UpdateProcedure({
          ProcedureInfo: {
            ProcedureID: this.createProcedure.ProcedureID,
            ProcedureName: this.createProcedure.ProcedureName,
            Description: this.createProcedure.Description,
            Status: 1,
          },
          TeamLst: this.createProcedure.TeamLst?.join(","),
        }).then(res => {
          if (res.RespCode == 0) {
            this.isShowUpdate = false
            this.createProcedure = {}
            this.getProcedure()
            notify({
              title: "Thành công",
              text: "Cập nhật quy trình thành công",
              type: "success",
            })
          }
        })
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng nhập đầy đủ thông tin",
          type: "warning",
        })
      }
    },
    btShowDel(data) {
      this.procedureToDelete = data
      this.isShowConfirmDelete = true
    },
    confirmDelete() {
      this.btDelProcedure(this.procedureToDelete)
      this.isShowConfirmDelete = false
      this.procedureToDelete = null
    },
    btDelProcedure(data) {
      DelProcedure({ ProcedureID: data.ProcedureID }).then(res => {
        if (res.RespCode == 0) {
          this.getProcedure()
          notify({
            title: "Thành công",
            text: "Xóa quy trình thành công",
            type: "success",
          })
        }
      })
    },
    getProcedure() {
      this.loadding = true
      var searchText =
        (this.procedureName ?? "") +
        "|" +
        (this.teamName ?? "") +
        "|" +
        (this.employeeName ?? "")
      GetProcedureLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: searchText,
      }).then(res => {
        if (res.RespCode == 0) {
          console.log("search: ", searchText)
          var num = (this.pageNumber - 1) * this.rowspPage
          this.desserts = res.Data.filter(p => p.Status != 0).map(
            (item, index) => {
              return {
                ...item,
                Key: index + 1 + num,
                TimeCreate: formatDateDisplayDDMMYY(item.TimeCreate),
                TeamLst: item.Data.map(item => item.TeamID),
              }
            },
          )
          this.dataLength = res.TotalRows
          this.loadding = false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.groups {
  block-size: calc(100vh - 250px);
  overflow-y: scroll;
  padding-inline-end: 2px;

  &::-webkit-scrollbar-track-piece {
    background: #fff;
  }

  &::-webkit-scrollbar {
    inline-size: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: rgb(var(--v-theme-primary));
  }
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>

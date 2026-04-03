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
              filterable
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

    <VCardTitle class="pr-2 pl-4 pb-0">
      <div
        class="d-flex"
        style="justify-content: space-between"
      >
        <h6 class="text-h6">
          DANH SÁCH QUY TRÌNH
        </h6>
        <div class="d-flex">
          <span style="width: 250px">
            <VTextField
              v-model="searchProcedure"
              label="Tìm kiếm"
            />
          </span>

          <VBtn
            color="blue"
            icon="mdi-file-document-multiple"
            size="small"
            class="mx-1"
            @click="btShowCopyProcedure"
          />
          <VBtn
            color="green"
            icon="mdi-playlist-plus"
            size="small"
            class="mr-1"
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
      @update:itemsPerPage="btRow"
      @update:page="btPage"
    >
      <template #item.Key="{ item }">
        <div class="d-flex">
          <div class="mr-2">
            {{ item.Key }}
          </div>
          <div>
            <!-- Xóa -->
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

            <!-- Sửa -->
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

            <!-- Danh sách phase -->
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

            <!-- Danh sách Form -->
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
        >
          Mới tạo
        </VChip>
        <VChip
          v-if="item.Status == 2"
          color="orange"
        >
          Chỉnh sửa
        </VChip>
      </template>
      <template #item.CreateName="{ item }">
        <div>{{ item.CreateName }}</div>
        <VChip
          color="green"
          size="x-small"
        >
          {{ item.TimeCreate }}
        </VChip>
      </template>
      <template #item.ProcedureID="{ item }">
        <div>{{ item.ProcedureName }}</div>
        <VChip
          color="green"
          size="x-small"
        >
          {{ item.ProcedureID }}
        </VChip>
      </template>
      <template #item.TeamLst="{ item }">
        <VChip
          v-for="tem in item.Data"
          :key="tem.TeamID"
          size="x-small"
          color="blue"
        >
          {{ tem.TeamName }}
        </VChip>
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
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 130 },

        { title: "Quy trình", key: "ProcedureID", sortable: false },

        {
          title: "Mô tả",
          key: "Description",
          sortable: false,
        },
        {
          title: "Nhóm",
          key: "TeamLst",
          sortable: false,
        },

        {
          title: "Người tạo",
          key: "CreateName",
          sortable: false,
          align: "center",
        },
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
    }
  },
  watch: {
    pageNumber(newValue) {
      this.getProcedure()
    },
    rowspPage(newValue) {
      this.getProcedure()
    },
    searchProcedure() {
      this.getProcedure()
    },
  },
  created() {
    this.getProcedure()
    this.getTeamLst()
  },
  methods: {
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
      GetProcedureLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: this.searchProcedure,
      }).then(res => {
        if (res.RespCode == 0) {
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
  overflow-y: scroll;
  height: calc(100vh - 250px);
  padding-right: 2px;
  &::-webkit-scrollbar-track-piece {
    background: #ffffff;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-primary));
    border-radius: 20px;
  }
}
</style>

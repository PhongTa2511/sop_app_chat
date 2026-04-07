<template>
  <VCard>
    <VCardTitle class="text-h6 p-2 pl-4 pr-2 pb-0">
      <div class="d-flex justify-space-between">
        <div>DANH SÁCH NHÓM</div>
        <div class="d-flex flex-wrap">
          <span>
            <VTextField
              v-model="search"
              label="Tìm kiếm"
              class="mx-2"
              variant="outlined"
              hide-details
              density="compact"
              style="width: 250px !important"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </span>

          <VBtn
            color="blue"
            variant="tonal"
            icon="mdi-text-box-plus"
            size="small"
            @click="btShowCreate"
          />
        </div>
      </div>
    </VCardTitle>
    <VDataTableServer
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="desserts"
      :search="search"
      height="calc(100vh - 270px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      @update:itemsPerPage="btRow"
      sort-desc-icon="mdi-menu-down"
      @update:page="btPage"
      fixed-header
    >
      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status > 0"
          color="success"
          size="small"
        >
          Đang dùng
        </VChip>
        <VChip
          v-if="item.Status == 0"
          color="red"
          size="small"
        >
          Xóa
        </VChip>
      </template>
      <template #item.Action="{ item }">
        <VIcon
          color="red"
          size="small"
          @click="btShowDel(item)"
        >
          mdi-delete
        </VIcon>
      </template>
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          size="small"
          @click="btShowUpdate(item)"
        >
          mdi-square-edit-outline
        </VIcon>
      </template>
      <template #item.Procedure="{ item }">
        <VChip
          v-for="(pro, index) in item.Data"
          :key="index"
          color="info"
          size="small"
        >
          {{ pro.ProcedureName }}
        </VChip>
      </template>
    </VDataTableServer>
  </VCard>
  <VDialog
    v-model="isShowCreate"
    persistent
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Thêm nhóm mới
        </h6>
      </VCardTitle>
      <VCardText>
        <VTextField
          v-model="teamInfo.TeamName"
          label="Tên nhóm"
          hide-details=""
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isShowCreate = false"
        >
          Đóng
        </VBtn>
        <VBtn @click="addTeamInfo">
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowDel"
    width="400"
  >
    <VCard>
      <VToolbar
        class="pl-2"
        color="red"
        title="Xóa"
        center
      />
      <VCardText>
        <div class="text-h5 pt-4">
          Có chắc bạn muốn xóa nhóm này không?
        </div>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          color="blue"
          variant="text"
          @click="isShowDel = false"
        >
          Đóng
        </VBtn>
        <VBtn
          variant="text"
          @click="updateTeamInfo"
        >
          Xóa
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowUpdate"
    persistent
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Cập nhật nhóm
        </h6>
      </VCardTitle>
      <VCardText>
        <VTextField
          v-model="updateInfo.TeamName"
          label="Tên nhóm"
          hide-details=""
        />
        <VSelect
          v-model="updateInfo.Data"
          placeholder="Nhóm xử lý"
          density="compact"
          :items="procedureLst"
          item-value="ProcedureID"
          return-object
          item-title="ProcedureName"
          chips
          class="mb-2 mt-2"
          multiple
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isShowUpdate = false"
        >
          Đóng
        </VBtn>
        <VBtn @click="updateItem">
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <Notifications />
</template>

<script>
import { GetProcedureLst } from "@/api/procedureApi"
import { AddTeamInfo, GetTeamLst, UpdateTeamInfo } from "@/api/teamApi"

export default {
  data() {
    return {
      teamInfo: {},
      isShowDel: false,
      isShowCreate: false,
      search: "",
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Tên nhóm", key: "TeamName", sortable: false },
        { title: "Mã nhóm", key: "TeamID", sortable: false },
        { title: "Quy trình", key: "Procedure", sortable: false },

        // { title: "Giá trị 2", key: "ValueName2", sortable: false },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
        { title: "", key: "Action", width: 80 },
      ],
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      itemDel: {},
      totalLength: 0,
      updateInfo: {},
      isShowUpdate: false,
      procedureLst: [],
    }
  },
  watch: {
    pageNumber() {
      this.getTeamLst()
    },
    rowspPage() {
      this.getTeamLst()
    },
    search() {
      this.pageNumber = 1
      this.getTeamLst()
    },
  },
  created() {
    this.getTeamLst()
    this.getProcedureLst()
  },
  methods: {
    btShowCreate() {
      this.isShowCreate = true
    },
    btPage(data) {
      this.pageNumber = data
    },
    btRow(data) {
      this.rowspPage = data
    },
    btShowDel(data) {
      this.itemDel = { ...data }
      this.isShowDel = true
    },
    updateTeamInfo() {
      UpdateTeamInfo({
        Data: {
          ...this.itemDel,
          Status: 0,
        },
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowDel = false
          this.getTeamLst()
          notify({
            type: "success",
            title: "Thành công",
          })
        }
      })
    },
    addTeamInfo() {
      AddTeamInfo({
        Data: this.teamInfo,
      }).then(res => {
        if (res) {
          this.isShowCreate = false
          this.getTeamLst()
          notify({
            type: "success",
            title: "Thành công",
          })
        }
      })
    },
    getProcedureLst() {
      GetProcedureLst({ PageNumber: 1, RowspPage: 10000 }).then(res => {
        if (res.RespCode == 0) {
          this.procedureLst = res.Data
        }
      })
    },
    getTeamLst() {
      GetTeamLst({
        RowspPage: this.rowspPage,
        PageNumber: this.pageNumber,
        Search: this.search,
      }).then(res => {
        if (res) {
          this.desserts = res.Data.map((item, index) => {
            var num = (this.pageNumber - 1) * this.rowspPage
            
            return {
              ...item,
              Key: index + 1 + num,
            }
          })
          this.totalLength = res.TotalRows
        }
      })
    },

    btShowUpdate(item) {
      this.updateInfo = { ...item }
      this.isShowUpdate = true
    },
    updateItem() {
      UpdateTeamInfo({
        TeamInfo: {
          ...this.updateInfo,
          Status: 2,
          Data: this.updateInfo.Data.map(item => {
            return {
              ...item,
              TeamID: this.updateInfo.TeamID,
            }
          }),
        },
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowUpdate = false
          this.getTeamLst()
          notify({
            type: "success",
            title: "Thành công",
          })
        }
      })
    },
  },
}
</script>

<style>
.custom-picker .v-overlay__content {
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 0px);
}
@media screen and (max-width: 598px) {
  .custom-picker .v-overlay__content {
    position: absolute;
    top: calc(50% - 60px);
    left: calc(50% - 125px);
  }
}
</style>

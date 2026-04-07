<template>
  <VCard>
    <VDialog
      v-model="isShowCreateWork"
      max-width="800px"
    >
      <VCard>
        <VCardTitle>Thêm công việc</VCardTitle>
        <VCardText>
          <VForm
            ref="form"
            v-model="valid"
          >
            <VTextField
              v-model="createWork.StepName"
              label="Bước xử lý"
              :disabled="true"
              class="mb-2"
            />

            <VTextField
              v-model="createWork.WorkName"
              label="Tên công việc"
              class="mb-2"
            />

            <VTextarea
              v-model="createWork.WDescription"
              label="Mô tả"
              :rows="2"
            />
            <VRow>
              <VCol :lg="6">
                <span>Cài đặt xử lý</span>
                <VSelect
                  v-model="userWork.ComID"
                  placeholder="Nhóm xử lý"
                  density="compact"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                />
                <VAutocomplete
                  v-model="userWork.UserID"
                  placeholder="Người xử lý"
                  :items="userLstWork"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                />
                <VTextField
                  v-model="userWork.QuotaTime"
                  label="Hạn xử lý"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
                  clearable
                />
              </VCol>
              <VCol :lg="6">
                <span>Cài đặt phê duyệt</span>
                <VSelect
                  v-model="userManager.ComID"
                  placeholder="Nhóm phê duyệt"
                  density="compact"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                />
                <VAutocomplete
                  v-model="userManager.UserID"
                  placeholder="Người phê duyệt"
                  density="compact"
                  :items="userLstMana"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                />
                <VTextField
                  v-model="userManager.QuotaTime"
                  label="Hạn phê duyệt"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
                  clearable
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowCreateWork = false">
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="btCreateWork"
          >
            Xác nhận
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isShowEditWork"
      max-width="800px"
    >
      <VCard>
        <VCardTitle>Chỉnh sửa công việc</VCardTitle>
        <VCardText>
          <VForm ref="editForm">
            <VTextField
              v-model="editWork.WorkName"
              label="Tên công việc"
              class="mb-2"
            />

            <VTextarea
              v-model="editWork.WDescription"
              label="Mô tả"
              :rows="2"
            />

            <VRow>
              <VCol :lg="6">
                <span>Cài đặt xử lý</span>
                <VSelect
                  v-model="userWork.ComID"
                  placeholder="Nhóm xử lý"
                  density="compact"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                />
                <VAutocomplete
                  v-model="userWork.UserID"
                  placeholder="Người xử lý"
                  :items="userLstWork"
                  item-value="UserName"
                  :item-title="item => `${item.FullName} (${item.UserName})`"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                  multiple
                />
                <VTextField
                  v-model="userWork.QuotaTime"
                  label="Hạn xử lý"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
                  clearable
                />
              </VCol>
              <VCol :lg="6">
                <span>Cài đặt phê duyệt</span>
                <VSelect
                  v-model="userManager.ComID"
                  placeholder="Nhóm phê duyệt"
                  density="compact"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                />
                <VAutocomplete
                  v-model="userManager.UserID"
                  placeholder="Người phê duyệt"
                  density="compact"
                  :items="userLstMana"
                  item-value="UserName"
                  :item-title="item => `${item.FullName} (${item.UserName})`"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                />
                <VTextField
                  v-model="userManager.QuotaTime"
                  label="Hạn phê duyệt"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
                  clearable
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowEditWork = false">
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="btEditWork"
          >
            Xác nhận
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isShowConfirmDelete"
      max-width="400px"
    >
      <VCard>
        <VCardTitle>Xác nhận xóa</VCardTitle>
        <VCardText>Bạn có chắc chắn muốn xóa công việc này?</VCardText>
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

    <VCardTitle>
      <div class="d-flex justify-space-between">
        <h6 class="text-h5 py-2">
          <div style="white-space: normal">
            <VChip color="blue">
              Bước {{ phaseInfo.StepOrder }}
            </VChip>
            {{ phaseInfo.StepName }}
          </div>
          <div
            class="text-subtitle-1 py-1 px-2"
            style="white-space: normal"
          >
            Mô tả: {{ phaseInfo.Description }}
          </div>
        </h6>
        <div class="d-flex">
          <VBtn
            color="green"
            icon="mdi-playlist-plus"
            style="height: 42px"
            class="mr-1"
            @click="btShowCreateWork"
          />
        </div>
      </div>
    </VCardTitle>

    <VDataTable
      :headers="headers"
      :items="workLst"
      height="calc(100vh - 260px)"
      :loading="loadding"
    >
      <template #loading>
        <VSkeletonLoader type="table-row@5" />
      </template>
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          @click="btShowEditWork(item)"
        >
          mdi-square-edit-outline
        </VIcon>
        <VIcon
          color="red"
          @click="delWorkDefine(item)"
        >
          mdi-delete
        </VIcon>
      </template>
      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status == 1"
          color="green"
        >
          Hoạt động
        </VChip>
      </template>
      <template #item.Form="{ item }">
        <VIcon
          color="blue"
          size="small"
          class="me-2"
          @click="btShowLstForm(item)"
        >
          mdi-form-select
        </VIcon>
      </template>
    </VDataTable>
  </VCard>
</template>

<script>
import {
  CreateWorkDefine,
  DelWorkDefine,
  GetStepByID,
  GetWorkDefineLst,
  UpdateWorkDefine,
} from "@/api/procedureApi"
import { GetTeamLstProID } from "@/api/teamApi"
import { GetUserLstByTeamID } from "@/api/user"

export default {
  data() {
    return {
      headers: [
        {
          title: "STT",
          key: "Key",
          align: "center",
          width: 120,
          sortable: false,
        },
        { title: "Form", key: "Form", sortable: false },
        { title: "Mã", key: "WorkID", sortable: false },
        { title: "Công việc", key: "WorkName", sortable: false },
        { title: "Mô tả", key: "WDescription", sortable: false },
        {
          title: "BP xử lý",
          key: "GroupWork",
          align: "center",
          sortable: false,
        },
        {
          title: "BP phê duyệt",
          key: "GroupManager",
          align: "center",
          sortable: false,
        },
        { title: "Trạng thái", key: "Status", sortable: false },
      ],
      isShowCreateWork: false,
      isShowEditWork: false,
      phaseInfo: {},
      createWork: {},
      updateWork: {},
      workLst: [],
      userLstWork: [],
      userLstMana: [],
      groupLst: [],
      userWork: {},
      userManager: {},
      loadding: false,
      editWork: {},
      isShowConfirmDelete: false,
      workToDelete: null,
    }
  },
  watch: {
    "userWork.ComID"(value) {
      if (value) {
        var data = this.groupLst.find(p => p.TeamID == value)
        if (data) {
          this.userLstWork = this.groupLst.find(
            p => p.TeamID == value,
          ).UserLst
        }
      }
    },
    "userManager.ComID"(value) {
      if (value) {
        var data = this.groupLst.find(p => p.TeamID == value)
        if (data) {
          this.userLstMana = this.groupLst.find(
            p => p.TeamID == value,
          ).UserLst
        }
      }
    },
  },

  created() {
    this.getStepByID()
  },

  methods: {
    getUserLstByTeamIDWork(teamID) {
      GetUserLstByTeamID({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
        TeamID: teamID,
      }).then(res => {
        this.userLstWork = res.Data
      })
    },
    getUserLstByTeamIDMana(teamID) {
      GetUserLstByTeamID({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
        TeamID: teamID,
      }).then(res => {
        this.userLstMana = res.Data
      })
    },

    btShowLstForm(data) {
      this.$router.push(
        "/form2/" + data.ProcedureID + "/" + data.StepID + "/" + data.WorkID,
      )
    },
    btShowCreateWork() {
      this.isShowCreateWork = true
      this.createWork.ProcedureID = this.phaseInfo.ProcedureID
      this.createWork.StepID = this.phaseInfo.StepID
      this.createWork.StepName = this.phaseInfo.StepName
      this.getWorkDefineLst()
    },
    btCreateWork() {
      var reqAssign = []
      if (this.userWork.ComID && this.userWork.QuotaTime) {
        reqAssign.push({ ...this.userWork, UserRole: "Xử lý" })
      }
      if (this.userManager.ComID && this.userManager.QuotaTime) {
        reqAssign.push({ ...this.userManager, UserRole: "Phê duyệt" })
      }

      CreateWorkDefine({
        WorkInfo: {
          ...this.createWork,
        },
        AssignLst: reqAssign,
      }).then(res => {
        if (res.RespCode == 0) {
          this.getWorkDefineLst()
          this.isShowCreateWork = false

          notify({
            title: "Thành công",
            text: "Tạo đầu việc mới thành công",
            type: "success",
          })
        }
      })
    },
    btShowEditWork(item) {
      this.isShowEditWork = true // Show the edit dialog
      this.editWork = { ...item } // Populate editWork with the selected item's data
      var lstUser = item.Data.filter(p => p.UserRole == "Xử lý")
      if (lstUser.length > 0) {
        this.userWork = {
          ...lstUser[0],
          UserID: lstUser.map(item => item.UserID).filter(p => p),
        }
      } else {
        this.userWork = {}
      }

      // console.log("user", this.userWork);
      if (this.userWork.ComID != 0) {
        this.getUserLstByTeamIDWork(this.userWork.ComID)
      } else {
        this.userWork.ComID = null
      }
      this.userManager = item.Data.find(p => p.UserRole == "Phê duyệt") ?? {}
      if (this.userManager.ComID != 0) {
        this.getUserLstByTeamIDMana(this.userManager.ComID)
      } else {
        this.userManager.ComID = null
      }
    },
    btUpdateWork() {
      UpdateWorkDefine({
        WorkInfo: {
          ...this.updateWork,
        },
      }).then(res => {
        if (res.RespCode == 0) {
          this.updateWork = {}
          this.isShowUpdateWork = false
          notify({
            title: "Thành công",
            text: "Cập nhật đầu việc thành công",
            type: "success",
          })
        }
      })
    },

    getWorkDefineLst() {
      GetWorkDefineLst({
        PageNumber: 1,
        RowspPage: 1000,
        Search: "",
        StepID: this.phaseInfo.StepID,
      }).then(res => {
        this.workLst = res.Data.map((item, index) => {
          var checkWork = item.Data.find(p => p.UserRole == "Xử lý")
          var groupWork = checkWork ? checkWork.GroupEmploy : ""
          var checkManager = item.Data.find(p => p.UserRole == "Phê duyệt")
          var groupManager = checkManager ? checkManager.GroupEmploy : ""

          return {
            ...item,
            Key: index + 1,
            GroupWork: groupWork,
            GroupManager: groupManager,
          }
        })
        this.loadding = false
      })
    },

    getWorkType() {
      GetTeamLstProID({
        ProcedureID: this.phaseInfo.ProcedureID,
      }).then(res => {
        if (res.RespCode == 0) {
          this.groupLst = res.Data
        }
      })
    },

    getStepByID() {
      this.loadding = true
      GetStepByID({ StepID: this.$route.params.id }).then(res => {
        this.phaseInfo = res.Data
        this.getWorkDefineLst()
        this.getWorkType()
      })
    },

    btEditWork() {
      const reqAssign = []
      if (this.userWork.UserID && this.userWork.UserID.length > 0) {
        for (var item of this.userWork.UserID) {
          reqAssign.push({
            ...this.userWork,
            UserRole: "Xử lý",
            UserID: item,
          })
        }
      } else {
        reqAssign.push({ ...this.userWork, UserID: null, UserRole: "Xử lý" })
      }

      // reqAssign.push({ ...this.userWork, UserRole: "Xử lý" });
      reqAssign.push({ ...this.userManager, UserRole: "Phê duyệt" })
      UpdateWorkDefine({
        WorkInfo: {
          ...this.editWork,
          Data: [],
        },
        AssignLst: reqAssign,
      }).then(res => {
        if (res.RespCode == 0) {
          this.getWorkDefineLst() // Refresh the work list
          this.isShowEditWork = false // Close the edit dialog

          notify({
            title: "Thành công",
            text: "Cập nhật công việc thành công",
            type: "success",
          })
        } else {
          notify({
            title: "Thất bại",
            text: "Cập nhật công việc thất bại",
            type: "error",
          })
        }
      })
    },
    delWorkDefine(data) {
      this.workToDelete = data // Lưu công việc cần xóa
      this.isShowConfirmDelete = true // Hiển thị dialog xác nhận
    },
    confirmDelete() {
      DelWorkDefine({
        WorkID: this.workToDelete.WorkID,
      }).then(res => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật công việc thành công",
            type: "success",
          })
          this.getWorkDefineLst()
        }
      })
      this.isShowConfirmDelete = false // Đóng dialog xác nhận
    },
  },
}
</script>

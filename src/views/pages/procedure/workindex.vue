<template>
  <v-card>
    <v-dialog v-model="isShowCreateWork" max-width="800px">
      <v-card>
        <v-card-title>Thêm công việc</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="createWork.StepName"
              label="Bước xử lý"
              :disabled="true"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="createWork.WorkName"
              label="Tên công việc"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="createWork.WDescription"
              label="Mô tả"
              :rows="2"
            ></v-textarea>
            <v-row>
              <v-col :lg="6">
                <span>Cài đặt xử lý</span>
                <v-select
                  placeholder="Nhóm xử lý"
                  density="compact"
                  v-model="userWork.ComID"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                ></v-select>
                <v-autocomplete
                  placeholder="Người xử lý"
                  v-model="userWork.UserID"
                  :items="userLstWork"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                ></v-autocomplete>
                <v-text-field
                  v-model="userWork.QuotaTime"
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
                  placeholder="Nhóm phê duyệt"
                  density="compact"
                  v-model="userManager.ComID"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                ></v-select>
                <v-autocomplete
                  placeholder="Người phê duyệt"
                  density="compact"
                  v-model="userManager.UserID"
                  :items="userLstMana"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                ></v-autocomplete>
                <v-text-field
                  v-model="userManager.QuotaTime"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowCreateWork = false">Cancel</v-btn>
          <v-btn color="green" @click="btCreateWork">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isShowEditWork" max-width="800px">
      <v-card>
        <v-card-title>Chỉnh sửa công việc</v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <v-text-field
              v-model="editWork.WorkName"
              label="Tên công việc"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="editWork.WDescription"
              label="Mô tả"
              :rows="2"
            ></v-textarea>

            <v-row>
              <v-col :lg="6">
                <span>Cài đặt xử lý</span>
                <v-select
                  placeholder="Nhóm xử lý"
                  density="compact"
                  v-model="userWork.ComID"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                ></v-select>
                <v-autocomplete
                  placeholder="Người xử lý"
                  v-model="userWork.UserID"
                  :items="userLstWork"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                ></v-autocomplete>
                <v-text-field
                  v-model="userWork.QuotaTime"
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
                  placeholder="Nhóm phê duyệt"
                  density="compact"
                  v-model="userManager.ComID"
                  :items="groupLst"
                  item-value="TeamID"
                  item-title="TeamName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                  clearable
                ></v-select>
                <v-autocomplete
                  placeholder="Người phê duyệt"
                  density="compact"
                  v-model="userManager.UserID"
                  :items="userLstMana"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                  clearable
                  hide-details
                ></v-autocomplete>
                <v-text-field
                  v-model="userManager.QuotaTime"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowEditWork = false">Cancel</v-btn>
          <v-btn color="green" @click="btEditWork">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title>
      <div class="d-flex justify-space-between">
        <h6 class="text-h5 py-2">
          <div style="white-space: normal">
            <v-chip color="blue"> Bước {{ phaseInfo.StepOrder }} </v-chip>
            {{ phaseInfo.StepName }}
          </div>
          <div class="text-subtitle-1 py-1 px-2" style="white-space: normal">
            Mô tả: {{ phaseInfo.Description }}
          </div>
        </h6>
        <div class="d-flex">
          <v-btn
            color="green"
            icon="mdi-playlist-plus"
            style="height: 42px"
            class="mr-1"
            @click="btShowCreateWork"
          ></v-btn>
        </div>
      </div>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="workLst"
      height="calc(100vh - 300px)"
      :loading="loadding"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon color="orange" @click="btShowEditWork(item)"
          >mdi-square-edit-outline</v-icon
        >
        <v-icon color="red" @click="delWorkDefine(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="green" v-if="item.Status == 1">Hoạt động</v-chip>
      </template>
      <template v-slot:item.Form="{ item }">
        <v-icon
          color="blue"
          size="small"
          class="me-2"
          @click="btShowLstForm(item)"
          >mdi-form-select
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {
  GetStepByID,
  CreateWorkDefine,
  UpdateWorkDefine,
  DelWorkDefine,
  GetWorkDefineLst,
} from "@/api/procedureApi";
import { GetDefaultValue } from "@/api/default";
import { GetUserLstByTeamID } from "@/api/user";
import { GetTeamLstProID } from "@/api/teamApi";
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
    };
  },
  watch: {
    "userWork.ComID"(value) {
      if (value) {
        var data = this.groupLst.find((p) => p.TeamID == value);
        if (data) {
          this.userLstWork = this.groupLst.find(
            (p) => p.TeamID == value
          ).UserLst;
        }
      }
    },
    "userManager.ComID"(value) {
      if (value) {
        var data = this.groupLst.find((p) => p.TeamID == value);
        if (data) {
          this.userLstMana = this.groupLst.find(
            (p) => p.TeamID == value
          ).UserLst;
        }
      }
    },
  },

  methods: {
    getUserLstByTeamIDWork(teamID) {
      GetUserLstByTeamID({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
        TeamID: teamID,
      }).then((res) => {
        this.userLstWork = res.Data;
      });
    },
    getUserLstByTeamIDMana(teamID) {
      GetUserLstByTeamID({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
        TeamID: teamID,
      }).then((res) => {
        this.userLstMana = res.Data;
      });
    },

    btShowLstForm(data) {
      this.$router.push(
        "/form2/" + data.ProcedureID + "/" + data.StepID + "/" + data.WorkID
      );
    },
    btShowCreateWork() {
      this.isShowCreateWork = true;
      this.createWork.ProcedureID = this.phaseInfo.ProcedureID;
      this.createWork.StepID = this.phaseInfo.StepID;
      this.createWork.StepName = this.phaseInfo.StepName;
      this.getWorkDefineLst();
    },
    btCreateWork() {
      var reqAssign = [];
      if (this.userWork.ComID && this.userWork.QuotaTime) {
        reqAssign.push({ ...this.userWork, UserRole: "Xử lý" });
      }
      if (this.userManager.ComID && this.userManager.QuotaTime) {
        reqAssign.push({ ...this.userManager, UserRole: "Phê duyệt" });
      }

      CreateWorkDefine({
        WorkInfo: {
          ...this.createWork,
        },
        AssignLst: reqAssign,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getWorkDefineLst();
          this.isShowCreateWork = false;

          notify({
            title: "Thành công",
            text: "Tạo đầu việc mới thành công",
            type: "success",
          });
        }
      });
    },
    btShowEditWork(item) {
      this.isShowEditWork = true; // Show the edit dialog
      this.editWork = { ...item }; // Populate editWork with the selected item's data

      this.userWork = item.Data.find((p) => p.UserRole == "Xử lý") ?? {};
      if (this.userWork.ComID != 0) {
        this.getUserLstByTeamIDWork(this.userWork.ComID);
      } else {
        this.userWork.ComID = null;
      }
      this.userManager = item.Data.find((p) => p.UserRole == "Phê duyệt") ?? {};
      if (this.userManager.ComID != 0) {
        this.getUserLstByTeamIDWork(this.userManager.ComID);
      } else {
        this.userManager.ComID = null;
      }
    },
    btUpdateWork() {
      UpdateWorkDefine({
        WorkInfo: {
          ...this.updateWork,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.updateWork = {};
          this.isShowUpdateWork = false;
          notify({
            title: "Thành công",
            text: "Cập nhật đầu việc thành công",
            type: "success",
          });
        }
      });
    },

    getWorkDefineLst() {
      GetWorkDefineLst({
        PageNumber: 1,
        RowspPage: 1000,
        Search: "",
        StepID: this.phaseInfo.StepID,
      }).then((res) => {
        this.workLst = res.Data.map((item, index) => {
          var checkWork = item.Data.find((p) => p.UserRole == "Xử lý");
          var groupWork = checkWork ? checkWork.GroupEmploy : "";
          var checkManager = item.Data.find((p) => p.UserRole == "Phê duyệt");
          var groupManager = checkManager ? checkManager.GroupEmploy : "";

          return {
            ...item,
            Key: index + 1,
            GroupWork: groupWork,
            GroupManager: groupManager,
          };
        });
        this.loadding = false;
      });
    },

    getWorkType() {
      GetTeamLstProID({
        ProcedureID: this.phaseInfo.ProcedureID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst = res.Data;
        }
      });
    },

    getStepByID() {
      this.loadding = true;
      GetStepByID({ StepID: this.$route.params.id }).then((res) => {
        this.phaseInfo = res.Data;
        this.getWorkDefineLst();
        this.getWorkType();
      });
    },

    btEditWork() {
      // Prepare the request payload
      const reqAssign = [];
      reqAssign.push({ ...this.userWork, UserRole: "Xử lý" });
      reqAssign.push({ ...this.userManager, UserRole: "Phê duyệt" });

      // Call the UpdateWorkDefine API
      UpdateWorkDefine({
        WorkInfo: {
          ...this.editWork,
        },
        AssignLst: reqAssign,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getWorkDefineLst(); // Refresh the work list
          this.isShowEditWork = false; // Close the edit dialog

          notify({
            title: "Thành công",
            text: "Cập nhật công việc thành công",
            type: "success",
          });
        } else {
          notify({
            title: "Thất bại",
            text: "Cập nhật công việc thất bại",
            type: "error",
          });
        }
      });
    },
    delWorkDefine(data) {
      DelWorkDefine({
        WorkID: data.WorkID,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật công việc thành công",
            type: "success",
          });
          this.getWorkDefineLst();
        }
      });
    },
  },

  created() {
    this.getStepByID();
  },
};
</script>

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
                  v-model="userWork.GroupEmploy"
                  :items="groupLst"
                  item-value="ValueName"
                  item-title="ValueName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                ></v-select>
                <v-select
                  placeholder="Người xử lý"
                  v-model="userWork.UserID"
                  :items="userLst"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                ></v-select>
                <v-text-field
                  v-model="userWork.QuotaTime"
                  label="Hạn xử lý"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
                ></v-text-field>
              </v-col>
              <v-col :lg="6">
                <span>Cài đặt phê duyệt</span>
                <v-select
                  placeholder="Nhóm phê duyệt"
                  density="compact"
                  v-model="userManager.GroupEmploy"
                  :items="groupLst"
                  item-value="ValueName"
                  item-title="ValueName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                ></v-select>
                <v-select
                  placeholder="Người phê duyệt"
                  density="compact"
                  v-model="userManager.UserID"
                  :items="userLst"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                ></v-select>
                <v-text-field
                  v-model="userManager.QuotaTime"
                  label="Hạn phê duyệt"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
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
                  v-model="userWork.GroupEmploy"
                  :items="groupLst"
                  item-value="ValueName"
                  item-title="ValueName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                ></v-select>
                <v-select
                  placeholder="Người xử lý"
                  v-model="userWork.UserID"
                  :items="userLst"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                ></v-select>
                <v-text-field
                  v-model="userWork.QuotaTime"
                  label="Hạn xử lý"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
                ></v-text-field>
              </v-col>
              <v-col :lg="6">
                <span>Cài đặt phê duyệt</span>
                <v-select
                  placeholder="Nhóm phê duyệt"
                  density="compact"
                  v-model="userManager.GroupEmploy"
                  :items="groupLst"
                  item-value="ValueName"
                  item-title="ValueName"
                  chips
                  style="max-width: 280px"
                  class="mb-2 mt-2"
                ></v-select>
                <v-select
                  placeholder="Người phê duyệt"
                  density="compact"
                  v-model="userManager.UserID"
                  :items="userLst"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mb-2"
                ></v-select>
                <v-text-field
                  v-model="userManager.QuotaTime"
                  label="Hạn phê duyệt"
                  type="number"
                  :min="1"
                  :max="1000"
                  suffix="Ngày"
                  style="max-width: 280px"
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
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h5 py-2">
          <div>
            <v-chip color="blue"> Bước {{ phaseInfo.StepOrder }} </v-chip>
            {{ phaseInfo.StepName }}
          </div>
          <div class="text-h6">Mô tả: {{ phaseInfo.Description }}</div>
        </h6>
        <div class="d-flex">
          <v-btn
            color="success"
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
        <v-icon color="warning" @click="btShowEditWork(item)"
          >mdi-square-edit-outline</v-icon
        >
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="success" v-if="item.Status == 1">Hoạt động</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {
  GetStepByID,
  CreateWorkDefine,
  UpdateWorkDefine,
  GetWorkDefineLst,
} from "@/api/procedureApi";
import { GetDefaultValue } from "@/api/default";
import { GetUserLstAll } from "@/api/user";
export default {
  data() {
    return {
      headers: [
        {
          title: "STT",
          key: "Key",
          align: "center",
          width: 80,
          sortable: false,
        },
        { title: "Mã", key: "WorkID" },
        { title: "Công việc", key: "WorkName" },
        { title: "Mô tả", key: "WDescription" },
        { title: "BP xử lý", key: "GroupWork" },
        { title: "BP phê duyệt", key: "GroupManager" },
        { title: "Trạng thái", key: "Status" },
      ],
      isShowCreateWork: false,
      isShowEditWork: false,
      phaseInfo: {},
      createWork: {},
      updateWork: {},
      workLst: [],
      userLst: [],
      groupLst: [],
      userWork: {},
      userManager: {},
      loadding: false,
      editWork: {},
    };
  },

  methods: {
    getUserLstAll() {
      GetUserLstAll({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
      }).then((res) => {
        this.userLst = res.Data;
      });
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
      if (this.userWork.GroupEmploy && this.userWork.QuotaTime) {
        reqAssign.push({ ...this.userWork, UserRole: "Xử lý" });
      }
      if (this.userManager.GroupEmploy && this.userManager.QuotaTime) {
        reqAssign.push({ ...this.userWork, UserRole: "Phê duyệt" });
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

          this.$notify({
            title: "Thành công",
            message: "Tạo đầu việc mới thành công",
            type: "success",
          });
        }
      });
    },
    btShowEditWork(item) {
      this.isShowEditWork = true; // Show the edit dialog
      this.editWork = { ...item }; // Populate editWork with the selected item's data

      this.userWork = item.Data.find((p) => p.UserRole == "Xử lý") ?? {};
      this.userManager = item.Data.find((p) => p.UserRole == "Phê duyệt") ?? {};
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
          this.$notify({
            title: "Thành công",
            message: "Cập nhật đầu việc thành công",
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
            GroupMânger: groupManager,
          };
        });
        this.loadding = false;
      });
    },

    getWorkType() {
      GetDefaultValue({ Table: "Nhóm nhân viên" }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst = res.DefaultValueLst;
        }
      });
    },

    getStepByID() {
      this.loadding = true;
      GetStepByID({ StepID: this.$route.params.id }).then((res) => {
        this.phaseInfo = res.Data;
        this.getWorkDefineLst();
      });
    },

    btEditWork() {
      // Prepare the request payload
      const reqAssign = [];
      if (this.userWork.GroupEmploy && this.userWork.QuotaTime) {
        reqAssign.push({ ...this.userWork, UserRole: "Xử lý" });
      }
      if (this.userManager.GroupEmploy && this.userManager.QuotaTime) {
        reqAssign.push({ ...this.userManager, UserRole: "Phê duyệt" });
      }

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

          this.$notify({
            title: "Thành công",
            message: "Cập nhật công việc thành công",
            type: "success",
          });
        } else {
          this.$notify({
            title: "Thất bại",
            message: "Cập nhật công việc thất bại",
            type: "error",
          });
        }
      });
    },
  },

  created() {
    this.getStepByID();
    this.getWorkType();
    this.getUserLstAll();
  },
};
</script>

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
              v-model="createWork.Description"
              label="Mô tả"
              :rows="2"
            ></v-textarea>
            <v-row>
              <v-col :lg="6">
                <span>Cài đặt xử lý</span>
                <v-select
                  placeholder="Nhóm xử lý"
                  density="compact"
                  v-model="userWork.GroupName"
                  :items="groupLst"
                  item-value="ValueName"
                  item-title="ValueName"
                  chips
                  style="max-width: 280px"
                  class="mr-2 mt-2"
                ></v-select>
                <v-select
                  placeholder="Người xử lý"
                  v-model="userWork.UserName"
                  :items="userLst"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mr-2 elevent-1"
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
                  v-model="userManager.GroupName"
                  :items="groupLst"
                  item-value="ValueName"
                  item-title="ValueName"
                  chips
                  style="max-width: 280px"
                  class="mr-2 mt-2"
                ></v-select>
                <v-select
                  placeholder="Người phê duyệt"
                  density="compact"
                  v-model="userManager.UserName"
                  :items="userLst"
                  item-value="UserName"
                  item-title="FullName"
                  chips
                  style="max-width: 280px"
                  class="mr-2"
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
          <v-form v-model="validEdit" ref="editForm">
            <v-row>
              <v-col cols="10">
                <v-text-field
                  v-model="editWork.StepName"
                  label="Tên công việc"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="editWork.StepOrder"
                  label="Thứ tự"
                  type="number"
                  :min="1"
                  :max="1000"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-textarea
              v-model="editWork.Description"
              label="Mô tả"
            ></v-textarea>

            <span>Khi bị từ chối</span>
            <v-row>
              <v-col cols="6">
                <v-radio-group v-model="createWork.IsNextStep">
                  <v-radio label="Chọn công việc quay lại" :value="2"></v-radio>
                  <v-radio label="Làm lại công việc này" :value="1"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="6" v-if="createWork.IsNextStep == 2">
                <v-select
                  v-model="createWork.StepBack"
                  :items="optionConfirmLst"
                  item-text="label"
                  item-value="value"
                  label="Chọn công việc quay lại khi bị từ chối"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowEditWork = false">Cancel</v-btn>
          <v-btn color="success" @click="btEditWork">Xác nhận</v-btn>
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
    >
      <template v-slot:item.Key="{ item }">
        {{ item.raw.Key }}
        <v-icon color="warning" @click="btShowEditWork(item)"
          >mdi-square-edit-outline</v-icon
        >
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="success" @click="btSeeInfoWork(item)"
          >mdi-format-list-numbered</v-icon
        >
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="success" v-if="item.raw.Status == 1">Hoạt động</v-chip>
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
        { title: "Action", key: "action", align: "center", sortable: false },
        { title: "Mã", key: "StepID" },
        { title: "Bước", key: "StepName" },
        { title: "Quay lại", key: "StepBack" },
        { title: "Thứ tự", key: "StepOrder", align: "center" },
        { title: "Mô tả", key: "Description" },
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
      CreateWorkDefine({
        WorkInfo: {
          ...this.createWork,
        },
        AssignLst: [],
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
    btShowUpdateWork(data) {
      this.isShowUpdateWork = true;
      this.updateWork = data;
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
        this.workLst = res.Data.filter((w) => w.Status != 0).map(
          (item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          }
        );
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
      GetStepByID({ StepID: this.$route.params.id }).then((res) => {
        this.phaseInfo = res.Data;
        this.getWorkDefineLst();
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

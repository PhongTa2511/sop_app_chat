<template>
  <v-card>
    <v-dialog v-model="isShowCreatePhase" max-width="800px">
      <v-card>
        <v-card-title>Thêm bước</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="createPhase.ProcedureName"
              label="Quy trình xử lý"
              :disabled="true"
              class="mb-2"
            ></v-text-field>
            <v-row>
              <v-col lg="10">
                <v-text-field
                  v-model="createPhase.StepName"
                  label="Tên bước"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col lg="2">
                <v-text-field
                  v-model="createPhase.StepOrder"
                  label="Thứ tự"
                  type="number"
                  :min="1"
                  :max="1000"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-textarea
              v-model="createPhase.Description"
              label="Mô tả"
              class="mb-2"
            ></v-textarea>

            <v-row>
              <v-col cols="6">
                <span>Khi bị từ chối</span>
                <v-select
                  v-model="createPhase.StepBack"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước khi bị từ chối"
                  class="mt-2"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="6">
                <span>Khi tiếp tục</span>
                <v-select
                  v-model="createPhase.StepNext"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước tiếp theo"
                  class="mt-2"
                  clearable
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowCreatePhase = false">Cancel</v-btn>
          <v-btn color="green" @click="btCreatePhase">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isShowEditPhase" max-width="800px">
      <v-card>
        <v-card-title>Chỉnh sửa bước</v-card-title>
        <v-card-text>
          <v-form v-model="validEdit" ref="editForm">
            <v-row>
              <v-col lg="10">
                <v-text-field
                  v-model="editPhase.StepName"
                  label="Tên bước"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col lg="2">
                <v-text-field
                  v-model="editPhase.StepOrder"
                  label="Thứ tự"
                  type="number"
                  :min="1"
                  :max="1000"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-textarea
              v-model="editPhase.Description"
              label="Mô tả"
              class="mb-2"
            ></v-textarea>
            <v-row>
              <v-col cols="6">
                <span>Khi bị từ chối</span>
                <v-select
                  v-model="editPhase.StepBack"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước khi bị từ chối"
                  class="mt-2"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="6">
                <span>Khi tiếp tục</span>
                <v-select
                  v-model="editPhase.StepNext"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước tiếp theo"
                  class="mt-2"
                  clearable
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowEditPhase = false">Cancel</v-btn>
          <v-btn color="green" @click="btEditPhase">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h5 py-2">
          <div>Quy trình: {{ procedureInfo.ProcedureName }}</div>
          <div class="text-subtitle-1 py-1 px-2" style="white-space: normal">
            Mô tả: {{ procedureInfo.Description }}
          </div>
        </h6>
        <div class="d-flex">
          <v-btn
            color="green"
            icon="mdi-playlist-plus"
            size="small"
            class="mr-1"
            @click="btShowCreatePhase"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-data-table :headers="headers" :items="phaseLst">
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon color="orange" @click="btShowEditPhase(item)"
          >mdi-square-edit-outline</v-icon
        >
        <v-icon color="red" class="me-2" @click="btShowDel(item)"
          >mdi-trash-can
        </v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="green" @click="btPushToWork(item)"
          >mdi-format-list-numbered</v-icon
        >
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="green" v-if="item.Status == 1">Hoạt động</v-chip>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="isShowDel" width="400">
    <v-card>
      <v-toolbar class="pl-1" color="red" title="Xóa bước" center></v-toolbar>
      <v-card-text>
        <div class="text-h5 pt-4">Có chắc bạn muốn xóa bước này không?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="blue" variant="text" @click="isShowDel = false"
          >Đóng</v-btn
        >
        <v-btn color="red" variant="text" @click="btDelStep()">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  CreateStep,
  DelStep,
  GetProcedureByID,
  GetStepByProcedure,
  UpdateStep,
} from "@/api/procedureApi";
// import { CreateStep, GetStepByProcedure } from "@/api/phaseApi";
export default {
  data() {
    return {
      input: "",
      phaseLst: [],
      procedureInfo: {},
      createPhase: {
        Status: 1,
        StepOrder: 1,
      },
      isShowCreatePhase: false,
      isShowDel: false,
      valid: false,
      headers: [
        {
          title: "STT",
          key: "Key",
          align: "center",
          width: 120,
          sortable: false,
        },
        { title: "Action", key: "action", align: "center", sortable: false },
        { title: "Mã", key: "StepID" },
        { title: "Bước", key: "StepName" },
        { title: "Từ chối", key: "StepBack" },
        { title: "Tiếp tục", key: "StepNext" },
        { title: "Thứ tự", key: "StepOrder", align: "center", sortable: false },
        { title: "Mô tả", key: "Description" },
        { title: "Trạng thái", key: "Status" },
      ],
      isShowEditPhase: false,
      validEdit: false,
      editPhase: {
        StepName: "",
        Description: "",
        StepOrder: 1,
        // Add other fields as necessary
      },
      itemDel: {},
    };
  },
  methods: {
    btShowDel(data) {
      this.itemDel = data;
      this.isShowDel = true;
    },
    btDelStep() {
      DelStep({
        StepID: this.itemDel.StepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Xóa thành thành công",
          });
          this.getProcedureByID();
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.RespText,
          });
        }
      });
    },
    getProcedureByID() {
      GetProcedureByID({ ProcedureID: this.$route.params.id }).then((res) => {
        if (res.RespCode == 0) {
          this.procedureInfo = res.Data;
        }
      });
    },
    btCreatePhase() {
      if (
        this.createPhase.ProcedureID &&
        this.createPhase.StepName &&
        this.createPhase.Description
      ) {
        CreateStep({
          StepInfo: {
            ...this.createPhase,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getPhaseLst();
            this.isShowCreatePhase = false;
            (this.createPhase = {
              Status: 1,
              StepOrder: 1,
            }),
              notify({
                title: "Thành công",
                text: "Thêm Bước thành công",
                type: "success",
              });
          }
        });
      } else {
        notify({
          title: "Lỗi",
          text: res.RespText,
          type: "error",
        });
      }
    },
    btShowCreatePhase() {
      this.createPhase.ProcedureID = this.procedureInfo.ProcedureID;
      this.createPhase.ProcedureName = this.procedureInfo.ProcedureName;
      this.isShowCreatePhase = true;
    },
    btPushToWork(data) {
      this.$router.push("/cong-viec/" + data.StepID);
    },
    getPhaseLst() {
      GetStepByProcedure({
        PageNumber: 1,
        RowspPage: 1000,
        Search: "",
        ProcedureID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.phaseLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          this.updateUI++;
        }
      });
    },
    btShowEditPhase(item) {
      this.editPhase = { ...item }; // Populate editPhase with the selected item's data
      this.isShowEditPhase = true; // Show the edit dialog
    },
    btEditPhase() {
      if (this.editPhase.StepName && this.editPhase.Description) {
        UpdateStep({
          StepInfo: {
            ...this.editPhase,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getPhaseLst(); // Refresh the phase list after successful update
            this.isShowEditPhase = false; // Close the edit dialog
            notify({
              title: "Thành công",
              text: "Cập nhật Bước thành công",
              type: "success",
            });
          } else {
            notify({
              title: "Lỗi",
              text: "Cập nhật Bước thất bại",
              type: "error",
            });
          }
        });
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin",
          type: "error",
        });
      }
    },
  },
  created() {
    this.getProcedureByID();
    this.getPhaseLst();
  },
};
</script>

<style lang="scss" scoped></style>

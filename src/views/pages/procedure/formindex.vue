<template>
  <v-card>
    <v-dialog v-model="isShowcreateForm" max-width="650px">
      <v-card>
        <v-card-title>Thiết kế phiếu nhập thông tin</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="createForm.ProcedureName"
              label="Quy trình xử lý"
              :disabled="true"
              class="mb-2"
            ></v-text-field>
            <v-row>
              <v-col lg="9">
                <v-text-field
                  v-model="createForm.NameForm"
                  label="Tên phiếu nhập"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col lg="3">
                <v-select
                  v-model="createForm.TypeForm"
                  :items="typeFormLst"
                  item-title="ValueName"
                  item-value="ValueName2"
                  label="Loại"
                ></v-select>
              </v-col>
            </v-row>
            <v-textarea
              v-model="createForm.Description"
              label="Mô tả"
              rows="2"
              class="mb-2"
            ></v-textarea>
            <div class="d-flex justify-space-between">
              <span>Thêm các trường thông tin</span>
              <v-btn icon color="green" size="x-small" @click="addField">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-row
              v-for="(field, index) in createForm.FormLineLst"
              :key="index"
            >
              <v-col cols="11">
                <v-text-field
                  v-model="field.Parameter"
                  :label="'Tên trường thông tin ' + (index + 1)"
                ></v-text-field>
                <v-list v-if="field.Type === 2">
                  <div class="d-flex justify-space-between px-4">
                    <div>Thêm các lựa chọn</div>
                    <v-btn
                      icon
                      color="green"
                      size="x-small"
                      @click="addOption(field)"
                      style="margin-top: -4px"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                  <v-list-item
                    v-for="(item, index) in field.Options"
                    :key="index"
                  >
                    <div class="d-flex">
                      <v-text-field
                        class="mt-1"
                        v-model="item.Name"
                        :label="'Lựa chọn ' + (index + 1)"
                        variant="underlined"
                      ></v-text-field>

                      <v-btn
                        icon
                        variant="tonal"
                        color="red"
                        size="x-small"
                        class="my-2 ml-1"
                        @click="removeOption(field, index)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </div>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="1">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      color="gray"
                      icon="mdi-dots-grid"
                      style="height: 40px; width: 0px"
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="x-small"
                            @click="setFieldType(field, 1)"
                          >
                            <v-icon color="blue">mdi-text-short </v-icon>
                          </v-btn>
                        </template>
                        <span>Nhập text</span>
                      </v-tooltip>
                    </v-list-item>
                    <v-list-item>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="x-small"
                            @click="setFieldType(field, 2)"
                            color="green"
                          >
                            <v-icon>mdi-format-list-checks</v-icon>
                          </v-btn>
                        </template>
                        <span>Lựa chọn</span>
                      </v-tooltip>
                    </v-list-item>
                    <v-list-item>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="x-small"
                            color="red"
                            @click="removeField(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Xóa</span>
                      </v-tooltip>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowcreateForm = false">Cancel</v-btn>
          <v-btn color="green" @click="btcreateForm">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isShowEditPhase" max-width="800px">
      <v-card>
        <v-card-title>Thiết kế phiếu nhập thông tin</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="editForm.ProcedureName"
              label="Quy trình xử lý"
              :disabled="true"
              class="mb-2"
            ></v-text-field>
            <v-row>
              <v-col lg="9">
                <v-text-field
                  v-model="editForm.NameForm"
                  label="Tên phiếu nhập"
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col lg="3">
                <v-select
                  v-model="editForm.TypeForm"
                  :items="typeFormLst"
                  item-title="ValueName"
                  item-value="ValueName2"
                  label="Loại"
                ></v-select>
              </v-col>
            </v-row>
            <v-textarea
              v-model="editForm.Description"
              label="Mô tả"
              rows="2"
              class="mb-2"
            ></v-textarea>
            <div class="d-flex justify-space-between">
              <span>Thêm các trường thông tin</span>
              <v-btn icon color="green" size="x-small" @click="addField">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-row v-for="(field, index) in editForm.FormLineLst" :key="index">
              <v-col cols="11">
                <v-text-field
                  v-model="field.Parameter"
                  :label="'Tên trường thông tin ' + (index + 1)"
                ></v-text-field>
                <v-list v-if="field.Type === 2">
                  <div class="d-flex justify-space-between px-4">
                    <div>Thêm các lựa chọn</div>
                    <v-btn
                      icon
                      color="green"
                      size="x-small"
                      @click="addOption(field)"
                      style="margin-top: -4px"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                  <v-list-item
                    v-for="(item, index) in field.Options"
                    :key="index"
                  >
                    <div class="d-flex">
                      <v-text-field
                        class="mt-1"
                        v-model="item.Name"
                        :label="'Lựa chọn ' + (index + 1)"
                        variant="underlined"
                      ></v-text-field>

                      <v-btn
                        icon
                        variant="tonal"
                        color="red"
                        size="x-small"
                        class="my-2 ml-1"
                        @click="removeOption(field, index)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </div>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="1">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      color="gray"
                      icon="mdi-dots-grid"
                      style="height: 40px; width: 0px"
                    >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="x-small"
                            @click="setFieldType(field, 1)"
                          >
                            <v-icon color="blue">mdi-text-short </v-icon>
                          </v-btn>
                        </template>
                        <span>Nhập text</span>
                      </v-tooltip>
                    </v-list-item>
                    <v-list-item>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="x-small"
                            @click="setFieldType(field, 2)"
                            color="green"
                          >
                            <v-icon>mdi-format-list-checks</v-icon>
                          </v-btn>
                        </template>
                        <span>Lựa chọn</span>
                      </v-tooltip>
                    </v-list-item>
                    <v-list-item>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="x-small"
                            color="red"
                            @click="removeField(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Xóa</span>
                      </v-tooltip>
                    </v-list-item>
                  </v-list>
                </v-menu>
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
            style="height: 42px"
            class="mr-1"
            @click="btShowcreateForm"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-data-table :headers="headers" :items="formLst">
      <template v-slot:top="{ item }">
        <div class="px-6 text-h6">Danh sách form thông tin</div>
      </template>
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
      <template v-slot:item.TypeForm="{ item }">
        <v-chip color="gray" v-if="item.TypeForm == 0">Chưa chọn</v-chip>
        <v-chip color="blue" v-if="item.TypeForm == 1">Phiếu</v-chip>
        <v-chip color="green" v-if="item.TypeForm == 2">Excel</v-chip>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="isShowDel" width="400">
    <v-card>
      <v-toolbar class="pl-1" color="red" title="Xóa form" center></v-toolbar>
      <v-card-text>
        <div class="text-h5 pt-4">Có chắc bạn muốn xóa form này không?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="blue" variant="text" @click="isShowDel = false"
          >Đóng</v-btn
        >
        <v-btn color="red" variant="text" @click="btDelForm()">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  CreateForm,
  UpdateForm,
  DelForm,
  GetFormLstByID,
  GetFormByID,
  GetProcedureByID,
} from "@/api/procedureApi";
import { GetDefaultValue } from "@/api/default";

// import { CreateStep, GetStepByProcedure } from "@/api/phaseApi";
export default {
  data() {
    return {
      input: "",
      typeFormLst: [],
      procedureInfo: {},
      createForm: {
        Status: 1,
        TypeForm: 1,
        FormLineLst: [{ Parameter: "", Type: 1 }],
      },
      isShowcreateForm: false,
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
        // { title: "Action", key: "action", align: "center", sortable: false },
        { title: "Mã", key: "IDForm" },
        { title: "Tên phiếu", key: "NameForm" },
        { title: "Loại", key: "TypeForm" },
        { title: "Mô tả", key: "Description" },
        { title: "Trạng thái", key: "Status" },
      ],
      isShowEditPhase: false,
      validEdit: false,
      editForm: {
        StepName: "",
        Description: "",
        TypeForm: 1,
        // Add other FormLineLst as necessary
      },
      itemDel: {},
      formLst: [],
    };
  },
  methods: {
    getDefault() {
      GetDefaultValue({
        Table: "Loại phiếu",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.typeFormLst = res.DefaultValueLst.map((item) => {
            return {
              ...item,
              ValueName2: parseInt(item.ValueName2),
            };
          });
        }
      });
    },
    btShowDel(data) {
      this.itemDel = data;
      this.isShowDel = true;
    },
    btDelForm() {
      DelForm({
        FormID: this.itemDel.IDForm,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDel = false;
          this.getFormLstByID();
          notify({
            type: "success",
            title: "Thành công",
            text: "Xóa thành thành công",
          });
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
    btcreateForm() {
      if (this.createForm.Parameter && this.createForm.TypeForm) {
        CreateForm({
          FormHeaderInfo: {
            ...this.createForm,
            FormLineLst: this.createForm.FormLineLst.map((item, index) => {
              return {
                ...item,
                Required: index + 1,
                OptionAnswer: JSON.stringify(item.Options),
              };
            }),
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getFormLstByID();
            this.isShowcreateForm = false;
            this.createForm = {
              Status: 1,
              StepOrder: 1,
              FormLineLst: [{ Parameter: "", Type: 1 }],
            };
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
          text: "Chưa nhập đầy đủ thông tin",
          type: "error",
        });
      }
    },
    btShowcreateForm() {
      this.createForm.ProcedureID = this.procedureInfo.ProcedureID;
      this.createForm.ProcedureName = this.procedureInfo.ProcedureName;
      this.isShowcreateForm = true;
    },
    btPushToWork(data) {
      this.$router.push("/cong-viec/" + data.StepID);
    },
    getFormLstByID() {
      GetFormLstByID({
        ProcedureID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.formLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          console.log("anhthanfh", this.formLst);
        }
      });
    },
    btShowEditPhase(item) {
      GetFormByID({
        IDForm: item.IDForm,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.editForm = res.Data;
          this.editForm.FormLineLst = this.editForm.FormLineLst.map((item) => {
            if (item.Type == 2) {
              var options = JSON.parse(item.OptionAnswer);
              return {
                ...item,
                Options: options,
              };
            }
            return {
              ...item,
            };
          });
          this.isShowEditPhase = true;
        }
      });
    },
    btEditForm() {
      if (this.editForm.StepName && this.editForm.Description) {
        UpdateForm({
          StepInfo: {
            ...this.editForm,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getFormLstByID(); // Refresh the phase list after successful update
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
    addField() {
      this.createForm.FormLineLst.push({ Parameter: "", Type: 1 }); // Add a new field
    },
    removeField(index) {
      this.createForm.FormLineLst.splice(index, 1); // Remove the field at the specified index
    },
    setFieldType(field, type) {
      field.Type = type;
      field.Options = [{ Name: "" }];
    },
    addOption(field) {
      field.Options.push({ Name: "" }); // Thêm một lựa chọn mới
    },
    removeOption(field, index) {
      field.Options.splice(index, 1); // Xóa lựa chọn tại chỉ số đã cho
    },
  },
  created() {
    this.getProcedureByID();
    this.getFormLstByID();
    this.getDefault();
  },
};
</script>

<style lang="scss" scoped></style>

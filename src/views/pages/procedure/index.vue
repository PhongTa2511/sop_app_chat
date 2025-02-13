<template>
  <v-card>
    <v-dialog v-model="isShowCreate" max-width="500px" persistent>
      <v-card>
        <v-card-title>Tạo quy trình mới</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="createProcedure.ProcedureName"
              label="Tên quy trình(*)"
              placeholder="Nhập trên quy trình"
              required
              class="mb-2"
            ></v-text-field>
            <v-textarea
              v-model="createProcedure.Description"
              label="Mô tả"
              placeholder="Nhập mô tả quy trình"
              :rows="2"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowCreate = false">Cancel</v-btn>
          <v-btn color="green" @click="btCreateProcedure">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isShowUpdate" max-width="500px" persistent>
      <v-card>
        <v-card-title>Cập nhật quy trình</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="createProcedure.ProcedureName"
              label="Tên quy trình(*)"
              placeholder="Nhập trên quy trình"
              required
              class="mb-2"
            ></v-text-field>
            <v-textarea
              v-model="createProcedure.Description"
              label="Mô tả"
              placeholder="Nhập mô tả quy trình"
              :rows="2"
            ></v-textarea>
            <!-- <v-radio-group v-model="createProcedure.Status">
              <v-radio label="Đang hoạt động" :value="1"></v-radio>
              <v-radio label="Dừng hoạt động" :value="0"></v-radio>
            </v-radio-group> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowUpdate = false">Cancel</v-btn>
          <v-btn color="green" @click="btEditProcedure">Cập nhật</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isShowConfirmDelete" max-width="500px" persistent>
      <v-card>
        <v-card-title>Xác nhận xóa</v-card-title>
        <v-card-text> Bạn có chắc chắn muốn xóa quy trình này? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowConfirmDelete = false">Hủy</v-btn>
          <v-btn color="red" @click="confirmDelete">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h6 py-2">Danh sách quy trình</h6>
        <div class="d-flex">
          <v-btn
            color="green"
            icon="mdi-playlist-plus"
            style="height: 42px"
            class="mr-1"
            @click="btShowCreateProcedure"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-data-table-server
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="desserts"
      items-per-page-text=""
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-length="dataLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      height="calc(100vh - 170px)"
      :loading="loadding"
      :items-per-page="rowspPage"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
    >
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon color="red" class="me-2" @click="btShowDel(item)"
          >mdi-trash-can
        </v-icon>
        <v-icon color="orange" class="me-2" @click="btShowEditProcedure(item)"
          >mdi-square-edit-outline
        </v-icon>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="blue" v-if="item.Status == 1"> Mới tạo </v-chip>
        <v-chip color="orange" v-if="item.Status == 2"> Chỉnh sửa </v-chip>
      </template>
      <template v-slot:item.Step="{ item }">
        <v-icon
          color="green"
          size="small"
          class="me-2"
          @click="btShowLstPhase(item)"
          >mdi-format-list-numbered
        </v-icon>
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
    </v-data-table-server>
  </v-card>
</template>

<script>
import {
  CreateProcedure,
  UpdateProcedure,
  DelProcedure,
  GetProcedureLst,
} from "@/api/procedureApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";

export default {
  data() {
    return {
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 120 },
        { title: "Bước", key: "Step", sortable: false },
        { title: "Form", key: "Form", sortable: false },
        { title: "Mã quy trình", key: "ProcedureID", sortable: false },
        {
          title: "Tên quy trình",
          key: "ProcedureName",
          sortable: false,
        },
        {
          title: "Mô tả",
          key: "Description",
          sortable: false,
        },
        {
          title: "Thời gian tạo",
          key: "TimeCreate",
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
    };
  },
  watch: {
    pageNumber(newValue) {
      this.getProcedure();
    },
    rowspPage(newValue) {
      this.getProcedure();
    },
  },
  methods: {
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },

    btShowLstForm(data) {
      this.$router.push("/form/" + data.ProcedureID);
    },
    btShowLstPhase(data) {
      this.$router.push("/buoc/" + data.ProcedureID);
    },

    btShowCreateProcedure() {
      this.isShowCreate = true;
      this.createProcedure = {};
    },
    btCreateProcedure() {
      if (this.createProcedure.ProcedureName) {
        CreateProcedure({
          ProcedureInfo: {
            ProcedureName: this.createProcedure.ProcedureName,
            Description: this.createProcedure.Description,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.isShowCreate = false;
            this.createProcedure = {};
            this.getProcedure();
            notify({
              title: "Thành công",
              text: "Tạo quy trình mới thành công",
              type: "success",
            });
          }
        });
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng nhập đầy đủ thông tin",
          type: "warning",
        });
      }
    },
    btShowEditProcedure(data) {
      this.isShowUpdate = true;
      this.createProcedure = data;
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
        }).then((res) => {
          if (res.RespCode == 0) {
            this.isShowUpdate = false;
            this.createProcedure = {};
            this.getProcedure();
            notify({
              title: "Thành công",
              text: "Tạo quy trình mới thành công",
              type: "success",
            });
          }
        });
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng nhập đầy đủ thông tin",
          type: "warning",
        });
      }
    },
    btShowDel(data) {
      this.procedureToDelete = data;
      this.isShowConfirmDelete = true;
    },
    confirmDelete() {
      this.btDelProcedure(this.procedureToDelete);
      this.isShowConfirmDelete = false;
      this.procedureToDelete = null;
    },
    btDelProcedure(data) {
      DelProcedure({ ProcedureID: data.ProcedureID }).then((res) => {
        if (res.RespCode == 0) {
          this.getProcedure();
          notify({
            title: "Thành công",
            text: "Xóa quy trình thành công",
            type: "success",
          });
        }
      });
    },
    getProcedure() {
      this.loadding = true;
      GetProcedureLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: "",
      }).then((res) => {
        if (res.RespCode == 0) {
          var num = (this.pageNumber - 1) * this.rowspPage;
          this.desserts = res.Data.filter((p) => p.Status != 0).map(
            (item, index) => {
              return {
                ...item,
                Key: index + 1 + num,
                TimeCreate: formatDateDisplayDDMMYY(item.TimeCreate),
              };
            }
          );
          this.dataLength = res.TotalRows;
          this.loadding = false;
        }
      });
    },
  },
  created() {
    this.getProcedure();
  },
};
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

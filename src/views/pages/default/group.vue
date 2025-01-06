<template>
  <v-card>
    <v-card-title class="text-h6 py-4">
      <div class="d-flex justify-space-between">
        <div>Danh sách nhóm</div>
        <div class="d-flex flex-wrap">
          <span>
            <v-text-field
              v-model="search"
              label="Tìm kiếm"
              class="mx-2"
              variant="outlined"
              hide-details
              density="compact"
              style="width: 250px !important"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </span>

          <v-btn
            color="blue"
            variant="tonal"
            @click="btShowCreate"
            icon="mdi-text-box-plus"
            style="height: 40px"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-data-table-server
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="desserts"
      :search="search"
      height="calc(100vh - 210px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
    >
      <template v-slot:item.Status="{ item }">
        <v-chip color="success" size="small" v-if="item.Status > 0">
          Đang dùng
        </v-chip>
        <v-chip color="red" size="small" v-if="item.Status == 0"> Xóa </v-chip>
      </template>
      <template v-slot:item.Action="{ item }">
        <v-icon color="red" size="small" @click="btShowDel(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon color="orange" size="small" @click="btShowUpdate(item)">
          mdi-square-edit-outline
        </v-icon>
      </template>
      <template v-slot:item.Procedure="{ item }">
        <v-chip
          color="info"
          size="small"
          v-for="(pro, index) in item.Data"
          :key="index"
        >
          {{ pro.ProcedureName }}
        </v-chip>
      </template>
    </v-data-table-server>
  </v-card>
  <v-dialog v-model="isShowCreate" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Thêm nhóm mới</h6>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Tên nhóm"
          v-model="teamInfo.TeamName"
          hide-details=""
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowCreate = false"
        >
          Đóng
        </v-btn>
        <v-btn @click="addTeamInfo"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDel" width="400">
    <v-card>
      <v-toolbar class="pl-2" color="red" title="Xóa" center></v-toolbar>
      <v-card-text>
        <div class="text-h5 pt-4">Có chắc bạn muốn xóa nhóm này không?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="blue" variant="text" @click="isShowDel = false"
          >Đóng</v-btn
        >
        <v-btn variant="text" @click="updateTeamInfo()">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowUpdate" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Cập nhật nhóm</h6>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Tên nhóm"
          v-model="updateInfo.TeamName"
          hide-details=""
        ></v-text-field>
        <v-select
          v-model="updateInfo.Data"
          placeholder="Nhóm xử lý"
          density="compact"
          :items="procedureLst"
          item-value="ProcedureID"
          item-title="ProcedureName"
          chips
          class="mb-2 mt-2"
          multiple
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowUpdate = false"
        >
          Đóng
        </v-btn>
        <v-btn @click="updateItem"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <notifications />
</template>

<script>
import { GetTeamLst, AddTeamInfo, UpdateTeamInfo } from "@/api/teamApi";
import { GetProcedureLst } from "@/api/procedureApi";
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
    };
  },
  watch: {
    pageNumber() {
      this.getTeamLst();
    },
    rowspPage() {
      this.getTeamLst();
    },
  },
  methods: {
    btShowCreate() {
      this.isShowCreate = true;
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    btShowDel(data) {
      this.itemDel = { ...data };
      this.isShowDel = true;
    },
    updateTeamInfo() {
      UpdateTeamInfo({
        Data: {
          ...this.itemDel,
          Status: 0,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDel = false;
          this.getTeamLst();
          notify({
            type: "success",
            title: "Thành công",
          });
        }
      });
    },
    addTeamInfo() {
      AddTeamInfo({
        Data: this.teamInfo,
      }).then((res) => {
        if (res) {
          this.isShowCreate = false;
          this.getTeamLst();
          notify({
            type: "success",
            title: "Thành công",
          });
        }
      });
    },
    getProcedureLst() {
      GetProcedureLst({ PageNumber: 1, RowspPage: 10000 }).then((res) => {
        if (res.RespCode == 0) {
          this.procedureLst = res.Data;
        }
      });
    },
    getTeamLst() {
      GetTeamLst({
        RowspPage: this.rowspPage,
        PageNumber: this.pageNumber,
        Search: this.search,
      }).then((res) => {
        if (res) {
          this.desserts = res.Data.map((item, index) => {
            var num = (this.pageNumber - 1) * this.rowspPage;
            return {
              ...item,
              Key: index + 1 + num,
            };
          });
          this.totalLength = res.TotalRows;
        }
      });
    },

    btShowUpdate(item) {
      this.updateInfo = { ...item };
      this.isShowUpdate = true;
    },
    updateItem() {
      UpdateTeamInfo({
        Data: {
          ...this.updateInfo,
          Status: 2,
          Data: this.updateInfo.Data.map((item) => {
            return {
              ProcedureID: item,
              TeamID: this.updateInfo.TeamID,
            };
          }),
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowUpdate = false;
          this.getTeamLst();
          notify({
            type: "success",
            title: "Thành công",
          });
        }
      });
    },
  },
  created() {
    this.getTeamLst();
    this.getProcedureLst();
  },
};
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

<template>
  <v-card>
    <v-card-title class="text-h6 py-4">
      <div class="d-flex justify-sm-space-between">
        <div>Danh sách tài khoản</div>
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
            @click="btShowCreate"
            icon="mdi-account-plus"
            style="height: 42px"
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
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
    >
      <template v-slot:item.Status="{ item }">
        <v-chip
          color="green"
          size="small"
          v-if="item.Status == 1 || item.Status == 2"
        >
          Đang làm
        </v-chip>
        <v-chip color="red" size="small" v-if="item.Status == 0"> Xóa </v-chip>
      </template>
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon color="orange" size="small" @click="btShowUpdate(item)">
          mdi-square-edit-outline
        </v-icon>
      </template>
    </v-data-table-server>
  </v-card>

  <v-dialog v-model="isShowUpdateAccount" persistent width="450">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Cập nhật tài khoản</h6>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Họ tên"
              v-model="updateAccount.FullName"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Email"
              v-model="updateAccount.Email"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Số điện thoại"
              v-model="updateAccount.PhoneNumber"
              hide-details=""
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="12">
            <v-select
              label="Nhóm"
              v-model="updateAccount.TeamID"
              :items="teamLst"
              item-value="TeamID"
              item-title="TeamName"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Chức vụ"
              v-model="updateAccount.Role"
              :items="positionLst"
              item-value="ValueName"
              item-title="ValueName"
              hide-details=""
            ></v-select>
          </v-col> -->
          <div style="width: 100%" class="mx-3">
            <span> Nhóm </span>
            <v-btn
              class="float-right"
              icon="mdi-plus"
              size="x-small"
              @click="btShowAddTeam"
            >
            </v-btn>
          </div>
          <div style="width: 100%" class="mx-3">
            <v-chip
              class="mb-1"
              color="blue"
              v-for="(item, index) in updateAccount.Data"
              :key="index"
              ><v-icon color="green"> mdi-account-multiple </v-icon>
              {{ item.TeamName }}
              <v-icon color="green" class="ml-4"> mdi-tag-text </v-icon>
              {{ item.Role }}
              <v-icon
                color="red"
                class="ml-4 cursor-pointer"
                @click="btRemoveTeam(item)"
              >
                mdi-close
              </v-icon>
            </v-chip>
          </div>
        </v-row>
        <div></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowUpdateAccount = false"
        >
          Đóng
        </v-btn>
        <v-btn @click="updateUserInfo"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowAddTeam" persistent width="380">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Thêm nhóm</h6>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-select
              label="Nhóm"
              v-model="teamRoleUser.TeamID"
              :items="teamLst"
              item-value="TeamID"
              item-title="TeamName"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Chức vụ"
              v-model="teamRoleUser.Role"
              :items="positionLst"
              item-value="ValueName"
              item-title="ValueName"
              hide-details=""
            ></v-select>
          </v-col>
        </v-row>
        <div></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowAddTeam = false"
        >
          Đóng
        </v-btn>
        <v-btn @click="btAddTeam"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  RegisterAccount,
  GetUserLstAll,
  UpdateUserInfo,
  SetUserRole,
  DelUserRole,
  GetUserRole,
} from "@/api/user";
import { GetTeamLst } from "@/api/teamApi";
import { GetDefaultValue } from "@/api/default";

export default {
  data() {
    return {
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 80,
        },
        { title: "Họ tên", key: "FullName", sortable: false },
        { title: "Tài khoản", key: "PhoneNumber", sortable: false },
        { title: "Email", key: "Email", sortable: false },
        {
          title: "Nhóm",
          key: "TeamName",
          sortable: false,
          align: "center",
        },
        { title: "Chức vụ", key: "Role", sortable: false },
        {
          title: "Trạng thái",
          key: "Status",
          sortable: false,
          width: 100,
          align: "center",
        },
      ],
      desserts: [],
      search: "",
      tableData: [],
      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,
      isShowCreate: false,
      isShowDel: false,
      isShowUpdateAccount: false,
      isShowSetUserRole: false,
      updateAccount: {},
      createAccount: {},
      userLst: [],
      userRole: {},
      userRoleLst: [],
      organization: [],

      positionLst: [],
      teamLst: [],
      isShowAddTeam: false,
      teamRoleUser: {},
    };
  },
  watch: {
    search() {
      this.getUserLst();
    },
    pageNumber(newValue) {
      this.getUserLst();
    },
    rowspPage(newValue) {
      this.getUserLst();
    },
  },
  methods: {
    btRemoveTeam(data) {
      this.updateAccount.Data = this.updateAccount.Data.filter(
        (p) => p.TeamID != data.TeamID
      );
    },
    btAddTeam() {
      if (this.teamRoleUser.TeamID && this.teamRoleUser.Role) {
        const existingTeamIndex = this.updateAccount.Data.findIndex(
          (p) => p.TeamID == this.teamRoleUser.TeamID
        );

        if (existingTeamIndex !== -1) {
          // Cập nhật thông tin nếu TeamID đã tồn tại
          this.updateAccount.Data[existingTeamIndex] = {
            ...this.updateAccount.Data[existingTeamIndex],
            Role: this.teamRoleUser.Role, // Cập nhật chỉ Role
          };
        } else {
          // Thêm mới nếu TeamID chưa tồn tại
          this.updateAccount.Data.push({
            ...this.teamRoleUser,
            TeamName: this.teamLst.find(
              (p) => p.TeamID == this.teamRoleUser.TeamID
            ).TeamName,
          });
        }
        this.isShowAddTeam = false;
      } else {
        notify({
          title: "Cảnh báo",
          message: "Nhập đầy đủ thông tin",
          type: "error",
        });
      }
    },
    btShowAddTeam() {
      this.isShowAddTeam = true;
      this.teamRoleUser = {};
    },
    btShowCreate() {
      this.isShowCreate = true;
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    getDefaultValue() {
      GetDefaultValue({ Table: "Chức vụ" }).then((res) => {
        if (res.RespCode == 0) {
          this.positionLst = res.DefaultValueLst.filter((p) => p.Status > 0);
        }
      });
      GetTeamLst({
        RowspPage: 10000,
        PageNumber: 1,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.teamLst = res.Data;
        }
      });
    },
    btShowUserRole(data) {
      this.isShowSetUserRole = true;
      this.userRole = data;
      this.getUserRole(data.UserName);
    },

    delUserRole(data) {
      DelUserRole({
        UserRoleInfo: {
          RowID: data.RowID,
          UserID: data.UserID,
          Role: data.Role,
          Description: data.Description,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getUserRole(data.UserID);
          notify({
            title: "Xóa quyền",
            message: "Xóa phân quyền thành công",
            type: "success",
          });
        }
      });
    },
    getUserRole(data) {
      GetUserRole({
        UserID: data,
      }).then((res) => {
        this.userRoleLst = res.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          };
        });
      });
    },
    getUserLst() {
      GetUserLstAll({
        Search: this.search,
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.desserts = res.Data.map((item, index) => {
            var a = this.rowspPage * (this.pageNumber - 1);
            return {
              ...item,
              Key: index + 1 + a,
            };
          });
          this.totalLength = res.TotalRows;
        }
      });
    },

    btShowUpdate(data) {
      this.isShowUpdateAccount = true;
      this.updateAccount = {
        ...data,
      };
    },
    updateUserInfo() {
      UpdateUserInfo({
        UserInfo: {
          ...this.updateAccount,
          UserName: this.updateAccount.UserName,
          Email: this.updateAccount.Email,
          FullName: this.updateAccount.FullName,
          PhoneNumber: this.updateAccount.PhoneNumber,
          Role: this.updateAccount.Role,
          TeamID: this.updateAccount.TeamID,
          Status: this.updateAccount.Status,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowUpdateAccount = false;
          this.updateAccount = {};
          this.getUserLst();
          notify({
            title: "Tài khoản",
            message: "Cập nhật tài khoản thành công",
            type: "success",
          });
        }
      });
    },
    delUserInfo(data) {
      this.$confirm("Có chắc bạn muốn xóa tài khoản này không?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          UpdateUserInfo({
            UserInfo: {
              UserName: data.UserName,
              // Password: this.updateAccount.Password,
              Email: data.Email,
              FullName: data.FullName,
              PhoneNumber: data.PhoneNumber,
              Status: -1,
              OrganizationLst: data.OrganizationLst,
            },
          }).then((res) => {
            if (res.RespCode == 0) {
              this.getUserLst();
              notify({
                title: "Tài khoản",
                message: "Xóa tài khoản thành công",
                type: "success",
              });
            }
          });
        })
        .catch(() => {});
    },
  },

  created() {
    this.getUserLst();
    this.getDefaultValue();
  },
};
</script>

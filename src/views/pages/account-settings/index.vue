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

  <v-dialog v-model="isShowUpdateAccount" persistent width="400">
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
          <v-col cols="12">
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
          </v-col>
        </v-row>
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
      optionRoles: [
        {
          RoleName: "Thêm/ sửa/ xóa tài khoản",
          RoleID: 1,
        },
        {
          RoleName: "Phê duyệt tài khoản",
          RoleID: 2,
        },
        {
          RoleName: "Thêm/ sửa/ xóa đơn vị",
          RoleID: 3,
        },
        {
          RoleName: "Phê duyệt đơn vị",
          RoleID: 4,
        },
        {
          RoleName: "Thêm/ sửa/ xóa hồ sơ",
          RoleID: 5,
        },
        {
          RoleName: "Phân công xử lý hồ sơ",
          RoleID: 6,
        },
        {
          RoleName: "Khóa cập nhật hồ sơ",
          RoleID: 7,
        },
        {
          RoleName: "Thêm sửa xóa quy trình/ đầu việc/ form",
          RoleID: 8,
        },
        {
          RoleName: "Khóa cập nhật quy trình/ đầu việc/ form",
          RoleID: 9,
        },
        {
          RoleName: "Admin đơn vị",
          RoleID: 10,
        },
        {
          RoleName: "Tạo lịch nhắc việc",
          RoleID: 11,
        },
        {
          RoleName: "Xử lý văn bản",
          RoleID: 12,
        },
        {
          RoleName: "Thêm/ sửa/ xóa liên hệ",
          RoleID: 14,
        },
      ],
      positionLst: [],
      teamLst: [],
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
    setUserRole(data) {
      var a = this.optionRoles.find((p) => p.RoleID == data.RoleIDSelect);
      SetUserRole({
        UserRoleInfo: {
          RowID: data.RowID,
          UserID: data.UserName,
          Role: data.RoleIDSelect,
          Description: a.RoleName,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getUserRole(data.UserName);
          notify({
            title: "Phân quyền",
            message: "Thêm quyền thành công",
            type: "success",
          });
        }
      });
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
    registerAccount() {
      RegisterAccount({
        Password: this.createAccount.Password,
        Email: this.createAccount.Email,
        FullName: this.createAccount.FullName,
        PhoneNumber: this.createAccount.PhoneNumber,
        Position: this.createAccount.Position.join("; "),
        OrganizationLst: this.createAccount.organization.map((item, index) => {
          return {
            OrganizationID: item,
          };
        }),
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowCreate = false;
          this.createAccount = {};
          this.getUserLst();
          notify({
            title: "Tài khoản",
            message:
              "Tạo tài khoản thành công. Mật khẩu sẽ gửi về mail của bạn",
            type: "success",
          });
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

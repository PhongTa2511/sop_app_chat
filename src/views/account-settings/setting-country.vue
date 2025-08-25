<template>
  <v-card>
    <v-card-title class="text-h6 py-4">
      <div class="d-flex justify-sm-space-between">
        <div>Danh sách phân quyền quốc gia</div>
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
      height="calc(100vh - 270px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
    >
      <template v-slot:item.Role="{ item }">
        <v-chip color="blue" size="small" v-if="item.Role == 1">
          Quan sát
        </v-chip>
        <v-chip color="green" size="small" v-if="item.Role == 10">
          Phê duyệt
        </v-chip>
      </template>
      <template v-slot:item.Action="{ item }">
        <div class="d-flex">
          <v-btn
            icon
            size="small"
            color="orange"
            class="mr-2"
            @click="btShowUpdate(item)"
          >
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
          <v-btn icon size="small" color="red" @click="btShowDel(item)">
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
  <v-dialog v-model="isShowCreate" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 py-2">Thêm tài khoản mới</h6>
      </v-card-title>
      <v-card-text>
        <v-row v-if="createAccount">
          <v-col cols="12">
            <v-autocomplete
              label="Họ và tên"
              v-model="createAccount.EmployeeID"
              :items="userLst"
              hide-details
              item-title="FullName"
              item-value="PhoneNumber"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Số điện thoại"
              v-model="createAccount.EmployeeID"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Email"
              v-model="createAccount.Email"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              label="Quốc gia"
              v-model="createAccount.Country"
              :items="countryLst"
              hide-details
              item-title="ValueName"
              item-value="ValueName"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="createAccount.Role"
              placeholder="Phân quyền"
              density="compact"
              :items="roleLst"
              item-value="ValueName"
              item-title="ValueName2"
              chips
            ></v-select>
          </v-col>
        </v-row>
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
        <v-btn @click="registerAccount"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDel" width="400">
    <v-card>
      <v-card-title>
        <h3 class="text-h5 pt-2" style="color: red">Xóa</h3>
      </v-card-title>
      <v-card-text>
        <div class="text-h6 mx-2">Có chắc bạn muốn xóa giá trị này không?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="grey" variant="text" @click="isShowDel = false"
          >Đóng</v-btn
        >
        <v-btn variant="text" color="red" @click="delCountryRole">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowUpdateAccount" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Chỉnh sửa tài khoản</h6>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Họ và tên"
              v-model="updateAccount.EmployeeName"
              hide-details=""
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Số điện thoại"
              v-model="updateAccount.EmployeeID"
              hide-details=""
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Email"
              v-model="updateAccount.Email"
              hide-details=""
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Quốc gia"
              v-model="updateAccount.Country"
              hide-details=""
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="updateAccount.Role"
              placeholder="Phân quyền"
              density="compact"
              :items="roleLst"
              item-value="ValueName"
              item-title="ValueName2"
              chips
              color="blue"
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
        <v-btn @click="updateCountryRole"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GetCountryRoleLst, UpdateCountryRole } from "@/api/companyApi";
import { GetDefaultValue } from "@/api/default";
import { GetUserLstAll } from "@/api/user";
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
        { title: "Họ tên", key: "EmployeeName", sortable: false },
        { title: "SĐT", key: "EmployeeID", sortable: false },
        { title: "Email", key: "Email", sortable: false },
        { title: "Quốc gia", key: "Country", sortable: false },
        { title: "Nhiệm vụ", key: "Role", sortable: false },

        { title: "", key: "Action", width: 80 },
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
      updateAccount: {},
      createAccount: {},
      userLst: [],
      roleLst: [],
      userInfo: {},
      countryLst: [],
      itemDel: {},
    };
  },
  watch: {
    "createAccount.EmployeeID"(value) {
      var check = this.userLst.find((p) => p.PhoneNumber == value);
      if (check) {
        this.createAccount.Email = check.Email;
      }
    },
    search() {
      this.getCountryRoleLst();
    },
    pageNumber(newValue) {
      this.getCountryRoleLst();
    },
    rowspPage(newValue) {
      this.getCountryRoleLst();
    },
  },
  methods: {
    btShowDel(data) {
      this.itemDel = data;
      this.isShowDel = true;
    },
    getUserLstAll() {
      GetUserLstAll({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
      }).then((res) => {
        this.userLst = res.Data;
      });
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
      GetDefaultValue({ Table: "Quyền quốc gia" }).then((res) => {
        if (res.RespCode == 0) {
          this.roleLst = res.DefaultValueLst.filter((p) => p.Status > 0).map(
            (item) => {
              return {
                ...item,
                ValueName: parseInt(item.ValueName),
              };
            }
          );
        }
      });
      GetDefaultValue({ Table: "Khu vực" }).then((res) => {
        if (res.RespCode == 0) {
          this.countryLst = res.DefaultValueLst.filter((p) => p.Status > 0);
        }
      });
    },

    getCountryRoleLst() {
      GetCountryRoleLst({ Search: this.search }).then((res) => {
        if (res.RespCode == 0) {
          this.desserts = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        }
      });
    },
    registerAccount() {
      UpdateCountryRole({
        Data: [{ ...this.createAccount }],
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowCreate = false;
          this.createAccount = {};
          this.getCountryRoleLst();
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
    btShowUpdate(data) {
      this.isShowCreate = false;
      this.isShowUpdateAccount = true;
      this.updateAccount = {
        ...data,
      };
    },
    updateCountryRole() {
      UpdateCountryRole({
        Data: [
          {
            ...this.updateAccount,
          },
        ],
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowUpdateAccount = false;
          this.updateAccount = {};
          this.getCountryRoleLst();
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
    delCountryRole() {
      UpdateCountryRole({
        Data: [{ ...this.itemDel, Status: 0 }],
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDel = false;
          this.itemDel = {};
          this.getCountryRoleLst();
          notify({
            title: "Thành công",
            type: "success",
          });
        }
      });
    },
  },

  created() {
    this.getCountryRoleLst();
    this.getDefaultValue();
    this.getUserLstAll();
  },
};
</script>

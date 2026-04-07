<template>
  <VCard>
    <VCardTitle class="text-h6 py-4">
      <div class="d-flex justify-sm-space-between">
        <div>Danh sách phân quyền quốc gia</div>
        <div class="d-flex flex-wrap">
          <span>
            <VTextField
              v-model="search"
              label="Tìm kiếm"
              class="mx-2"
              variant="outlined"
              hide-details
              density="compact"
              style="width: 250px !important"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </span>

          <VBtn
            color="blue"
            icon="mdi-account-plus"
            style="height: 42px"
            @click="btShowCreate"
          />
        </div>
      </div>
    </VCardTitle>
    <VDataTableServer
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="desserts"
      :search="search"
      height="calc(100vh - 270px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      @update:itemsPerPage="btRow"
      sort-desc-icon="mdi-menu-down"
      @update:page="btPage"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
    >
      <template #item.Role="{ item }">
        <VChip
          v-if="item.Role == 1"
          color="blue"
          size="small"
        >
          Quan sát
        </VChip>
        <VChip
          v-if="item.Role == 10"
          color="green"
          size="small"
        >
          Phê duyệt
        </VChip>
      </template>
      <template #item.Action="{ item }">
        <div class="d-flex">
          <VBtn
            icon
            size="small"
            color="orange"
            class="mr-2"
            @click="btShowUpdate(item)"
          >
            <VIcon> mdi-pencil </VIcon>
          </VBtn>
          <VBtn
            icon
            size="small"
            color="red"
            @click="btShowDel(item)"
          >
            <VIcon> mdi-delete </VIcon>
          </VBtn>
        </div>
      </template>
    </VDataTableServer>
  </VCard>
  <VDialog
    v-model="isShowCreate"
    persistent
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 py-2">
          Thêm tài khoản mới
        </h6>
      </VCardTitle>
      <VCardText>
        <VRow v-if="createAccount">
          <VCol cols="12">
            <VAutocomplete
              v-model="createAccount.EmployeeID"
              label="Họ và tên"
              :items="userLst"
              hide-details
              item-title="FullName"
              item-value="PhoneNumber"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="createAccount.EmployeeID"
              label="Số điện thoại"
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="createAccount.Email"
              label="Email"
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VAutocomplete
              v-model="createAccount.Country"
              label="Quốc gia"
              :items="countryLst"
              hide-details
              item-title="ValueName"
              item-value="ValueName"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="createAccount.Role"
              placeholder="Phân quyền"
              density="compact"
              :items="roleLst"
              item-value="ValueName"
              item-title="ValueName2"
              chips
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isShowCreate = false"
        >
          Đóng
        </VBtn>
        <VBtn @click="registerAccount">
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowDel"
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h3
          class="text-h5 pt-2"
          style="color: red"
        >
          Xóa
        </h3>
      </VCardTitle>
      <VCardText>
        <div class="text-h6 mx-2">
          Có chắc bạn muốn xóa giá trị này không?
        </div>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          color="grey"
          variant="text"
          @click="isShowDel = false"
        >
          Đóng
        </VBtn>
        <VBtn
          variant="text"
          color="red"
          @click="delCountryRole"
        >
          Xóa
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowUpdateAccount"
    persistent
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Chỉnh sửa tài khoản
        </h6>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.EmployeeName"
              label="Họ và tên"
              hide-details=""
              readonly
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.EmployeeID"
              label="Số điện thoại"
              hide-details=""
              readonly
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.Email"
              label="Email"
              hide-details=""
              readonly
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.Country"
              label="Quốc gia"
              hide-details=""
              readonly
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="updateAccount.Role"
              placeholder="Phân quyền"
              density="compact"
              :items="roleLst"
              item-value="ValueName"
              item-title="ValueName2"
              chips
              color="blue"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isShowUpdateAccount = false"
        >
          Đóng
        </VBtn>
        <VBtn @click="updateCountryRole">
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { GetCountryRoleLst, UpdateCountryRole } from "@/api/companyApi"
import { GetDefaultValue } from "@/api/default"
import { GetUserLstAll } from "@/api/user"

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
    }
  },
  watch: {
    "createAccount.EmployeeID"(value) {
      var check = this.userLst.find(p => p.PhoneNumber == value)
      if (check) {
        this.createAccount.Email = check.Email
      }
    },
    search() {
      this.getCountryRoleLst()
    },
    pageNumber(newValue) {
      this.getCountryRoleLst()
    },
    rowspPage(newValue) {
      this.getCountryRoleLst()
    },
  },

  created() {
    this.getCountryRoleLst()
    this.getDefaultValue()
    this.getUserLstAll()
  },
  methods: {
    btShowDel(data) {
      this.itemDel = data
      this.isShowDel = true
    },
    getUserLstAll() {
      GetUserLstAll({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
      }).then(res => {
        this.userLst = res.Data
      })
    },
    btShowCreate() {
      this.isShowCreate = true
    },
    btPage(data) {
      this.pageNumber = data
    },
    btRow(data) {
      this.rowspPage = data
    },
    getDefaultValue() {
      GetDefaultValue({ Table: "Quyền quốc gia" }).then(res => {
        if (res.RespCode == 0) {
          this.roleLst = res.DefaultValueLst.filter(p => p.Status > 0).map(
            item => {
              return {
                ...item,
                ValueName: parseInt(item.ValueName),
              }
            },
          )
        }
      })
      GetDefaultValue({ Table: "Khu vực" }).then(res => {
        if (res.RespCode == 0) {
          this.countryLst = res.DefaultValueLst.filter(p => p.Status > 0)
        }
      })
    },

    getCountryRoleLst() {
      GetCountryRoleLst({ Search: this.search }).then(res => {
        if (res.RespCode == 0) {
          this.desserts = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            }
          })
        }
      })
    },
    registerAccount() {
      UpdateCountryRole({
        Data: [{ ...this.createAccount }],
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowCreate = false
          this.createAccount = {}
          this.getCountryRoleLst()
          notify({
            title: "Thành công",
            type: "success",
          })
        }
      })
    },
    btShowUpdate(data) {
      this.isShowCreate = false
      this.isShowUpdateAccount = true
      this.updateAccount = {
        ...data,
      }
    },
    updateCountryRole() {
      UpdateCountryRole({
        Data: [
          {
            ...this.updateAccount,
          },
        ],
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowUpdateAccount = false
          this.updateAccount = {}
          this.getCountryRoleLst()
          notify({
            title: "Thành công",
            type: "success",
          })
        }
      })
    },
    delCountryRole() {
      UpdateCountryRole({
        Data: [{ ...this.itemDel, Status: 0 }],
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowDel = false
          this.itemDel = {}
          this.getCountryRoleLst()
          notify({
            title: "Thành công",
            type: "success",
          })
        }
      })
    },
  },
}
</script>

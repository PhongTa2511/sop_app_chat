<template>
  <VCard>
    <VCardTitle class="text-h6 pl-4 pr-2 pb-0">
      <div class="d-flex justify-sm-space-between">
        <div>Danh sách tài khoản</div>
        <div class="d-flex flex-wrap">
          <span>
            <VTextField
              v-model="search"
              label="Tìm kiếm"
              class="mx-1"
              variant="outlined"
            ></v-text-field>
          </div>
          <div style="width: 320px">
            <v-autocomplete
              v-model="teamName"
              label="Nhóm"
              hide-details
              density="compact"
              variant="outlined"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              clearable
            />
          </span>
          <VBtn
            color="blue"
            icon="mdi-reload"
            size="small"
            class="mr-1"
            @click="getUserLst"
          />
          <VBtn
            color="green"
            icon="mdi-account-plus"
            size="small"
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
      items-per-page-text=""
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
      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status == 1 || item.Status == 2"
          color="green"
          size="small"
        >
          Đang làm
        </VChip>
        <VChip
          v-if="item.Status == 0"
          color="red"
          size="small"
        >
          Xóa
        </VChip>
      </template>
      <template #item.TeamName="{ item }">
        <VChip
          v-for="(item, index) in item.Data"
          :key="index"
          size="small"
          class="mb-1"
          color="blue"
        >
          <VIcon color="green">
            mdi-account-multiple
          </VIcon>
          {{ item.TeamName }}
          <!--
            <v-icon color="green" class="ml-4"> mdi-tag-text </v-icon>
            {{ item.Role }} 
          -->
        </VChip>
      </template>
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          size="small"
          @click="btShowUpdate(item)"
        >
          mdi-square-edit-outline
        </VIcon>
      </template>
    </VDataTableServer>
  </VCard>

  <VDialog
    v-model="isShowUpdateAccount"
    persistent
    width="450"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Cập nhật tài khoản
        </h6>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.FullName"
              label="Họ tên"
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.Email"
              label="Email"
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="updateAccount.PhoneNumber"
              label="Số điện thoại"
              hide-details=""
            />
          </VCol>
          <div
            style="width: 100%"
            class="mx-3"
          >
            <span> Nhóm </span>
            <VBtn
              icon
              class="float-right"
              size="small"
              density="compact"
              @click="btShowAddTeam"
            >
              <VIcon size="20">
                mdi-plus
              </VIcon>
            </VBtn>
          </div>
          <div
            style="width:100%"
            class="mx-3"
          >
            <VSheet
              v-for="(item, index) in updateAccount.Data"
              :key="index"
              class="team-row px-2 py-1 mb-1"
            >
              <div class="team-grid">
                <!-- TEAM -->
                <div class="team-left text-body-2">
                  <VIcon
                    size="18"
                    color="green"
                    class="mr-2"
                  >
                    mdi-account-multiple
                  </VIcon>
                  {{ item.TeamName }}
                </div>

                <!-- ROLE -->
                <div class="team-role text-body-2">
                  <VMenu>
                    <template #activator="{ props }">
                      <div
                        v-bind="props"
                        class="d-flex align-center cursor-pointer"
                      >
                        <VIcon
                          size="18"
                          color="green"
                          class="mr-1"
                        >
                          mdi-tag
                        </VIcon>
                        {{ item.Role }}
                      </div>
                    </template>

                    <VList density="compact">
                      <VListItem
                        v-for="role in positionLst"
                        :key="role.ValueName"
                        @click="changeRole(item, role.ValueName)"
                      >
                        <VListItemTitle>
                          {{ role.ValueName }}
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>

                <!-- DELETE -->
                <VIcon
                  size="18"
                  color="red"
                  class="cursor-pointer"
                  @click="btRemoveTeam(item)"
                >
                  mdi-close
                </VIcon>
              </div>
            </VSheet>
          </div>
        </VRow>
        <div />
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
        <VBtn @click="updateUserInfo">
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowAddTeam"
    persistent
    width="380"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Thêm nhóm
        </h6>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VAutocomplete
              v-model="teamRoleUser.TeamID"
              label="Nhóm"
              :items="teamLst"
              item-value="TeamID"
              item-title="TeamName"
              filterable
              clearable
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="teamRoleUser.Role"
              label="Chức vụ"
              :items="positionLst"
              item-value="ValueName"
              item-title="ValueName"
              hide-details=""
            />
          </VCol>
        </VRow>
        <div />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isShowAddTeam = false"
        >
          Đóng
        </VBtn>
        <VBtn @click="btAddTeam">
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { GetDefaultValue } from "@/api/default";
import { GetTeamLst } from "@/api/teamApi";
import {
  DelUserRole,
  GetUserLstAll,
  GetUserRole,
  UpdateUserInfo,
} from "@/api/user";

export default {
  data() {
    return {
      // ĐÃ GIỮ NGUYÊN BẢNG HEADERS CỦA BẠN
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 140 }, // Tăng nhẹ width để Desktop không bị chật
        { title: "Quy trình", key: "ProcedureID", sortable: false },
        { title: "Mô tả", key: "Description", sortable: false },
        { title: "Nhóm", key: "TeamLst", sortable: false },
        { title: "Người tạo", key: "CreateName", sortable: false, align: "center" },
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
    }
  },
  watch: {
    search() {
      this.getUserLst()
    },
    pageNumber(newValue) {
      this.getUserLst()
    },
    rowspPage(newValue) {
      this.getUserLst()
    },
  },

  created() {
    this.getUserLst()
    this.getDefaultValue()
  },
  methods: {
    changeRole(teamItem, role) {
      teamItem.Role = role
    },
    btRemoveTeam(data) {
      this.updateAccount.Data = this.updateAccount.Data.filter(
        p => p.TeamID != data.TeamID,
      )
    },
    btAddTeam() {
      if (this.teamRoleUser.TeamID && this.teamRoleUser.Role) {
        const existingTeamIndex = this.updateAccount.Data.findIndex(
          p => p.TeamID == this.teamRoleUser.TeamID,
        )

        if (existingTeamIndex !== -1) {
          // Cập nhật thông tin nếu TeamID đã tồn tại
          this.updateAccount.Data[existingTeamIndex] = {
            ...this.updateAccount.Data[existingTeamIndex],
            Role: this.teamRoleUser.Role, // Cập nhật chỉ Role
          }
        } else {
          // Thêm mới nếu TeamID chưa tồn tại
          this.updateAccount.Data.push({
            ...this.teamRoleUser,
            TeamName: this.teamLst.find(
              p => p.TeamID == this.teamRoleUser.TeamID,
            ).TeamName,
          })
        }
        this.isShowAddTeam = false
      } else {
        notify({
          title: "Cảnh báo",
          text: "Nhập đầy đủ thông tin",
          type: "error",
        })
      }
    },
    btShowAddTeam() {
      this.isShowAddTeam = true
      this.teamRoleUser = {}
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
      GetDefaultValue({ Table: "Chức vụ" }).then(res => {
        if (res.RespCode == 0) {
          this.positionLst = res.DefaultValueLst.filter(p => p.Status > 0)
        }
      })
      GetTeamLst({
        RowspPage: 10000,
        PageNumber: 1,
      }).then(res => {
        if (res.RespCode == 0) {
          this.teamLst = res.Data
        }
      })
    },
    btShowUserRole(data) {
      this.isShowSetUserRole = true
      this.userRole = data
      this.getUserRole(data.UserName)
    },

    delUserRole(data) {
      DelUserRole({
        UserRoleInfo: {
          RowID: data.RowID,
          UserID: data.UserID,
          Role: data.Role,
          Description: data.Description,
        },
      }).then(res => {
        if (res.RespCode == 0) {
          this.getUserRole(data.UserID)
          notify({
            title: "Thành công",
            text: "Xóa quy trình thành công",
            type: "success",
          })
        }
      })
    },
    getUserRole(data) {
      GetUserRole({
        UserID: data,
      }).then(res => {
        this.userRoleLst = res.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          }
        })
      })
    },
    getUserLst() {
      GetUserLstAll({
        Search: this.search,
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
      }).then(res => {
        if (res.RespCode == 0) {
          this.desserts = res.Data.map((item, index) => {
            var a = this.rowspPage * (this.pageNumber - 1)
            
            return {
              ...item,
              Key: index + 1 + a,
            }
          })
          this.totalLength = res.TotalRows
        }
      })
    },

    btShowUpdate(data) {
      this.isShowUpdateAccount = true
      this.updateAccount = {
        ...data,
      }
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
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowUpdateAccount = false
          this.updateAccount = {}
          this.getUserLst()
          notify({
            title: "Tài khoản",
            text: "Cập nhật tài khoản thành công",
            type: "success",
          })
        }
      })
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
          }).then(res => {
            if (res.RespCode == 0) {
              this.getUserLst()
              notify({
                title: "Tài khoản",
                text: "Xóa tài khoản thành công",
                type: "success",
              })
            }
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style>
.team-row{
  background:#e3f2fd;
  border-radius:999px;
}

.team-grid{
  display:grid;
  grid-template-columns:60% 35% 5%;
  align-items:center;
}

.team-left{
  display:flex;
  align-items:center;
}

.team-role{
  display:flex;
  align-items:center;
}

.team-delete{
  display:flex;
  justify-content:center;
}

.team-name{
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.team-row{
  background:#e3f2fd;
  border-radius:999px;
  min-height:32px;
}
</style>

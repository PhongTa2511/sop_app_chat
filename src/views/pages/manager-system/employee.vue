<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 30px">TẤT CẢ NHÂN VIÊN</div>
        <div class="d-flex">
          <v-select
            placeholder="Chọn chi nhánh"
            density="compact"
            v-model="branchID"
            :items="branchLst"
            item-value="BranchID"
            item-title="BranchName"
            chips
            style="width: 300px"
          ></v-select>

          <span>
            <v-menu
              v-model="isMenuSearch"
              activator="parent"
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="tonal"
                  style="height: 40px"
                  class="mr-1"
                  v-bind="props"
                  ><v-icon> mdi-account-plus </v-icon>
                </v-btn>
              </template>
              <v-card width="300">
                <v-card-text>
                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="loadding"
                    @click="searchHistoryUser"
                  >
                    Thêm file excel</v-btn
                  >
                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="loadding"
                    @click="searchHistoryUser"
                  >
                    Thêm nhân viên</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-menu>
          </span>
        </div>
      </div>
      <VCard>
        <v-data-table
          :items-length="desserts.length"
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="desserts"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="calc(100vh - 210px)"
        >
          <template v-slot:item.Actions="{ item }">
            <div class="d-flex">
              <v-btn
                size="x-small"
                icon="mdi-pencil"
                variant="tonal"
                @click="btShowUpdateBranch(item)"
              ></v-btn>
              <v-btn
                size="x-small"
                icon="mdi-delete"
                variant="tonal"
                @click="btSelectBranchLab(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </VCard>
    </VCol>
  </VRow>
  <v-dialog v-model="isShowUpdateUserLab" width="500">
    <v-card>
      <v-card-text>
        <v-icon> mdi-user-group </v-icon>Thêm nhân viên
      </v-card-text>
      <v-card-text>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <v-select
                placeholder="Chọn chi nhánh"
                density="compact"
                v-model="userInfo.BranchID"
                :items="branchLst"
                item-value="BranchID"
                item-title="BranchName"
                chips
              ></v-select>
            </VCol>
            <VCol cols="12">
              <v-select
                placeholder="Chọn phòng ban"
                density="compact"
                v-model="userInfo.LabID"
                :items="branchLabLst"
                item-value="LabID"
                item-title="LabName"
                chips
              ></v-select>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userInfo.FullName"
                label="Tên nhân viên"
                placeholder="Nhập tên nhân viên"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userInfo.Phone"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
              />
            </VCol>
          </VRow>
        </VForm>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Đóng"
          variant="plain"
          @click="isShowUpdateUserLab = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="updateBranchLab"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GetEmployeeLst } from "@/api/user";
import { GetBranchLst } from "@/api/branch";
export default {
  data() {
    return {
      isMenuSearch: false,
      desserts: [
        {
          name: "African Elephant",
          species: "Loxodonta africana",
          diet: "Herbivore",
          habitat: "Savanna, Forests",
        },
        // ... more items
      ],
      headers: [
        { title: "STT", sortable: false, key: "Key", align: "center" },
        { title: "Mã NV", key: "UserID", sortable: false, align: "center" },
        { title: "Họ & tên", key: "FullName", sortable: false },
        { title: "Điện thoại", key: "Phone", sortable: false, align: "center" },
        { title: "Email", key: "Email", sortable: false, align: "center" },
        { title: "Nhóm", key: "GroupName", sortable: false, align: "center" },
        {
          title: "Phòng ban",
          key: "LabName",
          sortable: false,
          align: "center",
        },
        {
          title: "",
          key: "Actions",
          sortable: false,
          align: "center",
          width: 100,
        },
      ],
      branchLst: [],
      branchID: null,
    };
  },
  watch: {
    branchID() {
      this.getEmployeeLst();
    },
  },
  methods: {
    getEmployeeLst() {
      GetEmployeeLst({
        BranchID: this.branchID,
        Search: "",
        PageNumber: 1,
        RowspPage: 10000,
      }).then((res) => {
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
    getBranchLst() {
      GetBranchLst({}).then((res) => {
        this.branchLst = res.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          };
        });
        if (this.branchLst.length > 0) {
          this.branchID = this.branchLst[0].BranchID;
        }
      });
    },
  },
  created() {
    this.getBranchLst();
  },
};
</script>

<style></style>

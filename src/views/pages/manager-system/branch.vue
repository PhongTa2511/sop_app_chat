<template>
  <VRow>
    <VCol lg="6" cols="12">
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 38px">DANH SÁCH CHI NHÁNH</div>
        <v-btn variant="tonal" @click="btShowUpdateBranch">
          <v-icon> mdi-plus-box-multiple </v-icon>
        </v-btn>
      </div>
      <VCard>
        <v-data-table
          :items-length="branchLst.length"
          no-data-text="Không có dữ liệu"
          :headers="branchHeaders"
          :items="branchLst"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="250px"
          hover
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
                icon="mdi-home-group"
                variant="tonal"
                @click="btSelectBranchLab(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </VCard>
    </VCol>

    <VCol lg="6" cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 38px">PHÒNG BAN TRONG CHI NHÁNH</div>
        <v-btn variant="tonal" @click="btShowUpdateBranchLab">
          <v-icon> mdi-plus-box-multiple </v-icon>
        </v-btn>
      </div>
      <VCard>
        <v-data-table
          :items-length="desserts.length"
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="branchLabLst"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="250px"
        >
          <template v-slot:item.UnitPrice="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.UnitPrice) }}
          </template>
          <template v-slot:item.Amount="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.Amount) }}
          </template>
          <template v-slot:item.AmountVAT="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.AmountVAT) }}
          </template>
        </v-data-table>
      </VCard>
    </VCol>
    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <div class="d-flex justify-space-between mb-3">
        <div style="line-height: 38px">NHÂN VIÊN TRONG PHÒNG BAN</div>
        <v-btn variant="tonal">
          <v-icon> mdi-plus-box-multiple </v-icon>
        </v-btn>
      </div>
      <VCard>
        <v-data-table
          :items-length="desserts.length"
          no-data-text="Không có dữ liệu"
          :headers="headers"
          :items="branchLabLst"
          items-per-page-text="Số dòng 1 trang"
          sort-asc-icon="mdi-menu-up"
          sort-desc-icon="mdi-menu-down"
          height="500px"
        >
          <template v-slot:item.UnitPrice="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.UnitPrice) }}
          </template>
          <template v-slot:item.Amount="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.Amount) }}
          </template>
          <template v-slot:item.AmountVAT="{ item }">
            {{ new Intl.NumberFormat().format(item.raw.AmountVAT) }}
          </template>
        </v-data-table>
      </VCard>
    </VCol>
  </VRow>
  <v-dialog v-model="isShowUpdateBranch" width="500">
    <v-card>
      <v-card-text> <v-icon> mdi-lan </v-icon>Tạo mới chi nhánh </v-card-text>
      <v-card-text>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <VTextField
                v-model="branchInfo.BranchName"
                label="Tên chi nhánh"
                placeholder="Nhập tên chi nhánh"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="12">
              <VTextField
                v-model="branchInfo.BranchLocation"
                label="Địa chỉ"
                placeholder="Nhập địa chỉ"
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
          @click="isShowUpdateBranch = false"
        ></v-btn>

        <v-btn
          color="primary"
          text="Xác nhận"
          variant="tonal"
          @click="updateBranch"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowUpdateBranchLab" width="500">
    <v-card>
      <v-card-text>
        <v-icon> mdi-home-group </v-icon>Tạo phòng ban
      </v-card-text>
      <v-card-text>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12">
              <v-select
                placeholder="Chọn chi nhánh"
                density="compact"
                v-model="branchLabInfo.BranchID"
                :items="branchLst"
                item-value="BranchID"
                item-title="BranchName"
                chips
              ></v-select>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="branchLabInfo.LabName"
                label="Tên phòng ban"
                placeholder="Nhập tên phòng ban"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="12">
              <VTextField
                v-model="branchLabInfo.Position"
                label="Vị trí"
                placeholder="Nhập vị trí"
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
          @click="isShowUpdateBranchLab = false"
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
import {
  UpdateBranch,
  GetBranchLst,
  UpdateBranchLab,
  GetLabLstByBranch,
} from "@/api/branch";
export default {
  data() {
    return {
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
        { title: "Mã sp", key: "name", sortable: false, align: "center" },
        { title: "Sản phẩm", key: "species", sortable: false },
        { title: "SL", key: "diet", sortable: false, align: "center" },
        { title: "Giá", key: "habitat", sortable: false, align: "center" },
      ],
      branchHeaders: [
        { title: "STT", sortable: false, key: "Key", align: "center" },
        {
          title: "Chi nhánh",
          key: "BranchName",
          sortable: false,
          align: "center",
        },
        { title: "Địa chỉ", key: "BranchLocation", sortable: false },
        { title: "", key: "Actions", sortable: false },
      ],
      isShowUpdateBranch: false,
      branchInfo: {},
      branchLst: [],
      branchLabInfo: {},
      branchSelect: {},
      branchLabLst: [],
      isShowUpdateBranchLab: false,
    };
  },
  methods: {
    btShowUpdateBranchLab() {
      this.isShowUpdateBranchLab = true;
      this.branchLabInfo = {
        BranchID: this.branchSelect.BranchID,
      };
    },
    btSelectBranchLab(item) {
      this.branchIDSelect = item.BranchID;
      this.GetLabLstByBranch();
    },
    handleClick(item) {
      console.log("item", item);
    },
    btShowUpdateBranch(data) {
      if (data) {
        this.branchInfo = data;
      } else {
        this.branchInfo = {};
      }
      this.isShowUpdateBranch = true;
    },
    updateBranchLab() {
      UpdateBranchLab({
        Data: [{ ...this.branchLabInfo }],
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Đăng ký chi nhánh thành công",
          });
          this.getBranchLst();
          this.branchInfo = {};
          this.isShowUpdateBranch = false;
        }
      });
    },
    GetLabLstByBranch() {
      GetLabLstByBranch({
        BranchID: this.branchSelect.BranchID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.branchLabLst = res.Data;
        }
      });
    },
    updateBranch() {
      UpdateBranch({
        Data: this.branchInfo,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Đăng ký chi nhánh thành công",
          });
          this.getBranchLst();
          this.branchInfo = {};
          this.isShowUpdateBranch = false;
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
      });
    },
  },
  created() {
    this.getBranchLst();
  },
};
</script>

<style></style>

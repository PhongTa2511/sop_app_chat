<template>
  <v-card>
    <v-card-title class="text-h6 pl-4 pr-2 pb-0">
      <div class="d-flex justify-space-between">
        <div>DANH SÁCH GIÁ TRỊ</div>
        <div class="d-flex flex-wrap">
          <span>
            <v-text-field
              v-model="search"
              label="Tìm kiếm"
              class="mx-1"
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
            icon="mdi-plus"
            size="small"
            class="mr-1"
          ></v-btn>
          <v-btn
            color="green"
            variant="tonal"
            @click="getDefaultValue"
            icon="mdi-reload"
            size="small"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-data-table
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
      fixed-header=""
    >
      <template v-slot:item.Status="{ item }">
        <v-chip color="green" size="x-small" v-if="item.Status == 1">
          Đang dùng
        </v-chip>
      </template>
      <template v-slot:item.Action="{ item }">
        <v-btn
          color="orange"
          size="x-small"
          icon="mdi-pencil"
          @click="btShowEdit(item)"
          class="mr-1"
        ></v-btn>
        <v-btn
          color="red"
          size="x-small"
          icon="mdi-delete"
          @click="btShowDel(item)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="isShowCreate" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6">Giá trị mặc định</h6>
      </v-card-title>
      <v-card-text class="py-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Tên bảng"
              v-model="defaultInfo.TableValue"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Giá trị"
              v-model="defaultInfo.ValueName"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Giá trị 2"
              v-model="defaultInfo.ValueName2"
              hide-details=""
            ></v-text-field>
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
        <v-btn v-if="!isChecked" @click="createDefaultValue"> Xác nhận </v-btn>
        <v-btn v-else @click="updateDefaultValue(defaultInfo, 1)">
          Xác nhận
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDel" width="400">
    <v-card>
      <v-toolbar class="pl-2" color="red" title="Xóa" center></v-toolbar>
      <v-card-text>
        <div class="text-h5 pt-4">Có chắc bạn muốn xóa giá trị này không?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="blue" variant="text" @click="isShowDel = false"
          >Đóng</v-btn
        >
        <v-btn variant="text" @click="updateDefaultValue(itemDel, 0)"
          >Xóa</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <notifications />
</template>

<script>
import {
  CreateDefaultValue,
  GetDefaultValue,
  UpdateDefaultValue,
} from "@/api/default";
export default {
  data() {
    return {
      defaultInfo: {},
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
        { title: "Tên bảng", key: "TableValue", sortable: false },
        { title: "Giá trị", key: "ValueName", sortable: false },
        { title: "Giá trị 2", key: "ValueName2", sortable: false },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
        { title: "", key: "Action", width: 100 },
      ],
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      itemDel: {},
      totalLength: 0,
      isChecked: false,
    };
  },

  methods: {
    btShowEdit(data) {
      this.defaultInfo = { ...data };
      this.isShowCreate = true;
      this.isChecked = true;
    },
    btShowCreate() {
      this.isChecked = false;
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
    updateDefaultValue(item, status) {
      UpdateDefaultValue({
        DefaultValueInfo: {
          ...item,
          Status: status,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDel = false;
          this.getDefaultValue();
          this.isShowCreate = false;
          notify({
            type: "success",
            title: "Thành công",
          });
        }
      });
    },
    createDefaultValue() {
      CreateDefaultValue({
        DefaultValueInfo: this.defaultInfo,
      }).then((res) => {
        if (res) {
          this.isShowCreate = false;
          this.getDefaultValue();
          notify({
            type: "success",
            title: "Thành công",
          });
        }
      });
    },

    getDefaultValue() {
      GetDefaultValue({}).then((res) => {
        if (res) {
          this.desserts = res.DefaultValueLst.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          this.totalLength = this.desserts.length;
        }
      });
    },
  },
  created() {
    this.getDefaultValue();
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

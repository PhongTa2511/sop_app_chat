<template>
  <v-card>
    <v-card-title class="text-h6 py-4">
      <div class="d-flex justify-space-between">
        <div>Danh sách giá trị cài đặt</div>
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
    <v-data-table
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
        <v-chip color="success" size="small" v-if="item.Status == 1">
          Đang dùng
        </v-chip>
        <v-chip color="error" size="small" v-if="item.Status == 0">
          Xóa
        </v-chip>
      </template>
      <template v-slot:item.Action="{ item }">
        <v-icon color="red" size="small" @click="btShowDel(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="isShowCreate" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 px-3 py-2">Thêm giá trị mới</h6>
      </v-card-title>
      <v-card-text>
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
        <v-btn @click="createDefaultValue"> Xác nhận </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDel" width="400">
    <v-card>
      <v-toolbar class="pl-2" color="error" title="Xóa" center></v-toolbar>
      <v-card-text>
        <div class="text-h5 pt-4">Có chắc bạn muốn xóa giá trị này không?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="blue" variant="text" @click="isShowDel = false"
          >Đóng</v-btn
        >
        <v-btn variant="text" @click="updateLocalByID(itemDel.RowID, 0)"
          >Xóa</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <notifications />
</template>

<script>
import {
  GetDefaultValue,
  CreateDefaultValue,
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
        { title: "", key: "Action", width: 80 },
      ],
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      itemDel: {},
      totalLength: 0,
    };
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
    updateDefaultValue() {
      UpdateDefaultValue({
        DefaultValueInfo: {
          ...this.itemDel,
          Status: 0,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDel = false;
          this.getDefaultValue();
          notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật địa bàn mới thành công",
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
            text: "Tạo giá trị mới thành công",
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

<script setup>
import {
  GetUserLstAll,
  GetUserPermisstionLst,
  UpdateUserPermisstionLst,
} from "@/api/user";

const permissionLst = ref([]);
const getPermissionLst = (phone) => {
  GetUserPermisstionLst({ Phone: phone }).then((res) => {
    if (res.RespCode == 0) {
      permissionLst.value = res.Data.map((item, index) => {
        return {
          ...item,
          Key: index + 1,
          FeatureName: item.Define,
        };
      });
    }
  });
};

var inputSearch = ref("");
var pageNumber = ref(1);
var rowspPage = ref(1000);
const totalLength = ref(0);
var employeeSelect = ref(null);
var employeeLst = ref([]);
const groupBy = [
  // { key: "TableName", order: "asc" },
  { key: "Role", order: "asc" },
];
var headers = [
  { title: "STT", sortable: false, key: "Key", align: "center" },
  { title: "Type", key: "TableName", sortable: false, align: "left" },
  { title: "Name", key: "Define", sortable: false, align: "left" },
  {
    title: "Access",
    key: "CanAccess",
    sortable: true,
    align: "center",
    sortable: false,
  },
  {
    title: "Create",
    key: "CanCreate",
    sortable: true,
    align: "center",
    sortable: false,
  },
  {
    title: "Read",
    key: "CanRead",
    sortable: true,
    align: "center",
    sortable: false,
  },
  {
    title: "Update",
    key: "CanUpdate",
    sortable: true,
    align: "center",
    sortable: false,
  },
  {
    title: "Delete",
    key: "CanDelete",
    sortable: true,
    align: "center",
    sortable: false,
  },
];
const getAccountLst = () => {
  var search = inputSearch.value;
  GetUserLstAll({
    Search: search,
    PageNumber: pageNumber.value,
    RowspPage: rowspPage.value,
  }).then((res) => {
    if (res.RespCode == 0) {
      var num = (pageNumber.value - 1) * rowspPage.value;
      employeeLst.value = res.Data.map((item, index) => {
        return {
          ...item,
          Key: index + 1 + num,
        };
      });
      if (employeeLst.value.length > 0) {
        employeeSelect.value = employeeLst.value[0].PhoneNumber;
      } else {
        employeeSelect.value = null;
      }
      totalLength.value = res.TotalRows;
    }
  });
};
getAccountLst();
const updatePermissions = () => {
  if (employeeSelect.value) {
    permissionLst.value.forEach((item) => {
      item.UserName = employeeSelect.value;
    });
    // Call API to update permissions
    // Assuming there's an API function to update permissions
    UpdateUserPermisstionLst({
      Data: permissionLst.value,
      Phone: employeeSelect.value,
    }).then((res) => {
      if (res.RespCode == 0) {
        notify({
          type: "success",
          title: "Thành công",
        });
      } else {
        notify({
          type: "error",
          title: "Lỗi",
          text: res.RespText,
        });
      }
    });
  } else {
    notify({
      type: "error",
      title: "Lỗi",
      text: "Vui lòng chọn nhân viên và chi nhánh",
    });
  }
};

watch([employeeSelect], ([newEmployee]) => {
  if (newEmployee) {
    getPermissionLst(newEmployee);
  }
});
</script>

<template>
  <VCard>
    <v-card-title class="px-4">
      <h6 class="text-h6">DANH SÁCH PHÂN QUYỀN</h6>
    </v-card-title>
    <VCardText class="pb-0 px-4">
      Tích chọn các quyền bạn muốn cấp cho tài khoản.
      <!-- <a href="javascript:void(0)">Request Permission</a> -->
      <div class="mt-3 d-flex">
        <span>
          <v-autocomplete
            placeholder="Chọn nhân viên"
            label="Tên nhân viên"
            density="compact"
            v-model="employeeSelect"
            :items="employeeLst"
            item-value="PhoneNumber"
            item-title="FullName"
            chips
            style="width: 320px"
            class="mr-2"
            clearable
            filterable
            hide-details
          ></v-autocomplete>
        </span>
        <v-btn
          icon="mdi-reload"
          size="small"
          @click="getPermissionLst(employeeSelect, branchSelect)"
        ></v-btn>
      </div>
    </VCardText>
    <v-data-table
      :items-length="permissionLst.length"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="permissionLst"
      items-per-page="40"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      height="calc(100vh - 338px)"
      fixed-header
      hide-default-footer
      :group-by="groupBy"
    >
      <template
        v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
      >
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex align-center">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                color="medium-emphasis"
                density="comfortable"
                size="small"
                variant="outlined"
                @click="toggleGroup(item)"
              ></v-btn>

              <span class="ms-4">Menu: {{ item.items[0].raw.Define }}</span>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:item.CanAccess="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            v-model="item.CanAccess"
            color="success"
            :true-value="1"
            :false-value="0"
          ></v-checkbox>
        </div>
      </template>
      <template v-slot:item.CanCreate="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            v-model="item.CanCreate"
            v-if="item.TableName == 'Tab'"
            :true-value="1"
            :false-value="0"
          ></v-checkbox>
        </div>
      </template>
      <template v-slot:item.CanRead="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            v-model="item.CanRead"
            v-if="item.TableName == 'Tab'"
            :true-value="1"
            :false-value="0"
          ></v-checkbox>
        </div>
      </template>
      <template v-slot:item.CanUpdate="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            v-model="item.CanUpdate"
            v-if="item.TableName == 'Tab'"
            :true-value="1"
            :false-value="0"
          ></v-checkbox>
        </div>
      </template>
      <template v-slot:item.CanDelete="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            v-model="item.CanDelete"
            v-if="item.TableName == 'Tab'"
            :true-value="1"
            :false-value="0"
          ></v-checkbox>
        </div>
      </template>
    </v-data-table>

    <VDivider />

    <VCardText class="py-2">
      <div class="d-flex flex-wrap gap-2">
        <VBtn @click="updatePermissions"> Lưu thay đổi </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<template>
  <VCard>
    <VCardTitle class="text-h6 pl-4 pr-2 pb-0">
      <div class="d-flex justify-space-between">
        <div>DANH SÁCH GIÁ TRỊ</div>
        <div class="d-flex flex-wrap">
          <span>
            <VTextField
              v-model="search"
              label="Tìm kiếm"
              class="mx-1"
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
            variant="tonal"
            icon="mdi-plus"
            size="small"
            class="mr-1"
            @click="btShowCreate"
          />
          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getDefaultValue"
          />
        </div>
      </div>
    </VCardTitle>
    <VDataTable
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
      fixed-header=""
    >
      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status == 1"
          color="green"
          size="x-small"
        >
          Đang dùng
        </VChip>
      </template>
      <template #item.Action="{ item }">
        <VBtn
          color="orange"
          size="x-small"
          icon="mdi-pencil"
          class="mr-1"
          @click="btShowEdit(item)"
        />
        <VBtn
          color="red"
          size="x-small"
          icon="mdi-delete"
          @click="btShowDel(item)"
        />
      </template>
    </VDataTable>
  </VCard>
  <VDialog
    v-model="isShowCreate"
    persistent
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6">
          Giá trị mặc định
        </h6>
      </VCardTitle>
      <VCardText class="py-2">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="defaultInfo.TableValue"
              label="Tên bảng"
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="defaultInfo.ValueName"
              label="Giá trị"
              hide-details=""
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="defaultInfo.ValueName2"
              label="Giá trị 2"
              hide-details=""
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
        <VBtn
          v-if="!isChecked"
          @click="createDefaultValue"
        >
          Xác nhận
        </VBtn>
        <VBtn
          v-else
          @click="updateDefaultValue(defaultInfo, 1)"
        >
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
      <VToolbar
        class="pl-2"
        color="red"
        title="Xóa"
        center
      />
      <VCardText>
        <div class="text-h5 pt-4">
          Có chắc bạn muốn xóa giá trị này không?
        </div>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          color="blue"
          variant="text"
          @click="isShowDel = false"
        >
          Đóng
        </VBtn>
        <VBtn
          variant="text"
          @click="updateDefaultValue(itemDel, 0)"
        >
          Xóa
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <Notifications />
</template>

<script>
import {
  CreateDefaultValue,
  GetDefaultValue,
  UpdateDefaultValue,
} from "@/api/default"

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
    }
  },
  created() {
    this.getDefaultValue()
  },

  methods: {
    btShowEdit(data) {
      this.defaultInfo = { ...data }
      this.isShowCreate = true
      this.isChecked = true
    },
    btShowCreate() {
      this.isChecked = false
      this.isShowCreate = true
    },
    btPage(data) {
      this.pageNumber = data
    },
    btRow(data) {
      this.rowspPage = data
    },
    btShowDel(data) {
      this.itemDel = { ...data }
      this.isShowDel = true
    },
    updateDefaultValue(item, status) {
      UpdateDefaultValue({
        DefaultValueInfo: {
          ...item,
          Status: status,
        },
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowDel = false
          this.getDefaultValue()
          this.isShowCreate = false
          notify({
            type: "success",
            title: "Thành công",
          })
        }
      })
    },
    createDefaultValue() {
      CreateDefaultValue({
        DefaultValueInfo: this.defaultInfo,
      }).then(res => {
        if (res) {
          this.isShowCreate = false
          this.getDefaultValue()
          notify({
            type: "success",
            title: "Thành công",
          })
        }
      })
    },

    getDefaultValue() {
      GetDefaultValue({}).then(res => {
        if (res) {
          this.desserts = res.DefaultValueLst.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            }
          })
          this.totalLength = this.desserts.length
        }
      })
    },
  },
}
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

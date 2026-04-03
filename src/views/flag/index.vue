<template>
  <VCard class="pt-2">
    <VDataTableServer
      :items-per-page="pageSize"
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 270px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      @update:itemsPerPage="btRow"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      @update:page="btPage"
      :loading="loadding"
      fixed-header
    >
      <template #top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <VAutocomplete
              v-model="country"
              label="Quốc gia"
              :items="countryLst"
              hide-details
              style="width: 250px !important"
              item-title="Country"
              item-value="Country"
              multiple
            />
          </span>
          <span>
            <VMenu :close-on-content-click="false">
              <template #activator="{ props }">
                <VBtn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                />
              </template>
              <VList>
                <VListItem>
                  <VTextField
                    v-model="companyName"
                    label="Tên công ty"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  />

                  <VTextField
                    v-model="phone"
                    label="Số điện thoại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  />

                  <VTextField
                    v-model="customerName"
                    label="Khách hàng"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  />

                  <VTextField
                    v-model="email"
                    label="Email"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  />
                  <VTextField
                    v-model="employeeCare"
                    label="Phụ trách"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  />
                  <VAutocomplete
                    v-model="flagName"
                    class="pt-2"
                    prepend-inner-icon="mdi-magnify"
                    label="Chọn cờ"
                    :items="flagLst"
                    hide-details
                    style="width: 250px !important"
                    item-title="text"
                    item-value="value"
                    clearable
                  />
                  <VBtn
                    block
                    class="rounded mt-2"
                    @click="getCompanyLst"
                  >Tìm kiếm</VBtn>
                </VListItem>
              </VList>
            </VMenu>
          </span>

          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getCompanyLst"
          />

          <VBtn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="openAddCompanyDialog"
          />
          <div class="number-flag">
            <VIcon color="green">
              mdi-flag-variant
            </VIcon>
            <span class="number">{{ dataFlag.FlagGreen }}</span>
            <VIcon color="yellow">
              mdi-flag-variant
            </VIcon>
            <span class="number">{{ dataFlag.FlagYellow }}</span>
            <VIcon color="grey">
              mdi-flag-variant
            </VIcon>
            <span class="number">{{ dataFlag.FlagGrey }}</span>
          </div>
        </div>
      </template>

      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowInfo(item)"
        >
          mdi-note-edit
        </VIcon>
        <VIcon
          color="error"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="confirmDelete(item.CompanyID)"
        >
          mdi-delete
        </VIcon>
      </template>
      <template #item.Phone="{ item }">
        <div>
          {{ item.Phone }}
        </div>
        <div>
          {{ item.Email }}
        </div>
      </template>
      <template #item.CompanyName="{ item }">
        <div>
          {{ item.CompanyName }}
        </div>
        <div style="color: blue">
          {{ item.Country }}
        </div>
      </template>
      <template #item.Delegate="{ item }">
        <div>
          {{ item.Delegate }}
        </div>
        <div style="color: blue">
          {{ item.GroupName }}
        </div>
      </template>

      <template #item.IsFlag="{ item }">
        <VIcon
          v-if="item.IsFlag == 1"
          color="grey"
        >
          mdi-flag-variant
        </VIcon>
        <VIcon
          v-if="item.IsFlag == 4"
          color="green"
        >
          mdi-flag-variant
        </VIcon>
        <VIcon
          v-if="item.IsFlag == 2"
          color="yellow"
        >
          mdi-flag-variant
        </VIcon>
      </template>
    </VDataTableServer>

    <VDialog
      v-model="isShowCompany"
      max-width="700px"
    >
      <InfoCompany
        :company-i-d="companyInfo.CompanyID"
        :country-lst="countryLst"
        @btClose="btClose"
      />
    </VDialog>

    <VDialog
      v-model="isShowAddCompany"
      max-width="700px"
    >
      <InfoCompany
        :country-lst="countryLst"
        @btClose="btClose"
      />
    </VDialog>
  </VCard>
  <VDialog
    v-model="deleteDialog"
    max-width="400px"
  >
    <VCard>
      <VCardTitle class="text-h6">
        Xác nhận xoá
      </VCardTitle>
      <VCardText>Bạn có chắc chắn muốn xoá công ty này không?</VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="grey"
          variant="text"
          @click="deleteDialog = false"
        >
          Huỷ
        </VBtn>
        <VBtn
          color="red"
          variant="text"
          @click="deleteCompany"
        >
          Xoá
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  DelCompanyInfo,
  GetCompanyLst,
  GetCountryLstByUserID,
  UpdateCompanyLst,
} from "@/api/companyApi"
import { GetDefaultValue } from "@/api/default"
import { formatDateDisplayDDMMYY } from "@/helpers/getTime"
import InfoCompany from "./components/index.vue"

export default {
  components: {
    InfoCompany,
  },
  data() {
    return {
      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 120,
        },
        { title: "Công ty", key: "CompanyName", sortable: false },
        { title: "Đại diện", key: "Delegate", sortable: false },
        { title: "SĐT", key: "Phone", sortable: false },

        {
          title: "Phụ trách",
          key: "EmployeeName",
          sortable: false,
          width: 120,
        },
        { title: "", key: "IsFlag", sortable: false },
      ],
      pageSize: 25,
      currentPage: 1,
      productLst: [],
      totalLength: 0,
      loadding: false,
      product: "",
      companyName: "",
      customerName: "",
      country: null,
      phone: "",
      email: "",
      countryLst: [],
      isShowCompany: false,
      newProduct: {},
      companyInfo: {},
      isShowAddCompany: false,
      newCompany: {},
      employeeCare: "",
      flagName: null,
      flagLst: [
        { text: "Xanh", value: 4 },
        { text: "Vàng", value: 2 },
        { text: "Xám", value: 1 },
      ],
      dataFlag: {},
      deleteDialog: false,
      selectedCompanyID: null,
    }
  },
  watch: {
    pageSize(value) {
      this.getCompanyLst()
    },
    currentPage(value) {
      this.getCompanyLst()
    },
    "newProduct.Country"(value) {
      this.newProduct.Area = this.areaLst.find(
        p => p.ValueName == value,
      ).ValueName2
    },
  },
  created() {
    this.getCompanyLst()
    this.getCountryLstByUserID()
  },
  methods: {
    confirmDelete(companyID) {
      this.selectedCompanyID = companyID
      this.deleteDialog = true
    },
    deleteCompany() {
      DelCompanyInfo({ Data: this.selectedCompanyID }).then(res => {
        if (res.RespCode === 0) {
          this.deleteDialog = false
          this.getCompanyLst()
          notify({
            type: "success",
            title: "Xoá thành công",
          })
        } else {
          notify({
            type: "error",
            title: "Xoá thất bại",
            text: res.RespText,
          })
        }
      })
    },
    btClose() {
      this.isShowCompany = false
      this.isShowAddCompany = false
      this.getCompanyLst()
    },
    btShowInfo(data) {
      this.isShowCompany = true
      this.companyInfo = data
    },

    getCountryLstByUserID() {
      GetCountryLstByUserID({}).then(res => {
        this.countryLst = res.Data
      })
    },
    btPage(data) {
      this.currentPage = data
    },
    btRow(data) {
      this.pageSize = data
    },
    getCompanyLst() {
      this.loadding = true

      const searchString = [
        this.country,
        this.companyName,
        this.phone,
        this.customerName,
        this.email,
        this.employeeCare,
        this.flagName,
      ].join("|")

      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString,
      }

      GetCompanyLst(requestData).then(res => {
        if (res.RespCode == 0) {
          this.productLst = res.CompanyLst.map((item, index) => {
            var num = this.pageSize * (this.currentPage - 1)
            
            return {
              ...item,
              Key: index + 1 + num,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            }
          })
          this.totalLength = res.TotalRows
          this.dataFlag = res
        }
        this.loadding = false
      })
    },
    getDefaultValue() {
      GetDefaultValue({
        Table: "Khu vực",
      }).then(res => {
        this.areaLst = res.DefaultValueLst
      })
    },
    openCreateProductDialog() {
      this.isCreateProductDialog = true
    },
    openAddCompanyDialog() {
      this.isShowAddCompany = true
    },
    addCompany() {
      // Implement the logic to add the new company
      UpdateCompanyLst({ Data: [{ ...this.newCompany }] }).then(res => {
        if (res.RespCode == 0) {
          this.isShowAddCompany = false
          this.getCompanyLst()
          notify({
            type: "success",
            title: "Thành công",
          })
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.RespText,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.number-flag {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 7px 12px;
  padding-right: 4px;
  .number {
    margin-right: 12px;
    line-height: 24px;
  }
}
</style>

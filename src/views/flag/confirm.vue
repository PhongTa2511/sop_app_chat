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
            <VTextField
              v-model="companyName"
              label="Tên công ty"
              hide-details
              style="width: 180px !important"
              clearable
            />
          </span>
          <span>
            <VTextField
              v-model="phone"
              label="Số điện thoại"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>

          <span>
            <VTextField
              v-model="email"
              label="Email"
              hide-details
              style="width: 150px !important"
              clearable
            />
          </span>

          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getCompanyGreenLst"
          />
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
      </template>
      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status == 1 || item.Status == 2"
          color="blue"
        >
          Mới tạo
        </VChip>
        <VChip
          v-if="item.Status == 4"
          color="green"
        >
          Đã duyệt
        </VChip>
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
          {{ item.CustomerName }}
        </div>
        <div>
          {{ item.Phone }}
        </div>
        <div>
          {{ item.Email }}
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
        :row-i-d="companyInfo.RowID"
        @btClose="btClose"
      />
    </VDialog>
  </VCard>
</template>

<script>
import { GetCompanyGreenLst, GetCountryLstByUserID } from "@/api/companyApi"
import { GetDefaultValue } from "@/api/default"
import { formatDateDisplayDDMMYY } from "@/helpers/getTime"
import InfoCompany from "./components/index-confirm.vue"

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
          width: 80,
        },
        { title: "Công ty", key: "CompanyName", sortable: false },
        { title: "Đại diện", key: "Delegate", sortable: false },
        { title: "Nhóm", key: "GroupName", sortable: false },

        {
          title: "Người đăng ký",
          key: "EmployeeName",
          sortable: false,
        },
        { title: "", key: "Status", sortable: false },
      ],
      pageSize: 25,
      currentPage: 1,
      productLst: [],
      totalLength: 0,
      loadding: false,
      product: "",
      companyName: "",
      country: null,
      phone: "",
      email: "",
      countryLst: [],
      isShowCompany: false,
      newProduct: {},
      companyInfo: {},
      isShowAddCompany: false,
      newCompany: {},
    }
  },
  watch: {
    pageSize(value) {
      this.getCompanyGreenLst()
    },
    currentPage(value) {
      this.getCompanyGreenLst()
    },
    "newProduct.Country"(value) {
      this.newProduct.Area = this.areaLst.find(
        p => p.ValueName == value,
      ).ValueName2
    },
  },
  created() {
    this.getCompanyGreenLst()
    this.getCountryLstByUserID()
  },
  methods: {
    getCountryLstByUserID() {
      GetCountryLstByUserID({}).then(res => {
        this.countryLst = res.Data
      })
    },
    btClose() {
      this.isShowCompany = false
    },
    btShowInfo(data) {
      this.isShowCompany = true
      this.companyInfo = data
    },

    btPage(data) {
      this.currentPage = data
    },
    btRow(data) {
      this.pageSize = data
    },
    getCompanyGreenLst() {
      this.loadding = true

      const searchString = [
        this.country,
        this.companyName,
        this.phone,
        this.email,
      ].join("|")

      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: "",
      }

      GetCompanyGreenLst(requestData).then(res => {
        if (res.RespCode == 0) {
          this.productLst = res.Data.map((item, index) => {
            var num = this.pageSize * (this.currentPage - 1)
            
            return {
              ...item,
              Key: index + 1 + num,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            }
          })
          this.totalLength = res.TotalRows
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
  },
}
</script>

<style></style>

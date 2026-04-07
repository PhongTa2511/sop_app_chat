<template>
  <VCard class="pt-2">
    <VDataTable
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 168px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      :loading="loadding"
      fixed-header
      hide-default-footer
    >
      <template #top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <VAutocomplete
              v-model="country"
              label="Quốc gia"
              :items="countryLst"
              hide-details
              style="width: 400px !important"
              item-title="Title"
              item-value="Country"
            />
          </span>

          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getCountryLawLst"
          />
          <VBtn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="btShowAddLaw"
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
    </VDataTable>
  </VCard>
  <VDialog
    v-model="isShowAddLaw"
    max-width="450px"
    scrollable
    transition="slide-y-transition"
  >
    <VCard>
      <VCardTitle class="text-h6">
        Thêm Law mới cho - {{ country }}
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.CustomerName"
              label="Khách hàng"
              required
            />
          </VCol>
          <VCol cols="12">
            <VAutocomplete
              v-model="lawInfo.ProductType"
              label="Phân loại"
              :items="productTypeLst"
              hide-details
              item-title="ValueName"
              item-value="ValueName"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.DocumentName"
              label="Tên hồ sơ"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.DocumentType"
              label="Loại hồ sơ"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.ContentLast"
              label="Nội dung thống nhất"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.LinkFile"
              label="Link tài liệu"
              required
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue"
          variant="text"
          @click="isShowAddLaw = false"
        >
          Đóng
        </VBtn>
        <VBtn
          color="green"
          variant="text"
          @click="updateCountryLawLst"
        >
          Cập nhật
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog
    v-model="isShowInfo"
    max-width="450px"
    persistent
    scrollable
    transition="slide-y-transition"
  >
    <VCard>
      <VCardTitle class="text-h6">
        Cập nhật Law cho - {{ country }}
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.CustomerName"
              label="Khách hàng"
              required
            />
          </VCol>
          <VCol cols="12">
            <VAutocomplete
              v-model="lawInfo.ProductType"
              label="Phân loại"
              :items="productTypeLst"
              hide-details
              item-title="ValueName"
              item-value="ValueName"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.DocumentName"
              label="Tên hồ sơ"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.DocumentType"
              label="Loại hồ sơ"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.ContentLast"
              label="Nội dung thống nhất"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="lawInfo.LinkFile"
              label="Link tài liệu"
              required
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue"
          variant="text"
          @click="isShowInfo = false"
        >
          Đóng
        </VBtn>
        <VBtn
          color="red"
          variant="text"
          @click="updateCountryLawLst(0)"
        >
          Xóa
        </VBtn>
        <VBtn
          color="green"
          variant="text"
          @click="updateCountryLawLst(2)"
        >
          Cập nhật
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  GetCountryLawLst,
  GetCountryLstNumber,
  UpdateCountryLawLst,
} from "@/api/countryApi"
import { GetDefaultValue } from "@/api/default"
import { formatDateDisplayDDMMYY } from "@/helpers/getTime"

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
        { title: "Khách hàng", key: "CustomerName", sortable: false },
        { title: "Phân loại", key: "ProductType", sortable: false },
        { title: "Tên hồ sơ", key: "DocumentName", sortable: false },

        {
          title: "Loại hồ sơ",
          key: "DocumentType",
          sortable: false,
        },
        { title: "ND thống nhất", key: "ContentLast", sortable: false },
        { title: "Tệp đính kèm", key: "LinkFile", sortable: false },
        { title: "Ngày tạo", key: "ExpDateShow", sortable: false },
      ],
      productTypeLst: [],
      productLst: [],

      loadding: false,
      product: "",

      lawInfo: {},
      isShowAddLaw: false,
      isShowInfo: false,
      countryLst: [],
      country: null,
    }
  },
  watch: {
    country(newVal) {
      if (!newVal) return
      this.$router.push({
        path: this.$route.path,
        query: { country: newVal }, // Chuyển đổi searchParams thành đối tượng
      })
      this.getCountryLawLst()
    },
  },

  created() {
    this.getCountryLstNumber()
    this.getDefaultValue()
  },

  methods: {
    btShowInfo(data) {
      this.isShowInfo = true
      this.lawInfo = {
        ...data,
      }
    },
    btShowAddLaw() {
      this.isShowAddLaw = true
      this.lawInfo = {
        Country: this.country,
      }
    },
    getCountryLstNumber() {
      GetCountryLstNumber({ Country: this.country }).then(res => {
        if (res.RespCode == 0) {
          this.countryLst = res.Data.map(item => {
            return {
              ...item,
              Title: item.Country + " - SL Law: " + item.Quantity,
            }
          })
          if (this.$route.query.country) {
            this.country = this.$route.query.country
            this.getCountryLawLst()
          } else {
            this.country =
              this.countryLst.length > 0 ? this.countryLst[0].Country : null
            this.$router.push({
              path: this.$route.path,
              query: { country: this.country }, // Chuyển đổi searchParams thành đối tượng
            })
            this.getCountryLawLst()
          }
        }
      })
    },
    btSelectCountry(data) {
      this.country = data
      this.getCountryLawLst()
    },
    getCountryLawLst() {
      this.loadding = true

      GetCountryLawLst({ Country: this.country }).then(res => {
        if (res.RespCode == 0) {
          this.productLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              ExpDateShow: formatDateDisplayDDMMYY(item.TimeCreate),
            }
          })
        }
        this.loadding = false
      })
    },
    getDefaultValue() {
      GetDefaultValue({ Table: "Phân loại đối tượng" }).then(res => {
        if (res.RespCode == 0) {
          this.productTypeLst = res.DefaultValueLst
        }
      })
    },
    updateCountryLawLst(status) {
      UpdateCountryLawLst({
        Data: {
          ...this.lawInfo,
          Status: status == 0 ? status : 2,
          DocumentID: this.$route.query.DocumentID || null,
          StepID: this.$route.query.StepID || null,
        },
      }).then(res => {
        if (res.RespCode == 0) {
          this.isShowAddLaw = false
          this.isShowInfo = false
          this.getCountryLawLst()
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

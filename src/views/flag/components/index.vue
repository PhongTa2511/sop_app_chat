<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex">
        <h6 class="text-h6 pt-2">
          Thông tin công ty
        </h6>

        <VBtn
          v-if="companyInfo.IsFlag == 4"
          variant="text"
          color="green"
          icon="mdi-flag-variant"
        />
        <VBtn
          v-if="companyInfo.IsFlag == 2"
          variant="text"
          color="yellow"
          icon="mdi-flag-variant"
        />
        <VBtn
          v-if="companyInfo.IsFlag == 1"
          variant="text"
          color="grey"
          icon="mdi-flag-variant"
        />
      </div>
    </VCardTitle>
    <VCardText>
      <VTextField
        v-model="companyInfo.CompanyName"
        label="Công ty"
        class="mb-2"
      />
      <VTextField
        v-model="companyInfo.GroupName"
        label="Nhóm"
        class="mb-2"
      />

      <VRow>
        <VCol cols="6">
          <VTextField
            v-model="companyInfo.Delegate"
            label="Khách hàng"
            class="mb-2"
          />
          <VTextField
            v-model="companyInfo.EmployeeName"
            label="Phụ trách"
            readonly
          />
          <VSelect
            v-model="companyInfo.Country"
            placeholder="Chọn quốc gia"
            label="Quốc gia"
            density="compact"
            :items="countryLst"
            item-value="Country"
            item-title="Country"
            class="my-2"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            v-model="companyInfo.Phone"
            label="SĐT"
            class="mb-2"
          />

          <VDateInput
            v-model="companyInfo.DateCare"
            label="Ngày phụ trách (mm/dd/yyyy)"
            readonly
            hide-details
          />
          <VSelect
            v-model="companyInfo.RankName"
            placeholder="Level"
            label="Level"
            density="compact"
            :items="rankLst"
            item-value="value"
            item-title="value"
            class="my-2"
          />
        </VCol>
      </VRow>
      <VBtn
        size="small"
        @click="btShowAddCus"
      >
        Thêm
      </VBtn>
      <VDataTableServer
        v-if="companyInfo.Data"
        no-data-text="Không có dữ liệu"
        :headers="headers"
        :items="companyInfo.Data"
        sort-asc-icon="mdi-menu-up"
        sort-desc-icon="mdi-menu-down"
        :hide-default-footer="true"
        :disable-pagination="true"
        :items-per-page="-1"
        class="table-pres"
        style="border: none"
        :items-length="companyInfo.Data.length"
      >
        <template #item.Key="{ item }">
          {{ item.Key }}
          <VIcon
            v-if="item.IsEdit"
            color="primary"
            size="small"
            class="me-2"
            @click="btShowInfoCustomer(item)"
          >
            mdi-pencil
          </VIcon>
          <VIcon
            v-if="item.IsFlag && item.IsFlag != 4 && companyInfo.IsFlag != 4"
            color="green"
            size="small"
            variant="tonal"
            @click="btCreateCompanyGreen(item)"
          >
            mdi-flag-plus
          </VIcon>
        </template>
        <template #item.CustomerName="{ item }">
          <div>
            {{ item.CustomerName }}
          </div>
          <div style="color: blue">
            {{ item.Position }}
          </div>
        </template>
        <template #item.Phone="{ item }">
          <div>
            {{ item.Phone }}
          </div>
          <div style="font-size: 12px">
            {{ item.TimePhoneShow }}
          </div>
          <div style="color: blue">
            {{ item.Email }}
          </div>
        </template>
        <template #item.Action="{ item }">
          <VIcon
            v-if="item.IsEdit"
            color="error"
            size="small"
            class="me-2"
            @click="removeCustomer(item)"
          >
            mdi-delete
          </VIcon>
        </template>
        <template #item.IsFlag="{ item }">
          <VBtn
            v-if="item.IsFlag == 4"
            variant="text"
            color="green"
            icon="mdi-flag-variant"
          />
          <VBtn
            v-if="item.IsFlag == 2"
            variant="text"
            color="yellow"
            icon="mdi-flag-variant"
          />
          <VBtn
            v-if="item.IsFlag == 1"
            variant="text"
            color="grey"
            icon="mdi-flag-variant"
          />
        </template>
      </VDataTableServer>
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="blue-darken-1"
        variant="text"
        @click="btClose"
      >
        Đóng
      </VBtn>

      <VBtn @click="updateCompanyInfo">
        Lưu thông tin
      </VBtn>
    </VCardActions>
  </VCard>
  <VDialog
    v-model="isShowCustomer"
    persistent
    width="500"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Thông tin khách hàng cá nhân
        </h6>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            lg="6"
          >
            <VTextField
              v-model="customerInfo.CustomerName"
              label="Tên khách hàng"
              hide-details
              required
            />
          </VCol>

          <VCol
            cols="12"
            lg="6"
          >
            <VTextField
              v-model="customerInfo.Phone"
              label="Số điện thoại"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            lg="6"
          >
            <VTextField
              v-model="customerInfo.Email"
              label="Email"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            lg="6"
          >
            <VTextField
              v-model="customerInfo.Position"
              label="Chức vụ"
              hide-details
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue-darken-1"
          variant="text"
          @click="isShowCustomer = false"
        >
          Đóng
        </VBtn>

        <VBtn @click="addInfoCus">
          Lưu thông tin
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isConfirmDelete"
    persistent
    width="400"
  >
    <VCard>
      <VCardTitle>
        <h6 class="text-h6 pt-2">
          Xác nhận xóa
        </h6>
      </VCardTitle>
      <VCardText class="mx-2">
        Bạn có chắc chắn muốn xóa khách hàng này?
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn @click="isConfirmDelete = false">
          Hủy
        </VBtn>
        <VBtn
          color="error"
          @click="confirmRemoveCustomer"
        >
          Xóa
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  DelCompanyCustomer,
  GetCompanyInfoByID,
  UpdateCompanyGreen,
  UpdateCompanyInfo,
} from "@/api/companyApi"
import { formatDateDDMMYY } from "@/helpers/getTime"
import { getUserName } from "@/utils/auth"

export default {
  props: {
    companyID: Number,
    countryLst: Array,
  },
  emits: ["btClose"],
  data() {
    return {
      companyInfo: {},
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 80 },
        { title: "Khách hàng", key: "CustomerName", sortable: false },
        {
          title: "Liên hệ",
          key: "Phone",
          sortable: false,
          align: "center",
        },
        {
          title: "Người tạo",
          key: "CreateName",
          sortable: false,
          align: "center",
        },
        {
          title: "Cờ",
          key: "IsFlag",
          sortable: false,
          align: "center",
        },
        { title: "", key: "Action", sortable: false, align: "center" },
      ],
      rankLst: [
        {
          value: "Khởi động",
        },
        {
          value: "Tiềm năng",
        },
        {
          value: "Trung thành",
        },
      ],
      customerInfo: {},
      isShowCustomer: false,
      isConfirmDelete: false,
      customerToDelete: null,
      userName: getUserName(),
    }
  },
  watch: {
    "customerInfo.Phone"(value) {
      this.customerInfo.Phone = value.replace(/\D/g, "")
    },
  },
  created() {
    if (this.companyID) {
      this.getCompanyInfoByID()
    }
  },
  methods: {
    btCreateCompanyGreen(data) {
      UpdateCompanyGreen({
        Data: [{ CompanyID: this.companyID, CustomerID: data.RowID }],
      }).then(res => {
        if (res.RespCode == 0) {
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
    btShowAddCus() {
      this.isShowCustomer = true
      this.customerInfo = {}
    },

    updateCompanyInfo() {
      if (this.companyInfo.Country) {
        UpdateCompanyInfo({ Data: [{ ...this.companyInfo }] }).then(res => {
          if (res.RespCode == 0) {
            notify({
              type: "success",
              title: "Thành công",
            })

            //this.btClose();
          } else {
            notify({
              type: "error",
              title: "Lỗi",
              text: res.RespText,
            })
          }
        })
      } else {
        notify({
          type: "error",
          title: "Lỗi",
          text: "Chưa chọn quốc gia",
        })
      }
    },
    addInfoCus() {
      this.isShowCustomer = false
      if (!this.companyInfo.Data) {
        this.companyInfo.Data = []
      }
      var check = this.companyInfo.Data.find(
        p => p.Key == this.customerInfo.Key,
      )
      if (!check) {
        this.companyInfo.Data.push({
          ...this.customerInfo,
          IsFlag: this.customerInfo.Phone != "" ? 2 : 1,
        })
        this.companyInfo.Data = this.companyInfo.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          }
        })
      }
    },
    btShowInfoCustomer(data) {
      this.customerInfo = data
      this.isShowCustomer = true
    },
    removeCustomer(data) {
      this.customerToDelete = data
      this.isConfirmDelete = true
    },
    confirmRemoveCustomer() {
      this.isConfirmDelete = false

      DelCompanyCustomer({
        Data: this.customerToDelete.RowID,
      }).then(res => {
        if (res.RespCode == 0) {
          this.companyInfo.Data = this.companyInfo.Data.filter(
            p => p.Key != this.customerToDelete.Key,
          )
          notify({
            type: "success",
            title: "Thành công",
          })
          this.customerToDelete = null
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.RespText,
          })
        }
      })
    },
    btClose() {
      this.$emit("btClose")
    },
    getCompanyInfoByID() {
      GetCompanyInfoByID({
        CompanyID: this.companyID,
      }).then(res => {
        this.companyInfo = res.CompanyInfo

        this.companyInfo.Data = this.companyInfo.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
            TimePhoneShow: formatDateDDMMYY(item.TimePhone),
            IsEdit:
              this.userName == "0385217528" ||
              this.userName == "0985770713" ||
              this.userName == "0827258288"
                ? true
                : false,
          }
        })
        console.log("anht", this.companyInfo.Data)
      })
    },
  },
}
</script>

<style></style>

<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex">
        <h6 class="text-h6 pt-2">
          Phê duyệt cờ xanh công ty
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
      <!-- <v-btn size="small" @click="btShowAddCus">Thêm</v-btn> -->
      <VDataTableServer
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
      >
        <template #item.Key="{ item }">
          {{ item.Key }}
          <!--
            <v-icon
            color="primary"
            size="small"
            class="me-2"
            @click="btShowInfoCustomer(item)"
            >mdi-pencil
            </v-icon> 
          -->
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
          <div style="color: blue">
            {{ item.Email }}
          </div>
        </template>
        <!--
          <template v-slot:item.Action="{ item }">
          <v-icon
          color="error"
          size="small"
          class="me-2"
          @click="removeCustomer(item)"
          >mdi-delete
          </v-icon>
          </template> 
        -->
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

      <VBtn
        color="red"
        @click="updateCompanyInfo(0)"
      >
        Từ chối
      </VBtn>
      <VBtn
        color="green"
        @click="updateCompanyInfo(4)"
      >
        Duyệt cờ xanh
      </VBtn>
      <VSpacer />
    </VCardActions>
  </VCard>
</template>

<script>
import { ApproveCompanyGreen, GetCompanyInfoByID } from "@/api/companyApi"

export default {
  props: {
    companyID: String,
    rowID: Number,
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

      customerInfo: {},
      isShowCustomer: false,
      isConfirmDelete: false,
      customerToDelete: null,
    }
  },
  created() {
    this.getCompanyInfoByID()
  },

  methods: {
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
          }
        })
      })
    },
    updateCompanyInfo(status) {
      const rowID = this.rowID // Assuming RowID is part of companyInfo

      ApproveCompanyGreen({ Data: rowID, Status: status }).then(res => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
          })
          this.btClose()
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

<style></style>

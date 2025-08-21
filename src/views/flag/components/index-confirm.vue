<template>
  <v-card>
    <v-card-title>
      <div class="d-flex">
        <h6 class="text-h6 pt-2">Phê duyệt cờ xanh công ty</h6>

        <v-btn
          variant="text"
          color="green"
          icon="mdi-flag-variant"
          v-if="companyInfo.IsFlag == 4"
        ></v-btn>
        <v-btn
          variant="text"
          color="yellow"
          icon="mdi-flag-variant"
          v-if="companyInfo.IsFlag == 2"
        ></v-btn>
        <v-btn
          variant="text"
          color="grey"
          icon="mdi-flag-variant"
          v-if="companyInfo.IsFlag == 1"
        ></v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-text-field
        label="Công ty"
        v-model="companyInfo.CompanyName"
        class="mb-2"
      ></v-text-field>
      <v-text-field
        label="Nhóm"
        v-model="companyInfo.GroupName"
        class="mb-2"
      ></v-text-field>
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Phụ trách"
            v-model="companyInfo.EmployeeName"
            readonly
          ></v-text-field>
          <v-select
            v-model="companyInfo.Country"
            placeholder="Chọn quốc gia"
            label="Quốc gia"
            density="compact"
            :items="countryLst"
            item-value="Country"
            item-title="Country"
            class="my-2"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-date-input
            label="Ngày phụ trách (mm/dd/yyyy)"
            v-model="companyInfo.DateCare"
            readonly
            hide-details
          ></v-date-input>
          <v-select
            v-model="companyInfo.RankName"
            placeholder="Level"
            label="Level"
            density="compact"
            :items="rankLst"
            item-value="value"
            item-title="value"
            class="my-2"
          ></v-select>
        </v-col>
      </v-row>
      <!-- <v-btn size="small" @click="btShowAddCus">Thêm</v-btn> -->
      <v-data-table-server
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
        <template v-slot:item.Key="{ item }">
          {{ item.Key }}
          <!-- <v-icon
            color="primary"
            size="small"
            class="me-2"
            @click="btShowInfoCustomer(item)"
            >mdi-pencil
          </v-icon> -->
        </template>
        <template v-slot:item.CustomerName="{ item }">
          <div>
            {{ item.CustomerName }}
          </div>
          <div style="color: blue">
            {{ item.Position }}
          </div>
        </template>
        <template v-slot:item.Phone="{ item }">
          <div>
            {{ item.Phone }}
          </div>
          <div style="color: blue">
            {{ item.Email }}
          </div>
        </template>
        <!-- <template v-slot:item.Action="{ item }">
          <v-icon
            color="error"
            size="small"
            class="me-2"
            @click="removeCustomer(item)"
            >mdi-delete
          </v-icon>
        </template> -->
        <template v-slot:item.IsFlag="{ item }">
          <v-btn
            variant="text"
            color="green"
            icon="mdi-flag-variant"
            v-if="item.IsFlag == 4"
          ></v-btn>
          <v-btn
            variant="text"
            color="yellow"
            icon="mdi-flag-variant"
            v-if="item.IsFlag == 2"
          ></v-btn>
          <v-btn
            variant="text"
            color="grey"
            icon="mdi-flag-variant"
            v-if="item.IsFlag == 1"
          ></v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue-darken-1" variant="text" @click="btClose">
        Đóng
      </v-btn>

      <v-btn color="red" @click="updateCompanyInfo(0)"> Từ chối </v-btn>
      <v-btn color="green" @click="updateCompanyInfo(4)"> Duyệt cờ xanh </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import { ApproveCompanyGreen, GetCompanyInfoByID } from "@/api/companyApi";
export default {
  props: {
    companyID: String,
    rowID: Number,
  },
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
    };
  },
  emits: ["btClose"],

  methods: {
    btClose() {
      this.$emit("btClose");
    },
    getCompanyInfoByID() {
      GetCompanyInfoByID({
        CompanyID: this.companyID,
      }).then((res) => {
        this.companyInfo = res.CompanyInfo;

        this.companyInfo.Data = this.companyInfo.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          };
        });
      });
    },
    updateCompanyInfo(status) {
      const rowID = this.rowID; // Assuming RowID is part of companyInfo
      ApproveCompanyGreen({ Data: rowID, Status: status }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
          });
          this.btClose();
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.RespText,
          });
        }
      });
    },
  },
  created() {
    this.getCompanyInfoByID();
  },
};
</script>

<style></style>

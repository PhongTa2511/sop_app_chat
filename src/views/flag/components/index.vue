<template>
  <v-card>
    <v-card-title>
      <div class="d-flex">
        <h6 class="text-h6 pt-2">Thông tin công ty</h6>

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
            label="Khách hàng"
            v-model="companyInfo.Delegate"
            class="mb-2"
          ></v-text-field>
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
          <v-text-field
            label="SĐT"
            class="mb-2"
            v-model="companyInfo.Phone"
          ></v-text-field>

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
      <v-btn size="small" @click="btShowAddCus">Thêm</v-btn>
      <v-data-table-server
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
        :itemsLength="companyInfo.Data.length"
      >
        <template v-slot:item.Key="{ item }">
          {{ item.Key }}
          <v-icon
            v-if="item.IsEdit"
            color="primary"
            size="small"
            class="me-2"
            @click="btShowInfoCustomer(item)"
            >mdi-pencil
          </v-icon>
          <v-icon
            color="green"
            size="small"
            variant="tonal"
            @click="btCreateCompanyGreen(item)"
            v-if="item.IsFlag && item.IsFlag != 4 && companyInfo.IsFlag != 4"
            >mdi-flag-plus
          </v-icon>
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
          <div style="font-size: 12px">
            {{ item.TimePhoneShow }}
          </div>
          <div style="color: blue">
            {{ item.Email }}
          </div>
        </template>
        <template v-slot:item.Action="{ item }">
          <v-icon
            v-if="item.IsEdit"
            color="error"
            size="small"
            class="me-2"
            @click="removeCustomer(item)"
            >mdi-delete
          </v-icon>
        </template>
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
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="btClose">
        Đóng
      </v-btn>

      <v-btn @click="updateCompanyInfo"> Lưu thông tin </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="isShowCustomer" persistent width="500">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Thông tin khách hàng cá nhân</h6>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="6">
            <v-text-field
              v-model="customerInfo.CustomerName"
              label="Tên khách hàng"
              hide-details
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" lg="6">
            <v-text-field
              label="Số điện thoại"
              v-model="customerInfo.Phone"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" lg="6">
            <v-text-field
              label="Email"
              v-model="customerInfo.Email"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" lg="6">
            <v-text-field
              label="Chức vụ"
              v-model="customerInfo.Position"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowCustomer = false"
        >
          Đóng
        </v-btn>

        <v-btn @click="addInfoCus"> Lưu thông tin </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isConfirmDelete" persistent width="400">
    <v-card>
      <v-card-title>
        <h6 class="text-h6 pt-2">Xác nhận xóa</h6>
      </v-card-title>
      <v-card-text class="mx-2">
        Bạn có chắc chắn muốn xóa khách hàng này?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="isConfirmDelete = false">Hủy</v-btn>
        <v-btn color="error" @click="confirmRemoveCustomer">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  DelCompanyCustomer,
  GetCompanyInfoByID,
  UpdateCompanyGreen,
  UpdateCompanyInfo,
} from "@/api/company";
import { formatDateDDMMYY } from "@/helpers/getTime";
import { getUserName } from "@/utils/auth";
export default {
  props: {
    companyID: Number,
    countryLst: Array,
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
    };
  },
  emits: ["btClose"],
  watch: {
    "customerInfo.Phone"(value) {
      this.customerInfo.Phone = value.replace(/\D/g, "");
    },
  },
  methods: {
    btCreateCompanyGreen(data) {
      UpdateCompanyGreen({
        Data: [{ CompanyID: this.companyID, CustomerID: data.RowID }],
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
    },
    btShowAddCus() {
      this.isShowCustomer = true;
      this.customerInfo = {};
    },

    updateCompanyInfo() {
      if (this.companyInfo.Country) {
        UpdateCompanyInfo({ Data: [{ ...this.companyInfo }] }).then((res) => {
          if (res.RespCode == 0) {
            notify({
              type: "success",
              title: "Thành công",
            });
            //this.btClose();
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
          text: "Chưa chọn quốc gia",
        });
      }
    },
    addInfoCus() {
      this.isShowCustomer = false;
      if (!this.companyInfo.Data) {
        this.companyInfo.Data = [];
      }
      var check = this.companyInfo.Data.find(
        (p) => p.Key == this.customerInfo.Key
      );
      if (!check) {
        this.companyInfo.Data.push({
          ...this.customerInfo,
          IsFlag: this.customerInfo.Phone != "" ? 2 : 1,
        });
        this.companyInfo.Data = this.companyInfo.Data.map((item, index) => {
          return {
            ...item,
            Key: index + 1,
          };
        });
      }
    },
    btShowInfoCustomer(data) {
      this.customerInfo = data;
      this.isShowCustomer = true;
    },
    removeCustomer(data) {
      this.customerToDelete = data;
      this.isConfirmDelete = true;
    },
    confirmRemoveCustomer() {
      this.isConfirmDelete = false;

      DelCompanyCustomer({
        Data: this.customerToDelete.RowID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.companyInfo.Data = this.companyInfo.Data.filter(
            (p) => p.Key != this.customerToDelete.Key
          );
          notify({
            type: "success",
            title: "Thành công",
          });
          this.customerToDelete = null;
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.RespText,
          });
        }
      });
    },
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
            TimePhoneShow: formatDateDDMMYY(item.TimePhone),
            IsEdit:
              this.userName == "0385217528" ||
              this.userName == "0985770713" ||
              this.userName == "0827258288"
                ? true
                : false,
          };
        });
        console.log("anht", this.companyInfo.Data);
      });
    },
  },
  created() {
    if (this.companyID) {
      this.getCompanyInfoByID();
    }
  },
};
</script>

<style></style>

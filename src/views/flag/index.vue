<template>
  <v-card class="pt-4">
    <v-data-table-server
      :items-per-page="pageSize"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 210px)"
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
    >
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-3">
          <span>
            <v-autocomplete
              v-model="country"
              label="Quốc gia"
              :items="countryLst"
              hide-details
              style="width: 250px !important"
              item-title="Country"
              item-value="Country"
              multiple
            ></v-autocomplete>
          </span>
          <span>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                >
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-text-field
                    v-model="companyName"
                    label="Tên công ty"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  ></v-text-field>

                  <v-text-field
                    v-model="phone"
                    label="Số điện thoại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  ></v-text-field>

                  <v-text-field
                    v-model="customerName"
                    label="Khách hàng"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    label="Email"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  ></v-text-field>
                  <v-text-field
                    v-model="employeeCare"
                    label="Phụ trách"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                    @keyup.enter="getCompanyLst"
                  ></v-text-field>
                  <v-autocomplete
                    class="pt-2"
                    v-model="flagName"
                    prepend-inner-icon="mdi-magnify"
                    label="Chọn cờ"
                    :items="flagLst"
                    hide-details
                    style="width: 250px !important"
                    item-title="text"
                    item-value="value"
                    clearable
                  ></v-autocomplete>
                  <v-btn block class="rounded mt-2" @click="getCompanyLst"
                    >Tìm kiếm</v-btn
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </span>

          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getCompanyLst"
          ></v-btn>

          <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="openAddCompanyDialog"
          ></v-btn>
          <div class="number-flag">
            <v-icon color="green"> mdi-flag-variant </v-icon>
            <span class="number">{{ dataFlag.FlagGreen }}</span>
            <v-icon color="yellow"> mdi-flag-variant </v-icon>
            <span class="number">{{ dataFlag.FlagYellow }}</span>
            <v-icon color="grey"> mdi-flag-variant </v-icon>
            <span class="number">{{ dataFlag.FlagGrey }}</span>
          </div>
        </div>
      </template>

      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon
          color="orange"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="btShowInfo(item)"
          >mdi-note-edit</v-icon
        >
        <v-icon
          color="error"
          class="me-2"
          size="small"
          style="cursor: pointer"
          @click="confirmDelete(item.CompanyID)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.Phone="{ item }">
        <div>
          {{ item.Phone }}
        </div>
        <div>
          {{ item.Email }}
        </div>
      </template>
      <template v-slot:item.CompanyName="{ item }">
        <div>
          {{ item.CompanyName }}
        </div>
        <div style="color: blue">
          {{ item.Country }}
        </div>
      </template>
      <template v-slot:item.Delegate="{ item }">
        <div>
          {{ item.Delegate }}
        </div>
        <div style="color: blue">
          {{ item.GroupName }}
        </div>
      </template>

      <template v-slot:item.IsFlag="{ item }">
        <v-icon color="grey" v-if="item.IsFlag == 1">mdi-flag-variant</v-icon>
        <v-icon color="green" v-if="item.IsFlag == 4">mdi-flag-variant</v-icon>
        <v-icon color="yellow" v-if="item.IsFlag == 2">mdi-flag-variant</v-icon>
      </template>
    </v-data-table-server>

    <v-dialog v-model="isShowCompany" max-width="700px">
      <InfoCompany
        :companyID="companyInfo.CompanyID"
        :countryLst="countryLst"
        @btClose="btClose"
      />
    </v-dialog>

    <v-dialog v-model="isShowAddCompany" max-width="700px">
      <InfoCompany :countryLst="countryLst" @btClose="btClose" />
    </v-dialog>
  </v-card>
  <v-dialog v-model="deleteDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h6">Xác nhận xoá</v-card-title>
      <v-card-text>Bạn có chắc chắn muốn xoá công ty này không?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="deleteDialog = false"
          >Huỷ</v-btn
        >
        <v-btn color="red" variant="text" @click="deleteCompany">Xoá</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  DelCompanyInfo,
  GetCompanyLst,
  GetCountryLstByUserID,
  UpdateCompanyLst,
} from "@/api/company";
import { GetDefaultValue } from "@/api/default";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
import InfoCompany from "./components/index.vue";
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
    };
  },
  watch: {
    pageSize(value) {
      this.getCompanyLst();
    },
    currentPage(value) {
      this.getCompanyLst();
    },
    "newProduct.Country"(value) {
      this.newProduct.Area = this.areaLst.find(
        (p) => p.ValueName == value
      ).ValueName2;
    },
  },
  methods: {
    confirmDelete(companyID) {
      this.selectedCompanyID = companyID;
      this.deleteDialog = true;
    },
    deleteCompany() {
      DelCompanyInfo({ Data: this.selectedCompanyID }).then((res) => {
        if (res.RespCode === 0) {
          this.deleteDialog = false;
          this.getCompanyLst();
          notify({
            type: "success",
            title: "Xoá thành công",
          });
        } else {
          notify({
            type: "error",
            title: "Xoá thất bại",
            text: res.RespText,
          });
        }
      });
    },
    btClose() {
      this.isShowCompany = false;
      this.isShowAddCompany = false;
      this.getCompanyLst();
    },
    btShowInfo(data) {
      this.isShowCompany = true;
      this.companyInfo = data;
    },

    getCountryLstByUserID() {
      GetCountryLstByUserID({}).then((res) => {
        this.countryLst = res.Data;
      });
    },
    btPage(data) {
      this.currentPage = data;
    },
    btRow(data) {
      this.pageSize = data;
    },
    getCompanyLst() {
      this.loadding = true;
      const searchString = [
        this.country,
        this.companyName,
        this.phone,
        this.customerName,
        this.email,
        this.employeeCare,
        this.flagName,
      ].join("|");
      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString,
      };
      GetCompanyLst(requestData).then((res) => {
        if (res.RespCode == 0) {
          this.productLst = res.CompanyLst.map((item, index) => {
            var num = this.pageSize * (this.currentPage - 1);
            return {
              ...item,
              Key: index + 1 + num,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            };
          });
          this.totalLength = res.TotalRows;
          this.dataFlag = res;
        }
        this.loadding = false;
      });
    },
    getDefaultValue() {
      GetDefaultValue({
        Table: "Khu vực",
      }).then((res) => {
        this.areaLst = res.DefaultValueLst;
      });
    },
    openCreateProductDialog() {
      this.isCreateProductDialog = true;
    },
    openAddCompanyDialog() {
      this.isShowAddCompany = true;
    },
    addCompany() {
      // Implement the logic to add the new company
      UpdateCompanyLst({ Data: [{ ...this.newCompany }] }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowAddCompany = false;
          this.getCompanyLst();
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
  },
  created() {
    this.getCompanyLst();
    this.getCountryLstByUserID();
  },
};
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

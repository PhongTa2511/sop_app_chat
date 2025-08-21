<template>
  <v-card class="pt-2">
    <v-data-table-server
      :items-per-page="pageSize"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 270px)"
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
        <div class="d-flex flex-wrap gap-2 px-2">
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
            <v-text-field
              v-model="companyName"
              label="Tên công ty"
              hide-details
              style="width: 180px !important"
              clearable
            ></v-text-field>
          </span>
          <span>
            <v-text-field
              v-model="phone"
              label="Số điện thoại"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>

          <span>
            <v-text-field
              v-model="email"
              label="Email"
              hide-details
              style="width: 150px !important"
              clearable
            ></v-text-field>
          </span>

          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getCompanyGreenLst"
          ></v-btn>
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
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="blue" v-if="item.Status == 1 || item.Status == 2"
          >Mới tạo</v-chip
        >
        <v-chip color="green" v-if="item.Status == 4">Đã duyệt</v-chip>
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
          {{ item.CustomerName }}
        </div>
        <div>
          {{ item.Phone }}
        </div>
        <div>
          {{ item.Email }}
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
        :rowID="companyInfo.RowID"
        @btClose="btClose"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import { GetCompanyGreenLst, GetCountryLstByUserID } from "@/api/companyApi";
import { GetDefaultValue } from "@/api/default";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
import InfoCompany from "./components/index-confirm.vue";
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
    };
  },
  watch: {
    pageSize(value) {
      this.getCompanyGreenLst();
    },
    currentPage(value) {
      this.getCompanyGreenLst();
    },
    "newProduct.Country"(value) {
      this.newProduct.Area = this.areaLst.find(
        (p) => p.ValueName == value
      ).ValueName2;
    },
  },
  methods: {
    getCountryLstByUserID() {
      GetCountryLstByUserID({}).then((res) => {
        this.countryLst = res.Data;
      });
    },
    btClose() {
      this.isShowCompany = false;
    },
    btShowInfo(data) {
      this.isShowCompany = true;
      this.companyInfo = data;
    },

    btPage(data) {
      this.currentPage = data;
    },
    btRow(data) {
      this.pageSize = data;
    },
    getCompanyGreenLst() {
      this.loadding = true;
      const searchString = [
        this.country,
        this.companyName,
        this.phone,
        this.email,
      ].join("|");
      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: "",
      };
      GetCompanyGreenLst(requestData).then((res) => {
        if (res.RespCode == 0) {
          this.productLst = res.Data.map((item, index) => {
            var num = this.pageSize * (this.currentPage - 1);
            return {
              ...item,
              Key: index + 1 + num,
              ExpDateShow: formatDateDisplayDDMMYY(item.ExpDate),
            };
          });
          this.totalLength = res.TotalRows;
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
  },
  created() {
    this.getCompanyGreenLst();
    this.getCountryLstByUserID();
  },
};
</script>

<style></style>

<template>
  <v-card class="pt-4">
    <v-data-table
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 180px)"
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
      <template v-slot:top>
        <div class="d-flex flex-wrap gap-2 px-3">
          <span>
            <v-autocomplete
              v-model="country"
              label="Quốc gia"
              :items="countryLst"
              hide-details
              style="width: 400px !important"
              item-title="Title"
              item-value="Country"
            ></v-autocomplete>
          </span>

          <v-btn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getCountryLawLst"
          ></v-btn>
          <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="btShowAddLaw"
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
    </v-data-table>
  </v-card>
  <v-dialog
    v-model="isShowAddLaw"
    max-width="450px"
    scrollable
    transition="slide-y-transition"
  >
    <v-card>
      <v-card-title class="text-h6"
        >Thêm Law mới cho - {{ country }}</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.CustomerName"
              label="Khách hàng"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="lawInfo.ProductType"
              label="Phân loại"
              :items="productTypeLst"
              hide-details
              item-title="ValueName"
              item-value="ValueName"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.DocumentName"
              label="Tên hồ sơ"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.DocumentType"
              label="Loại hồ sơ"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.ContentLast"
              label="Nội dung thống nhất"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.LinkFile"
              label="Link tài liệu"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" variant="text" @click="isShowAddLaw = false"
          >Đóng</v-btn
        >
        <v-btn color="green" variant="text" @click="updateCountryLawLst"
          >Cập nhật</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="isShowInfo"
    max-width="450px"
    persistent
    scrollable
    transition="slide-y-transition"
  >
    <v-card>
      <v-card-title class="text-h6"
        >Cập nhật Law cho - {{ country }}</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.CustomerName"
              label="Khách hàng"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="lawInfo.ProductType"
              label="Phân loại"
              :items="productTypeLst"
              hide-details
              item-title="ValueName"
              item-value="ValueName"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.DocumentName"
              label="Tên hồ sơ"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.DocumentType"
              label="Loại hồ sơ"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.ContentLast"
              label="Nội dung thống nhất"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="lawInfo.LinkFile"
              label="Link tài liệu"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" variant="text" @click="isShowInfo = false"
          >Đóng</v-btn
        >
        <v-btn color="red" variant="text" @click="updateCountryLawLst(0)"
          >Xóa</v-btn
        >
        <v-btn color="green" variant="text" @click="updateCountryLawLst(2)"
          >Cập nhật</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  GetCountryLawLst,
  GetCountryLstNumber,
  UpdateCountryLawLst,
} from "@/api/countryApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
import { GetDefaultValue } from "@/api/default";
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
      country: "",
    };
  },
  watch: {
    country(newVal) {
      this.$router.push({
        path: this.$route.path,
        query: { country: newVal }, // Chuyển đổi searchParams thành đối tượng
      });
      this.getCountryLawLst();
    },
  },

  methods: {
    btShowInfo(data) {
      this.isShowInfo = true;
      this.lawInfo = {
        ...data,
      };
    },
    btShowAddLaw() {
      this.isShowAddLaw = true;
      this.lawInfo = {
        Country: this.country,
      };
    },
    getCountryLstNumber() {
      GetCountryLstNumber({ Country: this.country }).then((res) => {
        if (res.RespCode == 0) {
          this.countryLst = res.Data.map((item) => {
            return {
              ...item,
              Title: item.Country + " - SL Law: " + item.Quantity,
            };
          });
          if (this.$route.query.country) {
            this.country = this.$route.query.country;
            this.getCountryLawLst();
          } else {
            this.country =
              this.countryLst.length > 0 ? this.countryLst[0].Country : "";
            this.$router.push({
              path: this.$route.path,
              query: { country: this.country }, // Chuyển đổi searchParams thành đối tượng
            });
            this.getCountryLawLst();
          }
        }
      });
    },
    btSelectCountry(data) {
      this.country = data;
      this.getCountryLawLst();
    },
    getCountryLawLst() {
      this.loadding = true;

      GetCountryLawLst({ Country: this.country }).then((res) => {
        if (res.RespCode == 0) {
          this.productLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
              ExpDateShow: formatDateDisplayDDMMYY(item.TimeCreate),
            };
          });
        }
        this.loadding = false;
      });
    },
    getDefaultValue() {
      GetDefaultValue({ Table: "Phân loại đối tượng" }).then((res) => {
        if (res.RespCode == 0) {
          this.productTypeLst = res.DefaultValueLst;
        }
      });
    },
    updateCountryLawLst(status) {
      UpdateCountryLawLst({
        Data: {
          ...this.lawInfo,
          Status: status == 0 ? status : 2,
          DocumentID: this.$route.query.DocumentID || null,
          StepID: this.$route.query.StepID || null,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowAddLaw = false;
          this.isShowInfo = false;
          this.getCountryLawLst();
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
    this.getCountryLstNumber();
    this.getDefaultValue();
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

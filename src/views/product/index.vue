<template>
  <v-card class="py-2 pb-0">
    <v-data-table-server
      :items-per-page="pageSize"
      :items-length="totalLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="productLst"
      height="calc(100vh - 250px)"
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
        <div class="d-flex flex-wrap gap-1 px-2">
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
                    v-model="product"
                    label="Sản phẩm"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="name2"
                    label="Tên xuất khẩu"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="country"
                    label="Nước xk"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="area"
                    label="Khu vực"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>
                  <v-text-field
                    v-model="storeType"
                    label="Phân loại"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  ></v-text-field>

                  <v-btn block class="rounded mt-2" @click="getProductLst"
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
            @click="getProductLst"
          ></v-btn>
          <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-plus"
            size="small"
            @click="openCreateProductDialog"
          ></v-btn>
        </div>
      </template>

      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
      </template>
      <template v-slot:item.Action="{ item }">
        <div class="flex">
          <v-btn
            color="orange"
            size="x-small"
            style="cursor: pointer"
            @click="btShowInfo(item)"
            icon="mdi-note-edit"
            class="mr-1"
          ></v-btn>
          <v-btn
            color="red"
            size="x-small"
            style="cursor: pointer"
            icon="mdi-delete"
            @click="openDeleteDialog(item)"
          ></v-btn>
        </div>
      </template>
    </v-data-table-server>

    <v-dialog v-model="isCreateProductDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Tạo sản phẩm mới</span>
        </v-card-title>
        <v-card-text class="py-2">
          <v-row>
            <v-col
              cols="12"
              v-for="(line, indexline) in newProduct.FormLineLst"
              :key="indexline"
            >
              <v-text-field
                v-if="line.Type == 1"
                :label="line.Parameter"
                v-model="line.TextResult"
                :class="{ 'blur-text': line.IsPrivate == 1 }"
                :readonly="line.IsPrivate == 1"
              ></v-text-field>
              <v-autocomplete
                v-if="line.Type == 2"
                v-model="line.TextResult"
                :label="line.Parameter"
                :items="line.Options"
                item-value="Name"
                item-title="Name"
                chips
                hide-details
                :class="{ 'blur-text': line.IsPrivate == 1 }"
                :readonly="line.IsPrivate == 1"
              ></v-autocomplete>
              <v-autocomplete
                v-if="line.Type == 3"
                v-model="line.TextResult"
                :label="line.Parameter"
                :items="line.Options"
                item-value="value"
                item-title="text"
                chips
                hide-details
                :class="{ 'blur-text': line.IsPrivate == 1 }"
                :readonly="line.IsPrivate == 1"
              ></v-autocomplete>
              <div v-if="line.Type == 4">
                <V-DateField
                  v-model:modelValue="line.TextResult"
                  :label="line.Parameter"
                  width="100%"
                  :className="{ 'blur-text': line.IsPrivate == 1 }"
                  :readonly="line.IsPrivate == 1"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="isCreateProductDialog = false">Hủy</v-btn>
          <v-btn color="green" @click="createProduct">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Xóa sản phẩm</span>
        </v-card-title>
        <v-card-text> Bạn có chắc chắn muốn xóa sản phẩm này? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="isDeleteDialog = false">Hủy</v-btn>
          <v-btn color="red" @click="confirmDelete">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { GetDefaultValue } from "@/api/default";
import { UpdateDocumentForm } from "@/api/documentFormApi";
import { GetFormByID } from "@/api/procedureApi";
import { CreateProduct, DelProduct, GetProductLst } from "@/api/productApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";
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
        { title: "Mã", key: "ProductID", sortable: false },
        { title: "Sản phẩm", key: "ProductName", sortable: false },
        { title: "Tên xuất khẩu", key: "ProductExport", sortable: false },
        { title: "Nước xk", key: "Country", sortable: false },
        { title: "Khu vực", key: "Area", sortable: false, width: 120 },
        { title: "Phân loại", key: "StoreType", sortable: false },

        {
          title: "Người tạo",
          key: "CreateName",
          sortable: false,
        },
        {
          title: "",
          key: "Action",
          sortable: false,
          width: 100,
        },
      ],
      pageSize: 25,
      currentPage: 1,
      productLst: [],
      totalLength: 0,
      loadding: false,
      product: "",
      name2: "",
      country: "",
      area: "",
      storeType: "",
      areaLst: [],
      typeStorageLst: [],
      productDefaultLst: [],
      isCreateProductDialog: false,
      newProduct: {},
      idCreateProduct: "",
      isDeleteDialog: false,
      productToDelete: null,
    };
  },
  watch: {
    pageSize(value) {
      this.getProductLst();
    },
    currentPage(value) {
      this.getProductLst();
    },
    "newProduct.Country"(value) {
      this.newProduct.Area = this.areaLst.find(
        (p) => p.ValueName == value
      ).ValueName2;
    },
  },
  methods: {
    async getDefaultValue(table) {
      const res = await GetDefaultValue({
        Table: table,
      });

      if (res.RespCode == 0) {
        return res.DefaultValueLst.map((item) => ({
          ...item,
          value: item.ValueName,
          text: item.ValueName,
        }));
      }

      return [];
    },
    btShowInfo(data) {
      this.$router.push("/thong-tin-san-pham/" + data.ProductID);
    },
    async createProduct() {
      try {
        // 1️⃣ Lấy giá trị "Quốc gia"
        const country = this.newProduct.FormLineLst.find(
          (p) => p.Parameter === "Quốc gia"
        )?.TextResult;

        // 2️⃣ Gọi GetDefaultValue và chờ kết quả
        const resDefault = await GetDefaultValue({
          Table: `${country}|Khu vực`,
        });

        // 3️⃣ Nếu có data thì gán vào "Khu vực"
        if (
          resDefault.RespCode === 0 &&
          resDefault.DefaultValueLst.length > 0
        ) {
          const areaField = this.newProduct.FormLineLst.find(
            (p) => p.Parameter === "Khu vực"
          );
          if (areaField) {
            areaField.TextResult = resDefault.DefaultValueLst[0].ValueName2;
          }
        }

        // 4️⃣ Chuẩn bị Data cho CreateProduct
        const productData = {
          ...this.newProduct,
          ProductName: this.newProduct.FormLineLst.find(
            (p) => p.Parameter === "Tên sản phẩm"
          )?.TextResult,
          ProductExport: this.newProduct.FormLineLst.find(
            (p) => p.Parameter === "Tên xuất khẩu"
          )?.TextResult,
          Country: country,
          StoreType: this.newProduct.FormLineLst.find(
            (p) => p.Parameter === "Phân loại"
          )?.TextResult,
          Area: this.newProduct.FormLineLst.find(
            (p) => p.Parameter === "Khu vực"
          )?.TextResult,
        };

        // 5️⃣ Chờ CreateProduct hoàn thành
        const res = await CreateProduct({ Data: productData });

        // 6️⃣ Xử lý kết quả
        if (res.RespCode === 0) {
          notify({ title: "Thành công", type: "success" });

          this.newProduct.ReferenceID = res.Data;
          this.updateDocumentForm(this.newProduct);
          this.newProduct.IsContinue = null;
          this.getProductLst();
        } else if (res.RespCode === 2) {
          this.newProduct.IsContinue = 1;
        } else {
          notify({ title: "Thất bại", text: res.RespText, type: "error" });
        }
      } catch (err) {
        console.error(err);
        notify({
          title: "Lỗi",
          text: "Không thể tạo sản phẩm",
          type: "error",
        });
      }
    },
    delProduct(data) {
      DelProduct({
        ProductID: data.ProductID,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            type: "success",
          });
          this.getProductLst();
        } else {
          notify({
            title: "Thất bại",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    btPage(data) {
      this.currentPage = data;
    },
    btRow(data) {
      this.pageSize = data;
    },
    getProductLst() {
      this.loadding = true;
      const searchString = [
        this.product,
        this.name2,
        this.country,
        this.area,
        this.storeType,
      ].join("|");
      const requestData = {
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: searchString,
      };
      GetProductLst(requestData).then((res) => {
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
    getDefaultValue2() {
      GetDefaultValue({ Table: "Tạo sản phẩm" }).then((res) => {
        if (res.RespCode == 0) {
          this.idCreateProduct = res.DefaultValueLst[0]?.ValueName || "";
        }
      });
    },
    async openCreateProductDialog() {
      const res = await GetFormByID({ IDForm: this.idCreateProduct });
      if (res.RespCode == 0) {
        this.newProduct = res.Data;
        if (this.newProduct.TypeForm == 1) {
          const newLines = [];
          for (const ele of this.newProduct.FormLineLst) {
            let options = [];

            if (ele.OptionAnswer) {
              options = JSON.parse(ele.OptionAnswer);
            }

            if (ele.Type == 3) {
              if (ele.OptionLine == 1) {
                options = await this.getUserLstByTeamID2(ele.OptionText);
              }
              if (ele.OptionLine == 2) {
                options = await this.getDefaultValue(ele.OptionText);
              }
            }

            newLines.push({
              ...ele,
              Options: options,
            });
          }
          this.newProduct.FormLineLst = newLines;
        }
        this.isCreateProductDialog = true;
      }
    },
    async getUserLstByTeamID2(teamID) {
      const res = await GetUserLstByTeamID({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
        TeamID: teamID,
      });

      if (res.RespCode == 0) {
        return res.Data.map((item) => ({
          ...item,
          value: item.UserName,
          text: item.FullName,
        }));
      }
      return [];
    },
    updateDocumentForm(data) {
      this.isLoadingFile = true;
      var docForm = {
        ...data,
        IDForm: data.IDForm,
        NameForm: data.NameForm,
        Description: data.Description,
        TypeForm: data.TypeForm,
      };

      if (data.TypeForm == 1) {
        docForm.DocumentFormLineLst = data.FormLineLst.map((item) => {
          if (item.Type == 2 || item.Type == 3) {
            let textArr = [];

            if (Array.isArray(item.TextResult)) {
              textArr = item.TextResult;
            } else if (
              typeof item.TextResult === "string" &&
              item.TextResult !== ""
            ) {
              try {
                textArr = JSON.parse(item.TextResult);
              } catch (e) {
                textArr = item.TextResult.split(",");
              }
            }
            return {
              ...item,
              TextResult: textArr.join(" | "),
            };
          } else {
            return {
              ...item,
            };
          }
        });
      }
      // ------------------------------------------------------------------
      // 🔥 CHECK BẮT BUỘC: Nếu IsValue == 1 thì TextResult phải có giá trị
      // ------------------------------------------------------------------
      // let invalid = docForm.DocumentFormLineLst.some((line) => {
      //   const value = line.TextResult;

      //   // ép về string để trim an toàn
      //   const safeValue =
      //     value === null || value === undefined ? "" : String(value).trim();

      //   return line.IsValue == 1 && safeValue === "";
      // });

      // if (invalid) {
      //   this.isLoadingFile = false;
      //   notify({
      //     title: "Thiếu dữ liệu",
      //     text: "Các trường bắt buộc chưa nhập đầy đủ",
      //     type: "error",
      //   });
      //   return; // ⛔ Không gọi API
      // }

      // ------------------------------------------------------------------
      // Gọi API cập nhật
      // ------------------------------------------------------------------
      UpdateDocumentForm({
        DocumentFormInfo: docForm,
      })
        .then((res) => {
          this.isLoadingFile = false;
          if (res.RespCode == 0) {
            notify({
              title: "Thành công",
              text: "Lưu thông tin thành công",
              type: "success",
            });
          }
        })
        .catch(() => {
          this.isLoadingFile = false;
        });
    },
    openDeleteDialog(item) {
      this.productToDelete = item;
      this.isDeleteDialog = true;
    },
    confirmDelete() {
      this.delProduct(this.productToDelete);
      this.isDeleteDialog = false;
      this.productToDelete = null;
    },
  },
  created() {
    this.getProductLst();
    this.getDefaultValue2();
  },
};
</script>

<style></style>

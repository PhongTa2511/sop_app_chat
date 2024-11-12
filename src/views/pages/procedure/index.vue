<template>
  <v-card>
    <v-dialog v-model="isShowCreate" max-width="500px" persistent>
      <v-card>
        <v-card-title>Tạo quy trình mới</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="createProcedure.ProcedureName"
              label="Tên quy trình(*)"
              placeholder="Nhập trên quy trình"
              required
              class="mb-2"
            ></v-text-field>
            <v-textarea
              v-model="createProcedure.Description"
              label="Mô tả"
              placeholder="Nhập mô tả quy trình"
              :rows="2"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowCreate = false">Cancel</v-btn>
          <v-btn color="green" @click="btCreateProcedure">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowProName" max-width="1000px" persistent>
      <v-card>
        <v-card-title>Tiêu đề hồ sơ</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name1"
                label="Tên đối tượng"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name2"
                label="Quốc gia"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name3"
                label="Loại hồ sơ"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name4"
                label="Mã hồ sơ"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name5"
                label="Ngày tiếp nhận"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name6"
                label="Hạn xử lý"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name7"
                label="Tên thay thế"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name8"
                label="Khu vực"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name9"
                label="Người đại diện"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name10"
                label="Quy cách"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name11"
                label="Mã"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name12"
                label="Design"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name13"
                label="Tên đơn vị/ nhóm"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name14"
                label="Kết luận"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name15"
                label="Nhân viên phụ trách 1"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name16"
                label="Nhân viên phụ trách 2"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name17"
                label="Nhân viên phụ trách 3"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name18"
                label="Nhân viên phụ trách 4"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="createProcedureName.Name19"
                label="Nhân viên phụ trách 5"
                placeholder="Nhập tên thay thế"
                hide-details=""
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowProName = false">Cancel</v-btn>
          <v-btn color="green" @click="btCreateProcedureName">Xác nhận</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowUpdate" max-width="500px" persistent>
      <v-card>
        <v-card-title>Cập nhật quy trình</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="createProcedure.ProcedureName"
              label="Tên quy trình(*)"
              placeholder="Nhập trên quy trình"
              required
              class="mb-2"
            ></v-text-field>
            <v-textarea
              v-model="createProcedure.Description"
              label="Mô tả"
              placeholder="Nhập mô tả quy trình"
              :rows="2"
            ></v-textarea>
            <!-- <v-radio-group v-model="createProcedure.Status">
              <v-radio label="Đang hoạt động" :value="1"></v-radio>
              <v-radio label="Dừng hoạt động" :value="0"></v-radio>
            </v-radio-group> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowUpdate = false">Cancel</v-btn>
          <v-btn color="green" @click="btEditProcedure">Cập nhật</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-title>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h6 py-2">Danh sách quy trình</h6>
        <div class="d-flex">
          <v-btn
            color="green"
            icon="mdi-playlist-plus"
            style="height: 42px"
            class="mr-1"
            @click="btShowCreateProcedure"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-data-table-server
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="desserts"
      items-per-page-text=""
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      :items-length="dataLength"
      @update:itemsPerPage="btRow"
      @update:page="btPage"
      height="calc(100vh - 170px)"
      :loading="loadding"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
    >
      <template v-slot:item.Key="{ item }">
        {{ item.Key }}
        <v-icon color="red" class="me-2" @click="btShowDel(item)"
          >mdi-trash-can
        </v-icon>
        <v-icon color="orange" class="me-2" @click="btShowEditProcedure(item)"
          >mdi-square-edit-outline
        </v-icon>
        <v-icon color="orange" class="me-2" @click="btShowProName(item)"
          >mdi-note-edit-outline
        </v-icon>
      </template>
      <template v-slot:item.Status="{ item }">
        <v-chip color="blue" v-if="item.Status == 1"> Mới tạo </v-chip>
        <v-chip color="orange" v-if="item.Status == 2"> Chỉnh sửa </v-chip>
      </template>
      <template v-slot:item.Step="{ item }">
        <v-icon
          color="green"
          size="small"
          class="me-2"
          @click="btShowLstPhase(item)"
          >mdi-format-list-numbered
        </v-icon>
      </template>
      <template v-slot:item.Form="{ item }">
        <v-icon
          color="blue"
          size="small"
          class="me-2"
          @click="btShowLstForm(item)"
          >mdi-form-select
        </v-icon>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import {
  CreateProcedure,
  UpdateProcedure,
  DelProcedure,
  GetProcedureLst,
  GetProcedureByID,
  GetProcedureNameInfo,
  UpdateProcedureNameInfo,
} from "@/api/procedureApi";

export default {
  data() {
    return {
      isMenuSearch: false,
      headers: [
        { title: "STT", sortable: false, key: "Key" },
        { title: "Bước", key: "Step", sortable: false },
        { title: "Form", key: "Form", sortable: false },
        { title: "Mã quy trình", key: "ProcedureID", sortable: false },
        {
          title: "Tên quy trình",
          key: "ProcedureName",
          sortable: false,
          align: "center",
        },
        {
          title: "Mô tả",
          key: "Description",
          sortable: false,
          align: "center",
        },
        {
          title: "Thời gian tạo",
          key: "TimeCreate",
          sortable: false,
          align: "center",
        },
        {
          title: "Trạng thái",
          key: "Status",
          sortable: false,
          align: "center",
        },
      ],
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      search: "",
      dataLength: 0,
      searchPhone: "",
      searchPlaceName: "",
      searchCity: "",
      loadding: false,
      dataGroups: [],
      placeInfoBFO: {},
      isShowUpdatePlace: false,
      placeID: "",
      input: "",
      createProcedure: {},
      isShowUpdate: false,
      isShowCreate: false,
      isShowCreatePhase: false,
      updateUI: 0,
      procedureLst: [],
      lengthDataTable: 0,
      pageSize: 10,
      isShowProName: false,
      currentPage: 1,
      createProcedureName: {},
    };
  },
  methods: {
    btShowUpdate(data) {
      this.placeID = data;
      this.isShowUpdatePlace = true;
    },
    btClose() {
      this.isShowUpdatePlace = false;
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    btCreateProcedureName() {
      UpdateProcedureNameInfo({ Data: this.createProcedureName }).then(
        (res) => {
          if (res.RespCode == 0) {
            notify({
              title: "Thành công",
              text: "Thay đổi tên tiêu đề thành công",
              type: "success",
            });
            this.isShowProName = false;
          }
        }
      );
    },
    btShowProName(data) {
      GetProcedureNameInfo({
        Data: data.ProcedureID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.createProcedureName = {
            ...res.Data,
            ProcedureID: data.ProcedureID,
          };
          this.isShowProName = true;
        }
      });
    },
    btShowLstForm(data) {
      this.$router.push("/form/" + data.ProcedureID);
    },
    btShowLstPhase(data) {
      this.$router.push("/buoc/" + data.ProcedureID);
    },
    btCreate(data) {
      if (data.PlaceID.length < 8) {
        this.placeInfoBFO = data;
        this.getPlaceStandardLst(data);
      } else {
        if (this.placeInfoBFO.PlaceID) {
          this.createPlaceStandard(data);
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: "Bạn cần chọn khách hàng chuẩn hóa trước",
          });
        }
      }
    },
    btShowCreateProcedure() {
      this.isShowCreate = true;
      this.createProcedure = {};
    },
    btCreateProcedure() {
      if (this.createProcedure.ProcedureName) {
        CreateProcedure({
          ProcedureInfo: {
            ProcedureName: this.createProcedure.ProcedureName,
            Description: this.createProcedure.Description,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.isShowCreate = false;
            this.createProcedure = {};
            this.getProcedure();
            notify({
              title: "Thành công",
              text: "Tạo quy trình mới thành công",
              type: "success",
            });
          }
        });
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng nhập đầy đủ thông tin",
          type: "warning",
        });
      }
    },
    btShowEditProcedure(data) {
      this.isShowUpdate = true;
      this.createProcedure = data;
    },
    btEditProcedure() {
      if (this.createProcedure.ProcedureName) {
        UpdateProcedure({
          ProcedureInfo: {
            ProcedureID: this.createProcedure.ProcedureID,
            ProcedureName: this.createProcedure.ProcedureName,
            Description: this.createProcedure.Description,
            Status: 1,
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.isShowUpdate = false;
            this.createProcedure = {};
            this.getProcedure();
            notify({
              title: "Thành công",
              text: "Tạo quy trình mới thành công",
              type: "success",
            });
          }
        });
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng nhập đầy đủ thông tin",
          type: "warning",
        });
      }
    },
    btShowDel(data) {
      this.$confirm("Có chắc bạn muốn xóa quy trình này", "Warning", {
        confirmButtonText: "Có",
        cancelButtonText: "Không",
        type: "warning",
      })
        .then(() => {
          this.btDelProcedure(data);
        })
        .catch(() => {});
    },
    btDelProcedure(data) {
      DelProcedure({ ProcedureID: data.ProcedureID }).then((res) => {
        if (res.RespCode == 0) {
          this.getProcedure();
          notify({
            title: "Thành công",
            text: "Xóa quy trình thành công",
            type: "success",
          });
        }
      });
    },
    getProcedure() {
      GetProcedureLst({
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: "",
      }).then((res) => {
        if (res.RespCode == 0) {
          var num = (this.currentPage - 1) * this.pageSize;
          this.desserts = res.Data.filter((p) => p.Status != 0).map(
            (item, index) => {
              return {
                ...item,
                Key: index + 1 + num,
              };
            }
          );
          this.updateUI++;
          this.lengthDataTable = res.TotalRows;
        }
      });
    },
  },
  created() {
    this.getProcedure();
  },
};
</script>

<style lang="scss" scoped>
.groups {
  overflow-y: scroll;
  height: calc(100vh - 250px);
  padding-right: 2px;
  &::-webkit-scrollbar-track-piece {
    background: #ffffff;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-primary));
    border-radius: 20px;
  }
}
</style>

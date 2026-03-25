<template>
  <v-card>
    <v-dialog v-model="isShowCreate" max-width="500px" persistent>
      <v-card>
        <v-card-title>Tạo quy trình mới</v-card-title>
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
            <v-autocomplete
              class="mt-2"
              v-model="createProcedure.TeamLst"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              label="Chọn nhóm liên quan"
              placeholder="Chọn quy trình"
              multiple=""
              filterable
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowCreate = false">Cancel</v-btn>
          <v-btn color="green" @click="btCreateProcedure">Xác nhận</v-btn>
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
            <v-autocomplete
              class="mt-2"
              v-model="createProcedure.TeamLst"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              label="Chọn nhóm liên quan"
              placeholder="Chọn quy trình"
              multiple=""
            ></v-autocomplete>
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

    <v-dialog v-model="isShowConfirmDelete" max-width="500px" persistent>
      <v-card>
        <v-card-title>Xác nhận xóa</v-card-title>
        <v-card-text> Bạn có chắc chắn muốn xóa quy trình này? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isShowConfirmDelete = false">Hủy</v-btn>
          <v-btn color="red" @click="confirmDelete">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title class="px-4 py-3">
      <div class="d-flex flex-wrap align-center gap-2">
        
        <h6 class="text-h6 mb-0 w-100 w-sm-auto">DANH SÁCH QUY TRÌNH</h6>

        <v-spacer class="d-none d-sm-block"></v-spacer>

        <div class="d-none d-sm-flex align-center gap-2">
          <div style="width: 160px">
            <v-text-field
              v-model="procedureName"
              label="Quy trình"
              hide-details
              density="compact"
              variant="outlined"
            ></v-text-field>
          </div>
          <div style="width: 320px">
            <v-autocomplete
              v-model="teamName"
              label="Nhóm"
              hide-details
              density="compact"
              variant="outlined"
              :items="teamlst"
              item-title="TeamName"
              item-value="TeamID"
              clearable
            ></v-autocomplete>
          </div>
          <div style="width: 160px">
            <v-text-field
              v-model="employeeName"
              label="Nhân viên"
              hide-details
              density="compact"
              variant="outlined"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex align-center gap-1 mt-2 mt-sm-0">
          <v-dialog v-model="isShowMobileFilter" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                icon="mdi-filter-variant"
                size="small"
                variant="tonal"
                class="d-sm-none"
              ></v-btn>
            </template>
            <v-card>
              <v-card-title>Bộ lọc tìm kiếm</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field v-model="procedureName" label="Quy trình" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete v-model="teamName" label="Nhóm" variant="outlined" :items="teamlst" item-title="TeamName" item-value="TeamID" clearable></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="employeeName" label="Nhân viên" variant="outlined"></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" @click="isShowMobileFilter = false">Đóng</v-btn>
                <v-btn color="primary" @click="btSearch">Tìm kiếm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn
            color="blue"
            icon="mdi-file-document-multiple"
            size="small"
            class="mx-1"
            variant="tonal"
            @click="btShowCopyProcedure"
          ></v-btn>
          <v-btn
            color="green"
            icon="mdi-playlist-plus"
            size="small"
            variant="flat"
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
      height="calc(100vh - 250px)"
      :loading="loadding"
      :items-per-page="rowspPage"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
      ]"
      fixed-header
      mobile-breakpoint="md"
    >
      <template v-slot:item.Key="{ item }">
        <div class="d-flex flex-wrap">
          <div class="mr-2 mt-1">
            {{ item.Key }}
          </div>
          
          <div>
            <v-tooltip text="Xóa" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="red"
                  class="mr-1 mb-1"
                  @click="btShowDel(item)"
                  icon="mdi-trash-can"
                  size="x-small"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Sửa quy trình" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="orange"
                  class="mr-1 mb-1"
                  @click="btShowEditProcedure(item)"
                  icon="mdi-square-edit-outline"
                  size="x-small"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Danh sách Bước" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="green"
                  size="x-small"
                  class="mr-1 mb-1"
                  @click="btShowLstPhase(item)"
                  icon="mdi-format-list-numbered"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Danh sách Form" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="blue"
                  size="x-small"
                  class="mr-1 mb-1"
                  @click="btShowLstForm(item)"
                  icon="mdi-form-select"
                />
              </template>
            </v-tooltip>
          </div>
        </div>
      </template>

      <template v-slot:item.Status="{ item }">
        <v-chip color="blue" v-if="item.Status == 1" size="small"> Mới tạo </v-chip>
        <v-chip color="orange" v-if="item.Status == 2" size="small"> Chỉnh sửa </v-chip>
      </template>

      <template v-slot:item.CreateName="{ item }">
        <div>{{ item.CreateName }}</div>
        <v-chip color="green" size="x-small" class="mt-1">{{ item.TimeCreate }}</v-chip>
      </template>

      <template v-slot:item.ProcedureID="{ item }">
        <div class="font-weight-medium">{{ item.ProcedureName }}</div>
        <v-chip color="green" size="x-small" class="mt-1">{{ item.ProcedureID }}</v-chip>
      </template>

      <template v-slot:item.TeamLst="{ item }">
        <div class="d-flex flex-wrap" style="gap: 4px;">
          <v-chip
            size="x-small"
            color="blue"
            v-for="tem in item.Data"
            :key="tem.TeamID"
          >
            {{ tem.TeamName }}
          </v-chip>
        </div>
      </template>
    </v-data-table-server>
  </v-card>

  <v-dialog v-model="isShowCopyProcedure" max-width="500px" persistent>
    <v-card>
      <v-card-title>Nhân bản quy trình</v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="selectedProcedureToCopy"
          :items="desserts"
          item-title="ProcedureName"
          item-value="ProcedureID"
          label="Chọn quy trình để nhân bản"
          placeholder="Chọn quy trình"
          filterable
          clearable
          hide-details=""
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="isShowCopyProcedure = false">Hủy</v-btn>
        <v-btn color="green" @click="btCopyProcedure">Nhân bản</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  CopyProcedure,
  CreateProcedure,
  DelProcedure,
  GetProcedureLst,
  UpdateProcedure,
} from "@/api/procedureApi";
import { GetTeamLst } from "@/api/teamApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";

export default {
  data() {
    return {
      // ĐÃ GIỮ NGUYÊN BẢNG HEADERS CỦA BẠN
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 140 }, // Tăng nhẹ width để Desktop không bị chật
        { title: "Quy trình", key: "ProcedureID", sortable: false },
        { title: "Mô tả", key: "Description", sortable: false },
        { title: "Nhóm", key: "TeamLst", sortable: false },
        { title: "Người tạo", key: "CreateName", sortable: false, align: "center" },
      ],
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      search: "",
      dataLength: 0,
      loadding: false,

      createProcedure: {},
      isShowUpdate: false,
      isShowCreate: false,
      procedureLst: [],
      isShowConfirmDelete: false,
      procedureToDelete: null,
      isShowCopyProcedure: false,
      selectedProcedureToCopy: null,
      teamlst: [],
      searchProcedure: "",

      filterTeamID: null,

      procedureName: "",
      teamName: "",
      employeeName: "",
      isShowMobileFilter: false,
    };
  },
  watch: {
    pageNumber(newValue) {
      this.getProcedure();
    },
    rowspPage(newValue) {
      this.getProcedure();
    },
    procedureName() {
      this.getProcedure();
    },
    teamName() {
      this.getProcedure();
    },
    employeeName() {
      this.getProcedure();
    },
    filterTeamID(){
      this.pageNumber = 1;
      this.getProcedure();
    },
  },
  methods: {
    btSearch() {
      this.isShowMobileFilter = false;
      this.getProcedure();
    },
    getTeamLst() {
      GetTeamLst({ RowspPage: 10000, PageNumber: 1 }).then((res) => {
        if (res.RespCode == 0) {
          this.teamlst = res.Data;
        }
      });
    },
    btCopyProcedure() {
      if (this.selectedProcedureToCopy) {
        CopyProcedure({
          Data: this.selectedProcedureToCopy,
        })
          .then((res) => {
            if (res.RespCode == 0) {
              this.isShowCopyProcedure = false;
              this.getProcedure();
              notify({
                title: "Thành công",
                text: "Nhân bản quy trình thành công",
                type: "success",
              });
            } else {
              notify({
                title: "Lỗi",
                text: res.RespText || "Không thể nhân bản quy trình",
                type: "error",
              });
            }
          })
          .catch((error) => {
            notify({
              title: "Lỗi",
              text: "Có lỗi xảy ra khi nhân bản quy trình",
              type: "error",
            });
          });
      } else {
        notify({
          title: "Nhắc nhở",
          text: "Vui lòng chọn quy trình để nhân bản",
          type: "warning",
        });
      }
    },
    btShowCopyProcedure() {
      this.isShowCopyProcedure = true;
      this.selectedProcedureToCopy = null;
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },

    btShowLstForm(data) {
      this.$router.push("/form/" + data.ProcedureID);
    },
    btShowLstPhase(data) {
      this.$router.push("/buoc/" + data.ProcedureID);
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
          TeamLst: this.createProcedure.TeamLst.join(","),
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
          TeamLst: this.createProcedure.TeamLst?.join(","),
        }).then((res) => {
          if (res.RespCode == 0) {
            this.isShowUpdate = false;
            this.createProcedure = {};
            this.getProcedure();
            notify({
              title: "Thành công",
              text: "Cập nhật quy trình thành công",
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
      this.procedureToDelete = data;
      this.isShowConfirmDelete = true;
    },
    confirmDelete() {
      this.btDelProcedure(this.procedureToDelete);
      this.isShowConfirmDelete = false;
      this.procedureToDelete = null;
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
      this.loadding = true;
      var searchText =
        (this.procedureName ?? "") +
        "|" +
        (this.teamName ?? "") +
        "|" +
        (this.employeeName ?? "");
      GetProcedureLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: searchText,
      }).then((res) => {
        if (res.RespCode == 0) {
          console.log("search: ", searchText);
          var num = (this.pageNumber - 1) * this.rowspPage;
          this.desserts = res.Data.filter((p) => p.Status != 0).map(
            (item, index) => {
              return {
                ...item,
                Key: index + 1 + num,
                TimeCreate: formatDateDisplayDDMMYY(item.TimeCreate),
                TeamLst: item.Data.map((item) => item.TeamID),
              };
            },
          );
          this.dataLength = res.TotalRows;
          this.loadding = false;
        }
      });
    },
  },
  created() {
    this.getProcedure();
    this.getTeamLst();
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

.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
</style>

<template>
  <v-card class="py-2">
    <div class="d-flex flex-wrap gap-2 px-2">
      <span>
        <v-text-field
          v-model="searchJob"
          label="Tìm kiếm"
          hide-details
          style="width: 250px !important"
          clearable
        ></v-text-field>
      </span>

      <v-btn
        color="green"
        variant="tonal"
        icon="mdi-reload"
        size="small"
        @click="getStepArisingLstByDoc"
      ></v-btn>
      <v-btn
        color="green"
        variant="tonal"
        icon="mdi-plus"
        size="small"
        @click="openDialog"
      >
      </v-btn>
    </div>
    <v-row class="mx-0 my-0">
      <v-col lg="3" v-for="(item, index) in dataStepLst" :key="index">
        <v-card border flat class="mx-auto" max-width="374">
          <v-card-title class="px-4 py-2 pb-0">{{
            item.StepName
          }}</v-card-title>

          <v-card-subtitle class="mb-2">
            <span class="subheading me-1">Báo cáo {{ item.DateReport }}</span>
            <v-icon
              class="me-1 text-green pb-1"
              icon="mdi-clock-check"
            ></v-icon>
          </v-card-subtitle>

          <div class="mx-4">
            <div class="justify-self-end">
              <v-icon
                class="me-1 text-green pb-1"
                icon="mdi-check-circle-outline"
              ></v-icon>
              <span class="subheading me-2"
                ><v-tooltip text="Đã duyệt" activator="parent"> </v-tooltip
                >{{ item.JobSuccess }}</span
              >
              <span class="me-1">·</span>
              <v-icon
                class="me-1 text-red pb-1"
                icon="mdi-close-circle-outline"
              ></v-icon>
              <span class="subheading me-2"
                ><v-tooltip text="Đã từ chối" activator="parent"> </v-tooltip
                >{{ item.JobError }}</span
              >
              <span class="me-1">·</span>
              <v-icon
                class="me-1 text-orange pb-1"
                icon="mdi-account-file-text"
              ></v-icon>
              <span class="subheading"
                ><v-tooltip text="Chưa duyệt" activator="parent"> </v-tooltip
                >{{ item.JobProgress }}</span
              >
            </div>
            <!-- <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

            <div>
              Small plates, salads & sandwiches - an intimate setting with 12
              indoor seats plus patio seating.
            </div> -->
          </div>

          <v-divider class="mx-4 my-1"></v-divider>
          <div class="mx-4 d-flex justify-space-between align-center">
            <div class="my-2">
              <v-icon size="small" color="blue" class="me-1 mb-1"
                >mdi-sync</v-icon
              ><span>
                <v-tooltip text="Tần suất lặp" activator="parent"> </v-tooltip
                >{{ item.Frequency }}
                ngày
              </span>
              <span class="mx-1"> - </span>
              <v-icon size="small" color="purple" class="mb-1"
                >mdi-pencil-circle-outline</v-icon
              >
              <span>
                <v-tooltip text="Số lần lặp" activator="parent"> </v-tooltip>
                Lần {{ item.NumberF }}
              </span>
            </div>
          </div>

          <v-divider class="mx-4 my-1"></v-divider>

          <v-card-subtitle class="mb-0">
            <span class="subheading"
              >Tài khoản liên quan ({{ item.AssignLst.length }})</span
            >
          </v-card-subtitle>
          <div class="px-4 mb-0">
            <v-chip
              class="mr-0"
              size="small"
              :color="user.UserRole == 'Phê duyệt' ? 'green' : 'orange'"
              v-for="(user, i) in item.AssignLst"
              :key="i"
              >{{ user.FullName[0] }}
              <v-tooltip
                activator="parent"
                location="top"
                v-if="user.UserRole == 'Phê duyệt'"
                >Duyệt: {{ user.FullName }}</v-tooltip
              >
              <v-tooltip activator="parent" location="top" v-else
                >Thực hiện: {{ user.FullName }}</v-tooltip
              >
            </v-chip>
          </div>
          <v-divider class="mx-4 my-2"></v-divider>

          <v-card-actions>
            <div>
              <v-tooltip
                location="top"
                v-if="item.Status == 1 || item.Status == 2"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="green"
                    icon="mdi-check"
                    @click="showConfirm('success', item)"
                    class="mr-1"
                  >
                  </v-btn>
                </template>
                <span>Hoàn thành</span>
              </v-tooltip>
              <v-tooltip location="top" v-if="item.Status == 1">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="flat"
                    rounded="sm"
                    size="x-small"
                    color="purple"
                    icon="mdi-cursor-pointer"
                    class="mr-1"
                    @click="showConfirm('start', item)"
                  ></v-btn>
                </template>
                <span>Bắt đầu ngay</span>
              </v-tooltip>

              <v-tooltip
                location="top"
                v-if="item.Status == 1 || item.Status == 2"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="red"
                    text="Xóa"
                    icon="mdi-delete"
                    @click="showConfirm('delete', item)"
                  ></v-btn>
                </template>
                <span>Xóa</span>
              </v-tooltip>
            </div>
            <v-spacer />
            <div>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="orange"
                    icon="mdi-file"
                    class="mr-1"
                    @click="showFileDialog(item)"
                  ></v-btn>
                </template>
                <span>Tệp liên quan</span>
              </v-tooltip>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    rounded="sm"
                    size="x-small"
                    color="info"
                    icon="mdi-image"
                    @click="showImageDialog(item)"
                  ></v-btn>
                </template>
                <span>Hình ảnh liên quan</span>
              </v-tooltip>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <v-dialog v-model="isShowAddNew" max-width="600px" persistent>
    <v-card>
      <v-card-title class="pt-4">
        <span class="text-h6 text-primary">{{
          editIndex !== null ? "Chỉnh sửa công việc" : "Tạo công việc mới"
        }}</span>
      </v-card-title>

      <v-card-text class="py-0">
        <v-row>
          <v-col cols="12" class="pb-0">
            <v-text-field
              v-model="stepInfo.StepName"
              label="Công việc"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <V-DateField
              v-model.modelValue="stepInfo.DateReport"
              label="Ngày báo cáo"
              width="100%"
            ></V-DateField>
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="stepInfo.Frequency"
              label="Tần suất"
              type="number"
              variant="outlined"
              dense
              suffix="ngày"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="pt-0">
            <div>
              <v-btn
                prepend-icon="mdi-user-edit"
                append-icon="mdi-plus"
                @click="addUserJob"
                size="small"
                color="orange"
              >
                Thực hiện
              </v-btn>
              <div class="pt-2">
                <v-chip
                  class="mr-1"
                  color="purple"
                  variant="outlined"
                  v-for="(item, index) in stepInfo.UserJobLst"
                  :key="index"
                >
                  <v-icon icon="mdi-account-circle-outline" start></v-icon>
                  {{ item.FullName }}
                  <v-icon
                    icon="mdi-close"
                    @click="removeUserJob(item.UserID)"
                    end
                  ></v-icon>
                </v-chip>
              </div>
            </div>
            <div class="mt-2">
              <v-btn
                prepend-icon="mdi-user-check"
                append-icon="mdi-plus"
                @click="addUserMana"
                size="small"
                color="green"
              >
                Phê duyệt
              </v-btn>
              <div class="pt-2">
                <v-chip
                  class="mr-1"
                  color="purple"
                  variant="outlined"
                  v-for="(item, index) in stepInfo.UserManaLst"
                  :key="index"
                >
                  <v-icon icon="mdi-account-circle-outline" start></v-icon>
                  {{ item.FullName }}
                  <v-icon
                    icon="mdi-close"
                    @click="removeUserMana(item.UserID)"
                    end
                  ></v-icon>
                </v-chip>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Hủy" @click="isShowAddNew = false"></v-btn>
        <v-btn color="green" text="Lưu" @click="updateStepArising"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowAddUserJob" max-width="400px">
    <v-card>
      <v-card-title>Thêm người thực hiện</v-card-title>
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="7" class="pr-0">
            <v-select
              v-model="selectedTeam"
              :items="teamOptions"
              label="Nhóm thực hiện"
              item-title="TeamName"
              item-value="TeamID"
              clearable
              class="mb-2"
            ></v-select>
          </v-col>
          <v-col cols="5">
            <v-text-field
              suffix="ngày"
              v-model="quotaTime"
              label="Hạn"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-autocomplete
          v-model="selectedUser"
          :items="userOptions"
          label="Chọn người thực hiện"
          item-title="FullName"
          item-value="UserName"
          clearable
          multiple
          hide-details
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Hủy" @click="isShowAddUserJob = false"></v-btn>
        <v-btn color="green" text="Thêm" @click="confirmAddUserJob"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowAddUserMana" max-width="400px">
    <v-card>
      <v-card-title>Thêm người thực hiện</v-card-title>
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="7" class="pr-0">
            <v-select
              v-model="selectedTeam"
              :items="teamOptions"
              label="Nhóm thực hiện"
              item-title="TeamName"
              item-value="TeamID"
              clearable
              class="mb-2"
            ></v-select>
          </v-col>
          <v-col cols="5">
            <v-text-field
              suffix="ngày"
              v-model="quotaTime"
              label="Hạn"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-autocomplete
          v-model="selectedUser"
          :items="userOptions"
          label="Chọn người thực hiện"
          item-title="FullName"
          item-value="UserName"
          clearable
          hide-details
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Hủy" @click="isShowAddUserMana = false"></v-btn>
        <v-btn color="green" text="Thêm" @click="confirmAddUserMana"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog xác nhận -->
  <v-dialog v-model="confirmDialog.show" max-width="400px">
    <v-card>
      <v-card-title class="text-h6"> Xác nhận </v-card-title>
      <v-card-text>
        {{
          confirmDialog.type === "success"
            ? "Bạn có chắc chắn muốn đánh dấu công việc này là hoàn thành?"
            : confirmDialog.type === "start"
              ? "Bạn có chắc chắn muốn bắt đầu công việc này?"
              : "Bạn có chắc chắn muốn xóa công việc này?"
        }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Hủy" @click="confirmDialog.show = false"></v-btn>
        <v-btn
          color="green"
          text="Xác nhận"
          v-if="confirmDialog.type === 'success'"
          @click="updateStepStatus(4, confirmDialog.item)"
        ></v-btn>
        <v-btn
          color="purple"
          text="Xác nhận"
          v-if="confirmDialog.type === 'start'"
          @click="startStepArisingConfirm"
        ></v-btn>
        <v-btn
          color="red"
          text="Xác nhận"
          v-if="confirmDialog.type === 'delete'"
          @click="updateStepStatus(0, confirmDialog.item)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog hiển thị file -->
  <v-dialog v-model="showFile.show" max-width="600px">
    <v-card>
      <v-card-title class="text-h6">Danh sách tệp liên quan</v-card-title>
      <v-card-text>
        <div v-if="showFile.files.length">
          <v-list>
            <v-list-item v-for="(file, idx) in showFile.files" :key="idx">
              <v-list-item-title>
                <a :href="file.Url" target="_blank">{{ file.Name }}</a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        <div v-else>Không có tệp liên quan.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Đóng" @click="showFile.show = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog hiển thị hình ảnh -->
  <v-dialog v-model="showImage.show" max-width="800px">
    <v-card>
      <v-card-title class="text-h6">Hình ảnh liên quan</v-card-title>
      <v-card-text>
        <div v-if="showImage.images.length">
          <v-row>
            <v-col v-for="(img, idx) in showImage.images" :key="idx" cols="4">
              <v-img :src="img.Url" :alt="img.Name" aspect-ratio="1"></v-img>
              <div class="text-caption mt-1">{{ img.Name }}</div>
            </v-col>
          </v-row>
        </div>
        <div v-else>Không có hình ảnh liên quan.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Đóng" @click="showImage.show = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GetStepFileByMine } from "@/api/documentFileApi";
import {
  GetStepArisingLstByDoc,
  StartStepArising,
  UpdateStepArising,
  UpdateStepStatus,
} from "@/api/documentStepApi";
import { GetTeamLstProID } from "@/api/teamApi";
import { formatDate, formatDateDisplayDDMMYY } from "@/helpers/getTime";
import { notify } from "@kyvg/vue3-notification";
export default {
  props: {
    docID: String,
  },
  data() {
    return {
      isShowAddNew: false,
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      newDocument: {},
      searchJob: "",
      isShowEdit: false,
      editDocument: {},
      stepInfo: {},
      isShowAddUserJob: false,
      isShowAddUserMana: false,
      selectedUser: null,
      selectedTeam: null,
      quotaTime: 0,
      userOptions: [],
      teamOptions: [],
      dataStepLst: [],
      confirmDialog: {
        show: false,
        type: "", // 'success' | 'delete'
        item: null,
      },
      showFile: {
        show: false,
        files: [],
      },
      showImage: {
        show: false,
        images: [],
      },
    };
  },
  watch: {
    pageSize(value) {
      this.getGSPDocumentLst();
    },
    currentPage(value) {
      this.getGSPDocumentLst();
    },
    selectedTeam(value) {
      if (value) {
        this.userOptions = this.teamOptions.find(
          (p) => p.TeamID == value,
        ).UserLst;
      }
    },
  },
  methods: {
    startStepArising() {
      StartStepArising({
        DocumentID: "P24092511726",
        StepID: this.confirmDialog.item.StepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Bắt đầu công việc thành công!",
            type: "success",
          });
          this.getStepArisingLstByDoc();
          this.confirmDialog.show = false;
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    updateStepStatus(status, item) {
      UpdateStepStatus({
        DocumentID: "P24092511726",
        StepID: item.StepID,
        Status: status,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật trạng thái công việc thành công!",
            type: "success",
          });
          this.getStepArisingLstByDoc();
          this.confirmDialog.show = false;
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    updateStepArising() {
      this.stepInfo.AssignLst = [
        ...(this.stepInfo.UserJobLst || []),
        ...(this.stepInfo.UserManaLst || []),
      ];
      this.stepInfo.DocumentID = "P24092511726";
      this.stepInfo.ProcedureID = this.docID;
      this.stepInfo.DateReport = formatDate(this.stepInfo.DateReport);
      UpdateStepArising({
        Data: this.stepInfo,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật công việc thành công!",
            type: "success",
          });
          this.getStepArisingLstByDoc();
          this.isShowAddNew = false;
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    getStepArisingLstByDoc() {
      GetStepArisingLstByDoc({
        DocumentID: "P24092511726",
        PageNumber: this.currentPage,
        RowspPage: this.pageSize,
        Search: this.searchJob,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.dataStepLst = res.Data.map((item) => {
            return {
              ...item,
              DateReport: formatDateDisplayDDMMYY(item.DateReport),
            };
          });
        }
      });
    },
    showConfirm(type, item) {
      this.confirmDialog.type = type;
      this.confirmDialog.item = item;
      this.confirmDialog.show = true;
    },
    startStepArisingConfirm() {
      this.startStepArising();
    },
    btSuccess() {
      // Xử lý hoàn thành công việc ở đây, sử dụng this.confirmDialog.item nếu cần
      this.confirmDialog.show = false;
      // Thực hiện logic hoàn thành công việc...
      // Ví dụ: this.updateStepStatus(2);
    },
    btDelete() {
      this.confirmDialog.show = false;
      // Thực hiện logic xóa công việc ở đây, sử dụng this.confirmDialog.item nếu cần
      // Ví dụ: gọi API xóa và cập nhật lại danh sách
    },
    btEdit() {},
    openDialog(item = null, index = null) {
      if (item) {
        this.stepInfo = { ...item };
        this.editIndex = index;
      } else {
        this.stepInfo = {
          users: [],
        };
        this.editIndex = null;
      }
      this.isShowAddNew = true;
    },
    getTeamLstProID() {
      if (this.teamOptions.length > 0) return;
      GetTeamLstProID({
        ProcedureID: this.docID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.teamOptions = res.Data;
        }
      });
    },
    btPage(data) {
      this.currentPage = data;
    },
    btRow(data) {
      this.pageSize = data;
    },
    openEditDialog(document) {
      this.editDocument = { ...document };
      this.isShowEdit = true;
    },
    addUserJob() {
      this.isShowAddUserJob = true;
      this.getTeamLstProID();
    },
    addUserMana() {
      this.isShowAddUserMana = true;
      this.getTeamLstProID();
    },
    confirmAddUserJob() {
      if (this.selectedUser && this.selectedTeam) {
        if (!this.stepInfo.UserJobLst) {
          this.stepInfo.UserJobLst = [];
        }
        var team = this.teamOptions.find(
          (p) => String(p.TeamID) === String(this.selectedTeam),
        );
        var userLst = team.UserLst || [];
        for (let index = 0; index < this.selectedUser.length; index++) {
          const element = this.selectedUser[index];
          var userInfo = userLst.find((p) => p.UserName == element);
          this.stepInfo.UserJobLst.push({
            FullName: userInfo.FullName,
            QuotaTime: this.quotaTime,
            UserID: userInfo.UserName,
            UserRole: "Xử lý",
            ComID: this.selectedTeam,
          });
        }

        this.selectedUser = null;
        this.selectedTeam = null;
        this.isShowAddUserJob = false;
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
          type: "error",
        });
      }
    },
    removeUserJob(phone) {
      this.stepInfo.UserJobLst = this.stepInfo.UserJobLst.filter(
        (p) => p.UserID != phone,
      );
    },
    confirmAddUserMana() {
      if (this.selectedUser && this.selectedTeam) {
        if (!this.stepInfo.UserManaLst) {
          this.stepInfo.UserManaLst = [];
        }
        var team = this.teamOptions.find(
          (p) => String(p.TeamID) === String(this.selectedTeam),
        );
        var userLst = team.UserLst || [];

        var userInfo = userLst.find((p) => p.UserName == this.selectedUser);
        this.stepInfo.UserManaLst.push({
          FullName: userInfo.FullName,
          QuotaTime: this.quotaTime,
          UserID: userInfo.UserName,
          UserRole: "Phê duyệt",
          ComID: this.selectedTeam,
        });

        this.selectedUser = null;
        this.selectedTeam = null;
        this.isShowAddUserMana = false;
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
          type: "error",
        });
      }
    },
    removeUserMana(phone) {
      this.stepInfo.UserManaLst = this.stepInfo.UserManaLst.filter(
        (p) => p.UserID != phone,
      );
    },
    showFileDialog(item) {
      GetStepFileByMine({
        Type: "File",
        DocumentID: "P24092511726",
        StepID: item.StepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.showFile.files = res.Data || [];
        } else {
          this.showFile.files = [];
        }
        this.showFile.show = true;
      });
    },
    showImageDialog(item) {
      GetStepFileByMine({
        Type: "Image",
        DocumentID: "P24092511726",
        StepID: item.StepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.showImage.images = res.Data || [];
        } else {
          this.showImage.images = [];
        }
        this.showImage.show = true;
      });
    },
  },
  created() {
    this.getStepArisingLstByDoc();
  },
};
</script>

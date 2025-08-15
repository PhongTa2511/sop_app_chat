<template>
  <v-card class="py-4">
    <div class="d-flex justify-space-between mb-4 mx-4" v-if="docInfo.TypeDoc">
      <div>
        <div class="text-h5" style="white-space: normal">
          Hồ sơ:
          {{ docInfo.DocName }}
          <v-chip
            style="margin-top: -4px"
            :color="getStatus(docInfo.Status).color"
          >
            {{ getStatus(docInfo.Status).text }}</v-chip
          >
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-note</v-icon> Mô tả:
          {{ docInfo.Note }}
        </div>
        <div class="ml-4 mt-2">
          <v-icon color="blue" size="small">mdi-clipboard-text-clock</v-icon>
          Hạn xử lý:
          {{ docInfo.DateExpiredShow }}
        </div>
      </div>
      <div>
        <v-tooltip text="Bắt đầu" v-if="isShowStart">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="blue"
              class="mr-1"
              icon="mdi-gesture-double-tap"
              @click="startDocument()"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Lưu thông tin">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="green"
              class="mr-1"
              icon="mdi-file-document-check"
              @click="updateGSPDocument(2)"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Trao đổi">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="red"
              class="mr-1"
              icon="mdi-chat"
              @click="btChat"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              color="blue"
              icon="mdi-dots-grid"
              v-bind="props"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn
                size="small"
                color="gray"
                rounded="4"
                block
                @click="updateGSPDocument(3)"
              >
                Tạm dừng
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                size="small"
                color="success"
                rounded="4"
                block
                @click="updateGSPDocument(2)"
              >
                Đang làm
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                size="small"
                color="green"
                rounded="4"
                block
                @click="updateGSPDocument(4)"
              >
                Hoàn thành
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                size="small"
                color="orange"
                rounded="4"
                block
                @click="updateGSPDocument(6)"
              >
                Khách check
              </v-btn>
            </v-list-item>
            <!-- <v-list-item
              v-if="
                [
                  'QT00005',
                  'QT00007',
                  'QT00009',
                  'QT00010',
                  'QT00011',
                ].includes(docInfo.TypeDoc)
              "
            >
              <v-btn
                size="small"
                color="green"
                rounded="4"
                block
                @click="updateGSPDocument(8)"
              >
                Nộp cục
              </v-btn>
            </v-list-item>
            <v-list-item
              v-if="
                [
                  'QT00005',
                  'QT00007',
                  'QT00009',
                  'QT00010',
                  'QT00011',
                ].includes(docInfo.TypeDoc)
              "
            >
              <v-btn
                size="small"
                color="green"
                rounded="4"
                block
                @click="updateGSPDocument(9)"
              >
                Có số
              </v-btn>
            </v-list-item> -->
            <v-list-item v-if="docInfo.TypeDoc == 'QT00018'">
              <v-btn
                size="small"
                color="blue"
                rounded="4"
                block
                @click="updateGSPDocument(7)"
              >
                Chờ phụ liệu
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                size="small"
                color="red"
                rounded="4"
                block
                @click="updateGSPDocument(0)"
              >
                Hủy hồ sơ
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-row class="px-4">
      <v-col cols="4" v-if="procedureName.Name1 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.WarehouseName"
          :label="procedureName.Name1 ? procedureName.Name1 : 'Tên đối tượng'"
          readonly
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name2 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.Country"
          :label="procedureName.Name2 ? procedureName.Name2 : 'Quốc gia'"
          variant="outlined"
          hide-details
          density="compact"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name3 != 'Ẩn'">
        <v-select
          v-model="docInfo.StepID"
          :label="procedureName.Name3 ? procedureName.Name3 : 'Loại hồ sơ'"
          density="compact"
          :items="proritiLst"
          item-value="ValueName"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name5 != 'Ẩn'">
        <v-date-input
          v-model="docInfo.DateRecept"
          :label="procedureName.Name5 ? procedureName.Name5 : 'Ngày tiếp nhận'"
          variant="outlined"
          hide-details
          density="compact"
          prepend-icon=""
        ></v-date-input>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name6 != 'Ẩn'">
        <v-date-input
          v-model="docInfo.DateExpired"
          :label="procedureName.Name6 ? procedureName.Name6 : 'Hạn xử lý'"
          variant="outlined"
          hide-details
          density="compact"
          prepend-icon=""
        ></v-date-input>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name14 != 'Ẩn'">
        <v-select
          v-model="docInfo.Conclusion"
          placeholder="Nhóm xử lý"
          :label="procedureName.Name14 ? procedureName.Name14 : 'Kết luận'"
          density="compact"
          :items="typeDocLst"
          item-value="ValueName"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name7 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.Name2"
          :label="procedureName.Name7 ? procedureName.Name7 : 'Tên thay thế'"
          variant="outlined"
          hide-details
          density="compact"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name8 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.Area"
          :label="procedureName.Name8 ? procedureName.Name8 : 'Khu vực'"
          variant="outlined"
          hide-details
          density="compact"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name9 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.CusName"
          :label="procedureName.Name9 ? procedureName.Name9 : 'Người đại diện'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name10 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.Package"
          :label="procedureName.Name10 ? procedureName.Name10 : 'Quy cách'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name11 != 'Ẩn'">
        <v-select
          v-model="docInfo.Barcode"
          :label="procedureName.Name11 ? procedureName.Name11 : 'Mã'"
          density="compact"
          :items="barcodeLst"
          item-value="ValueName"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name12 != 'Ẩn'">
        <v-select
          v-model="docInfo.Design"
          :label="procedureName.Name12 ? procedureName.Name12 : 'Design'"
          density="compact"
          :items="designLst"
          item-value="ValueName"
          item-title="ValueName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name13 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.CompanyName"
          :label="
            procedureName.Name13 ? procedureName.Name13 : 'Tên đơn vị / nhóm'
          "
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name20 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.QuantityNeed"
          :label="procedureName.Name20 ? procedureName.Name20 : 'Số lượng cần'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name21 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.QuantitySample"
          :label="procedureName.Name21 ? procedureName.Name21 : 'Số lượng mẫu'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name22 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.QuantityAll"
          :label="procedureName.Name22 ? procedureName.Name22 : 'Số lượng tổng'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name23 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.Session"
          :label="
            procedureName.Name23 ? procedureName.Name23 : 'Giấy tờ pháp lý'
          "
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name24 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.CertNumber"
          :label="procedureName.Name24 ? procedureName.Name24 : 'Thông tin MAH'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name25 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.TypeGSP"
          :label="procedureName.Name25 ? procedureName.Name25 : 'Loại sản phẩm'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name26 != 'Ẩn'">
        <v-text-field
          v-model="docInfo.TypeSuccess"
          :label="
            procedureName.Name26 ? procedureName.Name26 : 'Loại hoàn thiện'
          "
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col
        cols="4"
        v-if="procedureName.Name27 != 'Ẩn' && docInfo.TypeDoc != 'QT00024'"
      >
        <v-text-field
          v-model="docInfo.StoreType"
          :label="procedureName.Name27 ? procedureName.Name27 : 'Phân loại'"
          variant="outlined"
          hide-details
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name15 != 'Ẩn'">
        <v-select
          v-model="docInfo.EmployeeCare1"
          :label="
            procedureName.Name15
              ? procedureName.Name15
              : 'Nhân viên phụ trách 1'
          "
          density="compact"
          :items="
            userLst.filter((p) => {
              if (p.Position) {
                return p.Position.includes('EXP');
              }
            })
          "
          item-value="EmployeeCode"
          item-title="FullName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name16 != 'Ẩn'">
        <v-select
          v-model="docInfo.EmployeeCare2"
          :label="
            procedureName.Name16
              ? procedureName.Name16
              : 'Nhân viên phụ trách 2'
          "
          density="compact"
          :items="
            userLst.filter((p) => {
              if (p.Position) {
                return p.Position.includes('DOC');
              }
            })
          "
          item-value="EmployeeCode"
          item-title="FullName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name17 != 'Ẩn'">
        <v-select
          v-model="docInfo.EmployeeCare3"
          :label="
            procedureName.Name17
              ? procedureName.Name17
              : 'Nhân viên phụ trách 3'
          "
          density="compact"
          :items="
            userLst.filter((p) => {
              if (p.Position) {
                return p.Position.includes('ĐKT');
              }
            })
          "
          item-value="EmployeeCode"
          item-title="FullName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name18 != 'Ẩn'">
        <v-select
          v-model="docInfo.EmployeeCare4"
          :label="
            procedureName.Name18
              ? procedureName.Name18
              : 'Nhân viên phụ trách 4'
          "
          density="compact"
          :items="
            userLst.filter((p) => {
              if (p.Position) {
                return p.Position.includes('NCV');
              }
            })
          "
          item-value="EmployeeCode"
          item-title="FullName"
        ></v-select>
      </v-col>
      <v-col cols="4" v-if="procedureName.Name19 != 'Ẩn'">
        <v-select
          v-model="docInfo.EmployeeCare5"
          :label="
            procedureName.Name19
              ? procedureName.Name19
              : 'Nhân viên phụ trách 5'
          "
          density="compact"
          :items="
            userLst.filter((p) => {
              if (p.Position) {
                return p.Position.includes('KTV');
              }
            })
          "
          item-value="EmployeeCode"
          item-title="FullName"
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
  <v-row class="mt-2">
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="d-flex justify-space-between">
          <div class="text-h6">Thông tin các bước</div>
          <div>
            <v-btn
              color="green"
              icon="mdi-progress-check"
              size="x-small"
              @click="btShowProcess()"
              class="mr-1"
            >
            </v-btn>
            <v-btn
              v-if="docInfo.TypeDoc == 'QT00024'"
              color="primary"
              icon="mdi-plus"
              size="x-small"
              @click="isShowCreateJob = true"
            >
            </v-btn>
          </div>
        </div>
        <v-divider class="my-2"></v-divider>
        <div v-for="(item, index) in processLst" :key="index" class="mx-2 my-2">
          <div class="d-flex">
            <v-chip class="mr-2">
              {{ item.StepOrder }}
            </v-chip>
            {{ item.StepName }}
            <v-spacer></v-spacer>
            <v-btn
              rounded="full"
              color="blue"
              @click="btShowInfoStep(item)"
              icon="mdi-dots-vertical"
              size="x-small"
            >
            </v-btn>
            <!-- <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  rounded="full"
                  color="blue"
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  size="x-small"
                >
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn
                    prepend-icon="mdi-information-box"
                    size="small"
                    color="gray"
                    rounded="4"
                    block
                    @click="btShowInfoStep(item)"
                  >
                    <template v-slot:prepend>
                      <v-icon color="blue"></v-icon>
                    </template>
                    Thông tin
                  </v-btn>
                </v-list-item>
               
              </v-list>
            </v-menu> -->
          </div>

          <v-divider class="my-2" color="blue"></v-divider>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="py-2 px-4 layout-card">
        <div class="text-h6">Các file liên quan</div>
        <v-divider class="my-2"></v-divider>
        <div class="text-center py-8">
          <v-icon color="red" size="large"> mdi-text-box-search </v-icon>
          <div>Chưa có file nào đính kèm</div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="isShowInfoStep" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h5 text-medium-emphasis">
            <v-chip :color="stepInfo.Status == 1 ? 'blue' : ''">
              Bước {{ stepInfo.StepOrder }}
            </v-chip>
            {{ stepInfo.StepName }}
          </div>

          <div
            v-if="stepInfo.Description"
            class="text-subtitle-1 py-1 px-2"
            style="white-space: normal"
          >
            Mô tả: {{ stepInfo.Description }}
          </div>
          <div class="d-flex" v-if="stepInfo.Frequency > 0">
            <div class="mr-4">Tần suất: {{ stepInfo.Frequency }} ngày</div>
            <div class="mr-4">
              <v-switch
                v-model="isNextStep"
                color="success"
                hide-details
                @change="updateStepInfo"
              ></v-switch>
            </div>

            <DateField v-model="stepInfo.DateReport" label="Ngày báo cáo" />
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          rounded="full"
          color="gray"
          size="small"
          @click="isShowInfoStep = false"
        ></v-btn
      ></v-card-title>
      <v-card-text v-for="(item, index) in workLst" :key="index">
        <v-divider style="margin-top: -20px" class="mb-2"></v-divider>
        <v-form ref="editForm">
          <div class="text-h6">
            {{ item.Key }}. {{ item.JobName }}

            <v-chip style="margin-top: -10px" v-if="item.Status == 0"
              >Chưa giao việc</v-chip
            >
            <v-chip
              style="margin-top: -10px"
              color="blue"
              v-if="item.Status == 1"
              >Đang làm</v-chip
            >
            <v-chip
              style="margin-top: -10px"
              color="green"
              v-if="item.Status == 4"
              >Hoàn thành</v-chip
            >
          </div>
          <div class="text-p">Mô tả: {{ item.DesJob }}</div>

          <v-row>
            <v-col :lg="6">
              <span>Cài đặt xử lý</span>
              <v-autocomplete
                v-model="item.UserJob.GroupEmploy"
                placeholder="Nhóm xử lý"
                density="compact"
                :items="groupLst"
                item-value="ValueName"
                item-title="ValueName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
                clearable
                hide-details
              ></v-autocomplete>
              <v-autocomplete
                v-model="item.UserJob.UserID"
                :items="userLst"
                placeholder="Người xử lý"
                item-value="EmployeeCode"
                item-title="FullNameCode"
                chips
                style="max-width: 280px"
                class="mb-2"
                clearable
                hide-details
              ></v-autocomplete>
              <v-text-field
                v-model="item.UserJob.QuotaTime"
                label="Hạn xử lý"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
                clearable
              ></v-text-field>
            </v-col>
            <v-col :lg="6">
              <span>Cài đặt phê duyệt</span>
              <v-autocomplete
                v-model="item.UserMana.GroupEmploy"
                :items="groupLst"
                placeholder="Nhóm phê duyệt"
                density="compact"
                item-value="ValueName"
                item-title="ValueName"
                chips
                style="max-width: 280px"
                class="mb-2 mt-2"
                clearable
                hide-details
              ></v-autocomplete>
              <v-autocomplete
                v-model="item.UserMana.UserID"
                :items="userLst"
                placeholder="Người phê duyệt"
                density="compact"
                item-value="EmployeeCode"
                item-title="FullName"
                chips
                style="max-width: 280px"
                class="mb-2"
                clearable
                hide-details
              ></v-autocomplete>
              <v-text-field
                v-model="item.UserMana.QuotaTime"
                label="Hạn phê duyệt"
                type="number"
                :min="1"
                :max="1000"
                suffix="Ngày"
                style="max-width: 280px"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex justify-center my-4">
            <v-btn
              variant="outlined"
              rounded="8"
              size="small"
              @click="btAddUserInWork(item)"
              color="blue"
              class="mr-1"
              >Gán người xử lý</v-btn
            >
            <!-- <v-btn
              variant="outlined"
              rounded="8"
              size="small"
              @click="btSendMailAddUserInWork(item)"
              color="green"
              class="ml-1"
              >Gửi mail thực hiện</v-btn
            > -->
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowAddNew" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Thêm mới thông tin</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="(header, index) in headers.filter((p) => p.title != 'STT')"
            :key="index"
            cols="12"
          >
            <v-text-field
              v-if="header.type == 1"
              :label="header.title"
              v-model="newDocument[header.key]"
            ></v-text-field>
            <v-select
              v-if="header.type == 2"
              v-model="newDocument[header.key]"
              :label="header.title"
              placeholder="Nhập thông tin"
              density="compact"
              :items="header.options"
              item-value="Name"
              item-title="Name"
              chips
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowAddNew = false">Hủy</v-btn>
        <v-btn color="green" @click="addNewDocument">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowEdit" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Chỉnh sửa thông tin</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="(header, index) in headers.filter((p) => p.title != 'STT')"
            :key="index"
            cols="12"
          >
            <v-text-field
              v-if="header.type == 1"
              :label="header.title"
              v-model="editDocument[header.key]"
            ></v-text-field>
            <v-select
              v-if="header.type == 2"
              v-model="editDocument[header.key]"
              :label="header.title"
              placeholder="Nhập thông tin"
              density="compact"
              :items="header.options"
              item-value="Name"
              item-title="Name"
              chips
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="isShowEdit = false">Hủy</v-btn>
        <v-btn color="green" @click="updateDocument">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowProcess" width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Quá trình thực hiện</div>

        <v-btn
          icon="mdi-close"
          variant="text"
          rounded-full
          size="small"
          color="gray"
          @click="isShowProcess = false"
        ></v-btn>
      </v-card-title>
      <v-card-text>
        <v-card class="layout-card">
          <div
            v-for="(item, index) in processLst"
            :key="index"
            class="mx-2 my-2"
          >
            <div class="d-flex">
              <v-chip
                class="mr-2"
                :color="
                  item.Status == 1
                    ? 'blue'
                    : item.Status == 4
                    ? 'green'
                    : item.Status == 5
                    ? 'red'
                    : 'gray'
                "
              >
                {{ item.StepOrder }}
              </v-chip>
              {{ item.StepName }}
            </div>
            <v-sheet
              v-for="(job, indjob) in item.StepLst"
              :key="indjob"
              class="px-1 py-1"
              rounded
              :border="
                job.Status == 3
                  ? 'blue md'
                  : job.Status == 4
                  ? 'green md'
                  : job.Status == 5
                  ? 'red md'
                  : 'gray md'
              "
            >
              <div class="text-body-2 position-relative">
                {{ job.JobName }}
                <v-icon
                  v-if="job.Status == 4"
                  class="position-absolute right-0"
                  color="green"
                  size="small"
                  >mdi-check-circle-outline</v-icon
                >
                <v-icon
                  v-if="job.Status == 5"
                  class="position-absolute right-0"
                  color="red"
                  size="small"
                  >mdi-close-circle-outline</v-icon
                >
              </div>

              <div class="text-caption">
                <div v-if="job.ReportName">
                  <v-icon color="blue" size="small">mdi-account-edit</v-icon>
                  {{ job.ReportName }}
                  <v-icon color="blue" size="small" v-if="job.TimeModify"
                    >mdi-clock</v-icon
                  >
                  {{ job.TimeModifyShow }}
                </div>
                <div v-if="job.Report" v-html="job.Report"></div>
              </div>

              <div class="text-caption">
                <div v-if="job.ManagerName">
                  <v-icon color="red" size="small">mdi-account-check</v-icon>
                  {{ job.ManagerName }}
                  <v-icon color="red" size="small" v-if="job.TimeApproveShow"
                    >mdi-clock</v-icon
                  >
                  {{ job.TimeApproveShow }}
                </div>
                <div v-if="job.NoteApprove" v-html="job.NoteApprove"></div>
              </div>
              <div class="file-lst" v-if="job.FileLst.length > 0">
                <v-menu
                  location="end"
                  v-for="(file, indfile) in job.FileLst"
                  :key="indfile"
                >
                  <template v-slot:activator="{ props }">
                    <v-chip color="gray" v-bind="props" class="mr-1">
                      {{ file.MineFile }}
                    </v-chip>
                  </template>

                  <v-list>
                    <v-list-item v-if="isPreviewSupported(file.MineFile)">
                      <v-list-item-title>
                        <v-btn
                          @click="previewFile(file)"
                          size="small"
                          rounded="8"
                          class="mb-1"
                        >
                          <v-icon class="mr-1">mdi-file-eye</v-icon> Xem trước
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title>
                        <v-btn
                          @click="downloadFile(file)"
                          size="small"
                          rounded="8"
                          color="green"
                          block
                          class="mb-1"
                        >
                          <v-icon class="mr-1">mdi-file-download</v-icon> Tải
                          ngay
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-sheet>
            <v-divider class="my-2" color="blue"></v-divider>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowFile" persistent width="800">
    <v-card>
      <v-card-item>
        <div v-if="isLoading">Đang tải...</div>
        <div v-else>
          <strong>{{ nameFile }}</strong>
          <div v-if="fileMine == '.pdf'">
            <iframe
              :src="
                'https://docs.google.com/gview?embedded=true&url=' +
                encodeURIComponent(fileUrl)
              "
              width="100%"
              height="600px"
            ></iframe>
          </div>
          <div v-else>
            <div v-html="docContent"></div>
          </div>
        </div>
      </v-card-item>
      <v-card-actions>
        <v-btn @click="isShowFile = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowCreateJob" max-width="700px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Tạo công việc mới</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="createJobForm">
          <v-row>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="newStep.StepName"
                label="Tên bước"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model="newStep.Frequency"
                number
                label="Lặp (ngày)"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="3">
              <DateField
                v-model="newStep.DateReport"
                label="Ngày BC"
                width="150px"
              />
            </v-col>
          </v-row>
          <v-divider class="my-2"></v-divider>
          <v-row v-for="(job, index) in newStep.jobs" :key="index" class="mb-4">
            <v-col cols="12" md="12">
              <v-text-field
                v-model="job.JobName"
                label="Tên công việc"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="job.DesJob"
                label="Mô tả công việc"
                outlined
                dense
                rows="2"
              ></v-textarea>
            </v-col>
            <!-- <v-col cols="12" md="6">
              <v-autocomplete
                v-model="job.Assignee"
                :items="userLst"
                label="Người thực hiện"
                item-value="EmployeeCode"
                item-title="FullName"
                outlined
                dense
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="job.Approver"
                :items="userLst"
                label="Người phê duyệt"
                item-value="EmployeeCode"
                item-title="FullName"
                outlined
                dense
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="job.QuotaTimeJob"
                label="Hạn thực hiện (ngày)"
                type="number"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="job.QuotaTimeApprove"
                label="Hạn phê duyệt (ngày)"
                type="number"
                outlined
                dense
              ></v-text-field>
            </v-col> -->
            <v-col cols="12" md="6" class="d-flex align-center">
              <v-btn
                rounded="md"
                size="x-small"
                color="red"
                @click="removeJob(index)"
                >Xóa công việc</v-btn
              >
            </v-col>
            <v-divider class="my-0 mx-4"></v-divider>
          </v-row>
          <!-- <v-btn color="primary" @click="addJob">Thêm công việc</v-btn> -->
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addJob">Thêm công việc</v-btn>
        <v-btn color="grey" @click="isShowCreateJob = false">Hủy</v-btn>
        <v-btn color="green" @click="saveNewStep">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { GSPGetGSPDocumentInfoByID, UpdateGSPDocument } from "@/api/briefApi";
import { GetDefaultValue } from "@/api/default";
import { GetDocumentFormByDocID } from "@/api/documentFormApi";
import {
  AddAssignLst,
  CreateDocumentJob,
  GetDocumentJobByDocID,
  ProcessDocument,
  SendMailAddAssignLst,
  StartDocument,
} from "@/api/documentJobApi";
import { CreateGroup } from "@/api/messageApi";
import { GetProcedureNameInfo, UpdateDocumentStep } from "@/api/procedureApi";
import { GetUserLstAll } from "@/api/user";
import DateField from "@/components/DateField.vue";
import {
  formatDate,
  formatDateDisplayDDMMYY,
  formatDateHHDDMM,
} from "@/helpers/getTime";
import { getEmployCode } from "@/utils/auth";
import {
  downloadFile,
  fetchDoc,
  fetchXlsxContent,
  isPreviewSupported,
} from "@/utils/function";

export default {
  components: {
    DateField,
  },
  data() {
    return {
      headers: [],
      desserts: [],
      docInfo: {},
      pageSize: 10,
      currentPage: 1,
      totalLength: 0,
      processLst: [],
      isShowInfoStep: false,
      stepInfo: {},
      workLst: [],
      userLst: [],
      groupLst: [],
      formTabLst: [],
      tab: "",
      isShowAddNew: false,
      newDocument: {},
      isShowEdit: false,
      editDocument: {},
      isShowProcess: false,
      procedureName: {},
      proritiLst: [],
      typeDocLst: [],
      barcodeLst: [],
      designLst: [],
      emCode: getEmployCode(),
      fileUrl: "",
      isShowFile: false,
      docContent: "",
      nameFile: "",
      isLoading: false,
      isShowStart: false,
      isShowCreateJob: false,
      newStep: {
        StepName: "",
        jobs: [],
      },
    };
  },
  computed: {
    formattedDateRecept: {
      get() {
        return this.docInfo.DateRecept
          ? this.formatDate(this.docInfo.DateRecept)
          : null;
      },
      set(value) {
        this.docInfo.DateRecept = this.parseDate(value);
      },
    },
    isNextStep: {
      get() {
        return this.stepInfo.IsNextStep === 1;
      },
      set(value) {
        this.stepInfo.IsNextStep = value ? 1 : 0;
      },
    },
  },
  methods: {
    btChat() {
      if (
        this.docInfo.EmployeeCare1 == this.emCode ||
        this.docInfo.EmployeeCare2 == this.emCode ||
        this.docInfo.EmployeeCare3 == this.emCode ||
        this.docInfo.EmployeeCare4 == this.emCode ||
        this.docInfo.EmployeeCare5 == this.emCode ||
        this.docInfo.EmployeeCare6 == this.emCode
      ) {
        if (this.docInfo.GroupID) {
          this.$router.push({
            path: "/nhan-tin",
            query: { docID: this.docInfo.DocumentID },
          });
        } else {
          CreateGroup({
            Data: {
              DocumentID: this.docInfo.DocumentID,
            },
          }).then((res) => {
            if (res.RespCode == 0) {
              this.$router.push({
                path: "/nhan-tin",
                query: { docID: this.docInfo.DocumentID },
              });
            }
          });
        }
      } else {
        notify({
          title: "Lỗi",
          text: "Bạn không được tham gia hồ sơ này",
          type: "error",
        });
      }
    },
    checkRequiredFields() {
      const fieldMappings = {
        Name1: "WarehouseName",
        Name2: "Country",
        Name3: "StepID",
        Name4: "DocumentID",
        Name5: "DateRecept",
        Name6: "DateExpired",
        Name7: "Name2",
        Name8: "Area",
        Name9: "CusName",
        Name10: "Package",
        Name11: "Barcode",
        Name12: "Design",
        Name13: "CompanyName",
        Name14: "Conclusion",
      };

      for (const [nameKey, fileInfoKey] of Object.entries(fieldMappings)) {
        if (
          this.procedureName[nameKey] &&
          this.procedureName[nameKey] !== "Ẩn"
        ) {
          if (!this.docInfo[fileInfoKey]) {
            notify({
              title: "Lỗi",
              text: `Vui lòng điền đầy đủ thông tin cho trường `,
              type: "error",
            });
            return false;
          }
        }
      }
      return true;
    },
    isPreviewSupported(fileExtension) {
      return isPreviewSupported(fileExtension);
    },
    downloadFile(file) {
      downloadFile(file);
    },
    async previewFile(file) {
      if (!this.isPreviewSupported(file.MineFile)) {
        alert("File này không hỗ trợ xem trước.");
        return;
      }
      this.isLoading = true;
      this.nameFile = file.NameFile.toUpperCase();
      this.docContent = "";
      const fileExtension = file.MineFile.toLowerCase();
      this.fileMine = fileExtension;
      const previewUrl = `https://rd.icpc1hn.work/api/File/GetDocumentFile?FileName=${file.LinkFile}`;
      if (fileExtension === ".pdf") {
        this.fileUrl = previewUrl;
        window.open(
          "https://docs.google.com/gview?embedded=true&url=" + previewUrl
        );
      } else if (fileExtension === ".docx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchDoc(this.fileUrl);
      } else if (fileExtension === ".xlsx") {
        this.fileUrl = previewUrl;
        this.isShowFile = true;
        this.docContent = await fetchXlsxContent(this.fileUrl);
      } else if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        this.isShowFile = true;
        this.docContent = `<img lazy src="${previewUrl}" alt="Image preview" width="100%" />`;
      }
      this.isLoading = false;
    },
    updateGSPDocument(status) {
      UpdateGSPDocument({
        DocumentInfo: {
          ...this.docInfo,
          DateExpired: formatDate(this.docInfo.DateExpired),
          DateRecept: formatDate(this.docInfo.DateRecept),
          DocumentID: this.$route.params.id,
          Status: status,
        },
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            type: "success",
          });
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    getdefault() {
      GetDefaultValue({ Table: "Nhóm nhân viên" }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst = res.DefaultValueLst;
        }
      });
      GetDefaultValue({
        Table: "Mức độ ưu tiên",
      }).then((res) => {
        this.proritiLst = res.DefaultValueLst;
      });
      GetDefaultValue({
        Table: "Phân loại hồ sơ",
      }).then((res) => {
        this.typeDocLst = res.DefaultValueLst;
      });
      GetDefaultValue({
        Table: "Barcode",
      }).then((res) => {
        this.barcodeLst = res.DefaultValueLst;
      });
      GetDefaultValue({
        Table: "Design",
      }).then((res) => {
        this.designLst = res.DefaultValueLst;
      });
      GetUserLstAll({
        PageNumber: 1,
        RowspPage: 10000,
        Search: "",
      }).then((res) => {
        this.userLst = res.Data.map((item) => {
          return {
            ...item,
            FullNameCode: item.FullName + " - " + item.EmployeeCode,
          };
        });
      });
    },
    btShowInfoStep(data) {
      this.isShowInfoStep = true;
      this.stepInfo = data;
      this.getDocumentJobByDocID(data.StepID);
    },
    getDocumentJobByDocID(stepID) {
      GetDocumentJobByDocID({
        DocumentID: this.$route.params.id,
        StepID: stepID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.workLst = res.DocumentJobLst.map((item, index) => {
            var userJob = null;
            var a = item.UserAssignLst.find((p) => p.UserRole == "Xử lý");
            if (a) {
              userJob = a;
            }
            var a = item.AssignLst.find((p) => p.UserRole == "Xử lý");
            if (a) {
              userJob = a;
            }
            var userMana = null;
            var b = item.UserAssignLst.find((p) => p.UserRole == "Phê duyệt");
            if (b) {
              userMana = b;
            }
            var b = item.AssignLst.find((p) => p.UserRole == "Phê duyệt");
            if (b) {
              userMana = b;
            }
            return {
              ...item,
              Key: index + 1,
              UserJob: userJob ?? {},
              UserMana: userMana ?? {},
            };
          });
        }
      });
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "more" };
      }
      if (status == 2) {
        return { text: "Đang làm", color: "success" };
      }
      if (status == 3) {
        return { text: "Tạm dừng", color: "more" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" };
      }
      if (status == 6) {
        return { text: "Khách check", color: "orange" };
      }
      if (status == 7) {
        return { text: "Chờ phụ liệu", color: "blue" };
      }
      if (status == 8) {
        return { text: "Nộp cục", color: "blue" };
      }
      if (status == 9) {
        return { text: "Có số", color: "blue" };
      }
      return { text: "Không xác định", color: "gray" };
    },
    btShowProcess() {
      this.isShowProcess = true;
    },
    processDocument() {
      ProcessDocument({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.processLst = res.DocumentJobLst.map((item, index) => {
            item.StepLst = item.StepLst.map((job, indjob) => {
              return {
                ...job,
                TimeModifyShow: formatDateHHDDMM(job.TimeModify),
                TimeApproveShow: formatDateHHDDMM(job.TimeApprove),
                Report: this.addStyleToAllImages(
                  job.Report,
                  "width: calc(100%);"
                ),
                NoteApprove: this.addStyleToAllImages(
                  job.NoteApprove,
                  "width: calc(100%);"
                ),
              };
            });
            return {
              ...item,
            };
          });
          this.isShowStart =
            res.DocumentJobLst[0].StepLst.length > 0 ? false : true;
        }
      });
    },
    addStyleToAllImages(html, styleString) {
      if (!html) return html;
      return html.replace(/<img([^>]*?)>/gi, (match, attr) => {
        if (/style\s*=/.test(attr)) {
          return match.replace(
            /style\s*=\s*["']([^"']*)["']/i,
            (styleMatch, existingStyles) => {
              return `style="${existingStyles}; ${styleString}"`;
            }
          );
        } else {
          return `<img${attr} style="${styleString}">`;
        }
      });
    },
    getDocumentInfoByID() {
      GSPGetGSPDocumentInfoByID({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.docInfo = {
            ...res.Data,
            DateRecept: new Date(res.Data.DateRecept),
            DateExpired: new Date(res.Data.DateExpired),
            DateExpiredShow: formatDateDisplayDDMMYY(res.Data.DateExpired),
            WarehouseName: res.Data.WarehouseName || "",
            Country: res.Data.Country || "",
            StepID: res.Data.StepID || "",
            Name2: res.Data.Name2 || "",
            Area: res.Data.Area || "",
            CusName: res.Data.CusName || "",
            Package: res.Data.Package || "",
            Barcode: res.Data.Barcode || "",
            Design: res.Data.Design || "",
            CompanyName: res.Data.CompanyName || "",
            Conclusion: res.Data.Conclusion || "",
            EmployeeCare1: res.Data.EmployeeCare1 || "",
            EmployeeCare2: res.Data.EmployeeCare2 || "",
            EmployeeCare3: res.Data.EmployeeCare3 || "",
            EmployeeCare4: res.Data.EmployeeCare4 || "",
            EmployeeCare5: res.Data.EmployeeCare5 || "",
          };
          this.processDocument();
          GetProcedureNameInfo({
            Data: this.docInfo.TypeDoc,
          }).then((res) => {
            if (res.RespCode == 0) {
              this.procedureName = {
                ...res.Data,
              };
            }
          });
        }
      });
    },
    btAddUserInWork(data) {
      if (!this.checkRequiredFields()) {
        return;
      }
      var userJoBID = "";
      var userManaID = "";
      var asi = [];
      if (this.docInfo.TypeDoc != "QT00024") {
        if (data.UserJob.GroupEmploy) {
          if (data.UserJob.GroupEmploy == "ĐKT") {
            userJoBID = this.docInfo.EmployeeCare3;
          }
          if (data.UserJob.GroupEmploy == "EXP") {
            userJoBID = this.docInfo.EmployeeCare1;
          }
          if (data.UserJob.GroupEmploy == "DOC") {
            userJoBID = this.docInfo.EmployeeCare2;
          }
          if (data.UserJob.GroupEmploy == "NCV") {
            userJoBID = this.docInfo.EmployeeCare4;
          }
          if (data.UserJob.GroupEmploy == "KTV") {
            userJoBID = this.docInfo.EmployeeCare5;
          }
          if (data.UserJob.UserID) {
            userJoBID = data.UserJob.UserID;
          }
          if (parseInt(data.QuotaTimeJob) == 0) {
            notify({
              title: "Lỗi",
              text: "Hạn xử lý phải lơn hơn 0",
              type: "error",
            });
            return;
          }

          if (userJoBID && userJoBID != "") {
            asi.push({
              UserRole: "Xử lý",
              GroupEmploy: data.UserJob.GroupEmploy,
              WorkID: data.WorkID,
              UserID: userJoBID,
              QuotaTime: data.UserJob.QuotaTime,
            });
          } else {
            return;
          }
        }
      } else {
        asi.push({
          UserRole: "Xử lý",
          GroupEmploy: data.UserJob.GroupEmploy,
          WorkID: data.WorkID,
          UserID: data.UserJob.UserID,
          QuotaTime: data.UserJob.QuotaTime,
        });
      }
      if (data.UserMana.GroupEmploy) {
        if (data.UserMana.GroupEmploy == "ĐKT") {
          userManaID = this.docInfo.EmployeeCare3;
        }
        if (data.UserMana.GroupEmploy == "EXP") {
          userManaID = this.docInfo.EmployeeCare1;
        }
        if (data.UserMana.GroupEmploy == "DOC") {
          userManaID = this.docInfo.EmployeeCare2;
        }
        if (data.UserMana.GroupEmploy == "NCV") {
          userManaID = this.docInfo.EmployeeCare4;
        }
        if (data.UserMana.GroupEmploy == "KTV") {
          userManaID = this.docInfo.EmployeeCare5;
        }
        if (data.UserMana.UserID) {
          userManaID = data.UserMana.UserID;
        }
        if (parseInt(data.QuotaTimeMana) == 0) {
          notify({
            title: "Lỗi",
            text: "Hạn xử lý phải lơn hơn 0",
            type: "error",
          });
          return;
        }
        if (userManaID && userManaID != "") {
          asi.push({
            UserRole: "Phê duyệt",
            GroupEmploy: data.UserMana.GroupEmploy,
            WorkID: data.WorkID,
            UserID: userManaID,
            QuotaTime: data.UserMana.QuotaTime,
          });
        } else {
          if (this.docInfo.TypeDoc != "QT00024") {
            notify({
              title: "Lỗi",
              text: "Chưa chọn người phụ trách",
              type: "error",
            });
            return;
          }
        }
      }
      if (userJoBID == "" && userManaID == "") {
        if (this.docInfo.TypeDoc != "QT00024") {
          notify({
            title: "Lỗi",
            text: "Chưa chọn người phụ trách",
            type: "error",
          });
          return;
        }
      }

      AddAssignLst({
        DocumentID: data.DocumentID,
        StepID: data.StepID,
        WorkID: data.WorkID,
        AssignLst: asi,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Gán nhân sự thành công",
            type: "success",
          });
        }
      });
    },
    btSendMailAddUserInWork(data) {
      var asi = [];
      if (data.UserJob.GroupEmploy.UserID) {
        asi.push(data.UserJob.GroupEmploy);
      }
      if (data.UserMana.GroupEmploy.UserID) {
        asi.push(data.UserMana.GroupEmploy);
      }
      SendMailAddAssignLst({
        DocumentID: data.DocumentID,
        StepID: data.StepID,
        WorkID: data.WorkID,
        AssignLst: asi,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            text: "Gán nhân sự thành công",
            type: "success",
          });
        }
      });
    },
    getDocumentFormByDocID() {
      GetDocumentFormByDocID({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.formTabLst = res.DocumentFormLst.map((item) => {
            if (item.TypeForm == 1) {
              if (item.DocumentFormLineLst.length == 0) {
                item.DocumentFormLineLst = item.DNFormLineLst;
              }
            }
            if (item.TypeForm == 2) {
              this.headers = [
                {
                  title: "STT",
                  sortable: false,
                  key: "Key",
                  align: "center",
                  width: 100,
                },
              ];
              for (var i = 0; i < item.DNFormLineLst.length; i++) {
                const line = item.DNFormLineLst[i];
                this.headers.push({
                  title: line.Parameter,
                  sortable: false,
                  key: "Line" + line.Required,
                  align: "center",
                  type: line.Type,
                  options: line.Type == 2 ? JSON.parse(line.OptionAnswer) : [],
                });
              }
              var len = item.DocumentFormLineLst.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex((obj) => obj.IDFormLine === item.IDFormLine)
              );
              len = len.length;
              for (var i = 0; i < len; i++) {
                var itemlst = item.DocumentFormLineLst.filter(
                  (p) => p.IDFormLine == i
                );
                var itemde = {};
                itemlst.forEach((ele, inle) => {
                  itemde["Line" + (inle + 1)] = ele.TextResult;
                });
                this.desserts.push(itemde);
              }
              this.desserts = this.desserts.map((item, index) => {
                return {
                  ...item,
                  Key: index + 1,
                };
              });
            }

            return {
              ...item,
            };
          });
          if (this.formTabLst.length > 0) {
            this.tab = this.formTabLst[0];
          }
        }
      });
    },
    startDocument() {
      StartDocument({
        DocumentID: this.$route.params.id,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getDocumentInfoByID();
          notify({
            title: "Thành công",
            type: "success",
          });
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    addJob() {
      this.newStep.jobs.push({
        JobName: "",
        DesJob: "",
        Assignee: null,
        Approver: null,
        QuotaTime: null,
      });
    },
    removeJob(index) {
      this.newStep.jobs.splice(index, 1);
    },
    saveNewStep() {
      if (!this.newStep.StepName || this.newStep.jobs.length === 0) {
        notify({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin và thêm ít nhất một công việc.",
          type: "error",
        });
        return;
      }
      var req = [];
      this.newStep.jobs.forEach((item) => {
        req.push({
          DocumentID: this.$route.params.id,
          StepName: this.newStep.StepName,
          Frequency: this.newStep.Frequency,
          ProcedureID: this.docInfo.TypeDoc,
          JobName: item.JobName,
          DesJob: item.DesJob,
        });
      });

      CreateDocumentJob({ Data: req }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            title: "Thành công",
            type: "success",
          });
          this.isShowCreateJob = false;
          this.processDocument();
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
    updateStepInfo() {
      UpdateDocumentStep({
        DocumentStepInfo: {
          ...this.stepInfo,
        },
      }).then((res) => {
        if (res.RespCode === 0) {
          notify({
            title: "Thành công",
            text: "Cập nhật bước thành công.",
            type: "success",
          });
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          });
        }
      });
    },
  },
  created() {
    this.getDocumentInfoByID();
    // this.getDocumentFormByDocID();
    this.getdefault();
  },
};
</script>

<style lang="scss" scoped>
.layout-card {
  min-height: 300px;
  max-height: 800px;
  overflow-y: scroll;
  &::-webkit-scrollbar-track-piece {
    background: #ffffff;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bec5ce;
    border-radius: 20px;
  }
}
</style>

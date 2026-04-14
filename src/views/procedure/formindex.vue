<template>
  <VCard>
    <VDialog v-model="isShowcreateForm" max-width="650px">
      <VCard>
        <VCardTitle>Thiết kế phiếu nhập thông tin</VCardTitle>
        <VCardText class="py-0">
          <VForm ref="form" v-model="valid">
            <VTextField
              v-model="createForm.ProcedureName"
              label="Quy trình xử lý"
              :disabled="true"
              class="mb-2"
            />
            <VRow>
              <VCol lg="9">
                <VTextField
                  v-model="createForm.NameForm"
                  label="Tên phiếu nhập"
                  class="mb-2"
                />
              </VCol>
              <VCol lg="3">
                <VSelect
                  v-model="createForm.TypeForm"
                  :items="typeFormLst"
                  item-title="ValueName"
                  item-value="ValueName2"
                  label="Loại"
                />
              </VCol>
            </VRow>
            <VTextarea
              v-model="createForm.Description"
              label="Mô tả"
              rows="2"
              class="mb-2"
            />
            <div class="d-flex justify-space-between">
              <span>Thêm các trường thông tin</span>
              <VBtn icon color="green" size="x-small" @click="addField">
                <VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
            <div
              style="max-height: calc(100vh - 350px) !important; overflow: auto"
              class="pt-2"
            >
              <div
                v-for="(field, index) in createForm.FormLineLst"
                :key="index"
                class="d-flex"
              >
                <div style="flex: 1">
                  <VTextField
                    v-if="[1, 2, 3].includes(field.Type)"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    class="mb-2"
                  />
                  <VTextField
                    v-if="field.Type == 4"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    append-inner-icon="mdi-calendar"
                    class="mb-2"
                  />
                  <VTextField
                    v-if="field.Type == 5"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    append-inner-icon="mdi-image"
                    class="mb-2"
                  />
                  <VTextField
                    v-if="field.Type == 6"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    append-inner-icon="mdi-file"
                    class="mb-2"
                  />
                  <VList v-if="field.Type === 2" class="pt-0">
                    <div class="d-flex justify-space-between px-4">
                      <div>Thêm các lựa chọn</div>
                      <VBtn
                        icon
                        color="green"
                        size="x-small"
                        style="margin-top: -4px"
                        @click="addOption(field)"
                      >
                        <VIcon>mdi-plus</VIcon>
                      </VBtn>
                    </div>
                    <div style="max-height: 250px !important; overflow: auto">
                      <VListItem
                        v-for="(item, index) in field.Options"
                        :key="index"
                      >
                        <div class="d-flex">
                          <VTextField
                            v-model="item.Name"
                            class="mt-1"
                            :label="'Lựa chọn ' + (index + 1)"
                            variant="underlined"
                          />

                          <VBtn
                            icon
                            variant="tonal"
                            color="red"
                            size="x-small"
                            class="my-2 ml-1"
                            @click="removeOption(field, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </VBtn>
                        </div>
                      </VListItem>
                    </div>
                    <VBtn
                      v-if="field.ShowMore == true"
                      size="small"
                      variant="text"
                      @click="showAllOptions(field)"
                    >
                      Xem thêm
                    </VBtn>
                  </VList>
                  <VList
                    v-if="field.Type === 3"
                    class="pt-0"
                    style="min-height: 100px"
                  >
                    <div class="px-2 pb-2">Cấu hình lựa chọn</div>

                    <VRow class="p-0" style="width: 100%">
                      <VCol>
                        <VSelect
                          v-model="field.OptionLine"
                          :items="optionTypeAuto"
                          item-title="ValueName"
                          item-value="ValueName2"
                          label="Loại lựa chọn"
                          @update:modelValue="onOptionLineChange(field, $event)"
                        />
                      </VCol>
                      <VCol>
                        <VSelect
                          v-if="field.OptionLine == 1"
                          v-model="field.OptionText"
                          :items="teamLst"
                          item-title="TeamName"
                          item-value="TeamID"
                          label="Lựa chọn nhóm tài khoản"
                        />
                        <VTextField
                          v-if="field.OptionLine == 2"
                          v-model="field.OptionText"
                          label="Tên bảng giá trị"
                        />
                      </VCol>
                    </VRow>
                  </VList>
                </div>
                <div>
                  <VTooltip location="top">
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        :icon="field.IsPrivate == 0 ? 'mdi-eye' : 'mdi-eye-off'"
                        variant="tonal"
                        :color="field.IsPrivate == 0 ? 'green' : 'error'"
                        size="small"
                        class="text-center mx-1"
                        @click="field.IsPrivate = field.IsPrivate == 0 ? 1 : 0"
                      />
                    </template>
                    <span
                      >{{ field.IsPrivate == 0 ? "Hiện" : "Ẩn" }} thông
                      tin</span
                    >
                  </VTooltip>
                  <VTooltip location="top">
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        :icon="
                          field.IsValue == 1
                            ? 'mdi-alphabetical'
                            : 'mdi-alphabetical-off'
                        "
                        variant="tonal"
                        :color="field.IsValue == 1 ? 'green' : 'error'"
                        size="small"
                        class="text-center mr-1"
                        @click="field.IsValue = field.IsValue == 0 ? 1 : 0"
                      />
                    </template>
                    <span>
                      {{ field.IsValue == 1 ? "Bắt " : "Không bắt " }} buộc nhập
                      dữ liệu</span
                    >
                  </VTooltip>

                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        variant="tonal"
                        color="gray"
                        icon="mdi-dots-grid"
                        size="small"
                      />
                    </template>
                    <VCard class="pa-2">
                      <div>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              class="mr-2 mb-2"
                              @click="setFieldType(field, 1)"
                            >
                              <VIcon color="blue">mdi-text-short </VIcon>
                            </VBtn>
                          </template>
                          <span>Nhập text</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="green"
                              @click="setFieldType(field, 2)"
                              class="mr-2 mb-2"
                            >
                              <VIcon>mdi-format-list-checks</VIcon>
                            </VBtn>
                          </template>
                          <span>Lựa chọn thủ công</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="warning"
                              @click="setFieldType(field, 3)"
                              class="mr-2 mb-2"
                            >
                              <VIcon>mdi-format-list-checks</VIcon>
                            </VBtn>
                          </template>
                          <span>Lựa chọn có sẵn</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="red"
                              class="mb-2"
                              @click="removeField2(index)"
                            >
                              <VIcon>mdi-delete</VIcon>
                            </VBtn>
                          </template>
                          <span>Xóa</span>
                        </VTooltip>
                      </div>
                      <div>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="purple"
                              @click="setFieldType(field, 4)"
                              class="mr-2"
                            >
                              <VIcon>mdi-calendar</VIcon>
                            </VBtn>
                          </template>
                          <span>Định dạng ngày</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="success"
                              @click="setFieldType(field, 5)"
                              class="mr-2"
                            >
                              <VIcon>mdi-image</VIcon>
                            </VBtn>
                          </template>
                          <span>Hình ảnh</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="green"
                              @click="setFieldType(field, 6)"
                              class="mr-2"
                            >
                              <VIcon>mdi-file</VIcon>
                            </VBtn>
                          </template>
                          <span>File đính kèm</span>
                        </VTooltip>
                      </div>
                    </VCard>
                  </VMenu>
                </div>
              </div>
            </div>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn size="small" rounded="sm" @click="isShowcreateForm = false">
            Cancel
          </VBtn>
          <VBtn color="green" size="small" rounded="sm" @click="btcreateForm">
            Xác nhận
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="isShowEditPhase" max-width="800px">
      <VCard>
        <VCardTitle>Thiết kế phiếu nhập thông tin</VCardTitle>
        <VCardText class="py-0">
          <VForm ref="form" v-model="valid">
            <VTextField
              v-model="editForm.ProcedureName"
              label="Quy trình xử lý"
              :disabled="true"
              class="mb-2"
            />
            <VRow>
              <VCol lg="9">
                <VTextField
                  v-model="editForm.NameForm"
                  label="Tên phiếu nhập"
                  class="mb-2"
                />
              </VCol>
              <VCol lg="3">
                <VSelect
                  v-model="editForm.TypeForm"
                  :items="typeFormLst"
                  item-title="ValueName"
                  item-value="ValueName2"
                  label="Loại"
                />
              </VCol>
            </VRow>
            <VTextarea
              v-model="editForm.Description"
              label="Mô tả"
              rows="2"
              class="mb-2"
            />
            <div class="d-flex justify-space-between">
              <span>Thêm các trường thông tin</span>
              <VBtn icon color="green" size="x-small" @click="addField2">
                <VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
            <div
              style="max-height: calc(100vh - 350px) !important; overflow: auto"
              class="pt-2"
            >
              <div
                v-for="(field, index) in editForm.FormLineLst"
                :key="index"
                class="d-flex"
              >
                <div style="flex: 1">
                  <VTextField
                    v-if="[1, 2, 3].includes(field.Type)"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    class="mb-2"
                  />
                  <VTextField
                    v-if="field.Type == 4"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    append-inner-icon="mdi-calendar"
                    class="mb-2"
                  />
                  <VTextField
                    v-if="field.Type == 5"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    append-inner-icon="mdi-image"
                    class="mb-2"
                  />
                  <VTextField
                    v-if="field.Type == 6"
                    v-model="field.Parameter"
                    :label="'Tên trường thông tin ' + (index + 1)"
                    append-inner-icon="mdi-file"
                    class="mb-2"
                  />
                  <VList v-if="field.Type === 2" class="pt-0">
                    <div class="d-flex justify-space-between px-4">
                      <div>Thêm các lựa chọn</div>
                      <VBtn
                        icon
                        color="green"
                        size="x-small"
                        style="margin-top: -4px"
                        @click="addOption(field)"
                      >
                        <VIcon>mdi-plus</VIcon>
                      </VBtn>
                    </div>
                    <div style="max-height: 250px !important; overflow: auto">
                      <VListItem
                        v-for="(item, index) in field.Options"
                        :key="index"
                      >
                        <div class="d-flex">
                          <VTextField
                            v-model="item.Name"
                            class="mt-1"
                            :label="'Lựa chọn ' + (index + 1)"
                            variant="underlined"
                          />

                          <VBtn
                            icon
                            variant="tonal"
                            color="red"
                            size="x-small"
                            class="my-2 ml-1"
                            @click="removeOption(field, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </VBtn>
                        </div>
                      </VListItem>
                    </div>
                    <VBtn
                      v-if="field.ShowMore == true"
                      size="small"
                      variant="text"
                      @click="showAllOptions(field)"
                    >
                      Xem thêm
                    </VBtn>
                  </VList>
                  <VList
                    v-if="field.Type === 3"
                    class="pt-0"
                    style="min-height: 100px"
                  >
                    <div class="px-2 pb-2">Cấu hình lựa chọn</div>

                    <VRow class="p-0" style="width: 100%">
                      <VCol>
                        <VSelect
                          v-model="field.OptionLine"
                          :items="optionTypeAuto"
                          item-title="ValueName"
                          item-value="ValueName2"
                          label="Loại lựa chọn"
                          @update:modelValue="onOptionLineChange(field, $event)"
                        />
                      </VCol>
                      <VCol>
                        <VSelect
                          v-if="field.OptionLine == 1"
                          v-model="field.OptionText"
                          :items="teamLst"
                          item-title="TeamName"
                          item-value="TeamID"
                          label="Lựa chọn nhóm tài khoản"
                        />
                        <VTextField
                          v-if="field.OptionLine == 2"
                          v-model="field.OptionText"
                          label="Tên bảng giá trị"
                        />
                      </VCol>
                    </VRow>
                  </VList>
                </div>
                <div>
                  <VTooltip location="top">
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        :icon="field.IsPrivate == 0 ? 'mdi-eye' : 'mdi-eye-off'"
                        variant="tonal"
                        :color="field.IsPrivate == 0 ? 'green' : 'error'"
                        size="small"
                        class="text-center mx-1"
                        @click="field.IsPrivate = field.IsPrivate == 0 ? 1 : 0"
                      />
                    </template>
                    <span
                      >{{ field.IsPrivate == 0 ? "Hiện" : "Ẩn" }} thông
                      tin</span
                    >
                  </VTooltip>
                  <VTooltip location="top">
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        :icon="
                          field.IsValue == 1
                            ? 'mdi-alphabetical'
                            : 'mdi-alphabetical-off'
                        "
                        variant="tonal"
                        :color="field.IsValue == 1 ? 'green' : 'error'"
                        size="small"
                        class="text-center mr-1"
                        @click="field.IsValue = field.IsValue == 0 ? 1 : 0"
                      />
                    </template>
                    <span>
                      {{ field.IsValue == 1 ? "Bắt " : "Không bắt " }} buộc nhập
                      dữ liệu</span
                    >
                  </VTooltip>
                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        variant="tonal"
                        color="gray"
                        icon="mdi-dots-grid"
                        size="small"
                      />
                    </template>
                    <VCard class="pa-2">
                      <div>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              class="mr-2 mb-2"
                              @click="setFieldType(field, 1)"
                            >
                              <VIcon color="blue">mdi-text-short </VIcon>
                            </VBtn>
                          </template>
                          <span>Nhập text</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="green"
                              @click="setFieldType(field, 2)"
                              class="mr-2 mb-2"
                            >
                              <VIcon>mdi-format-list-checks</VIcon>
                            </VBtn>
                          </template>
                          <span>Lựa chọn thủ công</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="warning"
                              @click="setFieldType(field, 3)"
                              class="mr-2 mb-2"
                            >
                              <VIcon>mdi-format-list-checks</VIcon>
                            </VBtn>
                          </template>
                          <span>Lựa chọn có sẵn</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="red"
                              class="mb-2"
                              @click="removeField2(index)"
                            >
                              <VIcon>mdi-delete</VIcon>
                            </VBtn>
                          </template>
                          <span>Xóa</span>
                        </VTooltip>
                      </div>
                      <div>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="purple"
                              @click="setFieldType(field, 4)"
                              class="mr-2"
                            >
                              <VIcon>mdi-calendar</VIcon>
                            </VBtn>
                          </template>
                          <span>Định dạng ngày</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="success"
                              @click="setFieldType(field, 5)"
                              class="mr-2"
                            >
                              <VIcon>mdi-image</VIcon>
                            </VBtn>
                          </template>
                          <span>Hình ảnh</span>
                        </VTooltip>
                        <VTooltip location="top">
                          <template #activator="{ props }">
                            <VBtn
                              icon
                              v-bind="props"
                              size="x-small"
                              color="green"
                              @click="setFieldType(field, 6)"
                              class="mr-2"
                            >
                              <VIcon>mdi-file</VIcon>
                            </VBtn>
                          </template>
                          <span>File đính kèm</span>
                        </VTooltip>
                      </div>
                    </VCard>
                  </VMenu>
                </div>
              </div>
            </div>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowEditPhase = false"> Cancel </VBtn>
          <VBtn color="green" @click="btEditForm"> Xác nhận </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VCardTitle>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h5 py-2">
          <div>Quy trình: {{ procedureInfo.ProcedureName }}</div>
          <div class="text-subtitle-1 py-1 px-2" style="white-space: normal">
            Mô tả: {{ procedureInfo.Description }}
          </div>
        </h6>
        <div class="d-flex">
          <VBtn
            color="green"
            icon="mdi-playlist-plus"
            size="small"
            class="mr-1"
            @click="btShowcreateForm"
          />
        </div>
      </div>
    </VCardTitle>
    <VDataTable :headers="headers" :items="formLst">
      <template #top="{ item }">
        <div class="px-6 text-h6">Danh sách form thông tin</div>
      </template>
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon color="orange" @click="btShowEditPhase(item)">
          mdi-square-edit-outline
        </VIcon>
        <VIcon color="red" class="me-2" @click="btShowDel(item)">
          mdi-trash-can
        </VIcon>
      </template>
      <template #item.action="{ item }">
        <VIcon color="green" @click="btPushToWork(item)">
          mdi-format-list-numbered
        </VIcon>
      </template>
      <template #item.Status="{ item }">
        <VChip v-if="item.Status == 1" color="green"> Hoạt động </VChip>
      </template>
      <template #item.TypeForm="{ item }">
        <VChip v-if="item.TypeForm == 0" color="gray"> Chưa chọn </VChip>
        <VChip v-if="item.TypeForm == 1" color="blue"> Phiếu </VChip>
        <VChip v-if="item.TypeForm == 2" color="green"> Excel </VChip>
      </template>
    </VDataTable>
  </VCard>
  <VDialog v-model="isShowDel" width="400">
    <VCard>
      <VToolbar class="pl-1" color="red" title="Xóa form" center />
      <VCardText>
        <div class="text-h5 pt-4">Có chắc bạn muốn xóa form này không?</div>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn color="blue" variant="text" @click="isShowDel = false">
          Đóng
        </VBtn>
        <VBtn color="red" variant="text" @click="btDelForm"> Xóa </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { GetDefaultValue } from "@/api/default";
import {
  CreateForm,
  DelForm,
  GetFormByID,
  GetFormLstByID,
  GetProcedureByID,
  UpdateForm,
} from "@/api/procedureApi";
import { GetTeamLst } from "@/api/teamApi";

// import { CreateStep, GetStepByProcedure } from "@/api/phaseApi";
export default {
  data() {
    return {
      input: "",
      typeFormLst: [],
      procedureInfo: {},
      createForm: {
        Status: 1,
        TypeForm: 1,
        FormLineLst: [{ Parameter: "", Type: 1, IsPrivate: 0 }],
      },
      isShowcreateForm: false,
      isShowDel: false,
      valid: false,
      headers: [
        {
          title: "STT",
          key: "Key",
          align: "center",
          width: 120,
          sortable: false,
        },

        // { title: "Action", key: "action", align: "center", sortable: false },
        { title: "Mã", key: "IDForm" },
        { title: "Tên phiếu", key: "NameForm" },
        { title: "Loại", key: "TypeForm" },
        { title: "Bước", key: "StepName" },
        { title: "Công việc", key: "WorkName" },
        { title: "Trạng thái", key: "Status" },
      ],
      isShowEditPhase: false,
      validEdit: false,
      editForm: {
        StepName: "",
        Description: "",
        TypeForm: 1,

        // Add other FormLineLst as necessary
      },
      itemDel: {},
      formLst: [],
      optionTypeAuto: [],
      teamLst: [],
    };
  },
  created() {
    this.getProcedureByID();
    this.getFormLstByID();
    this.getDefault();
  },
  methods: {
    onOptionLineChange(field, value) {
      if (value == 1) {
        this.getTeamLst();
      }
    },
    getTeamLst() {
      GetTeamLst({ RowspPage: 10000, PageNumber: 1 }).then((res) => {
        if (res.RespCode == 0) {
          this.teamLst = res.Data;
        }
      });
    },
    showAllOptions(field) {
      const allOptions = JSON.parse(field.OptionAnswer); // Tải tất cả các lựa chọn
      const currentLength = field.Options.length; // Độ dài hiện tại của danh sách lựa chọn
      const newOptions = allOptions.slice(currentLength, currentLength + 30); // Lấy 30 lựa chọn tiếp theo

      field.Options.push(...newOptions); // Thêm các lựa chọn mới vào danh sách
      field.ShowMore = newOptions.length < 30 ? false : true; // Nếu không còn lựa chọn nào, ẩn nút "Xem thêm"
    },
    getDefault() {
      GetDefaultValue({
        Table: "Loại phiếu",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.typeFormLst = res.DefaultValueLst.map((item) => {
            return {
              ...item,
              ValueName2: parseInt(item.ValueName2),
            };
          });
        }
      });
      GetDefaultValue({
        Table: "Loại dòng trong phiếu",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.optionTypeAuto = res.DefaultValueLst.map((item) => {
            return {
              ...item,
              ValueName2: parseInt(item.ValueName2),
            };
          });
        }
      });
    },
    btShowDel(data) {
      this.itemDel = data;
      this.isShowDel = true;
    },
    btDelForm() {
      DelForm({
        FormID: this.itemDel.IDForm,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.isShowDel = false;
          this.getFormLstByID();
          notify({
            type: "success",
            title: "Thành công",
            text: "Xóa thành thành công",
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

    getProcedureByID() {
      GetProcedureByID({ ProcedureID: this.$route.params.id }).then((res) => {
        if (res.RespCode == 0) {
          this.procedureInfo = res.Data;
        }
      });
    },
    btcreateForm() {
      if (this.createForm.NameForm && this.createForm.TypeForm) {
        CreateForm({
          FormHeaderInfo: {
            ...this.createForm,
            FormLineLst: this.createForm.FormLineLst.map((item, index) => {
              return {
                ...item,
                Required: index + 1,
                OptionAnswer: JSON.stringify(item.Options),
              };
            }),
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getFormLstByID();
            this.isShowcreateForm = false;
            this.createForm = {
              Status: 1,
              StepOrder: 1,
              FormLineLst: [{ Parameter: "", Type: 1 }],
            };
            notify({
              title: "Thành công",
              text: "Thêm Bước thành công",
              type: "success",
            });
          }
        });
      } else {
        notify({
          title: "Lỗi",
          text: "Chưa nhập đầy đủ thông tin",
          type: "error",
        });
      }
    },
    btShowcreateForm() {
      this.createForm.ProcedureID = this.procedureInfo.ProcedureID;
      this.createForm.StepID = this.$route.params.stepid;
      this.createForm.WorkID = this.$route.params.workid;
      this.createForm.ProcedureName = this.procedureInfo.ProcedureName;
      this.isShowcreateForm = true;
    },
    btPushToWork(data) {
      this.$router.push("/cong-viec/" + data.StepID);
    },
    getFormLstByID() {
      GetFormLstByID({
        ProcedureID: this.$route.params.id,
        StepID: this.$route.params.stepid,
        WorkID: this.$route.params.workid,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.formLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
        }
      });
    },
    btShowEditPhase(item) {
      GetFormByID({
        IDForm: item.IDForm,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.editForm = res.Data;
          // Kiểm tra độ dài của OptionAnswer
          const longOptions = this.editForm.FormLineLst.filter(
            (item) => item.OptionAnswer && item.OptionAnswer.length > 1000,
          );

          if (longOptions.length > 0) {
            // Chỉ hiển thị một phần dữ liệu cho các lựa chọn dài
            longOptions.forEach((item) => {
              console.log(item);

              if (item.Type == 2) {
                item.Options = JSON.parse(item.OptionAnswer).slice(0, 30); // Chỉ lấy 5 lựa chọn đầu tiên
                item.ShowMore = true;
              }

              // Thêm thuộc tính để hiển thị nút "Xem thêm"
            });
          }

          const shortOptions = this.editForm.FormLineLst.filter(
            (item) => item.OptionAnswer && item.OptionAnswer.length <= 1000,
          );

          if (shortOptions.length > 0) {
            shortOptions.forEach((item) => {
              item.Options = JSON.parse(item.OptionAnswer);
            });
          }
          this.getTeamLst();
          this.editForm.FormLineLst = this.editForm.FormLineLst.map((item) => {
            return {
              ...item,
              OptionText:
                item.Type == 3 && item.OptionLine == 1
                  ? parseInt(item.OptionText)
                  : item.OptionText,
            };
          });
          this.isShowEditPhase = true;
        }
      });
    },
    btEditForm() {
      if (this.editForm.IDForm) {
        UpdateForm({
          FormHeaderInfo: {
            ...this.editForm,
            FormLineLst: this.editForm.FormLineLst.map((item, index) => {
              return {
                ...item,
                Required: index + 1,
                OptionAnswer: JSON.stringify(item.Options),
              };
            }),
          },
        }).then((res) => {
          if (res.RespCode == 0) {
            this.getFormLstByID(); // Refresh the phase list after successful update
            this.isShowEditPhase = false; // Close the edit dialog
            notify({
              title: "Thành công",
              text: "Cập nhật Bước thành công",
              type: "success",
            });
          } else {
            notify({
              title: "Lỗi",
              text: "Cập nhật Bước thất bại",
              type: "error",
            });
          }
        });
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin",
          type: "error",
        });
      }
    },
    addField() {
      this.createForm.FormLineLst.push({
        Parameter: "",
        Type: 1,
        IsPrivate: 0,
      }); // Add a new field
    },
    removeField(index) {
      this.createForm.FormLineLst.splice(index, 1); // Remove the field at the specified index
    },
    addField2() {
      this.editForm.FormLineLst.push({ Parameter: "", Type: 1, IsPrivate: 0 }); // Add a new field
    },
    removeField2(index) {
      this.editForm.FormLineLst.splice(index, 1); // Remove the field at the specified index
    },
    setFieldType(field, type) {
      field.Type = type;
      field.Options = [{ Name: "" }];
    },
    addOption(field) {
      field.Options.push({ Name: "" }); // Thêm một lựa chọn mới
    },
    removeOption(field, index) {
      field.Options.splice(index, 1); // Xóa lựa chọn tại chỉ số đã cho
    },
  },
};
</script>

<style lang="scss" scoped></style>

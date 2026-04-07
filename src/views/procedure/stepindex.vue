<template>
  <VCard>
    <VDialog
      v-model="isShowCreatePhase"
      max-width="800px"
    >
      <VCard>
        <VCardTitle>Thêm bước</VCardTitle>
        <VCardText>
          <VForm
            ref="form"
            v-model="valid"
          >
            <VTextField
              v-model="createPhase.ProcedureName"
              label="Quy trình xử lý"
              :disabled="true"
              class="mb-2"
            />
            <VRow>
              <VCol lg="10">
                <VTextField
                  v-model="createPhase.StepName"
                  label="Tên bước"
                  class="mb-2"
                />
              </VCol>
              <VCol lg="2">
                <VTextField
                  v-model="createPhase.StepOrder"
                  label="Thứ tự"
                  type="number"
                  :min="1"
                  :max="1000"
                />
              </VCol>
            </VRow>
            <VTextarea
              v-model="createPhase.Description"
              label="Mô tả"
              class="mb-2"
            />
            <VCheckbox
              v-model="createPhase.IsContinueJob"
              label="Các công việc trong bước có độc lập"
              :true-value="1"
              :false-value="0"
              color="primary"
              hide-details=""
            />
            <VCheckbox
              v-model="createPhase.IsBackCurrent"
              label="Có từ chối các bước cùng cấp"
              :true-value="1"
              :false-value="0"
              color="primary"
              hide-details=""
            />
            <VRow>
              <VCol cols="6">
                <span>Khi bị từ chối</span>
                <VSelect
                  v-model="createPhase.StepBack"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước khi bị từ chối"
                  class="mt-2"
                  clearable
                />
              </VCol>
              <VCol cols="6">
                <span>Khi tiếp tục</span>
                <VSelect
                  v-model="createPhase.StepNext"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước tiếp theo"
                  class="mt-2"
                  clearable
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowCreatePhase = false">
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="btCreatePhase"
          >
            Xác nhận
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isShowEditPhase"
      max-width="800px"
    >
      <VCard>
        <VCardTitle>Chỉnh sửa bước</VCardTitle>
        <VCardText>
          <VForm
            ref="editForm"
            v-model="validEdit"
          >
            <VRow>
              <VCol lg="10">
                <VTextField
                  v-model="editPhase.StepName"
                  label="Tên bước"
                  class="mb-2"
                />
              </VCol>
              <VCol lg="2">
                <VTextField
                  v-model="editPhase.StepOrder"
                  label="Thứ tự"
                  type="number"
                  :min="1"
                  :max="1000"
                />
              </VCol>
            </VRow>

            <VTextarea
              v-model="editPhase.Description"
              label="Mô tả"
              class="mb-2"
            />
            <VCheckbox
              v-model="editPhase.IsContinueJob"
              label="Các công việc trong bước có độc lập"
              :true-value="1"
              :false-value="0"
              color="primary"
              hide-details=""
            />
            <VCheckbox
              v-model="editPhase.IsBackCurrent"
              label="Có từ chối các bước cùng cấp"
              :true-value="1"
              :false-value="0"
              color="primary"
              hide-details=""
            />
            <VRow>
              <VCol cols="6">
                <span>Khi bị từ chối</span>
                <VSelect
                  v-model="editPhase.StepBack"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước khi bị từ chối"
                  class="mt-2"
                  clearable
                />
              </VCol>
              <VCol cols="6">
                <span>Khi tiếp tục</span>
                <VSelect
                  v-model="editPhase.StepNext"
                  :items="phaseLst"
                  item-title="StepName"
                  item-value="StepID"
                  label="Chọn bước tiếp theo"
                  class="mt-2"
                  clearable
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="isShowEditPhase = false">
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="btEditPhase"
          >
            Xác nhận
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VCardTitle>
      <div
        class="d-flex"
        style="justify-content: space-between"
      >
        <h6 class="text-h5 py-2">
          <div>Quy trình: {{ procedureInfo.ProcedureName }}</div>
          <div
            class="text-subtitle-1 py-1 px-2"
            style="white-space: normal"
          >
            Mô tả: {{ procedureInfo.Description }}
          </div>
        </h6>
        <div class="d-flex">
          <VBtn
            color="green"
            icon="mdi-playlist-plus"
            size="small"
            class="mr-1"
            @click="btShowCreatePhase"
          />
        </div>
      </div>
    </VCardTitle>
    <VDataTable
      :headers="headers"
      :items="phaseLst"
    >
      <template #item.Key="{ item }">
        {{ item.Key }}
        <VIcon
          color="orange"
          @click="btShowEditPhase(item)"
        >
          mdi-square-edit-outline
        </VIcon>
        <VIcon
          color="red"
          class="me-2"
          @click="btShowDel(item)"
        >
          mdi-trash-can
        </VIcon>
      </template>
      <template #item.action="{ item }">
        <VIcon
          color="green"
          @click="btPushToWork(item)"
        >
          mdi-format-list-numbered
        </VIcon>
      </template>
      <template #item.Status="{ item }">
        <VChip
          v-if="item.Status == 1"
          color="green"
        >
          Hoạt động
        </VChip>
      </template>
    </VDataTable>
  </VCard>
  <VDialog
    v-model="isShowDel"
    width="400"
  >
    <VCard>
      <VToolbar
        class="pl-1"
        color="red"
        title="Xóa bước"
        center
      />
      <VCardText>
        <div class="text-h5 pt-4">
          Có chắc bạn muốn xóa bước này không?
        </div>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          color="blue"
          variant="text"
          @click="isShowDel = false"
        >
          Đóng
        </VBtn>
        <VBtn
          color="red"
          variant="text"
          @click="btDelStep"
        >
          Xóa
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import {
  CreateStep,
  DelStep,
  GetProcedureByID,
  GetStepByProcedure,
  UpdateStep,
} from "@/api/procedureApi"

// import { CreateStep, GetStepByProcedure } from "@/api/phaseApi";
export default {
  data() {
    return {
      input: "",
      phaseLst: [],
      procedureInfo: {},
      createPhase: {
        Status: 1,
        StepOrder: 1,
      },
      isShowCreatePhase: false,
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
        { title: "Action", key: "action", align: "center", sortable: false },
        { title: "Mã", key: "StepID" },
        { title: "Bước", key: "StepName" },
        { title: "Từ chối", key: "StepBack" },
        { title: "Tiếp tục", key: "StepNext" },
        { title: "Thứ tự", key: "StepOrder", align: "center", sortable: false },
        { title: "Mô tả", key: "Description" },
        { title: "Trạng thái", key: "Status" },
      ],
      isShowEditPhase: false,
      validEdit: false,
      editPhase: {
        StepName: "",
        Description: "",
        StepOrder: 1,

        // Add other fields as necessary
      },
      itemDel: {},
    }
  },
  created() {
    this.getProcedureByID()
    this.getPhaseLst()
  },
  methods: {
    btShowDel(data) {
      this.itemDel = data
      this.isShowDel = true
    },
    btDelStep() {
      DelStep({
        StepID: this.itemDel.StepID,
      }).then(res => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Xóa thành thành công",
          })
          this.getProcedureByID()
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.RespText,
          })
        }
      })
    },
    getProcedureByID() {
      GetProcedureByID({ ProcedureID: this.$route.params.id }).then(res => {
        if (res.RespCode == 0) {
          this.procedureInfo = res.Data
        }
      })
    },
    btCreatePhase() {
      if (
        this.createPhase.ProcedureID &&
        this.createPhase.StepName &&
        this.createPhase.Description
      ) {
        CreateStep({
          StepInfo: {
            ...this.createPhase,
          },
        }).then(res => {
          if (res.RespCode == 0) {
            this.getPhaseLst()
            this.isShowCreatePhase = false;
            ((this.createPhase = {
              Status: 1,
              StepOrder: 1,
            }),
            notify({
              title: "Thành công",
              text: "Thêm Bước thành công",
              type: "success",
            }))
          }
        })
      } else {
        notify({
          title: "Lỗi",
          text: res.RespText,
          type: "error",
        })
      }
    },
    btShowCreatePhase() {
      this.createPhase.ProcedureID = this.procedureInfo.ProcedureID
      this.createPhase.ProcedureName = this.procedureInfo.ProcedureName
      this.isShowCreatePhase = true
    },
    btPushToWork(data) {
      this.$router.push("/cong-viec/" + data.StepID)
    },
    getPhaseLst() {
      GetStepByProcedure({
        PageNumber: 1,
        RowspPage: 1000,
        Search: "",
        ProcedureID: this.$route.params.id,
      }).then(res => {
        if (res.RespCode == 0) {
          this.phaseLst = res.Data.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            }
          })
          this.updateUI++
        }
      })
    },
    btShowEditPhase(item) {
      this.editPhase = { ...item } // Populate editPhase with the selected item's data
      this.isShowEditPhase = true // Show the edit dialog
    },
    btEditPhase() {
      if (this.editPhase.StepName && this.editPhase.Description) {
        UpdateStep({
          StepInfo: {
            ...this.editPhase,
          },
        }).then(res => {
          if (res.RespCode == 0) {
            this.getPhaseLst() // Refresh the phase list after successful update
            this.isShowEditPhase = false // Close the edit dialog
            notify({
              title: "Thành công",
              text: "Cập nhật Bước thành công",
              type: "success",
            })
          } else {
            notify({
              title: "Lỗi",
              text: "Cập nhật Bước thất bại",
              type: "error",
            })
          }
        })
      } else {
        notify({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin",
          type: "error",
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>

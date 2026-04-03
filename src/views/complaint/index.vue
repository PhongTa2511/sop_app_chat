<template>
  <VCard>
    <VCardTitle class="p-2 pl-2">
      DANH SÁCH PHIẾU KHIẾU NẠI
    </VCardTitle>
    <VDataTableServer
      :items-per-page="rowspPage"
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="fileLst"
      height="calc(100vh - 270px)"
      items-per-page-text="Số dòng 1 trang"
      sort-asc-icon="mdi-menu-up"
      sort-desc-icon="mdi-menu-down"
      @update:itemsPerPage="btRow"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: 10000, title: 'All' },
      ]"
      @update:page="btPage"
    >
      <template #top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <VTextField
              v-model="searchString"
              label="Tìm kiếm"
              hide-details
              style="width: 250px !important"
              clearable
            />
          </span>

          <!--
            <span>
            <v-select
            v-model="optionStatus"
            placeholder="Trạng thái"
            density="compact"
            :items="optionStatusLst"
            item-value="value"
            item-title="label"
            chips
            style="width: 220px !important"
            ></v-select>
            </span> 
          -->
          <!--
            <v-btn
            color="blue"
            variant="tonal"
            icon="mdi-playlist-plus"
            size="small"
            @click="isShowCreateDocument = true"
            ></v-btn> 
          -->
          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getDocumentFormLstPublic"
          />
        </div>
      </template>
      <template #item.Status="{ item }">
        <VChip
          :color="getStatus(item.Status).color"
          size="small"
        >
          {{ getStatus(item.Status).text }}
        </VChip>
      </template>

      <template #item.Key="{ item }">
        {{ item.Key }}

        <VBtn
          v-if="item.DocumentID"
          size="x-small"
          icon
          class="mr-1"
          @click="btPushToDocinfo(item)"
        >
          <VIcon>mdi-list-box</VIcon>
          <VTooltip
            activator="parent"
            location="top"
          >
            Xem hồ sơ
          </VTooltip>
        </VBtn>
        <VBtn
          v-else
          size="x-small"
          class="mr-1"
          icon
          color="green"
          @click="btShowCreateDocument(item)"
        >
          <VIcon>mdi-note-plus</VIcon>
          <VTooltip
            activator="parent"
            location="top"
          >
            Tạo hồ sơ xử lý khiếu nại
          </VTooltip>
        </VBtn>
        <VBtn
          size="x-small"
          icon
          color="orange"
          @click="btShowForm(item)"
        >
          <VIcon>mdi-account-file-text</VIcon>
          <VTooltip
            activator="parent"
            location="top"
          >
            Xem thông tin phiếu khiếu nại
          </VTooltip>
        </VBtn>
      </template>
    </VDataTableServer>
  </VCard>

  <VDialog
    v-model="isShowCreateDocument"
    max-width="500"
  >
    <VCard>
      <VCardTitle>Tạo hồ sơ xử lý khiếu nại</VCardTitle>
      <VCardText>
        <VSelect
          v-model="createDocument.TypeDoc"
          placeholder="Chọn loại quy trình"
          density="compact"
          :items="procedureLst"
          item-value="ProcedureID"
          item-title="ProcedureName"
          chips
          class="mb-2"
        />
        <VTextarea
          v-model="createDocument.Note"
          label="Mô tả"
          required
          :rows="2"
          class="mb-2"
        />
      </VCardText>
      <VCardActions>
        <VBtn
          text
          @click="isShowCreateDocument = false"
        >
          Hủy
        </VBtn>
        <VBtn
          color="green"
          @click="btCreateDocument"
        >
          Xác nhận
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isShowFile"
    persistent
    width="600"
  >
    <VCard class="px-6 py-4">
      <VCardTitle class="pl-2">
        Thông tin phiếu khiếu nại
      </VCardTitle>
      <VForm
        v-if="formFields.length"
        ref="form"
      >
        <div
          v-for="field in formFields"
          :key="field.RowID"
          class="mb-2"
        >
          <VTextField
            v-if="field.Type === 1"
            v-model="field.TextResult"
            :label="field.Parameter"
            readonly
          />

          <VSelect
            v-else-if="field.Type === 2"
            v-model="field.TextResult"
            :label="field.Parameter"
            :items="parseOptions(field.OptionAnswer)"
            item-title="Name"
            item-value="Name"
            readonly
            hide-details
          />
        </div>
      </VForm>
      <VCardActions>
        <VBtn @click="isShowFile = false">
          Đóng
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { CreateGSPDocument } from "@/api/briefApi"
import { GetDocumentFormLstPublic } from "@/api/documentFormApi"

import { GetProcedureLst } from "@/api/procedureApi"
import { formatDateDisplay } from "@/helpers/getTime"

export default {
  data() {
    return {
      fileLst: [],
      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,
      optionStatusLst: [
        { value: 1, label: "Mới tạo" },
        { value: 2, label: "Đang làm" },
        { value: 4, label: "Hoàn thành" },
        { value: 0, label: "Tất cả" },
      ],

      dataAll: [],
      loadding: false,

      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 120,
        },
        { title: "Phiếu", key: "NameForm", sortable: false },
        { title: "Đơn vị khiếu nại", key: "ComName", sortable: false },
        { title: "Sản phẩm khiếu nại", key: "ProductName", sortable: false },
        { title: "Người khiếu nại", key: "PersonName", sortable: false },
        {
          title: "Thời gian",
          key: "TimeCreateShow",
          sortable: false,
          width: 160,
        },
        { title: "Trạng thái", key: "Status", sortable: false, width: 100 },
      ],

      productExcelLst: [],
      isShowCreateDocument: false,
      createDocument: {
        name: "",
        description: "",
      },

      isLoading: false,
      searchString: "",
      formFields: [],
      isShowFile: false,
      rowForm: 0,
    }
  },
  watch: {
    pageNumber(value) {
      this.getDocumentFormLstPublic()
    },
    rowspPage(value) {
      this.getDocumentFormLstPublic()
    },
  },
  created() {
    this.getDocumentFormLstPublic()
    this.getProcedureLst() // Call the new method to fetch procedure list
  },
  methods: {
    btPage(data) {
      this.pageNumber = data
    },
    btRow(data) {
      this.rowspPage = data
    },
    btShowForm(data) {
      console.log(data)

      this.formFields = data.DocumentFormLineLst
      this.isShowFile = true
    },
    parseOptions(optionAnswer) {
      return optionAnswer.split(";").map(item => {
        const [Name, Value] = item.split(":")
        
        return { Name, Value }
      })
    },
    btShowCreateDocument(data) {
      this.rowForm = data.RowID
      this.isShowCreateDocument = true
    },
    btPushToDocinfo(data) {
      this.$router.push("/thong-tin/" + data.DocumentID)
    },

    getDocumentFormLstPublic() {
      this.loadding = true

      GetDocumentFormLstPublic({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: this.searchString,
      }).then(res => {
        this.fileLst = res.Data.map((item, index) => {
          var num = (this.pageNumber - 1) * this.rowspPage
          
          return {
            ...item,
            Key: index + 1 + num,
            TimeCreateShow: formatDateDisplay(item.TimeCreate),
          }
        })
        this.totalLength = res.TotalRows
      })
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" }
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "blue" }
      }
      if (status == 4) {
        return { text: "Đã tạo HS", color: "success" }
      }

      return { text: "Tạm dừng", color: "more" }
    },

    btCreateDocument() {
      CreateGSPDocument({
        DocumentInfo: {
          TypeDoc: this.createDocument.TypeDoc,
          Note: this.createDocument.Note,
          Data: this.productExcelLst,
          ComID: this.rowForm,
        },
      }).then(res => {
        // Updated to use createDocument
        if (res.RespCode === 0) {
          notify({
            title: "Tạo hồ sơ",
            text: "Hồ sơ đã được tạo thành công",
            type: "success",
          })
          this.isShowCreateDocument = false // Close dialog
          this.getDocumentFormLstPublic() // Refresh the document list
        } else {
          notify({
            title: "Lỗi",
            text: res.RespText,
            type: "error",
          })
        }
      })
    },

    getProcedureLst() {
      GetProcedureLst({
        PageNumber: 1,
        RowspPage: 100,
        Search: "",
      })
        .then(res => {
          if (res.RespCode === 0) {
            this.procedureLst = res.Data.filter(p =>
              "QT01022,QT01023,QT01024".includes(p.ProcedureID),
            ) // Assuming you want to store the result in procedureLst
          } else {
            notify({
              title: "Error",
              text: res.RespText,
              type: "error",
            })
          }
        })
        .catch(error => {
          notify({
            title: "Error",
            text: "Failed to fetch procedure list.",
            type: "error",
          })
          console.error(error)
        })
    },
  },
}
</script>

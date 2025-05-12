<template>
  <v-card class="pa-4 mx-auto" style="max-width: 600px">
    <div class="d-flex justify-center">
      <img :src="logoC" alt="" style="height: 48px" />
    </div>

    <div class="text-center my-4">
      <h4 class="mb-2" style="color: #cf1111">
        HỆ SINH THÁI DTP - QUẢN LÝ QUY TRÌNH
      </h4>
      <h5 class="mb-2">KHIẾU NẠI SẢN PHẨM CPC1 HÀ NỘI</h5>
    </div>
    <h4 class="my-2">{{ dataForm.NameForm }}</h4>
    <v-form ref="form" v-if="formFields.length">
      <div v-for="field in formFields" :key="field.RowID" class="mb-2">
        <v-text-field
          v-if="field.Type === 1"
          v-model="field.TextResult"
          :label="field.Parameter"
          :required="nonValidatedFields.includes(field.Required) ? false : true"
          :rules="
            nonValidatedFields.includes(field.Required)
              ? []
              : [(v) => !!v || 'Vui lòng chọn thông tin']
          "
        />

        <v-select
          v-else-if="field.Type === 2"
          v-model="field.TextResult"
          :label="field.Parameter"
          :items="parseOptions(field.OptionAnswer)"
          item-title="Name"
          item-value="Name"
          :required="nonValidatedFields.includes(field.Required) ? false : true"
          :rules="
            nonValidatedFields.includes(field.Required)
              ? []
              : [(v) => !!v || 'Vui lòng chọn thông tin']
          "
          hide-details
        />
      </div>
    </v-form>
    <v-btn block rounded="md" :loading="loading" @click="uploadForm"
      >Gửi khiếu nại</v-btn
    >
  </v-card>
</template>

<script>
import logoC from "@/assets/images/logo-box.png";
import { GetFormByIDPublic } from "@/api/procedureApi";
import { UpdateDocumentFormPublic } from "@/api/documentFormApi";

export default {
  data() {
    return {
      logoC: logoC,
      dataForm: {},
      formFields: [],
      formData: {},
      nonValidatedFields: [1, 2, 3],
      loading: false,
    };
  },
  methods: {
    async uploadForm() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        notify({
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
          type: "error",
        });
        return;
      }

      this.loading = true;
      const IDForm = this.dataForm.IDForm;
      const ProcedureID = this.dataForm.ProcedureID;
      const NameForm = this.dataForm.NameForm;
      const Description = this.dataForm.Description;
      const TypeForm = this.dataForm.TypeForm;

      const DocumentFormLineLst = this.formFields.map((field) => {
        return {
          RowID: field.RowID,
          IDFormLine: 0,
          IDForm: IDForm,
          Parameter: field.Parameter,
          Status: 1,
          Type: field.Type,
          Required: field.Required,
          DateResult: "",
          TextResult: field.TextResult || "",
          OptionAnswer: field.OptionAnswer,
        };
      });

      const payload = {
        DocumentID: this.documentID,
        IDForm,
        ProcedureID,
        NameForm,
        Description,
        TypeForm,
        IsPublic: 1,
        DocumentFormLineLst,
      };

      UpdateDocumentFormPublic({ DocumentFormInfo: payload }).then((res) => {
        if (res.RespCode === 0) {
          this.$toast.success("Gửi khiếu nại thành công!");
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
        this.loading = false;
      });
    },
    getFormByIDPublic() {
      GetFormByIDPublic({ IDForm: "F002056" }).then((res) => {
        if (res.RespCode === 0) {
          this.dataForm = res.Data;
          const sortedFields = res.Data.FormLineLst.sort(
            (a, b) => a.Required - b.Required
          );
          this.formFields = sortedFields;
        }
      });
    },
    parseOptions(optionsStr) {
      try {
        return JSON.parse(optionsStr || "[]");
      } catch (e) {
        return [];
      }
    },
  },
  created() {
    this.getFormByIDPublic();
  },
};
</script>

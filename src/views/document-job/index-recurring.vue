<template>
  <VCard class="pt-2">
    <VDataTableServer
      :items-per-page="rowspPage"
      :items-length="totalLength"
      no-data-text="Không có dữ liệu"
      :headers="headers"
      :items="jobLst"
      height="calc(100vh - 250px)"
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
      fixed-header
      :loading="loadding"
    >
      <template #top>
        <div class="d-flex flex-wrap gap-2 px-2">
          <span>
            <VMenu :close-on-content-click="false">
              <template #activator="{ props }">
                <VBtn
                  color="blue"
                  size="small"
                  icon=" mdi-filter"
                  v-bind="props"
                />
              </template>
              <VList>
                <VListItem>
                  <!-- <VTextField
                    v-model="proName"
                    label="Hồ sơ"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  /> -->

                  <VTextField
                    v-model="workName"
                    label="Công việc"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VTextField
                    v-model="employeeName"
                    label="Nhân viên"
                    hide-details
                    style="width: 250px !important"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="pt-2"
                  />
                  <VSelect
                    v-model="statusSearch"
                    class="pt-2"
                    label="Trạng thái"
                    density="compact"
                    :items="statusSearchLst"
                    item-value="value"
                    item-title="text"
                  />
                  <VSelect
                    v-model="workOver"
                    class="pt-2"
                    label="Tình trạng"
                    density="compact"
                    :items="workOverLst"
                    item-value="value"
                    item-title="value"
                  />
                  <VBtn block class="rounded mt-2" @click="getDocumentJobByEm"
                    >Tìm kiếm</VBtn
                  >
                </VListItem>
              </VList>
            </VMenu>
          </span>

          <VBtn
            color="green"
            variant="tonal"
            icon="mdi-reload"
            size="small"
            @click="getDocumentJobByEm"
          />
        </div>
      </template>
      <template #item.Status="{ item }">
        <div>
          <VChip size="x-small" :color="getStatus(item.Status).color">
            {{ getStatus(item.Status).text }}
          </VChip>
        </div>
      </template>

      <template #item.Key="{ item }">
        {{ item.Key }}
        <v-btn
          color="orange"
          class="me-2"
          size="x-small"
          @click="btPushToDocinfo(item)"
          icon="mdi-note-edit"
        >
        </v-btn>
      </template>
      <template #item.StartDate="{ item }">
        <div style="color: green">
          {{ item.StartDate }}
        </div>
      </template>
      <template #item.TimeQuotaAssign="{ item }">
        <div style="color: red">
          {{ item.TimeQuotaAssign }}
        </div>
      </template>
      <template #item.FullName="{ item }">
        <div :class="itemRowBackground(item)">
          {{ item.Status == 1 ? item.AssignName : item.ApproveName }}
        </div>
      </template>
    </VDataTableServer>
  </VCard>
</template>

<script>
import { GetRecurringTaskLst } from "@/api/recurringJobApi";
import { formatDateDisplayDDMMYY } from "@/helpers/getTime";

export default {
  data() {
    return {
      loadding: false,

      rowspPage: 10,
      pageNumber: 1,
      totalLength: 0,

      headers: [
        {
          title: "STT",
          sortable: false,
          key: "Key",
          align: "center",
          width: 120,
        },
        { title: "Công việc", key: "Title", sortable: false },
        {
          title: "Bắt đầu",
          key: "StartDate",
          sortable: false,
          width: 100,
        },
        {
          title: "Kết thúc",
          key: "TimeQuotaAssign",
          sortable: false,
          width: 100,
        },
        { title: "Trạng thái", key: "Status", sortable: false, width: 120 },
        { title: "Thực hiện", key: "FullName", sortable: false, width: 200 },
      ],
      jobLst: [],
      proName: "",
      workName: "",
      product: "",
      name2: "",
      country: "",
      employeeName: "",
      statusSearch: "",
      workOver: "Tất cả",
      workOverLst: [
        { value: "Tất cả" },
        { value: "Quá hạn" },
        { value: "Đúng hạn" },
      ],
      statusSearchLst: [
        { value: 1, text: "Đang làm" },
        { value: 3, text: "Đã báo cáo - Cần duyệt" },
      ],
    };
  },
  watch: {
    search() {
      this.getDocumentJobByEm();
    },
    pageNumber(newValue) {
      this.getDocumentJobByEm();
    },
    rowspPage(newValue) {
      this.getDocumentJobByEm();
    },
  },
  created() {
    this.proName = this.$route.query.proName;
    this.workName = this.$route.query.workName;
    this.product = this.$route.query.product;
    this.name2 = this.$route.query.name2;
    this.country = this.$route.query.country;
    this.employeeName = this.$route.query.employeeName;
    this.statusSearch = this.$route.query.statusSearch
      ? parseInt(this.$route.query.statusSearch)
      : null;
    this.getDocumentJobByEm();
  },
  methods: {
    itemRowBackground(item) {
      const endDate = new Date(item.TimeEnd);

      endDate.setHours(0, 0, 0, 0);

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (endDate.getTime() < today.getTime()) {
        return "wilExpired365";
      }

      return "";
    },
    btPushToDocinfo(data) {
      console.log("Anhthanhf", data);

      this.$router.push("/cong-viec-dinh-ky/" + data.RowID);
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }

      if (status == 1 || status == 2) {
        return { text: "Đang làm", color: "info" };
      }
      if (status == 3) {
        return { text: "Đã báo cáo", color: "blue" };
      }
      if (status == 4) {
        return { text: "Hoàn thành", color: "green" };
      }
    },
    getDocumentJobByEm() {
      this.loadding = true;

      // const searchParams = {
      //   proName: this.proName,
      //   workName: this.workName,
      //   product: this.product,
      //   name2: this.name2,
      //   country: this.country,
      //   employeeName: this.employeeName,
      //   statusSearch: this.statusSearch,
      //   workOver: this.workOver,
      // };

      // this.$router.push({
      //   path: this.$route.path,
      //   query: searchParams, // Chuyển đổi searchParams thành đối tượng
      // });

      GetRecurringTaskLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Status: 1,
        Search: "",
        // (this.proName ?? "") +
        // "|" +
        // (this.workName ?? "") +
        // "|" +
        // (this.product ?? "") +
        // "|" +
        // (this.name2 ?? "") +
        // "|" +
        // (this.country ?? "") +
        // "|" +
        // (this.employeeName ?? "") +
        // "|" +
        // (this.statusSearch ?? "") +
        // "|" +
        // (this.workOver ?? "") +
        // "|QT00024",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.jobLst = res.Data.map((item, index) => {
            var dateStart = new Date(item.TimeStart);
            var num = (this.pageNumber - 1) * this.rowspPage;
            dateStart.setDate(dateStart.getDate() + item.QuotaTime ?? 0);

            return {
              ...item,
              Key: index + 1 + num,
              StartDate: formatDateDisplayDDMMYY(item.StartDate),
              TimeQuotaAssign: formatDateDisplayDDMMYY(item.TimeQuotaAssign),
            };
          });
          this.totalLength = res.TotalRows;
          this.loadding = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.file-lst {
  display: inline-block;
  .file {
    display: inline-block;
    border: 1px solid #aeaeae;
    padding: 8px;
    margin-right: 8px;
    border-radius: 8px;
    min-width: 200px !important;
    max-width: 250px !important;
    white-space: normal;
    position: relative;
    cursor: pointer;
    &:hover {
      background: #f0f0f0;
    }
    .trash {
      position: absolute;
      top: 12px;
      right: 12px;
      color: #f56c6c;
    }
    .file-name {
      font-weight: 600;
      margin-right: 24px;
    }
    .des {
      font-size: 14px;
      color: #93969b;
      margin: 8px 0;
    }
  }
}
.frame-item {
  border: 1px dashed #93969b;
  border-radius: 12px;
  margin-bottom: 8px;
  padding: 4px 8px;
}
.progress {
  margin-top: -20px;
  overflow-y: auto;
  height: calc(100vh - 160px);
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

<style>
.wilExpired365 {
  color: red;
}
</style>

<template>
  <div v-if="groupInfo" class="position-relative">
    <div class="d-flex align-center justify-center pt-4">
      <VAvatar :key="updateAvatar" size="80" color="grey-100" class="border-sm">
        <VImg v-if="groupInfo.Avatar" alt="John" :src="groupInfo.Avatar" />
        <VImg v-else>
          <VIcon color="blue" class="my-6"> mdi-account-multiple </VIcon>
        </VImg>
      </VAvatar>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      accept="image/*"
      @change="handleFileUpload"
    />

    <div class="text-center font-weight-bold text-h6">
      {{ groupInfo.GroupName ? groupInfo.GroupName : groupInfo.DocumentID }}
    </div>
    <div v-if="groupInfo.TimeCreate" class="text-center text-subtitle-2">
      Hoạt động {{ groupInfo.TimeShow }} trước
    </div>
    <div v-else class="text-center text-subtitle-2">
      Hãy bắt đầu cuộc trò chuyện
    </div>
    <VList v-model:opened="isMenu1">
      <VListGroup
        v-for="(item, index) in menuLst"
        :key="index"
        :value="item.value"
      >
        <template #activator="{ props }">
          <VListItem v-bind="props" :title="item.text" rounded="fill" />
        </template>

        <VListItem
          v-for="(line, inline) in item.option"
          :key="inline"
          :value="line.text"
          :prepend-icon="
            line.action === 'mute'
              ? Number(groupInfo?.IsMute) === 1
                ? 'mdi-bell-outline'
                : 'mdi-bell-off-outline'
              : line.icon
          "
          :title="
            line.action === 'mute'
              ? Number(groupInfo?.IsMute) === 1
                ? 'Bật thông báo'
                : 'Tắt thông báo'
              : line.text
          "
          style="padding: 0 16px !important"
          @click="openMembersDialog(line)"
        >
          <template #prepend>
            <VIcon
              size="small"
              :icon="
                line.action === 'mute'
                  ? Number(groupInfo?.IsMute) === 1
                    ? 'mdi-bell-outline'
                    : 'mdi-bell-off-outline'
                  : line.icon
              "
            />
          </template>
        </VListItem>
      </VListGroup>
    </VList>
  </div>

  <VDialog v-model="membersDialog" max-width="400px">
    <VCard>
      <VCardTitle>
        <div class="d-flex mt-2">
          <span class="headline">Danh sách thành viên</span>
          <VSpacer />
          <VBtn
            v-if="!isEditing && canManageMembers"
            icon
            size="x-small"
            @click="openAddMemberDialog"
          >
            <VIcon>mdi-plus</VIcon>
          </VBtn>
        </div>
      </VCardTitle>
      <VCardText style="padding: 4px">
        <VList>
          <VListItem v-for="member in members" :key="member.id">
            <template #prepend>
              <VAvatar color="grey-100">
                <VImg v-if="member.Avatar" :src="member.Avatar" />
                <VIcon v-else color="blue" size="small">
                  mdi-account-supervisor
                </VIcon>
              </VAvatar>
            </template>
            <VListItemTitle v-if="!isEditing">
              {{ member.FullName }}
            </VListItemTitle>
            <VListItemTitle v-else>
              {{ member.NickName ? member.NickName : member.FullName }}
            </VListItemTitle>
            <VListItemSubtitle>{{ member.UserID }}</VListItemSubtitle>
            <template #append>
              <VBtn
                v-if="!isEditing && canManageMembers"
                icon
                size="small"
                variant="text"
                color="red"
                @click="removeMember(member)"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
              <VBtn
                v-else
                icon
                size="small"
                variant="text"
                color="orange"
                @click="editMember(member)"
              >
                <VIcon>mdi-pencil</VIcon>
              </VBtn>
            </template>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn text @click="closeMembersDialog"> Đóng </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="addEditDialog" max-width="400px">
    <VCard>
      <VCardTitle>
        <span class="headline">{{
          isEditing ? "Chỉnh sửa biệt danh" : "Thêm thành viên"
        }}</span>
      </VCardTitle>
      <VCardText v-if="!isEditing">
        <VTextField v-model="newMember.UserID" label="Số điện thoại" />
      </VCardText>
      <VCardText v-else>
        <VTextField
          v-if="false"
          v-model="newMember.FullName"
          label="Họ & tên"
          class="mb-2"
        />
        <VTextField v-model="newMember.NickName" label="Biệt danh" />
      </VCardText>
      <VCardActions>
        <VBtn text @click="addEditDialog = false"> Đóng </VBtn>
        <VBtn text @click="saveMember"> Lưu </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="renameGroupDialog" max-width="400px">
    <VCard>
      <VCardTitle>
        <span class="headline">Đổi tên nhóm</span>
      </VCardTitle>
      <VCardText>
        <VTextField v-model="newGroupName" label="Tên nhóm" />
      </VCardText>
      <VCardActions>
        <VBtn color="grey" text @click="renameGroupDialog = false"> Đóng </VBtn>
        <VBtn color="green" text @click="renameGroup"> Lưu </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="pinnedDialog" max-width="420px">
    <VCard>
      <VCardTitle>
        <span class="headline">Tin nhắn đã ghim</span>
      </VCardTitle>
      <VCardText style="padding: 4px">
        <VList>
          <VListItem
            v-for="pin in pinnedMessages"
            :key="pin.MessageID"
            style="cursor: pointer"
            @click="jumpPinned(pin)"
          >
            <template #prepend>
              <VIcon size="small">mdi-pin</VIcon>
            </template>
            <template #title>
              {{ pinnedPreview(pin) }}
            </template>
            <template #subtitle> #{{ pin.MessageID }} </template>
          </VListItem>
          <div
            v-if="pinnedMessages.length === 0"
            class="text-center text-grey-darken-1 py-4"
          >
            Chưa có tin nhắn ghim
          </div>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn text @click="pinnedDialog = false">Đóng</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="documentsDialog" max-width="520px">
    <VCard>
      <VCardTitle>
        <span class="headline">{{ documentsTitle }}</span>
      </VCardTitle>
      <VCardText class="docs-dialog-body" @scroll.passive="onDocumentsScroll">
        <VList>
          <VListItem
            v-for="item in documentsRows"
            :key="`${item.MessageID}_${item.LinkUrl || ''}`"
            class="docs-item"
            @click="openDocumentItem(item)"
          >
            <template #prepend>
              <VAvatar size="40" rounded="lg" color="grey-lighten-4">
                <VImg v-if="documentsType === 1" :src="item.LinkFile" cover />
                <VIcon v-else-if="documentsType === 2">
                  mdi-file-document-outline
                </VIcon>
                <VIcon v-else> mdi-link-variant </VIcon>
              </VAvatar>
            </template>
            <template #title>
              {{
                documentsType === 0
                  ? item.LinkUrl
                  : item.MineFile || `Tin nhắn #${item.MessageID}`
              }}
            </template>
            <template #subtitle>
              #{{ item.MessageID }} · {{ formatDocTime(item.TimeCreate) }}
            </template>
            <template #append>
              <VIcon size="small">mdi-open-in-new</VIcon>
            </template>
          </VListItem>
        </VList>

        <div v-if="documentsLoading" class="text-center py-3 text-grey">
          Đang tải...
        </div>
        <div
          v-else-if="documentsRows.length === 0"
          class="text-center py-4 text-grey-darken-1"
        >
          Chưa có dữ liệu
        </div>
        <div
          v-else-if="documentsAllLoaded"
          class="text-center py-2 text-grey-darken-1"
        >
          Đã tải hết
        </div>
      </VCardText>
      <VCardActions>
        <VBtn text @click="documentsDialog = false">Đóng</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="confirmDialog" max-width="420px">
    <VCard>
      <VCardTitle class="d-flex align-center">
        <span class="headline">{{ confirmTitle }}</span>
        <VSpacer />
        <VBtn icon size="x-small" variant="text" @click="onConfirmCancel">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>
      <VCardText>
        {{ confirmText }}
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="onConfirmCancel">
          {{ confirmCancelText }}
        </VBtn>
        <VBtn color="red" :loading="confirmLoading" @click="onConfirmOk">
          {{ confirmOkText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <ChatAddMembersDialog
    v-model="addMembersDialog"
    v-model:search="addMembersSearch"
    :users="addMembersUsers"
    :selected-users="addMembersSelected"
    :loading="addMembersLoading"
    :saving="addMembersSaving"
    :disabled-usernames="existingMemberIDs()"
    @scroll="onAddMembersScroll"
    @search-change="onAddMembersSearchChange"
    @toggle-user="toggleAddMemberUser"
    @remove-user="removeAddMemberUser"
    @add="submitAddMembers"
  />
</template>

<script>
import {
  AddMemberGroup,
  DeleteGroup,
  DelMemberGroup,
  GetFileLstGroupID,
  GetMemberLstByGroupID,
  GetPinnedMessages,
  LeaveGroup,
  SetMuteGroup,
  UpdateGroup,
} from "@/api/messageApi";
import { GetUserLstAll } from "@/api/user";
import { getUserName } from "@/utils/auth";
import { notify } from "@kyvg/vue3-notification";
import ChatAddMembersDialog from "./ChatAddMembersDialog.vue";

export default {
  components: { ChatAddMembersDialog },
  props: {
    groupInfo: Object,
  },
  data() {
    return {
      isMenu1: "",
      membersDialog: false,
      members: [],
      confirmDialog: false,
      confirmTitle: "",
      confirmText: "",
      confirmOkText: "Xác nhận",
      confirmCancelText: "Hủy",
      confirmLoading: false,
      confirmResolve: null,
      addMembersDialog: false,
      addMembersSearch: "",
      addMembersUsers: [],
      addMembersSelected: [],
      addMembersPage: 1,
      addMembersLoading: false,
      addMembersAllLoaded: false,
      addMembersTimeout: null,
      addMembersSaving: false,
      menuLst: [
        {
          value: "Info",
          text: "Thông tin về đoạn chat",
          option: [
            {
              text: "Danh sách thành viên",
              icon: "mdi-account-group",
              action: "members",
            },
            {
              text: "Xem tin nhắn đã ghim",
              icon: "mdi-pin",
              action: "pinned",
            },
            {
              text: "Rời nhóm",
              icon: "mdi-logout",
              action: "leave",
            },
            {
              text: "Xóa nhóm chat",
              icon: "mdi-trash-can-outline",
              action: "delete",
            },
            {
              text: "Tắt thông báo",
              icon: "mdi-bell-off-outline",
              action: "mute",
            },
          ],
        },
        {
          value: "Custom",
          text: "Tùy chỉnh đoạn chat",
          option: [
            {
              text: "Đổi ảnh đoạn chat",
              icon: "mdi-image",
              action: "avatar",
            },
            {
              text: "Đổi tên nhóm",
              icon: "mdi-square-edit-outline",
              action: "rename",
            },

            //  {
            //   text: "Thay đổi chủ đề",
            //   icon: "mdi-circle-slice-8",
            // },
            {
              text: "Chỉnh sửa biệt danh",
              icon: "mdi-alpha-a-circle",
              action: "nickname",
            },
          ],
        },
        {
          value: "File",
          text: "Hình ảnh, File & Link",
          option: [
            {
              text: "Hình ảnh",
              icon: "mdi-image",
              action: "docs:image",
            },
            {
              text: "Thư mục & Tệp",
              icon: "mdi-file-document",
              action: "docs:file",
            },
            {
              text: "Link",
              icon: "mdi-link",
              action: "docs:link",
            },
          ],
        },
        // {
        //   value: "Support",
        //   text: "Quyền riêng tư và hỗ trợ",

        //   option: [
        //     {
        //       text: "Bật, tắt thông báo",
        //       icon: "mdi-bell",
        //     },
        //     {
        //       text: "Gửi hỗ trợ",
        //       icon: "mdi-face-agent",
        //     },
        //   ],
        // },
      ],
      addEditDialog: false,
      isEditing: false,
      newMember: {},
      updateAvatar: 0,
      renameGroupDialog: false,
      newGroupName: "",
      pinnedDialog: false,
      pinnedMessages: [],
      documentsDialog: false,
      documentsTitle: "",
      documentsType: 1, // 0=link,1=image,2=file
      documentsRows: [],
      documentsPage: 1,
      documentsLoading: false,
      documentsAllLoaded: false,
    };
  },
  created() {
    this.newGroupName = this.groupInfo ? this.groupInfo.GroupName : "";
  },
  computed: {
    currentUserID() {
      return String(getUserName() || "").trim();
    },
    canManageMembers() {
      const roleFromGroup = String(
        this.groupInfo?.Role || this.groupInfo?.MyRole || "",
      ).toUpperCase();
      if (
        roleFromGroup === "OWNER" ||
        roleFromGroup === "ADMIN" ||
        roleFromGroup === "MEMBER"
      )
        return true;

      const me = this.currentUserID;
      if (!me) return false;
      const row = (this.members || []).find(
        (m) => String(m?.UserID || m?.UserName || "").trim() === me,
      );
      const role = String(row?.Role || "").toUpperCase();
      return role === "OWNER" || role === "ADMIN" || role === "MEMBER";
    },
  },
  methods: {
    requestConfirm({ title, text, okText, cancelText }) {
      return new Promise((resolve) => {
        this.confirmTitle = title || "Xác nhận";
        this.confirmText = text || "";
        this.confirmOkText = okText || "Xác nhận";
        this.confirmCancelText = cancelText || "Hủy";
        this.confirmResolve = resolve;
        this.confirmDialog = true;
      });
    },
    onConfirmCancel() {
      this.confirmDialog = false;
      const resolve = this.confirmResolve;
      this.confirmResolve = null;
      if (typeof resolve === "function") resolve(false);
    },
    onConfirmOk() {
      this.confirmDialog = false;
      const resolve = this.confirmResolve;
      this.confirmResolve = null;
      if (typeof resolve === "function") resolve(true);
    },
    closeMembersDialog() {
      this.membersDialog = false;
      this.isEditing = false;
      this.addEditDialog = false;
      this.newMember = {};
    },
    openAddMemberDialog() {
      if (!this.canManageMembers) {
        notify({
          type: "error",
          title: "Không có quyền",
          text: "Chỉ chủ nhóm hoặc quản trị viên mới được thêm thành viên.",
        });
        return;
      }
      this.addMembersDialog = true;
      this.addMembersSearch = "";
      this.addMembersUsers = [];
      this.addMembersSelected = [];
      this.addMembersPage = 1;
      this.addMembersAllLoaded = false;
      this.fetchAddMembersUsers(true);
    },
    existingMemberIDs() {
      return (this.members || [])
        .map((m) => String(m?.UserID || "").trim())
        .filter(Boolean);
    },
    fetchAddMembersUsers(isNewSearch = false) {
      if (this.addMembersLoading) return;
      if (isNewSearch) {
        this.addMembersPage = 1;
        this.addMembersAllLoaded = false;
      }
      if (this.addMembersAllLoaded && !isNewSearch) return;

      this.addMembersLoading = true;
      GetUserLstAll({
        PageNumber: this.addMembersPage,
        RowspPage: 10,
        Search: this.addMembersSearch || "",
      })
        .then((res) => {
          if (res?.RespCode === 0) {
            const rows = Array.isArray(res.Data) ? res.Data : [];
            if (isNewSearch) this.addMembersUsers = rows;
            else
              this.addMembersUsers = [...(this.addMembersUsers || []), ...rows];
            if (rows.length < 10) this.addMembersAllLoaded = true;
            else this.addMembersPage += 1;
          }
        })
        .finally(() => {
          this.addMembersLoading = false;
        });
    },
    onAddMembersScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        this.fetchAddMembersUsers(false);
      }
    },
    onAddMembersSearchChange() {
      clearTimeout(this.addMembersTimeout);
      this.addMembersTimeout = setTimeout(() => {
        this.fetchAddMembersUsers(true);
      }, 400);
    },
    toggleAddMemberUser(user) {
      const u = user || {};
      const id = String(u.UserName || "").trim();
      if (!id) return;
      const exists = (this.addMembersSelected || []).some(
        (x) => x.UserName === id,
      );
      if (exists) {
        this.addMembersSelected = (this.addMembersSelected || []).filter(
          (x) => x.UserName !== id,
        );
      } else {
        this.addMembersSelected = [...(this.addMembersSelected || []), u];
      }
    },
    removeAddMemberUser(user) {
      const id = String(user?.UserName || "").trim();
      this.addMembersSelected = (this.addMembersSelected || []).filter(
        (x) => x.UserName !== id,
      );
    },
    async submitAddMembers() {
      if (!this.canManageMembers) {
        notify({
          type: "error",
          title: "Không có quyền",
          text: "Chỉ chủ nhóm hoặc quản trị viên mới được thêm thành viên.",
        });
        return;
      }
      if (!this.groupInfo?.GroupID) return;
      const gid = this.groupInfo.GroupID;
      const existing = new Set(this.existingMemberIDs());
      const targets = (this.addMembersSelected || [])
        .map((u) => String(u?.UserName || "").trim())
        .filter(Boolean)
        .filter((id) => !existing.has(id))
        .slice(0, 50);

      if (targets.length === 0) {
        this.addMembersDialog = false;
        return;
      }

      this.addMembersSaving = true;
      try {
        for (const id of targets) {
          // add one-by-one (backend API hiện tại 1 user / request)
          // eslint-disable-next-line no-await-in-loop
          await AddMemberGroup({ UserID: id, GroupID: gid, NickName: null });
        }
        this.addMembersDialog = false;
        this.getMemberLstByGroupID();
        notify({ type: "success", title: "Đã thêm thành viên" });
      } catch (e) {
        notify({
          type: "error",
          title: "Lỗi",
          text: e?.message || "Thêm thành viên thất bại",
        });
      } finally {
        this.addMembersSaving = false;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        notify({
          type: "error",
          title: "Lỗi",
          text: "File không phải hình ảnh",
        });

        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.src = reader.result;

        img.onload = async () => {
          // 🔹 Giới hạn kích thước (avatar không cần to)
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;

          let { width, height } = img;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

            width = width * scale;
            height = height * scale;
          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, width, height);

          // 🔹 NÉN ẢNH (0.6–0.7 là rất ổn cho avatar)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

          // 🔹 Gán avatar đã nén
          this.groupInfo.Avatar = compressedBase64;

          // 🔹 Call API
          const res = await UpdateGroup({ Data: { ...this.groupInfo } });

          if (res.RespCode === 0) {
            notify({
              type: "success",
              title: "Thành công",
              text: "Ảnh đã được nén và cập nhật",
            });
          } else {
            notify({
              type: "error",
              title: "Lỗi",
              text: res.RespText || res.error,
            });
          }

          this.renameGroupDialog = false;
        };
      };

      reader.readAsDataURL(file);
    },

    getMemberLstByGroupID() {
      GetMemberLstByGroupID({
        GroupID: this.groupInfo.GroupID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.members = res.Data.map((item) => {
            return {
              ...item,
              Avatar: item.LinkImage
                ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
                  item.UserID
                : null,
            };
          });
          this.$emit("members-updated", this.members);
        }
      });
    },
    formatDocTime(input) {
      if (!input) return "";
      const d = new Date(input);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleString("vi-VN");
    },
    openDocumentsDialog(type) {
      if (!this.groupInfo?.GroupID) return;
      this.documentsType = Number(type);
      this.documentsTitle =
        this.documentsType === 1
          ? "Hình ảnh"
          : this.documentsType === 2
            ? "Thư mục & Tệp"
            : "Link";
      this.documentsDialog = true;
      this.fetchDocuments(true);
    },
    async fetchDocuments(reset = false) {
      if (this.documentsLoading) return;
      if (!this.groupInfo?.GroupID) return;
      if (reset) {
        this.documentsPage = 1;
        this.documentsRows = [];
        this.documentsAllLoaded = false;
      }
      if (this.documentsAllLoaded) return;

      this.documentsLoading = true;
      try {
        const res = await GetFileLstGroupID({
          GroupID: this.groupInfo.GroupID,
          IsAttachment: this.documentsType,
          PageNumber: this.documentsPage,
          RowsPerPage: 10,
        });

        if (res?.RespCode === 0) {
          const data = res.Data || {};
          const rows = Array.isArray(data.Rows) ? data.Rows : [];
          const uniq = new Map();
          [...(this.documentsRows || []), ...rows].forEach((row) => {
            const key = `${row.MessageID}_${row.LinkUrl || ""}`;
            if (!uniq.has(key)) uniq.set(key, row);
          });
          this.documentsRows = [...uniq.values()];

          const hasMore =
            typeof data.HasMore === "boolean"
              ? data.HasMore
              : rows.length === 10;
          if (hasMore) this.documentsPage += 1;
          else this.documentsAllLoaded = true;
        }
      } catch (_) {
        // ignore
      } finally {
        this.documentsLoading = false;
      }
    },
    onDocumentsScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 12) {
        this.fetchDocuments(false);
      }
    },
    openDocumentItem(item) {
      const url = (item?.LinkFile || item?.LinkUrl || "").toString().trim();
      if (!url) return;
      window.open(url, "_blank");
    },
    openMembersDialog(line) {
      if (line?.action === "members") {
        this.isEditing = false;
        this.membersDialog = true;
        this.getMemberLstByGroupID();
        return;
      }
      if (line?.action === "pinned") {
        this.openPinnedDialog();
        return;
      }
      if (line?.action === "mute") {
        this.toggleMute();
        return;
      }
      if (line?.action === "leave") {
        this.leaveGroup();
        return;
      }
      if (line?.action === "delete") {
        this.deleteGroup();
        return;
      }
      if (line?.action === "avatar") {
        this.$refs.fileInput.click();
        return;
      }
      if (line?.action === "rename") {
        this.renameGroupDialog = true;
        this.newGroupName = this.groupInfo.GroupName;
        return;
      }
      if (line?.action === "nickname") {
        this.isEditing = true;
        this.membersDialog = true;
        this.getMemberLstByGroupID();
        return;
      }
      if (line?.action === "docs:image") {
        this.openDocumentsDialog(1);
        return;
      }
      if (line?.action === "docs:file") {
        this.openDocumentsDialog(2);
        return;
      }
      if (line?.action === "docs:link") {
        this.openDocumentsDialog(0);
        return;
      }
      if (line.text == "Danh sách thành viên") {
        this.isEditing = false;
        this.membersDialog = true;
        this.getMemberLstByGroupID();
      }
      if (line.text == "Xem tin nhắn đã ghim") {
        this.openPinnedDialog();
      }
      if (line.text == "Rời nhóm") {
        this.leaveGroup();
      }
      if (line.text == "Xóa nhóm chat") {
        this.deleteGroup();
      }
      if (line.text == "Đổi ảnh đoạn chat") {
        this.$refs.fileInput.click();
      }
      if (line.text == "Đổi tên nhóm") {
        this.renameGroupDialog = true;
        this.newGroupName = this.groupInfo.GroupName;
      }
      if (line.text == "Chỉnh sửa biệt danh") {
        this.isEditing = true;
        this.membersDialog = true;
        this.getMemberLstByGroupID();
      }
    },
    async toggleMute() {
      if (!this.groupInfo?.GroupID) return;
      const next = Number(this.groupInfo?.IsMute) === 1 ? 0 : 1;
      try {
        const res = await SetMuteGroup({
          GroupID: this.groupInfo.GroupID,
          IsMute: next,
        });
        if (res?.RespCode === 0 && res?.Data) {
          this.groupInfo.IsMute = res.Data.IsMute;
          this.$emit("group-mute", {
            GroupID: res.Data.GroupID,
            IsMute: res.Data.IsMute,
          });
          notify({
            type: "success",
            title:
              res.Data.IsMute === 1 ? "Đã tắt thông báo" : "Đã bật thông báo",
          });
        }
      } catch (_) {
        // ignore
      }
    },
    async openPinnedDialog() {
      if (!this.groupInfo?.GroupID) return;
      this.pinnedDialog = true;
      try {
        const res = await GetPinnedMessages({
          GroupID: this.groupInfo.GroupID,
        });
        if (res?.RespCode === 0) {
          this.pinnedMessages = Array.isArray(res.Data) ? res.Data : [];
        }
      } catch (_) {
        this.pinnedMessages = [];
      }
    },
    pinnedPreview(pin) {
      const attach = Number(pin?.IsAttachment || 0);
      if (attach === 1) return "[Hình ảnh]";
      if (attach > 1) return `[Tệp] ${pin?.MineFile || ""}`.trim();

      const text = (pin?.TextContent || "").toString();
      // cố gắng parse rich json
      try {
        const obj = JSON.parse(text);
        if (obj && obj.v === 1 && typeof obj.text === "string") return obj.text;
      } catch (_) {}

      return text.length > 80 ? `${text.slice(0, 77)}...` : text;
    },
    jumpPinned(pin) {
      const id = pin?.MessageID;
      this.pinnedDialog = false;
      this.$emit("jump-message", { MessageID: id });
    },
    async leaveGroup() {
      if (!this.groupInfo?.GroupID) return;
      const ok = await this.requestConfirm({
        title: "Rời khỏi nhóm",
        text: "Bạn muốn rời khỏi nhóm chat này?",
        okText: "Rời nhóm",
        cancelText: "Hủy",
      });
      if (!ok) return;

      const res = await LeaveGroup({ GroupID: this.groupInfo.GroupID });
      if (res?.RespCode === 0) {
        notify({ type: "success", title: "Đã rời nhóm" });
        this.$emit("group-left", { GroupID: this.groupInfo.GroupID });
      }
    },
    async deleteGroup() {
      if (!this.groupInfo?.GroupID) return;
      const ok = await this.requestConfirm({
        title: "Xóa đoạn chat",
        text: "Xóa nhóm chat? (Chỉ chủ nhóm được phép)",
        okText: "Xóa",
        cancelText: "Hủy",
      });
      if (!ok) return;

      const res = await DeleteGroup({ GroupID: this.groupInfo.GroupID });
      if (res?.RespCode === 0) {
        notify({ type: "success", title: "Đã xóa nhóm" });
        this.$emit("group-deleted", { GroupID: this.groupInfo.GroupID });
      }
    },
    editMember(member) {
      this.addEditDialog = true;
      this.isEditing = true;
      this.newMember = member;
    },
    removeMember(data) {
      DelMemberGroup({
        UserID: data.UserID,
        GroupID: this.groupInfo.GroupID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getMemberLstByGroupID();
          notify({
            type: "success",
            title: "Thành công",
            text: "",
          });
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.error,
          });
        }
        this.addEditDialog = false;
      });
    },
    saveMember() {
      AddMemberGroup({
        UserID: this.newMember.UserID,
        GroupID: this.groupInfo.GroupID,
        NickName: this.newMember.NickName,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.getMemberLstByGroupID();
          const targetName =
            this.newMember?.FullName || this.newMember?.UserID || "người dùng";
          const nick = (this.newMember?.NickName || "").toString().trim();
          notify({
            type: "success",
            title: "Đã cập nhật biệt danh",
            text: nick
              ? `Bạn đã đặt biệt danh cho ${targetName} là "${nick}"`
              : `Bạn đã xóa biệt danh của ${targetName}`,
          });
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.error,
          });
        }
        this.addEditDialog = false;
      });
    },
    renameGroup() {
      this.groupInfo.GroupName = this.newGroupName;
      UpdateGroup({ Data: { ...this.groupInfo } }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
          });
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.error,
          });
        }
        this.renameGroupDialog = false;
      });
    },
  },
};
</script>

<style scoped>
.docs-dialog-body {
  max-height: 420px;
  overflow-y: auto;
  padding: 4px !important;
}

.docs-item {
  cursor: pointer;
}
</style>

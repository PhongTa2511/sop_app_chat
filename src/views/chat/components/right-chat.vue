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
            <VListItemSubtitle class="d-flex align-center ga-2">
              <span>{{ member.UserID }}</span>
              <VChip
                size="x-small"
                :color="roleColor(member.Role)"
                variant="tonal"
              >
                {{ roleLabel(member.Role) }}
              </VChip>
            </VListItemSubtitle>
            <template #append>
              <template v-if="!isEditing">
                <VMenu v-if="canManageMembers || canManageRoles">
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="grey"
                    >
                      <VIcon>mdi-dots-vertical</VIcon>
                    </VBtn>
                  </template>
                  <VList density="compact" min-width="190">
                    <VListItem
                      v-if="canManageMembers && !isCurrentUser(member)"
                      prepend-icon="mdi-delete"
                      title="Xóa khỏi nhóm"
                      @click="removeMember(member)"
                    />

                    <VListSubheader v-if="canManageRoles"
                      >Đổi quyền</VListSubheader
                    >
                    <VListItem
                      v-if="canSetRole(member, 'MEMBER')"
                      prepend-icon="mdi-account"
                      title="Thành viên"
                      :disabled="isRoleSaving(member)"
                      @click="changeMemberRole(member, 'MEMBER')"
                    />
                    <VListItem
                      v-if="canSetRole(member, 'ADMIN')"
                      prepend-icon="mdi-shield-account"
                      title="Quản trị viên"
                      :disabled="isRoleSaving(member)"
                      @click="changeMemberRole(member, 'ADMIN')"
                    />
                    <VListItem
                      v-if="canSetRole(member, 'OWNER')"
                      prepend-icon="mdi-crown"
                      title="Chuyển chủ nhóm"
                      :disabled="isRoleSaving(member)"
                      @click="changeMemberRole(member, 'OWNER')"
                    />
                  </VList>
                </VMenu>
              </template>
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

  <VDialog v-model="documentsDialog" fullscreen>
    <VCard class="rounded-0">
      <VToolbar density="comfortable" flat color="blue" dark class="safe-area-top">
        <VToolbarTitle class="text-white">{{ documentsTitle }}</VToolbarTitle>
        <VSpacer />
        <VBtn icon="mdi-close" variant="text" color="white" @click="documentsDialog = false" />
      </VToolbar>
      <VCardText class="docs-dialog-body" @scroll.passive="onDocumentsScroll">
        <template v-if="documentsType === 1 || documentsType === 2">
          <div class="docs-grid">
            <button
              v-for="item in documentsRows"
              :key="`${item.MessageID}_${item.LinkUrl || ''}`"
              type="button"
              class="docs-square"
              @click="openDocumentItem(item)"
            >
              <div v-if="documentsType === 1" class="docs-square-image-wrap">
                <VImg :src="item.LinkFile" cover class="docs-square-image" />
              </div>
              <div v-else class="docs-square-file-wrap">
                <VIcon size="30" color="blue">mdi-file-document-outline</VIcon>
                <div class="docs-square-file-name">
                  {{ item.MineFile || `Tệp #${item.MessageID}` }}
                </div>
              </div>
              <div class="docs-square-meta">
                {{ formatDocTime(item.TimeCreate) }}
              </div>
            </button>
          </div>
        </template>
        <template v-else>
          <VList>
            <VListItem
              v-for="item in documentsRows"
              :key="`${item.MessageID}_${item.LinkUrl || ''}`"
              class="docs-item"
              @click="openDocumentItem(item)"
            >
              <template #prepend>
                <VAvatar size="40" rounded="lg" color="grey-lighten-4">
                  <VIcon>mdi-link-variant</VIcon>
                </VAvatar>
              </template>
              <template #title>
                {{ item.LinkUrl }}
              </template>
              <template #subtitle>
                #{{ item.MessageID }} · {{ formatDocTime(item.TimeCreate) }}
              </template>
              <template #append>
                <VIcon size="small">mdi-open-in-new</VIcon>
              </template>
            </VListItem>
          </VList>
        </template>

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

  <ChatImageDialog
    v-model="imagePreviewDialog"
    :src="imagePreviewUrl"
  />

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
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  AddMemberGroup,
  DeleteGroup,
  DelMemberGroup,
  GetFileLstGroupID,
  GetMemberLstByGroupID,
  GetPinnedMessages,
  LeaveGroup,
  SetMemberRole,
  SetMuteGroup,
  UpdateGroup,
} from "@/api/messageApi";
import { GetUserLstAll } from "@/api/user";
import { getUserName } from "@/utils/auth";
import { notify } from "@kyvg/vue3-notification";
import ChatAddMembersDialog from "./ChatAddMembersDialog.vue";
import ChatImageDialog from "./ChatImageDialog.vue";

const MAX_GROUP_MEMBERS = 50;

export default {
  components: { ChatAddMembersDialog, ChatImageDialog },
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
      imagePreviewDialog: false,
      imagePreviewUrl: "",
      imagePreviewName: "",
      roleSavingUserID: "",
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
      if (roleFromGroup === "OWNER" || roleFromGroup === "ADMIN") return true;

      const me = this.currentUserID;
      if (!me) return false;
      const row = (this.members || []).find(
        (m) => String(m?.UserID || m?.UserName || "").trim() === me,
      );
      const role = String(row?.Role || "").toUpperCase();
      return role === "OWNER" || role === "ADMIN";
    },
    myRole() {
      const roleFromGroup = String(
        this.groupInfo?.Role || this.groupInfo?.MyRole || "",
      ).toUpperCase();
      if (roleFromGroup) return roleFromGroup;

      const me = this.currentUserID;
      if (!me) return "";
      const row = (this.members || []).find(
        (m) => String(m?.UserID || m?.UserName || "").trim() === me,
      );
      return String(row?.Role || "").toUpperCase();
    },
    canManageRoles() {
      return this.myRole === "OWNER" || this.myRole === "ADMIN";
    },
    canTransferOwner() {
      return this.myRole === "OWNER";
    },
  },
  methods: {
    normalizeRole(role) {
      const normalized = String(role || "")
        .trim()
        .toUpperCase();
      if (normalized === "OWNER" || normalized === "ADMIN") return normalized;
      return "MEMBER";
    },
    roleLabel(role) {
      const normalized = this.normalizeRole(role);
      if (normalized === "OWNER") return "Chủ nhóm";
      if (normalized === "ADMIN") return "Quản trị viên";
      return "Thành viên";
    },
    roleColor(role) {
      const normalized = this.normalizeRole(role);
      if (normalized === "OWNER") return "deep-purple";
      if (normalized === "ADMIN") return "indigo";
      return "grey";
    },
    isCurrentUser(member) {
      return (
        String(member?.UserID || member?.UserName || "").trim() ===
        this.currentUserID
      );
    },
    canSetRole(member, targetRole) {
      if (!this.canManageRoles) return false;
      const nextRole = this.normalizeRole(targetRole);
      const memberRole = this.normalizeRole(member?.Role);
      const isSelf = this.isCurrentUser(member);

      if (this.myRole === "OWNER") {
        if (nextRole === "OWNER") return !isSelf && memberRole !== "OWNER";
        return memberRole !== nextRole;
      }

      if (this.myRole === "ADMIN") {
        if (isSelf) return false;
        if (memberRole === "OWNER") return false;
        if (nextRole === "OWNER") return false;
        return memberRole !== nextRole;
      }

      return false;
    },
    isRoleSaving(member) {
      const uid = String(member?.UserID || "").trim();
      return Boolean(uid && uid === this.roleSavingUserID);
    },
    async changeMemberRole(member, targetRole) {
      if (!this.groupInfo?.GroupID) return;
      if (!this.canSetRole(member, targetRole)) return;

      const userID = String(member?.UserID || "").trim();
      if (!userID) return;

      const nextRole = this.normalizeRole(targetRole);
      this.roleSavingUserID = userID;
      try {
        const res = await SetMemberRole({
          GroupID: this.groupInfo.GroupID,
          TargetUserID: userID,
          Role: nextRole,
        });

        if (res?.RespCode === 0) {
          await this.getMemberLstByGroupID();
          notify({
            type: "success",
            title:
              nextRole === "OWNER"
                ? "Đã chuyển chủ nhóm"
                : "Đã cập nhật quyền thành viên",
          });
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res?.RespText || res?.error || "Không thể cập nhật quyền",
          });
        }
      } catch (error) {
        notify({
          type: "error",
          title: "Lỗi",
          text: error?.message || "Không thể cập nhật quyền",
        });
      } finally {
        this.roleSavingUserID = "";
      }
    },
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
      const remainingSlots = Math.max(0, MAX_GROUP_MEMBERS - existing.size);
      if (remainingSlots <= 0) {
        notify({
          type: "error",
          title: "Nhóm đã đầy",
          text: `Nhóm chat tối đa ${MAX_GROUP_MEMBERS} thành viên`,
        });
        return;
      }

      const targets = (this.addMembersSelected || [])
        .map((u) => String(u?.UserName || "").trim())
        .filter(Boolean)
        .filter((id) => !existing.has(id))
        .slice(0, remainingSlots);

      if (targets.length === 0) {
        this.addMembersDialog = false;
        return;
      }

      if ((this.addMembersSelected || []).length > targets.length) {
        notify({
          type: "warning",
          title: "Vượt giới hạn",
          text: `Chỉ còn thêm được ${remainingSlots} thành viên`,
        });
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
      return GetMemberLstByGroupID({
        GroupID: this.groupInfo.GroupID,
      }).then((res) => {
        if (res.RespCode == 0) {
          const roleWeight = { OWNER: 0, ADMIN: 1, MEMBER: 2 };
          this.members = (res.Data || [])
            .map((item) => {
              return {
                ...item,
                Role: this.normalizeRole(item?.Role),
                Avatar: item.LinkImage
                  ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
                    item.UserID
                  : null,
              };
            })
            .sort((a, b) => {
              const wa = roleWeight[this.normalizeRole(a?.Role)] ?? 99;
              const wb = roleWeight[this.normalizeRole(b?.Role)] ?? 99;
              if (wa !== wb) return wa - wb;
              return String(a?.FullName || a?.UserID || "").localeCompare(
                String(b?.FullName || b?.UserID || ""),
                "vi",
              );
            });
          this.$emit("members-updated", this.members);
        }
      });
    },
    formatDocTime(input) {
      if (!input) return "";
      const d = new Date(input);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
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
      if (this.documentsType === 1) {
        this.imagePreviewUrl = url;
        this.imagePreviewName =
          item?.MineFile || `Ảnh #${item?.MessageID || ""}`;
        this.imagePreviewDialog = true;
        return;
      }

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
  height: calc(100vh - 64px - env(safe-area-inset-top, 0px));
  overflow-y: auto;
  padding: 0 !important;
  background: #f8f9fa;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  background: #fff;
}

.docs-square {
  border: none;
  border-radius: 0;
  overflow: hidden;
  background: #eee;
  padding: 0;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  position: relative;
}

.docs-square-image-wrap,
.docs-square-file-wrap {
  width: 100%;
  height: 100%;
}

.docs-square-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.docs-square-file-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #fff;
}

.docs-square-file-name {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.docs-square-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  font-size: 10px;
  color: #fff;
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-fullscreen-card {
  background: #000;
}

.preview-fullscreen-stage {
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: #000;
}

.preview-fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

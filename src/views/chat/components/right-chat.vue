<template>
  <div
    v-if="groupInfo"
    class="position-relative"
  >
    <div class="d-flex align-center justify-center pt-4">
      <VAvatar
        :key="updateAvatar"
        size="80"
        color="grey-100"
        class="border-sm"
      >
        <VImg
          v-if="groupInfo.Avatar"
          alt="John"
          :src="groupInfo.Avatar"
        />
        <VImg v-else>
          <VIcon
            color="blue"
            class="my-6"
          >
            mdi-account-multiple
          </VIcon>
        </VImg>
      </VAvatar>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      accept="image/*"
      @change="handleFileUpload"
    >

    <div class="text-center font-weight-bold text-h6">
      {{ groupInfo.GroupName ? groupInfo.GroupName : groupInfo.DocumentID }}
    </div>
    <div
      v-if="groupInfo.TimeCreate"
      class="text-center text-subtitle-2"
    >
      Hoạt động {{ groupInfo.TimeShow }} trước
    </div>
    <div
      v-else
      class="text-center text-subtitle-2"
    >
      Hãy bắt đầu cuộc trò chuyện
    </div>
    <VList v-model:opened="isMenu1">
      <VListGroup
        v-for="(item, index) in menuLst"
        :key="index"
        :value="item.value"
      >
        <template #activator="{ props }">
          <VListItem
            v-bind="props"
            :title="item.text"
            rounded="fill"
          />
        </template>

        <VListItem
          v-for="(line, inline) in item.option"
          :key="inline"
          :value="line.text"
          :prepend-icon="line.icon"
          :title="line.text"
          style="padding: 0 16px !important"
          @click="openMembersDialog(line)"
        >
          <template #prepend>
            <VIcon
              size="small"
              :icon="line.icon"
            />
          </template>
        </VListItem>
      </VListGroup>
    </VList>
  </div>

  <VDialog
    v-model="membersDialog"
    max-width="400px"
  >
    <VCard>
      <VCardTitle>
        <div class="d-flex mt-2">
          <span class="headline">Danh sách thành viên</span>
          <VSpacer />
          <VBtn
            v-if="!isEditing"
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
          <VListItem
            v-for="member in members"
            :key="member.id"
          >
            <template #prepend>
              <VAvatar color="grey-100">
                <VImg
                  v-if="member.Avatar"
                  :src="member.Avatar"
                />
                <VIcon
                  v-else
                  color="blue"
                  size="small"
                >
                  mdi-account-supervisor
                </VIcon>
              </VAvatar>
            </template>
            <VListItemTitle v-if="!isEditing">
              {{
                member.FullName
              }}
            </VListItemTitle>
            <VListItemTitle v-else>
              {{
                member.NickName ? member.NickName : member.FullName
              }}
            </VListItemTitle>
            <VListItemSubtitle>{{ member.UserID }}</VListItemSubtitle>
            <template #append>
              <VBtn
                v-if="!isEditing"
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
        <VBtn
          text
          @click="closeMembersDialog"
        >
          Đóng
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog
    v-model="addEditDialog"
    max-width="400px"
  >
    <VCard>
      <VCardTitle>
        <span class="headline">{{
          isEditing ? "Chỉnh sửa biệt danh" : "Thêm thành viên"
        }}</span>
      </VCardTitle>
      <VCardText v-if="!isEditing">
        <VTextField
          v-model="newMember.UserID"
          label="Số điện thoại"
        />
      </VCardText>
      <VCardText v-else>
        <VTextField
          v-model="newMember.FullName"
          label="Họ & tên"
          class="mb-2"
        />
        <VTextField
          v-model="newMember.NickName"
          label="Biệt danh"
        />
      </VCardText>
      <VCardActions>
        <VBtn
          text
          @click="addEditDialog = false"
        >
          Đóng
        </VBtn>
        <VBtn
          text
          @click="saveMember"
        >
          Lưu
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog
    v-model="renameGroupDialog"
    max-width="400px"
  >
    <VCard>
      <VCardTitle>
        <span class="headline">Đổi tên nhóm</span>
      </VCardTitle>
      <VCardText>
        <VTextField
          v-model="newGroupName"
          label="Tên nhóm"
        />
      </VCardText>
      <VCardActions>
        <VBtn
          color="grey"
          text
          @click="renameGroupDialog = false"
        >
          Đóng
        </VBtn>
        <VBtn
          color="green"
          text
          @click="renameGroup"
        >
          Lưu
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog
    v-model="pinnedDialog"
    max-width="420px"
  >
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
            <template #subtitle>
              #{{ pin.MessageID }}
            </template>
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
</template>

<script>
import {
  AddMemberGroup,
  DeleteGroup,
  DelMemberGroup,
  GetPinnedMessages,
  GetMemberLstByGroupID,
  LeaveGroup,
  UpdateGroup,
} from "@/api/messageApi"
import { notify } from "@kyvg/vue3-notification"

export default {
  props: {
    groupInfo: Object,
  },
  data() {
    return {
      isMenu1: "",
      membersDialog: false,
      members: [],
      menuLst: [
        {
          value: "Info",
          text: "Thông tin về đoạn chat",
          option: [
            {
              text: "Danh sách thành viên",
              icon: "mdi-account-group",
            },
            {
              text: "Xem tin nhắn đã ghim",
              icon: "mdi-pin",
            },
            {
              text: "Rời nhóm",
              icon: "mdi-logout",
            },
            {
              text: "Xóa nhóm chat",
              icon: "mdi-trash-can-outline",
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
            },
            {
              text: "Đổi tên nhóm",
              icon: "mdi-square-edit-outline",
            },

            //  {
            //   text: "Thay đổi chủ đề",
            //   icon: "mdi-circle-slice-8",
            // },
            {
              text: "Chỉnh sửa biệt danh",
              icon: "mdi-alpha-a-circle",
            },
          ],
        },

        // {
        //   value: "File",
        //   text: "Hình ảnh, File & Link",

        //   option: [
        //     {
        //       text: "Hình ảnh",
        //       icon: "mdi-image",
        //     },
        //     {
        //       text: "Thư mục & Tệp",
        //       icon: "mdi-file-document",
        //     },
        //     {
        //       text: "Link",
        //       icon: "mdi-link",
        //     },
        //   ],
        // },
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
    }
  },
  created() {
    this.newGroupName = this.groupInfo ? this.groupInfo.GroupName : ""
  },
  methods: {
    closeMembersDialog() {
      this.membersDialog = false
      this.isEditing = false
      this.addEditDialog = false
      this.newMember = {}
    },
    handleFileUpload(event) {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        notify({
          type: "error",
          title: "Lỗi",
          text: "File không phải hình ảnh",
        })
        
        return
      }

      const reader = new FileReader()

      reader.onload = () => {
        const img = new Image()

        img.src = reader.result

        img.onload = async () => {
          // 🔹 Giới hạn kích thước (avatar không cần to)
          const MAX_WIDTH = 300
          const MAX_HEIGHT = 300

          let { width, height } = img

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)

            width = width * scale
            height = height * scale
          }

          const canvas = document.createElement("canvas")

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")

          ctx.drawImage(img, 0, 0, width, height)

          // 🔹 NÉN ẢNH (0.6–0.7 là rất ổn cho avatar)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6)

          // 🔹 Gán avatar đã nén
          this.groupInfo.Avatar = compressedBase64

          // 🔹 Call API
          const res = await UpdateGroup({ Data: { ...this.groupInfo } })

          if (res.RespCode === 0) {
            notify({
              type: "success",
              title: "Thành công",
              text: "Ảnh đã được nén và cập nhật",
            })
          } else {
            notify({
              type: "error",
              title: "Lỗi",
              text: res.RespText || res.error,
            })
          }

          this.renameGroupDialog = false
        }
      }

      reader.readAsDataURL(file)
    },

    getMemberLstByGroupID() {
      GetMemberLstByGroupID({
        GroupID: this.groupInfo.GroupID,
      }).then(res => {
        if (res.RespCode == 0) {
          this.members = res.Data.map(item => {
            return {
              ...item,
              Avatar: item.LinkImage
                ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
                  item.UserID
                : null,
            }
          })
        }
      })
    },
    openMembersDialog(line) {
      if (line.text == "Danh sách thành viên") {
        this.isEditing = false
        this.membersDialog = true
        this.getMemberLstByGroupID()
      }
      if (line.text == "Xem tin nhắn đã ghim") {
        this.openPinnedDialog()
      }
      if (line.text == "Rời nhóm") {
        this.leaveGroup()
      }
      if (line.text == "Xóa nhóm chat") {
        this.deleteGroup()
      }
      if (line.text == "Đổi ảnh đoạn chat") {
        this.$refs.fileInput.click()
      }
      if (line.text == "Đổi tên nhóm") {
        this.renameGroupDialog = true
        this.newGroupName = this.groupInfo.GroupName
      }
      if (line.text == "Chỉnh sửa biệt danh") {
        this.isEditing = true
        this.membersDialog = true
        this.getMemberLstByGroupID()
      }
    },
    async openPinnedDialog() {
      if (!this.groupInfo?.GroupID) return
      this.pinnedDialog = true
      try {
        const res = await GetPinnedMessages({ GroupID: this.groupInfo.GroupID })
        if (res?.RespCode === 0) {
          this.pinnedMessages = Array.isArray(res.Data) ? res.Data : []
        }
      } catch (_) {
        this.pinnedMessages = []
      }
    },
    pinnedPreview(pin) {
      const attach = Number(pin?.IsAttachment || 0)
      if (attach === 1) return "[Hình ảnh]"
      if (attach > 1) return `[Tệp] ${pin?.MineFile || ""}`.trim()

      const text = (pin?.TextContent || "").toString()
      // cố gắng parse rich json
      try {
        const obj = JSON.parse(text)
        if (obj && obj.v === 1 && typeof obj.text === "string") return obj.text
      } catch (_) {}

      return text.length > 80 ? `${text.slice(0, 77)}...` : text
    },
    jumpPinned(pin) {
      const id = pin?.MessageID
      this.pinnedDialog = false
      this.$emit("jump-message", { MessageID: id })
    },
    async leaveGroup() {
      if (!this.groupInfo?.GroupID) return
      const ok = window.confirm("Bạn muốn rời khỏi nhóm chat này?")
      if (!ok) return

      const res = await LeaveGroup({ GroupID: this.groupInfo.GroupID })
      if (res?.RespCode === 0) {
        notify({ type: "success", title: "Đã rời nhóm" })
        this.$emit("group-left", { GroupID: this.groupInfo.GroupID })
      }
    },
    async deleteGroup() {
      if (!this.groupInfo?.GroupID) return
      const ok = window.confirm("Xóa nhóm chat? (Chỉ chủ nhóm được phép)")
      if (!ok) return

      const res = await DeleteGroup({ GroupID: this.groupInfo.GroupID })
      if (res?.RespCode === 0) {
        notify({ type: "success", title: "Đã xóa nhóm" })
        this.$emit("group-deleted", { GroupID: this.groupInfo.GroupID })
      }
    },
    openAddMemberDialog() {
      this.addEditDialog = true
      this.isEditing = false
    },
    editMember(member) {
      this.addEditDialog = true
      this.isEditing = true
      this.newMember = member
    },
    removeMember(data) {
      DelMemberGroup({
        UserID: data.UserID,
        GroupID: this.groupInfo.GroupID,
      }).then(res => {
        if (res.RespCode == 0) {
          this.getMemberLstByGroupID()
          notify({
            type: "success",
            title: "Thành công",
            text: "",
          })
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.error,
          })
        }
        this.addEditDialog = false
      })
    },
    saveMember() {
      AddMemberGroup({
        UserID: this.newMember.UserID,
        GroupID: this.groupInfo.GroupID,
        NickName: this.newMember.NickName,
      }).then(res => {
        if (res.RespCode == 0) {
          this.getMemberLstByGroupID()
          notify({
            type: "success",
            title: "Thành công",
          })
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.error,
          })
        }
        this.addEditDialog = false
      })
    },
    renameGroup() {
      this.groupInfo.GroupName = this.newGroupName
      UpdateGroup({ Data: { ...this.groupInfo } }).then(res => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
          })
        } else {
          notify({
            type: "error",
            title: "Lỗi",
            text: res.error,
          })
        }
        this.renameGroupDialog = false
      })
    },
  },
}
</script>

<style></style>

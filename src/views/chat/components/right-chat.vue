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
          @click="membersDialog = false"
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
</template>

<script>
import {
  AddMemberGroup,
  DelMemberGroup,
  GetMemberLstByGroupID,
  UpdateGroup,
} from "@/api/messageApi"

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
    }
  },
  created() {
    this.newGroupName = this.groupInfo ? this.groupInfo.GroupName : ""
  },
  methods: {
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
        this.membersDialog = true
        this.getMemberLstByGroupID()
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
        GroupID: data.GroupID,
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

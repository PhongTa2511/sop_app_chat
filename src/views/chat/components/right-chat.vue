<template>
  <div v-if="groupInfo" class="position-relative">
    <div class="d-flex align-center justify-center pt-4">
      <v-avatar
        size="80"
        color="grey-100"
        class="border-sm"
        :key="updateAvatar"
      >
        <v-img alt="John" :src="groupInfo.LinkImage" v-if="groupInfo.Avatar">
        </v-img>
        <v-img v-else>
          <v-icon color="blue" class="my-6"> mdi-account-multiple </v-icon>
        </v-img>
      </v-avatar>
    </div>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="handleFileUpload"
    />
    <!-- <v-menu transition="scale-transition" color="blue">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-dots-grid"
          size="small"
          color="grey-800"
          variant="text"
          class="position-absolute top-0 right-0"
          v-bind="props"
        ></v-btn>
      </template>

      <v-list>
        <v-list-item link @click="$refs.fileInput.click()">
          <template v-slot:prepend>
            <v-icon size="small" icon="mdi-image"></v-icon>
          </template>
          <v-list-item-title>Ảnh đại diện</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <template v-slot:prepend>
            <v-icon size="small" icon="mdi-square-edit-outline"></v-icon>
          </template>
          <v-list-item-title>Đổi tên nhóm</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
    <div class="text-center font-weight-bold text-h6">
      {{ groupInfo.GroupName ? groupInfo.GroupName : groupInfo.DocumentID }}
    </div>
    <div class="text-center text-subtitle-2" v-if="groupInfo.TimeCreate">
      Hoạt động {{ groupInfo.TimeShow }} trước
    </div>
    <div v-else class="text-center text-subtitle-2">
      Hãy bắt đầu cuộc trò chuyện
    </div>
    <v-list v-model:opened="isMenu1">
      <v-list-group
        :value="item.value"
        v-for="(item, index) in menuLst"
        :key="index"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="item.text"
            rounded="fill"
          ></v-list-item>
        </template>

        <v-list-item
          v-for="(line, inline) in item.option"
          :key="inline"
          :value="line.text"
          :prepend-icon="line.icon"
          :title="line.text"
          style="padding: 0 16px !important"
          @click="openMembersDialog(line)"
        >
          <template v-slot:prepend>
            <v-icon size="small" :icon="line.icon"></v-icon>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>

  <v-dialog v-model="membersDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <div class="d-flex mt-2">
          <span class="headline">Danh sách thành viên</span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!isEditing"
            icon
            @click="openAddMemberDialog"
            size="x-small"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text style="padding: 4px">
        <v-list>
          <v-list-item v-for="member in members" :key="member.id">
            <template v-slot:prepend>
              <v-avatar color="grey-100">
                <v-img v-if="member.Avatar" :src="member.Avatar"></v-img>
                <v-icon v-else color="blue" size="small"
                  >mdi-account-supervisor</v-icon
                >
              </v-avatar>
            </template>
            <v-list-item-title v-if="!isEditing">{{
              member.FullName
            }}</v-list-item-title>
            <v-list-item-title v-else>{{
              member.NickName ? member.NickName : member.FullName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ member.UserID }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn
                v-if="!isEditing"
                icon
                @click="removeMember(member)"
                size="small"
                variant="text"
                color="red"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                @click="editMember(member)"
                size="small"
                variant="text"
                color="orange"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="membersDialog = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addEditDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          isEditing ? "Chỉnh sửa biệt danh" : "Thêm thành viên"
        }}</span>
      </v-card-title>
      <v-card-text v-if="!isEditing">
        <v-text-field
          v-model="newMember.UserID"
          label="Số điện thoại"
        ></v-text-field>
      </v-card-text>
      <v-card-text v-else>
        <v-text-field
          v-model="newMember.FullName"
          label="Họ & tên"
          class="mb-2"
        ></v-text-field>
        <v-text-field
          v-model="newMember.NickName"
          label="Biệt danh"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="addEditDialog = false">Đóng</v-btn>
        <v-btn text @click="saveMember">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="renameGroupDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Đổi tên nhóm</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="newGroupName" label="Tên nhóm"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" text @click="renameGroupDialog = false">Đóng</v-btn>
        <v-btn color="green" text @click="renameGroup">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  AddMemberGroup,
  DelMemberGroup,
  GetMemberLstByGroupID,
  UpdateGroup,
  urlUploadImageGroup,
} from "@/api/messageApi";
import Axios from "axios";
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
    };
  },
  methods: {
    handleFileUpload(file) {
      const { files } = file.target;
      if (files && files.length) {
        const params = new FormData();
        params.append("file", files[0]);

        Axios.post(urlUploadImageGroup(this.groupInfo.GroupID), params).then(
          (res) => {
            if (res.data.RespCode == 0) {
              notify({
                type: "success",
                title: "Thành công",
                text: "Cập nhật ảnh đại diện thành công",
              });
              this.groupInfo.LinkImage =
                "https://sop.idtp.work/api/File/GetAvatarGroup?GroupID=" +
                this.groupInfo.GroupID +
                "&timestamp=" +
                new Date().getTime();
              this.updateAvatar++;
            } else {
              notify({
                title: "Lỗi",
                text: res.data.RespText,
                type: "error",
              });
            }
          }
        );
      }
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
        }
      });
    },
    openMembersDialog(line) {
      if (line.text == "Danh sách thành viên") {
        this.membersDialog = true;
        this.getMemberLstByGroupID();
      }
      if (line.text == "Đổi ảnh đoạn chat") {
        this.$refs.fileInput.click();
      }
      if (line.text == "Đổi tên nhóm") {
        this.renameGroupDialog = true;
      }
      if (line.text == "Chỉnh sửa biệt danh") {
        this.isEditing = true;
        this.membersDialog = true;
        this.getMemberLstByGroupID();
      }
    },
    openAddMemberDialog() {
      this.addEditDialog = true;
      this.isEditing = false;
    },
    editMember(member) {
      this.addEditDialog = true;
      this.isEditing = true;
      this.newMember = member;
    },
    removeMember(data) {
      DelMemberGroup({
        UserID: data.UserID,
        GroupID: data.GroupID,
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
  created() {
    this.newGroupName = this.groupInfo ? this.groupInfo.GroupName : "";
  },
};
</script>

<style></style>

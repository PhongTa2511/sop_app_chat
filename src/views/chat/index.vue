<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.rar"
      @change="handleFileUpload"
      style="display: none"
    />
    <v-card>
      <v-layout>
        <v-navigation-drawer v-model="drawerLeft" :width="300" class="py-4">
          <v-text-field
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Tìm kiếm"
            hide-details
            single-line
            class="mx-4 my-0"
            v-model="searchGroup"
          ></v-text-field>
          <v-list>
            <v-list-item
              v-for="folder in groupLst"
              :key="folder.GroupID"
              :subtitle="folder.TextContent"
              :title="folder.GroupName ? folder.GroupName : folder.DocumentID"
              :value="folder"
              color="blue"
              variant="text"
              class="py-4"
              @click="selectGroup(folder)"
              :active="folder.GroupID == groupInfo.GroupID"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="
                    folder.GroupID == groupInfo.GroupID ? 'blue' : 'secondary'
                  "
                >
                  <v-img v-if="folder.Avatar" :src="folder.LinkImage"></v-img>
                  <v-icon v-else>mdi-account-supervisor</v-icon>
                </v-avatar>
              </template>
              <template v-slot:subtitle>
                {{ folder.TextContent ?? "Hãy bắt đầu cuộc trò chuyện" }}
              </template>
              <template v-slot:append v-if="folder.TimeCreate">
                <div class="text-subtitle-2">{{ folder.TimeShow }}</div>
              </template>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar>
          <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawerLeft = !drawerLeft"
            color="blue"
          ></v-app-bar-nav-icon>

          <v-toolbar-title v-if="groupInfo" class="font-weight-bold">{{
            groupInfo.GroupName ? groupInfo.GroupName : groupInfo.DocumentID
          }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <template v-if="$vuetify.display.mdAndUp">
            <v-tooltip text="Gọi video">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-camera"
                  variant="text"
                  color="blue"
                  @click="isCalling = true"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Tìm kiếm tin nhắn">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-magnify"
                  variant="text"
                  color="blue"
                  @click="openSearchDialog"
                ></v-btn>
              </template>
            </v-tooltip>

            <!-- <v-btn icon="mdi-filter" variant="text" color="blue"></v-btn> -->
          </template>

          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            color="blue"
            @click.stop="drawerRight = !drawerRight"
          ></v-btn>
        </v-app-bar>

        <v-main style="height: calc(100vh - 116px)" class="position-relative">
          <v-list
            ref="chatList"
            class="custome-content"
            v-if="messageLst.length > 0"
            @scroll="handleScroll"
          >
            <div v-if="loadingMore" class="loading-indicator">
              <v-progress-circular
                indeterminate
                color="blue"
              ></v-progress-circular>
            </div>
            <v-list-item
              v-for="(mes, index) in messageLst"
              :key="mes.MessageID"
              style="padding: 0 4px 0 8px; margin-top: 4px"
            >
              <template v-slot:prepend v-if="!mes.IsMine">
                <v-avatar size="small" v-if="mes.isLatest" color="secondary">
                  <v-img v-if="mes.LinkImage" :src="mes.Avatar"></v-img>
                  <v-icon v-else size="x-small">mdi-account</v-icon>
                </v-avatar>
                <v-avatar size="small" v-else></v-avatar>
              </template>

              <template v-slot:append v-else>
                <v-avatar size="small" color="blue" v-if="mes.isLatest">
                  <v-img v-if="mes.LinkImage" :src="mes.Avatar"></v-img>
                  <v-icon v-else size="x-small">mdi-account</v-icon>
                </v-avatar>
                <v-avatar size="small" v-else></v-avatar>
              </template>

              <div
                v-if="
                  !mes.IsMine && index > 0
                    ? messageLst[index - 1].SenderID != mes.SenderID
                    : false
                "
                class="custom-layout-name"
              >
                {{ mes.NickName ? mes.NickName : mes.LastName }}
              </div>
              <div
                v-if="mes.IsAttachment == 0"
                :class="{
                  'float-right  is-mine': mes.IsMine,
                }"
                class="custom-layout-text"
              >
                <div
                  :style="{ whiteSpace: 'pre-line' }"
                  v-html="mes.TextContent"
                ></div>
              </div>
              <div
                v-else-if="mes.IsAttachment == 1"
                :class="{
                  'float-right text-right': mes.IsMine,
                }"
              >
                <v-img
                  :width="200"
                  aspect-ratio="1/1"
                  cover
                  :src="mes.LinkFile"
                  class="text-center custom-layout-text"
                  @click="btShowImage(mes)"
                >
                  <template v-slot:error>
                    <v-icon color="red" class="text-center mt-3" size="large">
                      mdi-file-image-remove</v-icon
                    >
                    <div class="text-subtitle-2 mt-1">Hình ảnh bị lỗi</div>
                  </template>
                </v-img>
              </div>
              <div
                v-else-if="mes.IsAttachment == 2"
                :class="{
                  'float-right ': mes.IsMine,
                }"
                class="custom-layout-text"
              >
                <div class="d-flex">
                  <v-btn
                    icon
                    rounded="fill"
                    color="grey-800"
                    size="small"
                    @click="btDownloadFile(mes)"
                  >
                    <v-icon> mdi-file-document-outline </v-icon>
                  </v-btn>
                  <div class="pl-2">
                    <div class="text-subtitle-2">
                      {{ mes.TextContent }}
                    </div>
                    <div>
                      {{ mes.SizeFileText }}
                    </div>
                  </div>
                </div>
              </div>
            </v-list-item>
          </v-list>
          <div v-else class="text-center" style="margin-top: 30%">
            <div>
              <v-icon color="blue" size="40">mdi-forum</v-icon>
              <div>Hãy bắt đầu cuộc trò chuyện</div>
            </div>
          </div>
          <div
            class="d-flex align-center px-1 position-absolute bottom-0 mb-2"
            :style="{
              left: drawerLeft ? '300px' : '0',
              right: drawerRight ? '300px' : '0',
            }"
            style="
              background: rgb(var(--v-theme-background-overlay-multiplier));
            "
          >
            <v-btn
              icon="mdi-link-variant"
              rounded="pill"
              color="blue"
              variant="text"
              @click="$refs.fileInput.click()"
            >
            </v-btn>
            <v-menu
              v-model="showEmojiPicker"
              :close-on-content-click="false"
              location="top center"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-emoticon-outline"
                  variant="text"
                  rounded="pill"
                  color="blue"
                  v-bind="props"
                >
                </v-btn>
              </template>

              <v-card class="px-2 py-2" elevation="24" max-width="300">
                <div class="emoji-picker">
                  <span
                    v-for="emoji in emojis"
                    :key="emoji"
                    @click="addEmoji(emoji)"
                    style="cursor: pointer; padding: 5px; font-size: 24px"
                  >
                    {{ emoji }}
                  </span>
                </div>
              </v-card>
            </v-menu>

            <v-textarea
              placeholder="Aa"
              v-model="newMessage"
              class="customText"
              @keydown="handleKeyPress"
              auto-grow
              color="blue"
              max-rows="6"
              rows="1"
              rounded="xl"
            ></v-textarea>
            <v-btn
              icon="mdi-send"
              rounded="pill"
              color="blue"
              variant="text"
              @click="sendMessageHandler"
            >
            </v-btn>
          </div>
        </v-main>
        <v-navigation-drawer
          v-model="drawerRight"
          :width="300"
          class="py-4"
          location="right"
        >
          <RightChat :groupInfo="groupInfo" />
        </v-navigation-drawer>
      </v-layout>
    </v-card>
    <v-dialog v-model="showImageDialog" max-width="600px">
      <v-img :src="selectedImage" aspect-ratio="1"></v-img>
    </v-dialog>
    <v-dialog v-model="showSearchDialog" max-width="600px">
      <v-card>
        <v-card-title>Tìm kiếm tin nhắn</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchQuery"
            label="Nhập từ khóa"
            @keyup.enter="searchMessages"
          ></v-text-field>
          <v-list>
            <v-list-item
              v-for="message in searchResults"
              :key="message.MessageID"
            >
              <template v-slot:prepend>
                <v-avatar size="small" color="secondary">
                  <v-img v-if="message.LinkImage" :src="message.Avatar"></v-img>
                  <v-icon v-else size="x-small">mdi-account</v-icon>
                </v-avatar>
              </template>

              <template v-slot:title>
                {{ message.TextContent }}
              </template>
              <template v-slot:subtitle>
                {{ message.FullName }} - {{ message.TimeShow }}
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showSearchDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <VideoCall
    v-if="isCalling"
    :targetUserId="friendId"
    :currentUserId="currentUserId"
    @closeCall="btCloseCall"
  />
</template>

<script>
// import { sendMessage, onMessage, onMessage2 } from "@/socket";
import {
  GetGroupLstByUserID,
  GetMessageByGoupID,
  SendMessageChat,
  urlUploadMessageFile,
} from "@/api/messageApi";
import { formatDateDisplay } from "@/helpers/getTime";
import socket from "@/socket";
import { getUserName } from "@/utils/auth";
import { notify } from "@kyvg/vue3-notification";
import Axios from "axios";
import RightChat from "./components/right-chat.vue";
import VideoCall from "./components/VideoCall.vue";

export default {
  name: "app",
  components: {
    RightChat,
    VideoCall,
  },
  data() {
    return {
      currentUserId: "0397613784",
      friendId: "0342764514",
      isCalling: false,
      drawerLeft: true,
      drawerRight: true,
      groupInfo: null,
      groupLst: [],
      messageLst: [],
      newMessage: "",
      senderID: getUserName(),
      showEmojiPicker: false,
      emojis: [
        "😀",
        "😂",
        "😍",
        "😎",
        "😢",
        "😡",
        "👍",
        "👎",
        "🎉",
        "❤️",
        "🔥",
        "✨",
        "😜",
        "😇",
        "🤔",
        "😱",
        "🤗",
        "😴",
        "💔",
        "😋",
        "😏",
        "😬",
        "😻",
        "🙌",
        "🌟",
        "🌈",
        "🍀",
        "🎈",
        "🎶",
        "💖",
      ],
      showImageDialog: false,
      selectedImage: "",
      rowspPage: 20,
      currentPage: 1,
      loadingMore: false,
      searchGroup: "",
      showSearchDialog: false,
      searchResults: [],
      searchQuery: "",
    };
  },
  watch: {
    groupInfo() {
      this.getMessageByGoupID();
      socket.emit("joinGroup", this.groupInfo.GroupID);
    },
    searchGroup() {
      this.getGroupLstByUserID();
    },
  },
  methods: {
    btCloseCall() {
      this.isCalling = false;
    },
    btDownloadFile(data) {
      window.open(data.LinkFile, "_blank");
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const sizeFile = file.size;
        const params = new FormData();
        params.append("file", file);

        var req = {
          SenderID: this.senderID,
          GroupID: this.groupInfo.GroupID,
          RecipientID: null,
          IsAttachment: 1,
          IsMine: true,
          SizeFile: sizeFile,
        };
        SendMessageChat({
          Data: req,
        }).then((res) => {
          if (res.RespCode == 0) {
            Axios.post(urlUploadMessageFile(res.Data.MessageID), params).then(
              (resfile) => {
                if (resfile.data.RespCode == 0) {
                  socket.emit("sendMessage", res.Data);
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
        });
      }
    },
    getGroupLstByUserID() {
      GetGroupLstByUserID({
        PageNumber: 1,
        RowspPage: 10,
        Search: this.searchGroup,
        ComID: "",
        UserID: this.senderID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst = res.Data.map((item) => {
            return {
              ...item,
              TimeShow: this.calculateTimeDifference(item.TimeCreate),
              LinkImage:
                "https://sop.idtp.work/api/File/GetAvatarGroup?GroupID=" +
                item.GroupID,
            };
          });
          if (this.groupLst.length > 0) {
            this.groupInfo = this.groupLst[0];
          }
        }
      });
    },
    calculateTimeDifference(time2) {
      const date1 = new Date();
      const date2 = new Date(time2);
      date2.setHours(date2.getHours() - 7);
      const differenceInMinutes = Math.abs((date1 - date2) / (1000 * 60));
      if (differenceInMinutes <= 1) {
        return `Vừa xong`;
      }
      if (differenceInMinutes < 60) {
        return `${parseInt(differenceInMinutes)} phút`;
      }
      const months = Math.floor(differenceInMinutes / (60 * 24 * 30));
      if (months >= 1) {
        return `${months} tháng`;
      }
      const days = Math.floor(differenceInMinutes / (60 * 24));
      if (days >= 1) {
        return `${days} ngày`;
      }

      const hours = Math.floor(differenceInMinutes / 60);
      const minutes = differenceInMinutes % 60;
      return `${hours}h${parseInt(minutes)}p`;
    },
    sendMessageHandler() {
      if (this.newMessage && this.newMessage.trim() != "") {
        var req = {
          SenderID: this.senderID,
          GroupID: this.groupInfo.GroupID,
          RecipientID: null,
          TextContent: this.newMessage.trim(),
          IsAttachment: 0,
          IsMine: true,
        };
        SendMessageChat({
          Data: req,
        }).then((res) => {
          if (res.RespCode == 0) {
            socket.emit("sendMessage", res.Data);
          }
        });
        this.newMessage = "";
      }
    },
    selectGroup(groupInfo) {
      this.groupInfo = groupInfo;
    },
    getMessageByGoupID() {
      GetMessageByGoupID({
        GroupID: this.groupInfo.GroupID,
        PageNumber: 1,
        RowspPage: this.rowspPage,
        Search: "",
        ComID: "",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.messageLst = res.Data.map((item) => {
            const fullName = item.FullName ?? "noname";
            const nameParts = fullName.split(" ");
            const lastName =
              nameParts[nameParts.length - 1] == ""
                ? nameParts[nameParts.length - 2]
                : nameParts[nameParts.length - 1];
            return {
              ...item,
              IsMine: item.SenderID == this.senderID ? true : false,
              Avatar: item.LinkImage
                ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
                  item.SenderID
                : null,
              LastName: lastName,
              LinkFile:
                item.IsAttachment != 0
                  ? "https://sop.idtp.work/api/File/GetMessageFile?MessageID=" +
                    item.MessageID
                  : null,
              SizeFileText:
                item.IsAttachment > 0
                  ? this.formatFileSize(item.SizeFile)
                  : null,
            };
          });
          this.messageLst = this.markLatestMessages(this.messageLst);
          this.scrollBottom();
        }
      });
    },
    formatFileSize(sizeInBytes) {
      if (sizeInBytes < 1024 * 1024) {
        return (sizeInBytes / 1024).toFixed(2) + " KB";
      } else {
        return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
      }
    },
    markLatestMessages(messages) {
      messages.sort((a, b) => new Date(a.TimeCreate) - new Date(b.TimeCreate));
      return messages.map((message, index, arr) => {
        const isLatest =
          index === arr.length - 1 ||
          arr[index + 1].SenderID !== message.SenderID;
        return { ...message, isLatest };
      });
    },
    scrollBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatList) {
          this.$refs.chatList.$el.scrollTop =
            this.$refs.chatList.$el.scrollHeight;
        }
      });
    },
    addEmoji(emoji) {
      this.newMessage += emoji;
    },
    btShowImage(mes) {
      this.selectedImage = mes.LinkFile;
      this.showImageDialog = true;
    },
    handleScroll() {
      const chatList = this.$refs.chatList.$el;
      if (chatList.scrollTop === 0 && !this.loadingMore) {
        this.loadMoreMessages();
      }
    },
    loadMoreMessages() {
      if (this.loadingMore) return; // Prevent multiple loads
      this.loadingMore = true; // Set loading state to true
      GetMessageByGoupID({
        GroupID: this.groupInfo.GroupID,
        PageNumber: this.currentPage + 1, // Increment page number
        RowspPage: this.rowspPage,
        Search: "",
        ComID: "",
      }).then((res) => {
        if (res.RespCode == 0) {
          var dataAll = res.Data.map((item) => {
            const fullName = item.FullName ?? "noname";
            const nameParts = fullName.split(" ");
            const lastName =
              nameParts[nameParts.length - 1] == ""
                ? nameParts[nameParts.length - 2]
                : nameParts[nameParts.length - 1];
            return {
              ...item,
              IsMine: item.SenderID == this.senderID ? true : false,
              Avatar: item.LinkImage
                ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
                  item.SenderID
                : null,
              LastName: lastName,
              LinkFile:
                item.IsAttachment != 0
                  ? "https://sop.idtp.work/api/File/GetMessageFile?MessageID=" +
                    item.MessageID
                  : null,
              SizeFileText:
                item.IsAttachment > 0
                  ? this.formatFileSize(item.SizeFile)
                  : null,
            };
          });
          this.messageLst = [...dataAll, ...this.messageLst]; // Prepend new messages
          this.messageLst = this.markLatestMessages(this.messageLst);
          this.currentPage += 1; // Update current page
        }
        this.loadingMore = false; // Reset loading state
      });
    },
    openSearchDialog() {
      this.showSearchDialog = true;
    },
    searchMessages() {
      GetMessageByGoupID({
        GroupID: this.groupInfo.GroupID,
        PageNumber: 1,
        RowspPage: this.rowspPage,
        Search: this.searchQuery,
        ComID: "",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.searchResults = res.Data.map((item) => {
            return {
              ...item,
              Avatar: item.LinkImage
                ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
                  item.SenderID
                : null,
              TimeShow: formatDateDisplay(item.TimeCreate),
            };
          });
        }
      });
    },
    handleKeyPress(event) {
      if (event.shiftKey && event.key === "Enter") {
        this.newMessage += "\n";
        event.preventDefault();
      } else if (event.key === "Enter") {
        this.sendMessageHandler();
        event.preventDefault();
      }
    },
  },
  created() {
    this.getGroupLstByUserID();
    socket.on("receiveMessage", (message) => {
      const fullName = message.FullName ?? "noname";
      const nameParts = fullName.split(" ");
      const lastName =
        nameParts[nameParts.length - 1] == ""
          ? nameParts[nameParts.length - 2]
          : nameParts[nameParts.length - 1];
      if (
        message.SenderID != this.senderID &&
        message.GroupID == this.groupInfo.GroupID
      ) {
        this.messageLst.push({
          ...message,
          IsMine: false,
          LinkFile:
            message.IsAttachment != 0
              ? "https://sop.idtp.work/api/File/GetMessageFile?MessageID=" +
                message.MessageID
              : null,
          SizeFileText:
            message.IsAttachment > 0
              ? this.formatFileSize(message.SizeFile)
              : null,
          Avatar: message.LinkImage
            ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
              message.SenderID
            : null,
          LastName: lastName,
        });
        this.messageLst = this.markLatestMessages(this.messageLst);
        this.groupInfo.TextContent = message.TextContent;
        this.scrollBottom();
        document.title = "Bạn có tin nhắn mới - " + this.groupInfo.GroupName;
      }
      if (
        message.SenderID == this.senderID &&
        message.GroupID == this.groupInfo.GroupID
      ) {
        this.messageLst.push({
          ...message,
          IsMine: true,
          LinkFile:
            message.IsAttachment != 0
              ? "https://sop.idtp.work/api/File/GetMessageFile?MessageID=" +
                message.MessageID
              : null,
          SizeFileText:
            message.IsAttachment > 0
              ? this.formatFileSize(message.SizeFile)
              : null,
          Avatar: message.LinkImage
            ? "https://sop.idtp.work/api/File/GetAvatarUser?UserName=" +
              message.SenderID
            : null,
          LastName: lastName,
        });
        this.messageLst = this.markLatestMessages(this.messageLst);
        this.groupInfo.TextContent = message.TextContent;
        this.scrollBottom();
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.custom-layout-name {
  font-size: 12px;
  padding-left: 8px;
}
.custom-layout-text {
  display: inline-block;
  padding: 6px 12px;
  max-width: 66%;
  border-radius: 16px;
  background: rgb(var(--v-theme-grey-100));
  font-size: 14px;
}
.is-mine {
  background: rgb(var(--v-theme-blue));
  color: #fff;
}
</style>
<style lang="scss">
.custome-content {
  overflow-y: auto;
  height: calc(100vh - 280px);
  &::-webkit-scrollbar-track-piece {
    margin: 20px;
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
.customText {
  .v-field__input {
    margin-right: 4px;

    &::-webkit-scrollbar-track-piece {
      margin: 20px;
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
}
.text-right {
  text-align: right;
}
.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 10px 0; /* Thêm khoảng cách trên và dưới */
}
</style>

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
          <div
            class="mx-4 text-lg d-flex justify-space-between align-center mb-2"
          >
            <div class="text-lg">Đoạn chat</div>
            <v-btn
              icon="mdi-square-edit-outline"
              size="x-small"
              @click="openCreateGroupDialog"
            ></v-btn>
          </div>
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
                  <v-img v-if="folder.Avatar" :src="folder.Avatar"></v-img>
                  <v-icon v-else>mdi-account-supervisor</v-icon>
                </v-avatar>
              </template>
              <template v-slot:title>
                <div class="text-bold" style="font-weight: 700">
                  {{ folder.GroupName ? folder.GroupName : folder.DocumentID }}
                </div>
              </template>
              <template v-slot:subtitle>
                <div class="text-xs text-gray-700">
                  {{
                    folder.NewMessage ??
                    folder.LastMessage ??
                    "Hãy bắt đầu cuộc trò chuyện"
                  }}
                </div>
              </template>
              <template v-slot:append v-if="folder.TimeCreate">
                <v-badge
                  v-if="folder.UnreadCount > 0"
                  location="top right"
                  color="primary"
                  dot
                  :offset-y="-10"
                >
                  <div class="text-xs text-grey-800">
                    {{ folder.TimeShow }}
                  </div>
                </v-badge>
                <div v-else class="text-xs text-grey-800">
                  {{ folder.TimeShow }}
                </div>
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
            <!-- <v-tooltip text="Gọi video">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-camera"
                  variant="text"
                  color="blue"
                  @click="isCalling = true"
                ></v-btn>
              </template>
            </v-tooltip> -->

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
            :class="replyingTo ? 'custome-content-reply' : 'custome-content'"
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
              class="message-item"
              :id="'msg-' + mes.MessageID"
            >
              <template v-slot:prepend v-if="!mes.IsMine">
                <v-avatar size="small" v-if="mes.isLatest" color="secondary">
                  <v-img v-if="mes.Avatar" :src="mes.Avatar"></v-img>
                  <v-icon v-else size="x-small">mdi-account</v-icon>
                </v-avatar>
                <v-avatar size="small" v-else></v-avatar>
              </template>

              <template v-slot:append v-else>
                <v-avatar size="small" color="blue" v-if="mes.isLatest">
                  <v-img v-if="mes.Avatar" :src="mes.Avatar"></v-img>
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
                class="message-row"
                :class="{ 'flex-row-reverse': mes.IsMine }"
              >
                <div class="message-content">
                  <div
                    v-if="mes.ReplyID"
                    class="customer-layout-reply"
                    @click="scrollToMessage(mes.ReplyID)"
                  >
                    {{ mes.ReplyContent }}
                  </div>
                  <div
                    v-if="mes.IsAttachment == 0"
                    :class="{
                      ' is-mine': mes.IsMine,
                    }"
                    class="custom-layout-text"
                  >
                    <div
                      :style="{ whiteSpace: 'pre-line' }"
                      v-html="mes.TextContent"
                    ></div>
                  </div>
                  <div v-else-if="mes.IsAttachment == 1">
                    <v-img
                      :width="200"
                      aspect-ratio="1/1"
                      cover
                      :src="mes.LinkFile"
                      class="text-center custom-layout-text border"
                      @click="btShowImage(mes)"
                    >
                      <template v-slot:error>
                        <v-icon
                          color="red"
                          class="text-center mt-3"
                          size="large"
                        >
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
                </div>
                <div class="message-actions">
                  <v-btn
                    size="small"
                    icon="mdi-share"
                    density="compact"
                    style="border-radius: 50%"
                    :color="mes.IsMine ? 'blue' : 'grey'"
                    @click="setReply(mes)"
                  ></v-btn>

                  <v-btn
                    size="small"
                    icon="mdi-emoticon-happy-outline"
                    density="compact"
                    style="border-radius: 50%"
                    :color="mes.IsMine ? 'blue' : 'grey'"
                  ></v-btn>
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
            class="position-absolute bottom-0 bg-white border-t d-flex flex-column"
            :style="{
              left: drawerLeft ? '300px' : '0',
              right: drawerRight ? '300px' : '0',
            }"
          >
            <v-expand-transition>
              <div
                v-if="replyingTo"
                class="d-flex align-center px-4 py-2 bg-grey-100 border-b w-full"
              >
                <v-icon size="small" color="blue" class="mr-2"
                  >mdi-reply</v-icon
                >
                <div class="flex-grow-1 overflow-hidden">
                  <div class="text-caption font-weight-bold text-blue">
                    Đang trả lời
                    {{ replyingTo.NickName || replyingTo.LastName }}
                  </div>
                  <div class="text-truncate text-body-2 text-grey-darken-1">
                    {{
                      replyingTo.IsAttachment == 1
                        ? "[Hình ảnh]"
                        : replyingTo.TextContent
                    }}
                  </div>
                </div>
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  @click="replyingTo = null"
                ></v-btn>
              </div>
            </v-expand-transition>
            <div
              class="d-flex align-center px-1"
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
                  <v-img v-if="message.Avatar" :src="message.Avatar"></v-img>
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
    <div v-if="showCreateGroupDialog" class="fb-dialog-overlay">
      <div class="fb-dialog">
        <div class="fb-header">
          <h3>Tạo đoạn chat mới</h3>
          <button class="close-btn" @click="showCreateGroupDialog = false">
            &times;
          </button>
        </div>

        <div class="fb-search-container">
          <div class="selected-users-wrapper">
            <span class="to-label">Đến:</span>
            <div
              v-for="user in selectedUsers"
              :key="user.UserName"
              class="fb-chip"
            >
              {{ user.FullName }}
              <span class="remove-chip" @click="removeUser(user)">&times;</span>
            </div>
            <input
              type="text"
              v-model="searchUser"
              @input="onSearchChange"
              placeholder="Tìm kiếm người dùng..."
              ref="searchInput"
              class="w-100 px-4 py-2"
            />
          </div>
        </div>

        <div class="fb-user-list" @scroll="onScroll">
          <div
            v-for="item in desserts"
            :key="item.UserName"
            class="fb-user-item"
            :class="{ selected: isSelected(item) }"
            @click="toggleUser(item)"
          >
            <div class="fb-avatar">
              {{ item.FullName.charAt(0) }}
            </div>
            <div class="fb-user-info">
              <div class="fb-user-name">{{ item.FullName }}</div>
              <div class="fb-user-sub">
                {{ item.Email }}
              </div>
            </div>
            <div class="fb-checkbox">
              <div class="circle" :class="{ checked: isSelected(item) }"></div>
            </div>
          </div>

          <div class="list-footer">
            <div v-if="loading" class="fb-spinner"></div>
            <!-- <span v-else-if="allLoaded">Đã hiển thị tất cả</span> -->
          </div>
        </div>

        <div class="fb-footer">
          <button
            class="fb-btn-primary"
            :disabled="selectedUsers.length === 0"
            @click="createNewChatGroup"
          >
            Tạo nhóm chat
          </button>
        </div>
      </div>
    </div>
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
  CreateGroup,
  GetGroupLstByUserID,
  GetMessageByGoupID,
  ReadMessage,
  SendMessage,
  urlUploadMessageFile,
} from "@/api/messageApi";
import { GetUserLstAll } from "@/api/user";
import { formatDateDisplay } from "@/helpers/getTime";
import socket from "@/socket";
import { getAvatar, getUserName } from "@/utils/auth";
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
      showCreateGroupDialog: false,
      newGroupName: "",
      selectedUsers: [],
      allUsers: [],
      pageSize: 10,
      pageUser: 1,
      searchUser: "",
      desserts: [], // Danh sách hiển thị trong autocomplete
      loading: false, // Trạng thái đang tải
      allLoaded: false, // Đã tải hết sạch dữ liệu chưa
      timeout: null, // Dùng để debounce tìm kiếm
      replyingTo: null,
    };
  },
  watch: {
    groupInfo() {
      this.getMessageByGoupID();
      socket.emit("join:group", {
        GroupID: this.groupInfo.GroupID,
      });
    },
    searchGroup() {
      this.getGroupLstByUserID();
    },
  },
  methods: {
    // Kiểm tra có nên hiện tên người gửi không (giống messenger: gom nhóm tin nhắn)
    showSenderName(mes, index) {
      if (mes.IsMine) return false;
      if (index === 0) return true;
      return this.messageLst[index - 1].SenderID !== mes.SenderID;
    },

    // Khi nhấn nút Reply
    setReply(message) {
      this.replyingTo = message;
      // Tìm đến textarea và focus (giả định bạn dùng ref)
      this.$nextTick(() => {
        const el = document.querySelector(
          ".custom-textarea-messenger textarea",
        );
        if (el) el.focus();
      });
    },

    // Lấy tên của người được reply
    getReplyName(replyToID) {
      const original = this.messageLst.find((m) => m.MessageID === replyToID);
      return original ? original.NickName || original.LastName : "Người dùng";
    },

    // Lấy nội dung xem trước của tin nhắn gốc
    getReplyContent(replyToID) {
      const original = this.messageLst.find((m) => m.MessageID === replyToID);
      if (!original) return "Tin nhắn đã bị xóa";
      if (original.IsAttachment == 1) return "📸 Hình ảnh";
      if (original.IsAttachment == 2) return "📁 Tệp đính kèm";
      return original.TextContent;
    },

    // Cuộn đến tin nhắn gốc khi nhấn vào bong bóng reply
    scrollToMessage(id) {
      const el = document.getElementById(`msg-${id}`); // Bạn nên thêm id="msg-..." vào v-list-item
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    },

    markAsRead(groupId) {
      if (!groupId) return;
      ReadMessage({
        GroupID: groupId,
      })
        .then((res) => {
          if (res.RespCode == 0) {
            const group = this.groupLst.find((g) => g.GroupID === groupId);
            if (group) {
              group.UnreadCount = 0;
            }
            // Tùy chọn: Gửi socket nếu server cần đồng bộ các tab khác
            // socket.emit("read_message", params);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi đọc tin nhắn:", err);
        });
    },
    getUserLst(isNewSearch = false) {
      if (this.loading) return;
      if (isNewSearch) {
        this.pageUser = 1;
        this.allLoaded = false;
      }
      if (this.allLoaded && !isNewSearch) return;
      this.loading = true;
      GetUserLstAll({
        Search: this.searchUser,
        PageNumber: this.pageUser,
        RowspPage: this.pageSize,
      })
        .then((res) => {
          if (res.RespCode == 0) {
            const newData = res.Data || [];
            const mappedData = newData.map((item, index) => {
              const startIndex = this.pageSize * (this.pageUser - 1);
              return {
                ...item,
                Key: index + 1 + startIndex,
              };
            });
            if (isNewSearch) {
              this.desserts = mappedData;
            } else {
              this.desserts = [...this.desserts, ...mappedData];
            }
            if (newData.length < this.pageSize) {
              this.allLoaded = true;
            } else {
              this.pageUser++;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    isSelected(user) {
      return this.selectedUsers.some((u) => u.UserName === user.UserName);
    },
    toggleUser(user) {
      const index = this.selectedUsers.findIndex(
        (u) => u.UserName === user.UserName,
      );
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      } else {
        this.selectedUsers.push(user);
      }
      this.searchUser = ""; // Xóa text tìm kiếm sau khi chọn như FB
    },

    removeUser(user) {
      this.selectedUsers = this.selectedUsers.filter(
        (u) => u.UserName !== user.UserName,
      );
    },

    // Xử lý cuộn để tải thêm
    onScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // Nếu cuộn gần tới đáy (cách đáy 10px)
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!this.loading && !this.allLoaded) {
          this.getUserLst(false);
        }
      }
    },

    onSearchChange() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getUserLst(true);
      }, 500);
    },
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
          Avatar: getAvatar(),
        };
        SendMessage({
          Data: req,
        }).then((res) => {
          if (res.RespCode == 0) {
            Axios.post(urlUploadMessageFile(res.Data.MessageID), params).then(
              (resfile) => {
                if (resfile.data.RespCode == 0) {
                  console.log("123", res.Data);

                  socket.emit("sendMessage", res.Data);
                  this.newMessage = "";
                  this.replyingTo = null;
                } else {
                  notify({
                    title: "Lỗi",
                    text: res.data.RespText,
                    type: "error",
                  });
                }
              },
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
      if (!this.newMessage.trim()) return;

      var req = {
        SenderID: this.senderID,
        GroupID: this.groupInfo.GroupID,
        RecipientID: null,
        TextContent: this.newMessage.trim(),
        IsAttachment: 0,
        IsMine: true,
        ReplyID: this.replyingTo ? this.replyingTo.MessageID : null,
        Avatar: getAvatar(),
      };
      SendMessage({
        Data: req,
      }).then((res) => {
        if (res.RespCode == 0) {
          socket.emit("sendMessage", res.Data);
          this.newMessage = "";
          this.replyingTo = null;
        }
      });
    },
    selectGroup(groupInfo) {
      this.groupInfo = groupInfo;
      this.newMessage = "";
      this.replyingTo = null;
      this.markAsRead(groupInfo.GroupID);
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
              LastName: lastName,
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
              LastName: lastName,
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
    openCreateGroupDialog() {
      this.showCreateGroupDialog = true;
      this.searchUser = ""; // Reset tìm kiếm
      this.getUserLst(true); // Gọi API lấy trang 1 ngay khi mở
    },
    createNewChatGroup() {
      let finalGroupName = this.newGroupName.trim();
      if (!finalGroupName) {
        if (this.selectedUsers.length === 1) {
          finalGroupName = this.selectedUsers[0].FullName;
        } else if (this.selectedUsers.length > 1) {
          finalGroupName = this.selectedUsers
            .map((user) => {
              const nameParts = user.FullName.trim().split(" ");
              return nameParts[nameParts.length - 1]; // Lấy phần tử cuối cùng
            })
            .join(", ");
        }
      }
      if (!finalGroupName) {
        notify({
          title: "Lỗi",
          text: "Vui lòng chọn thành viên",
          type: "error",
        });
        return;
      }
      this.selectedUsers.push({ UserName: getUserName() });

      const newGroup = {
        GroupName: finalGroupName,
        TextContent: "",
        LastMessage: "Hãy bắt đầu cuộc trò chuyện",
        TimeCreate: new Date().toISOString(),
        UnreadCount: 0,
        Avatar: null,
        Members: this.selectedUsers,
      };
      CreateGroup({ Data: newGroup }).then((res) => {
        if (res.RespCode == 0) {
          this.groupLst.unshift(newGroup);
          this.groupInfo = newGroup;
          this.showCreateGroupDialog = false;
          this.newGroupName = "";
          this.selectedUsers = [];
        }
      });
    },
  },
  created() {
    this.getGroupLstByUserID();
    socket.on("new_message", (message) => {
      console.log("chạy vào đây", message);

      if (message.GroupID !== this.groupInfo.GroupID) return;
      this.markAsRead(message.GroupID);
      const fullName = message.FullName ?? "noname";
      const lastName = fullName.split(" ").pop();

      this.messageLst.push({
        ...message,
        IsMine: message.SenderID === this.senderID,
        Avatar: message.Avatar,
        LinkFile: message.LinkFile,
        SizeFileText: message.IsAttachment
          ? this.formatFileSize(message.SizeFile)
          : null,
        LastName: lastName,
      });

      this.messageLst = this.markLatestMessages(this.messageLst);
      this.scrollBottom();
    });

    socket.on("sidebar:update", (data) => {
      const { GroupID, LastMessage, TimeCreate } = data;
      const groupIndex = this.groupLst.findIndex((g) => g.GroupID === GroupID);
      // 1. Tìm index của group này trong mảng danh sách chat hiện tại
      if (groupIndex !== -1) {
        // Lấy đối tượng group ra
        const updatedGroup = this.groupLst[groupIndex];

        // 2. Cập nhật thông tin mới nhất
        updatedGroup.NewMessage = LastMessage;
        updatedGroup.TimeCreate = TimeCreate; // Cập nhật thời gian để sắp xếp
        updatedGroup.TimeShow = this.calculateTimeDifference(TimeCreate);
        // 4. Kiểm tra: Nếu không phải group đang mở thì mới tăng UnreadCount
        // Giả sử 'this.currentGroupID' là ID của group người dùng đang xem
        if (updatedGroup.GroupID !== this.currentGroupID) {
          updatedGroup.UnreadCount = (updatedGroup.UnreadCount || 0) + 1;
        }

        // 3. Đẩy Group này lên đầu danh sách
        // Xóa khỏi vị trí cũ và thêm vào vị trí [0]
        this.groupLst.splice(groupIndex, 1);
        this.groupLst.unshift(updatedGroup);
      } else {
        // TRƯỜNG HỢP NGOẠI LỆ: Nếu group chưa có trong danh sách sidebar hiện tại
        // (Ví dụ: tin nhắn từ một người lạ hoặc nhóm mới tạo)
        // Bạn có thể chọn cách gọi API lấy thông tin Group đó hoặc thêm tạm vào:
        this.groupLst.unshift({
          GroupID: GroupID,
          LastMessage: LastMessage,
          TimeCreate: TimeCreate,
          UnreadCount: 1,
          // ... các trường khác như GroupName, Avatar bạn nên lấy từ API
        });
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.customer-layout-reply {
  background: rgb(var(--v-theme-blue), 0.2);
  color: var(--v-theme-grey-500) !important;
  font-size: 14px;
  padding: 8px;
  padding-bottom: 24px;
  border-radius: 16px;
  margin-bottom: -16px;
  width: fit-content;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-layout-name {
  font-size: 12px;
  padding-left: 8px;
}
.message-item {
  position: relative;
}

.message-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.message-content {
  max-width: 66%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.custom-layout-text {
  padding: 6px 12px;
  border-radius: 16px;
  background: rgb(var(--v-theme-grey-100));
  font-size: 14px;
  word-break: break-word;
}
.is-mine {
  background: rgb(var(--v-theme-blue));
  color: #fff;
  margin-left: auto;
}
.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: 0.2s ease;
}

.message-row:hover .message-actions {
  opacity: 1;
}

.fb-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.fb-dialog {
  background: #fff;
  width: 500px;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.fb-header {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fb-search-container {
  padding: 8px 16px;
  border-bottom: 1px solid #e5e5e5;
}

.selected-users-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.fb-chip {
  background: #e7f3ff;
  color: #1877f2;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.remove-chip {
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
}

.fb-user-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.fb-user-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.fb-user-item:hover {
  background: #f2f2f2;
}

.fb-avatar {
  width: 40px;
  height: 40px;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.fb-user-info {
  flex: 1;
}
.fb-user-name {
  font-weight: 600;
  color: #050505;
}
.fb-user-sub {
  font-size: 12px;
  color: #65676b;
}

.fb-checkbox .circle {
  width: 20px;
  height: 20px;
  border: 2px solid #ced0d4;
  border-radius: 50%;
}

.fb-checkbox .circle.checked {
  background: #1877f2;
  border-color: #1877f2;
  position: relative;
}

.fb-checkbox .circle.checked::after {
  content: "✓";
  color: white;
  font-size: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fb-footer {
  padding: 16px;
  border-top: 1px solid #e5e5e5;
}

.fb-btn-primary {
  width: 100%;
  background: #1877f2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.fb-btn-primary:disabled {
  background: #e4e6eb;
  color: #bcc0c4;
  cursor: not-allowed;
}
</style>
<style lang="scss">
.custome-content {
  overflow-y: auto;
  height: calc(100vh - 240px);
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
.custome-content-reply {
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
  background: rgb(var(--v-theme-grey-50));
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

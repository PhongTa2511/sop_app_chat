<template>
  <div>
    <v-card>
      <v-layout>
        <v-navigation-drawer v-model="drawerLeft" :width="300" class="py-4">
          <v-text-field
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Tìm kiếm"
            hide-details
            single-line
            class="mx-6 my-2"
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
            >
              <template v-slot:prepend>
                <v-avatar>
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
                </v-avatar>
              </template>

              <template v-slot:append>
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
            <v-btn icon="mdi-magnify" variant="text" color="blue"></v-btn>

            <v-btn icon="mdi-filter" variant="text" color="blue"></v-btn>
          </template>

          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            color="blue"
            @click.stop="drawerRight = !drawerRight"
          ></v-btn>
        </v-app-bar>

        <v-main style="height: calc(100vh - 154px)" class="position-relative">
          <v-list ref="chatList" class="custome-content">
            <v-list-item v-for="mes in messageLst" :key="mes.MessageID">
              <template v-slot:prepend v-if="!mes.IsMine">
                <v-avatar size="small">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
                </v-avatar>
              </template>
              <template v-slot:append v-else>
                <v-avatar size="small">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
                </v-avatar>
              </template>
              <div
                :class="{
                  'float-right text-right is-mine': mes.IsMine,
                }"
                class="custom-layout-text"
              >
                {{ mes.TextContent }}
              </div>
            </v-list-item>
          </v-list>

          <div
            class="d-flex align-center px-1 position-absolute bottom-0 mb-2"
            :style="{
              left: drawerLeft ? '300px' : '0',
              right: drawerRight ? '300px' : '0',
            }"
          >
            <v-btn
              icon="mdi-link-variant"
              rounded="pill"
              color="blue"
              variant="text"
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
              @keyup.enter="sendMessageHandler"
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
  </div>
</template>
<script>
// import { sendMessage, onMessage, onMessage2 } from "@/socket";
import {
  SendMessage,
  GetGroupMessageLst,
  GetMessageByGoupID,
} from "@/api/messageApi";
import { notify } from "@kyvg/vue3-notification";
import { getUserName } from "@/utils/auth";
import socket from "@/socket";
import RightChat from "./components/right-chat.vue";
export default {
  name: "app",
  components: {
    RightChat,
  },
  data() {
    return {
      drawerLeft: true,
      drawerRight: true,
      groupInfo: null,
      groupLst: [],
      messageLst: [],
      groups: [
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 2,
          name: "Nhóm 2",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 2",
          isMine: false,
        },
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 2,
          name: "Nhóm 2",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 2",
          isMine: false,
        },
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 2,
          name: "Nhóm 2",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 2",
          isMine: false,
        },
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 2,
          name: "Nhóm 2",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 2",
          isMine: false,
        },
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 2,
          name: "Nhóm 2",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 2",
          isMine: false,
        },
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 1,
          name: "Nhóm 1",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 1",
          isMine: true,
        },
        {
          id: 2,
          name: "Nhóm 2",
          lastMessage: "Bạn đã nhận được tin nhắn mới từ Nhóm 2",
          isMine: false,
        },
      ],
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
    };
  },
  watch: {
    groupInfo() {
      this.getMessageByGoupID();
      socket.emit("joinGroup", this.groupInfo.GroupID);
    },
  },
  methods: {
    getGroupMessageLst() {
      GetGroupMessageLst({
        PageNumber: 1,
        RowspPage: 10,
        Search: "",
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

      // Tính chênh lệch thời gian bằng phút
      const differenceInMinutes = Math.abs((date1 - date2) / (1000 * 60));

      // Nếu nhỏ hơn 60 phút, trả về số phút
      if (differenceInMinutes <= 1) {
        return `Vừa xong`;
      }

      if (differenceInMinutes < 60) {
        return `${parseInt(differenceInMinutes)} phút`;
      }

      // Nếu lớn hơn hoặc bằng 60 phút, trả về số giờ và phút
      const hours = Math.floor(differenceInMinutes / 60);
      const minutes = differenceInMinutes % 60;
      return `${hours}h${parseInt(minutes)}p`;
    },
    sendMessageHandler() {
      var req = {
        SenderID: this.senderID,
        GroupID: this.groupInfo.GroupID,
        RecipientID: null,
        TextContent: this.newMessage,
        IsAttachment: 0,
        IsMine: true,
      };
      SendMessage({
        Data: req,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.messageLst.push(req);
          this.scrollBottom();
          socket.emit("sendMessage", req);
        }
      });
      this.newMessage = ""; // Xóa input sau khi gửi
    },
    selectGroup(groupInfo) {
      this.groupInfo = groupInfo;
    },
    getMessageByGoupID() {
      GetMessageByGoupID({
        GroupID: this.groupInfo.GroupID,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.messageLst = res.Data.map((item) => {
            return {
              ...item,
              IsMine: item.SenderID == this.senderID ? true : false,
            };
          });
          this.scrollBottom();
        }
      });
    },
    scrollBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatList.$el) {
          this.$refs.chatList.$el.scrollTop =
            this.$refs.chatList.$el.scrollHeight;
        }
      });
    },
    addEmoji(emoji) {
      this.newMessage += emoji;
    },
  },
  created() {
    this.getGroupMessageLst();
    socket.on("receiveMessage", (message) => {
      if (
        message.SenderID != this.senderID &&
        message.GroupID == this.groupInfo.GroupID
      ) {
        this.messageLst.push({ ...message, IsMine: false });
        this.groupInfo.TextContent = message.TextContent;
        this.scrollBottom();
        notify({
          type: "success",
          title: "Tin nhắn mới",
          text: message.TextContent,
        });
      }
    });
  },
};
</script>
<style lang="scss" scoped>
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
</style>

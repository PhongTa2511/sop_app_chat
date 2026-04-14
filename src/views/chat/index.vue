<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      multiple
      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.rar"
      style="display: none"
      @change="handleFileUpload"
    />
    <VCard>
      <VLayout>
        <VNavigationDrawer v-model="drawerLeft" :width="300" class="py-4">
          <div
            class="mx-4 text-lg d-flex justify-space-between align-center mb-2"
          >
            <div class="text-lg">Đoạn chat</div>
            <VBtn
              icon="mdi-square-edit-outline"
              size="x-small"
              @click="openCreateGroupDialog"
            />
          </div>
          <VTextField
            v-model="searchGroup"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Tìm kiếm"
            hide-details
            single-line
            class="mx-4 my-0"
          />
          <VList>
            <VListItem
              v-for="folder in groupLst"
              :key="folder.GroupID"
              :subtitle="folder.TextContent"
              :value="folder"
              color="blue"
              variant="text"
              class="py-4"
              :active="folder.GroupID == groupInfo.GroupID"
              @click="selectGroup(folder)"
            >
              <template #prepend>
                <VAvatar
                  :color="
                    folder.GroupID == groupInfo.GroupID ? 'blue' : 'secondary'
                  "
                >
                  <VImg v-if="folder.Avatar" :src="folder.Avatar" />
                  <VIcon v-else> mdi-account-supervisor </VIcon>
                </VAvatar>
              </template>
              <template #title>
                <div class="text-bold" style="font-weight: 700">
                  {{ folder.GroupName ? folder.GroupName : folder.DocumentID }}
                </div>
              </template>
              <template #subtitle>
                <div class="text-xs text-gray-700">
                  {{
                    folder.NewMessage ??
                    folder.LastMessage ??
                    "Hãy bắt đầu cuộc trò chuyện"
                  }}
                </div>
              </template>
              <template v-if="folder.TimeCreate" #append>
                <VBadge
                  v-if="folder.UnreadCount > 0"
                  location="top right"
                  color="primary"
                  dot
                  :offset-y="-10"
                >
                  <div class="text-xs text-grey-800">
                    {{ folder.TimeShow }}
                  </div>
                </VBadge>
                <div v-else class="text-xs text-grey-800">
                  {{ folder.TimeShow }}
                </div>
              </template>
            </VListItem>
          </VList>
        </VNavigationDrawer>
        <VAppBar>
          <VAppBarNavIcon
            variant="text"
            color="blue"
            @click.stop="drawerLeft = !drawerLeft"
          />

          <VToolbarTitle v-if="groupInfo" class="font-weight-bold">
            {{
              groupInfo.GroupName ? groupInfo.GroupName : groupInfo.DocumentID
            }}
          </VToolbarTitle>

          <VSpacer />

          <template v-if="$vuetify.display.mdAndUp">
            <!--
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
            -->

            <VTooltip text="Tìm kiếm tin nhắn">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon="mdi-magnify"
                  variant="text"
                  color="blue"
                  @click="openSearchDialog"
                />
              </template>
            </VTooltip>

            <!-- <v-btn icon="mdi-filter" variant="text" color="blue"></v-btn> -->
          </template>

          <VBtn
            icon="mdi-dots-vertical"
            variant="text"
            color="blue"
            @click.stop="drawerRight = !drawerRight"
          />
        </VAppBar>

        <VMain style="height: calc(100vh - 116px)" class="position-relative">
          <VList
            v-if="messageLst.length > 0"
            ref="chatList"
            :class="replyingTo ? 'custome-content-reply' : 'custome-content'"
            :style="chatListStyle"
            @scroll="handleScroll"
          >
            <div v-if="loadingMore" class="loading-indicator">
              <VProgressCircular indeterminate color="blue" />
            </div>
            <VListItem
              v-for="(mes, index) in messageLst"
              :id="'msg-' + mes.MessageID"
              :key="mes.MessageID"
              style="padding: 0 4px 0 8px; margin-top: 4px"
              class="message-item"
            >
              <template v-if="!mes.IsMine" #prepend>
                <VAvatar v-if="mes.isLatest" size="small" color="secondary">
                  <VImg v-if="mes.Avatar" :src="mes.Avatar" />
                  <VIcon v-else size="x-small"> mdi-account </VIcon>
                </VAvatar>
                <VAvatar v-else size="small" />
              </template>

              <template v-else #append>
                <VAvatar size="small" v-if="mes.isLatest" color="blue">
                  <VImg v-if="mes.Avatar" :src="mes.Avatar" />
                  <VIcon v-else size="x-small"> mdi-account </VIcon>
                </VAvatar>
                <VAvatar v-else size="small" />
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
                    class="message-bubble-wrap"
                    :class="{
                      mine: mes.IsMine,
                      'has-reactions':
                        reactionsEnabled &&
                        mes.Reactions &&
                        mes.Reactions.length > 0,
                    }"
                  >
                    <div
                      v-if="mes.IsAttachment == 0"
                      :class="{
                        ' is-mine': mes.IsMine,
                      }"
                      class="custom-layout-text"
                      @dblclick="reactionsEnabled && reactToMessage(mes, '👍')"
                    >
                      <div
                        v-if="mes.Forward"
                        class="forward-block"
                        @click.stop="scrollToForward(mes.Forward)"
                      >
                        <div class="forward-head">
                          <VIcon size="x-small" class="mr-1">mdi-forward</VIcon>
                          <span>Chuyển tiếp</span>
                        </div>
                        <div class="forward-from">
                          Từ
                          {{ mes.Forward.SenderName || mes.Forward.SenderID }}
                        </div>
                        <div class="forward-preview">
                          <template v-if="mes.Forward.IsAttachment === 1">
                            [Hình ảnh]
                          </template>
                          <template v-else-if="mes.Forward.IsAttachment > 1">
                            [Tệp] {{ mes.Forward.MineFile || "" }}
                          </template>
                          <template v-else>
                            {{ mes.Forward.Text || "" }}
                          </template>
                        </div>
                      </div>
                      <div
                        :style="{ whiteSpace: 'pre-line' }"
                        v-html="mes.TextContentHtml"
                      />
                    </div>
                    <div
                      v-else-if="
                        mes.IsAttachment > 0 && mes.AttachmentKind === 'image'
                      "
                    >
                      <VImg
                        :width="200"
                        aspect-ratio="1/1"
                        cover
                        :src="mes.LinkFile"
                        class="text-center custom-layout-text border"
                        @click="btShowImage(mes)"
                      >
                        <template #error>
                          <VIcon
                            color="red"
                            class="text-center mt-3"
                            size="large"
                          >
                            mdi-file-image-remove
                          </VIcon>
                          <div class="text-subtitle-2 mt-1">
                            Hình ảnh bị lỗi
                          </div>
                        </template>
                      </VImg>
                    </div>
                    <div
                      v-else-if="
                        mes.IsAttachment > 0 && mes.AttachmentKind === 'file'
                      "
                      :class="{
                        'float-right ': mes.IsMine,
                      }"
                      class="custom-layout-text"
                    >
                      <div class="d-flex">
                        <VBtn
                          icon
                          rounded="fill"
                          color="grey-800"
                          size="small"
                          @click="btDownloadFile(mes)"
                        >
                          <VIcon> mdi-file-document-outline </VIcon>
                        </VBtn>
                        <div class="pl-2">
                          <div class="text-subtitle-2">
                            {{
                              mes.TextContent || mes.MineFile || "Tệp đính kèm"
                            }}
                          </div>
                          <div>
                            {{ mes.SizeFileText }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="
                        reactionsEnabled &&
                        mes.Reactions &&
                        mes.Reactions.length > 0
                      "
                      class="reaction-summary"
                      :class="{ mine: mes.IsMine, active: !!mes.MyEmoji }"
                      @click="reactionMenuFor = mes.MessageID"
                    >
                      <span class="reaction-emojis">
                        {{ reactionSummary(mes).emojis.join("") }}
                      </span>
                      <span class="reaction-count">{{
                        reactionSummary(mes).total
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="message-actions">
                  <VBtn
                    size="small"
                    icon="mdi-share"
                    density="compact"
                    style="border-radius: 50%"
                    :color="mes.IsMine ? 'blue' : 'grey'"
                    @click="setReply(mes)"
                  />

                  <VMenu
                    v-if="reactionsEnabled"
                    :model-value="reactionMenuFor === mes.MessageID"
                    :close-on-content-click="false"
                    location="top center"
                    @update:model-value="
                      (v) => (reactionMenuFor = v ? mes.MessageID : null)
                    "
                  >
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        size="small"
                        icon="mdi-emoticon-happy-outline"
                        density="compact"
                        style="border-radius: 50%"
                        :color="mes.IsMine ? 'blue' : 'grey'"
                      />
                    </template>

                    <VCard class="reaction-picker-card" elevation="24">
                      <div class="reaction-picker">
                        <span
                          v-for="emoji in reactionEmojis"
                          :key="emoji"
                          class="reaction-pick"
                          @click="reactToMessage(mes, emoji)"
                        >
                          {{ emoji }}
                        </span>
                      </div>
                    </VCard>
                  </VMenu>

                  <VBtn
                    size="small"
                    icon="mdi-forward"
                    density="compact"
                    style="border-radius: 50%"
                    :color="mes.IsMine ? 'blue' : 'grey'"
                    @click="openForwardDialog(mes)"
                  />
                </div>
              </div>
            </VListItem>
          </VList>
          <div v-else class="text-center" style="margin-top: 30%">
            <div>
              <VIcon color="blue" size="40"> mdi-forum </VIcon>
              <div>Hãy bắt đầu cuộc trò chuyện</div>
            </div>
          </div>

          <div
            class="position-absolute bottom-0 bg-white border-t d-flex flex-column composer-bar"
            ref="composerBar"
            :style="{
              left: drawerLeft ? '300px' : '0',
              right: drawerRight ? '300px' : '0',
            }"
          >
            <div
              v-if="typingLabel"
              class="px-4 py-1 text-caption text-grey-darken-1"
            >
              {{ typingLabel }}
            </div>
            <VExpandTransition>
              <div
                v-if="replyingTo"
                class="d-flex align-center px-4 py-2 bg-grey-100 border-b w-full"
              >
                <VIcon size="small" color="blue" class="mr-2">
                  mdi-reply
                </VIcon>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="text-caption font-weight-bold text-blue">
                    Đang trả lời
                    {{ replyingTo.NickName || replyingTo.LastName }}
                  </div>
                  <div class="text-truncate text-body-2 text-grey-darken-1">
                    {{
                      replyingTo.IsAttachment > 0 &&
                      (replyingTo.AttachmentKind ||
                        getAttachmentKind(replyingTo)) === "image"
                        ? "[Hình ảnh]"
                        : (replyingTo.TextContentPlain ??
                          replyingTo.TextContent)
                    }}
                  </div>
                </div>
                <VBtn
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  @click="replyingTo = null"
                />
              </div>
            </VExpandTransition>

            <div
              v-if="pendingAttachments.length > 0"
              class="composer-attachments-bar px-3 pt-2"
            >
              <div class="composer-attachments">
                <div
                  v-for="(att, idx) in pendingAttachments"
                  :key="att.id"
                  class="composer-attachment"
                >
                  <div v-if="att.isImage" class="composer-attachment-img">
                    <img :src="att.previewUrl" :alt="att.name" />
                  </div>
                  <div v-else class="composer-attachment-file">
                    <VIcon size="small" class="mr-1"
                      >mdi-file-document-outline</VIcon
                    >
                    <span class="composer-attachment-name">{{ att.name }}</span>
                  </div>

                  <button
                    class="composer-attachment-remove"
                    type="button"
                    @click="removePendingAttachment(idx)"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex align-center px-1 composer-row">
              <VBtn
                icon="mdi-link-variant"
                rounded="pill"
                color="blue"
                variant="text"
                @click="$refs.fileInput.click()"
              />
              <VMenu
                v-model="showEmojiPicker"
                :close-on-content-click="false"
                location="top center"
              >
                <template #activator="{ props }">
                  <VBtn
                    icon="mdi-emoticon-outline"
                    variant="text"
                    rounded="pill"
                    color="blue"
                    v-bind="props"
                  />
                </template>

                <VCard class="px-2 py-2" elevation="24" max-width="300">
                  <div class="emoji-picker">
                    <span
                      v-for="emoji in emojis"
                      :key="emoji"
                      style="cursor: pointer; padding: 5px; font-size: 24px"
                      @click="addEmoji(emoji)"
                    >
                      {{ emoji }}
                    </span>
                  </div>
                </VCard>
              </VMenu>

              <div class="mention-input">
                <div
                  v-if="showMentionPicker && mentionSuggestions.length > 0"
                  class="mention-suggest"
                >
                  <div
                    v-for="(item, idx) in mentionSuggestions"
                    :key="item.__key"
                    class="mention-item"
                    :class="{ active: idx === mentionActiveIndex }"
                    @mousedown.prevent="pickMention(item)"
                  >
                    <div class="mention-name">
                      {{ item.label }}
                    </div>
                    <div v-if="item.subLabel" class="mention-sub">
                      {{ item.subLabel }}
                    </div>
                  </div>
                </div>

                <VTextarea
                  ref="messageInput"
                  v-model="newMessage"
                  placeholder="Aa"
                  class="customText"
                  auto-grow
                  color="blue"
                  max-rows="6"
                  rows="1"
                  rounded="xl"
                  @input="handleMessageInput"
                  @paste="onComposerPaste"
                  @keydown="handleKeyPress"
                />
              </div>
              <VBtn
                icon="mdi-send"
                rounded="pill"
                color="blue"
                variant="text"
                :disabled="isSending"
                @click="sendMessageHandler"
              />
            </div>
          </div>
        </VMain>

        <VNavigationDrawer
          v-model="drawerRight"
          :width="300"
          class="py-4"
          location="right"
        >
          <RightChat :group-info="groupInfo" />
        </VNavigationDrawer>
      </VLayout>
    </VCard>
    <VDialog v-model="showImageDialog" max-width="600px">
      <VImg :src="selectedImage" aspect-ratio="1" />
    </VDialog>
    <VDialog v-model="showSearchDialog" max-width="600px">
      <VCard>
        <VCardTitle>Tìm kiếm tin nhắn</VCardTitle>
        <VCardText>
          <VTextField
            v-model="searchQuery"
            label="Nhập từ khóa"
            @keyup.enter="searchMessages"
          />
          <VList>
            <VListItem
              v-for="message in searchResults"
              :key="message.MessageID"
            >
              <template #prepend>
                <VAvatar size="small" color="secondary">
                  <VImg v-if="message.Avatar" :src="message.Avatar" />
                  <VIcon v-else size="x-small"> mdi-account </VIcon>
                </VAvatar>
              </template>

              <template #title>
                {{ message.TextContent }}
              </template>
              <template #subtitle>
                {{ message.FullName }} - {{ message.TimeShow }}
              </template>
            </VListItem>
          </VList>
        </VCardText>
        <VCardActions>
          <VBtn text @click="showSearchDialog = false"> Đóng </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showForwardDialog" max-width="520px">
      <VCard>
        <VCardTitle>Chuyển tiếp</VCardTitle>
        <VCardText>
          <VTextField
            v-model="forwardComment"
            label="Ghi chú (tuỳ chọn)"
            hide-details
            density="compact"
            class="mb-3"
          />
          <VTextField
            v-model="forwardSearch"
            label="Tìm đoạn chat"
            hide-details
            density="compact"
            class="mb-2"
          />

          <VList style="max-height: 320px; overflow: auto">
            <VListItem
              v-for="g in forwardGroupSuggestions"
              :key="g.GroupID"
              @click="forwardToGroup(g)"
            >
              <template #prepend>
                <VAvatar>
                  <VImg v-if="g.Avatar" :src="g.Avatar" />
                  <VIcon v-else> mdi-account-supervisor </VIcon>
                </VAvatar>
              </template>
              <template #title>
                <div class="text-bold" style="font-weight: 700">
                  {{ g.GroupName ? g.GroupName : g.DocumentID }}
                </div>
              </template>
              <template #subtitle>
                {{ g.NewMessage ?? g.LastMessage ?? "" }}
              </template>
            </VListItem>
          </VList>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="closeForwardDialog">Đóng</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
              ref="searchInput"
              v-model="searchUser"
              type="text"
              placeholder="Tìm kiếm người dùng..."
              class="w-100 px-4 py-2"
              @input="onSearchChange"
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
              <div class="fb-user-name">
                {{ item.FullName }}
              </div>
              <div class="fb-user-sub">
                {{ item.Email }}
              </div>
            </div>
            <div class="fb-checkbox">
              <div class="circle" :class="{ checked: isSelected(item) }" />
            </div>
          </div>

          <div class="list-footer">
            <div v-if="loading" class="fb-spinner" />
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
    :target-user-id="friendId"
    :current-user-id="currentUserId"
    @closeCall="btCloseCall"
  />
</template>

<script>
// import { sendMessage, onMessage, onMessage2 } from "@/socket";
import {
  CreateGroup,
  GetGroupLstByUserID,
  GetMemberLstByGroupID,
  GetMessageByGoupID,
  GetReactionsByMessageIDs,
  ReactMessage,
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
  name: "App",
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
      currentGroupID: null,
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
      pendingAttachments: [],
      isSending: false,

      // mentions
      memberLst: [],
      pendingMentions: [],
      pendingMentionAll: false,
      showMentionPicker: false,
      mentionQuery: "",
      mentionAtIndex: null,
      mentionActiveIndex: 0,

      // reactions
      reactionsEnabled: import.meta.env.VITE_MESSAGE_REACTIONS === "1",
      reactionMenuFor: null,
      reactionEmojis: ["👍", "❤️", "😂", "😮", "😢", "😡", "😆", "👏"],

      // rich message payload (mentions/forward metadata) - default OFF for SOP backend
      richEnabled: import.meta.env.VITE_MESSAGE_RICH === "1",

      // forward
      showForwardDialog: false,
      forwardSearch: "",
      forwardComment: "",
      forwardingMessage: null,

      // typing indicator
      typingUsers: {},
      lastTypingSentAt: 0,
    };
  },
  computed: {
    chatListStyle() {
      // Bình thường không thêm khoảng trống.
      // Khi có ảnh/file paste (thanh preview cao hơn), cần chừa thêm để tin cuối không bị che.
      const hasAttachments = (this.pendingAttachments || []).length > 0;
      if (!hasAttachments) return null;

      // 86px thumb + padding/bar + safe area
      return { paddingBottom: "140px" };
    },
    mentionSuggestions() {
      if (!this.showMentionPicker) return [];

      const query = (this.mentionQuery || "").trim().toLowerCase();
      const items = [];

      items.push({
        __key: "all",
        type: "all",
        label: "@all",
        subLabel: "Gửi tới mọi người",
        insertText: "@all",
      });

      const members = Array.isArray(this.memberLst) ? this.memberLst : [];
      const filtered = members.filter((m) => {
        const name = (m.NickName || m.FullName || "").toString().toLowerCase();
        const id = (m.UserID || m.UserName || "").toString().toLowerCase();
        if (!query) return true;
        return name.includes(query) || id.includes(query);
      });

      filtered.slice(0, 12).forEach((m) => {
        const userID = m.UserID || m.UserName;
        const fullName = (m.NickName || m.FullName || userID || "")
          .toString()
          .trim();
        if (!userID || !fullName) return;
        items.push({
          __key: `u:${userID}`,
          type: "user",
          UserID: userID,
          FullName: fullName,
          label: fullName,
          subLabel: userID,
          insertText: `@${fullName}`,
        });
      });

      return items;
    },
    forwardGroupSuggestions() {
      const q = (this.forwardSearch || "").trim().toLowerCase();
      const lst = Array.isArray(this.groupLst) ? this.groupLst : [];
      if (!q) return lst.slice(0, 30);
      return lst
        .filter((g) => {
          const name = (g.GroupName || g.DocumentID || "")
            .toString()
            .toLowerCase();
          return name.includes(q);
        })
        .slice(0, 30);
    },
    typingLabel() {
      const ids = Object.keys(this.typingUsers || {});
      if (!ids.length) return "";

      const names = ids
        .slice(0, 2)
        .map((id) => this.typingUsers[id]?.name || id);
      const more = ids.length - names.length;
      const prefix = names.join(", ");

      return more > 0
        ? `${prefix} và ${more} người khác đang nhập...`
        : `${prefix} đang nhập...`;
    },
  },
  watch: {
    groupInfo() {
      const groupID = this.groupInfo?.GroupID ?? null;
      this.currentGroupID = groupID;

      // Reset UI state khi chuyển đoạn chat
      this.typingUsers = {};
      this.loadingMore = false;
      this.currentPage = 1;
      this.messageLst = [];
      this.scrollBottom();

      if (!groupID) return;

      this.getMessageByGoupID();
      this.getMemberLstByGroupID();
      socket.emit("join:group", { GroupID: groupID });
    },
    searchGroup() {
      this.getGroupLstByUserID();
    },
  },
  created() {
    this.getGroupLstByUserID();
    socket.emit("join:user", { UserID: this.senderID });
    socket.on("new_message", (message) => {
      console.log("chạy vào đây", message);

      if (message.GroupID !== this.groupInfo.GroupID) return;
      this.markAsRead(message.GroupID);

      this.messageLst.push(this.decorateMessageForUI(message));

      this.messageLst = this.markLatestMessages(this.messageLst);
      this.applyReplyPreview();
      this.fetchReactionsForMessages([message.MessageID]);
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
        if (
          updatedGroup.GroupID !==
          (this.groupInfo?.GroupID ?? this.currentGroupID)
        ) {
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

    socket.on("reaction:update", (summary) => {
      if (!summary) return;
      if (
        summary.GroupID != null &&
        summary.GroupID !== this.groupInfo?.GroupID
      )
        return;
      this.applyReactionSummary(summary);
    });

    socket.on("mention", (payload) => {
      if (!payload) return;
      notify({
        title: "Bạn được nhắc",
        text: payload.Preview || "Bạn được nhắc trong một tin nhắn",
        type: "info",
      });
    });

    socket.on("typing", ({ GroupID, UserID }) => {
      if (!GroupID || !UserID) return;
      if (GroupID !== this.groupInfo?.GroupID) return;
      if (UserID === this.senderID) return;

      const member = (this.memberLst || []).find(
        (m) => (m.UserID || m.UserName) === UserID,
      );
      const name =
        member?.NickName || member?.FullName || member?.LastName || UserID;

      if (this.typingUsers?.[UserID]?.timeoutId) {
        clearTimeout(this.typingUsers[UserID].timeoutId);
      }

      const timeoutId = setTimeout(() => {
        const next = { ...(this.typingUsers || {}) };
        delete next[UserID];
        this.typingUsers = next;
      }, 2000);

      this.typingUsers = {
        ...(this.typingUsers || {}),
        [UserID]: { name, timeoutId },
      };
    });
  },
  methods: {
    // Kiểm tra có nên hiện tên người gửi không (giống messenger: gom nhóm tin nhắn)
    escapeHtml(input) {
      return (input ?? "").toString().replace(/[&<>"']/g, (ch) => {
        switch (ch) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&#39;";
          default:
            return ch;
        }
      });
    },
    parseRichStoredText(stored) {
      if (typeof stored !== "string") return null;
      const trimmed = stored.trim();
      if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
      try {
        const obj = JSON.parse(trimmed);
        if (!obj || typeof obj !== "object") return null;
        if (Number(obj.v) !== 1) return null;
        return obj;
      } catch (e) {
        return null;
      }
    },
    extractPreviewFromStoredText(stored) {
      const rich = this.parseRichStoredText(stored);
      if (!rich) return stored;
      if (typeof rich.text === "string" && rich.text.trim()) return rich.text;
      if (rich.forward) return "Đã chuyển tiếp";
      return "";
    },
    buildMessageHtmlFromText(text, rich) {
      const raw = (text ?? "").toString();
      const markers = [];
      let marked = raw;

      const urlMarkers = [];
      const urlRegex = /((https?:\/\/|ftp:\/\/)[^\s<]+|www\.[^\s<]+)/gi;
      marked = marked.replace(urlRegex, (match) => {
        if (!match) return match;
        let url = match;
        let suffix = "";
        const suffixMatch = url.match(/[),.!?]+$/);
        if (suffixMatch) {
          suffix = suffixMatch[0];
          url = url.slice(0, -suffix.length);
        }
        const idx = urlMarkers.length;
        const marker = `\u0001u${idx}\u0001`;
        urlMarkers.push({ url, original: match });
        return `${marker}${suffix}`;
      });

      const mentionTokens = [];
      const mentionAll = Boolean(rich?.mentionAll);
      if (mentionAll) mentionTokens.push("@all");
      const mentions = Array.isArray(rich?.mentions) ? rich.mentions : [];
      mentions.forEach((m) => {
        if (m?.FullName) mentionTokens.push(`@${m.FullName}`);
      });

      // Fallback highlight khi backend không lưu JSON rich
      if ((!rich || mentionTokens.length === 0) && raw.includes("@")) {
        const parts = raw.split(/(\s+)/);
        const rebuilt = parts
          .map((p) => {
            if (!p || /^\s+$/.test(p)) return p;
            if (p.startsWith("@") && p.length > 1)
              return `\u0001tag\u0001${p}\u0001end\u0001`;
            return p;
          })
          .join("");
        marked = rebuilt;
        markers.push({ marker: "\u0001tag\u0001", token: "__TAG_START__" });
        markers.push({ marker: "\u0001end\u0001", token: "__TAG_END__" });
      }

      mentionTokens
        .filter(Boolean)
        .slice(0, 50)
        .sort((a, b) => b.length - a.length)
        .forEach((token, idx) => {
          const marker = `\u0001m${idx}\u0001`;
          if (!marked.includes(token)) return;
          markers.push({ marker, token });
          marked = marked.split(token).join(marker);
        });

      let html = this.escapeHtml(marked);
      markers.forEach(({ marker, token }) => {
        if (token === "__TAG_START__") {
          html = html.split(marker).join(`<span class="dtp-mention">`);
          return;
        }
        if (token === "__TAG_END__") {
          html = html.split(marker).join(`</span>`);
          return;
        }
        const escapedToken = this.escapeHtml(token);
        html = html
          .split(marker)
          .join(`<span class="dtp-mention">${escapedToken}</span>`);
      });

      urlMarkers.forEach((u, idx) => {
        const marker = `\u0001u${idx}\u0001`;
        const rawUrl = (u?.url || "").toString();
        if (!rawUrl) return;
        const href = rawUrl.toLowerCase().startsWith("http")
          ? rawUrl
          : `https://${rawUrl}`;
        const safeHref = this.escapeHtml(encodeURI(href));
        const label = this.escapeHtml(u.original || rawUrl);
        html = html
          .split(marker)
          .join(
            `<a class="dtp-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`,
          );
      });

      html = html.replace(/\n/g, "<br>");
      return html;
    },
    reactionSummary(mes) {
      const reactions = Array.isArray(mes?.Reactions) ? mes.Reactions : [];
      const sorted = reactions
        .filter((r) => r && typeof r.Emoji === "string")
        .slice()
        .sort((a, b) => (Number(b.Count) || 0) - (Number(a.Count) || 0));

      const emojis = sorted.slice(0, 3).map((r) => r.Emoji);
      const total = sorted.reduce((sum, r) => sum + (Number(r.Count) || 0), 0);

      return { emojis, total };
    },
    getAttachmentKind(item) {
      const isAttachment = Number(item?.IsAttachment) > 0;
      if (!isAttachment) return null;

      if (Number(item?.IsAttachment) === 2) return "file";

      const name = (item?.MineFile || item?.TextContent || "").toString();
      const lowered = name.trim().toLowerCase();
      const ext = lowered.includes(".") ? lowered.split(".").pop() : "";
      const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];

      if (ext && imageExts.includes(ext)) return "image";

      // Back-compat: legacy messages often mark images as IsAttachment=1 without filename
      if (Number(item?.IsAttachment) === 1 && !ext) return "image";

      return "file";
    },
    decorateMessageForUI(item) {
      const fullName = item.FullName ?? "noname";
      const nameParts = fullName.split(" ");
      const lastName =
        nameParts[nameParts.length - 1] == ""
          ? nameParts[nameParts.length - 2]
          : nameParts[nameParts.length - 1];

      const rich = this.parseRichStoredText(item.TextContent);
      const textPlain =
        rich && typeof rich.text === "string"
          ? rich.text
          : (item.TextContent ?? "");
      const textHtml = this.buildMessageHtmlFromText(textPlain, rich);
      const forward =
        rich && rich.forward && typeof rich.forward === "object"
          ? rich.forward
          : null;

      return {
        ...item,
        IsMine: item.SenderID === this.senderID,
        LastName: lastName,
        TextContentPlain: textPlain,
        TextContentHtml: textHtml,
        Forward: forward,
        AttachmentKind: this.getAttachmentKind(item),
        SizeFileText:
          item.IsAttachment > 0 ? this.formatFileSize(item.SizeFile) : null,
      };
    },
    applyReplyPreview() {
      this.messageLst = this.messageLst.map((m) => {
        if (!m.ReplyID) return m;
        return {
          ...m,
          ReplyContent: this.getReplyContent(m.ReplyID),
        };
      });
    },
    async fetchReactionsForMessages(messageIDs) {
      if (!this.reactionsEnabled) return;
      const ids = (Array.isArray(messageIDs) ? messageIDs : [])
        .map((v) => Number.parseInt(v, 10))
        .filter(Number.isFinite);
      const unique = [...new Set(ids)].slice(0, 200);
      if (unique.length === 0) return;

      try {
        const res = await GetReactionsByMessageIDs({ MessageIDs: unique });
        if (!res) {
          this.reactionsEnabled = false;
          return;
        }
        if (!res?.Data?.Summaries) return;
        const summaries = res.Data.Summaries;
        Object.keys(summaries).forEach((k) => {
          this.applyReactionSummary(summaries[k]);
        });
      } catch (e) {
        this.reactionsEnabled = false;
      }
    },
    applyReactionSummary(summary) {
      if (!summary?.MessageID) return;
      const id = Number(summary.MessageID);
      const idx = this.messageLst.findIndex((m) => Number(m.MessageID) === id);
      if (idx < 0) return;
      const msg = this.messageLst[idx];
      this.messageLst.splice(idx, 1, {
        ...msg,
        Reactions: Array.isArray(summary.Reactions) ? summary.Reactions : [],
        MyEmoji: summary.MyEmoji ?? null,
      });
    },
    async reactToMessage(mes, emoji) {
      if (!mes?.MessageID) return;
      if (!this.reactionsEnabled) return;
      this.reactionMenuFor = null;

      try {
        const res = await ReactMessage({
          Data: { MessageID: mes.MessageID, Emoji: emoji },
        });
        if (!res) {
          this.reactionsEnabled = false;
          return;
        }
        if (res?.Data) this.applyReactionSummary(res.Data);
        else await this.fetchReactionsForMessages([mes.MessageID]);
      } catch (e) {
        this.reactionsEnabled = false;
      }
    },
    openForwardDialog(mes) {
      this.forwardingMessage = mes;
      this.forwardSearch = "";
      this.forwardComment = "";
      this.showForwardDialog = true;
    },
    closeForwardDialog() {
      this.showForwardDialog = false;
      this.forwardingMessage = null;
      this.forwardSearch = "";
      this.forwardComment = "";
    },
    async forwardToGroup(group) {
      if (!this.forwardingMessage || !group?.GroupID) return;

      const original = this.forwardingMessage;
      const forward = {
        MessageID: original.MessageID,
        GroupID: original.GroupID ?? null,
        SenderID: original.SenderID ?? null,
        SenderName:
          original.NickName || original.FullName || original.LastName || null,
        Text: original.TextContentPlain ?? original.TextContent ?? null,
        IsAttachment: original.IsAttachment ?? null,
        MineFile: original.MineFile ?? null,
        TimeCreate: original.TimeCreate ?? null,
      };

      const text = (this.forwardComment || "").toString();
      const rich = { v: 1, text, mentions: [], mentionAll: false, forward };

      const originalPreview = (() => {
        if (Number(original?.IsAttachment) > 0) {
          const kind =
            original.AttachmentKind ||
            this.getAttachmentKind(original) ||
            "file";
          if (kind === "image") return "[Hình ảnh]";
          return `[Tệp] ${original.MineFile || ""}`.trim();
        }
        return (
          original.TextContentPlain ??
          original.TextContent ??
          ""
        ).toString();
      })();

      const plain =
        (text ? `${text}\n` : "") + `Đã chuyển tiếp: ${originalPreview}`;

      const req = {
        SenderID: this.senderID,
        GroupID: group.GroupID,
        RecipientID: null,
        TextContent: this.richEnabled ? rich : plain,
        IsAttachment: 0,
        IsMine: true,
        ReplyID: null,
        Avatar: getAvatar(),
      };

      try {
        const res = await SendMessage({ Data: req });
        if (res?.RespCode === 0) socket.emit("sendMessage", res.Data);
        this.closeForwardDialog();
      } catch (e) {
        notify({
          title: "Lỗi",
          text:
            e?.response?.data?.RespText || e?.message || "Chuyển tiếp thất bại",
          type: "error",
        });
        this.closeForwardDialog();
      }
    },
    getMessageTextareaEl() {
      const ref = this.$refs.messageInput;
      const root = ref?.$el || ref;
      if (!root) return null;
      return root.querySelector ? root.querySelector("textarea") : null;
    },
    handleMessageInput() {
      const el = this.getMessageTextareaEl();
      if (!el) return;
      this.emitTyping();
      const cursor = Number.isFinite(el.selectionStart)
        ? el.selectionStart
        : (this.newMessage || "").length;
      const text = (this.newMessage || "").toString();
      const upto = text.slice(0, cursor);
      const atPos = upto.lastIndexOf("@");

      if (atPos < 0) {
        this.showMentionPicker = false;
        this.mentionQuery = "";
        this.mentionAtIndex = null;
        return;
      }

      const before = atPos === 0 ? " " : upto[atPos - 1];
      if (before && !/\s/.test(before)) {
        this.showMentionPicker = false;
        this.mentionQuery = "";
        this.mentionAtIndex = null;
        return;
      }

      const query = upto.slice(atPos + 1);
      if (query.includes(" ") || query.includes("\n") || query.length > 40) {
        this.showMentionPicker = false;
        this.mentionQuery = "";
        this.mentionAtIndex = null;
        return;
      }

      this.mentionAtIndex = atPos;
      this.mentionQuery = query;
      this.mentionActiveIndex = 0;
      this.showMentionPicker = true;
    },
    emitTyping() {
      const now = Date.now();
      if (now - (this.lastTypingSentAt || 0) < 900) return;
      if (!this.groupInfo?.GroupID) return;

      this.lastTypingSentAt = now;
      socket.emit("typing", {
        GroupID: this.groupInfo.GroupID,
        UserID: this.senderID,
      });
    },
    pickMention(item) {
      const el = this.getMessageTextareaEl();
      if (!el) return;
      if (this.mentionAtIndex == null) return;

      const cursor = Number.isFinite(el.selectionStart)
        ? el.selectionStart
        : (this.newMessage || "").length;
      const text = (this.newMessage || "").toString();
      const before = text.slice(0, this.mentionAtIndex);
      const after = text.slice(cursor);
      const insert = item?.insertText || "";
      if (!insert) return;

      this.newMessage = `${before}${insert} ${after}`;

      if (item.type === "all") this.pendingMentionAll = true;
      else if (item.type === "user" && item.UserID) {
        if (!this.pendingMentions.some((m) => m.UserID === item.UserID)) {
          this.pendingMentions.push({
            UserID: item.UserID,
            FullName: item.FullName || null,
          });
        }
      }

      this.showMentionPicker = false;
      this.mentionQuery = "";
      this.mentionAtIndex = null;

      this.$nextTick(() => {
        const pos = (before + insert + " ").length;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    },
    showSenderName(mes, index) {
      if (mes.IsMine) return false;
      if (index === 0) return true;

      return this.messageLst[index - 1].SenderID !== mes.SenderID;
    },

    // Khi nhấn nút Reply
    setReply(message) {
      this.replyingTo = message;

      this.$nextTick(() => {
        const el = this.getMessageTextareaEl();
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
      if (Number(original.IsAttachment) > 0) {
        const kind =
          original.AttachmentKind || this.getAttachmentKind(original);
        if (kind === "image") return "📸 Hình ảnh";
        return "📁 Tệp đính kèm";
      }

      return original.TextContentPlain ?? original.TextContent;
    },

    // Cuộn đến tin nhắn gốc khi nhấn vào bong bóng reply
    scrollToMessage(id) {
      const el = document.getElementById(`msg-${id}`); // Bạn nên thêm id="msg-..." vào v-list-item
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    scrollToForward(forward) {
      const messageID = Number(forward?.MessageID);
      const groupID = Number(forward?.GroupID);
      if (!Number.isFinite(messageID) || messageID <= 0) return;
      if (Number.isFinite(groupID) && this.groupInfo?.GroupID != null) {
        if (Number(this.groupInfo.GroupID) !== groupID) return;
      }
      this.scrollToMessage(messageID);
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
      const files = Array.from(event?.target?.files || []);
      event.target.value = "";
      if (!files.length) return;
      if (!this.groupInfo?.GroupID) return;

      files.forEach((file) => {
        this.sendSingleAttachment(file);
      });
    },
    onComposerPaste(event) {
      try {
        const dt = event?.clipboardData;
        if (!dt || !dt.items) return;

        const items = Array.from(dt.items || []);
        const imageItems = items.filter(
          (it) => it.kind === "file" && (it.type || "").startsWith("image/"),
        );
        if (imageItems.length === 0) return;

        const files = imageItems
          .map((it) => (it.getAsFile ? it.getAsFile() : null))
          .filter(Boolean)
          .map((f) => {
            const ext = (f.type || "image/png").split("/")[1] || "png";
            const safeName = f.name && f.name !== "image.png" ? f.name : "";
            const name = safeName || `clipboard-${Date.now()}.${ext}`;
            return new File([f], name, { type: f.type || "image/png" });
          });

        if (files.length === 0) return;

        const pastedText = (dt.getData && dt.getData("text/plain")) || "";
        if (!pastedText) event.preventDefault();

        this.queuePendingAttachments(files);
      } catch (_) {
        // ignore
      }
    },
    queuePendingAttachments(files) {
      if (!Array.isArray(files) || files.length === 0) return;

      files.forEach((file) => {
        const isImage = (file?.type || "").toLowerCase().startsWith("image/");
        const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const previewUrl = isImage ? URL.createObjectURL(file) : null;

        this.pendingAttachments.push({
          id,
          file,
          isImage,
          name: file?.name || "file",
          previewUrl,
        });
      });
    },
    removePendingAttachment(idx) {
      const att = this.pendingAttachments[idx];
      if (att?.previewUrl) URL.revokeObjectURL(att.previewUrl);
      this.pendingAttachments.splice(idx, 1);
    },
    clearPendingAttachments() {
      for (let i = this.pendingAttachments.length - 1; i >= 0; i--) {
        this.removePendingAttachment(i);
      }
    },
    async sendPendingAttachments() {
      if (!this.pendingAttachments.length) return true;

      const items = this.pendingAttachments.slice();
      let allOk = true;

      for (const att of items) {
        const ok = await this.sendSingleAttachment(att.file);
        if (!ok) allOk = false;

        if (ok) {
          const idx = this.pendingAttachments.findIndex((x) => x.id === att.id);
          if (idx >= 0) this.removePendingAttachment(idx);
        }
      }

      return allOk;
    },
    async sendSingleAttachment(file) {
      if (!file) return false;
      if (!this.groupInfo?.GroupID) return false;

      const sizeFile = file.size;
      const isImage = (file.type || "").toLowerCase().startsWith("image/");
      const isAttachment = isImage ? 1 : 2;
      const params = new FormData();
      params.append("file", file);

      const req = {
        SenderID: this.senderID,
        GroupID: this.groupInfo.GroupID,
        RecipientID: null,
        TextContent: isImage ? "" : file.name,
        IsAttachment: isAttachment,
        IsMine: true,
        ReplyID: this.replyingTo ? this.replyingTo.MessageID : null,
        SizeFile: sizeFile,
        MineFile: file.name,
        Avatar: getAvatar(),
      };

      // Fallback cho backend validate chặt (vd SOP): gửi schema cũ tối giản
      const reqCompat = {
        SenderID: req.SenderID,
        GroupID: req.GroupID,
        RecipientID: req.RecipientID,
        IsAttachment: 1,
        IsMine: req.IsMine,
        SizeFile: req.SizeFile,
        Avatar: req.Avatar,
      };

      const doUpload = async (messageID, socketPayload) => {
        const resfile = await Axios.post(
          urlUploadMessageFile(messageID),
          params,
        );
        if (resfile?.data?.RespCode === 0) {
          socket.emit("sendMessage", socketPayload);
          return true;
        }

        notify({
          title: "Lỗi",
          text: resfile?.data?.RespText || "Upload file thất bại",
          type: "error",
        });
        return false;
      };

      try {
        const res = await SendMessage({ Data: req });
        if (res?.RespCode === 0)
          return await doUpload(res.Data.MessageID, res.Data);
      } catch (_) {
        // ignore and fallback
      }

      try {
        const res2 = await SendMessage({ Data: reqCompat });
        if (res2?.RespCode === 0)
          return await doUpload(res2.Data.MessageID, res2.Data);
      } catch (err) {
        notify({
          title: "Lỗi",
          text:
            err?.response?.data?.RespText ||
            err?.response?.data?.error ||
            err?.message ||
            "Gửi tin nhắn file thất bại",
          type: "error",
        });
      }

      return false;
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
              LastMessage: this.extractPreviewFromStoredText(item.LastMessage),
              NewMessage: this.extractPreviewFromStoredText(item.NewMessage),
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
    async sendMessageHandler() {
      if (this.isSending) return;

      const text = (this.newMessage || "").trim();
      if (!text && this.pendingAttachments.length === 0) return;
      if (!this.groupInfo?.GroupID) return;

      this.isSending = true;
      const hasRich =
        this.richEnabled &&
        (this.pendingMentionAll ||
          (Array.isArray(this.pendingMentions) &&
            this.pendingMentions.length > 0));

      const textContent = hasRich
        ? {
            v: 1,
            text,
            mentions: this.pendingMentions.slice(0, 50),
            mentionAll: Boolean(this.pendingMentionAll),
            forward: null,
          }
        : text;

      const req = {
        SenderID: this.senderID,
        GroupID: this.groupInfo.GroupID,
        RecipientID: null,
        TextContent: textContent,
        IsAttachment: 0,
        IsMine: true,
        ReplyID: this.replyingTo ? this.replyingTo.MessageID : null,
        Avatar: getAvatar(),
      };

      const onSent = (res) => {
        if (res?.RespCode == 0) {
          socket.emit("sendMessage", res.Data);
          return true;
        }
        return false;
      };

      try {
        // Pasted ảnh/file: gửi khi bấm Send (giống Messenger)
        if (this.pendingAttachments.length > 0) {
          const okAtt = await this.sendPendingAttachments();
          if (!okAtt) return;
        }

        if (text) {
          try {
            const res = await SendMessage({ Data: req });
            onSent(res);
          } catch (err) {
            if (!hasRich) throw err;

            // Fallback: backend không hỗ trợ rich payload → gửi plain text
            this.richEnabled = false;
            const res2 = await SendMessage({
              Data: { ...req, TextContent: text },
            });
            onSent(res2);
          }
        }

        this.newMessage = "";
        this.replyingTo = null;
        this.pendingMentions = [];
        this.pendingMentionAll = false;
        this.showMentionPicker = false;
      } catch (err) {
        notify({
          title: "Lỗi",
          text:
            err?.response?.data?.RespText ||
            err?.response?.data?.error ||
            err?.message ||
            "Gửi tin nhắn thất bại",
          type: "error",
        });
      } finally {
        this.isSending = false;
      }
    },
    selectGroup(groupInfo) {
      this.groupInfo = groupInfo;
      this.currentGroupID = groupInfo?.GroupID ?? null;
      this.newMessage = "";
      this.replyingTo = null;
      this.pendingMentions = [];
      this.pendingMentionAll = false;
      this.showMentionPicker = false;
      this.clearPendingAttachments();
      this.markAsRead(groupInfo.GroupID);
    },
    getMemberLstByGroupID() {
      if (!this.groupInfo?.GroupID) return;
      GetMemberLstByGroupID({
        GroupID: this.groupInfo.GroupID,
        ComID: "",
      }).then((res) => {
        if (res?.RespCode === 0) {
          this.memberLst = Array.isArray(res.Data) ? res.Data : [];
        }
      });
    },
    async getMessageByGoupID() {
      const groupID = this.groupInfo?.GroupID;
      if (!groupID) return;

      try {
        const res = await GetMessageByGoupID({
          GroupID: groupID,
          PageNumber: 1,
          RowspPage: this.rowspPage,
          Search: "",
          ComID: "",
        });

        // Nếu user đổi group trong lúc đang load → bỏ kết quả cũ
        if (this.groupInfo?.GroupID !== groupID) return;

        if (res?.RespCode === 0) {
          this.messageLst = (res.Data || []).map((item) =>
            this.decorateMessageForUI(item),
          );
          this.messageLst = this.markLatestMessages(this.messageLst);
          this.applyReplyPreview();
          this.scrollBottom();
          this.fetchReactionsForMessages(
            this.messageLst.slice(-80).map((m) => m.MessageID),
          );
        }
      } catch (_) {
        // ignore
      }
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
        const list = this.$refs.chatList;
        const el = list?.$el || list;
        if (!el) return;

        const scroll = () => {
          el.scrollTop = el.scrollHeight;
        };

        scroll();
        requestAnimationFrame(() => {
          scroll();
          requestAnimationFrame(scroll);
        });
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
          var dataAll = res.Data.map((item) => this.decorateMessageForUI(item));
          this.messageLst = [...dataAll, ...this.messageLst]; // Prepend new messages
          this.messageLst = this.markLatestMessages(this.messageLst);
          this.applyReplyPreview();
          this.fetchReactionsForMessages(dataAll.map((m) => m.MessageID));

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
      if (this.showMentionPicker) {
        if (event.key === "ArrowDown") {
          this.mentionActiveIndex = Math.min(
            this.mentionActiveIndex + 1,
            this.mentionSuggestions.length - 1,
          );
          event.preventDefault();
          return;
        }
        if (event.key === "ArrowUp") {
          this.mentionActiveIndex = Math.max(this.mentionActiveIndex - 1, 0);
          event.preventDefault();
          return;
        }
        if (event.key === "Escape") {
          this.showMentionPicker = false;
          event.preventDefault();
          return;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          const item = this.mentionSuggestions[this.mentionActiveIndex];
          if (item) this.pickMention(item);
          event.preventDefault();
          return;
        }
      }

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

.message-bubble-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.message-bubble-wrap.mine {
  align-self: flex-end;
}

.message-bubble-wrap.has-reactions {
  padding-bottom: 14px;
}

.custom-layout-text {
  padding: 6px 12px;
  border-radius: 16px;
  background: rgb(var(--v-theme-grey-100));
  font-size: 14px;
  word-break: break-word;
  position: relative;
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

.mention-input {
  position: relative;
  flex: 1;
}

.composer-bar {
  z-index: 20;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.06);
}

.composer-row {
  background: #fff;
}

.composer-attachments-bar {
  background: #fff;
  border-bottom: 1px solid #e4e6eb;
}

.composer-attachments {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bec5ce;
    border-radius: 20px;
  }
}

.composer-attachment {
  position: relative;
  width: 86px;
  height: 86px;
  border-radius: 12px;
  border: 1px solid #e4e6eb;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.composer-attachment-img {
  width: 100%;
  height: 100%;
}

.composer-attachment-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.composer-attachment-file {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #050505;
  font-weight: 700;
  font-size: 12px;
}

.composer-attachment-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.composer-attachment-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  line-height: 22px;
  text-align: center;
  font-size: 18px;
}

.composer-attachment-remove:hover {
  background: rgba(0, 0, 0, 0.72);
}

.mention-suggest {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 260px;
  overflow: auto;
  background: #fff;
  border: 1px solid #e4e6eb;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  z-index: 50;
  padding: 6px;
}

.mention-item {
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.mention-item:hover,
.mention-item.active {
  background: #f0f2f5;
}

.mention-name {
  font-size: 14px;
  font-weight: 600;
  color: #050505;
}

.mention-sub {
  font-size: 12px;
  color: #65676b;
}

:deep(.dtp-mention) {
  background: rgba(24, 119, 242, 0.14);
  color: #1877f2;
  padding: 0 4px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

.custom-layout-text.is-mine :deep(.dtp-mention) {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

:deep(.dtp-link) {
  color: #0866ff;
  font-weight: 600;
  text-decoration: underline;
  word-break: break-word;
}

.custom-layout-text.is-mine :deep(.dtp-link) {
  color: #e7f3ff;
  text-decoration-color: rgba(255, 255, 255, 0.7);
}

:deep(.dtp-link:hover) {
  text-decoration: underline;
  filter: brightness(0.95);
}

.forward-block {
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(24, 119, 242, 0.18);
  border-left: 3px solid #1877f2;
  padding: 8px 10px;
  border-radius: 14px;
  margin-bottom: 8px;
  cursor: pointer;
}

.custom-layout-text.is-mine .forward-block {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.24);
  border-left-color: rgba(255, 255, 255, 0.9);
}

.forward-head {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  color: #1877f2;
  letter-spacing: 0.2px;
}

.custom-layout-text.is-mine .forward-head {
  color: rgba(255, 255, 255, 0.92);
}

.forward-from {
  font-size: 12px;
  font-weight: 700;
  color: #050505;
  margin-top: 2px;
}

.custom-layout-text.is-mine .forward-from {
  color: rgba(255, 255, 255, 0.92);
}

.forward-preview {
  font-size: 12px;
  color: #65676b;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.custom-layout-text.is-mine .forward-preview {
  color: rgba(255, 255, 255, 0.82);
}

.reaction-summary {
  position: absolute;
  bottom: 12px;
  transform: translateY(50%);
  background: rgb(var(--v-theme-grey-100));
  // border: 1px solid #e4e6eb;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  max-width: 220px;
  z-index: 5;
}

.reaction-summary.mine {
  left: 6px;
  right: auto;
}

.reaction-summary:not(.mine) {
  right: 6px;
  left: auto;
}

.reaction-summary.active {
  border-color: rgba(8, 102, 255, 0.35);
}

.reaction-emojis {
  display: inline-flex;
  gap: 2px;
}

.reaction-count {
  color: #65676b;
  font-weight: 700;
}

.reaction-picker-card {
  border-radius: 999px;
  padding: 8px 10px;
}

.reaction-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reaction-pick {
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  padding: 4px;
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
}

.reaction-pick:hover {
  transform: translateY(-2px) scale(1.25);
  filter: saturate(1.2);
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

  .v-field {
    background: rgb(var(--v-theme-grey-50));
    opacity: 1;
  }

  .v-field__overlay {
    opacity: 0 !important;
  }

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

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
    <VCard class="h-100" style="height: 100dvh !important;">
      <VLayout class="h-100" style="height: 100dvh !important;">
        <ChatSidebar
          v-if="showSidebar"
          v-model="drawerLeft"
          v-model:search="searchGroup"
          :group-lst="groupLst"
          :active-group-id="groupInfo?.GroupID"
          :is-mobile-view="isMobile"
          :width="isMobile ? '100%' : 350"
          @open-create="openCreateGroupDialog"
          @select-group="(g) => selectGroup(g, true)"
          @logout="logoutHandler"
        />
        <VAppBar v-if="showChat" flat color="blue" class="border-b chat-app-bar" theme="dark">
          <VAppBarNavIcon
            v-if="!isMobile"
            variant="text"
            color="blue"
            @click.stop="drawerLeft = !drawerLeft"
          />
          <VBtn
            v-if="isMobile"
            icon="mdi-arrow-left"
            variant="text"
            color="white"
            @click="mobileView = 'list'"
          />

          <VToolbarTitle v-if="groupInfo" class="font-weight-bold">
            {{
              groupInfo.GroupName ? groupInfo.GroupName : groupInfo.DocumentID
            }}
          </VToolbarTitle>

          <!-- <VSpacer /> -->

          <VTooltip text="Tìm kiếm tin nhắn">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                icon="mdi-magnify"
                variant="text"
                color="white"
                @click="openSearchDialog"
              />
            </template>
          </VTooltip>

          <template v-if="$vuetify.display.mdAndUp">
            <VTooltip text="Gọi video nhóm">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon="mdi-video-outline"
                  variant="text"
                  color="blue"
                  :disabled="!groupInfo?.GroupID"
                  @click="startVideoCall"
                />
              </template>
            </VTooltip>
          </template>

          <VBtn
            icon="mdi-dots-vertical"
            variant="text"
            color="white"
            @click.stop="drawerRight = !drawerRight"
          />
        </VAppBar>

        <VMain
          v-if="showChat"
          style="display: flex; flex-direction: column; height: 100%;"
          class="position-relative"
          @dragenter="onChatDragEnter"
          @dragover.prevent="onChatDragOver"
          @dragleave="onChatDragLeave"
          @drop.prevent="onChatDrop"
        >
          <div class="d-flex flex-column h-100 flex-grow-1 w-100 position-relative" style="padding-top: env(safe-area-inset-top, 0px);">
            <div v-if="isChatDragOver" class="chat-drag-overlay">
              <div class="chat-drag-overlay__inner">
                <VIcon class="mr-2" size="small">mdi-paperclip</VIcon>
                Thả file để đính kèm
              </div>
            </div>
            <div v-if="loadingInitial" class="d-flex flex-column align-center justify-center flex-grow-1">
              <VProgressCircular indeterminate color="blue" size="48" />
              <div class="mt-2 text-grey-darken-1">Đang tải tin nhắn...</div>
            </div>
            <VList
              v-else-if="messageLst.length > 0"
              ref="chatList"
              :class="replyingTo ? 'custome-content-reply' : 'custome-content'"
              style="flex: 1 1 auto; overflow-y: auto; padding-bottom: 80px;"
              @scroll="handleScroll"
            >
            <div v-if="loadingMore" class="loading-indicator">
              <VProgressCircular indeterminate color="blue" />
            </div>

            <div v-if="pinnedBarItems.length > 0" class="pinned-bar">
              <VMenu v-model="pinnedBarMenu" location="bottom start">
                <template #activator="{ props }">
                  <div class="pinned-bar__activator" v-bind="props">
                    <VIcon size="small" color="blue" class="mr-2"
                      >mdi-pin</VIcon
                    >
                    <div class="pinned-bar__text">
                      <div class="pinned-bar__title">Tin nhắn đã ghim</div>
                      <div class="pinned-bar__preview">
                        {{ pinnedPreviewForBar(pinnedBarItems[0]) }}
                      </div>
                    </div>
                    <VSpacer />
                    <VChip
                      size="x-small"
                      color="primary"
                      variant="tonal"
                      class="ml-2"
                    >
                      {{ pinnedBarItems.length }}
                    </VChip>
                    <VIcon size="small" class="ml-1">mdi-chevron-down</VIcon>
                  </div>
                </template>

                <VCard max-width="420px" color="blue" variant="tonal">
                  <VList>
                    <VListItem
                      v-for="pin in pinnedBarItems"
                      :key="pin.MessageID"
                      @click="jumpPinnedFromBar(pin)"
                    >
                      <template #prepend>
                        <VIcon size="small">mdi-pin</VIcon>
                      </template>
                      <VListItemTitle class="text-truncate">
                        {{ pinnedPreviewForBar(pin) }}
                      </VListItemTitle>
                      <VListItemSubtitle
                        >#{{ pin.MessageID }}</VListItemSubtitle
                      >
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </div>
            <VListItem
              v-for="(mes, index) in messageLst"
              :id="'msg-' + mes.MessageID"
              :key="mes.MessageID + '-' + (mes.GroupID || '0')"
              style="padding: 0 4px 0 8px; margin-top: 4px"
              class="message-item"
            >
              <div v-if="mes.IsSystem" class="system-row">
                <div class="system-pill">
                  {{ mes.TextContentPlain || mes.TextContent || "" }}
                </div>
              </div>

              <template v-if="!mes.IsSystem && !mes.IsMine" #prepend>
                <VAvatar v-if="mes.isLatest" size="small" color="secondary">
                  <VImg v-if="mes.Avatar" :src="mes.Avatar" />
                  <VIcon v-else size="x-small"> mdi-account </VIcon>
                </VAvatar>
                <VAvatar v-else size="small" />
              </template>


              <div v-if="!mes.IsSystem">
                <div
                  v-if="
                    !mes.IsMine && index > 0
                      ? messageLst[index - 1].SenderID != mes.SenderID
                      : false
                  "
                  class="custom-layout-name"
                >
                  {{ displaySenderName(mes) }}
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
                    <VMenu
                      :model-value="activeMenuId === mes.MessageID"
                      @update:model-value="(v) => activeMenuId = v ? mes.MessageID : null"
                      :close-on-content-click="true"
                      location="top center"
                    >
                      <template #activator="{ props: menuProps }">
                        <div
                          class="message-bubble-wrap"
                          :class="{
                            mine: mes.IsMine,
                            'has-reactions':
                              reactionsEnabled &&
                              mes.Reactions &&
                              mes.Reactions.length > 0,
                          }"
                          v-bind="menuProps"
                          @touchstart="handleTouchStart(mes)"
                          @touchend="handleTouchEnd"
                          @touchmove="handleTouchEnd"
                          @click="toggleMessageMeta(mes)"
                        >
                      <!-- <div
                        v-if="isPinnedMessage(mes)"
                        class="pin-badge"
                        :class="{ mine: mes.IsMine }"
                        title="Tin nhắn đã ghim"
                      >
                        <VIcon size="x-small">mdi-pin</VIcon>
                      </div> -->
                      <div
                        v-if="mes.IsAttachment == 0"
                        :class="{
                          ' is-mine': mes.IsMine,
                        }"
                        class="custom-layout-text"
                        @dblclick="
                          reactionsEnabled && reactToMessage(mes, '👍')
                        "
                      >
                        <div
                          v-if="mes.Forward"
                          class="forward-block"
                          @click.stop="scrollToForward(mes.Forward)"
                        >
                          <div class="forward-head">
                            <VIcon size="x-small" class="mr-1"
                              >mdi-forward</VIcon
                            >
                            <span>Chuyển tiếp</span>
                          </div>
                          <div class="forward-from">
                            Từ
                            {{ mes.Forward.SenderName || mes.Forward.SenderID }}
                          </div>
                          <div class="forward-preview">
                            {{ mes.Forward.TextContent }}
                          </div>
                            <template v-if="mes.Forward.IsAttachment === 1">
                              <div class="forward-attach">
                                <VImg
                                  v-if="
                                    mes.Forward.LinkFile ||
                                    mes.Forward.MessageID
                                  "
                                  :src="
                                    mes.Forward.LinkFile ||
                                    messageFileUrlByID(mes.Forward.MessageID)
                                  "
                                  width="120"
                                  height="120"
                                  cover
                                  class="forward-thumb"
                                  @click.stop="
                                    openForwardAttachment(mes.Forward)
                                  "
                                />
                                <div v-else class="forward-attach-label">
                                  [Hình ảnh]
                                </div>
                              </div>
                            </template>
                            <template v-else-if="mes.Forward.IsAttachment > 1">
                              <div
                                class="forward-file"
                                @click.stop="openForwardAttachment(mes.Forward)"
                              >
                                <VIcon size="small" class="mr-1"
                                  >mdi-file-document-outline</VIcon
                                >
                                <span class="forward-file-name">{{
                                  mes.Forward.Text ||
                                  mes.Forward.MineFile ||
                                  "Tệp đính kèm"
                                }}</span>
                              </div>
                            </template>
                            <template v-else>
                              <div
                                v-html="buildForwardPreviewHtml(mes.Forward)"
                              />
                            </template>
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
                                mes.TextContent ||
                                mes.MineFile ||
                                "Tệp đính kèm"
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
                        @click="activeMenuId = mes.MessageID"
                      >
                        <span class="reaction-emojis">
                          {{ reactionSummary(mes).emojis.join("") }}
                        </span>
                        <span class="reaction-count">{{
                          reactionSummary(mes).total
                        }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- Unified Menu Content -->
                  <VCard class="message-action-menu-card" elevation="24">
                    <div class="reaction-picker border-b pa-2">
                      <span
                        v-for="emoji in reactionEmojis"
                        :key="emoji"
                        class="reaction-pick"
                        @click="reactToMessage(mes, emoji)"
                      >
                        {{ emoji }}
                      </span>
                    </div>
                    <VList density="compact" class="pa-0">
                      <VListItem
                        prepend-icon="mdi-reply"
                        title="Trả lời"
                        @click="setReply(mes)"
                      />
                      <VListItem
                        :prepend-icon="isPinnedMessage(mes) ? 'mdi-pin-off' : 'mdi-pin'"
                        :title="isPinnedMessage(mes) ? 'Bỏ ghim' : 'Ghim'"
                        @click="togglePinMessage(mes)"
                      />
                      <VListItem
                        prepend-icon="mdi-forward"
                        title="Chuyển tiếp"
                        @click="openForwardDialog(mes)"
                      />
                      <VListItem
                        v-if="Number(mes.IsAttachment) === 0"
                        prepend-icon="mdi-content-copy"
                        title="Sao chép"
                        @click="copyMessageText(mes)"
                      />
                    </VList>
                  </VCard>
                </VMenu>

                <div
                  v-if="shouldShowMessageMeta(mes)"
                  class="message-meta"
                  :class="{ mine: mes.IsMine }"
                >
                  <div class="message-meta-time">
                    {{ formatMessageTimeFull(mes.TimeCreate) }}
                  </div>
                  <template v-if="mes.IsMine">
                    <div class="message-meta-receipt">
                      {{ getMessageReceiptSummary(mes).statusText }}
                    </div>
                    <div
                      v-if="getMessageReceiptSummary(mes).state === 'seen'"
                      class="message-meta-seen"
                    >
                      <VAvatar
                        v-for="user in getMessageReceiptSummary(mes)
                          .seenUsers"
                        :key="`${mes.MessageID}_seen_${user.userID}`"
                        size="16"
                        class="message-meta-seen-avatar"
                        :title="user.tooltip"
                      >
                        <VImg v-if="user.avatar" :src="user.avatar" />
                        <span v-else class="message-meta-seen-fallback">
                          {{ user.initial }}
                        </span>
                      </VAvatar>
                      <span
                        v-if="getMessageReceiptSummary(mes).moreCount > 0"
                        class="message-meta-seen-more"
                      >
                        +{{ getMessageReceiptSummary(mes).moreCount }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>
              </div>
            </div>
          </VListItem>
        </VList>
          <div v-else-if="!loadingInitial" class="d-flex flex-column align-center justify-center flex-grow-1 text-grey-darken-1" style="min-height: 200px">
            <VIcon color="blue" size="48" class="mb-2"> mdi-forum-outline </VIcon>
            <div class="text-body-1">Hãy bắt đầu cuộc trò chuyện</div>
            <div class="text-caption mt-1" v-if="!groupInfo">Chọn một đoạn chat để bắt đầu</div>
            <VBtn v-if="groupInfo" variant="text" color="blue" class="mt-4" prepend-icon="mdi-refresh" @click="getMessageByGoupID">
              Tải lại tin nhắn
            </VBtn>
          </div>

          <div
            class="position-absolute bottom-0 bg-white border-t d-flex flex-column composer-bar"
            ref="composerBar"
            :style="{
              left: drawerLeft ? '300px' : '0',
              right: drawerRight ? '300px' : '0',
            }"
          >
            <div v-if="typingLabel" class="px-4 typing-indicator">
              <div class="typing-pill">
                <div class="typing-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div class="typing-text">
                  {{ typingLabel }}
                </div>
              </div>
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
                    {{ displaySenderName(replyingTo) }}
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
                    <img
                      :src="att.previewUrl"
                      :alt="att.name"
                      title="Click để xem / zoom"
                      @click="openPreviewZoom(att)"
                    />
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
          </div>
        </VMain>

        <VNavigationDrawer
          v-model="drawerRight"
          :width="300"
          class="py-4"
          location="right"
        >
          <RightChat
            :group-info="groupInfo"
            @group-left="onGroupLeft"
            @group-deleted="onGroupDeleted"
            @group-mute="onGroupMute"
            @members-updated="onMembersUpdated"
            @jump-message="onJumpMessage"
          />
        </VNavigationDrawer>
      </VLayout>
    </VCard>
    <ChatImageDialog v-model="showImageDialog" :src="selectedImage" />
    <ChatSearchDialog
      v-model="showSearchDialog"
      v-model:query="searchQuery"
      :results="searchResults"
      :loading="isSearching"
      :is-mobile="isMobile"
      @search="searchMessages"
      @jump="jumpToSearchMessage"
    />
    <ChatForwardDialog
      v-model="showForwardDialog"
      v-model:comment="forwardComment"
      v-model:search="forwardSearch"
      :suggestions="forwardGroupSuggestions"
      @forward="forwardToGroup"
      @close="closeForwardDialog"
    />
    <VDialog v-model="previewZoomDialog" max-width="920px">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <span class="text-truncate">{{ previewZoomName }} 224</span>
          <VSpacer />
          <VBtn
            icon
            size="x-small"
            variant="text"
            @click="previewZoomDialog = false"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VCardTitle>
        <VCardText>
          <div class="preview-zoom-stage" @wheel.prevent="onPreviewWheel">
            <img
              v-if="previewZoomSrc"
              class="preview-zoom-img"
              :src="previewZoomSrc"
              :style="{ transform: `scale(${previewZoomScale})` }"
              alt=""
            />
          </div>
          <div class="d-flex align-center mt-3">
            <VBtn
              icon
              size="small"
              variant="text"
              @click="setPreviewZoom(previewZoomScale - 0.25)"
            >
              <VIcon>mdi-minus</VIcon>
            </VBtn>
            <VSlider
              v-model="previewZoomScale"
              :min="0.5"
              :max="4"
              :step="0.05"
              hide-details
              class="mx-2"
            />
            <VBtn
              icon
              size="small"
              variant="text"
              @click="setPreviewZoom(previewZoomScale + 0.25)"
            >
              <VIcon>mdi-plus</VIcon>
            </VBtn>
            <VChip size="small" class="ml-2" variant="tonal">
              {{ Math.round(previewZoomScale * 100) }}%
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
    <ChatCreateGroupDialog
      v-model="showCreateGroupDialog"
      v-model:search-user="searchUser"
      :selected-users="selectedUsers"
      :desserts="desserts"
      :loading="loading"
      :max-members="maxGroupMembers"
      @remove-user="removeUser"
      @toggle-user="toggleUser"
      @scroll="onScroll"
      @search-change="onSearchChange"
      @create="createNewChatGroup"
    />

    <VDialog v-model="incomingCallDialog" max-width="380">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon class="mr-2" color="blue">mdi-video-outline</VIcon>
          Cuộc gọi video nhóm
        </VCardTitle>
        <VCardText>
          {{ incomingCallText }}
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="declineIncomingCall">Từ chối</VBtn>
          <VBtn color="blue" @click="acceptIncomingCall">Tham gia</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
  <VideoCall
    v-if="isCalling"
    :group-id="groupInfo?.GroupID"
    :current-user-id="senderID"
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
  GetPinnedMessages,
  GetReactionsByMessageIDs,
  PinMessage,
  ReactMessage,
  ReadMessage,
  SendMessage,
  urlUploadMessageFile,
} from "@/api/messageApi";
import { GetUserLstAll } from "@/api/user";
import { formatDateDisplay } from "@/helpers/getTime";
import socket from "@/socket";
import { getAvatar, getToken, getUserName } from "@/utils/auth";
import { notify } from "@kyvg/vue3-notification";
import Axios from "axios";
import ChatCreateGroupDialog from "./components/ChatCreateGroupDialog.vue";
import ChatForwardDialog from "./components/ChatForwardDialog.vue";
import ChatImageDialog from "./components/ChatImageDialog.vue";
import ChatSearchDialog from "./components/ChatSearchDialog.vue";
import ChatSidebar from "./components/ChatSidebar.vue";
import RightChat from "./components/right-chat.vue";
import VideoCall from "./components/VideoCall.vue";

const MAX_GROUP_MEMBERS = 50;

export default {
  name: "App",
  components: {
    ChatSidebar,
    ChatImageDialog,
    ChatSearchDialog,
    ChatForwardDialog,
    ChatCreateGroupDialog,
    RightChat,
    VideoCall,
  },
  data() {
    return {
      mobileView: "list",
      isCalling: false,
      drawerLeft: true,
      drawerRight: false,
      activeMenuId: null,
      touchTimer: null,
      currentGroupID: null,
      joinedGroupID: null,
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
      messagesAllLoaded: false,
      loadingInitial: false,
      searchGroup: "",
      showSearchDialog: false,
      searchResults: [],
      searchQuery: "",
      isSearching: false,
      showCreateGroupDialog: false,
      newGroupName: "",
      selectedUsers: [],
      maxGroupMembers: MAX_GROUP_MEMBERS,
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
      // drag-drop
      chatDragDepth: 0,
      isChatDragOver: false,
      // composer preview zoom
      previewZoomDialog: false,
      previewZoomSrc: "",
      previewZoomName: "",
      previewZoomScale: 1,

      // mentions
      memberLst: [],
      userNameCache: {},
      pendingMentions: [],
      pendingMentionAll: false,
      showMentionPicker: false,
      mentionQuery: "",
      mentionAtIndex: null,
      mentionActiveIndex: 0,

      // reactions
      reactionsEnabled: true, // Ép bật hiển thị React trên giao diện
      reactionMenuFor: null,
      reactionEmojis: ["👍", "❤️", "😂", "😮", "😢", "😡", "😆", "👏"],

      // pins
      pinnedMessageIDs: [],
      pinnedMessages: [],
      pinnedBarMenu: false,

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
      // click message to show meta
      activeMessageMetaID: null,
      // read/received state of each member in current group
      memberReadMap: {},
      incomingCallDialog: false,
      incomingCall: null,
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
        ? `${prefix} và ${more} người khác đang nhập`
        : `${prefix} đang nhập`;
    },
    pinnedBarItems() {
      const ids = (this.pinnedMessageIDs || [])
        .map((x) => Number(x))
        .filter((x) => Number.isFinite(x) && x > 0);
      if (!ids.length) return [];

      const map = new Map();
      (this.pinnedMessages || []).forEach((m) => {
        const id = Number(m?.MessageID);
        if (Number.isFinite(id) && id > 0) map.set(id, m);
      });
      (this.messageLst || []).forEach((m) => {
        const id = Number(m?.MessageID);
        if (Number.isFinite(id) && id > 0 && !map.has(id)) map.set(id, m);
      });

      return ids
        .map((id) => map.get(id))
        .filter(Boolean)
        .slice(0, 50);
    },
    incomingCallText() {
      const caller =
        String(
          this.incomingCall?.CallerName || this.incomingCall?.CallerID || "",
        ).trim() || "Một thành viên";
      return `${caller} đang gọi video nhóm. Bạn có muốn tham gia không?`;
    },
    isMobile() {
      return this.$vuetify ? !this.$vuetify.display.mdAndUp : window.innerWidth < 960;
    },
    showSidebar() {
      return !this.isMobile || this.mobileView === "list";
    },
    showChat() {
      return !this.isMobile || this.mobileView === "chat";
    },
  },
  watch: {
    mobileView(val) {
      if (this.isMobile) {
        this.drawerLeft = val === "list";
      }
    },
    isMobile(val) {
      if (val) {
        this.drawerLeft = this.mobileView === "list";
      } else {
        this.drawerLeft = true;
      }
    },
    searchGroup() {
      this.getGroupLstByUserID();
    },
    "$route.query.gid"(next) {
      const gid = Number(next);
      if (!Number.isFinite(gid) || gid <= 0) return;
      this.getGroupLstByUserID(gid);
    },
  },
  created() {
    const gid = Number(this.$route?.query?.gid);
    this.getGroupLstByUserID(Number.isFinite(gid) && gid > 0 ? gid : null);
    socket.emit("join:user", { UserID: this.senderID });
    socket.on("new_message", (message) => {
      console.log("chạy vào đây", message);

      if (Number(message.GroupID) !== Number(this.groupInfo?.GroupID)) return;
      this.markAsRead(message.GroupID);

      this.messageLst.push(this.decorateMessageForUI(message));

      this.messageLst = this.markLatestMessages(this.messageLst);
      this.applyReplyPreview();
      this.fetchReactionsForMessages([message.MessageID]);
      this.scrollBottom();
    });

    socket.on("sidebar:update", (data) => {
      const { GroupID, LastMessage, TimeCreate } = data;
      const gid = Number(GroupID);
      const groupIndex = (this.groupLst || []).findIndex((g) => Number(g.GroupID) === gid);

      // 1. Tìm index của group này trong mảng danh sách chat hiện tại
      if (groupIndex !== -1) {
        // Lấy đối tượng group ra
        const updatedGroup = this.groupLst[groupIndex];

        // 2. Cập nhật thông tin mới nhất
        updatedGroup.NewMessage = this.extractPreviewFromStoredText(LastMessage);
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

        this.maybeNotifyNewMessage(updatedGroup, LastMessage);
        this.broadcastUnreadTotal();
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
        this.maybeNotifyNewMessage({ GroupID }, LastMessage);
        this.broadcastUnreadTotal();
      }
    });

    socket.on("group:update", (group) => {
      if (!group?.GroupID) return;
      const gid = Number(group.GroupID);
      const idx = (this.groupLst || []).findIndex(
        (g) => Number(g.GroupID) === gid,
      );
      if (idx >= 0) {
        this.groupLst.splice(idx, 1, { ...this.groupLst[idx], ...group });
      }
      if (Number(this.groupInfo?.GroupID) === gid) {
        Object.assign(this.groupInfo, group);
      }
    });

    socket.on("group:deleted", ({ GroupID }) => {
      this.onGroupDeleted({ GroupID });
    });

    socket.on("group:left", ({ GroupID }) => {
      this.onGroupLeft({ GroupID });
    });

    socket.on("group:forbidden", ({ GroupID }) => {
      this.onGroupLeft({ GroupID });
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

    socket.on("pin:update", (payload) => {
      const gid = Number(payload?.GroupID);
      const mid = Number(payload?.MessageID);
      if (!Number.isFinite(gid) || !Number.isFinite(mid)) return;
      if (Number(this.groupInfo?.GroupID) !== gid) return;

      const next = new Set(this.pinnedMessageIDs || []);
      if (payload?.Pinned) next.add(mid);
      else next.delete(mid);
      this.pinnedMessageIDs = [...next];
      this.fetchPinnedForGroup();
    });

    socket.on("group:new", (group) => {
      const gid = Number(group?.GroupID);
      if (!Number.isFinite(gid) || gid <= 0) return;
      const exists = (this.groupLst || []).some(
        (g) => Number(g.GroupID) === gid,
      );
      if (!exists) {
        this.groupLst.unshift({
          ...group,
          UnreadCount: 0,
          TimeShow: group?.TimeCreate
            ? this.calculateTimeDifference(group.TimeCreate)
            : "",
        });
      }
    });

    socket.on("group:mute", ({ GroupID, IsMute }) => {
      const gid = Number(GroupID);
      if (!Number.isFinite(gid)) return;
      const mute = Number(IsMute) === 1 ? 1 : 0;
      const idx = (this.groupLst || []).findIndex(
        (g) => Number(g.GroupID) === gid,
      );
      if (idx >= 0) {
        this.groupLst.splice(idx, 1, { ...this.groupLst[idx], IsMute: mute });
      }
      if (Number(this.groupInfo?.GroupID) === gid && this.groupInfo) {
        this.groupInfo.IsMute = mute;
      }
      this.persistGroupMuteToLocalStorage(gid, mute);
    });

    socket.on("mention", (payload) => {
      if (!payload) return;
      notify({
        title: "Bạn được nhắc",
        text: payload.Preview || "Bạn được nhắc trong một tin nhắn",
        type: "info",
      });
    });

    socket.on("seen", ({ GroupID, UserName, TimeSeen }) => {
      const gid = Number(GroupID);
      if (!Number.isFinite(gid) || Number(this.groupInfo?.GroupID) !== gid)
        return;
      const uid = (UserName || "").toString().trim();
      if (!uid || uid === String(this.senderID || "").trim()) return;

      const maxMessageID = (this.messageLst || []).reduce((max, msg) => {
        const id = Number(msg?.MessageID);
        return Number.isFinite(id) && id > max ? id : max;
      }, 0);

      const prev = this.memberReadMap?.[uid] || {};
      this.memberReadMap = {
        ...(this.memberReadMap || {}),
        [uid]: {
          ...prev,
          lastMessageID: Math.max(
            Number(prev.lastMessageID) || 0,
            maxMessageID,
          ),
          timeSeen: TimeSeen || new Date().toISOString(),
        },
      };
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

    socket.on("call:incoming", (payload) => {
      const gid = Number(payload?.GroupID);
      if (!Number.isFinite(gid) || gid <= 0) return;
      const callerID = String(payload?.CallerID || "").trim();
      if (!callerID || callerID === String(this.senderID || "").trim()) return;
      if (this.isCalling) return;

      const callerName = payload?.CallerName || callerID;
      notify({
        type: "info",
        title: "Cuộc gọi nhóm",
        text: `${callerName} đang gọi video`,
      });

      this.incomingCall = {
        GroupID: gid,
        CallerID: callerID,
        CallerName: callerName,
      };
      this.incomingCallDialog = true;
    });

    socket.on("call:accepted", (payload) => {
      const gid = Number(payload?.GroupID);
      if (!Number.isFinite(gid) || gid <= 0) return;
      if (Number(this.groupInfo?.GroupID) !== gid && !this.isCalling) return;
      const uid = String(payload?.UserID || "").trim();
      if (!uid) return;
      notify({
        type: "info",
        title: "Cuộc gọi nhóm",
        text: `${uid} đã tham gia cuộc gọi`,
      });
    });

    socket.on("call:declined", (payload) => {
      const gid = Number(payload?.GroupID);
      if (!Number.isFinite(gid) || gid <= 0) return;
      if (Number(this.groupInfo?.GroupID) !== gid && !this.isCalling) return;
      const uid = String(payload?.UserID || "").trim();
      if (!uid) return;
      notify({
        type: "warning",
        title: "Cuộc gọi nhóm",
        text: `${uid} đã từ chối cuộc gọi`,
      });
    });
  },
  mounted() {
    const gid = Number(this.$route?.query?.gid);
    if (this.isMobile) {
      this.mobileView = (Number.isFinite(gid) && gid > 0) ? "chat" : "list";
      this.drawerLeft = this.mobileView === "list";
    }
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
    escapeRegExp(input) {
      return (input ?? "").toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
    loadMuteMap() {
      try {
        const raw = localStorage.getItem("dtp_chat_mute_groups");
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (_) {
        return {};
      }
    },
    saveMuteMap(map) {
      try {
        localStorage.setItem(
          "dtp_chat_mute_groups",
          JSON.stringify(map && typeof map === "object" ? map : {}),
        );
      } catch (_) {
        // ignore
      }
    },
    persistGroupMuteToLocalStorage(groupID, isMute) {
      const gid = Number(groupID);
      if (!Number.isFinite(gid) || gid <= 0) return;
      const mute = Number(isMute) === 1 ? 1 : 0;
      const map = this.loadMuteMap();
      if (mute === 1) map[String(gid)] = 1;
      else delete map[String(gid)];
      this.saveMuteMap(map);
    },
    parseRichStoredText(stored) {
      if (stored && typeof stored === "object" && Number(stored.v) === 1) return stored;
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
    humanizeSystemText(text, item) {
      const raw = (text ?? "").toString();
      if (!raw) return raw;

      const mapping = new Map();
      const add = (id, name) => {
        const key = (id ?? "").toString().trim();
        const val = (name ?? "").toString().trim();
        if (!key || !val) return;
        if (!mapping.has(key)) mapping.set(key, val);
      };

      if (item?.SenderID && String(item.SenderID) === String(this.senderID)) {
        add(item?.SenderID, "Bạn");
      } else {
        add(item?.SenderID, item?.NickName || item?.FullName);
      }

      const members = Array.isArray(this.memberLst) ? this.memberLst : [];
      members.forEach((m) => {
        add(m?.UserID || m?.UserName, m?.NickName || m?.FullName);
      });

      const cache =
        this.userNameCache && typeof this.userNameCache === "object"
          ? this.userNameCache
          : {};
      Object.keys(cache).forEach((id) => add(id, cache[id]));

      let out = raw;
      [...mapping.entries()]
        .sort((a, b) => b[0].length - a[0].length)
        .forEach(([id, name]) => {
          const re = new RegExp(`\\b${this.escapeRegExp(id)}\\b`, "g");
          out = out.replace(re, name);
        });

      return out;
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

      try {
        const sid = (item?.SenderID ?? "").toString().trim();
        const sname = (item?.NickName || item?.FullName || "")
          .toString()
          .trim();
        if (sid && sname) this.userNameCache[sid] = sname;
      } catch (_) {
        // ignore
      }

      const rich = this.parseRichStoredText(item.TextContent);
      const isSystem = rich && (rich.type === "system" || rich.system);
      const textPlain =
        rich && typeof rich.text === "string"
          ? rich.text
          : (item.TextContent ?? "");
      const displayText = isSystem
        ? this.humanizeSystemText(textPlain, item)
        : textPlain;
      const textHtml = this.buildMessageHtmlFromText(displayText, rich);
      const forward =
        rich && rich.forward && typeof rich.forward === "object"
          ? rich.forward
          : null;

      return {
        ...item,
        IsMine: item.SenderID === this.senderID,
        IsSystem: Boolean(isSystem),
        LastName: lastName,
        TextContentPlain: displayText,
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
        // this.reactionsEnabled = false;
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
        // this.reactionsEnabled = false;
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
      // Forward của forward: dùng content gốc thay vì chỉ comment
      const base =
        original?.Forward && typeof original.Forward === "object"
          ? original.Forward
          : original;

      const baseText =
        (base?.TextContentPlain ??
          base?.TextContent ??
          base?.Text ??
          base?.MineFile ??
          original?.TextContentPlain ??
          original?.TextContent ??
          "") + "";

      const baseMineFile =
        (base?.MineFile ??
          base?.TextContent ??
          base?.Text ??
          original?.MineFile ??
          "") + "";

      const forward = {
        MessageID: base?.MessageID ?? original.MessageID,
        GroupID: base?.GroupID ?? original.GroupID ?? null,
        SenderID: base?.SenderID ?? original.SenderID ?? null,
        SenderName:
          base?.SenderName ||
          base?.NickName ||
          base?.FullName ||
          base?.LastName ||
          original.NickName ||
          original.FullName ||
          original.LastName ||
          null,
        Text: baseText.trim() ? baseText : null,
        IsAttachment: base?.IsAttachment ?? original.IsAttachment ?? null,
        MineFile: baseMineFile.trim() ? baseMineFile : null,
        LinkFile: base?.LinkFile ?? original.LinkFile ?? null,
        TimeCreate: base?.TimeCreate ?? original.TimeCreate ?? null,
      };

      const text = (this.forwardComment || "").toString();
      const rich = { v: 1, text, mentions: [], mentionAll: false, forward };

      const originalPreview = (() => {
        if (Number(base?.IsAttachment || original?.IsAttachment) > 0) {
          const kind =
            base?.AttachmentKind ||
            original.AttachmentKind ||
            this.getAttachmentKind(base) ||
            this.getAttachmentKind(original) ||
            "file";
          if (kind === "image") return "[Hình ảnh]";
          const name =
            (base?.MineFile ||
              base?.TextContent ||
              base?.Text ||
              original?.MineFile ||
              original?.TextContent ||
              original?.TextContentPlain ||
              "") + "";
          return `[Tệp] ${name}`.trim();
        }
        return (
          base?.TextContentPlain ??
          base?.TextContent ??
          base?.Text ??
          original?.TextContentPlain ??
          original?.TextContent ??
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
    async ensureMessageVisible(messageID) {
      const id = Number(messageID);
      if (!Number.isFinite(id) || id <= 0) return false;

      // thử ngay
      if (document.getElementById(`msg-${id}`)) return true;

      // load thêm các trang cũ cho tới khi thấy message hoặc hết
      for (let i = 0; i < 25; i++) {
        if (this.messagesAllLoaded) break;
        const loaded = await this.loadMoreMessagesAsync();
        await this.$nextTick();
        if (!loaded) break;
        if (document.getElementById(`msg-${id}`)) return true;
      }

      return Boolean(document.getElementById(`msg-${id}`));
    },
    async jumpToSearchMessage(message) {
      const id = message?.MessageID;
      this.showSearchDialog = false;
      const ok = await this.ensureMessageVisible(id);
      if (!ok) {
        notify({
          title: "Không tìm thấy",
          text: "Tin nhắn quá cũ hoặc đã bị xoá",
          type: "error",
        });
        return;
      }
      this.scrollToMessage(id);
    },
    async scrollToForward(forward) {
      const messageID = Number(forward?.MessageID);
      const groupID = Number(forward?.GroupID);
      if (!Number.isFinite(messageID) || messageID <= 0) return;
      if (Number.isFinite(groupID) && this.groupInfo?.GroupID != null) {
        if (Number(this.groupInfo.GroupID) !== groupID) return;
      }
      await this.ensureMessageVisible(messageID);
      this.scrollToMessage(messageID);
    },
    openForwardAttachment(forward) {
      const linkRaw =
        typeof forward?.LinkFile === "string" ? forward.LinkFile : "";
      const messageID = Number(forward?.MessageID);
      const link =
        linkRaw ||
        (Number.isFinite(messageID) && messageID > 0
          ? this.messageFileUrlByID(messageID)
          : "");
      const attach = Number(forward?.IsAttachment || 0);

      if (attach === 1 && link) {
        this.selectedImage = link;
        this.showImageDialog = true;
        return;
      }
      if (attach > 1 && link) {
        window.open(link, "_blank");
        return;
      }

      // fallback: cuộn về tin gốc nếu có
      this.scrollToForward(forward);
    },
    messageFileUrlByID(messageID) {
      const id = Number(messageID);
      if (!Number.isFinite(id) || id <= 0) return "";
      const token = getToken();
      const user = getUserName();
      if (!token || !user) return "";
      return `https://sop.idtp.work/api/File/GetMessageFile?MessageID=${id}&Token=${token}&UserName=${user}`;
    },
    buildForwardPreviewHtml(forward) {
      const text = (forward?.Text || forward?.MineFile || "").toString();
      return this.buildMessageHtmlFromText(text, null);
    },
    displaySenderName(mes) {
      const senderID = (mes?.SenderID || "").toString().trim();
      if (!senderID)
        return mes?.NickName || mes?.LastName || mes?.FullName || "";

      const members = Array.isArray(this.memberLst) ? this.memberLst : [];
      const found = members.find(
        (m) => String(m?.UserID || m?.UserName || "").trim() === senderID,
      );
      // Nickname có thể có nhiều từ: phải hiển thị nguyên văn (không cắt còn 1 từ)
      const nick =
        (found?.NickName && String(found.NickName).trim()) ||
        (mes?.NickName && String(mes.NickName).trim()) ||
        "";
      if (nick) return nick;

      const name =
        (found?.FullName && String(found.FullName).trim()) ||
        (this.userNameCache?.[senderID] || "").toString().trim() ||
        (mes?.FullName || "").toString().trim() ||
        "";

      if (!name) return mes?.LastName || senderID;

      // Giữ UI gọn: nếu không có nickname thì lấy 1 từ cuối của tên
      const parts = name.split(" ").filter(Boolean);
      return parts.length ? parts[parts.length - 1] : name;
    },
    async copyMessageText(mes) {
      try {
        const text = (mes?.TextContentPlain ?? mes?.TextContent ?? "")
          .toString()
          .trim();
        if (!text) return;
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          notify({ type: "success", title: "Đã sao chép" });
          return;
        }
      } catch (_) {
        // ignore
      }
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
            this.broadcastUnreadTotal();

            // Tùy chọn: Gửi socket nếu server cần đồng bộ các tab khác
            // socket.emit("read_message", params);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi đọc tin nhắn:", err);
        });
    },
    async maybeNotifyNewMessage(group, preview) {
      try {
        const gid = Number(group?.GroupID);
        if (!Number.isFinite(gid)) return;
        if (Number(this.groupInfo?.GroupID) === gid) return;
        if (Number(group?.IsMute) === 1) return;

        if (typeof window === "undefined" || !("Notification" in window))
          return;

        // Chỉ notify khi tab không active để đỡ spam
        if (document?.visibilityState === "visible") return;

        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
        if (Notification.permission !== "granted") return;

        const title =
          group?.GroupName || group?.DocumentID || `Nhóm ${group?.GroupID}`;
        const body = (preview || "").toString();
        new Notification(title, { body });
      } catch (_) {
        // ignore
      }
    },
    isPinnedMessage(mes) {
      const id = Number(mes?.MessageID);
      if (!Number.isFinite(id)) return false;
      return (this.pinnedMessageIDs || []).some((x) => Number(x) === id);
    },
    async fetchPinnedForGroup() {
      if (!this.groupInfo?.GroupID) return;
      try {
        const res = await GetPinnedMessages({
          GroupID: this.groupInfo.GroupID,
        });
        if (res?.RespCode === 0) {
          const list = Array.isArray(res.Data) ? res.Data : [];
          this.pinnedMessages = list;
          this.pinnedMessageIDs = list
            .map((r) => Number(r?.MessageID))
            .filter((x) => Number.isFinite(x) && x > 0);
        }
      } catch (_) {
        // ignore
      }
    },
    pinnedPreviewForBar(pin) {
      const attach = Number(pin?.IsAttachment || 0);
      if (attach === 1) return "[Hình ảnh]";
      if (attach > 1) {
        const name = (pin?.MineFile || pin?.Text || "").toString().trim();
        return name ? `[Tệp] ${name}` : "[Tệp đính kèm]";
      }

      const stored = (
        pin?.TextContentPlain ??
        pin?.TextContent ??
        ""
      ).toString();
      const rich = this.parseRichStoredText(stored);
      const text =
        (rich && typeof rich.text === "string" ? rich.text : null) ?? stored;
      const plain = (text || "").toString().replace(/\s+/g, " ").trim();
      return plain.length > 80 ? `${plain.slice(0, 77)}...` : plain;
    },
    async jumpPinnedFromBar(pin) {
      this.pinnedBarMenu = false;
      const id = Number(pin?.MessageID);
      if (!Number.isFinite(id) || id <= 0) return;
      await this.jumpToSearchMessage({ MessageID: id });
    },
    async togglePinMessage(mes) {
      if (!mes?.MessageID) return;
      const id = Number(mes.MessageID);
      if (!Number.isFinite(id)) return;

      try {
        const pin = this.isPinnedMessage(mes) ? 0 : 1;
        const res = await PinMessage({ Data: { MessageID: id, Pin: pin } });
        if (res?.RespCode === 0 && res?.Data) {
          const next = new Set(this.pinnedMessageIDs || []);
          if (res.Data.Pinned) next.add(id);
          else next.delete(id);
          this.pinnedMessageIDs = [...next];
          this.fetchPinnedForGroup();
        }
      } catch (_) {
        // ignore
      }
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
        if ((this.selectedUsers || []).length >= this.maxGroupMembers) {
          notify({
            title: "Vượt giới hạn",
            text: `Nhóm chat tối đa ${this.maxGroupMembers} thành viên`,
            type: "warning",
          });
          return;
        }
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
    startVideoCall() {
      const gid = Number(this.groupInfo?.GroupID);
      if (!Number.isFinite(gid) || gid <= 0) return;
      const callerName =
        this.userNameCache?.[this.senderID] ||
        this.memberDisplayName(
          (this.memberLst || []).find(
            (m) =>
              String(m?.UserID || m?.UserName || "").trim() ===
              String(this.senderID || "").trim(),
          ),
        ) ||
        this.senderID;

      socket.emit("call:start", {
        GroupID: gid,
        UserID: this.senderID,
        CallerName: callerName,
      });
      this.isCalling = true;
    },
    async acceptIncomingCall() {
      const incoming = this.incomingCall || {};
      const gid = Number(incoming.GroupID);
      if (!Number.isFinite(gid) || gid <= 0) return;

      const targetGroup = (this.groupLst || []).find(
        (g) => Number(g?.GroupID) === gid,
      );
      if (targetGroup) this.selectGroup(targetGroup);
      else this.getGroupLstByUserID(gid);

      socket.emit("call:accept", {
        GroupID: gid,
        CallerID: incoming.CallerID,
        UserID: this.senderID,
      });

      this.incomingCallDialog = false;
      this.incomingCall = null;
      this.isCalling = true;
    },
    declineIncomingCall() {
      const incoming = this.incomingCall || {};
      const gid = Number(incoming.GroupID);
      if (Number.isFinite(gid) && gid > 0) {
        socket.emit("call:decline", {
          GroupID: gid,
          CallerID: incoming.CallerID,
          UserID: this.senderID,
        });
      }
      this.incomingCallDialog = false;
      this.incomingCall = null;
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

      // giống Messenger: chọn ảnh/file → đưa vào thanh preview, bấm Send để gửi
      this.queuePendingAttachments(files);
    },
    isFileDragEvent(event) {
      const dt = event?.dataTransfer;
      if (!dt) return false;
      const types = Array.from(dt.types || []);
      return types.includes("Files");
    },
    onChatDragEnter(event) {
      if (!this.isFileDragEvent(event)) return;
      this.chatDragDepth += 1;
      this.isChatDragOver = true;
    },
    onChatDragOver(event) {
      if (!this.isFileDragEvent(event)) return;
      if (event?.dataTransfer) event.dataTransfer.dropEffect = "copy";
      this.isChatDragOver = true;
    },
    onChatDragLeave(event) {
      if (!this.isFileDragEvent(event)) return;
      this.chatDragDepth = Math.max(0, this.chatDragDepth - 1);
      if (this.chatDragDepth === 0) this.isChatDragOver = false;
    },
    onChatDrop(event) {
      if (!this.isFileDragEvent(event)) return;
      this.chatDragDepth = 0;
      this.isChatDragOver = false;
      if (!this.groupInfo?.GroupID) return;

      const files = Array.from(event?.dataTransfer?.files || []).filter(
        Boolean,
      );
      if (!files.length) return;
      this.queuePendingAttachments(files);
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
        const maxBytes = 25 * 1024 * 1024;
        const size = Number(file?.size) || 0;
        if (size > maxBytes) {
          notify({
            title: "File quá lớn",
            text: `${file?.name || "Tệp"} vượt quá 25MB`,
            type: "error",
          });
          return;
        }
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
      const maxBytes = 25 * 1024 * 1024;
      if (Number(sizeFile) > maxBytes) {
        notify({
          title: "File quá lớn",
          text: `${file?.name || "Tệp"} vượt quá 25MB`,
          type: "error",
        });
        return false;
      }
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
        if (err?.response?.status === 403) {
          this.onGroupLeft({ GroupID: this.groupInfo?.GroupID });
          return;
        }
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
    getGroupLstByUserID(selectGroupID = null) {
      const preferID = Number(selectGroupID);
      GetGroupLstByUserID({
        PageNumber: 1,
        RowspPage: Number.isFinite(preferID) && preferID > 0 ? 200 : 10,
        Search: this.searchGroup,
        ComID: "",
        UserID: this.senderID,
      }).then((res) => {
        if (res.RespCode == 0) {
          const currentID = Number(this.groupInfo?.GroupID);
          this.groupLst = res.Data.map((item) => {
            return {
              ...item,
              LastMessage: this.extractPreviewFromStoredText(item.LastMessage),
              NewMessage: this.extractPreviewFromStoredText(item.NewMessage),
              TimeShow: this.calculateTimeDifference(item.TimeCreate),
              UnreadCount: Number(item.UnreadCount) || 0,
            };
          });
          try {
            const map = this.loadMuteMap();
            (this.groupLst || []).forEach((g) => {
              const gid = Number(g?.GroupID);
              if (!Number.isFinite(gid) || gid <= 0) return;
              if (Number(g?.IsMute) === 1) map[String(gid)] = 1;
              else delete map[String(gid)];
            });
            this.saveMuteMap(map);
          } catch (_) {
            // ignore
          }
          this.broadcastUnreadTotal();

          if (this.groupLst.length === 0) {
            this.selectGroup(null);
            return;
          }

          if (Number.isFinite(preferID) && preferID > 0) {
            const preferred = this.groupLst.find(
              (g) => Number(g.GroupID) === preferID,
            );
            if (preferred) {
              this.selectGroup(preferred);
              return;
            }
          }

          if (Number.isFinite(currentID) && currentID > 0) {
            const match = this.groupLst.find(
              (g) => Number(g.GroupID) === currentID,
            );
            if (match && this.groupInfo) {
              Object.assign(this.groupInfo, match);
              return;
            }
          }

          this.selectGroup(this.groupLst[0]);
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
    selectGroup(groupInfo, fromUser = false) {
      const newGroupID = groupInfo?.GroupID ?? null;
      const isSameGroup = Number(this.groupInfo?.GroupID) === Number(newGroupID);
      
      // Xóa ngay lập tức danh sách tin nhắn cũ để không bị hiển thị nhầm (chờ watcher chạy thì DOM đã render)
      if (!isSameGroup) {
        this.messageLst = [];
        this.loadingInitial = !!newGroupID;
        this.typingUsers = {};
        this.loadingMore = false;
        this.messagesAllLoaded = false;
        this.currentPage = 1;
        this.pinnedMessageIDs = [];
        this.pinnedMessages = [];
        this.memberReadMap = {};
        this.activeMessageMetaID = null;

        if (this.joinedGroupID != null && Number(this.joinedGroupID) !== Number(newGroupID)) {
          socket.emit("leave:group", { GroupID: this.joinedGroupID });
          this.joinedGroupID = null;
        }
      }

      this.groupInfo = groupInfo;
      this.currentGroupID = newGroupID;
      if (this.isMobile && newGroupID && fromUser) {
        this.mobileView = "chat";
      }
      this.newMessage = "";
      this.replyingTo = null;
      this.pendingMentions = [];
      this.pendingMentionAll = false;
      this.showMentionPicker = false;
      this.clearPendingAttachments();

      if (newGroupID) {
        this.markAsRead(newGroupID);
        this.getMessageByGoupID();
        this.getMemberLstByGroupID();

        if (!isSameGroup) {
          socket.emit("join:group", { GroupID: newGroupID, UserID: this.senderID });
          this.joinedGroupID = newGroupID;
        }
      }
    },
    logoutHandler() {
      localStorage.clear(); 
      this.$router.push("/dang-nhap");
    },
    broadcastUnreadTotal() {
      try {
        const total = (this.groupLst || []).reduce((sum, g) => {
          return sum + (Number(g?.UnreadCount) || 0);
        }, 0);
        localStorage.setItem("DTP_UNREAD_TOTAL", String(total));
        window.dispatchEvent(
          new CustomEvent("dtp:unread-total", { detail: { total } }),
        );
      } catch (_) {
        // ignore
      }
    },
    openPreviewZoom(att) {
      if (!att?.isImage || !att?.previewUrl) return;
      this.previewZoomSrc = att.previewUrl;
      this.previewZoomName = att.name || "Ảnh";
      this.previewZoomScale = 1;
      this.previewZoomDialog = true;
    },
    setPreviewZoom(next) {
      const n = Number(next);
      if (!Number.isFinite(n)) return;
      this.previewZoomScale = Math.min(4, Math.max(0.5, n));
    },
    onPreviewWheel(event) {
      const delta = Number(event?.deltaY) || 0;
      const step = delta > 0 ? -0.1 : 0.1;
      this.setPreviewZoom(this.previewZoomScale + step);
    },
    onGroupLeft({ GroupID }) {
      const gid = Number(GroupID);
      if (Number.isFinite(gid)) {
        socket.emit("leave:group", { GroupID: gid });
        this.groupLst = (this.groupLst || []).filter(
          (g) => Number(g.GroupID) !== gid,
        );
        if (Number(this.groupInfo?.GroupID) === gid) {
          if (this.groupLst.length) {
            this.selectGroup(this.groupLst[0]);
          } else {
            this.selectGroup(null);
          }
        }
      }
      this.getGroupLstByUserID();
    },
    onGroupDeleted({ GroupID }) {
      this.onGroupLeft({ GroupID });
    },
    onGroupMute({ GroupID, IsMute }) {
      const gid = Number(GroupID);
      if (!Number.isFinite(gid)) return;
      const mute = Number(IsMute) === 1 ? 1 : 0;
      const idx = (this.groupLst || []).findIndex(
        (g) => Number(g.GroupID) === gid,
      );
      if (idx >= 0) {
        this.groupLst.splice(idx, 1, { ...this.groupLst[idx], IsMute: mute });
      }
      if (Number(this.groupInfo?.GroupID) === gid && this.groupInfo) {
        this.groupInfo.IsMute = mute;
      }
      this.persistGroupMuteToLocalStorage(gid, mute);
    },
    onMembersUpdated(members) {
      const list = Array.isArray(members) ? members : [];
      // Update mention list + name cache for system messages / display
      this.memberLst = list;
      this.syncMemberReadMapFromMembers();
      list.forEach((m) => {
        const id = (m?.UserID || m?.UserName || "").toString().trim();
        const name = (m?.NickName || m?.FullName || "").toString().trim();
        if (id && name) this.userNameCache[id] = name;
      });

      // Re-render system messages so newly added members show name immediately
      try {
        this.messageLst = (this.messageLst || []).map((msg) => {
          if (!msg?.IsSystem) return msg;
          const rich = this.parseRichStoredText(msg.TextContent);
          const raw =
            (rich && typeof rich.text === "string" ? rich.text : null) ??
            msg.TextContentPlain ??
            msg.TextContent ??
            "";
          const display = this.humanizeSystemText(raw, msg);
          return {
            ...msg,
            TextContentPlain: display,
            TextContentHtml: this.buildMessageHtmlFromText(display, rich),
          };
        });
      } catch (_) {
        // ignore
      }
    },
    async onJumpMessage({ MessageID }) {
      await this.jumpToSearchMessage({ MessageID });
    },
    parseMemberMessageID(member, keys) {
      if (!member || typeof member !== "object") return 0;
      for (const key of keys) {
        const n = Number(member?.[key]);
        if (Number.isFinite(n) && n > 0) return n;
      }
      return 0;
    },
    memberDisplayName(member) {
      if (!member || typeof member !== "object") return "";
      const nick = (member.NickName || "").toString().trim();
      if (nick) return nick;
      const full = (member.FullName || member.LastName || "").toString().trim();
      if (full) return full;
      return (member.UserID || member.UserName || "").toString().trim();
    },
    memberAvatarUrl(member) {
      if (!member || typeof member !== "object") return "";
      const direct = (member.Avatar || "").toString().trim();
      if (/^https?:\/\//i.test(direct) || /^data:/i.test(direct)) return direct;

      const userID = (member.UserID || member.UserName || "").toString().trim();
      if (!userID) return "";
      if (!member.LinkImage) return "";
      return `https://sop.idtp.work/api/File/GetAvatarUser?UserName=${encodeURIComponent(
        userID,
      )}`;
    },
    syncMemberReadMapFromMembers() {
      const next = { ...(this.memberReadMap || {}) };
      const members = Array.isArray(this.memberLst) ? this.memberLst : [];

      members.forEach((member) => {
        const id = (member?.UserID || member?.UserName || "").toString().trim();
        if (!id) return;
        const prev = next[id] || {};
        const lastMessageID = this.parseMemberMessageID(member, [
          "LastMessageID",
          "LastMessageId",
          "LastMessage",
        ]);
        const newMessageID = this.parseMemberMessageID(member, [
          "NewMessageID",
          "NewMessageId",
          "NewMessage",
        ]);

        next[id] = {
          ...prev,
          fullName: this.memberDisplayName(member),
          lastMessageID: Math.max(
            Number(prev.lastMessageID) || 0,
            lastMessageID,
          ),
          newMessageID: Math.max(Number(prev.newMessageID) || 0, newMessageID),
        };
      });

      this.memberReadMap = next;
    },
    formatMessageTimeFull(input) {
      if (!input) return "";

      // trừ 7 giờ (7 * 60 * 60 * 1000 ms)
      const d = new Date(new Date(input).getTime() - 7 * 60 * 60 * 1000);

      return formatDateDisplay(d);
    },
    toggleMessageMeta(message) {
      const id = Number(message?.MessageID);
      if (!Number.isFinite(id) || id <= 0) return;
      this.activeMessageMetaID = this.activeMessageMetaID === id ? null : id;
    },
    shouldShowMessageMeta(message) {
      const id = Number(message?.MessageID);
      return Number.isFinite(id) && this.activeMessageMetaID === id;
    },
    getMessageReceiptSummary(message) {
      const mid = Number(message?.MessageID);
      if (!Number.isFinite(mid) || mid <= 0 || !message?.IsMine) {
        return {
          state: "sent",
          statusText: "Đã gửi",
          seenUsers: [],
          moreCount: 0,
        };
      }

      const myID = String(this.senderID || "").trim();
      const members = Array.isArray(this.memberLst) ? this.memberLst : [];
      const seen = [];
      let receivedCount = 0;

      members.forEach((member) => {
        const uid = (member?.UserID || member?.UserName || "")
          .toString()
          .trim();
        if (!uid || uid === myID) return;

        const fromMap = this.memberReadMap?.[uid] || {};
        const lastMessageID = Math.max(
          this.parseMemberMessageID(member, ["LastMessageID", "LastMessageId"]),
          Number(fromMap.lastMessageID) || 0,
        );
        const newMessageID = Math.max(
          this.parseMemberMessageID(member, ["NewMessageID", "NewMessageId"]),
          Number(fromMap.newMessageID) || 0,
        );
        const name = this.memberDisplayName(member) || uid;
        const seenAt = fromMap.timeSeen
          ? new Date(fromMap.timeSeen).getTime()
          : 0;

        if (lastMessageID >= mid) {
          seen.push({
            userID: uid,
            name,
            avatar: this.memberAvatarUrl(member),
            initial: (name || uid).charAt(0).toUpperCase(),
            seenAt,
            tooltip: fromMap.timeSeen
              ? `${name} xem lúc ${this.formatMessageTimeFull(fromMap.timeSeen)}`
              : `${name} đã xem`,
          });
        } else if (newMessageID >= mid) {
          receivedCount += 1;
        }
      });

      if (seen.length > 0) {
        const sorted = seen.sort((a, b) => b.seenAt - a.seenAt);
        const visible = sorted.slice(0, 5);
        return {
          state: "seen",
          statusText: "Đã xem",
          seenUsers: visible,
          moreCount: Math.max(0, sorted.length - visible.length),
        };
      }

      if (receivedCount > 0) {
        return {
          state: "received",
          statusText: `Đã nhận (${receivedCount})`,
          seenUsers: [],
          moreCount: 0,
        };
      }

      return {
        state: "sent",
        statusText: "Đã gửi",
        seenUsers: [],
        moreCount: 0,
      };
    },
    getMemberLstByGroupID() {
      if (!this.groupInfo?.GroupID) return;
      GetMemberLstByGroupID({
        GroupID: this.groupInfo.GroupID,
        ComID: "",
      }).then((res) => {
        if (res?.RespCode === 0) {
          this.memberLst = Array.isArray(res.Data) ? res.Data : [];
          this.memberLst.forEach((m) => {
            const id = (m?.UserID || m?.UserName || "").toString().trim();
            const name = (m?.NickName || m?.FullName || "").toString().trim();
            if (id && name) this.userNameCache[id] = name;
          });
          this.syncMemberReadMapFromMembers();
        }
      });
    },
    async getMessageByGoupID() {
      const groupID = this.groupInfo?.GroupID;
      if (!groupID) return;

      this.loadingInitial = true;
      try {
        const res = await GetMessageByGoupID({
          GroupID: groupID,
          PageNumber: 1,
          RowspPage: this.rowspPage,
          Search: "",
          ComID: "",
        });

        // Nếu user đổi group trong lúc đang load → bỏ kết quả cũ
        if (Number(this.groupInfo?.GroupID) !== Number(groupID)) return;

        if (res?.RespCode === 0) {
          this.messageLst = (res.Data || []).map((item) =>
            this.decorateMessageForUI(item),
          );
          this.messageLst = this.markLatestMessages(this.messageLst);
          this.applyReplyPreview();
          this.currentPage = 1;
          this.messagesAllLoaded = (res.Data || []).length < this.rowspPage;
          this.fetchReactionsForMessages(
            this.messageLst.slice(-80).map((m) => m.MessageID),
          );
          this.fetchPinnedForGroup();
        }
      } catch (_) {
        // ignore
      } finally {
        this.loadingInitial = false;
        this.$nextTick(() => {
          this.scrollBottom();
        });
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
      messages.sort((a, b) => {
        const da = a.TimeCreate ? new Date(a.TimeCreate).getTime() : 0;
        const db = b.TimeCreate ? new Date(b.TimeCreate).getTime() : 0;
        if (da !== db) return da - db;
        return (Number(a.MessageID) || 0) - (Number(b.MessageID) || 0);
      });

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

        // Tắt scroll-behavior smooth tạm thời để nhảy tới cuối ngay lập tức
        const originalScrollBehavior = el.style.scrollBehavior;
        el.style.scrollBehavior = "auto";

        const doScroll = () => {
          el.scrollTop = el.scrollHeight + 10000; // Cuộn thật mạnh xuống cuối
        };

        // Thực hiện ngay
        doScroll();

        // Thử lại nhiều lần ở các mốc thời gian khác nhau để bù đắp cho việc render/load ảnh
        const delays = [10, 50, 100, 200, 400, 600, 1000];
        delays.forEach((delay) => {
          setTimeout(doScroll, delay);
        });

        // Khôi phục lại scroll-behavior sau khi hoàn tất chuỗi cuộn đầu tiên
        setTimeout(() => {
          if (el) el.style.scrollBehavior = originalScrollBehavior;
        }, 1100);
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
      // backward compatible: prefer async version
      this.loadMoreMessagesAsync();
    },
    async loadMoreMessagesAsync() {
      if (this.loadingMore) return false;
      if (this.messagesAllLoaded) return false;
      if (!this.groupInfo?.GroupID) return false;

      this.loadingMore = true;
      const groupID = this.groupInfo.GroupID;

      try {
        const res = await GetMessageByGoupID({
          GroupID: groupID,
          PageNumber: this.currentPage + 1,
          RowspPage: this.rowspPage,
          Search: "",
          ComID: "",
        });

        if (Number(this.groupInfo?.GroupID) !== Number(groupID)) return false;
        if (res?.RespCode !== 0) return false;

        const data = Array.isArray(res.Data) ? res.Data : [];
        if (data.length === 0) {
          this.messagesAllLoaded = true;
          return false;
        }
        if (data.length < this.rowspPage) this.messagesAllLoaded = true;

        const dataAll = data.map((item) => this.decorateMessageForUI(item));
        this.messageLst = [...dataAll, ...this.messageLst];
        this.messageLst = this.markLatestMessages(this.messageLst);
        this.applyReplyPreview();
        this.fetchReactionsForMessages(dataAll.map((m) => m.MessageID));
        this.currentPage += 1;

        return true;
      } finally {
        this.loadingMore = false;
      }
    },
    openSearchDialog() {
      this.showSearchDialog = true;
    },
    searchMessages() {
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        return
      }
      this.isSearching = true
      GetMessageByGoupID({
        GroupID: this.groupInfo.GroupID,
        PageNumber: 1,
        RowspPage: 100, // Lấy nhiều hơn khi tìm kiếm
        Search: this.searchQuery,
        ComID: "",
      })
        .then((res) => {
          if (res.RespCode == 0) {
            this.searchResults = (res.Data || []).map((item) => {
              return {
                ...item,
                TimeShow: formatDateDisplay(item.TimeCreate),
                PreviewText:
                  this.extractPreviewFromStoredText(item.TextContent) ||
                  (Number(item.IsAttachment) > 0 ? "[Tệp đính kèm]" : ""),
              }
            })
          }
        })
        .finally(() => {
          this.isSearching = false
        })
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
      // remove duplicates
      this.selectedUsers = [
        ...new Map(
          (this.selectedUsers || []).map((m) => [String(m?.UserName || ""), m]),
        ).values(),
      ].filter((m) => m?.UserName);

      if (this.selectedUsers.length > this.maxGroupMembers) {
        notify({
          title: "Vượt giới hạn",
          text: `Nhóm chat tối đa ${this.maxGroupMembers} thành viên`,
          type: "error",
        });
        return;
      }

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
          this.showCreateGroupDialog = false;
          this.newGroupName = "";
          this.selectedUsers = [];

          const gid = Number(res?.GroupID);
          // Refresh sidebar từ server để có GroupID đầy đủ (tránh phải reload mới gửi được)
          this.getGroupLstByUserID(gid);
        }
      });
    },
    handleTouchStart(mes) {
      this.touchTimer = setTimeout(() => {
        this.activeMenuId = mes.MessageID;
      }, 600);
    },
    handleTouchEnd() {
      clearTimeout(this.touchTimer);
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
  min-height: 36px;
}

.chat-drag-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24, 119, 242, 0.08);
  pointer-events: none;
}

.chat-drag-overlay__inner {
  display: inline-flex;
  align-items: center;
  background: #fff;
  border: 1px dashed rgba(24, 119, 242, 0.45);
  color: #1877f2;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.pinned-bar {
  position: sticky;
  top: 0;
  z-index: 15;
  // padding: 6px 8px;
  margin-left: 8px;
  border-radius: 12px;
  background: rgb(var(--v-theme-background));
  // width: 100%;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.pinned-bar__activator {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 12px;
  // background: rgba(24, 119, 242, 0.06);
  background: rgb(var(--v-theme-blue), 0.1);
}

.pinned-bar__text {
  min-width: 0;
}

.pinned-bar__title {
  font-size: 12px;
  font-weight: 700;
  color: #1877f2;
  line-height: 1.1;
}

.pinned-bar__preview {
  font-size: 12px;
  // color: #65676b;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
}

.typing-indicator {
  display: flex;
}

.typing-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  // background: #f0f2f5;
  // border: 1px solid rgba(0, 0, 0, 0.06);
  // padding: 2px 10px;
  border-radius: 999px;
  color: #050505;
  max-width: 100%;
}

.typing-text {
  font-size: 12px;
  color: #65676b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1877f2;
  opacity: 0.35;
  animation: typingBounce 1.1s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.12s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.24s;
}

@keyframes typingBounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  40% {
    transform: translateY(-3px);
    opacity: 0.9;
  }
}

.system-row {
  display: flex;
  justify-content: center;
  padding: 0px 12px;
}

.system-pill {
  max-width: 78%;
  background: rgba(0, 0, 0, 0.06);
  color: #050505;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  text-align: center;
  word-break: break-word;
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

.message-meta {
  margin-top: 4px;
  font-size: 11px;
  color: #65676b;
  line-height: 1.35;
}

.message-meta.mine {
  align-self: flex-end;
  text-align: right;
}

.message-meta-seen {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
}

.message-meta-seen-avatar {
  border: 1px solid #fff;
  background: #e4e6eb;
  margin-left: -4px;
}

.message-meta-seen-fallback {
  display: inline-flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #374151;
}

.message-meta-seen-more {
  margin-left: 2px;
  font-size: 11px;
  color: #65676b;
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
  padding-bottom: 10px;
}

.pin-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  color: rgb(var(--v-theme-blue));
}

.pin-badge.mine {
  left: 10px;
  right: auto;
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.9);
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
  display: none !important;
}

.mention-input {
  position: relative;
  flex: 1;
}

.composer-bar {
  z-index: 20;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  padding-bottom: calc(env(safe-area-inset-bottom, 12px) + 8px);
}

.composer-row {
  background: rgb(var(--v-theme-background));
}

.composer-attachments-bar {
  background: rgb(var(--v-theme-background));
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
  cursor: zoom-in;
}

.preview-zoom-stage {
  width: 100%;
  height: 64vh;
  min-height: 420px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-zoom-img {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center center;
  user-select: none;
  pointer-events: none;
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
  background: rgba(24, 119, 242, 0.06);
  border: 1px solid rgba(24, 119, 242, 0.12);
  border-left: 4px solid #1877f2;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
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

.forward-attach {
  margin-top: 4px;
}

.forward-thumb {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  cursor: pointer;
}

.forward-attach-label {
  font-weight: 800;
}

.forward-file {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  max-width: 100%;
}

.forward-file-name {
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reaction-summary {
  position: absolute;
  bottom: 14px;
  transform: translateY(70%);
  background: rgb(var(--v-theme-grey-50));
  // border: 1px solid #e4e6eb;
  border-radius: 999px;
  padding: 0px 6px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 2px;
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
  border-radius: 100px;
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

@media (max-width: 959px) {
  .v-main {
    padding-left: 0 !important;
  }
}

/* Đảm bảo giao diện chiếm trọn màn hình, không có khoảng trắng thừa bên trên */
:deep(.v-layout), :deep(.v-card) {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

.chat-app-bar {
  padding-top: env(safe-area-inset-top, 0px) !important;
  height: calc(64px + env(safe-area-inset-top, 0px)) !important;
}

body, html {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 10px 0; /* Thêm khoảng cách trên và dưới */
}
</style>

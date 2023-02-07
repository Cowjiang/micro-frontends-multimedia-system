<template>
  <div class="chat-frame-container w-100 h-100 d-flex flex-column">
    <div class="chat-title-container w-100 px-4 d-flex flex-shrink-0 align-center">
      <div class="flex-shrink-0 mr-2 text-h6 text-grey-lighten-1">
        <i class="fa-solid fa-at"></i>
      </div>
      <div class="flex-grow-1 text-grey-darken-4 text-no-wrap">
        <span>{{ props.chatInfo.username }}</span>
        <span
          v-if="props.chatInfo.remarkName"
          class="text-grey-darken-1">
          （{{ props.chatInfo.remarkName }}）
        </span>
      </div>
      <div class="ml-auto d-flex align-center flex-shrink-0">
        <v-btn
          class="bg-grey-lighten-3 text-grey-darken-2"
          variant="tonal"
          size="x-small"
          :icon="true">
          <i class="fa-solid fa-search"></i>
        </v-btn>
        <v-btn
          class="ml-3 bg-grey-lighten-3 text-grey-darken-2"
          variant="tonal"
          size="x-small"
          :icon="true">
          <i class="fa-solid fa-ellipsis"></i>
          <v-menu activator="parent" location="start" attach>
            <v-list
              class="text-subtitle-2"
              elevation="3"
              rounded="lg"
              density="compact"
              min-width="120"
              @update:selected="handleChatMenuClick">
              <v-list-item :value="0">
                置顶聊天
              </v-list-item>
              <v-list-item :value="1">
                聊天信息
              </v-list-item>
              <v-list-item class="text-red" :value="2">
                屏蔽该用户
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </div>
    <div ref="chatMessageArea" class="chat-content-container w-100 h-100 flex-grow-1">
      <!--      <loading v-model="loadingStatus" position="relative" leaveDuration="0.1s" />-->
      <div class="message-list-container w-100 h-0 position-relative">
        <div class="chat-header d-flex flex-column pa-6">
          <div class="w-100">
            <v-avatar
              class="flex-shrink-0"
              color="grey-lighten-2"
              size="80">
              <v-img
                :src="props.chatInfo.avatarUrl"
                :alt="props.chatInfo.username" />
            </v-avatar>
          </div>
          <span class="mt-4 text-h4 text-grey-darken-4 text-no-wrap">
            {{ props.chatInfo.username }}
          </span>
          <span class="my-2 text-grey-darken-2 text-body-1">
            这里是你与 @{{ props.chatInfo.username }} 私信记录的开头。
          </span>
          <v-divider class="mt-3 mb-6" />
        </div>
        <div class="chat-content pb-4">
          <div
            class="message-container w-100 mb-6"
            v-for="(message, index) in messageRecords"
            :key="message.id"
            :id="`message${message.messageId}`">
            <!-- 消息发送时间容器 -->
            <div
              class="datetime-container w-100"
              v-if="computeDatetime(messageRecords[index - 1] === undefined ? 0 : messageRecords[index - 1].time, message.time)">
              {{ formatTime(message.time) }}
            </div>
            <!-- 用户头像容器 -->
            <div
              class="avatar-container"
              :class="!message.isMe ? 'avatar-container-left' : 'avatar-container-right'">
              <v-avatar
                v-if="!message.isMe"
                color="grey-lighten-2"
              >
                <v-img :src="`${props.chatInfo.avatarUrl}`"></v-img>
              </v-avatar>
              <v-avatar
                v-else
                color="grey-lighten-2"
              >
                <v-img :src="``"></v-img>
              </v-avatar>
            </div>
            <!-- 消息内容 -->
            <div
              v-ripple
              class="message-content"
              :class="!message.isMe ? 'message-content-left' : 'message-content-right'"
              :data-name="`message${index}`"
            >
              <div v-if="!message.isPhoto">
                {{ message.content }}
              </div>
              <v-img
                width="10vw"
                :height="90"
                contain
                v-else
                :src="message.content"
                :data-name="`message${index}`"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input-container w-100 mt-auto flex-shrink-0 px-6 pt-3 pb-6">
      <div class="input-container w-100 h-100 px-4 d-flex align-center bg-grey-lighten-3 rounded-lg">
        <div class="prepend-btn-container flex-shrink-0 text-h6 text-grey-darken-2">
          <i class="fa-regular fa-face-grin-beam"></i>
        </div>
        <div class="input w-100 py-2 ml-4">
          <v-textarea
            v-model="inputValue"
            :auto-grow="true"
            :autofocus="true"
            hide-details
            density="comfortable"
            rows="1"
            max-rows="5"
            bg-color="transparent"
            variant="plain"
            single-line
            color="primary"
            :placeholder="placeholder"
            :disabled="loadingStatus"
            @keydown.enter="handleSendMessage" />
        </div>
        <div class="append-btn-container ml-auto flex-shrink-0 text-h6 text-grey-darken-2">
          <input
            class="position-relative"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            @change="handleFileSelected($event.target.files)">
          <i class="fa-regular fa-image"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ChatInfo, Message } from '@/views/chat/components/chat-drame/typings';
  import { chatApi } from '@/services/api';
  import { IResponseData } from '@/services/typings';
  import { formatTime } from '@/common/formats';
  import { useChatStore } from '@/store/chat';

  interface Props {
    chatInfo: ChatInfo;
  }

  const props = withDefaults(defineProps<Props>(), {});
  const chatStore = storeToRefs(useChatStore());

  const chatMessageArea = ref<HTMLElement | null>(null);
  const loadingStatus = ref(true); //数据加载状态
  const inputValue = ref(''); //输入框的值
  const placeholder = ref(''); //输入框的占位文字
  const messageRecords = ref<Message[]>([]); //消息记录数组
  let recordsLength: number = 0; //当前获取聊天消息记录的请求回报的消息总数
  const pageSize: number = 100; //每次请求获取聊天记录的单页数据总数
  let existMore: boolean = true; //是否存在更多历史消息

  /**
   * 获取聊天消息记录
   * @param time 查询时间戳，为空时则查询第一页
   */
  const getChatHistory = async (time?: number) => {
    const queryTime = time ?? Date.now();
    await chatApi.getPrivateChatHistoryByUid({
      time: queryTime,
      friendId: props.chatInfo.id,
      pageSize: pageSize
    }).then(res => {
      if (!time) {
        let recordsTemp: Message[] = [];
        res.data?.records.forEach((records, index) => {
          recordsTemp.unshift({
            id: records.id,
            content: records.content,
            isPhoto: !records.isText,
            isMe: records.senderId !== props.chatInfo.id,
            time: records.createdTime
          });
        });
        messageRecords.value = [];
        messageRecords.value = recordsTemp;
        recordsLength = res.data?.total ?? 0;
        if (recordsLength <= pageSize) {
          existMore = false;
        }
        setTimeout(() => {
          loadingStatus.value = false;
        }, 500);
      } else {
        // 获取更多记录
        const firstMsgId = messageRecords.value[0].id; //获取更多记录前的第一条消息的id
        if (res.data?.records.length !== 0) {
          res.data?.records.forEach((records, index) => {
            if (records.id !== firstMsgId) {
              //防止连接处出现重复
              messageRecords.value.unshift({
                id: records.id,
                content: records.content,
                isPhoto: !records.isText,
                isMe: records.senderId !== props.chatInfo.id,
                time: records.createdTime
              });
            }
            if (index === (res.data?.records.length ?? 0) - 1) {
              if (chatMessageArea.value) {
                chatMessageArea.value.scrollTop = 9999909;
              }
            }
          });
        }
        recordsLength = res.data?.total ?? 0;
        if (recordsLength <= pageSize) {
          existMore = false;
        }
      }
    }).catch(err => {
      console.error(err);
    });
  };

  /**
   * 监听接收到新消息
   * @param data Socket接收到的新消息
   */
  const receiveNewMessage = (data: IResponseData<any>): void => {
    if (data.code === 120) {
      const newMessage = data.data.messageInfo;
      if (newMessage.senderId === props.chatInfo.id) {
        messageRecords.value.push({
          id: newMessage.id,
          content: newMessage.content,
          isPhoto: !newMessage.isText,
          isMe: false,
          time: newMessage.createdTime
        });
        recordsLength += 1;
        if (recordsLength <= pageSize) {
          existMore = false;
        }
        if (chatMessageArea.value) {
          chatMessageArea.value.scrollTop = 9999909;
        }
      } else {
        // messageStore.unreadMessageCount += 1
      }
    }
  };

  // 消息发送事件
  const handleSendMessage = (e: KeyboardEvent) => {
    e.preventDefault();
    if (inputValue.value !== '') {
      chatApi.sendPrivateMessage({
        receiverId: props.chatInfo.id,
        content: inputValue.value,
        isText: true
      }).then(res => {
        messageRecords.value.push({
          id: res.data?.id,
          isMe: true,
          isPhoto: false,
          content: inputValue.value,
          time: new Date().getTime()
        });
        recordsLength += 1;
        inputValue.value = '';
        if (chatMessageArea.value) {
          chatMessageArea.value.scrollTop = 9999909;
        }
      }).catch(e => {
        console.error(e);
      });
    }
  };

  // 文件选择
  const handleFileSelected = (files: File[]) => {
    const file = files[0];
    let fileForm = new window.FormData();
    fileForm.append('file', file);
    fileForm.append('model', 'chat');
    uploadFile(fileForm, 'image');
  };

  // 文件上传
  const uploadFile = (file: FormData, type: 'file' | 'image') => {

  };

  // 两个时间差是否大于5分钟
  const computeDatetime = (oldTime: number, newTime: number): boolean => {
    return (new Date(newTime).getTime() - new Date(oldTime).getTime()) / 1000 / 60 >= 5; //返回两个时间差是否大于5分钟
  };


  // 重置聊天组件数据
  const reset = () => {
    if (chatMessageArea.value) {
      chatMessageArea.value.scrollTop = 0;
    }
    loadingStatus.value = true;
    recordsLength = 0;
    messageRecords.value = [];
    existMore = true;
  };

  onMounted(() => {
    watch(
      () => props.chatInfo,
      () => {
        reset();
        placeholder.value = `给 @${props.chatInfo.username} 发消息`;
        // const messageHistory = chatStore.getChatMessageHistory(props.chatInfo.id);
        // if (messageHistory) {
        //   //如果store中存在缓存
        //   chatMessageHistory.value = messageHistory.messageList;
        //   pageNumber.value = messageHistory.pageNumber;
        // }
        Promise.all([getChatHistory()]).then(() => {
          loadingStatus.value = false;
          if (chatMessageArea.value) {
            setTimeout(() => {
              if (chatMessageArea.value) {
                chatMessageArea.value.scrollTop = 9999909;
              }
            }, 300);
          }
        });
      },
      {
        immediate: true
      }
    );
  });
</script>

<style scoped lang="scss">
  @import "chat-frame";
</style>

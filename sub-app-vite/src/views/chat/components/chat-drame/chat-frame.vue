<template>
  <div class="chat-frame-container w-100 h-100 d-flex flex-column">
    <v-navigation-drawer
      v-model="showInfoDrawer"
      absolute
      location="right"
      rounded
    >
      <v-list v-if="props.chatInfo.type === ChatType.GROUP">
        <v-list-item-subtitle class="mt-6 pl-4">群聊名称</v-list-item-subtitle>
        <v-list-item>{{ props.chatInfo.targetName }}</v-list-item>
        <v-list-item-subtitle class="mt-6 mb-2 pl-4">群聊用户</v-list-item-subtitle>
        <v-list-item
          v-for="user in groupUserList"
          :key="user?.userId"
          @click="handleGroupUserClick(user)"
        >
          <div class="d-flex align-center position-relative py-1">
            <v-avatar
              class="flex-shrink-0"
              color="grey-lighten-3"
              size="default">
              <v-img
                :src="user.avgPath"
                alt="">
                <template v-slot:placeholder>
                  <div class="w-100 h-100 d-flex justify-center align-center">
                    <span class="text-h6 text-grey-darken-2">
                      {{ user.username?.charAt(0) ?? '' }}
                    </span>
                  </div>
                </template>
              </v-img>
            </v-avatar>
            <div class="ml-2 mr-4 w-100 d-flex flex-column overflow-hidden text-no-wrap">
              <div class="d-flex overflow-hidden">
                <span class="w-100 mr-2 flex-grow-1 text-subtitle-1 text-grey-darken-3">
                  {{ user?.username ?? '' }}
                </span>
              </div>
            </div>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="chat-title-container w-100 px-4 d-flex flex-shrink-0 align-center">
      <div class="flex-shrink-0 mr-2 text-h6 text-grey-lighten-1">
        <i class="fa-solid fa-at" v-if="props.chatInfo.type === ChatType.PRIVATE" />
        <v-chip
          class="ma-2"
          size="x-small"
          variant="tonal"
          color="primary"
          v-else
        >
          群聊
        </v-chip>
      </div>
      <div class="flex-grow-0 text-grey-darken-4 text-no-wrap">
        <span>{{ props.chatInfo.targetName }}</span>
        <span v-if="props.chatInfo.remarkName" class="text-grey-darken-1">
          （{{ props.chatInfo.remarkName }}）
        </span>
      </div>
      <div class="ml-auto d-flex align-center flex-shrink-0">
        <v-btn
          class="bg-grey-lighten-3 text-grey-darken-2"
          variant="tonal"
          size="x-small"
          icon
        >
          <i class="fa-solid fa-search"></i>
          <v-tooltip activator="parent" location="bottom end" attach>
            搜索
          </v-tooltip>
        </v-btn>
        <v-btn
          class="ml-3 bg-grey-lighten-3 text-grey-darken-2"
          variant="tonal"
          size="x-small"
          :icon="true"
        >
          <i class="fa-solid fa-ellipsis"></i>
          <v-tooltip activator="parent" location="bottom end" attach>
            更多
          </v-tooltip>
          <v-menu activator="parent" location="start" attach>
            <v-list
              class="text-subtitle-2"
              elevation="3"
              rounded="lg"
              density="compact"
              @update:selected="handleChatMenuClick"
            >
              <v-list-item :value="0">
                置顶{{ props.chatInfo.type === ChatType.PRIVATE ? '聊天' : '群聊' }}
              </v-list-item>
              <v-list-item :value="1">
                {{ props.chatInfo.type === ChatType.PRIVATE ? '用户' : '群聊' }}信息
              </v-list-item>
              <v-list-item class="text-red" :value="2">
                屏蔽该{{ props.chatInfo.type === ChatType.PRIVATE ? '用户' : '群聊' }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </div>
    <div ref="chatMessageArea" class="chat-content-container w-100 h-100 flex-grow-1">
      <div class="message-list-container w-100 h-0 position-relative">
        <div class="chat-header d-flex flex-column pa-6">
          <div class="w-100">
            <v-avatar
              class="flex-shrink-0"
              color="grey-lighten-2"
              size="80"
            >
              <v-img
                :src="props.chatInfo.avatarUrl"
                :alt="props.chatInfo.targetName"
              >
                <template v-slot:placeholder>
                  <div class="w-100 h-100 d-flex justify-center align-center">
                    <span class="text-h4 text-grey-darken-2">
                      {{ props.chatInfo.targetName.charAt(0) }}
                    </span>
                  </div>
                </template>
              </v-img>
            </v-avatar>
          </div>
          <span class="mt-4 text-h4 text-grey-darken-4 text-no-wrap">
            {{ props.chatInfo.targetName }}
          </span>
          <span class="my-2 text-grey-darken-2 text-body-1" v-if="props.chatInfo.type === ChatType.PRIVATE">
            这里是你与 @{{ props.chatInfo.targetName }} 私信记录的开头。
          </span>
          <span class="my-2 text-grey-darken-2 text-body-1" v-else>
            这里是群聊「{{ props.chatInfo.targetName }}」的聊天记录开头。
          </span>
          <v-divider class="mt-3 mb-6" />
        </div>
        <div class="chat-content pb-4">
          <div
            class="message-container w-100 mb-6"
            v-for="(message, index) in messageRecords"
            :key="message.id"
            :id="`message${message.messageId}`"
          >
            <!-- 消息发送时间容器 -->
            <div
              class="datetime-container w-100"
              v-if="computeDatetime(messageRecords[index - 1] === undefined ? 0 : messageRecords[index - 1].time, message.time)"
            >
              {{ formatTime(message.time) }}
            </div>
            <!-- 用户头像容器 -->
            <div
              class="avatar-container"
              :class="!message.isMe ? 'avatar-container-left' : 'avatar-container-right'"
            >
              <v-avatar
                v-if="!message.isMe"
                color="grey-lighten-2"
                @click="handleGroupUserClick(message.userInfo)"
              >
                <v-img :src="message.userInfo.avatarUrl">
                  <template v-slot:placeholder>
                    <div class="w-100 h-100 d-flex justify-center align-center">
                      <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">
                        {{ message.userInfo.username.charAt(0) }}
                      </span>
                    </div>
                  </template>
                </v-img>
              </v-avatar>
              <v-avatar
                v-else
                color="grey-lighten-2"
              >
                <v-img :src="userInfo.avatarUrl">
                  <template v-slot:placeholder>
                    <div class="w-100 h-100 d-flex justify-center align-center">
                      <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">
                        我
                      </span>
                    </div>
                  </template>
                </v-img>
              </v-avatar>
            </div>
            <!-- 消息内容 -->
            <div
              v-if="!message.isMe && props.chatInfo.type === ChatType.GROUP"
              class="message-username text-caption text-grey-darken-2"
            >
              {{ message.userInfo.username }}
            </div>
            <div
              class="message-content"
              :class="[
                !message.isMe ? 'message-content-left' : 'message-content-right',
                message.isPhoto ? 'pa-0' : 'pa-2'
              ]"
              :data-name="`message${index}`"
              v-ripple
            >
              <div v-if="!message.isPhoto">
                {{ message.content }}
              </div>
              <v-img
                class="rounded-lg rounded-te-0"
                width="10vw"
                :height="120"
                cover
                v-else
                :src="message.content"
                :data-name="`message${index}`"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    />
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
            @keydown.enter="handleEnterEvent"
          />
        </div>
        <div class="append-btn-container ml-auto flex-shrink-0 text-h6 text-grey-darken-2">
          <input
            ref="fileInputRef"
            class="position-relative"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            @change="handleFileSelected($event.target.files)"
          />
          <i class="fa-regular fa-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from '@/router';
  import axios from 'axios';
  import { useUserStore } from '@/store/user';
  import { useChatStore } from '@/store/chat';
  import { formatTime } from '@/common/formats';
  import { ChatInfo, Message } from '@/views/chat/components/chat-drame/typings';
  import { authApi, chatApi } from '@/services/api';
  import { IResponseData } from '@/services/typings';
  import { Chat, ChatGroupHistory, GroupChat, MessageList, UserProfile } from '@/services/api/modules/chat/typings';
  import { ChatType } from '@/typings';
  import { SimpleUserInfo } from '@/services/api/modules/user/typings';
  import { SocketPrivateMessage } from '@/services/socket/typings';

  interface Props {
    chatInfo: ChatInfo;
  }

  interface Emits {
    (e: 'privateMessageSent', message: MessageList): void;

    (e: 'groupMessageSent', message: GroupChat): void;
  }

  const props = withDefaults(defineProps<Props>(), {});
  const emit = defineEmits<Emits>();
  const {appContext} = getCurrentInstance() ?? {};
  const message = appContext?.config.globalProperties.$message ?? {};
  const chatStore = storeToRefs(useChatStore());
  const {userInfo} = storeToRefs(useUserStore());

  const chatMessageArea = ref<HTMLElement | null>(null);
  const loadingStatus = ref(true); //数据加载状态
  const inputValue = ref(''); //输入框的值
  const placeholder = ref(''); //输入框的占位文字
  const fileInputRef = ref<HTMLInputElement>(); //图片输入的值
  const messageRecords = ref<Message[]>([]); //消息记录数组
  let recordsLength: number = 0; //当前获取聊天消息记录的请求回报的消息总数
  const pageSize: number = 100; //每次请求获取聊天记录的单页数据总数
  let existMore: boolean = true; //是否存在更多历史消息

  const showInfoDrawer = ref(false); //是否显示信息侧边栏
  const groupUserList = ref<UserProfile[]>([]); //群聊用户名单

  // 初始化
  const init = async () => {
    reset();
    placeholder.value =
      props.chatInfo.type === ChatType.PRIVATE
        ? `给 @${props.chatInfo.targetName} 发消息`
        : `在群聊「${props.chatInfo.targetName}」发消息`;
    await Promise.all([getChatHistory()]).then(() => {
      loadingStatus.value = false;
      scrollToBottom(chatMessageArea.value);
    });
    if (props.chatInfo.type === ChatType.GROUP) {
      await chatApi.getGroupUserList({
        groupId: props.chatInfo.targetId
      }).then(res => {
        groupUserList.value = res?.data ?? [];
      });
    }
    window.$wujie?.bus.$on('newChatMessage', onReceiveChatMessage);
  };

  // 收到信私信
  const onReceiveChatMessage = (data: SocketPrivateMessage) => {
    const newMessage = data.messageInfo;
    if (newMessage.senderId === props.chatInfo.targetId) {
      messageRecords.value.push({
        id: newMessage.id,
        content: newMessage.content,
        isPhoto: !newMessage.isText,
        isMe: false,
        time: newMessage.createdTime,
        userInfo: {
          username: data.userInfo.username,
          userId: data.userInfo.userId,
          avatarUrl: data.userInfo.avgPath
        }
      });
      recordsLength += 1;
      if (recordsLength <= pageSize) {
        existMore = false;
      }
      scrollToBottom(chatMessageArea.value);
    }
  };

  /**
   * 获取聊天消息记录
   * @param time 查询时间戳，为空时则查询第一页
   */
  const getChatHistory = async (time?: number) => {
    if (props.chatInfo.type === ChatType.PRIVATE) {
      // 私聊
      const queryTime = time ?? Date.now();
      await chatApi.getPrivateChatHistoryByUid({
        time: queryTime,
        friendId: props.chatInfo.targetId,
        pageSize: pageSize
      }).then(res => {
        if (!time) {
          let recordsTemp: Message[] = [];
          res.data?.records.map(msg => {
            recordsTemp.unshift({
              id: msg.id,
              content: msg.content,
              isPhoto: !msg.isText,
              isMe: msg.senderId !== props.chatInfo.targetId,
              time: msg.createdTime,
              userInfo: {
                userId: props.chatInfo.targetId,
                username: props.chatInfo.targetName,
                avatarUrl: props.chatInfo.avatarUrl
              }
            });
          });
          messageRecords.value = [];
          messageRecords.value = recordsTemp;
          recordsLength = res.data?.total ?? 0;
          if (recordsLength <= pageSize) {
            existMore = false;
          }
        } else {
          // 获取更多记录
          const firstMsgId = messageRecords.value[0].id; //获取更多记录前的第一条消息的id
          if (res.data?.records.length !== 0) {
            res.data?.records.map((msg, index) => {
              if (msg.id !== firstMsgId) {
                //防止连接处出现重复
                messageRecords.value.unshift({
                  id: msg.id,
                  content: msg.content,
                  isPhoto: !msg.isText,
                  isMe: msg.senderId === props.chatInfo.targetId,
                  time: msg.createdTime,
                  userInfo: {
                    userId: props.chatInfo.targetId,
                    username: props.chatInfo.targetName,
                    avatarUrl: props.chatInfo.avatarUrl
                  }
                });
              }
              if (index === (res.data?.records.length ?? 0) - 1) {
                scrollToBottom(chatMessageArea.value);
              }
            });
          }
          recordsLength = res.data?.total ?? 0;
          if (recordsLength <= pageSize) {
            existMore = false;
          }
        }
      }).catch(err => {
        message?.error('网络异常');
        console.error(err);
      });
    } else {
      await chatApi.getGroupChatHistoryByGid({
        groupId: props.chatInfo.targetId
      }).then(res => {
        let recordsTemp: Message[] = [];
        res.data?.map(msg => {
          recordsTemp.unshift({
            id: msg.message?.id,
            content: msg.message?.content,
            isPhoto: false,
            isMe: msg.userInfo?.userId === userInfo.value.userId,
            time: msg.message?.createdTime,
            userInfo: {
              userId: msg.userInfo?.userId,
              username: msg.userInfo?.username ?? '',
              avatarUrl: msg.userInfo?.avgPath ?? ''
            }
          });
        });
        messageRecords.value = [];
        messageRecords.value = recordsTemp;
      }).catch(err => {
        message?.error('网络异常');
        console.error(err);
      });
    }
    setTimeout(() => {
      loadingStatus.value = false;
    }, 500);
  };

  // 输入框回车事件
  const handleEnterEvent = (e: KeyboardEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // 消息发送事件
  const handleSendMessage = async (isText: boolean = true, imgUrl?: string) => {
    const content = imgUrl || inputValue.value;
    if (inputValue.value !== '' || !isText) {
      try {
        let res: IResponseData<Chat> | IResponseData<ChatGroupHistory>;
        if (props.chatInfo.type === ChatType.PRIVATE) {
          res = await chatApi.sendPrivateMessage({
            receiverId: props.chatInfo.targetId,
            content,
            isText
          });
          emit('privateMessageSent', {
            id: res.data?.id,
            friendId: props.chatInfo.targetId,
            friendInfo: {
              avgPath: props.chatInfo.avatarUrl,
              username: props.chatInfo.targetName
            },
            unread: 0,
            content,
            isText,
            createdTime: new Date().getTime()
          });
        } else {
          res = await chatApi.sendGroupMessage({
            groupId: props.chatInfo.targetId,
            content,
            type: isText ? 'text' : 'image'
          });
          emit('groupMessageSent', {
            chatGroup: {
              id: props.chatInfo.targetId,
              groupName: props.chatInfo.targetName
            },
            chatGroupHistory: {
              content: isText ? content : '[图片]',
              createdTime: new Date().getTime()
            },
            userInfo: {
              id: userInfo.value.id,
              username: '我',
              avgPath: userInfo.value.avgPath
            }
          });
        }
        messageRecords.value.push({
          id: res.data?.id,
          isMe: true,
          isPhoto: !isText,
          content,
          time: new Date().getTime(),
          userInfo: {
            userId: userInfo.value.id,
            username: userInfo.value.username,
            avatarUrl: userInfo.value.avgPath
          }
        });
        recordsLength += 1;
        inputValue.value = '';
        scrollToBottom(chatMessageArea.value);
      } catch (e) {
        message?.error('网络异常');
        console.error(e);
      }
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
    }
  };

  // 文件选择
  const handleFileSelected = (files: File[]) => {
    const file = files[0];
    let fileForm = new window.FormData();
    fileForm.append('file', file);
    uploadFile(fileForm, 'image');
  };

  // 文件上传
  const uploadFile = async (fileFormData: FormData, type: 'file' | 'image') => {
    try {
      const {data: signData} = await authApi.getUploadSignature({
        targetTypeName: 'mfms-chat'
      });
      if (signData) {
        fileFormData.append('key', `${signData.keyPrefix}private/${userInfo.value.userId}/${Date.now()}`);
        fileFormData.append('token', signData.token);
        const res = await axios.post(`http://${signData.uploadDomain}`, fileFormData, {
          headers: {'Content-Type': 'multipart/form-data'}
        });
        await handleSendMessage(false, res.data.url);
      } else {
        throw new Error('上传签名为空');
      }
    } catch (e) {
      console.error(e);
      message?.error('文件上传失败');
    }
  };

  /**
   * 聊天更多操作菜单点击事件
   * @param e 当前点击的菜单项序号数组
   */
  const handleChatMenuClick = async (e: Array<number>) => {
    if (e[0] === 0) {
      // 置顶
      try {
        if (props.chatInfo.type === ChatType.PRIVATE) {
          await chatApi.setStickyPrivateChat({
            friendId: props.chatInfo.targetId
          });
        } else {
          await chatApi.setStickyGroupChat({
            groupId: props.chatInfo.targetId
          });
        }
        message.success('设置成功', true);
      } catch (e) {
        console.error(e);
        message.error('操作失败', true);
      }
    } else if (e[0] === 1 && props.chatInfo.type === ChatType.GROUP) {
      showInfoDrawer.value = true;
    }
  };

  // 点击群聊用户
  const handleGroupUserClick = async (userInfo: UserProfile | SimpleUserInfo) => {
    if (userInfo.userId && props.chatInfo.type === ChatType.GROUP) {
      emit('privateMessageSent', {
        id: -1,
        friendId: userInfo.userId,
        friendInfo: {
          avgPath: userInfo?.avgPath ?? '',
          username: userInfo.username
        },
        unread: 0,
        content: '',
        isText: true,
        createdTime: new Date().getTime()
      });
      await router.replace({
        name: 'chat',
        params: {
          chatType: ChatType.PRIVATE,
          id: userInfo.userId
        }
      });
    }
  };

  // 两个时间差是否大于5分钟
  const computeDatetime = (oldTime: number, newTime: number): boolean => {
    return (new Date(newTime).getTime() - new Date(oldTime).getTime()) / 1000 / 60 >= 5; //返回两个时间差是否大于5分钟
  };

  // 滚动到底部
  const scrollToBottom = (el: HTMLElement | null) => {
    nextTick(() => {
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
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
        init();
      },
      {immediate: true}
    );
  });

  onUnmounted(() => {
    window.$wujie?.bus.$off('newChatMessage', onReceiveChatMessage);
  });
</script>

<style scoped lang="scss">
  @import "chat-frame";
</style>

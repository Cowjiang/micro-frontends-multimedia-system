<template>
  <div class="nav-container pt-5 d-flex flex-column align-center">
    <div
      class="btn-container d-flex flex-column justify-center align-center mb-1"
      v-for="(btn, index) in navItemList"
      :key="index">
      <div class="btn-wrapper d-flex justify-center align-center">
        <v-hover v-slot="{ isHovering, props }">
          <div
            class="btn-content d-flex justify-center align-center flex-grow-0 flex-shrink-0"
            :class="[
              index === currentNavItemIndex ? 'btn-content__focus' : '',
              isHovering && index !== currentNavItemIndex ? 'btn-content__hover' : ''
            ]"
            @click="handleNavItemClick(index)"
            v-bind="props"
            v-ripple>
            <div
              class="btn-icon text-white text-h6 d-flex justify-center align-center"
              v-if="btn.icon">
              <i :class="btn.icon" />
            </div>
            <div
              class="btn-icon text-white text-h6 d-flex justify-center align-center overflow-hidden"
              v-else-if="btn.imgUrl">
              <v-img
                :src="btn.imgUrl"
                width="50"
                :aspect-ratio="1"
                cover>
              </v-img>
            </div>
            <div
              class="btn-icon text-white text-h6 d-flex justify-center align-center overflow-hidden"
              v-else>
              <span>{{ btn.title.charAt(0).toUpperCase() || '' }}</span>
            </div>
            <v-tooltip
              activator="parent"
              location="end">
              {{ btn.title }}
            </v-tooltip>
          </div>
        </v-hover>
        <svg
          :class="index === currentNavItemIndex ? '' : 'text-transparent'"
          width="30px"
          height="60px"
          viewBox="0 0 36 60"
          version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-40.000000, -18.000000)" fill="currentColor">
              <g>
                <g transform="translate(10.000000, 18.000000)">
                  <g transform="translate(0.000000, -0.000000)">
                    <path
                      d="M30,0 C36.0854073,0 41.7476231,1.81189837 46.4765936,4.9256414 C49.2385783,6.65266891 52.5028196,7.65 56,7.65 C59.7003078,7.65 63.1398309,6.53344791 66.0000337,4.61887937 L66.0000337,55.3811206 C63.1398309,53.4665521 59.7003078,52.35 56,52.35 C52.5028196,52.35 49.2385783,53.3473311 46.476181,55.0730885 C41.8763772,58.1033248 36.3930422,59.900371 30.4961049,59.9959809 L30,60 L30,0 Z"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <hr
        class="divider my-2 mx-2"
        v-if="index === 0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useChatStore } from '@/store/chat';

  const {navItemList, currentNavItemIndex} = storeToRefs(useChatStore());
  const emit = defineEmits(['update']); //导航栏点击事件

  /**
   * 导航栏点击事件
   * @param index 点击的按钮序号
   */
  const handleNavItemClick = (index: number) => {
    emit('update', {index: index, detail: navItemList.value[index]});
  };
</script>

<style lang="scss" scoped>
  @import "nav-bar";
</style>

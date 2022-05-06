<template>
  <div v-if="!item.hideMenu" class="nav-bar-item" @mouseover="onMouseOver" @mouseout="onMouseOut">
    <template
      v-if="hasOneShowingChild(item, item.children) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
    >
      <router-link v-if="onlyOneChild?.meta?.icon" :to="onlyOneChild.path" class="navbar-item">
        <menu-item :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" :is-hover="isMenuHover" />
      </router-link>
      <router-link v-else :to="onlyOneChild.path">
        {{ item?.meta?.title }}
      </router-link>
    </template>

    <sub-menu v-else class="navbar-submenu" :class="{ parent: !isNest, 'navbar-is-secondary': item.isSecondary }">
      <template #title>
        <menu-item v-if="item.icon" :icon="item.icon" :title="item.title" :is-hover="isMenuHover" />

        <template v-else>
          <span v-if="item.isSecondary" class="navbar-submenu-title">{{ item.title }}</span>
          <router-link v-else :to="item.path" class="navbar-item-submenu-title">
            {{ item.title }}
          </router-link>
        </template>
      </template>
      <navbar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" class="nest-menu" />
    </sub-menu>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import type { PropType, Ref } from 'vue';
  import type { Menu } from '@/router/types';
  import MenuItem from './MenuItem.vue';
  import SubMenu from './SubMenu.vue';

  export default defineComponent({
    name: 'NavbarItem',
    components: { MenuItem, SubMenu },
    props: {
      item: {
        type: Object as PropType<Menu>,
        required: true,
      },
      isNest: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const onlyOneChild = ref({}) as Ref<Menu>;

      const hasOneShowingChild = (parent: Menu, children?: Menu[]) => {
        if (!children) {
          return false;
        }
        const showingChildren = children.filter((item) => {
          if (item.hideMenu) {
            return false;
          } else {
            onlyOneChild.value = item;
            return true;
          }
        });

        // hack one children
        if (showingChildren.length === 1 && showingChildren.find((e) => e.icon === 'home')) {
          return true;
        }

        if (showingChildren.length === 0) {
          onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
          return true;
        }

        return false;
      };

      const isMenuHover = ref(false);
      const onMouseOver = () => {
        isMenuHover.value = true;
      };
      const onMouseOut = () => {
        isMenuHover.value = false;
      };

      return {
        onlyOneChild,
        hasOneShowingChild,

        isMenuHover,
        onMouseOver,
        onMouseOut,
      };
    },
  });
</script>

<style scoped lang="scss">
  .nav-bar-item {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;

    .parent > ::v-deep(.submenu-wrapper) {
      display: none;
      position: absolute;
      top: 60px;
      width: 400px;
      left: 10px;
      background-color: #fff;
      color: #666;
      font-size: 14px;
      z-index: 6666;
      padding: 16px 12px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.08);
      border-radius: 8px;

      &::before {
        content: '';
        width: 16px;
        height: 16px;
        background-color: #fff;
        position: absolute;
        z-index: 100;
        top: -8px;
        left: 20px;
        transform: rotate(45deg);
      }
    }
    &:hover .parent > ::v-deep(.submenu-wrapper) {
      display: block;
    }

    &.nest-menu {
      .navbar-submenu-title {
        color: #333;
        font-weight: bold;
      }

      .navbar-item-submenu-title {
        position: relative;
        line-height: 1;
        white-space: nowrap;
        margin: 0 20px;
        color: #666;

        &::after {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #333;
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
        }

        &:hover {
          color: var(--el-color-primary);
          &::after {
            background-color: var(--el-color-primary);
          }
        }
      }

      .navbar-is-secondary {
        ::v-deep(.submenu-wrapper) {
          display: flex;
          flex-wrap: wrap;
        }
        ::v-deep(.nav-bar-item) {
          margin-top: 14px;
        }
      }

      & + & {
        .navbar-is-secondary {
          margin-top: 24px;
        }
      }
    }
  }
</style>

<script lang="tsx">
  import { defineComponent } from 'vue';
  import { SvgIcon } from '@/components/Icon';

  const props = {
    icon: { type: String },
    title: { type: String, default: '' },
    isHover: { type: Boolean, default: false },
  };

  export default defineComponent({
    name: 'MenuItem',
    components: { SvgIcon },
    props,
    setup(props, { slots }) {
      function renderIcon() {
        if (props.icon) {
          let name = props.icon;
          if (props.isHover) {
            name = name + '-hover';
          }

          return <SvgIcon name={name} />;
        }
        return null;
      }

      return () => (
        <div
          class={[
            'menu-item',
            {
              'menu-item--hover': props.isHover,
            },
          ]}
        >
          {renderIcon()}
          <span class="menu-item-title ml-6px">{props.title}</span>
          {slots.default?.()}
        </div>
      );
    },
  });
</script>

<style lang="scss" scoped>
  .menu-item {
    margin: 0 20px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 50ms ease-in-out;
    color: #fff;

    &--hover {
      margin: 0 5px;
      padding: 8px 15px;
      background-color: #fff;
      color: var(--el-color-primary);
      border-radius: 16px;
      transition: all 50ms ease-in-out;
    }
  }
</style>

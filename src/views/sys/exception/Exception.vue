<script lang="tsx">
  import { defineComponent } from 'vue';
  import { PageEnum } from '@/enums/pageEnum';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useGo } from '@/hooks/web/usePage';

  export default defineComponent({
    name: 'ErrorPage',

    setup() {
      const { t } = useI18n();
      const go = useGo();

      function goHome() {
        go(PageEnum.BASE_HOME);
      }

      const renderExtra = () => {
        return <el-button onClick={goHome}>返回首页</el-button>;
      };

      const slots = {
        extra: () => renderExtra(),
      };

      return () => {
        return <el-result v-slots={slots} icon="error" title="404" sub-title={t('sys.exception.subTitle404')} />;
      };
    },
  });
</script>

<template>
  <div class="system-about">
    <el-descriptions title="基本信息" border>
      <el-descriptions-item v-for="item in infoSchema" :key="item.label" :label="item.label">
        <el-tag size="small">{{ item.value }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <div class="mt-10">
      <el-descriptions title="生产依赖" border :column="columnNumber">
        <el-descriptions-item v-for="item in schema" :key="item.label" :label="item.label">
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="mt-10">
      <el-descriptions title="开发依赖" border :column="columnNumber">
        <el-descriptions-item v-for="item in devSchema" :key="item.label" :label="item.label">
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'SystemAbout',
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { useWindowSizeFn } from '@/hooks/event/useWindowSizeFn';

  interface DescItem {
    label: string;
    value: string;
  }

  const { pkg, lastBuildTime } = __APP_INFO__;
  const { dependencies, devDependencies, name, version } = pkg;

  const infoSchema: DescItem[] = [
    {
      label: '名字',
      value: name,
    },
    {
      label: '版本',
      value: version,
    },
    {
      label: '最后编译时间',
      value: lastBuildTime,
    },
  ];
  const schema: DescItem[] = [];
  const devSchema: DescItem[] = [];

  Object.keys(dependencies).forEach((key) => {
    schema.push({ value: dependencies[key], label: key });
  });
  Object.keys(devDependencies).forEach((key) => {
    devSchema.push({ value: devDependencies[key], label: key });
  });

  const columnNumber = ref(4);

  async function setColumnNumber() {
    if (document.body.scrollWidth <= 1378) {
      columnNumber.value = 3;
    } else {
      columnNumber.value = 4;
    }
  }

  onMounted(async () => {
    await nextTick();
    useWindowSizeFn(setColumnNumber);
  });
</script>

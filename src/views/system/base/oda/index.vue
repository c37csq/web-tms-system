<template>
  <div class="oda-management" v-loading="dataLoading">
    <div class="mb-20px"> <add-button @click="operate('add')" v-auth="['system:oda:add']" /> </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="odaCode" label="ODA代码" />
      <el-table-column prop="odaName" label="ODA名称" />
      <el-table-column prop="operate" label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['system:oda:edit']">
            编辑
          </el-button>
          <el-button type="text" size="small" @click="operate('rule', row)" v-auth="['system:oda-rule:view']">
            配置规则
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-dialog
      v-model="dialogVisible"
      width="420px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        label-width="90px"
        size="small"
        :model="odaFormData"
        :rules="odaFormRules"
        ref="odaFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="ODA代码" prop="odaCode">
          <el-select placeholder="请选择ODA代码" v-model="odaFormData.odaCode" :disabled="isEdit" clearable filterable>
            <el-option v-for="item in odaCodeList" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="ODA名称" prop="odaName">
          <el-input v-model="odaFormData.odaName" placeholder="请输入ODA名称" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, reactive } from 'vue';
  import type { Ref } from 'vue';
  import { OdaItem, getOdaList, addOda, updateOda } from '@/api/system';
  import { ExpressItem } from '@/api/sys/model/selectModel';
  import { useExpressList } from '@/hooks/select/useSelect';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { pick } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';

  defineOptions({
    name: 'OdaManagement',
  });

  const router = useRouter();

  const { createBriefSuccessMsg } = useMessage();

  const list = ref<OdaItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      list.value = await getOdaList();
    } catch (e) {
      console.error(e);
      list.value = [];
    } finally {
      dataLoading.value = false;
    }
  }

  onMounted(() => {
    loadList();
  });

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const curOda = ref({}) as Ref<OdaItem>;
  const getTitle = computed(() => (unref(isEdit) ? '编辑ODA' : '新增ODA'));

  const odaFormData = reactive({
    odaId: 0,
    odaCode: '',
    odaName: '',
  });
  const odaFormRules = {
    odaCode: [{ required: true, message: '请选择ODA代码', trigger: 'change' }],
    odaName: [{ required: true, message: '请输入ODA名称', trigger: 'blur' }],
  };
  const odaFormRef = ref();
  const dialogFormLoading = ref(false);

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(odaFormRef);
    showLoading && showLoading();
    try {
      if (unref(isEdit)) {
        await updateOda(pick(odaFormData, 'odaName', 'odaId'));
        createBriefSuccessMsg('修改oda成功');
      } else {
        await addOda(pick(odaFormData, 'odaName', 'odaCode'));
        createBriefSuccessMsg('新建oda成功');
      }
      await loadList();
      closeDialog && closeDialog();
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(odaFormRef);
  }
  function onOpened() {
    if (unref(isEdit)) {
      odaFormData.odaCode = unref(curOda).odaCode;
      odaFormData.odaName = unref(curOda).odaName;
    }
    dialogFormLoading.value = false;
  }

  const odaCodeList = ref<ExpressItem[]>([]);
  async function operate(type: 'add' | 'edit' | 'rule', item?: OdaItem) {
    if (type === 'rule') {
      await router.push({
        name: 'OdaConfigRule',
        params: { id: item!.odaId, name: item!.odaName },
      });
    } else {
      isEdit.value = type === 'edit';
      odaCodeList.value = await useExpressList();
      if (type === 'edit') {
        odaFormData.odaId = item!.odaId;
        curOda.value = item!;
      }

      dialogFormLoading.value = true;
      dialogVisible.value = true;
    }
  }
</script>

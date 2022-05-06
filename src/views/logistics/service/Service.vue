<template>
  <div class="provider">
    <el-form :model="form" ref="searchFormRef" size="small" inline class="filter-form">
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" v-model="form.status" clearable>
          <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="服务商编号" prop="serviceProviderCode">
        <el-input placeholder="请输入服务商编号" v-model.trim="form.serviceProviderCode" clearable />
      </el-form-item>
      <el-form-item label="服务商名称" prop="serviceProviderName">
        <el-input placeholder="请输入服务商名称" v-model.trim="form.serviceProviderName" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="addShow">新增</add-button>
    </div>

    <el-table :data="list" size="small" border stripe v-loading="loading">
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :formatter="column.formatter"
      />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <span v-if="scope.row.status === '0'" class="text-invalid">失效</span>
          <span v-if="scope.row.status === '1'" class="text-active">生效</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="operate(scope.row, 'edit')">编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="operate(scope.row, 'channel')"
            v-auth="['logistics:service:channel:view']"
          >
            渠道管理
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="operate(scope.row, 'api')"
            v-auth="['logistics:service:api:view']"
          >
            API管理
          </el-button>
          <el-button
            @click="operate(scope.row, 'status')"
            type="text"
            size="small"
            v-auth="['logistics:providers:change']"
          >
            {{ scope.row.isActive ? '停用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog
      width="500px"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
      v-model="providerForm.visible"
      :title="providerForm.title"
    >
      <el-form
        v-loading="providerForm.editLoading"
        size="small"
        label-width="120px"
        :model="providerForm.data"
        :rules="providerForm.rules"
        ref="providerFormRef"
      >
        <el-form-item label="服务商编号" prop="serviceProviderCode">
          <el-input
            v-model.trim="providerForm.data.serviceProviderCode"
            placeholder="请输入服务商编号"
            :disabled="providerForm.isEdit"
          />
        </el-form-item>
        <el-form-item label="服务商名称" prop="serviceProviderName">
          <el-input v-model="providerForm.data.serviceProviderName" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="服务问题件回退" prop="serviceProblemBack">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 15 }"
            placeholder="请输入服务问题件回退"
            v-model="providerForm.data.serviceProblemBack"
          />
          <p class="text-delete" style="font-size: 12px">Tips: 可输入多个关键字，用换行隔开</p>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    addService,
    changeServiceStatus,
    editService,
    editServiceById,
    getServiceList,
  } from '@/api/logistics/service';
  import { ServiceListItem } from '@/api/logistics/service/model/ServiceModel';
  import { formResetFields, formValidate } from '@/utils/tools';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'Service',
    components: { BasicDialog },
    setup() {
      const router = useRouter();
      const columns = [
        {
          label: '服务商编号',
          prop: 'serviceProviderCode',
          formatter: (row) => {
            return row.serviceProviderCode || '/';
          },
        },
        {
          label: '服务商名称',
          prop: 'serviceProviderName',
          formatter: (row) => {
            return row.serviceProviderName || '/';
          },
        },
      ];
      const loading = ref(false);
      const list = ref<ServiceListItem[]>([]);
      const pageParams = pageData();
      const searchFormRef = ref();
      const form = reactive({
        status: '',
        serviceProviderCode: '',
        serviceProviderName: '',
      });
      const statusList = ref([
        { id: 1, label: '生效', value: '1' },
        { id: 1, label: '失效', value: '0' },
      ]);

      const providerForm = reactive({
        visible: false,
        title: '新增',
        isEdit: false,
        loading: false,
        editLoading: false,
        curData: {},
        data: {
          serviceProviderCode: '', // 服务商编号
          serviceProviderName: '', // 服务商名称
          serviceProblemBack: '',
          apiServiceCode: '', // 服务编号
          version: '',
          serviceProviderId: 0,
        },
        rules: {
          serviceProviderCode: [{ required: true, message: '服务商编号不能为空', trigger: 'blur' }],
          serviceProviderName: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
          apiServiceCode: [{ required: true, message: 'API服务不能为空', trigger: 'change' }],
        },
      });
      const providerFormRef = ref();
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const onSubmit = async () => {
        await formValidate(providerFormRef);
        try {
          const data = { ...providerForm.data };
          if (providerForm.isEdit) {
            data.serviceProviderId = (providerForm.curData as any).serviceProviderId;
            await editService(data);
            createBriefSuccessMsg('编辑服务商成功');
          } else {
            await addService(data);
            createBriefSuccessMsg('添加服务商成功');
          }
          await loadList();
          providerForm.visible = false;
        } catch (e) {
          console.error(e);
        }
      };

      const onOpened = async () => {
        if (providerForm.isEdit) {
          const curData = providerForm.curData as any;
          const data = await editServiceById({ id: curData.serviceProviderId });
          providerForm.data.serviceProviderCode = data.serviceProviderCode;
          providerForm.data.serviceProviderName = data.serviceProviderName;
          providerForm.data.apiServiceCode = data.apiServiceCode;
          providerForm.data.version = data.version as any;
          providerForm.data.serviceProblemBack = data.serviceProblemBack as any;
        }
        providerForm.editLoading = false;
      };

      const operate = async (item, type) => {
        const { serviceProviderId, isActive, serviceProviderCode } = item;
        providerForm.curData = item;
        if (type === 'edit') {
          if (providerForm.editLoading) return;
          providerForm.editLoading = true;
          providerForm.isEdit = true;
          providerForm.title = '编辑';
          providerForm.visible = true;
        } else if (type === 'channel') {
          await router.push({
            name: 'Channel',
            params: { code: serviceProviderCode },
          });
        } else if (type === 'api') {
          await router.push({
            name: 'API',
            params: { code: serviceProviderCode },
          });
        } else {
          const status = isActive ? '0' : '1';
          const message = `请确认是否${isActive ? '停用' : '启用'}该服务商`;
          try {
            createConfirm({
              title: `${isActive ? '停用' : '启用'}`,
              message,
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    await changeServiceStatus(serviceProviderId, status);
                    createBriefSuccessMsg(`${isActive ? '停用' : '启用'}服务商成功`);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    done();
                    instance.confirmButtonLoading = false;
                  }
                } else {
                  done();
                }
              },
            })
              .then(() => {
                loadList();
              })
              .catch(() => {});
          } catch (e) {
            console.error(e);
          }
        }
      };

      const onClose = () => {
        formResetFields(providerFormRef);
      };

      const addShow = () => {
        formResetFields(providerFormRef);
        providerForm.title = '新增';
        providerForm.isEdit = false;
        providerForm.visible = true;
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const loadList = async () => {
        loading.value = true;
        const params = {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize,
          status: form.status,
          serviceProviderCode: form.serviceProviderCode,
          serviceProviderName: form.serviceProviderName,
        };
        try {
          const { list: _list, total, pageNum } = await getServiceList(params);
          list.value = _list.map((e) => {
            e.isActive = !!+e.status;
            return e;
          });
          pageParams.pageNum = pageNum;
          pageParams.total = total;
        } catch (e) {
          list.value = [];
          pageParams.total = 0;
        }
        loading.value = false;
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      onMounted(async () => {
        await loadList();
      });

      return {
        columns,
        loading,
        list,
        pageParams,
        form,
        statusList,
        providerForm,
        providerFormRef,
        searchFormRef,

        onSearch,
        onReset,
        onPageChange,
        addShow,
        onClose,
        onOpened,
        onSubmit,
        operate,
      };
    },
  });
</script>

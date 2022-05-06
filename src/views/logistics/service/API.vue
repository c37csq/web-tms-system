<template>
  <div class="api">
    <el-form ref="searchFormRef" :model="form" size="small" inline class="filter-form">
      <el-form-item label="服务编号" prop="apiServiceCode">
        <el-input placeholder="请输入服务编号" v-model.trim="form.apiServiceCode" clearable />
      </el-form-item>
      <el-form-item label="服务名称" prop="apiServiceName">
        <el-input placeholder="请输入服务名称" v-model.trim="form.apiServiceName" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="addShow('outside')">新增</add-button>
    </div>

    <el-table :data="list" size="small" border stripe v-loading="loading">
      <el-table-column prop="apiServiceCode" label="服务编号" />
      <el-table-column prop="apiServiceName" label="服务名称" />
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="operate(scope.row, 'edit')">编辑</el-button>
          <el-button type="text" size="small" @click="operate(scope.row, 'info')">详情</el-button>
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
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
      width="500px"
      :title="apiForm.title"
      v-model="apiForm.visible"
    >
      <el-form
        v-loading="apiForm.editLoading"
        size="small"
        label-width="120px"
        :model="apiForm.data"
        :rules="apiForm.rules"
        ref="apiFormRef"
      >
        <el-form-item label="服务商编号">
          <el-input :model-value="route.params.code" disabled />
        </el-form-item>
        <el-form-item label="服务编号" prop="apiServiceCode">
          <el-input
            v-model.trim="apiForm.data.apiServiceCode"
            placeholder="请输入服务编号"
            :disabled="apiForm.isEdit"
          />
        </el-form-item>
        <el-form-item label="服务名称" prop="apiServiceName">
          <el-input v-model="apiForm.data.apiServiceName" placeholder="请输入服务名称" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog
      :show-footer="false"
      @opened="onInfoOpened"
      :title="apiForm.curData.apiServiceName + '的详情'"
      width="980px"
      v-model="apiForm.infoVisible"
    >
      <div class="info-container">
        <div class="mb-20px">
          <add-button @click="addShow('inner')">新增</add-button>
        </div>
        <el-table :data="infoList" size="small" border stripe v-loading="apiForm.infoLoading">
          <el-table-column prop="warehouseCode" label="仓库编号" />
          <el-table-column prop="apiServiceAddress" label="服务地址" />
          <el-table-column prop="trackingNumber" label="跟踪号" width="70">
            <template #default="scope">
              {{ scope.row.trackingNumber === '0' ? '异步' : '标准' }}
            </template>
          </el-table-column>
          <el-table-column prop="tag" label="标签" width="60">
            <template #default="scope">
              {{ scope.row.tag === '0' ? '异步' : '标准' }}
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="password" label="密码" />
          <el-table-column prop="apiAddress" label="api地址" />
          <el-table-column prop="accountNumber" label="托运账号" />
          <el-table-column prop="labelAddress" label="面单地址" />
          <el-table-column prop="operate" label="操作" width="140">
            <template #default="scope">
              <el-button type="text" size="small" @click="infoOperate(scope.row, 'edit')">编辑</el-button>
              <el-button type="text" size="small" @click="infoOperate(scope.row, 'del')">删除</el-button>
              <el-button type="text" size="small" @click="infoOperate(scope.row, 'saveAs')">另存为</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-dialog>

    <basic-dialog
      @opened="onInfoTwoOpened"
      @submit="onInfoSubmit"
      v-model="infoForm.visible"
      width="680px"
      :title="infoForm.title"
    >
      <el-form
        v-loading="infoForm.editLoading"
        size="small"
        label-width="120px"
        inline
        :model="infoForm.data"
        :rules="infoForm.rules"
        ref="infoFormRef"
      >
        <div class="flex justify-center">
          <div class="flex flex-col">
            <el-form-item label="仓库编号" prop="warehouseCode">
              <el-select placeholder="请选择仓库" v-model="infoForm.data.warehouseCode" clearable filterable>
                <el-option
                  v-for="item in warehouseList"
                  :key="item.warehouseId"
                  :label="item.warehouseCode"
                  :value="item.warehouseCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="追踪号" prop="trackingNumber">
              <el-select placeholder="请选择追踪号" v-model="infoForm.data.trackingNumber" clearable>
                <el-option label="异步" value="0" />
                <el-option label="标准" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="infoForm.data.account" placeholder="请输入用户账号" />
            </el-form-item>
            <el-form-item label="API地址" prop="apiAddress">
              <el-input v-model="infoForm.data.apiAddress" placeholder="请输入API地址" />
            </el-form-item>
            <el-form-item label="面单地址" prop="accountNumber">
              <el-input v-model="infoForm.data.labelAddress" placeholder="请输入面单地址" />
            </el-form-item>
          </div>
          <div class="flex flex-col">
            <el-form-item label="服务地址" prop="apiServiceAddress">
              <el-input v-model="infoForm.data.apiServiceAddress" placeholder="请输入服务地址" />
            </el-form-item>
            <el-form-item label="标签" prop="tag">
              <el-select placeholder="请选择标签" v-model="infoForm.data.tag" clearable>
                <el-option label="异步" value="0" />
                <el-option label="标准" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="infoForm.data.password" placeholder="请输入用户密码" />
            </el-form-item>
            <el-form-item label="托运账号" prop="accountNumber">
              <el-input v-model="infoForm.data.accountNumber" placeholder="请输入托运账号" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    addAPI,
    addInfo,
    delInfo,
    editAPI,
    editById,
    editInfo,
    editInfoById,
    getAPIList,
    getInfoList,
  } from '@/api/logistics/service';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useWarehouseList } from '@/hooks/select/useSelect';
  import { WarehouseItem } from '@/api/sys';

  import { ApiListItem, InfoListItem } from '@/api/logistics/service/model/ApiModel';
  import { useTabs } from '@/hooks/web/useTabs';

  export default defineComponent({
    name: 'API',
    setup() {
      const route = useRoute();
      const loading = ref(false);
      const list = ref<ApiListItem[]>([]);
      const pageParams = pageData();
      const { setTitle } = useTabs();

      const form = reactive({
        apiServiceName: '',
        apiServiceCode: '',
      });
      const infoList = ref<InfoListItem[]>([]);

      const apiForm = reactive({
        visible: false,
        title: '新增',
        isEdit: false,
        loading: false,
        editLoading: false,
        infoLoading: false,
        infoVisible: false,
        curData: {
          apiServiceName: '',
        },
        data: {
          serviceProviderCode: '', // 服务商编号
          apiServiceName: '', // 服务名称
          apiServiceCode: '', // 服务编号
          apiServiceId: 0,
        },
        rules: {
          apiServiceName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
          apiServiceCode: [{ required: true, message: '请输入服务编号', trigger: 'blur' }],
        },
      });
      const apiFormRef = ref();
      const infoForm = reactive({
        visible: false,
        title: '新增',
        isEdit: false,
        isSaveAs: false,
        loading: false,
        editLoading: false,
        curData: null,
        data: {
          warehouseCode: '', // 仓库编号
          apiServiceAddress: '', // 服务地址
          trackingNumber: '', // 跟踪号(0不返回，1返回)
          tag: '', // 标签（0不包含，1包含）
          account: '', // 账号
          password: '', // 密码
          apiAddress: '', // api地址
          accountNumber: '', // 托运账号
          labelAddress: '', // 面单地址
          apiServiceId: 0,
          apiServiceDetailId: 0,
        },
        rules: {
          warehouseCode: [{ required: true, message: '仓库不能为空', trigger: 'change' }],
          apiServiceAddress: [{ required: true, message: 'API服务地址不能为空', trigger: 'blur' }],
          trackingNumber: [{ required: true, message: '跟踪号不能为空', trigger: 'change' }],
          tag: [{ required: true, message: '标签不能为空', trigger: 'change' }],
          apiAddress: [{ required: true, message: 'api地址不能为空', trigger: 'blur' }],
        },
      });
      const warehouseList = ref<WarehouseItem[]>([]);
      const infoFormRef = ref();
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const searchFormRef = ref();

      const loadList = async () => {
        loading.value = true;
        const params = {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize,
          apiServiceCode: form.apiServiceCode,
          apiServiceName: form.apiServiceName,
          serviceProviderCode: route.params.code,
        };
        try {
          const { list: _list, total, pageNum } = await getAPIList(params);
          list.value = _list;
          pageParams.pageNum = pageNum;
          pageParams.total = total;
        } catch (e) {
          list.value = [];
          pageParams.pageSize = 1;
          pageParams.total = 0;
        }
        loading.value = false;
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      const infoOperate = (item, type) => {
        infoForm.curData = item;
        if (type === 'edit') {
          infoForm.editLoading = true;
          infoForm.isEdit = true;
          infoForm.isSaveAs = false;
          infoForm.title = '编辑';
          infoForm.visible = true;
        } else if (type === 'saveAs') {
          infoForm.editLoading = true;
          infoForm.isEdit = false;
          infoForm.isSaveAs = true;
          infoForm.title = '另存为';
          infoForm.visible = true;
        } else {
          try {
            createConfirm({
              title: '删除',
              message: '此操作将删除该记录！',
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    await delInfo({ id: item.apiServiceDetailId });
                    createBriefSuccessMsg(`删除成功`);
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
                loadInfoList((apiForm.curData as any).apiServiceId);
              })
              .catch(() => {});
          } catch (e) {
            console.error(e);
          }
        }
      };

      const onSubmit = async () => {
        await formValidate(apiFormRef);
        try {
          const data = { ...apiForm.data };
          (data.serviceProviderCode as any) = route.params.code;
          if (apiForm.isEdit) {
            data.apiServiceId = (apiForm.curData as any).apiServiceId;
            await editAPI(data);
            createBriefSuccessMsg('编辑成功');
          } else {
            await addAPI(data);
            createBriefSuccessMsg('添加成功');
          }
          await loadList();
          apiForm.visible = false;
        } catch (e) {
          console.error(e);
        }
      };

      const onInfoSubmit = async () => {
        await formValidate(infoFormRef);
        infoForm.loading = true;
        const data = { ...infoForm.data };
        data.apiServiceId = (apiForm.curData as any).apiServiceId;
        if (infoForm.isEdit) {
          data.apiServiceDetailId = (infoForm.curData as any).apiServiceDetailId;
          await editInfo(data);
          createBriefSuccessMsg('编辑成功');
        } else {
          try {
            await addInfo(data);
            createBriefSuccessMsg('添加成功');
          } catch (e) {
            console.error(e);
          }
        }
        await loadInfoList((apiForm.curData as any).apiServiceId);
        infoForm.visible = false;
      };

      const onOpened = async () => {
        if (apiForm.isEdit) {
          const data = await editById({ id: (apiForm.curData as any).apiServiceId });
          apiForm.data.apiServiceName = data.apiServiceName;
          apiForm.data.apiServiceCode = data.apiServiceCode;
        }
        apiForm.editLoading = false;
      };

      const onInfoOpened = async () => {
        loading.value = false;
        apiForm.infoLoading = false;
      };

      const onInfoTwoOpened = async () => {
        if (infoForm.isEdit || infoForm.isSaveAs) {
          const data = await editInfoById({
            id: (infoForm.curData as any).apiServiceDetailId,
          });
          infoForm.data.warehouseCode = data.warehouseCode;
          infoForm.data.apiServiceAddress = data.apiServiceAddress;
          infoForm.data.trackingNumber = data.trackingNumber;
          infoForm.data.tag = data.tag;
          infoForm.data.account = data.account;
          infoForm.data.password = data.password;
          infoForm.data.apiAddress = data.apiAddress;
        }
        infoForm.editLoading = false;
      };

      const operate = async (item, type) => {
        apiForm.curData = item;
        const apiServiceId = item.apiServiceId;
        if (type === 'edit') {
          apiForm.isEdit = true;
          apiForm.editLoading = true;
          apiForm.title = '编辑';
          apiForm.visible = true;
        } else {
          if (apiForm.infoLoading) return;
          apiForm.infoLoading = true;
          try {
            if (!warehouseList.value.length) {
              warehouseList.value = await useWarehouseList();
            }
            await loadInfoList(apiServiceId);
            apiForm.infoVisible = true;
          } catch (e) {
            console.error(e);
          }
        }
      };

      const loadInfoList = async (apiServiceId) => {
        try {
          infoList.value = await getInfoList({ apiServiceId });
        } catch (e) {
          console.error(e);
          infoList.value = [];
        }
      };

      const onClose = () => {
        formResetFields(apiFormRef);
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const addShow = (type) => {
        apiForm.editLoading = false;
        apiForm.infoLoading = false;
        infoForm.loading = false;
        if (type === 'outside') {
          formResetFields(apiFormRef);
          apiForm.title = '新增';
          apiForm.isEdit = false;
          apiForm.visible = true;
        } else {
          formResetFields(infoFormRef);
          infoForm.title = '新增';
          infoForm.isEdit = false;
          infoForm.isSaveAs = false;
          infoForm.visible = true;
        }
      };

      onMounted(async () => {
        await setTitle(route.params.code + '下的API管理');
        await loadList();
      });

      return {
        route,
        loading,
        list,
        pageParams,
        form,
        infoList,
        apiForm,
        apiFormRef,
        infoForm,
        infoFormRef,
        searchFormRef,
        warehouseList,

        onPageChange,
        onSearch,
        onReset,
        addShow,
        onClose,
        onSubmit,
        onOpened,
        operate,
        infoOperate,
        onInfoOpened,
        onInfoSubmit,
        onInfoTwoOpened,
      };
    },
  });
</script>

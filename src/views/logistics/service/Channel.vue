<template>
  <div class="channel">
    <el-form :model="form" ref="searchFormRef" size="small" inline class="filter-form">
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" v-model="form.status" clearable>
          <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="服务商编号" v-if="!code" prop="serviceProviderCode">
        <el-input placeholder="请输入服务商编号" v-model.trim="form.serviceProviderCode" clearable />
      </el-form-item>
      <el-form-item label="服务商渠道编号" prop="serviceChannelCode">
        <el-input placeholder="请输入服务商渠道编号" v-model.trim="form.serviceChannelCode" clearable />
      </el-form-item>
      <el-form-item label="产品组编号" prop="teamCode">
        <el-select placeholder="请选择产品组编号" v-model="form.teamCode" clearable filterable>
          <el-option
            v-for="item in selectData.productList"
            :key="item.teamId"
            :label="item.teamCode"
            :value="item.teamCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="addShow">新增</add-button>
    </div>

    <el-table :data="list" size="small" row-key="id" border stripe v-loading="loading">
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :formatter="column.formatter"
      />
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <div>
            <el-button type="text" size="small" @click="operate(scope.row, 'edit')"> 编辑 </el-button>
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'info')"
              v-auth="['logistics:service:channel-detail:view']"
            >
              详情
            </el-button>
            <el-button type="text" size="small" @click="operate(scope.row, 'status')">
              {{ scope.row.isActive ? '停用' : '启用' }}
            </el-button>
          </div>
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
      @opened="onOpened"
      @submit="onSubmit"
      width="780px"
      v-model="channelForm.visible"
      :title="channelForm.title"
    >
      <el-form
        v-loading="channelForm.editLoading"
        size="small"
        label-width="160px"
        :model="channelForm.data"
        :rules="channelForm.rules"
        ref="channelFormRef"
      >
        <div class="flex">
          <el-form-item label="服务商编号" prop="serviceProviderCode">
            <el-select
              :disabled="!!code"
              placeholder="请选择服务商编号"
              v-model="channelForm.data.serviceProviderCode"
              clearable
              filterable
            >
              <el-option
                v-for="item in selectData.serviceCodeList"
                :key="item.serviceProviderId"
                :label="item.serviceProviderCode"
                :value="item.serviceProviderCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务渠道编号" prop="serviceChannelCode">
            <el-input v-model="channelForm.data.serviceChannelCode" placeholder="请输入服务渠道编号" />
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="API服务" prop="apiServiceCode">
            <el-select placeholder="请选择API服务" v-model="channelForm.data.apiServiceCode" filterable>
              <el-option
                v-for="item in selectData.apiList"
                :key="item.apiServiceId"
                :label="item.apiServiceCode"
                :value="item.apiServiceCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="API渠道代码" prop="apiCode">
            <el-input v-model="channelForm.data.apiCode" placeholder="请输入 API 服务编号" />
          </el-form-item>
        </div>
        <div class="flex items-start">
          <el-form-item label="仓库编号" prop="warehouseCodeList">
            <el-select
              placeholder="请选择仓库"
              v-model="channelForm.data.warehouseCodeList"
              clearable
              filterable
              multiple
            >
              <el-option
                v-for="item in selectData.warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseCode"
                :value="item.warehouseCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品组编号" prop="teamCode">
            <el-select placeholder="请选择产品组编号" v-model="channelForm.data.teamCode" clearable filterable>
              <el-option
                v-for="item in selectData.productList"
                :key="item.teamId"
                :label="item.teamCode"
                :value="item.teamCode"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="签名服务" prop="signature">
            <el-select placeholder="请选择签名服务" v-model="channelForm.data.signature" filterable>
              <el-option label="不签名" value="0" />
              <el-option label="成年" value="1" />
              <el-option label="未成年" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="保险服务" prop="insurance">
            <el-select placeholder="请选择保险服务" v-model="channelForm.data.insurance" filterable>
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="起始重量" prop="startWeightRange">
            <el-input size="small" v-model="channelForm.data.startWeightRange" placeholder="起始重量" />
          </el-form-item>
          <el-form-item label="结束重量" prop="endWeightRange">
            <el-input size="small" v-model="channelForm.data.endWeightRange" placeholder="结束重量" />
          </el-form-item>
        </div>
        <el-form-item label="ODA编号" prop="verifyRemote">
          <el-select placeholder="请选择ODA编号" v-model="channelForm.data.verifyRemote" clearable filterable>
            <el-option
              v-for="item in selectData.odaSelectList"
              :key="item.odaId"
              :label="item.odaCode"
              :value="item.odaCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { defineComponent, h, onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    addChannel,
    changeChannelStatus,
    editChannel,
    editChannelById,
    getChannelList,
    getServiceSelectList,
    loadApiList,
  } from '@/api/logistics/service';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useOdaList, useProductTeamList, useWarehouseList } from '@/hooks/select/useSelect';
  import { useMessage } from '@/hooks/web/useMessage';
  import { OdaItem, ProductTeamItem, WarehouseItem } from '@/api/sys';
  import { ServiceListItem } from '@/api/logistics/service/model/ServiceModel';
  import { ChannelListItem, ServiceSelectListItem } from '@/api/logistics/service/model/ChannelModel';
  import { useTabs } from '@/hooks/web/useTabs';

  export default defineComponent({
    name: 'Channel',
    setup() {
      const router = useRouter();
      const route = useRoute();
      const code = route.params.code;
      const { setTitle } = useTabs();

      const columns = [
        {
          label: '服务商编号',
          prop: 'serviceProviderCode',
          formatter: (row) => {
            return row.serviceProviderCode || '/';
          },
        },
        {
          label: '服务渠道编号',
          prop: 'serviceChannelCode',
          formatter: (row) => {
            return row.serviceChannelCode || '/';
          },
        },
        {
          label: 'API渠道代码',
          prop: 'apiCode',
          formatter: (row) => {
            return row.apiCode || '/';
          },
        },
        {
          label: 'API服务',
          prop: 'apiServiceCode',
          formatter: (row) => {
            return row.apiServiceCode || '/';
          },
        },
        {
          label: '仓库编号',
          prop: 'warehouseCode',
          formatter: (row) => {
            return row.warehouseCode || '/';
          },
        },
        {
          label: '产品组编号',
          prop: 'teamCode',
          formatter: (row) => {
            return row.teamCode || '/';
          },
        },
        {
          label: '签名服务',
          prop: 'signature',
          formatter: (row) => {
            const status = ['否', '成年', '未成年'][row.signature];
            return h('span', {}, [status]);
          },
        },
        {
          label: '保险服务',
          prop: 'insurance',
          formatter: (row) => {
            const status = ['否', '是'][row.insurance];
            return h('span', {}, [status]);
          },
        },
        {
          label: 'ODA编号',
          prop: 'verifyRemote',
          formatter: (row) => {
            return row.verifyRemote || '/';
          },
        },
        {
          label: '状态',
          prop: 'status',
          formatter: (row) => {
            const status = ['失效', '生效'][row.status];
            const colorName = ['text-invalid', 'text-active'][row.status];
            return h('span', { className: colorName }, [status]);
          },
        },
      ];

      const loading = ref(false);
      const list = ref<ChannelListItem[]>([]);
      const form = reactive({
        status: '',
        serviceProviderCode: '',
        serviceChannelCode: '',
        teamCode: '',
      });
      const pageParams = pageData();
      const statusList = ref([
        { id: 1, label: '生效', value: '1' },
        { id: 1, label: '失效', value: '0' },
      ]);
      const selectData = reactive<{
        odaSelectList: OdaItem[];
        serviceCodeList: ServiceListItem[];
        warehouseList: WarehouseItem[];
        productList: ProductTeamItem[];
        apiList: ServiceSelectListItem[];
      }>({
        serviceCodeList: [], // 服务商编号
        warehouseList: [], // 仓库编号 可多选
        productList: [], // 产品组编号
        odaSelectList: [], // oda下拉列表
        apiList: [], // api 服务
      });

      const channelForm = reactive({
        visible: false,
        loading: false,
        title: '新增',
        isEdit: false,
        curData: null,
        editLoading: false,
        data: {
          serviceProviderCode: '', // 服务商编号
          serviceChannelCode: '', // 服务渠道编号
          apiCode: '', // api服务渠道代码
          apiServiceCode: '', // api 服务代码
          warehouseCodeList: [], // 变量存储
          warehouseCode: '', // 仓库编号 // 可多选
          teamCode: '', // 产品组编号
          verifyRemote: '', // oda编号
          signature: '0', // 签名服务(0否，1成年2未成年)
          insurance: '0', // 保险服务(0否，1是)
          startWeightRange: '', // 起始重量
          endWeightRange: '', // 结束重量
          serviceChannelId: 0,
        },
        rules: {
          serviceProviderCode: [{ required: true, message: '服务商不能为空', trigger: 'change' }],
          serviceChannelCode: [{ required: true, message: '服务渠道编号不能为空', trigger: 'blur' }],
          apiCode: [{ required: true, message: 'api渠道代码不能为空', trigger: 'change' }],
          apiServiceCode: [{ required: true, message: 'api服务不能为空', trigger: 'change' }],
          warehouseCodeList: [{ required: true, message: '仓库不能为空', trigger: 'change' }],
          teamCode: [{ required: true, message: '产品编号不能为空', trigger: 'change' }],
          signature: [{ required: true, message: '签名服务', trigger: 'change' }],
          insurance: [{ required: true, message: '保险服务不能为空', trigger: 'change' }],
          startWeightRange: [
            {
              required: true,
              validator: (_, value, callback) => {
                if ((value !== 0 && !value) || value === '') {
                  callback(new Error('请输入起始重量'));
                } else {
                  if (channelForm.data.endWeightRange !== '') {
                    channelFormRef?.value.validateField('endWeightRange');
                  }
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
          endWeightRange: [
            {
              required: true,
              validator: (_, value, callback) => {
                if (!value || value === '') {
                  callback(new Error('请输入结束重量'));
                } else if (+value < +channelForm.data.startWeightRange) {
                  callback(new Error('结束重量不能小于起始重量!'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
        },
      });
      const channelFormRef = ref();
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const searchFormRef = ref();

      const loadList = async () => {
        loading.value = true;
        try {
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            status: form.status,
            serviceProviderCode: route.params.code || form.serviceProviderCode,
            serviceChannelCode: form.serviceChannelCode,
            teamCode: form.teamCode,
          };
          const { list: _list, total, pageNum } = await getChannelList(params);
          list.value = _list.map((e) => {
            e.isActive = !!Number(e.status);
            return e;
          });
          pageParams.pageNum = pageNum;
          pageParams.total = total;
        } catch (e) {
          list.value = [];
          pageParams.pageNum = 1;
          pageParams.total = 0;
          console.error(e);
        } finally {
          loading.value = false;
        }
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const getSelectData = async () => {
        selectData.warehouseList = await useWarehouseList();
        selectData.apiList = await loadApiList(code);
        if (selectData.apiList.length > 1) {
          return;
        }
        channelForm.data.apiServiceCode = selectData.apiList[0]?.apiServiceCode;
      };

      const addShow = () => {
        formResetFields(channelFormRef);
        channelForm.title = '新增';
        channelForm.isEdit = false;
        channelForm.curData = null;
        channelForm.visible = true;
        channelForm.data.serviceProviderCode = route.params.code as any;
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const operate = async (item, type) => {
        const { serviceChannelId, isActive } = item;
        channelForm.curData = item;
        if (type === 'edit') {
          if (channelForm.editLoading) return;
          channelForm.editLoading = true;
          channelForm.title = '编辑';
          channelForm.isEdit = true;
          channelForm.visible = true;
        } else if (type === 'status') {
          const status = isActive ? '0' : '1';
          const message = `请确认是否${isActive ? '停用' : '启用'}该渠道`;
          try {
            createConfirm({
              title: `${isActive ? '停用' : '启用'}`,
              message,
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    await changeChannelStatus({ id: serviceChannelId, status });
                    createBriefSuccessMsg(`${isActive ? '停用' : '启用'}成功`);
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
        } else {
          await router.push({
            name: 'ChannelDetail',
            params: {
              id: serviceChannelId,
              code: item.serviceChannelCode,
            },
          });
        }
      };

      const onOpened = async () => {
        await getSelectData();
        if (channelForm.isEdit) {
          try {
            const data = await editChannelById({
              id: (channelForm.curData as any).serviceChannelId,
            });
            channelForm.data.serviceProviderCode = data.serviceProviderCode;
            channelForm.data.serviceChannelCode = data.serviceChannelCode;
            channelForm.data.apiCode = data.apiCode;
            channelForm.data.apiServiceCode = data.apiServiceCode as any;
            channelForm.data.warehouseCodeList = data.warehouseCode.split(',') as any;
            channelForm.data.teamCode = data.teamCode;
            channelForm.data.verifyRemote = data.verifyRemote;
            channelForm.data.signature = data.signature;
            channelForm.data.insurance = data.insurance;
            channelForm.data.startWeightRange = data.startWeightRange as any;
            channelForm.data.endWeightRange = data.endWeightRange as any;
          } catch (e) {
            console.error(e);
          }
        }
        channelForm.editLoading = false;
      };

      const onSubmit = async () => {
        await formValidate(channelFormRef);

        channelForm.data.warehouseCode = channelForm.data.warehouseCodeList.join(',');
        const data = { ...channelForm.data };
        if (channelForm.isEdit) {
          data.serviceChannelId = (channelForm.curData as any).serviceChannelId;
          await editChannel(data);
          createBriefSuccessMsg('编辑成功');
        } else {
          await addChannel(data);
          createBriefSuccessMsg('添加成功');
        }
        await loadList();
        channelForm.visible = false;
      };

      onMounted(async () => {
        await setTitle(code + '下的渠道管理');
        selectData.serviceCodeList = await getServiceSelectList();
        selectData.productList = await useProductTeamList();
        selectData.odaSelectList = await useOdaList();
        await loadList();
      });

      return {
        columns,
        code,
        loading,
        list,
        form,
        pageParams,
        statusList,
        selectData,
        channelForm,
        channelFormRef,
        searchFormRef,

        onPageChange,
        onReset,
        onSearch,
        operate,
        addShow,
        onOpened,
        onSubmit,
      };
    },
  });
</script>

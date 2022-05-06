<template>
  <div class="fuel" v-loading="loading">
    <el-form :model="form" size="small" inline class="filter-form" ref="searchFormRef">
      <el-form-item label="产品组" prop="teamId">
        <el-select placeholder="请选择产品组" v-model="form.teamId" clearable filterable>
          <el-option
            v-for="item in selectData.productList"
            :key="item.teamId"
            :label="item.teamName"
            :value="item.teamId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" v-model="form.status" clearable>
          <el-option v-for="item in selectData.statusList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="生效状态" prop="effectiveState">
        <el-select placeholder="请选择生效状态" v-model="form.effectiveState" clearable>
          <el-option
            v-for="item in selectData.effectiveStateList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="addShow" v-auth="['system:fuel:add']">新增</add-button>
    </div>

    <el-table :data="list" size="small" border stripe v-loading="loading">
      <el-table-column prop="productLabel" label="所属产品组" />
      <el-table-column prop="ratio" label="燃油比率" width="120" />
      <el-table-column prop="effectiveState" label="生效状态" width="120">
        <template #default="scope">
          <effective-status-text :effectiveState="scope.row.effectiveState" />
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="生效时间" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <status-text :status="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <template v-if="scope.row.status === 0">
            <el-button type="text" size="small" @click="operate(scope.row, 'edit')" v-auth="['system:fuel:add']">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="operate(scope.row, 'pub')" v-auth="['system:fuel:pub']">
              发布
            </el-button>
            <el-button type="text" size="small" @click="operate(scope.row, 'del')" v-auth="['system:fuel:pub']">
              作废
            </el-button>
          </template>
          <template v-if="scope.row.status === 1">
            <el-button type="text" size="small" @click="operate(scope.row, 'del')" v-auth="['system:fuel:pub']">
              作废
            </el-button>
            <el-button type="text" size="small" @click="operate(scope.row, 'save')" v-auth="['system:fuel:add']">
              另存为
            </el-button>
          </template>
          <el-button type="text" size="small" @click="operate(scope.row, 'log')">费率日志</el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog title="日志" width="900px" v-model="fuelForm.logVisible">
      <el-table :data="logList" size="small" border stripe>
        <el-table-column prop="ratioId" label="ratioId" />
        <el-table-column prop="ratioLogId" label="ratioLogId" />
        <el-table-column prop="ratioOld" label="旧燃油比率" />
        <el-table-column prop="ratioNew" label="新燃油比率" />
        <el-table-column prop="createTime" label="操作时间" />
        <el-table-column prop="createBy" label="操作人" />
      </el-table>
    </basic-dialog>

    <basic-dialog
      :title="fuelForm.title"
      @submit="onSubmit"
      @close="onClose"
      v-model="fuelForm.visible"
      width="480px"
      @opened="onOpened"
    >
      <el-form
        label-width="120px"
        size="small"
        :model="fuelForm.data"
        :rules="fuelForm.rules"
        v-loading="fuelForm.loading"
        ref="fuelFormRef"
      >
        <el-form-item label="所属产品组" prop="teamId">
          <el-select placeholder="请选择所属产品组" v-model="fuelForm.data.teamId" clearable filterable>
            <el-option
              v-for="item in selectData.productList"
              :key="item.teamId"
              :label="item.teamName"
              :value="item.teamId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="燃油比率" prop="ratio">
          <el-input v-model="fuelForm.data.ratio" placeholder="请输入燃油比率" />
        </el-form-item>
        <el-form-item label="生效时间" prop="startTime">
          <el-date-picker v-model="fuelForm.data.startTime" type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <pub-dialog v-model="pubData.visible" :data="pubData.data" @pub="pubSubmit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useProductTeamList } from '@/hooks/select/useSelect';
  import { findNameById, formResetFields, formValidate } from '@/utils/tools';
  import { fillDateTime } from '@/utils/dateUtil';
  import { ProductTeamItem } from '@/api/sys/model/selectModel';
  import {
    AddFuel,
    changeFuelStatus,
    EditFuel,
    getLogList,
    getPubList,
    getSearchList,
    pubFuelStatus,
  } from '@/api/logistics/product/fuel';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { PubDialog } from '@/components/Dialog';
  import { useMessage } from '@/hooks/web/useMessage';
  import { FuelListItem, LogListReturnType, PubListType, PubParams } from '@/api/logistics/product/model/fuelModel';

  export default defineComponent({
    name: 'FuelManagement',
    components: { PubDialog },
    setup() {
      const loading = ref(false);
      const list = ref<FuelListItem[]>([]);
      const logList = ref<LogListReturnType[]>([]);
      const form = reactive({
        ratioType: -1, // 燃油比率类型（0成本，1销售）
        teamId: '', // 产品组id
        status: '', // 状态（0草稿1发布2作废）
        effectiveState: '', // 生效状态（0未生效1生效2过期）
      });

      type StatusType = {
        id: number;
        value: number;
        label: string;
      };
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const searchFormRef = ref();
      const fuelFormRef = ref();
      const selectData = reactive<{
        productList: ProductTeamItem[];
        statusList: StatusType[];
        effectiveStateList: StatusType[];
      }>({
        productList: [],
        statusList: [],
        effectiveStateList: [],
      });

      const fuelForm = reactive({
        visible: false,
        logVisible: false,
        curData: null,
        loading: false,
        title: '新增',
        isEdit: false,
        isSave: false,
        data: {
          teamId: '', // 产品组id
          ratio: '', // 燃油比率
          ratioType: -1, // 燃油比率类型（0成本，1销售）
          startTime: '', // 生效时间
          endTime: '', // 结束时间
          ratioId: 0,
        },
        rules: {
          teamId: [{ required: true, message: '请选择所属产品组', trigger: 'change' }],
          ratio: [
            {
              required: true,
              validator: (_, value, callback) => {
                if (!value || value === '') {
                  callback(new Error('请输入燃油比率'));
                } else if (+value <= 0 || isNaN(+value)) {
                  callback(new Error('燃油比率须大于0'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
          ratioType: [{ required: true, message: '请选择燃油比率类型', trigger: 'change' }],
          startTime: [{ required: true, message: '请输入生效时间', trigger: 'change' }],
          endTime: [{ required: true, message: '请输入结束时间', trigger: 'change' }],
        },
      });
      const pageParams = pageData();

      const pubData = reactive({
        canClick: true,
        visible: false, // 是否显示
        params: {}, // request params
        data: [], // 获取的数据
      });

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const addShow = () => {
        formResetFields(fuelFormRef);
        fuelForm.title = '新增';
        fuelForm.isEdit = false;
        fuelForm.isSave = false;
        fuelForm.visible = true;
      };

      const onClose = () => {
        formResetFields(fuelFormRef);
      };

      const loadList = async () => {
        loading.value = true;
        try {
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            ratioType: 1,
            teamId: form.teamId,
            status: form.status,
            effectiveState: form.effectiveState,
          };
          const { list: _list, total, pageNum } = await getSearchList(params);
          list.value = _list;
          pageParams.pageNum = pageNum;
          pageParams.total = total;

          if (selectData.productList.length) {
            list.value = list.value.map((e) => {
              e.productLabel = findNameById(e.teamId, selectData.productList, 'teamId', 'teamName');
              return e;
            });
          }
        } catch (e) {
          list.value = [];
          pageParams.total = 0;
          pageParams.pageNum = 1;
          loading.value = false;
        }
        loading.value = false;
      };

      const loadLogList = async (item) => {
        try {
          logList.value = await getLogList({ ratioId: item.ratioId });
        } catch (e) {
          logList.value = [];
          console.error(e);
        }
      };

      const onSubmit = async () => {
        await formValidate(fuelFormRef);
        try {
          const date = new Date(fuelForm.data.startTime);
          date.setFullYear(date.getFullYear() + 1);
          date.setDate(date.getDate() - 1);

          const { startTime, endTime } = fillDateTime(fuelForm.data.startTime, date);
          fuelForm.data.startTime = startTime;
          fuelForm.data.endTime = endTime;
          const data = { ...fuelForm.data };
          fuelForm.isEdit && (data.ratioId = (fuelForm.curData as any).ratioId);
          data.ratioType = 1;

          if (fuelForm.isEdit) {
            await EditFuel(data);
            createBriefSuccessMsg('编辑燃油费成功');
          } else {
            await AddFuel(data);
            createBriefSuccessMsg('添加燃油费成功');
          }
          fuelForm.visible = false;
          await loadList();
        } catch (e) {
          console.error(e);
        }
      };

      const onOpened = () => {
        if (fuelForm.isEdit || fuelForm.isSave) {
          const data = fuelForm.curData as any;
          fuelForm.data.teamId = data.teamId;
          fuelForm.data.ratio = data.ratio;
          fuelForm.data.ratioType = data.ratioType;
          fuelForm.data.startTime = data.startTime;
          fuelForm.data.endTime = data.endTime;
        }
        fuelForm.loading = false;
      };

      const editShow = (item, type) => {
        if (type === 'save') {
          fuelForm.title = '另存为';
          fuelForm.isSave = true;
          fuelForm.isEdit = false;
        } else {
          fuelForm.title = '编辑';
          fuelForm.isEdit = true;
          fuelForm.isSave = false;
        }
        fuelForm.curData = item;
        fuelForm.visible = true;
      };

      const pubSubmit = async () => {
        (pubData.params as PubParams).verify = 1; // 二次验证结果改为 1
        try {
          await pubFuelStatus(pubData.params as PubParams);
          await loadList();
          pubData.visible = false;
          createBriefSuccessMsg('发布成功！');
        } catch (e) {
          console.error(e);
        }
      };

      const operate = async (item, type) => {
        switch (type) {
          case 'edit':
          case 'save':
            editShow(item, type);
            fuelForm.loading = true;
            break;
          case 'log':
            await loadLogList(item);
            fuelForm.logVisible = true;
            break;
          case 'del':
            try {
              createConfirm({
                title: `作废`,
                message: '请确认是否要作废？',
                type: 'info',
                beforeClose: async (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    try {
                      await changeFuelStatus({ ratioId: +item.ratioId, status: 2 });
                      createBriefSuccessMsg('作废成功');
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
            break;
          case 'pub':
            try {
              const params = {
                ratioId: +item.ratioId,
                status: 1,
                verify: 0,
              };
              const data = await getPubList(params);
              pubData.params = params;
              (pubData.data as PubListType[]) = data;
              pubData.visible = true;
            } catch (e) {
              console.error(e);
            }
            break;
        }
      };

      onMounted(async () => {
        selectData.productList = await useProductTeamList();
        await loadList();
        selectData.statusList = [
          { id: 1, value: 0, label: '草稿' },
          { id: 2, value: 1, label: '发布' },
          { id: 3, value: 2, label: '作废' },
        ];
        selectData.effectiveStateList = [
          { id: 1, value: 0, label: '未生效' },
          { id: 2, value: 1, label: '生效' },
          { id: 3, value: 2, label: '过期' },
        ];

        if (list.value.length) {
          list.value = list.value.map((e) => {
            e.productLabel = findNameById(e.teamId, selectData.productList, 'teamId', 'teamName');
            return e;
          });
        }
      });

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      return {
        form,
        selectData,
        fuelForm,
        list,
        pageParams,
        loading,
        searchFormRef,
        logList,
        fuelFormRef,
        pubData,

        onPageChange,
        pubSubmit,
        onReset,
        onSearch,
        operate,
        addShow,
        onSubmit,
        onClose,
        onOpened,
      };
    },
  });
</script>

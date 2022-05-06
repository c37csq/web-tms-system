<template>
  <div class="zoning-scheme">
    <el-form :model="form" ref="searchFormRef" size="small" inline class="filter-form">
      <el-form-item label="所属产品组" prop="teamId">
        <el-select placeholder="请选择所属产品组" v-model="form.teamId" clearable filterable>
          <el-option
            v-for="item in selectData.productList"
            :key="item.teamId"
            :label="item.teamName"
            :value="item.teamId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分区方案名称" prop="schemeName">
        <el-input v-model="form.schemeName" placeholder="请输入分区方案名称" clearable />
      </el-form-item>
      <el-form-item label="分区方案编号" prop="schemeCode">
        <el-input v-model="form.schemeCode" placeholder="请输入分区方案编号" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" v-model="form.status" clearable>
          <el-option v-for="item in selectData.statusList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="addShow" v-auth="['system::zoningScheme:add']">新增</add-button>
    </div>

    <el-table :data="list" size="small" border stripe v-loading="loading">
      <el-table-column prop="productLabel" label="所属产品组" />
      <el-table-column prop="schemeName" label="分区方案名称" />
      <el-table-column prop="schemeCode" label="分区方案编号" />
      <el-table-column prop="startZipCode" label="起始邮编" />
      <el-table-column prop="endZipCode" label="结束邮编" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <status-text :status="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <template v-if="scope.row.status === 0">
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'edit')"
              v-auth="['system::zoningScheme:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'pub')"
              v-auth="['system::zoningScheme:pub']"
            >
              发布
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'del')"
              v-auth="['system::zoningScheme:del']"
            >
              作废
            </el-button>
          </template>
          <template v-if="scope.row.status !== 0">
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'info')"
              v-auth="['system:zoningSchemeDetail:view']"
            >
              详情
            </el-button>
            <el-button
              v-if="scope.row.status !== 2"
              type="text"
              size="small"
              @click="operate(scope.row, 'del')"
              v-auth="['system::zoningScheme:del']"
            >
              作废
            </el-button>
          </template>
          <el-button
            type="text"
            size="small"
            @click="operate(scope.row, 'zone')"
            v-auth="['system:zoningSchemeDetail:view']"
          >
            收费分区
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
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
      width="480px"
      v-model="schemeForm.visible"
      :title="schemeForm.title"
    >
      <el-form
        label-width="120px"
        size="small"
        :model="schemeForm.data"
        :rules="schemeForm.rules"
        v-loading="schemeForm.editLoading"
        ref="schemeFormRef"
      >
        <el-form-item label="所属产品组" prop="teamId">
          <el-select placeholder="请选择所属产品组" v-model="schemeForm.data.teamId" clearable filterable>
            <el-option
              v-for="item in selectData.productList"
              :key="item.teamId"
              :label="item.teamName"
              :value="item.teamId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分区方案编号" prop="schemeCode">
          <el-input
            v-model="schemeForm.data.schemeCode"
            placeholder="请输入分区方案编号"
            :disabled="schemeForm.isEdit"
          />
        </el-form-item>
        <el-form-item label="分区方案名称" prop="schemeName">
          <el-input v-model="schemeForm.data.schemeName" placeholder="请输入分区方案名称" />
        </el-form-item>
        <el-form-item label="起始邮编" prop="startZipCode">
          <el-input v-model="schemeForm.data.startZipCode" placeholder="请输入起始邮编" />
        </el-form-item>
        <el-form-item label="结束邮编" prop="endZipCode">
          <el-input v-model="schemeForm.data.endZipCode" placeholder="请输入结束邮编" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, shallowReactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProductTeamList } from '@/hooks/select/useSelect';
  import { ProductTeamItem } from '@/api/sys';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { addScheme, changeSchemeStatus, editScheme, getSchemeList } from '@/api/logistics/product';
  import { findNameById, formResetFields, formValidate } from '@/utils/tools';
  import { SchemeListItem } from '@/api/logistics/product/model/schemeModel';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'ZoningScheme',
    setup() {
      const router = useRouter();
      const loading = ref(true);
      const list = ref<SchemeListItem[]>([]);
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const logList = ref([]);
      const form = reactive({
        schemeName: '', // 分区方案名称
        schemeCode: '', // 分区方案编号
        teamId: '', // 产品组id
        status: '', // 状态（0草稿1发布2作废）
      });
      const selectData = shallowReactive<{
        productList: ProductTeamItem[];
        statusList: ListType[];
      }>({
        productList: [],
        statusList: [],
      });
      const schemeForm = reactive({
        visible: false,
        submitLoading: false,
        editLoading: false,
        title: '新增',
        isEdit: false,
        curData: null,
        data: {
          teamId: '', // 产品组id
          schemeCode: '', // 分区方案编号
          schemeName: '', // 分区方案名称
          startZipCode: '', // 起始邮编
          endZipCode: '', // 结束邮编
          schemeId: 0,
        },
        rules: {
          teamId: [{ required: true, message: '请选择产品组', trigger: 'change' }],
          schemeCode: [{ required: true, message: '请输入分区方案编号', trigger: 'blur' }],
          schemeName: [{ required: true, message: '请输入分区方案名称', trigger: 'blur' }],
          startZipCode: [{ required: true, message: '请输入起始邮编', trigger: 'blur' }],
          endZipCode: [{ required: true, message: '请输入结束邮编', trigger: 'blur' }],
        },
      });
      const schemeFormRef = ref();
      const searchFormRef = ref();
      const pageParams = pageData();

      type ListType = {
        id: number;
        value: number;
        label: string;
      };

      const loadList = async () => {
        loading.value = true;
        try {
          selectData.statusList = [
            { id: 1, value: 0, label: '草稿' },
            { id: 2, value: 1, label: '发布' },
            { id: 3, value: 2, label: '作废' },
          ];
          !selectData.productList.length && (selectData.productList = await useProductTeamList(''));
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            schemeName: form.schemeName,
            schemeCode: form.schemeCode,
            teamId: form.teamId,
            status: form.status,
          };
          const { list: _list, pageNum, total } = await getSchemeList(params);
          list.value =
            _list &&
            _list.map((e) => {
              e.productLabel = findNameById(e.teamId, selectData.productList, 'teamId', 'teamName');
              return e;
            });
          pageParams.pageNum = pageNum;
          pageParams.total = total;
        } catch (e) {
          console.error(e);
          list.value = [];
          pageParams.total = 0;
        }
        loading.value = false;
      };

      const onOpened = () => {
        if (schemeForm.isEdit) {
          const data = schemeForm.curData as any;
          schemeForm.data.teamId = data.teamId;
          schemeForm.data.schemeCode = data.schemeCode;
          schemeForm.data.schemeName = data.schemeName;
          schemeForm.data.startZipCode = data.startZipCode;
          schemeForm.data.endZipCode = data.endZipCode;
        }
        schemeForm.editLoading = false;
      };

      const onSubmit = async () => {
        await formValidate(schemeFormRef);
        try {
          const data = { ...schemeForm.data };
          if (schemeForm.isEdit) {
            data.schemeId = (schemeForm.curData as any).schemeId;
            await editScheme(data);
            createBriefSuccessMsg('编辑分区方案成功');
          } else {
            await addScheme(data);
            createBriefSuccessMsg('添加分区方案成功');
          }
          await loadList();
          schemeForm.visible = false;
        } catch (e) {
          console.error(e);
        }
      };

      const onClose = () => {
        formResetFields(schemeFormRef);
      };

      const addShow = () => {
        schemeForm.title = '新增';
        schemeForm.isEdit = false;
        schemeForm.visible = true;
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const operate = async (item, type) => {
        switch (type) {
          case 'edit':
            schemeForm.visible = true;
            schemeForm.curData = { ...item };
            schemeForm.title = '编辑';
            schemeForm.isEdit = true;
            schemeForm.editLoading = true;
            break;
          case 'pub':
          case 'del':
            try {
              const status = type === 'pub' ? 1 : 2;
              const title = type === 'pub' ? '发布' : '作废';
              const schemeId = +item.schemeId;
              const message = `请确认是否${type === 'pub' ? '发布' : '作废'}`;
              try {
                createConfirm({
                  title,
                  message,
                  type: 'info',
                  beforeClose: async (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      try {
                        await changeSchemeStatus({ schemeId, status });
                        createBriefSuccessMsg(`${title}成功`);
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
            } catch (e) {
              console.error(e);
            }
            break;
          case 'info':
          case 'zone':
            await router.push({
              name: 'ZoningSchemeDetail',
              params: {
                id: item.schemeId,
                status: item.status,
                name: item.schemeName,
                type,
                productName: findNameById(item.teamId, selectData.productList, 'teamId', 'teamName'),
              },
            });
            break;
        }
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      onMounted(async () => {
        await loadList();
      });

      return {
        loading,
        pageParams,
        list,
        logList,
        form,
        selectData,
        schemeForm,
        schemeFormRef,
        searchFormRef,

        onSearch,
        onClose,
        onSubmit,
        onOpened,
        onReset,
        onPageChange,
        operate,
        addShow,
      };
    },
  });
</script>

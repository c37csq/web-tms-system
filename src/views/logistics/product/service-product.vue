<template>
  <div class="service-product">
    <div class="mb-20px">
      <add-button @click="addShow" v-auth="['system:serviceProduct:add']">新增</add-button>
    </div>

    <el-table :data="list" size="small" row-key="id" border stripe v-loading="loading">
      <el-table-column prop="teamCode" label="产品组编号" />
      <el-table-column prop="teamName" label="产品组名称" />
      <el-table-column prop="operatorName" label="快递名称" />
      <el-table-column prop="operate" label="操作" v-auth="['system:serviceProduct:edit', 'system:serviceProduct:del']">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="operate(scope.row, 'edit')"
            v-auth="['system:serviceProduct:edit']"
          >
            编辑
          </el-button>
          <el-button type="text" size="small" @click="operate(scope.row, 'del')" v-auth="['system:serviceProduct:del']">
            删除
          </el-button>
          <el-button type="text" size="small" @click="operate(scope.row, 'info')"> 详情 </el-button>
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
      :title="form.title"
      width="420px"
      v-model="form.visible"
    >
      <el-form
        v-loading="form.loading"
        label-width="120px"
        size="small"
        :model="form.data"
        :rules="form.rules"
        ref="formRef"
      >
        <el-form-item label="产品组编号" prop="teamCode">
          <el-input v-model="form.data.teamCode" placeholder="请输入产品组编号" :disabled="form.isEdit" />
        </el-form-item>
        <el-form-item label="产品组名称" prop="teamName">
          <el-input v-model="form.data.teamName" placeholder="请输入产品组名称" />
        </el-form-item>
        <el-form-item label="快递公司" prop="operatorName">
          <el-select placeholder="选择快递公司" v-model="form.data.operatorName" clearable filterable>
            <el-option v-for="item in operatorList" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { addService, delService, editService, getServiceList } from '@/api/logistics/product';
  import { pageData, PageChangeParams } from '@/components/Pagination';
  import { useRouter } from 'vue-router';
  import { serviceListItem } from '@/api/logistics/product/model/serviceModel';
  import { useExpressList } from '@/hooks/select/useSelect';
  import { ExpressItem } from '@/api/sys';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';
  export default defineComponent({
    name: 'ServiceProductManagement',
    components: { BasicDialog },
    setup() {
      const router = useRouter();
      const loading = ref(false);
      const list = ref<serviceListItem[]>([]);
      const operatorList = ref<ExpressItem[]>([]);
      const form = reactive({
        title: '新增',
        isEdit: false,
        visible: false,
        loading: false,
        curData: null,
        data: {
          teamId: '',
          teamCode: '',
          teamName: '',
          operatorName: '',
        },
        rules: {
          teamCode: [{ required: true, message: '产品组编号不能为空', trigger: 'blur' }],
          teamName: [{ required: true, message: '产品组名称不能为空', trigger: 'blur' }],
          operatorName: [{ required: true, message: '快递公司不能为空', trigger: 'change' }],
        },
      });
      const formRef = ref();
      const pageParams = pageData();
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const selectData = async () => {
        try {
          operatorList.value = await useExpressList();
        } catch (e) {
          operatorList.value = [];
          console.error(e);
        }
      };

      const operate = (item, type) => {
        form.curData = item;
        if (type === 'del') {
          try {
            createConfirm({
              title: `删除`,
              message: '请确认是否要删除？',
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    await delService({ teamId: item.teamId });
                    createBriefSuccessMsg('删除成功');
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
        } else if (type === 'edit') {
          form.title = '编辑';
          form.loading = true;
          form.isEdit = true;
          form.visible = true;
        } else {
          router.push({
            name: 'ServiceProductDetail',
            params: { id: item.teamId, code: item.teamCode, name: item.teamName },
          });
        }
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const onSubmit = async () => {
        await formValidate(formRef);
        form.loading = true;
        try {
          const data = form.data;
          if (form.isEdit) {
            await editService(data);
            createBriefSuccessMsg('编辑成功！');
          } else {
            await addService(data);
            createBriefSuccessMsg('添加成功！');
          }
          await loadList();
          form.visible = false;
        } catch (e) {
          console.error(e);
          form.loading = false;
        }
      };

      const onClose = () => {
        formResetFields(formRef);
      };

      const onOpened = () => {
        if (form.isEdit) {
          const data = form.curData as any;
          form.data.teamId = data.teamId;
          form.data.teamCode = data.teamCode;
          form.data.teamName = data.teamName;
          form.data.operatorName = data.operatorName;
        }
        form.loading = false;
      };

      const loadList = async () => {
        try {
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
          };
          const { list: _list, total, pageNum } = await getServiceList(params);
          list.value = _list;
          pageParams.pageNum = pageNum;
          pageParams.total = total;
        } catch (e) {
          list.value = [];
          pageParams.total = 0;
          pageParams.pageNum = 1;
          loading.value = false;
        }
        loading.value = false;
      };

      const addShow = () => {
        formResetFields(formRef);
        form.title = '新增';
        form.isEdit = false;
        form.visible = true;
      };

      onMounted(async () => {
        await loadList();
        await selectData();
      });

      return {
        list,
        pageParams,
        operatorList,
        loading,
        formRef,
        form,

        onPageChange,
        onSubmit,
        onClose,
        onOpened,
        operate,
        addShow,
      };
    },
  });
</script>

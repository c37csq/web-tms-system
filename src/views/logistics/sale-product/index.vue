<template>
  <div class="sale-product" v-loading="loading">
    <el-form size="small" inline class="filter-form" :model="form" ref="searchFormRef">
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" v-model="form.status" clearable>
          <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品组编号" prop="teamCode">
        <el-select
          placeholder="请选择产品组编号"
          :model-value="form.teamCode"
          @change="handleChangeProduct"
          clearable
          filterable
        >
          <el-option
            v-for="item in selectData.productList"
            :key="item.teamId"
            :label="item.teamCode"
            :value="item.teamCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="form.teamCode" label="分区方案编号" prop="schemeCode">
        <el-select placeholder="请选择分区方案编号" v-model="form.schemeCode" clearable filterable>
          <el-option
            v-for="item in selectData.schemeList"
            :key="item.schemeId"
            :label="item.schemeCode"
            :value="item.schemeCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售产品中文名称" prop="promotingProductsName">
        <el-input v-model="form.promotingProductsName" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>
    <div class="mb-20px">
      <add-button @click="addShow" v-auth="['logistics:saleProduct:add']" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
        :width="item.width"
      />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <span v-if="scope.row.status === '0'" class="text-invalid">失效</span>
          <span v-if="scope.row.status === '1'" class="text-active">生效</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operate"
        label="操作"
        width="150"
        v-auth="['logistics:saleProduct:edit', 'logistics:saleProduct:operate', 'logistics:sale-product-detail:view']"
      >
        <template #default="scope">
          <div>
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'edit')"
              v-auth="['logistics:saleProduct:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'info')"
              v-auth="['logistics:sale-product-detail:view']"
            >
              详情
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="operate(scope.row, 'status')"
              v-auth="['logistics:saleProduct:operate']"
            >
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
      v-model="saleProductForm.visible"
      :title="saleProductForm.title"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        size="small"
        label-width="140px"
        inline
        v-loading="saleProductForm.editLoading"
        :model="saleProductForm.data"
        :rules="saleProductForm.rules"
        ref="saleProductFormRef"
      >
        <el-form-item label="产品组编号" prop="teamCode">
          <el-select
            placeholder="请选择产品组编号"
            :model-value="saleProductForm.data.teamCode"
            @change="handleChangeFormProduct"
            filterable
          >
            <el-option
              v-for="item in selectData.productList"
              :key="item.teamId"
              :label="item.teamCode"
              :value="item.teamCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="ODA编号" prop="verifyRemote" v-if="productChanged">
          <el-input disabled :model-value="saleProductForm.data.verifyRemote" />
        </el-form-item>
        <el-form-item label="仓库代码" prop="warehouseCode" v-if="productChanged">
          <el-select
            placeholder="请选择仓库"
            :model-value="saleProductForm.data.warehouseCode"
            @change="onChangeWarehouse"
            multiple
            filterable
          >
            <el-option
              v-for="item in selectData.warehouseList"
              :key="item.warehouseId"
              :label="item.warehouseCode"
              :value="item.warehouseCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分区方案编号" prop="schemeCode" v-if="productChanged">
          <el-select v-model="saleProductForm.data.schemeCode" multiple disabled />
        </el-form-item>

        <el-form-item label="销售产品编号" prop="promotingProductsCode">
          <el-input v-model="saleProductForm.data.promotingProductsCode" placeholder="请输入销售产品编号" />
        </el-form-item>
        <el-form-item label="销售产品中文名称" prop="promotingProductsName">
          <el-input v-model="saleProductForm.data.promotingProductsName" placeholder="请输入销售产品中文名称" />
        </el-form-item>
        <el-form-item label="销售产品英文名称" prop="promotingProductsNameEn">
          <el-input v-model="saleProductForm.data.promotingProductsNameEn" placeholder="请输入销售产品英文名称" />
        </el-form-item>
        <el-form-item label="绑定客户" prop="clientCode">
          <el-select placeholder="请选择客户" v-model="saleProductForm.data.clientCode" clearable filterable multiple>
            <el-option
              v-for="item in selectData.enterpriseList"
              :key="item.id"
              :label="item.enterpriseAbbr"
              :value="item.enterpriseRecordCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始重量" prop="startWeightRange">
          <el-input v-model="saleProductForm.data.startWeightRange" placeholder="请输入起始重量" />
        </el-form-item>
        <el-form-item label="结束重量" prop="endWeightRange">
          <el-input v-model="saleProductForm.data.endWeightRange" placeholder="请输入结束重量" />
        </el-form-item>
        <el-form-item label="货运最低时效" prop="freightMinAge">
          <el-input v-model="saleProductForm.data.freightMinAge" placeholder="请输入货运最低时效" />
        </el-form-item>
        <el-form-item label="货运最佳时效" prop="freightMaxAge">
          <el-input v-model="saleProductForm.data.freightMaxAge" placeholder="请输入货运最佳时效" />
        </el-form-item>
        <el-form-item label="默认填充电话" prop="defaultPhone">
          <el-input v-model="saleProductForm.data.defaultPhone" placeholder="请输入默认填充电话" />
        </el-form-item>
        <el-form-item label="默认填充邮编" prop="defaultZipCode">
          <el-input v-model="saleProductForm.data.defaultZipCode" placeholder="请输入默认填充邮编" />
        </el-form-item>
        <el-form-item label="签名服务" prop="ageVerificationService">
          <el-select placeholder="请选择签名服务" v-model="saleProductForm.data.ageVerificationService" filterable>
            <el-option label="不签名" value="0" />
            <el-option label="成年" value="1" />
            <el-option label="未成年" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="保险服务" prop="insuranceService">
          <el-select placeholder="请选择保险服务" v-model="saleProductForm.data.insuranceService" filterable>
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, reactive } from 'vue';
  import {
    addProduct,
    changeStatus,
    editProduct,
    getSaleProductDetail,
    getSearchList,
  } from '@/api/logistics/sale-product';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { columns } from './data';
  import { useRouter } from 'vue-router';
  import { SaleListParams, LogisticsListItem } from '@/api/logistics/sale-product/model/saleProductModel';
  import AddButton from '@/components/Button/src/AddButton.vue';
  import {
    useEnterpriseList,
    usePartitionSchemeList,
    useProductTeamList,
    useWarehouseList,
  } from '@/hooks/select/useSelect';
  import { PartitionSchemeItem, ProductTeamItem, WarehouseItem } from '@/api/sys/model/selectModel';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';
  import { EnterpriseListItem } from '@/api/system';

  export default defineComponent({
    name: 'SaleProductManagement',
    components: { AddButton },
    setup() {
      const loading = ref<Boolean>(false);
      const list = ref<LogisticsListItem[]>([]);
      const router = useRouter();
      const form = reactive({
        status: '1',
        teamCode: '', // 产品组编号
        schemeCode: '', // 分区方案编号
        promotingProductsName: '', // 销售产品中文名称
      });
      const { createConfirm, createBriefSuccessMsg } = useMessage();
      const pageParams = pageData();
      const statusList = ref([
        { id: 1, label: '生效', value: '1' },
        { id: 1, label: '失效', value: '0' },
      ]);
      const selectData = reactive<{
        productList: ProductTeamItem[];
        warehouseList: WarehouseItem[];
        schemeList: PartitionSchemeItem[];
        enterpriseList: EnterpriseListItem[];
      }>({
        productList: [],
        warehouseList: [],
        schemeList: [],
        enterpriseList: [],
      });
      const saleProductForm = reactive({
        visible: false,
        loading: false,
        editLoading: false,
        title: '新增',
        isEdit: false,
        curData: null,
        data: {
          teamCode: '', // 产品组编号
          warehouseCode: [], // 仓库
          schemeCode: [], // 分区方案编号
          promotingProductsCode: '', // 销售产品编号
          promotingProductsName: '', // 销售产品中文名称
          promotingProductsNameEn: '', // 销售产品英文名称
          clientCode: [], // 客户编号
          startWeightRange: '', // 起始重量区间
          endWeightRange: '', // 结束重量区间
          freightMinAge: '', // 货运最低时效
          freightMaxAge: '', // 货运最佳时效
          defaultPhone: '', // 默认填充电话
          defaultZipCode: '', // 默认填充邮编
          verifyRemote: '', // oda编号
          insuranceService: '0', // 保险服务(0否，1是)
          ageVerificationService: '0', // 签名服务(0否，1成年2未成年)
        },
        rules: {
          teamCode: [{ required: true, message: '产品组编号不能为空', trigger: 'change' }],
          warehouseCode: [{ required: true, message: '仓库代码不能为空', trigger: 'change' }],
          schemeCode: [{ required: true, message: '分区方案编号不能为空', trigger: 'change' }],
          promotingProductsCode: [{ required: true, message: '销售产品编号不能为空', trigger: 'blur' }],
          promotingProductsName: [{ required: true, message: '销售产品中文名称不能为空', trigger: 'blur' }],
          promotingProductsNameEn: [{ required: true, message: '销售产品英文名称不能为空', trigger: 'blur' }],
          startWeightRange: [{ required: true, message: '起始重量不能为空', trigger: 'blur' }],
          endWeightRange: [{ required: true, message: '结束重量不能为空', trigger: 'blur' }],
          freightMinAge: [{ required: true, message: '货运最低时效不能为空', trigger: 'blur' }],
          freightMaxAge: [{ required: true, message: '货运最佳时效不能为空', trigger: 'blur' }],
          defaultPhone: [{ required: true, message: '默认填充电话不能为空', trigger: 'blur' }],
          defaultZipCode: [{ required: true, message: '默认填充邮编不能为空', trigger: 'blur' }],
          insuranceService: [{ required: true, message: '保险服务不能为空', trigger: 'change' }],
          ageVerificationService: [{ required: true, message: '签名服务不能为空', trigger: 'change' }],
        },
      });
      const saleProductFormRef = ref(null);
      const searchFormRef = ref();
      const productChanged = ref(false);
      // 获取列表
      const loadList = async () => {
        loading.value = true;
        try {
          const params: SaleListParams = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            status: form.status,
            teamCode: form.teamCode,
            schemeCode: form.schemeCode,
            promotingProductsName: form.promotingProductsName,
          };
          const { list: _list, total, pageNum } = await getSearchList(params);

          list.value = _list.map((e) => {
            e.isActive = !!+e.status;
            return e;
          });
          pageParams.pageNum = pageNum;
          pageParams.total = total;
          loading.value = false;
        } catch (e) {
          list.value = [];
          pageParams.pageNum = 1;
          pageParams.total = 0;
          loading.value = false;
        }
      };

      const handleChangeFormProduct = async (val) => {
        selectData.productList = await useProductTeamList();
        const item = selectData.productList.find((e) => e.teamCode === val);
        saleProductForm.data.verifyRemote = item ? item.odaCode : '';
        saleProductForm.data.warehouseCode = [];
        saleProductForm.data.schemeCode = [];
        saleProductForm.data.teamCode = val;
        productChanged.value = true;
      };

      const onChangeWarehouse = async (val) => {
        try {
          saleProductForm.data.warehouseCode = val;
          const schemeList = await usePartitionSchemeList(saleProductForm.data.teamCode, val.join(','));
          if (schemeList) {
            (saleProductForm.data.schemeCode as string[]) = schemeList.map((e) => e.schemeCode);
          } else {
            saleProductForm.data.schemeCode = [];
          }
        } catch (e) {
          console.error(e);
        }
      };

      const handleChangeProduct = async (val: string) => {
        try {
          selectData.schemeList = await usePartitionSchemeList(val);
          form.schemeCode = '';
          form.teamCode = val;
        } catch (e) {
          console.error(e);
        }
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const operate = async (item, type) => {
        saleProductForm.curData = item;
        const { isActive, productsId } = item;
        if (type === 'edit') {
          if (saleProductForm.editLoading) return;
          saleProductForm.editLoading = true;
          saleProductForm.title = '编辑';
          saleProductForm.isEdit = true;
          productChanged.value = true;
          saleProductForm.visible = true;
        } else if (type === 'status') {
          const status = isActive ? '0' : '1';
          const message = `请确认是否${isActive ? '停用' : '启用'}该销售产品`;
          createConfirm({
            title: `${isActive ? '停用' : '启用'}销售产品`,
            message,
            type: 'info',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                try {
                  await changeStatus({ id: productsId, status });
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
        } else {
          await router.push({
            name: 'saleProductDetail',
            params: {
              id: item.productsId,
            },
          });
        }
      };

      const onSubmit = async () => {
        await formValidate(saleProductFormRef);
        const schemeCode = saleProductForm.data.schemeCode.join(',');
        const clientCode = saleProductForm.data.clientCode.join(',');
        const warehouseCode = saleProductForm.data.warehouseCode.join(',');
        let params = {
          ...saleProductForm.data,
          schemeCode,
          warehouseCode,
          clientCode,
        };
        try {
          if (saleProductForm.isEdit) {
            await editProduct(params);
            createBriefSuccessMsg('编辑产品成功');
          } else {
            await addProduct(params);
            createBriefSuccessMsg('添加产品成功！');
          }
          saleProductForm.visible = false;
          await loadList();
        } catch (e) {
          console.error(e);
        }
      };

      const onClose = () => {
        formResetFields(saleProductFormRef);
      };

      const onOpened = async () => {
        if (saleProductForm.isEdit) {
          try {
            const data = await getSaleProductDetail({
              id: (saleProductForm.curData as any).productsId,
            });
            (saleProductForm.data as any) = { ...data };
            (saleProductForm.data.schemeCode as string[]) = data.schemeCode.split(',');
            (saleProductForm.data.clientCode as string[]) = data.clientCode ? data.clientCode.split(',') : [];
            (saleProductForm.data.warehouseCode as string[]) = data.warehouseCode.split(',');
          } catch (e) {
            console.error(e);
          }
        }
        saleProductForm.editLoading = false;
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const addShow = () => {
        formResetFields(saleProductFormRef);
        productChanged.value = false;
        saleProductForm.isEdit = false;
        selectData.schemeList = [];
        saleProductForm.visible = true;
        saleProductForm.title = '新增';
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      onMounted(async () => {
        await loadList();
        selectData.warehouseList = await useWarehouseList();
        !selectData.enterpriseList.length && (selectData.enterpriseList = await useEnterpriseList());
        selectData.enterpriseList = selectData.enterpriseList.filter((item) => item.enterpriseRecordCode);
        selectData.productList = await useProductTeamList();
      });

      return {
        loading,
        productChanged,
        list,
        form,
        statusList,
        selectData,
        saleProductForm,
        saleProductFormRef,
        columns,
        pageParams,
        searchFormRef,

        operate,
        handleChangeFormProduct,
        onOpened,
        onSubmit,
        onReset,
        onClose,
        addShow,
        onSearch,
        handleChangeProduct,
        onPageChange,
        onChangeWarehouse,
      };
    },
  });
</script>

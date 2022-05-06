<template>
  <div class="sale-product-detail" v-loading="loading">
    <div class="text-xl mb-20px"> 产品编号为 {{ infoData.promotingProductsCode }} 的销售产品详情 </div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="info">
        <el-form size="small" label-width="140px" inline :model="infoData">
          <el-form-item label="产品组编号">
            <el-input disabled :model-value="infoData.teamCode" />
          </el-form-item>
          <el-form-item label="分区方案编号">
            <el-input disabled :model-value="infoData.schemeCode" />
          </el-form-item>
          <el-form-item label="销售产品编号">
            <el-input disabled :model-value="infoData.schemeCode" />
          </el-form-item>
          <el-form-item label="销售产品中文名称">
            <el-input disabled :model-value="infoData.promotingProductsName" />
          </el-form-item>
          <el-form-item label="销售产品英文名称">
            <el-input disabled :model-value="infoData.promotingProductsNameEn" />
          </el-form-item>
          <el-form-item label="绑定客户">
            <el-input disabled :model-value="infoData.clientCode" />
          </el-form-item>
          <el-form-item label="起始重量">
            <el-input disabled :model-value="infoData.startWeightRange" />
          </el-form-item>
          <el-form-item label="结束重量">
            <el-input disabled :model-value="infoData.endWeightRange" />
          </el-form-item>
          <el-form-item label="货运最低时效">
            <el-input disabled :model-value="infoData.freightMinAge" />
          </el-form-item>
          <el-form-item label="货运最佳时效">
            <el-input disabled :model-value="infoData.freightMaxAge" />
          </el-form-item>
          <el-form-item label="默认填充电话">
            <el-input disabled :model-value="infoData.defaultPhone" />
          </el-form-item>
          <el-form-item label="默认填充邮编">
            <el-input disabled :model-value="infoData.defaultZipCode" />
          </el-form-item>
          <el-form-item label="ODA编号">
            <el-input disabled :model-value="infoData.verifyRemote || '/'" />
          </el-form-item>
          <el-form-item label="签名服务">
            <el-input disabled :model-value="infoData.ageVerificationServiceLabel || '/'" />
          </el-form-item>
          <el-form-item label="保险服务">
            <el-input disabled :model-value="infoData.insuranceServiceLabel || '/'" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="计费重" name="billing">
        <div class="mb-20px">
          <add-button @click="addShow" v-auth="['logistics:saleProductDetail:add']" />
        </div>

        <el-table :data="list" size="small" border stripe>
          <el-table-column prop="weightRulesName" label="计重规则名称" />
          <el-table-column prop="conditionExpression" label="条件表达式" />
          <el-table-column prop="weightExpression" label="结果值" />
          <el-table-column prop="sort" label="排序" sortable />
          <el-table-column prop="startTime" label="生效时间" />
          <el-table-column prop="endTime" label="失效时间" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="effectiveState" label="生效状态">
            <template #default="scope">
              <effective-status-text :effectiveState="scope.row.effectiveState" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <status-text :status="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="操作">
            <template #default="scope">
              <template v-if="scope.row.status === '0'">
                <el-button
                  type="text"
                  size="small"
                  @click="operate(scope.row, 'edit')"
                  v-auth="['logistics:saleProductDetail:add']"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="operate(scope.row, 'pub')"
                  v-auth="['logistics:saleProductDetail:pub']"
                >
                  发布
                </el-button>
              </template>
              <template v-else>
                <el-button type="text" size="small" @click="operate(scope.row, 'look')"> 查看 </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="operate(scope.row, 'saveAs')"
                  v-auth="['logistics:saleProductDetail:add']"
                >
                  另存为
                </el-button>
              </template>
              <el-button
                v-if="scope.row.status !== '2'"
                type="text"
                size="small"
                @click="operate(scope.row, 'del')"
                v-auth="['logistics:saleProductDetail:pub']"
              >
                作废
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <basic-dialog
      v-model="ruleForm.visible"
      width="660px"
      @submit="onSubmit"
      @opened="onOpened"
      @close="onClose"
      :title="ruleForm.title"
      :show-submit-btn="!ruleForm.isLook"
    >
      <el-form
        size="small"
        label-width="120px"
        :model="ruleForm.data"
        :rules="ruleForm.rules"
        v-loading="ruleForm.editLoading"
        ref="ruleFormRef"
      >
        <div class="flex">
          <el-form-item label="计重规则名称" prop="weightRulesName">
            <el-input v-model="ruleForm.data.weightRulesName" :disabled="ruleForm.isLook" />
          </el-form-item>
          <el-form-item label="体积系数" prop="volumeFactor">
            <el-input v-model="ruleForm.data.volumeFactor" :disabled="ruleForm.isLook" />
          </el-form-item>
        </div>
        <el-form-item label="条件表达式" prop="conditionExpression">
          <el-input
            class="expression-inp"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="ruleForm.data.conditionExpression"
            :disabled="ruleForm.isLook"
          />
        </el-form-item>
        <div class="flex">
          <el-form-item label="重量结果" prop="weightExpression">
            <el-input v-model="ruleForm.data.weightExpression" :disabled="ruleForm.isLook" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="ruleForm.data.sort" :disabled="ruleForm.isLook" />
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="生效时间" prop="startTime">
            <el-date-picker
              v-model="ruleForm.data.startTime"
              :disabled="ruleForm.isLook"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="ruleForm.data.endTime"
              :disabled="ruleForm.isLook"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <ul class="fz-12px text-secondary-600 lh-18px text-justify">
            规则参数说明：
            <li class="pl-10px"
              >L=最长边(CM)， M=第二长边(CM)， S=最短边(CM)， CW=计费重量(KG)， GW=实重(KG)， VT=体积重量(KG)，
              M3=第二长边之和(CM)， S3=最短边之和(CM), L3=最长边和(CM), VW=SKU长宽高*数量</li
            >
            <li class="pl-10px">例如：当最长边大于200时，则公式为：L>200 公式支持操作符：and(且)，or(或)</li>
            <li class="pl-10px">例如：L>200 and M>150 and GW>2 NT=最长边(CM)+第二长边(CM)*2+最短边(CM)*2*订单内件数</li>
            <li class="pl-10px">例如：L+M*2+S*2*订单内件数>317</li>
          </ul>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, Ref, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    addRule,
    changeRuleStatus,
    editRule,
    getSaleProductDetail,
    getSaleProductDetailList,
    ruleDetail,
  } from '@/api/logistics/sale-product';
  import {
    AddRuleParamsType,
    SaleProductDetail,
    SaleProductRuleListItem,
  } from '@/api/logistics/sale-product/model/saleProductModel';
  import { useTabs } from '@/hooks/web/useTabs';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { fillDateTime } from '@/utils/dateUtil';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'SaleProductDetail',
    components: { BasicDialog },
    setup() {
      const route = useRoute();
      const id = route.params.id as string;
      const list = ref<SaleProductRuleListItem[]>([]);
      const loading = ref(false);
      const infoData = ref({}) as Ref<SaleProductDetail>;
      const activeName = ref('info');
      const { setTitle } = useTabs();
      const { createBriefSuccessMsg, createConfirm, createMessage } = useMessage();

      const loadInfoData = async () => {
        try {
          const data = await getSaleProductDetail({ id });
          infoData.value = { ...data };
          setTitle(`${infoData.value.promotingProductsCode}产品详情`);
          infoData.value.ageVerificationServiceLabel =
            infoData.value.ageVerificationService === '0'
              ? '不签名'
              : infoData.value.ageVerificationService === '1'
              ? '成年'
              : '未成年';
          infoData.value.insuranceServiceLabel = infoData.value.insuranceService === '0' ? '否' : '是';
        } catch (e) {
          console.error(e);
        }
      };

      // 体积系数自定义校验
      const checkVolumeFactor = (_, value, callback) => {
        if (!value) {
          callback(new Error('体积系数不能为空'));
        } else if (!/^[0-9]+.?[0-9]{0,9}$/.test(value)) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      };

      const ruleForm = reactive({
        visible: false,
        loading: false,
        editLoading: false,
        title: '新增',
        isEdit: false,
        isLook: false,
        saveAs: false,
        curData: null,
        data: {
          weightRulesName: '', // 计重规则名称
          volumeFactor: '', // 体积系数
          conditionExpression: '', // 条件表达式
          weightExpression: '', // 重量表达式
          sort: '', // 排序  优先级排序 越大越优先
          startTime: '', // 生效时间
          endTime: '', // 失效时间
        },
        rules: {
          weightRulesName: [{ required: true, message: '请输入计重规则名称', trigger: 'blur' }],
          volumeFactor: [{ validator: checkVolumeFactor, trigger: 'blur' }],
          conditionExpression: [{ required: true, message: '请输入条件表达式', trigger: 'blur' }],
          weightExpression: [{ required: true, message: '请输入重量表达式', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
          startTime: [{ required: true, message: '请输入生效时间', trigger: 'change' }],
          endTime: [{ required: true, message: '请输入结束时间', trigger: 'change' }],
        },
      });
      const ruleFormRef = ref();
      const title = {
        add: '新增',
        edit: '编辑',
        look: '查看',
        saveAs: '另存为',
      };

      const handleTabClick = () => {
        if (activeName.value === 'info') {
          loadInfoData();
        } else {
          loadRuleList();
        }
      };

      const onOpened = async () => {
        if (ruleForm.isEdit || ruleForm.isLook || ruleForm.saveAs) {
          try {
            const data = await ruleDetail({ id: (ruleForm.curData as any).weightRulesId });
            ruleForm.data.weightRulesName = data.weightRulesName;
            ruleForm.data.volumeFactor = data.volumeFactor;
            ruleForm.data.conditionExpression = data.conditionExpression;
            ruleForm.data.weightExpression = data.weightExpression;
            ruleForm.data.sort = data.sort;
            ruleForm.data.startTime = data.startTime;
            ruleForm.data.endTime = data.endTime;
          } catch (e) {
            console.error(e);
          }
        }
        ruleForm.editLoading = false;
      };

      const onClose = () => {
        formResetFields(ruleFormRef);
      };

      const addShow = () => {
        formResetFields(ruleFormRef);
        ruleForm.isEdit = false;
        ruleForm.isLook = false;
        ruleForm.saveAs = false;
        ruleForm.title = '新增';
        ruleForm.visible = true;
      };

      const onSubmit = async () => {
        await formValidate(ruleFormRef);
        let data: AddRuleParamsType = { ...ruleForm.data, productsId: id };
        const { startTime, endTime } = fillDateTime(data.startTime, data.endTime);
        if (endTime < startTime) {
          return createMessage.error('生效时间不能晚于结束时间！');
        }
        data.startTime = startTime;
        data.endTime = endTime;
        if (ruleForm.isEdit) {
          data.weightRulesId = (ruleForm.curData as unknown as SaleProductRuleListItem).weightRulesId;
          await editRule(data);
          createBriefSuccessMsg('编辑规则成功！');
          await loadRuleList();
        } else {
          await addRule(data);
          createBriefSuccessMsg('添加规则成功！');
          await loadRuleList();
        }
        ruleForm.visible = false;
      };

      const loadRuleList = async () => {
        loading.value = true;
        try {
          list.value = await getSaleProductDetailList({ productsId: id });
        } catch (e) {
          console.error(e);
        }
        loading.value = false;
      };

      const editOperate = async () => {
        if (ruleForm.editLoading) return;
        ruleForm.editLoading = true;
        ruleForm.visible = true;
      };

      const operate = (item, type) => {
        switch (type) {
          case 'edit':
          case 'look':
          case 'saveAs':
            ruleForm.isEdit = type === 'edit';
            ruleForm.isLook = type === 'look';
            ruleForm.saveAs = type === 'saveAs';
            ruleForm.title = title[type];
            ruleForm.curData = { ...item };
            editOperate();
            break;
          case 'pub':
          case 'del':
            try {
              const status = type === 'pub' ? 1 : 2;
              const { weightRulesId } = item;
              const message = `请确认是否${type === 'pub' ? '发布' : '作废'}当前规则！`;
              createConfirm({
                title: `${type === 'pub' ? '发布' : '作废'}规则`,
                message,
                type: 'info',
                beforeClose: async (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    try {
                      await changeRuleStatus({ id: weightRulesId, status });
                      createBriefSuccessMsg(`${type === 'pub' ? '发布' : '作废'}成功`);
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
                  loadRuleList();
                })
                .catch(() => {});
            } catch (e) {
              console.error(e);
            }
            break;
        }
      };

      onMounted(() => {
        loadInfoData();
      });

      return {
        infoData,
        activeName,
        loading,
        list,
        ruleFormRef,
        ruleForm,

        handleTabClick,
        onClose,
        addShow,
        onSubmit,
        operate,
        onOpened,
      };
    },
  });
</script>

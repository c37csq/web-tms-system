<template>
  <div class="channel-detail">
    <div class="text-xl mb-20px">{{ route.params.code }} 渠道详情</div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="info">
        <el-form label-width="130px" class="base-info" size="small" inline v-loading="infoLoading">
          <el-form-item label="服务商编号">
            <el-input disabled :model-value="infoData.serviceProviderCode" />
          </el-form-item>
          <el-form-item label="服务渠道编号">
            <el-input disabled :model-value="infoData.serviceChannelCode" />
          </el-form-item>
          <el-form-item label="API服务渠道代码">
            <el-input disabled :model-value="infoData.apiCode" />
          </el-form-item>
          <el-form-item label="仓库编号">
            <el-input disabled :model-value="infoData.warehouseCode" />
          </el-form-item>
          <el-form-item label="产品组编号">
            <el-input disabled :model-value="infoData.teamCode" />
          </el-form-item>
          <el-form-item label="ODA编号">
            <el-input disabled :model-value="infoData.verifyRemote" />
          </el-form-item>
          <el-form-item label="签名服务">
            <el-input disabled :model-value="infoData.signatureLabel || '/'" />
          </el-form-item>
          <el-form-item label="保险服务">
            <el-input disabled :model-value="infoData.insuranceLabel || '/'" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="计费重" name="billing">
        <div class="mb-20px">
          <add-button @click="addShow">新增</add-button>
        </div>
        <el-table :data="list" size="small" border stripe v-loading="loading">
          <el-table-column prop="weightRulesName" label="计重规则名称" />
          <el-table-column prop="conditionExpression" label="条件表达式" />
          <el-table-column prop="weightExpression" label="结果值" />
          <el-table-column prop="sort" label="排序" />
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
                <el-button type="text" size="small" @click="operate(scope.row, 'edit')">编辑</el-button>
                <el-button type="text" size="small" @click="operate(scope.row, 'pub')">发布</el-button>
              </template>
              <template v-else>
                <el-button type="text" size="small" @click="operate(scope.row, 'look')"> 查看 </el-button>
                <el-button type="text" size="small" @click="operate(scope.row, 'saveAs')"> 另存为 </el-button>
              </template>
              <el-button v-if="scope.row.status !== '2'" type="text" size="small" @click="operate(scope.row, 'del')">
                作废
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <basic-dialog
      @submit="onSubmit"
      @opened="onOpen"
      @close="onClose"
      :show-submit-btn="!ruleForm.isLook"
      v-model="ruleForm.visible"
      width="660px"
      :title="ruleForm.title"
    >
      <el-form
        v-loading="ruleForm.editLoading"
        size="small"
        label-width="120px"
        :model="ruleForm.data"
        :rules="ruleForm.rules"
        ref="ruleFormRef"
      >
        <el-form-item label="计重规则名称" prop="weightRulesName">
          <el-input v-model="ruleForm.data.weightRulesName" :disabled="ruleForm.isLook" />
        </el-form-item>
        <div class="flex">
          <el-form-item label="体积系数" prop="volumeFactor">
            <el-input v-model="ruleForm.data.volumeFactor" :disabled="ruleForm.isLook" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="ruleForm.data.sort" :disabled="ruleForm.isLook" />
          </el-form-item>
        </div>
        <div class="flex items-start">
          <el-form-item label="条件表达式" prop="conditionExpression">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="ruleForm.data.conditionExpression"
              :disabled="ruleForm.isLook"
            />
          </el-form-item>
          <el-form-item label="结果值" prop="weightExpression">
            <el-input v-model="ruleForm.data.weightExpression" :disabled="ruleForm.isLook" />
          </el-form-item>
        </div>
        <el-form-item label="有效期" prop="dateRange">
          <el-date-picker
            v-model="ruleForm.data.dateRange"
            type="daterange"
            range-separator="至"
            :disabled="ruleForm.isLook"
            start-placeholder="生效时间"
            end-placeholder="失效时间"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <ul class="text-secondary-600 lh-18px text-justify">
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
  import { defineComponent, onMounted, reactive, ref, Ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';
  import {
    addChannelRule,
    changeChannelRuleStatus,
    editChannelById,
    editChannelRule,
    editChannelRuleById,
    getChannelRuleList,
  } from '@/api/logistics/service';
  import { RuleListItem } from '@/api/logistics/service/model/ChannelModel';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'ChannelDetail',
    setup() {
      const infoLoading = ref(true);
      const route = useRoute();
      const id = route.params.id;
      const activeName = ref('info');
      const list = ref<RuleListItem[]>([]);
      const loading = ref(true);
      const { setTitle } = useTabs();
      type InfoType = {
        serviceProviderCode: string;
        serviceChannelCode: string; // 服务渠道编号
        apiCode: string; // api服务渠道代码
        warehouseCode: string[]; // 仓库编号 // 可多选
        teamCode: string; // 产品组编号
        verifyRemote: string; // oda编号
        signatureLabel: string;
        insuranceLabel: string;
      };
      const infoData = ref({}) as Ref<InfoType>;

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
        isSaveAs: false,
        curData: null,
        data: {
          weightRulesName: '', // 计费重名字
          volumeFactor: '', // 体积系数
          conditionExpression: '', // 条件表达式
          weightExpression: '', // 重量表达式
          sort: '', // 排序  优先级排序 越大越优先
          dateRange: [], // 有效期
          startTime: '',
          endTime: '',
          weightRulesId: 0,
        },
        rules: {
          volumeFactor: [{ validator: checkVolumeFactor, trigger: 'blur' }],
          conditionExpression: [{ required: true, message: '请输入条件表达式', trigger: 'blur' }],
          weightExpression: [{ required: true, message: '请输入重量结果值', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
          dateRange: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
        },
      });
      const ruleFormRef = ref();
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const loadInfoData = async () => {
        infoLoading.value = true;
        try {
          const data = await editChannelById({ id });
          infoData.value = data as any;
          infoData.value.signatureLabel =
            data.signature === '0' ? '不签名' : data.signature === '1' ? '成年' : '未成年';
          infoData.value.insuranceLabel = data.insurance === '0' ? '否' : '是';
        } catch (e) {
          console.error(e);
        }
        infoLoading.value = false;
      };

      const loadRuleList = async () => {
        loading.value = true;
        try {
          list.value = await getChannelRuleList({ serviceChannelId: id });
        } catch (e) {
          console.error(e);
        }
        loading.value = false;
      };

      const handleTabClick = () => {
        if (activeName.value === 'info') {
          loadInfoData();
        } else {
          loadRuleList();
        }
      };

      const addShow = () => {
        formResetFields(ruleFormRef);
        ruleForm.isEdit = false;
        ruleForm.isLook = false;
        ruleForm.title = '新增';
        ruleForm.visible = true;
      };

      const onSubmit = async () => {
        await formValidate(ruleFormRef);
        ruleForm.loading = true;
        const data = { ...ruleForm.data, serviceChannelId: id };
        const { startTime, endTime } = getPickerDate(data.dateRange);
        data.startTime = startTime;
        data.endTime = endTime;
        if (ruleForm.isEdit) {
          data.weightRulesId = (ruleForm.curData as any).weightRulesId;
          await editChannelRule(data);
          createBriefSuccessMsg('编辑成功');
        } else {
          await addChannelRule(data);
          createBriefSuccessMsg('添加成功');
        }
        await loadRuleList();
        ruleForm.visible = false;
      };

      const title = {
        add: '新增',
        edit: '编辑',
        look: '查看',
        saveAs: '另存为',
      };

      const operate = (item, type) => {
        switch (type) {
          case 'edit':
          case 'look':
          case 'saveAs':
            ruleForm.isEdit = type === 'edit';
            ruleForm.isLook = type === 'look';
            ruleForm.isSaveAs = type === 'saveAs';
            ruleForm.title = title[type];
            ruleForm.curData = { ...item };
            ruleForm.editLoading = true;
            ruleForm.visible = true;
            break;
          case 'pub':
          case 'del':
            try {
              const status = type === 'pub' ? 1 : 2;
              const { weightRulesId } = item;
              const message = `请确认是否${type === 'pub' ? '发布' : '作废'}`;
              createConfirm({
                title: `${type === 'pub' ? '发布' : '作废'}`,
                message,
                type: 'info',
                beforeClose: async (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    try {
                      await changeChannelRuleStatus({ id: weightRulesId, status });
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

      const onOpen = async () => {
        if (ruleForm.isSaveAs || ruleForm.isEdit || ruleForm.isLook) {
          const data = await editChannelRuleById({ id: (ruleForm.curData as any).weightRulesId });
          ruleForm.data.weightRulesName = data.weightRulesName;
          ruleForm.data.volumeFactor = data.volumeFactor;
          ruleForm.data.conditionExpression = data.conditionExpression;
          ruleForm.data.weightExpression = data.weightExpression;
          ruleForm.data.sort = data.sort;
          ruleForm.data.dateRange = [data.startTime, data.endTime] as any;
        }
        ruleForm.editLoading = false;
      };

      const onClose = () => {
        formResetFields(ruleFormRef);
      };

      onMounted(async () => {
        await loadInfoData();
        await setTitle(`${route.params.code} 渠道详情`);
      });

      return {
        infoLoading,
        route,
        activeName,
        list,
        loading,
        infoData,
        ruleForm,
        ruleFormRef,

        handleTabClick,
        addShow,
        operate,
        onSubmit,
        onOpen,
        onClose,
      };
    },
  });
</script>

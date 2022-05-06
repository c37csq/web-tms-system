<template>
  <div class="service-product-detail">
    <div class="text-xl mb-20px">{{ route.params.name }} 产品组</div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="baseInfo">
        <el-form label-width="130px" class="base-info">
          <el-form-item label="产品组编号">
            <el-input :model-value="route.params.code" :disabled="true" />
          </el-form-item>
          <el-form-item label="产品组名称">
            <el-input :model-value="route.params.name" :disabled="true" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="分区代码" name="zone">
        <div class="mb-20px">
          <add-button @click="addShow('zone')" v-auth="['system:serviceProductDetail:operate']" />
        </div>
        <el-table :data="zoneData.list" size="small" border stripe v-loading="zoneData.loading">
          <el-table-column prop="zoningCode" label="分区代码编号" />
          <el-table-column prop="zoningName" label="分区代码名称" />
          <el-table-column prop="operate" label="操作">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="operate(scope.row, 'zone', 'edit')"
                v-auth="['system:serviceProductDetail:operate']"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="operate(scope.row, 'zone', 'del')"
                v-auth="['system:serviceProductDetail:operate']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="重量段" name="weight">
        <div class="mb-20px">
          <add-button @click="addShow('weight')" v-auth="['system:serviceProductDetail:operate']" />
          <import-button @click="importShow" v-auth="['system:serviceProductDetail:import']" />
          <danger-button
            @click="bathWeightDel"
            :disabled="!delWeightList.length"
            v-auth="['system:serviceProductDetail:operate']"
          >
            批量删除
          </danger-button>
        </div>
        <el-table
          :data="weightData.list"
          size="small"
          border
          stripe
          @selection-change="selectWeightChange"
          v-loading="weightData.loading"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="startWeight" label="起始重量" />
          <el-table-column prop="endWeight" label="结束重量" />
          <el-table-column prop="chargingWeight" label="计费单重" />
          <el-table-column prop="operate" label="操作">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="operate(scope.row, 'weight', 'del')"
                v-auth="['system:serviceProductDetail:operate']"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <basic-pagination
          :current="weightPage.pageNum"
          :size="weightPage.pageSize"
          :total="weightPage.total"
          @page-change="onWeightPageChange"
        />
      </el-tab-pane>
      <el-tab-pane label="特殊规则" name="rule">
        <div class="mb-20px">
          <add-button @click="addShow('rule')" v-auth="['system:serviceProductDetail:operate']" />
        </div>
        <el-table :data="ruleData.list" size="small" border stripe v-loading="ruleData.loading">
          <el-table-column prop="extraServiceLabel" label="额外服务类型" />
          <el-table-column prop="orderTypeLabel" label="订单类型" />
          <el-table-column prop="constraintFormulas" label="约束公式" />
          <el-table-column prop="extraOperateLabel" label="额外操作" />
          <el-table-column prop="startTime" label="生效时间" />
          <el-table-column prop="endTime" label="过期时间" />
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
          <el-table-column prop="orderNo" label="权重" />
          <el-table-column prop="operate" label="操作">
            <template #default="scope">
              <template v-if="scope.row.status === 0">
                <el-button
                  type="text"
                  size="small"
                  @click="ruleOperate(scope.row, 'edit')"
                  v-auth="['system:serviceProductDetail:operate']"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="ruleOperate(scope.row, 'pub')"
                  v-auth="['system:serviceProductDetail:pub']"
                >
                  发布
                </el-button>
              </template>
              <template v-else>
                <el-button type="text" size="small" @click="ruleOperate(scope.row, 'info')"> 详情 </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="ruleOperate(scope.row, 'save')"
                  v-auth="['system:serviceProductDetail:operate']"
                >
                  另存为
                </el-button>
              </template>
              <el-button
                v-if="scope.row.status !== 2"
                type="text"
                size="small"
                @click="ruleOperate(scope.row, 'del')"
                v-auth="['system:serviceProductDetail:pub']"
                >作废</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="支持渠道" name="channel">
        <el-table :data="channelData" size="small" border stripe v-loading="channelDataLoading">
          <el-table-column
            v-for="item in channelColumns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :formatter="item.formatter"
          />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <span v-if="scope.row.status === '0'" class="text-invalid">失效</span>
              <span v-if="scope.row.status === '1'" class="text-active">生效</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="支持销售产品" name="saleProduct">
        <el-table :data="saleProductData" size="small" border stripe v-loading="saleProductDataLoading">
          <el-table-column v-for="item in saleProductColumns" :key="item.prop" :prop="item.prop" :label="item.label" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <span v-if="scope.row.status === '0'" class="text-invalid">失效</span>
              <span v-if="scope.row.status === '1'" class="text-active">生效</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <import-dialog
      v-model="importData.visible"
      :action="importData.action"
      :params="importData.params"
      :template-url="importData.templateUrl"
      @success="onImportSuccess"
    />

    <!-- 分区代码 -->
    <basic-dialog
      @submit="onSubmit('zone')"
      @opened="onOpened('zone')"
      @close="onClose('zone')"
      width="420px"
      v-model="zoneData.visible"
      :title="commonForm.title"
    >
      <el-form
        v-loading="zoneData.editLoading"
        label-width="120px"
        size="small"
        :model="zoneData.form"
        :rules="zoneData.rules"
        ref="zoneFormRef"
      >
        <el-form-item label="分区代码编号" prop="zoningCode">
          <el-select v-model="zoneData.form.zoningCode" placeholder="请选择分区代码编号" :disabled="commonForm.isEdit">
            <el-option v-for="i in 10" :label="i + '区'" :value="i" :key="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="分区代码名称" prop="zoningName">
          <el-input v-model="zoneData.form.zoningName" placeholder="请输入分区代码名称" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <!-- 重量段 -->
    <basic-dialog
      @submit="onSubmit('weight')"
      @opened="onOpened('weight')"
      @close="onClose('weight')"
      width="420px"
      v-model="weightData.visible"
      :title="commonForm.title"
    >
      <el-form
        v-loading="weightData.editLoading"
        label-width="120px"
        size="small"
        :model="weightData.form"
        :rules="weightData.rules"
        ref="weightFormRef"
      >
        <el-form-item label="起始重量" prop="startWeight">
          <el-input
            v-model="weightData.form.startWeight"
            placeholder="请输入起始重量段"
            :disabled="commonForm.isEdit"
          />
        </el-form-item>
        <el-form-item label="结束重量" prop="endWeight">
          <el-input v-model="weightData.form.endWeight" placeholder="请输入结束重量段" />
        </el-form-item>
        <el-form-item label="计费单重" prop="chargingWeight">
          <el-input v-model="weightData.form.chargingWeight" placeholder="请输入计费单重" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <!-- 特殊规则 -->
    <basic-dialog
      @submit="onSubmit('rule')"
      @opened="onOpened('rule')"
      @close="onClose('rule')"
      :title="commonForm.title"
      width="640px"
      :showSubmitBtn="!ruleData.isLook"
      v-model="ruleData.visible"
    >
      <el-form
        label-width="120px"
        size="small"
        v-loading="ruleData.editLoading"
        :model="ruleData.form"
        :rules="ruleData.rules"
        ref="ruleFormRef"
      >
        <div class="*flex-btc">
          <el-form-item label="额外服务类型" prop="extraService">
            <el-select
              placeholder="请选择额外服务类型"
              v-model="ruleData.form.extraService"
              clearable
              :disabled="ruleData.isLook"
            >
              <el-option
                v-for="item in ruleData.extraServiceTypeList"
                :key="item.extraServiceId"
                :label="item.extraServiceNameCn"
                :value="item.extraServiceCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订单类型" prop="orderType">
            <el-select
              placeholder="请选择订单类型"
              v-model="ruleData.form.orderType"
              clearable
              :disabled="ruleData.isLook"
            >
              <el-option
                v-for="item in ruleData.orderTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="*flex-btc">
          <el-form-item label="权重" prop="orderNo">
            <el-input v-model="ruleData.form.orderNo" placeholder="请输入权重" :disabled="ruleData.isLook" />
          </el-form-item>
          <el-form-item label="额外操作" prop="addOperating">
            <el-select
              placeholder="请选择额外操作"
              v-model="ruleData.form.addOperating"
              clearable
              :disabled="ruleData.isLook"
            >
              <el-option
                v-for="item in ruleData.extraOperateList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="日期区间" prop="dateRange">
          <el-date-picker
            v-model="ruleData.form.dateRange"
            :disabled="ruleData.isLook"
            type="daterange"
            range-separator="至"
            start-placeholder="生效时间"
            end-placeholder="失效时间"
            :default-time="ruleData.form.defaultTime"
          />
        </el-form-item>
        <el-form-item label="约束公式" prop="constraintFormulas">
          <el-input
            type="textarea"
            :disabled="ruleData.isLook"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入约束公式"
            v-model="ruleData.form.constraintFormulas"
          />
        </el-form-item>
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
        <el-form-item label="备注" prop="responseMsg">
          <el-input
            type="textarea"
            :disabled="ruleData.isLook"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入备注"
            v-model="ruleData.form.responseMsg"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <pub-dialog v-model="pubData.visible" :data="pubData.data" @pub="pubSubmit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, Ref, ref, shallowRef } from 'vue';
  import { useRoute } from 'vue-router';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import {
    addRule,
    addWeight,
    addZone,
    delRule,
    delWeight,
    delZone,
    editRule,
    editWeight,
    editZone,
    getChannelList,
    getRuleList,
    getRulePubList,
    getSaleProductList,
    getWeightList,
    getZoneList,
    pubRule,
  } from '@/api/logistics/product';
  import {
    ChannelListItem,
    RuleListItemType,
    RuleStatus,
    WeightListItem,
    ZoneListType,
  } from '@/api/logistics/product/model/serviceModel';
  import { findNameById, formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { useTabs } from '@/hooks/web/useTabs';
  import EffectiveStatusText from '@/components/Text/src/EffectiveStatusText.vue';
  import StatusText from '@/components/Text/src/StatusText.vue';
  import { useExtraServiceList } from '@/hooks/select/useSelect';
  import { ExtraServiceItem } from '@/api/sys';
  import { PubListType } from '@/api/logistics/product/model/fuelModel';
  import { LogisticsListItem } from '@/api/logistics/sale-product/model/saleProductModel';

  export default defineComponent({
    name: 'ServiceProductDetail',
    components: { StatusText, EffectiveStatusText, BasicDialog, ImportDialog },
    setup() {
      const route = useRoute();
      const teamId = shallowRef(route.params.id) as Ref<string>;
      const activeName = ref('baseInfo');
      const { setTitle } = useTabs();

      const zoneData = reactive({
        loading: true,
        editLoading: false,
        submitLoading: false,
        visible: false,
        form: {
          zoningCode: '',
          teamId: '',
          zoningName: '',
          zoningId: '',
        },
        rules: {
          zoningCode: [{ required: true, message: '分区代码不能为空', trigger: 'blur' }],
          zoningName: [{ required: true, message: '分区名称不能为空', trigger: 'blur' }],
        },
        list: [],
      });
      const zoneFormRef = ref();
      const ruleData = reactive<any>({
        loading: true,
        editLoading: false,
        visible: false,
        isLook: false,
        isSave: false,
        form: {
          extraService: '', // 额外服务类型
          orderType: '', // 订单类型（0按件，1按票）
          constraintFormulas: '', // 约束公式
          addOperating: '', // 额外操作（0扣件收费，1禁止发货）
          orderNo: '', // 权重
          dateRange: '', // 日期
          defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)],
          startTime: '', // 生效时间
          endTime: '', // 结束时间
          responseMsg: '', // 备注
          teamId: '',
          specialRulesId: '',
        },
        rules: {
          extraService: [{ required: true, message: '额外服务类型不能为空', trigger: 'change' }],
          orderType: [{ required: true, message: '订单类型不能为空', trigger: 'change' }],
          addOperating: [{ required: true, message: '额外操作不能为空', trigger: 'change' }],
          orderNo: [{ required: true, message: '权重不能为空', trigger: 'blur' }],
          dateRange: [{ required: true, message: '日期区间不能为空', trigger: 'change' }],
          constraintFormulas: [{ required: true, message: '约束公式不能为空', trigger: 'blur' }],
        },
        orderTypeList: [], // 订单类型列表
        extraServiceTypeList: [], // 额外服务类型列表
        extraOperateList: [], // 额外操作列表
        list: [],
      });
      const channelData = ref<ChannelListItem[]>([]);
      const channelDataLoading = ref(true);
      const saleProductData = ref<LogisticsListItem[]>([]);
      const saleProductDataLoading = ref(true);
      const channelColumns = [
        {
          label: '服务渠道编号',
          prop: 'serviceChannelCode',
          formatter: (row) => {
            return row.serviceChannelCode || '/';
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
          label: 'ODA编号',
          prop: 'verifyRemote',
          formatter: (row) => {
            return row.verifyRemote || '/';
          },
        },
      ];
      const saleProductColumns = [
        { label: '销售产品编号', prop: 'promotingProductsCode' },
        { label: '销售产品中文名称', prop: 'promotingProductsName' },
        { label: '销售产品英文名称', prop: 'promotingProductsNameEn' },
        { label: '分区方案编号', prop: 'schemeCode' },
      ];
      const pubData = reactive({
        canClick: true,
        visible: false, // 是否显示
        params: {}, // request params
        data: [], // 获取的数据
      });

      const importData = importDialogState(
        UploadApi.ServiceWeight,
        'https://frontend-tms.obs.ap-southeast-1.myhuaweicloud.com:443/import-template/weight-template.xlsx',
        { teamId: teamId.value },
      );

      const ruleOperate = async (item, type) => {
        switch (type) {
          case 'edit':
          case 'save': // save 新增一条  edit是编辑
            ruleData.isLook = false;
            ruleData.isSave = type === 'save';
            editShow(item, 'rule', type);
            commonForm.isEdit = type === 'edit';
            ruleData.isSave = type === 'save';
            break;
          case 'info':
            commonForm.curData = item;
            commonForm.title = '查看';
            ruleData.isLook = true;
            ruleData.editLoading = true;
            ruleData.visible = true;
            break;
          case 'pub':
            const params: RuleStatus = {
              specialRulesId: +item.specialRulesId,
              state: 1,
              verify: 0,
            };
            const data = await getRulePubList(params);
            pubData.params = params;
            (pubData.data as PubListType[]) = data;
            pubData.visible = true;
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
                      const params = { specialRulesId: +item.specialRulesId, state: 2 };
                      await delRule(params);
                      createBriefSuccessMsg('作废成功');
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

      const importShow = () => {
        importData.visible = true;
      };

      const checkStartWeight = (_, value, callback) => {
        if (!value) {
          callback(new Error('起始重量不能为空'));
        } else if (weightData.form.endWeight !== '') {
          if (Number(value) >= Number(weightData.form.endWeight)) {
            // 起始重量不可大于或者等于结束重量！
            weightFormRef.value && weightFormRef.value.validateField('endWeight');
          } else {
            callback();
          }
        } else if (isNaN(value)) {
          callback(new Error('起始重量不能包含字母中文等字符'));
        } else {
          callback();
        }
      };

      const onImportSuccess = async ({ close }) => {
        await loadWeightList();
        close && close();
      };

      const checkEndWeight = (_, value, callback) => {
        if (!value) {
          callback(new Error('结束重量不能为空'));
        } else if (weightData.form.startWeight !== '') {
          if (Number(value) <= Number(weightData.form.startWeight)) {
            callback(new Error('起始重量不可大于或者等于结束重量！'));
          } else {
            callback();
          }
        } else if (isNaN(value)) {
          callback(new Error('结束重量不能包含字母中文等字符'));
        } else {
          callback();
        }
      };

      const checkCharge = (_, value, callback) => {
        if (!value) {
          callback(new Error('计费单重不能为空'));
        } else if (Number(value) !== Number(weightData.form.endWeight)) {
          callback(new Error('计费单重要和结束重量保持一致'));
        } else if (isNaN(value)) {
          callback(new Error('计费单重不能包含字母中文等字符'));
        } else {
          callback();
        }
      };

      const weightData = reactive({
        loading: true,
        editLoading: false,
        submitLoading: false,
        visible: false,
        form: {
          startWeight: '',
          endWeight: '',
          chargingWeight: '',
          teamId: '',
          weightId: '',
        },
        rules: {
          startWeight: [{ required: true, validator: checkStartWeight, trigger: 'blur' }],
          endWeight: [{ required: true, validator: checkEndWeight, trigger: 'blur' }],
          chargingWeight: [{ required: true, validator: checkCharge, trigger: 'blur' }],
        },
        list: [],
      });
      const weightFormRef = ref();
      // 通用数据 确保每次操作前都会赋值正确
      const commonForm = reactive({
        title: '新增',
        isEdit: false,
        curData: null,
      });
      const { createBriefSuccessMsg, createConfirm } = useMessage();
      const delWeightList = ref<WeightListItem[]>([]);
      const weightPage = pageData();
      const ruleFormRef = ref();

      const loadZoneList = async () => {
        zoneData.loading = true;
        try {
          (zoneData.list as ZoneListType[]) = await getZoneList(teamId.value);
        } catch (e) {
          zoneData.list = [];
          console.error(e);
        }
        zoneData.loading = false;
      };

      const bathWeightDel = () => {
        const weightId = delWeightList.value.map((e) => e.weightId).join(',');
        try {
          createConfirm({
            title: `删除`,
            message: '请确认是否批量删除？',
            type: 'info',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                try {
                  await delWeight(weightId);
                  createBriefSuccessMsg('批量删除成功');
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
              loadWeightList();
            })
            .catch(() => {});
        } catch (e) {
          console.error(e);
        }
      };

      const loadWeightList = async () => {
        weightData.loading = true;
        try {
          const { list, pageNum, total } = await getWeightList({
            teamId: teamId.value,
            pageNum: weightPage.pageNum,
            pageSize: weightPage.pageSize,
          });
          (weightData.list as WeightListItem[]) = list;
          weightPage.pageNum = pageNum;
          weightPage.total = total;
        } catch (e) {
          weightData.list = [];
          weightPage.pageNum = 1;
          weightPage.total = 0;
          console.error(e);
        }
        weightData.loading = false;
      };

      const onWeightPageChange = (params: PageChangeParams) => {
        params.pageSize && (weightPage.pageSize = params.pageSize);
        params.pageNum && (weightPage.pageNum = params.pageNum);
        loadWeightList();
      };

      const selectWeightChange = (val) => {
        delWeightList.value = val;
      };

      const editShow = (item, type, otherType?: string) => {
        commonForm.title = '编辑';
        commonForm.isEdit = true;
        commonForm.curData = item;
        switch (type) {
          case 'zone':
            zoneData.editLoading = true;
            zoneData.visible = true;
            break;
          case 'weight':
            weightData.editLoading = true;
            weightData.visible = true;
            break;
          case 'rule':
            commonForm.title = otherType === 'edit' ? '编辑' : '另存为';
            ruleData.editLoading = true;
            ruleData.visible = true;
            break;
          default:
            break;
        }
      };

      const operate = (item, tabName, type) => {
        switch (tabName) {
          case 'zone':
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
                        await delZone(item.zoningId);
                        createBriefSuccessMsg('删除成功');
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
                    loadZoneList();
                  })
                  .catch(() => {});
              } catch (e) {
                console.error(e);
              }
            } else {
              editShow(item, tabName);
            }
            break;
          case 'weight':
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
                        await delWeight(item.weightId);
                        createBriefSuccessMsg('删除成功');
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
                    if (weightPage.pageNum === 1) {
                      loadWeightList();
                    } else {
                      weightPage.pageNum = 1;
                    }
                  })
                  .catch(() => {});
              } catch (e) {
                console.error(e);
              }
            } else {
              editShow(item, tabName);
            }
            break;
        }
      };

      const loadRuleList = async () => {
        ruleData.loading = true;
        try {
          const data = await getRuleList(teamId.value);
          (ruleData.list as RuleListItemType[]) =
            data &&
            data.map((e) => {
              e.extraServiceLabel = findNameById(
                e.extraService,
                ruleData.extraServiceTypeList,
                'extraServiceCode',
                'extraServiceNameCn',
              );
              e.orderTypeLabel = findNameById(e.orderType, ruleData.orderTypeList, 'value', 'label');
              e.extraOperateLabel = findNameById(e.addOperating, ruleData.extraOperateList, 'value', 'label');
              return e;
            });
        } catch (e) {
          ruleData.list = [];
          console.error(e);
        }
        ruleData.loading = false;
      };

      const pubSubmit = async () => {
        (pubData.params as RuleStatus).verify = 1; // 二次验证结果改为 1
        try {
          await pubRule(pubData.params as RuleStatus);
          await loadRuleList;
          pubData.visible = false;
          createBriefSuccessMsg('发布成功！');
          await loadRuleList();
        } catch (e) {
          console.error(e);
        }
      };

      type ListType = {
        id: number;
        value: number;
        label: string;
      };

      const handleTabClick = async () => {
        switch (activeName.value) {
          case 'baseInfo':
            break;
          case 'zone':
            await loadZoneList();
            break;
          case 'weight':
            await loadWeightList();
            break;
          case 'rule':
            (ruleData.extraServiceTypeList as ExtraServiceItem[]) = await useExtraServiceList(); // 额外服务类型列表
            (ruleData.orderTypeList as ListType[]) = [
              { id: 1, value: 0, label: '按件' },
              { id: 2, value: 1, label: '按票' },
            ]; // 订单类型列表
            (ruleData.extraOperateList as ListType[]) = [
              { id: 1, value: 0, label: '扣件收费' },
              { id: 2, value: 1, label: '禁止发货' },
            ]; // 额外操作列表
            await loadRuleList();
            break;
          case 'channel':
            channelDataLoading.value = true;
            try {
              let { list } = await getChannelList({
                pageNum: 1,
                pageSize: 100,
                teamCode: route.params.code,
              });
              channelData.value = list;
            } catch (e) {
              console.error(e);
            } finally {
              channelDataLoading.value = false;
            }
            break;
          case 'saleProduct':
            saleProductDataLoading.value = true;
            try {
              let { list } = await getSaleProductList({
                pageNum: 1,
                pageSize: 100,
                teamCode: route.params.code,
              });
              saleProductData.value = list;
            } catch (e) {
              console.error(e);
            } finally {
              saleProductDataLoading.value = false;
            }
            break;
        }
      };

      const onOpened = (type) => {
        switch (type) {
          case 'zone':
            if (commonForm.isEdit) {
              const data = commonForm.curData as any;
              zoneData.form.zoningCode = data.zoningCode;
              zoneData.form.zoningName = data.zoningName;
            }
            zoneData.editLoading = false;
            break;
          case 'weight':
            if (commonForm.isEdit) {
              const data = commonForm.curData as any;
              weightData.form.startWeight = data.startWeight;
              weightData.form.endWeight = data.endWeight;
              weightData.form.chargingWeight = data.chargingWeight;
            }
            weightData.editLoading = false;
            break;
          case 'rule':
            if (commonForm.isEdit || ruleData.isLook || ruleData.isSave) {
              const data = commonForm.curData as any;
              ruleData.form.extraService = data.extraService;
              ruleData.form.orderType = data.orderType;
              ruleData.form.constraintFormulas = data.constraintFormulas;
              ruleData.form.addOperating = data.addOperating;
              ruleData.form.orderNo = data.orderNo;
              ruleData.form.responseMsg = data.responseMsg;
              (ruleData.form.dateRange as any) = [data.startTime, data.endTime];
            }
            ruleData.editLoading = false;
            break;
        }
      };

      const onClose = (type) => {
        switch (type) {
          case 'zone':
            formResetFields(zoneFormRef);
            break;
          case 'weight':
            formResetFields(weightFormRef);
            break;
          case 'rule':
            formResetFields(ruleFormRef);
            break;
        }
      };

      const onSubmit = async (operateType) => {
        switch (operateType) {
          case 'zone':
            await formValidate(zoneFormRef);
            try {
              const data = { ...zoneData.form };
              data.teamId = teamId.value;
              if (commonForm.isEdit) {
                data.zoningId = (commonForm.curData as any).zoningId;
                await editZone(data);
                createBriefSuccessMsg('编辑分区成功！');
              } else {
                await addZone(data);
                createBriefSuccessMsg('添加分区成功！');
              }
              await loadZoneList();
              zoneData.visible = false;
            } catch (e) {
              console.error(e);
            }
            break;
          case 'weight':
            await formValidate(weightFormRef);
            try {
              const data = { ...weightData.form };
              data.teamId = teamId.value;
              if (commonForm.isEdit) {
                data.weightId = (commonForm.curData as any).weightId;
                await editWeight(data);
                createBriefSuccessMsg('编辑重量段成功！');
              } else {
                await addWeight(data);
                createBriefSuccessMsg('添加重量段成功！');
              }
              await loadWeightList();
              weightData.visible = false;
            } catch (e) {
              console.error(e);
            }
            break;
          case 'rule':
            await formValidate(ruleFormRef);
            try {
              const { startTime, endTime } = getPickerDate(ruleData.form.dateRange as any);
              ruleData.form.startTime = startTime;
              ruleData.form.endTime = endTime;
              const data = { ...ruleData.form };
              data.teamId = teamId.value;
              if (commonForm.isEdit) {
                data.specialRulesId = (commonForm.curData as any).specialRulesId;
                await editRule(data);
                createBriefSuccessMsg('编辑特殊规则成功！');
              } else {
                await addRule(data);
                createBriefSuccessMsg('添加特殊规则成功！');
              }
              await loadRuleList();
              ruleData.visible = false;
            } catch (e) {
              console.error(e);
            }
            break;
        }
      };

      const addShow = (type) => {
        commonForm.title = '新增';
        commonForm.isEdit = false;
        commonForm.curData = null;

        switch (type) {
          case 'zone':
            formResetFields(zoneFormRef);
            zoneData.visible = true;
            break;
          case 'weight':
            formResetFields(weightFormRef);
            weightData.visible = true;
            break;
          case 'rule':
            formResetFields(ruleFormRef);
            ruleData.isLook = false;
            ruleData.isSave = false;
            ruleData.visible = true;
            break;
        }
      };

      onMounted(() => {
        setTitle(`${route.params.name} 服务产品详情`);
      });

      return {
        teamId,
        route,
        activeName,
        zoneFormRef,
        zoneData,
        commonForm,
        delWeightList,
        weightData,
        weightPage,
        weightFormRef,
        importData,
        ruleData,
        ruleFormRef,
        pubData,
        channelData,
        channelDataLoading,
        channelColumns,
        saleProductData,
        saleProductDataLoading,
        saleProductColumns,

        handleTabClick,
        pubSubmit,
        ruleOperate,
        selectWeightChange,
        bathWeightDel,
        onSubmit,
        operate,
        addShow,
        onOpened,
        onClose,
        onWeightPageChange,
        importShow,
        onImportSuccess,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .service-product-detail {
    .base-info {
      max-width: 600px;
    }
  }
</style>

<template>
  <div class="zoning-scheme-detail">
    <div class="text-xl mb-20px">{{ route.params.name }} 分区方案</div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="info">
        <el-form label-width="130px" class="base-info">
          <el-form-item label="所属产品组">
            <el-input :model-value="route.params.productName" :disabled="true" />
          </el-form-item>
          <el-form-item label="分区方案名称">
            <el-input :model-value="baseInfo.schemeName" :disabled="true" />
          </el-form-item>
          <el-form-item label="分区方案编号">
            <el-input :model-value="baseInfo.schemeCode" :disabled="true" />
          </el-form-item>
          <el-form-item label="起始邮编">
            <el-input :model-value="baseInfo.startZipCode" :disabled="true" />
          </el-form-item>
          <el-form-item label="结束邮编">
            <el-input :model-value="baseInfo.endZipCode" :disabled="true" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="收费分区" name="zone">
        <div class="mb-20px">
          <import-button
            :disabled="ImportBtnDisabled"
            @click="importFileShow"
            v-auth="['system::zoningSchemeDetail:import']"
          />

          <export-button
            :api="exportScheme"
            :params="{ schemeId }"
            :filename="`${route.params.name}_分区方案下收费分区信息`"
          />
        </div>
        <div class="zone-list">
          <div class="zone-wrap">
            <div class="zone-wrap-header">分区代码信息</div>
            <div class="zone-wrap-container">
              <template v-if="!!codeList.length">
                <div
                  class="zone-wrap-item"
                  :class="{ 'zone-wrap-item-active': item.zoningId === curCode.zoningId }"
                  v-for="item in codeList"
                  :key="item.zoningId"
                  @click="codeClick(item)"
                >
                  <p>分区代码名称：{{ item.zoningName }}</p>
                  <p class="mt-10px">分区代码编号：{{ item.zoningCode }}</p>
                </div>
              </template>
              <template v-else>
                <div class="empty-container">
                  <span class="empty-container__text">暂无数据</span>
                </div>
              </template>
            </div>
          </div>
          <div class="zone-wrap">
            <div class="zone-wrap-header">
              <add-button
                @click="addShow('country')"
                :disabled="btnDisabled"
                v-auth="['system::zoningSchemeDetail:add']"
              >
                添加
              </add-button>
              <danger-button
                @click="batchDel('country')"
                :disabled="countryDelBtnDisabled"
                v-auth="['system::zoningSchemeDetail:del']"
              >
                删除
              </danger-button>
            </div>
            <div class="zone-wrap-container">
              <el-table
                :data="zoningData.pgPartitioningStates"
                size="small"
                border
                stripe
                highlight-current-row
                v-loading="zoningData.loading"
                @current-change="handleCurrentChange"
                @selection-change="handleSelectCountryChange"
              >
                <el-table-column type="selection" width="50" />
                <el-table-column prop="stateShortName" label="国家简称" />
                <el-table-column prop="stateName" label="中文名称" />
                <el-table-column prop="stateNameEn" label="英文名称" />
              </el-table>
            </div>
          </div>
          <div class="zone-wrap">
            <div class="zone-wrap-header">
              <add-button
                :disabled="postcodeBtnDisabled"
                @click="addShow('postcode')"
                v-auth="['system::zoningSchemeDetail:add']"
                >新增</add-button
              >
              <danger-button
                :disabled="postcodeDelBtnDisabled"
                @click="batchDel('postcode')"
                v-auth="['system::zoningSchemeDetail:del']"
                >删除</danger-button
              >
            </div>
            <div class="zone-wrap-container">
              <el-table
                :data="zoningData.pgChargePartitions"
                size="small"
                border
                stripe
                v-loading="zoningData.loading"
                @selection-change="handleSelectCodeChange"
              >
                <el-table-column type="selection" width="50" />
                <el-table-column prop="startZipCode" label="开始邮编" />
                <el-table-column prop="endZipCode" label="结束邮编" />
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <import-dialog
      v-model="schemeImportState.visible"
      :action="schemeImportState.action"
      :params="schemeImportState.params"
      :template-url="schemeImportState.templateUrl"
      @success="onImportSuccess"
    />

    <basic-dialog @submit="onCountrySubmit" width="480px" v-model="countryForm.visible" title="新增">
      <el-form
        label-width="120px"
        size="small"
        :model="countryForm.form"
        :rules="countryForm.rules"
        ref="countryFormRef"
      >
        <el-form-item label="国家简称" prop="stateShortName">
          <el-select
            placeholder="国家简称"
            :model-value="countryForm.form.stateShortName"
            clearable
            filterable
            @change="changeCountry"
          >
            <el-option
              v-for="item in countryForm.countryData"
              :key="item.stateCode"
              :label="item.stateChineseName"
              :value="item.stateCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称" prop="stateName">
          <el-input disabled :model-value="countryForm.form.stateName" />
        </el-form-item>
        <el-form-item label="英文名称" prop="stateNameEn">
          <el-input disabled :model-value="countryForm.form.stateNameEn" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog @submit="onPostCodeSubmit" width="480px" v-model="postcodeForm.visible" title="新增">
      <el-form
        label-width="120px"
        size="small"
        :model="postcodeForm.form"
        :rules="postcodeForm.rules"
        ref="postcodeFormRef"
      >
        <el-form-item label="起始邮编" prop="startZipCode">
          <el-input v-model="postcodeForm.form.startZipCode" />
        </el-form-item>
        <el-form-item label="结束邮编" prop="endZipCode">
          <el-input v-model="postcodeForm.form.endZipCode" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, Ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';

  import {
    addCountry,
    addPost,
    delCountry,
    delPost,
    exportScheme,
    getSchemeDetail,
    getZoningData,
    postcodeByCountry,
    zoningCodeList,
  } from '@/api/logistics/product';
  import {
    ChargeType,
    SchemeDetailListItem,
    SchemeListItem,
    StateType,
  } from '@/api/logistics/product/model/schemeModel';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';
  import { useCountryList } from '@/hooks/select/useSelect';
  import { CountryItem } from '@/api/sys';
  import { formResetFields, formValidate } from '@/utils/tools';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'ZoningSchemeDetail',
    components: {
      BasicDialog,
      ImportDialog,
    },
    setup() {
      const route = useRoute();
      const schemeId = +route.params.id;
      const isCanEdit = !+route.params.status;
      const activeName = ref((route.params.type as string) || 'info');
      const baseInfo = ref({}) as Ref<SchemeListItem>;
      const curCode = ref({
        zoningId: 0,
      });
      const curCountry = ref({
        stateId: '',
      });
      const { createMessage, createConfirm, createBriefSuccessMsg } = useMessage();
      const { setTitle } = useTabs();
      const zoningData = reactive<{
        loading: boolean;
        pgPartitioningStates: StateType[];
        pgChargePartitions: ChargeType[];
      }>({
        loading: false,
        pgPartitioningStates: [],
        pgChargePartitions: [],
      });
      const codeList = ref([]) as Ref<SchemeDetailListItem[]>;
      const countryForm = reactive<any>({
        visible: false,
        submitLoading: false,
        delLoading: false,
        form: {
          stateShortName: '', // 分区国家简称
          stateName: '', // 中文名称
          stateNameEn: '', // 英文名称
        },
        rules: {
          stateShortName: [{ required: true, message: '请选择国家', trigger: 'change' }],
        },
        countryData: [],
      });
      const countryFormRef = ref();
      const postcodeForm = reactive({
        visible: false,
        submitLoading: false,
        exportLoading: false,
        form: {
          startZipCode: '', // 起始邮编
          endZipCode: '', // 结束邮编
        },
        rules: {
          startZipCode: [
            { required: true, message: '请输入起始邮编', trigger: 'blur' },
            { min: 0, max: 5, message: '起始邮编输入有误', trigger: 'blur' },
          ],
          endZipCode: [
            { required: true, message: '请输入结束邮编', trigger: 'blur' },
            { min: 0, max: 5, message: '结束邮编输入有误', trigger: 'blur' },
          ],
        },
      });
      const postcodeFormRef = ref();
      const btnDisabled = computed(() => {
        return !isCanEdit || !codeList.value.length;
      });
      const countryDelBtnDisabled = computed(() => {
        return !isCanEdit || !codeList.value.length || !selectData.countryData.length;
      });
      const postcodeBtnDisabled = computed(() => {
        return !isCanEdit || !zoningData.pgPartitioningStates.length || !curCountry.value.stateId;
      });
      const postcodeDelBtnDisabled = computed(() => {
        return !isCanEdit || !selectData.postcodeData.length;
      });
      const ImportBtnDisabled = computed(() => {
        return !isCanEdit || !codeList.value.length;
      });
      const selectData = reactive({
        countryData: [],
        postcodeData: [],
      });

      const onImportSuccess = async ({ close }) => {
        (countryForm.countryData as CountryItem[]) = await useCountryList();
        await loadCodeList();
        close && close();
      };

      const batchDel = async (type) => {
        if (type === 'country') {
          if (!selectData.countryData.length) {
            return;
          }
          const stateIdList = (selectData.countryData as StateType[]).map((e) => e.stateId);
          try {
            createConfirm({
              title: `删除`,
              message: '请确认是否要删除？',
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    await delCountry(stateIdList);
                    createBriefSuccessMsg('删除国家成功');
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
                loadZoningData(curCode.value);
              })
              .catch(() => {});
          } catch (e) {
            console.error(e);
          }
        } else {
          if (!selectData.postcodeData.length) {
            createMessage.info('no data');
            return;
          }
          const chargePartitionIdList = (selectData.postcodeData as ChargeType[]).map((e) => e.chargePartitionId);
          try {
            createConfirm({
              title: `删除`,
              message: '请确认是否要删除？',
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    await delPost(chargePartitionIdList);
                    createBriefSuccessMsg('删除邮编成功');
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
                if (curCountry.value.stateId) {
                  loadPostcodeByCountry();
                } else {
                  loadZoningData(curCode.value);
                }
              })
              .catch(() => {});
          } catch (e) {
            console.error(e);
          }
        }
      };

      const onCountrySubmit = async () => {
        await formValidate(countryFormRef);
        const data = {
          ...countryForm.form,
          zoningId: curCode.value.zoningId,
          schemeId,
        };
        try {
          await addCountry(data);
          await loadZoningData(curCode.value);
          countryForm.visible = false;
          createBriefSuccessMsg('添加国家成功！');
        } catch (e) {
          console.error(e);
        }
      };

      const onPostCodeSubmit = async () => {
        await formValidate(postcodeFormRef);
        const data = {
          ...postcodeForm.form,
          stateId: curCountry.value.stateId,
          zoningId: curCode.value.zoningId,
          schemeId,
        };
        try {
          await addPost(data);
          if (curCountry.value.stateId) {
            await loadPostcodeByCountry();
          } else {
            await loadZoningData(curCode.value);
          }
          postcodeForm.visible = false;
          createBriefSuccessMsg('添加邮编成功！');
        } catch (e) {
          console.error(e);
        }
      };

      const changeCountry = (stateCode) => {
        const selectCountry = (countryForm.countryData as CountryItem[]).find((e) => e.stateCode === stateCode);
        if (selectCountry) {
          countryForm.form.stateShortName = stateCode;
          countryForm.form.stateName = selectCountry.stateChineseName;
          countryForm.form.stateNameEn = selectCountry.stateEnglishName;
        } else {
          createMessage.info('请选择一个国家');
        }
      };

      const schemeImportState = importDialogState(UploadApi.Postcode, '', { schemeId: schemeId });

      /**
       * 加载分区数据
       * @return {Promise<void>}
       */
      const loadCodeList = async () => {
        try {
          const data = await zoningCodeList(schemeId);
          data.length && (await codeClick(data[0])); // 默认选择第一个分区 加载第一个分区下对国家和邮编
          codeList.value = data;
        } catch (e) {
          codeList.value = [];
        }
      };

      const importFileShow = () => {
        schemeImportState.visible = true;
      };

      /**
       * 加载某个分区中单个国家下的所有的邮编
       * @param item
       * @return {Promise<void>}
       */
      const loadPostcodeByCountry = async (item?) => {
        try {
          let stateId = item?.stateId;
          if (!stateId) stateId = +curCountry.value.stateId;
          const data = await postcodeByCountry(stateId);
          if (data) {
            zoningData.pgChargePartitions = data;
          } else {
            zoningData.pgChargePartitions = [];
          }
        } catch (e) {
          console.error(e);
          zoningData.pgChargePartitions = [];
        }
      };

      const addShow = async (type) => {
        if (type === 'country') {
          formResetFields(countryFormRef);
          countryForm.visible = true;
        } else {
          formResetFields(postcodeFormRef);
          postcodeForm.visible = true;
        }
      };

      const handleCurrentChange = async (currentRow) => {
        if (currentRow) {
          curCountry.value = currentRow;
          await loadPostcodeByCountry(currentRow);
        }
      };

      const handleSelectCodeChange = (val) => {
        selectData.postcodeData = val;
      };

      const handleSelectCountryChange = (val) => {
        selectData.countryData = val;
      };

      /**
       * 同时加载分区下国家和邮编数据
       * @param item
       * @return {Promise<void>}
       */
      const loadZoningData = async (item) => {
        zoningData.loading = true;
        try {
          let zoningId = item?.zoningId;
          if (!zoningId) zoningId = +curCode.value.zoningId;
          const { pgPartitioningStates, pgChargePartitions } = await getZoningData(zoningId);
          zoningData.pgPartitioningStates = pgPartitioningStates; // 国家数据
          zoningData.pgChargePartitions = pgChargePartitions; // 邮编
        } catch (e) {
          console.error(e);
          zoningData.pgPartitioningStates = [];
          zoningData.pgChargePartitions = [];
        }
        zoningData.loading = false;
      };

      /**
       * 切换分区
       * @param item
       * @return {Promise<void>}
       */
      const codeClick = async (item) => {
        curCode.value = item;
        curCountry.value.stateId = '';
        await loadZoningData(item);
      };

      const loadSchemeInfo = async () => {
        try {
          baseInfo.value = await getSchemeDetail(schemeId);
        } catch (e) {
          console.error(e);
        }
      };

      const handleTabClick = async () => {
        try {
          if (activeName.value === 'info') {
            await loadSchemeInfo();
          } else if (activeName.value === 'zone') {
            (countryForm.countryData as CountryItem[]) = await useCountryList();
            await loadCodeList();
          }
        } catch (e) {
          console.error(e);
        }
      };

      onMounted(async () => {
        activeName.value = route.params.type as string;
        await setTitle(`${route.params.name} 分区方案详情`);
        if (activeName.value === 'info') {
          await loadSchemeInfo();
        } else if (activeName.value === 'zone') {
          (countryForm.countryData as CountryItem[]) = await useCountryList();
          await loadCodeList();
        }
      });

      return {
        activeName,
        selectData,
        zoningData,
        curCountry,
        curCode,
        route,
        codeList,
        baseInfo,
        countryForm,
        countryFormRef,
        btnDisabled,
        countryDelBtnDisabled,
        postcodeBtnDisabled,
        ImportBtnDisabled,
        postcodeDelBtnDisabled,
        schemeImportState,
        schemeId,
        postcodeForm,
        postcodeFormRef,

        handleTabClick,
        importFileShow,
        onPostCodeSubmit,
        exportScheme,
        changeCountry,
        handleCurrentChange,
        handleSelectCodeChange,
        handleSelectCountryChange,
        codeClick,
        onImportSuccess,
        addShow,
        onCountrySubmit,
        batchDel,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .base-info {
    max-width: 580px;
  }
  .zone-list {
    display: flex;
    border: 1px solid #ebeef5;
  }
  .zone-wrap {
    // flex: 0 0 33.33%;

    &:nth-child(1) {
      flex: 0 0 20%;
      .zone-wrap-header {
        border-bottom: 1px solid #ebeef5;
      }
    }
    &:nth-child(2) {
      flex: 0 0 40%;
    }
    &:nth-child(3) {
      flex: 0 0 40%;
    }

    &-header {
      height: 45px;
      border-right: 1px solid #ebeef5;
      display: flex;
      align-items: center;
      padding-left: 20px;
      box-sizing: border-box;
    }

    &-container {
      //border-right: 1px solid #ebeef5;
    }
    &:last-child .zone-wrap-header,
    &:last-child .zone-wrap-container {
      border-right: none;
    }

    &-item {
      padding: 8px 0 8px 20px;
      color: #666;
      border-bottom: 1px solid #ebeef5;

      &:nth-child(odd) {
        background-color: #fafafa;
      }

      &:last-child {
        border-bottom: none;
      }

      &.zone-wrap-item-active {
        background-color: #dee8ff;
      }
    }
  }
</style>

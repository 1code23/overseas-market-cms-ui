<template>
  <el-form
    :model="formData"
    :rules="rules"
    ref="formRef"
    label-width="200px"
    class="detail-form"
    label-suffix=":"
  >
    <el-form-item label="市场名称" prop="marketId">
      <el-select
        size="small"
        filterable
        v-model="formData.marketId"
        placeholder="请选择市场名称"
      >
        <el-option
          v-for="item in marketList"
          :key="item.marketId"
          :label="item.marketName"
          :value="item.marketId"
        >
          <span>
            {{ item.marketName }} -- {{ item.marketId }} --
            {{ item.versionCode }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="配置生效起始版本号" required>
      <div class="disfr">
        <el-form-item prop="marketMin">
          <el-input
            v-model.trim="formData.marketMin"
            placeholder="请输入最小版本号"
            style="width: 170px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="marketMax">
          <el-input
            v-model.trim="formData.marketMax"
            placeholder="请输入最大版本号"
            style="width: 170px; margin-left: 10px"
          ></el-input>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="国家" prop="countryCode">
      <el-select
        size="small"
        filterable
        v-model="formData.countryCode"
        placeholder="请选择国家"
      >
        <el-option
          v-for="item in deviceList"
          :key="item.countryCode"
          :value="item.countryCode"
          :label="item.countryName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input
        size="small"
        type="textarea"
        :rows="5"
        show-word-limit
        maxlength="200"
        v-model="formData.remarks"
        placeholder="请输入备注"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" @click="handleSubmit()"
        >确定</el-button
      >
      <el-button size="small" @click="handleCancel()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      },
    },
    operationType: { default: "" },
    deviceList: {
      type: Array,
      default() {
        return [];
      },
    },
    marketList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      formData: { ...this.detailData },
      rules: {
        countryCode: [
          { required: true, message: "请选择国家", trigger: "blur" },
        ],
        marketMin: [
          { required: true, message: "请输入最小版本号", trigger: "blur" },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入大于0的正整数",
          },
        ],
        marketMax: [
          { required: true, message: "请输入最大版本号", trigger: "blur" },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入大于0正整数",
          },
        ],
        marketId: [{ required: true, message: "请选择市场", trigger: "blur" }],
      },
    };
  },
  computed: {
    disabled() {
      return this.operationType === "edit";
    },
  },
  mounted() {
    this.getRandTimeList();
  },
  methods: {
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.formData.marketMax = Number(this.formData.marketMax);
          this.formData.marketMin = Number(this.formData.marketMin);
          if (this.formData.marketMin > this.formData.marketMax) {
            this.$message.error("最小版本号不可大于最大版本号");
            return;
          }
          this.$emit("submit", this.formData);
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    handleCancel() {
      this.$emit("cancel");
    },
    getRandTimeList() {
      const randTimeList = new Array(24).fill(0);
      for (let i in randTimeList) {
        randTimeList[i] = parseInt(i);
      }
      this.randTimeList = randTimeList;
    },
  },
  watch: {
    detailData(data) {
      this.formData = { ...data };
      if (this.operationType === "create") {
        this.$refs.formRef.resetFields();
      }
    },
  },
};
</script>

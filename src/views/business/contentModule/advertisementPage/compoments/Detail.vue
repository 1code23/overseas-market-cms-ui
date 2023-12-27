<template>
  <el-form
    :model="formData"
    :rules="rules"
    ref="formRef"
    label-width="200px"
    class="detail-form"
    label-suffix=":"
  >
    <!-- <el-form ref="ruleForm" v-model="form" :rules="rules" label-width="100px"> -->
    <!-- <el-form-item label="选择类型:" required>
        <el-radio-group v-model="form.status">
          <el-radio :label="1">拉黑</el-radio>
          <el-radio :label="2">禁言</el-radio>
        </el-radio-group>
      </el-form-item> -->
    <el-form-item label="列表名称:" prop="name">
      <el-input v-model="formData.name" placeholder="请输入列表名称"></el-input>
    </el-form-item>
    <el-form-item label="使用位置:" prop="position">
      <el-input
        v-model="formData.position"
        placeholder="请输入使用位置"
      ></el-input>
    </el-form-item>
    <el-form-item label="列表ID:" prop="blockId">
      <el-input
        v-model="formData.blockId"
        placeholder="请输入列表ID"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="样式:" prop="style">
      <el-select v-model="formData.style" placeholder="请选择样式" disabled>
        <el-option
          v-for="item in styleList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="模块:">
      <el-input v-model="formData.module" placeholder="请输入模块"></el-input>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input
        type="textarea"
        v-model="formData.description"
        rows="2"
        maxlength="300"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" @click="handleSubmit()"
        >确定</el-button
      >
      <el-button size="small" @click="handleCancel()">取消</el-button>
    </el-form-item>
    <!-- </el-form> -->
    <!-- <el-form-item>
      <el-button size="small" type="primary" @click="handleSubmit()"
        >确定</el-button
      >
      <el-button size="small" @click="handleCancel()">取消</el-button>
    </el-form-item> -->
  </el-form>
</template>
<script>
import { styleList } from "@/common/constant/constant";
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
      styleList,
      formData: { ...this.detailData },
      rules: {
        name: [{ required: true, message: "请输入列表名称", trigger: "blur" }],
        position: [
          { required: true, message: "请输入使用位置", trigger: "blur" },
        ],
        blockId: [{ required: true, message: "请输入列表ID", trigger: "blur" }],
        style: [{ required: true, message: "请选择样式", trigger: "blur" }],
      },
    };
  },
  computed: {
    disabled() {
      return this.operationType === "edit";
    },
  },
  mounted() {
    // this.getRandTimeList();
  },
  methods: {
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
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

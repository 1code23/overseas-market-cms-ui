<template>
  <el-dialog
    :title="type === 'add' ? '新增' : '编辑'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="700px"
    center
  >
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="手机型号：" prop="deviceName">
        <el-select v-model="form.deviceName" placeholder="请选择手机型号">
          <el-option
            v-for="item in $parent.deviceList"
            :key="item.id"
            :label="item.deviceName"
            :value="item.deviceName"
            :disabled="item.status == 1"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国家" prop="countryCode">
        <el-select
          size="small"
          filterable
          multiple
          collapse-tags
          v-model="checkCountryCode"
          placeholder="请选择国家"
        >
          <el-option
            v-for="item in countryList"
            :key="item.countryCode"
            :value="item.countryCode"
            :label="item.countryName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称：" prop="name">
        <el-input
          v-model.trim="form.name"
          placeholder="请输入应用名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="应用包名：" prop="pname">
        <el-input
          v-model.trim="form.pname"
          placeholder="请输入应用包名"
        ></el-input>
      </el-form-item>
      <el-form-item label="配置生效起始版本号：" required>
        <div class="disfr">
          <el-form-item prop="minVersionInterval">
            <el-input
              v-model.trim="form.minVersionInterval"
              placeholder="请输入最小版本号"
              style="width: 170px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="maxVersionInterval">
            <el-input
              v-model.trim="form.maxVersionInterval"
              placeholder="请输入最大版本号"
              style="width: 170px; margin-left: 10px"
            ></el-input>
          </el-form-item>
        </div>
        <!-- <el-select
          v-model="form.minVersionInterval"
          placeholder="最小版本"
          style="width: 200px"
          clearable
        >
          <el-option
            v-for="i in $parent.apiVersionList"
            :key="i.marketId"
            :label="i.versionCode"
            :value="i.versionCode"
          ></el-option>
        </el-select>
        <el-select
          v-model="form.maxVersionInterval"
          placeholder="最大版本"
          style="width: 200px; margin-left: 10px"
          clearable
        >
          <el-option
            v-for="i in $parent.apiVersionList"
            :key="i.marketId"
            :label="i.versionCode"
            :value="i.versionCode"
          ></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入描述"
          v-model="form.description"
          maxlength="250"
          show-word-limit
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('ruleForm')">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { insertApkBlack, updateApkBlackById } from "@/api/blacklistModule";
export default {
  props: {
    isShow: Boolean,
    row: Object,
    type: String,
    countryList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      },
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.form = { ...this.row };
        if (this.row.versionInterval) {
          this.checkCountryCode = this.form.countryCode.split(",");
          let [minVersionInterval, maxVersionInterval] =
            this.row.versionInterval.split("-");
          this.$set(this.form, "minVersionInterval", minVersionInterval);
          this.$set(this.form, "maxVersionInterval", maxVersionInterval);
        }
      } else {
        this.checkCountryCode = [];
        this.$refs["ruleForm"].clearValidate();
        this.form = this.$options.data().form;
      }
    },
  },
  data() {
    return {
      rules: {
        deviceName: [
          { required: true, message: "请选择手机型号", trigger: "blur" },
        ],
        countryCode: [
          { required: true, message: "请选择国家", trigger: "blur" },
        ],
        minVersionInterval: [
          { required: true, message: "请输入最小版本号", trigger: "blur" },
        ],
        maxVersionInterval: [
          { required: true, message: "请输入最大版本号", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
        pname: [{ required: true, message: "请输入应用包名", trigger: "blur" }],
        description: [
          { required: false, message: "请输入描述", trigger: "blur" },
        ],
      },
      form: {
        deviceId: "",
        deviceName: "",
        name: "",
        pname: "",
        minVersionInterval: "",
        maxVersionInterval: "",
        description: "",
      },
      checkCountryCode: [],
    };
  },
  methods: {
    save(formName) {
      if (this.checkCountryCode.length <= 0) {
        this.$message.error("请选择国家");
        return false;
      } else {
        this.form.countryCode = this.checkCountryCode.join(",");
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.maxVersionInterval || !this.form.minVersionInterval) {
            this.$message.warning("请配置生效起始版本号");
            return false;
          }
          if (
            Number(this.form.maxVersionInterval) <
            Number(this.form.minVersionInterval)
          ) {
            this.$message.warning("最大版本号不能小于最小版本号");
            return false;
          }
          if (this.form.countryName) {
            delete this.form.countryName;
          }
          if (this.type === "edit") {
            updateApkBlackById(this.form).then((res) => {
              if (res.code === 0) {
                this.dialogVisible = false;
                this.$parent.getDataList();
                this.$message.success("编辑成功");
              }
            });
          } else {
            insertApkBlack(this.form).then((res) => {
              if (res.code === 0) {
                this.dialogVisible = false;
                this.$parent.getDataList();
                this.$message.success("添加成功");
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.el-select-dropdown {
  width: 10%;
}
</style>

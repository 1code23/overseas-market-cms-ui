<template>
  <div id="addEditdialog">
    <el-dialog
      :title="dialogName"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      center="center"
      @close="closeDialog"
    >
      <el-form
        :model="ruleData"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="手机型号：" prop="phoneModel" label-width="29%">
          <el-select
            v-model="ruleData.phoneModel"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in deviceList"
              :key="item.id"
              :label="item.deviceName"
              :value="item.deviceName"
              :disabled="item.status == 1"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道：" prop="channelNo" label-width="29%">
          <el-input
            v-model.trim="ruleData.channelNo"
            placeholder="请输入渠道"
          ></el-input>
          <!-- <el-select
            v-model="ruleData.onlineBranch"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in onlineBranchList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select> -->
        </el-form-item>

        <el-form-item label="配置生效起始版本号：" label-width="29%" required>
          <el-col :span="9">
            <el-form-item prop="marketId">
              <el-input
                v-model.trim="ruleData.marketId"
                placeholder="请输入最小版本号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="maxMarket">
              <el-input
                v-model.trim="ruleData.maxMarket"
                placeholder="请输入最大版本号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="间隔时间（分钟）：" prop="rate" label-width="29%">
          <el-input
            v-model="ruleData.rate"
            placeholder="请输入间隔时间"
          ></el-input>
          <!-- onkeyup="this.value = this.value.replace(/[^0-9]/g,'');" -->
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime" label-width="29%">
          <el-date-picker
            v-model="ruleData.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间："
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime" label-width="29%">
          <el-date-picker
            v-model="ruleData.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间："
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item class="footBtn">
          <el-button type="primary" @click="dialogVisibleSubmit('ruleForm')"
            >确 定</el-button
          >
          <el-button @click="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// import request from "@/config/serve.js";
import { mapGetters } from "vuex";
import { getSDKList } from "../api";
import {
  updateStatus, //更新范围
  onlineBranchList,
} from "@/common/constant/constant.js";
import UploadFile from "@/components/UploadFile";
export default {
  components: {
    UploadFile,
  },
  computed: {
    ...mapGetters(["deviceList"]),
  },
  props: {
    formParams: {
      type: Object,
      default() {
        return {};
      },
    },
    clientVersion: {
      type: Array,
      default() {
        return [];
      },
    },
    dialogName: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      updateStatus,
      onlineBranchList,
      dialogVisible: false,
      fileList: [],
      SDKList: [],
      loading: false,
      ruleData: {
        channelNo: "",
        endTime: "",
        startTime: "",
        rate: "",
        marketId: "",
        maxMarket: "",
      },

      // onlineBranchList: [
      //   { key: "TY", value: "通用" },
      //   { key: "gms", value: "GMS" },
      // ],
      rules: {
        phoneModel: [
          { required: true, message: "请选择手机型号", trigger: "change" },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
        marketId: [
          {
            required: true,
            message: "请输入配置生效最低版本号",
            trigger: "change",
          },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入大于0的正整数",
          },
        ],
        maxMarket: [
          {
            required: true,
            message: "请输入配置生效最高版本号",
            trigger: "change",
          },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入大于0的正整数",
          },
        ],

        channelNo: [{ required: true, message: "请输入渠道", trigger: "blur" }],

        rate: [
          {
            required: true,
            message: "请输入时间间隔",
            trigger: "blur",
          },
          {
            pattern: /^(0|[1-9]\d{0,8})$/,
            message: "请输入大于等于0的正整数且不大于9位数的数字",
          },
        ],
      },
      resource: "",
      options: [],

      checkList: [],
    };
  },
  methods: {
    init() {
      this.dialogVisible = true;
      if (this.dialogName != "新增") {
        this.ruleData = JSON.parse(JSON.stringify(this.$props.formParams));
      } else {
        this.ruleData = {
          channelNo: "",
          endTime: "",
          startTime: "",
          rate: "",
          marketId: "",
          maxMarket: "",
        };
        // this.$refs.ruleForm.resetFields();
      }
    },
    dialogVisibleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            Number(this.ruleData.maxMarket) < Number(this.ruleData.marketId)
          ) {
            this.$message.error("最大版本号不能小于最小版本号");
            return;
          }
          if (
            this.compareTimes(this.ruleData.startTime, this.ruleData.endTime) >
            0
          ) {
            this.$message.error("开始时间需小于结束时间");
            return;
          }
          // if (this.ruleData.onlineBranch == "TY") {
          //   this.ruleData.onlineBranch = "";
          // }
          if (this.dialogName == "新增") {
            this.ruleData.status = 1;
            this.$emit("submitBTN", true, this.ruleData);
            this.dialogVisible = false;
          } else {
            this.$emit("submitBTN", false, this.ruleData);
            this.dialogVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    changeRadio(val) {
      if (val == "1") {
        this.resource = "1";
      } else {
        this.checkList = [];
      }
    },

    closeDialog() {
      this.$refs.ruleForm.resetFields();
    },
    compareTimes(time1, time2) {
      const date1 = new Date(time1);
      const date2 = new Date(time2);

      if (date1 < date2) {
        return -1;
      } else if (date1 > date2) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  watch: {
    checkList(newData, oldData) {
      if (newData.length == "0") {
        this.resource = "0";
      } else if (newData.length != 0 && newData.length != 24) {
        this.resource = "";
      } else if (newData.length == 24) {
        this.resource = "1";
      }
    },
  },
  created() {
    this.$store.dispatch("updateDeviceList");
  },
};
</script>
<style scoped lang="scss">
#addEditdialog {
  .footBtn {
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
  }
  /deep/ .el-input {
    width: 68%;
  }
  /deep/ .el-select {
    width: 68%;
    .el-input {
      width: 100%;
    }
  }

  // /deep/ .el-form-item__content {
  //   margin-left: 0;
  //   // display: flex;
  //   // justify-content: flex-start;
  //   // align-items: center;
  // }
  // /deep/ .el-upload {
  //   display: inline-block;
  // }
  .upload-demo {
    margin-left: 20px;
    display: inline-block;
  }
}
</style>

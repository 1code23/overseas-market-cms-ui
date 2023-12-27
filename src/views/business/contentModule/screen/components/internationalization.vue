<template>
  <div>
    <el-dialog
      title="国际化"
      :visible.sync="interDialog"
      :close-on-click-modal="false"
      width="60%"
      center="center"
      id="interD"
    >
      <el-button
        type="primary"
        v-has="'languageAdd'"
        @click="addLanguage"
        style="margin-bottom: 20px"
        >添加国家</el-button
      >
      <PageTable
        :columns="modelTabelHead"
        :tableData="{ list: modelTabelList, ...queryModules }"
        @page-change="handleChangePage"
      >
        <!-- <el-table-column label="序号" align="center" slot="prefix">
          <template slot-scope="scope"
            ><span> {{ scope.$index + 1 }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="{ row }">
            <!-- <el-tag
              size="small"
              v-has="'languageEdit'"
              @click="edit(row)"
              style="margin-right: 15px; cursor: pointer"
              >编辑
            </el-tag>  -->
            <el-tag
              size="small"
              @click="remove(row)"
              v-has="'languageDelete'"
              type="danger"
              style="cursor: pointer"
              >删除
            </el-tag>
          </template>
        </el-table-column></PageTable
      >
    </el-dialog>
    <!-- 添加国家弹窗 -->
    <el-dialog
      :title="dialogName"
      :visible.sync="showLanguage"
      :close-on-click-modal="false"
      append-to-body
      center
      @close="closedialog"
      width="50%"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="addform"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="Languagelist">
          <el-form-item
            label="选择国家："
            prop="areaCode"
            style="margin: 50px 0"
          >
            <el-select
              v-model="ruleForm.areaCode"
              placeholder="请选择国家"
              @change="changeLanguage"
              :disabled="disabled"
            >
              <el-option
                :label="item.countryName"
                :value="item.countryCode"
                v-for="(item, index) in filterLanguageList"
                :key="index"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="描述：" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入描述"
            v-model="ruleForm.description"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <div class="footerBtn">
        <el-button type="primary" @click="submitForm('addform')"
          >确定</el-button
        >
        <el-button @click="showLanguage = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PageTable from "@/components/PageTable.vue";
import { getdescList, addDescList, deleteDescList, editdescList } from "../api";
import { mapGetters } from "vuex";
export default {
  components: { PageTable },
  computed: {
    ...mapGetters(["languageList", "countryList"]),
    filterLanguageList() {
      // return this.languageList.map((l) => {
      return this.countryList.map((l) => {
        let item = { ...l };
        this.checkAllTabelList.map((a) => {
          // this.modelTabelList.map((a) => {
          // if (a.language == l.languageName) {
          if (a.areaCode == l.countryCode) {
            item.disabled = true;
          }
        });
        return item;
      });
    },
  },
  props: {
    formParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      interDialog: false,
      dialogName: "",
      disabled: false,
      modelTabelHead: [
        { key: "id", label: "ID", align: "center" },
        // { key: "language", label: "国家", align: "center" },
        { key: "countryName", label: "国家", align: "center" },
        { key: "description", label: "描述", align: "center" },
      ], //表格头部
      modelTabelList: [],
      checkAllTabelList: [],
      queryModules: {
        page: 1,
        size: 10,
        total: 0,
      },
      welcomeId: "",
      showLanguage: false,
      ruleForm: { areaCode: "" },
      rules: {
        areaCode: [{ required: true, message: "请选择国家", trigger: "blur" }],
        description: [
          { required: true, message: "请输入更新描述", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 添加国家
    addLanguage() {
      this.showLanguage = true;
      this.dialogName = "新增";
      this.ruleForm = {};
      this.disabled = false;
    },
    edit(row) {
      this.dialogName = "编辑";
      this.showLanguage = true;
      this.ruleForm = { ...row };
      this.disabled = true;
    },
    remove(row) {
      deleteDescList({ id: row.id }).then((res) => {
        if (res.code == 0) {
          this.getMarketUpdateList();
          this.getAllMarketUpdateList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 添加国际化提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogName == "新增") {
            let obj = {
              welcomeId: this.welcomeId,
              ...this.ruleForm,
            };
            addDescList(obj).then((res) => {
              if (res.code == 0) {
                this.getMarketUpdateList();
                this.getAllMarketUpdateList();
                this.showLanguage = false;
              } else {
                // this.$message.error(res.msg);
              }
            });
          } else {
            editdescList(this.ruleForm).then((res) => {
              if (res.code == 0) {
                this.getMarketUpdateList();
                this.getAllMarketUpdateList();
                this.showLanguage = false;
              } else {
                // this.$message.error(res.msg);
              }
            });
          }
        } else {
          this.$message.error("请将信息填写完整");
          return false;
        }
      });
    },
    init() {
      this.interDialog = true;
      this.queryModules.welcomeId = this.$props.formParams.id;
      this.welcomeId = this.$props.formParams.id;
      this.getMarketUpdateList();
      this.getAllMarketUpdateList();
    },
    getMarketUpdateList() {
      getdescList(this.queryModules).then((res) => {
        if (res.code == 0) {
          this.modelTabelList = res.data.list;
          this.queryModules.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getAllMarketUpdateList() {
      getdescList({ ...this.queryModules, page: 1, size: 300 }).then((res) => {
        if (res.code == 0) {
          this.checkAllTabelList = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    closedialog() {
      this.$refs.addform.resetFields();
    },
    handleChangePage({ page, size }) {
      this.queryModules.page = page;
      this.queryModules.size = size;
      this.getMarketUpdateList();
    },
    changeLanguage(val) {
      this.ruleForm.areaCode = val;
      // this.ruleForm.languageType = languagelist.languageType;
    },
  },
  created() {
    // this.$store.dispatch("updateLanguageList");
    this.$store.dispatch("updateCountryList");
  },
};
</script>
<style scoped lang="scss">
#addEditdialog {
}

/deep/ .el-textarea__inner {
  width: 50%;
}
.footerBtn {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}
/deep/ #interD .el-dialog__body {
  height: 400px;
  overflow: auto;
}
</style>

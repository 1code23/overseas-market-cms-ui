<template>
  <el-drawer
    :title="type == 'edit' ? '编辑' : '添加'"
    :visible.sync="drawer"
    direction="rtl"
    :append-to-body="true"
    size="40%"
  >
    <div style="padding: 20px">
      <el-form ref="form" :model="form" label-width="auto" :rules="rules">
        <el-form-item label="国家" prop="areaCode">
          <el-select
            v-model="form.areaCode"
            size="small"
            placeholder="请选择国家"
            :disabled="type === 'edit'"
          >
            <el-option
              :disabled="item.disabled"
              :label="item.countryName"
              :value="item.countryCode"
              v-for="item in filterLanguageList"
              :key="item.countryCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="部署数量:"
          prop="deployNum"
          v-if="styleCode == 201"
        >
          <el-input
            v-model.trim="form.deployNum"
            placeholder="请输入部署数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="最小版本:" prop="marketId">
          <!-- <el-select v-model="form.marketId" placeholder="请选择最小版本">
            <el-option
              v-for="item in versionModule"
              :key="item.marketId"
              :label="item.versionCode"
              :value="item.versionCode"
            >
            </el-option>
          </el-select> -->
          <el-input
            v-model.trim="form.marketId"
            placeholder="请输入最小版本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大版本:" prop="marketMax">
          <!-- <el-select v-model="form.marketMax" placeholder="请选择最大版本">
            <el-option
              v-for="item in versionModule"
              :key="item.marketId"
              :label="item.versionCode"
              :value="item.versionCode"
            >
            </el-option>
          </el-select> -->
          <el-input
            v-model.trim="form.marketMax"
            placeholder="请输入最大版本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            rows="2"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="列表名称" required>
          <el-input v-model="form.nameLang" placeholder="请输入列表名称" />
        </el-form-item> -->
      </el-form>
    </div>
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="save()">确定</el-button>
      <el-button @click="drawer = false">取 消</el-button>
    </el-row>
  </el-drawer>
</template>

<script>
import {
  ozBlockConfAdd,
  ozBlockConfEdit,
  getMarketList,
} from "@/api/ozBlockConf";
import { mapGetters } from "vuex";
export default {
  props: {
    isShow: Boolean,
    row: Object,
    type: String,
    styleCode: Number,
    areaCode: Array,
    checkAllLanguage: Array,
    versionModule: Array,
  },
  computed: {
    ...mapGetters(["countryList"]),
    drawer: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      },
    },
    filterLanguageList() {
      return this.countryList.map((l) => {
        let item = { ...l };
        this.checkAllLanguage.map((a) => {
          // this.language.map((a) => {
          if (a.areaCode == l.countryCode) {
            item.disabled = true;
          }
        });
        return item;
      });
    },
  },
  watch: {
    drawer(val) {
      if (val) {
        this.form = { ...this.row };
      }
      if (this.type == "add") {
        this.$refs.form.resetFields();
      }
    },
  },
  data() {
    return {
      form: {
        areaCode: "",
        deployNum: "",
        marketId: "",
        marketMax: "",
        description: "",
      },
      // versionModule: [],
      rules: {
        areaCode: [
          { required: true, message: "请选择国家", trigger: "change" },
        ],
        deployNum: [
          { required: true, message: "请输入部署数量", trigger: "change" },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入大于0的正整数",
          },
        ],
        marketId: [
          { required: true, message: "请选择最小版本", trigger: "change" },
        ],
        description: [
          { required: true, message: "请输入备注", trigger: "blur" },
        ],
        marketMax: [
          { required: true, message: "请选择最大版本", trigger: "change" },
        ],
      },
    };
  },
  created() {
    // getMarketList({ page: 1, size: 1000, isDelete: 0 }).then((res) => {
    //   if (res.code == 0) {
    //     this.versionModule = res.data.list;
    //   }
    // });
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = { ...this.form, blockId: this.row.blockId };
          if (Number(obj.marketMax) < Number(obj.marketId)) {
            this.$message.error("最大版本号不能小于最小版本号");
            return;
          }
          this.submit(obj);
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    submit(obj) {
      if (this.type === "edit") {
        ozBlockConfEdit(obj).then((res) => {
          if (res.code == 0) {
            this.drawer = false;
            this.$message.success("编辑成功");
            this.$parent.fetchList();
          }
        });
      } else {
        ozBlockConfAdd(obj).then((res) => {
          if (res.code == 0) {
            this.drawer = false;
            this.$message.success("新增成功");
            this.$parent.fetchList();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

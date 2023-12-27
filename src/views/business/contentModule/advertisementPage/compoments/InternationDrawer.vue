<template>
  <el-drawer
    title="国际化"
    :visible.sync="drawer"
    direction="rtl"
    :append-to-body="true"
    size="40%"
  >
    <div style="padding: 20px">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="语言" required>
          <el-select
            v-model="form.language"
            size="small"
            placeholder="请选择类型"
            :disabled="type === 'edit'"
          >
            <el-option
              :disabled="item.disabled"
              :label="item.languageName"
              :value="item.languageType"
              v-for="item in filterLanguageList"
              :key="item.languageType"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="管理语言列表">
          <el-cascader
            v-model="form.language"
            :options="options"
            :props="{ multiple: true }"
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="列表名称" required>
          <el-input v-model="form.nameLang" placeholder="请输入列表名称" />
        </el-form-item>
      </el-form>
    </div>
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="save()">确定</el-button>
      <el-button @click="drawer = false">取 消</el-button>
    </el-row>
  </el-drawer>
</template>

<script>
import { ozBlockConfInsert, ozBlockConfUpdate } from "@/api/ozBlockConf";
import { mapGetters } from "vuex";
export default {
  props: {
    isShow: Boolean,
    row: Object,
    type: String,
    language: Array,
    checkAllLanguage: Array,
  },
  computed: {
    ...mapGetters(["languageList"]),
    drawer: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      },
    },
    filterLanguageList() {
      return this.languageList.map((l) => {
        let item = { ...l };
        this.checkAllLanguage.map((a) => {
          // this.language.map((a) => {
          if (a.language == l.languageType) {
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
    },
  },
  data() {
    return {
      form: {
        language: "",
        nameLang: "",
      },
    };
  },
  methods: {
    save() {
      if (!this.form.language) {
        this.$message.warning("请选择语言");
        return;
      }
      if (!this.form.nameLang) {
        this.$message.warning("请输入列表名称");
        return;
      }
      if (this.type === "edit") {
        ozBlockConfUpdate(this.form).then((res) => {
          if (res.code == 0) {
            this.drawer = false;
            this.$message.success("编辑成功");
            this.$parent.fetchList();
          }
        });
      } else {
        ozBlockConfInsert(this.form).then((res) => {
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

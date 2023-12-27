<template>
  <div class="mainbox">
    <el-row :gutter="6">
      <el-col :span="24">
        <el-form :inline="true" label-suffix=":">
          <!-- <el-form-item label="ID" class="demo-form-inline headLabel"></el-form-item>
            <el-input
              size="small"
              v-model="queryModule.blockId"
              placeholder="请输入列表ID"
              @keydown.native.enter="search()"
            ></el-input>
          </el-form-item> -->
          <el-button
            v-has="'languageAdd'"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="addBtn()"
            >添加语言</el-button
          >
        </el-form>
      </el-col>
    </el-row>
    <PageTable
      :columns="columns"
      :tableData="{ ...queryModule, list }"
      @page-change="handleChangePage"
      :showPagination="false"
    >
      <template slot="language" slot-scope="{ row }">
        <span>{{ row.language | getLanguageName(languageList) }}</span>
      </template>
      <template slot="style" slot-scope="{ row }">
        <span>{{ row.style | typeDesc(styleList) }}</span>
      </template>

      <el-table-column fixed="right" label="操作" width="180px" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-has="'languageEdit'"
            @click="handleOperate('edit', row)"
            >编辑</el-button
          >
          <el-button
            v-has="'languageDelete'"
            type="text"
            @click="handleClickOnOff(row)"
          >
            <span class="colorRed">删除</span>
          </el-button>
        </template>
      </el-table-column>
    </PageTable>
    <InternationDrawer
      :isShow.sync="internationDrawerShow"
      :type="type"
      :row="detailInternationData"
      :language="internationList"
      :checkAllLanguage="checklanguagelist"
    />
  </div>
</template>

<script>
import PageTable from "@/components/PageTable.vue";
import InternationDrawer from "./InternationDrawer.vue";
import { ozBlockDescList, ozBlockConfDelete } from "@/api/ozBlockConf";
import { relationWishById } from "@/api/wishlist";
export default {
  components: { PageTable, InternationDrawer },
  // props: { isShow: Boolean, row: Object },
  // computed: {
  //   dialogVisible: {
  //     get() {
  //       return this.isShow;
  //     },
  //     set(val) {
  //       this.$emit("update:isShow", val);
  //     },
  //   },
  //   appItem() {
  //     return this.list.find((item) => item.apkId === this.activeId);
  //   },
  // },
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      },
    },
    dialogAuditVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
    dialogAuditVisible: {
      handler(newvalue) {
        if (newvalue) {
          this.fetchList({
            blockId: this.detailData.blockId,
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      queryModule: {
        // blockId: "",
        page: 1,
        size: 10,
        total: 0,
      },
      list: [],
      activeId: null,
      columns: [
        { key: "blockId", label: "列表ID", align: "center" },
        // { key: "creatorId", label: "创建者ID", align: "center" },
        { key: "languageName", label: "语言名称", align: "center" },
        { key: "nameLang", label: "列表名称", align: "center" },
      ],
      internationDrawerShow: false,
      type: "add",
      detailInternationData: {},
      internationList: [],
      checklanguagelist: [],
    };
  },
  methods: {
    search() {
      this.queryModule.page = 1;
      this.queryModule.total = 0;
      this.fetchList();
    },
    handleClickOnOff(row) {
      const desc = `确定删除吗？`;
      this.$confirm(desc, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.toDelete(row);
        })
        .catch(() => {});
    },
    toDelete(row) {
      let obj = {
        id: row.id,
        blockId: row.blockId,
      };
      ozBlockConfDelete(obj).then((res) => {
        if (res.code == 0) {
          this.$message.success("删除成功");
          this.fetchList();
        }
      });
    },
    addBtn() {
      this.type = "add";
      this.detailInternationData = { blockId: this.detailData.blockId };
      this.internationDrawerShow = true;
    },
    handleOperate(operationType, row) {
      this.type = operationType;
      if (operationType === "edit") {
        this.detailInternationData = { ...row };
        this.internationDrawerShow = true;
      }
    },
    async fetchList() {
      this.queryModule.blockId = this.detailData.blockId;
      await ozBlockDescList({
        ...this.queryModule,
        page: 1,
        size: 300,
      }).then((res) => {
        const { list = [] } = res.data;
        this.checklanguagelist = list;
      });
      await ozBlockDescList(this.queryModule).then((res) => {
        const { list = [], total } = res.data;
        this.list = list;
        this.queryModule.total = total;
      });
    },
    handleChangePage({ page, size }) {
      this.queryModule.page = page;
      this.queryModule.size = size;
      this.fetchList();
    },

    save() {
      let params = {
        id: this.row.id,
        packageName: this.appItem.packageName,
        apkName: this.appItem.apkName,
      };
      relationWishById(params).then((res) => {
        this.$message.success("关联成功");
        this.dialogVisible = false;
        this.$parent.getDataList();
      });
    },
    handleCurrentChange(val) {
      this.activeId = val.apkId;
    },
  },
};
</script>

<style lang="scss" scoped>
// .mainbox {
//   max-height: 700px;
//   overflow: scroll;
// }
.icon {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

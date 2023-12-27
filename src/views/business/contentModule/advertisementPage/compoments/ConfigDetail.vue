<template>
  <div>
    <el-row>
      <el-button
        v-has="'detailAdd'"
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="addBtn()"
        >添加</el-button
      >
    </el-row>
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
          <el-form-item label="国家" class="demo-form-inline">
            <el-select
              v-model="queryModule.areaCode"
              size="small"
              placeholder="请选择国家"
              clearable
            >
              <el-option
                v-for="item in countryList"
                :key="item.countryCode"
                :label="item.countryName"
                :value="item.countryCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小版本" class="demo-form-inline">
            <el-input
              v-model.trim="queryModule.marketId"
              placeholder="请输入最小版本号"
            ></el-input>
            <!-- <el-select
              v-model="queryModule.marketId"
              placeholder="请选择最小版本"
              clearable
            >
              <el-option
                v-for="item in versionModule"
                :key="item.marketId"
                :label="item.versionCode"
                :value="item.versionCode"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="最大版本" class="demo-form-inline">
            <!-- <el-select
              v-model="queryModule.marketMax"
              placeholder="请选择最大版本"
              clearable
            >
              <el-option
                v-for="item in versionModule"
                :key="item.marketId"
                :label="item.versionCode"
                :value="item.versionCode"
              >
              </el-option>
            </el-select> -->
            <el-input
              v-model.trim="queryModule.marketMax"
              placeholder="请输入最小版本号"
            ></el-input>
          </el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="search()"
            >搜索</el-button
          >
        </el-form>
      </el-col>
    </el-row>
    <PageTable
      :columns="columns"
      :tableData="{ ...queryModule, list }"
      @page-change="handleChangePage"
    >
      <!-- <template slot="areaCode" slot-scope="{ row }">
        <span>{{ row.areaCode | getLanguageName(languageList) }}</span>
      </template> -->
      <template slot="style" slot-scope="{ row }">
        <span>{{ row.style | typeDesc(styleList) }}</span>
      </template>

      <el-table-column fixed="right" label="操作" width="180px" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-has="'detailEdit'"
            @click="handleOperate('edit', row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-has="'detailConfig'"
            @click="handleOperate('config', row)"
            >部署</el-button
          >
          <el-button
            v-has="'detailDelete'"
            type="text"
            @click="handleClickDelete(row)"
          >
            <span class="colorRed">删除</span>
          </el-button>
        </template>
      </el-table-column>
    </PageTable>
    <ConfigDrawer
      :isShow.sync="internationDrawerShow"
      :type="type"
      :row="detailInternationData"
      :styleCode="detailData.style"
      :areaCode="internationList"
      :versionModule="versionModule"
      :checkAllLanguage="checklanguagelist"
    />
    <div v-if="delopyDialogShow">
      <el-dialog
        center
        width="70%"
        :wrapperClosable="false"
        :append-to-body="true"
        title="部署"
        :visible.sync="delopyDialogShow"
        :close-on-click-modal="false"
      >
        <DeployDialog
          :blockId="detailInternationData.id"
          :styleCode="detailData.style"
          :moduleCode="detailData.module"
          :deployNum="detailInternationData.deployNum"
          @closeBtn="delopyDialogShow = false"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTable from "@/components/PageTable.vue";
// import InternationDrawer from "./InternationDrawer.vue";
import ConfigDrawer from "./ConfigDrawer.vue";
import DeployDialog from "./DeployDialog.vue";
import {
  queryozBlockConfList,
  getMarketList,
  ozBlockDelete,
} from "@/api/ozBlockConf";
export default {
  components: { PageTable, ConfigDrawer, DeployDialog },
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
  computed: {
    ...mapGetters(["countryList"]),
  },
  created() {
    this.$store.dispatch("updateCountryList");
    getMarketList({ page: 1, size: 1000, isDelete: 0 }).then((res) => {
      if (res.code == 0) {
        this.versionModule = res.data.list;
      }
    });
  },
  data() {
    return {
      queryModule: {
        // blockId: "",
        areaCode: "",
        page: 1,
        size: 10,
        total: 0,
      },
      list: [],
      activeId: null,
      columns: [
        // { key: "blockId", label: "列表ID", align: "center" },
        { key: "id", label: "ID", align: "center" },
        { key: "countryName", label: "国家", align: "center" },
        { key: "marketId", label: "最小版本号", align: "center" },
        { key: "marketMax", label: "最大版本号", align: "center" },
        { key: "description", label: "备注", align: "center" },
        { key: "createdTime", label: "创建时间", align: "center" },
        { key: "modifyTime", label: "修改时间", align: "center" },
      ],
      internationDrawerShow: false,
      type: "add",
      detailInternationData: {},
      internationList: [],
      checklanguagelist: [],
      versionModule: [],

      delopyDialogShow: false,
    };
  },
  methods: {
    search() {
      this.queryModule.page = 1;
      this.queryModule.total = 0;
      this.fetchList();
    },
    handleClickDelete(row) {
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
      ozBlockDelete(obj).then((res) => {
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
      } else if (operationType === "config") {
        if (row.deployNum <= 0 && this.detailData.style == 201) {
          this.$message.error("请先配置可部署数量");
          return;
        }
        this.detailInternationData = { ...row };
        this.delopyDialogShow = true;
      }
    },
    async fetchList() {
      this.queryModule.blockId = this.detailData.blockId;
      let obj = {
        blockId: this.detailData.blockId,
        page: 1,
        size: 300,
      };
      await queryozBlockConfList(obj).then((res) => {
        if (res.code == 0) {
          const { list = [] } = res.data;
          this.checklanguagelist = list;
        }
      });
      await queryozBlockConfList(this.queryModule).then((res) => {
        if (res.code == 0) {
          const { list = [], total } = res.data;
          this.list = list;
          this.queryModule.total = total;
        }
      });
    },
    handleChangePage({ page, size }) {
      this.queryModule.page = page;
      this.queryModule.size = size;
      this.fetchList();
    },

    handleCurrentChange(val) {
      this.activeId = val.apkId;
    },
  },
};
</script>

<style lang="scss" scoped>
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

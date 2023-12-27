<template>
  <div>
    <el-row :gutter="6">
      <el-col :span="24">
        <el-form :inline="true" label-suffix=":">
          <el-form-item label="ID" class="demo-form-inline headLabel"
            ><el-input
              size="small"
              v-model="queryModule.blockId"
              placeholder="请输入ID"
              @keydown.native.enter="search()"
            ></el-input>
          </el-form-item>
          <el-form-item label="列表名称" class="demo-form-inline headLabel"
            ><el-input
              size="small"
              v-model="queryModule.name"
              placeholder="请输入列表名称"
              @keydown.native.enter="search()"
            ></el-input>
          </el-form-item>
          <el-form-item label="模块" class="demo-form-inline headLabel"
            ><el-input
              size="small"
              v-model="queryModule.module"
              placeholder="请输入模块"
              @keydown.native.enter="search()"
            ></el-input>
          </el-form-item>
          <el-form-item label="使用位置" class="demo-form-inline headLabel"
            ><el-input
              size="small"
              v-model="queryModule.position"
              placeholder="请输入使用位置"
              @keydown.native.enter="search()"
            ></el-input>
          </el-form-item>
          <el-form-item label="样式" class="demo-form-inline">
            <el-select
              v-model="queryModule.style"
              size="small"
              placeholder="请选择样式"
              clearable
            >
              <el-option
                v-for="item in styleList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="语言" class="demo-form-inline">
            <el-select
              v-model="queryModule.language"
              size="small"
              placeholder="请选择语言"
              clearable
            >
              <el-option
                v-for="item in languageList"
                :key="item.languageType"
                :label="item.languageName"
                :value="item.languageType"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="状态" class="demo-form-inline">
            <el-select
              v-model="queryModule.wishStatus"
              size="small"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="item in wishStatus"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select> </el-form-item
          > -->
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="search()"
            >查询</el-button
          >
        </el-form></el-col
      >
    </el-row>
    <PageTable
      :columns="columns"
      :tableData="{ ...queryModule, list }"
      @page-change="handleChangePage"
    >
      <template slot="language" slot-scope="{ row }">
        <span>{{ row.language | getLanguageName(languageList) }}</span>
      </template>
      <template slot="style" slot-scope="{ row }">
        <span>{{ row.style | typeDesc(styleList) }}</span>
        <!-- <el-button type="text" @click="handleOperate('details', row)"
          >查看</el-button
        > -->
      </template>
      <el-table-column fixed="right" label="操作" width="180px" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-has="'edit'"
            @click="handleOperate('edit', row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-has="'language'"
            @click="handleOperate('internation', row)"
            >国际化</el-button
          >
          <el-button
            type="text"
            v-has="'detail'"
            @click="handleOperate('config', row)"
            >明细</el-button
          >
        </template>
      </el-table-column>
    </PageTable>
    <!--  新增/编辑 弹框 -->
    <el-dialog
      center
      width="700px"
      :wrapperClosable="false"
      title="编辑"
      :visible.sync="editorDialogShow"
      :close-on-click-modal="false"
    >
      <Detail
        :operationType="operationType"
        :detailData="detailData"
        @submit="handleSubmit"
        @cancel="editorDialogShow = false"
      />
    </el-dialog>
    <!-- 国际化弹窗 -->
    <el-dialog
      center
      width="700px"
      :wrapperClosable="false"
      title="国际化"
      :visible.sync="internationDialogShow"
      :close-on-click-modal="false"
    >
      <Internation
        :detailData="detailData"
        :dialogAuditVisible="internationDialogShow"
        @submit="handleSubmit"
        @cancel="editorDialogShow = false"
      />
    </el-dialog>
    <!-- 明细弹窗 -->
    <el-dialog
      center
      width="70%"
      :wrapperClosable="false"
      title="明细"
      :visible.sync="configDialogShow"
      :close-on-click-modal="false"
    >
      <ConfigDetail
        :detailData="detailData"
        :dialogAuditVisible="configDialogShow"
        @submit="handleSubmit"
        @cancel="editorDialogShow = false"
      />
    </el-dialog>
    <DetailsDialog :isShow.sync="detailsDialogShow" :row="detailData" />
  </div>
</template>

<script>
import PageTable from "@/components/PageTable.vue";
import Detail from "./compoments/Detail.vue";
import Internation from "./compoments/Internation.vue";
import ConfigDetail from "./compoments/ConfigDetail.vue";
import DetailsDialog from "./compoments/DetailsDialog.vue";
import { updateWishById } from "@/api/wishlist";
import { ozBlockList, ozBlockUpdate } from "@/api/ozBlockConf";
import { mapGetters } from "vuex";
import { wishStatus, styleList } from "@/common/constant/constant";
export default {
  name: "wishListManage",
  components: {
    PageTable,
    DetailsDialog,
    Detail,
    Internation,
    ConfigDetail,
  },
  computed: {
    ...mapGetters(["languageList"]),
  },
  watch: {
    "queryModule.language"() {
      this.search();
    },
    "queryModule.wishStatus"() {
      this.search();
    },
  },
  data() {
    return {
      wishStatus: wishStatus,
      styleList,
      columns: [
        {
          key: "blockId",
          label: "ID",
          align: "center",
          width: 100,
        },
        { key: "name", label: "列表名称", align: "center" },
        // { slot: "language", label: "是否启用", align: "center" },
        { slot: "style", label: "样式", align: "center" },
        { key: "module", label: "模块", align: "center" },
        { key: "position", label: "使用位置", align: "center" },
        // { slot: "wishStatus", label: "备注", align: "center" },
        { key: "description", label: "备注", align: "center" },
        { key: "createdTime", label: "创建时间", align: "center" },
        { key: "modifyTime", label: "修改时间", align: "center" },
      ],
      queryModule: {
        count: true,
        language: "",
        page: 1,
        size: 10,
        total: 0,
        blockId: "",
        name: "",
        module: "",
        position: "",
        style: null,
        wishStatus: null,
      },
      list: [],
      operationType: "",
      relevanceDialogShow: false,
      editorDialogShow: false,
      detailsDialogShow: false,
      internationDialogShow: false,
      configDialogShow: false,
      viewImgShow: false,
      imgList: [],
      detailData: {
        name: "",
      },
    };
  },
  created() {
    this.$store.dispatch("updateLanguageList");
    this.getDataList();
  },
  methods: {
    handleSubmit(params) {
      ozBlockUpdate(params).then((res) => {
        if (res.code == 0) {
          this.$message.success("编辑成功");
          this.editorDialogShow = false;
          this.getDataList();
        }
      });
    },
    search() {
      this.queryModule.page = 1;
      this.getDataList();
    },
    handleSearch() {},
    handleChangePage({ page, size }) {
      this.queryModule.page = page;
      this.queryModule.size = size;
      this.getDataList();
    },
    getDataList() {
      ozBlockList(this.queryModule).then((res) => {
        const { list = [], total } = res.data;
        this.list = list;
        this.queryModule.total = total;
      });
    },
    handleOperate(operationType, row) {
      this.operationType = operationType;
      if (operationType === "edit") {
        this.editorDialogShow = true;
        this.detailData = { ...row };
      }
      if (operationType === "internation") {
        this.internationDialogShow = true;
        this.detailData = { ...row };
      }
      if (operationType === "config") {
        this.configDialogShow = true;
        this.detailData = { ...row };
      }
      if (operationType === "details") {
        this.detailsDialogShow = true;
        this.detailData = { ...row };
      }
    },
  },
};
</script>

<style lang="scss">
.view-el-img {
  position: relative;
  top: 5px;
  img {
    width: 25px;
    height: 20px;
    opacity: 0;
  }
  &::before {
    cursor: pointer;
    pointer-events: none;
    content: "查看";
    font-size: 12px;
    color: #409eff;
    position: absolute;
    top: 0;
  }
}
.el-dialog {
  height: 70vh;
  overflow: auto;
}
</style>

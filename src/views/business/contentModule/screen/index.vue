<template>
  <div id="modeManage">
    <el-row :gutter="16">
      <el-col :span="8"
        ><el-button
          type="primary"
          v-has="'add'"
          size="small"
          icon="el-icon-plus"
          @click="addEditBtn('add')"
          >新增</el-button
        ></el-col
      >
    </el-row>
    <el-row :gutter="12">
      <el-col :span="24">
        <el-form :inline="true" label-suffix=":">
          <el-form-item label="手机型号" class="demo-form-inline">
            <el-select
              v-model="queryModule.phoneModel"
              placeholder="请选择手机型号"
              filterable
              clearable
            >
              <el-option
                v-for="item in deviceList"
                :key="item.id"
                :label="item.deviceName"
                :value="item.deviceName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市场版本号" class="demo-form-inline">
            <el-input
              size="small"
              v-model="queryModule.version"
              placeholder="请输入渠道"
            ></el-input>
            <!-- <el-select
              v-model="queryModule.version"
              placeholder="请选择市场版本号"
              filterable
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
          <el-form-item label="渠道" class="demo-form-inline">
            <el-input
              size="small"
              v-model="queryModule.channelNo"
              placeholder="请输入渠道"
            ></el-input>
            <!-- <el-select
              v-model="queryModule.onlineBranch"
              placeholder="请选择渠道"
              filterable
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
          <el-form-item label="状态" class="demo-form-inline">
            <el-select
              v-model="queryModule.status"
              placeholder="请选择状态"
              filterable
              clearable
            >
              <el-option
                v-for="item in onlineStartus"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            @click="searchList"
            size="small"
            icon="el-icon-search"
            >查询</el-button
          >
        </el-form>
      </el-col>
    </el-row>
    <PageTable
      :columns="modelTabelHead"
      :tableData="{ list: modelTabelList, ...queryModule }"
      @page-change="handleChangePage"
    >
      <!-- 渠道 -->
      <!-- <template slot-scope="{ row }" slot="onlineBranch">
        <span>{{ row.onlineBranch == "gms" ? "GMS" : "通用" }}</span>
      </template> -->
      <template slot-scope="{ row }" slot="marketId">
        <span>{{ row.marketId }} -- {{ row.maxMarket }}</span>
      </template>

      <!-- 状态 -->
      <template slot-scope="{ row }" slot="status">
        <span
          :style="row.status == 0 ? { color: 'red' } : { color: '#67C23A' }"
          >{{ row.status | typeDesc(onlineStartus) }}</span
        >
      </template>
      <el-table-column fixed="right" label="操作" width="180px" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-has="'edit'"
            @click="addEditBtn('edit', row)"
          >
            <span style="color: 'red'">编辑</span>
          </el-button>
          <el-button
            type="text"
            v-has="'language'"
            @click="internationalizationBtn(row)"
          >
            <span style="color: 'red'">国际化</span>
          </el-button>
          <el-button type="text" @click="open(row)" v-has="'onOff'"
            ><span :class="[row.status == 1 ? 'colorRed' : 'colorGreen']">{{
              row.status == 1 ? "下线" : "上线"
            }}</span></el-button
          >
        </template>
      </el-table-column>
    </PageTable>
    <!-- 新增弹窗 -->
    <addEditdialog
      v-show="showdialog"
      ref="addoredit"
      :formParams="formData"
      :clientVersion="versionModule"
      :dialogName="dialogName"
      @submitBTN="submitBTN"
    ></addEditdialog>
    <!-- 国际化弹窗 -->
    <internationalization
      v-show="showInterDialog"
      ref="internationalizationDialog"
      :formParams="formData"
    ></internationalization>
  </div>
</template>
<script>
import Clipboard from "clipboard";
import PageTable from "@/components/PageTable.vue";
import addEditdialog from "./components/addEditddialog.vue";
import internationalization from "./components/internationalization.vue";
import { mapGetters } from "vuex";
import {
  onlineStartus, //状态
  updateStatus, //更新范围
  onlineBranchList,
} from "@/common/constant/constant.js";
import {
  getMarketList,
  getWhiteList,
  addWhiteList,
  editWhiteList,
  offlinetWhiteList,
} from "./api";
export default {
  components: { PageTable, addEditdialog, internationalization },
  computed: {
    ...mapGetters(["deviceList"]),
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      onlineBranchList,
      onlineStartus,
      updateStatus,
      showdialog: false,
      showInterDialog: false,
      dialogName: "",
      invalue: "",
      pohonevalue: "",
      formData: {}, //编辑表格的数据
      interData: {}, //国际化表格的数据
      modelTabelHead: [
        { key: "id", label: "ID", align: "center" },
        { key: "phoneModel", label: "手机型号", align: "center" },
        // { slot: "onlineBranch", label: "渠道", align: "center" },
        { key: "channelNo", label: "渠道", align: "center" },
        { slot: "marketId", label: "生效版本区间", align: "center" },
        { key: "rate", label: "间隔时间（分钟）", align: "center" },
        { slot: "status", label: "状态", align: "center" },
        {
          key: "modifyTime",
          label: "创建时间",
          align: "center",
        },
        {
          key: "startTime",
          label: "开始时间",
          align: "center",
        },
        {
          key: "endTime",
          label: "结束时间",
          align: "center",
        },
      ], //机型列表表格头部
      queryModule: {
        page: 1,
        size: 10,
        total: 0,
      },
      versionModule: [], //市场版本
      modelTabelList: [], //机型列表表格数据
    };
  },
  methods: {
    addEditBtn(val, row) {
      if (val == "add") {
        this.dialogName = "新增";
      } else {
        this.dialogName = "编辑";
        this.formData = row;
      }
      this.showdialog = true;
      this.$nextTick(() => {
        this.$refs.addoredit.init();
      });
    },
    internationalizationBtn(row) {
      this.formData = row;
      this.showInterDialog = true;
      this.$nextTick(() => {
        this.$refs.internationalizationDialog.init();
      });
    },
    searchList() {
      this.queryModule.page = 1;
      this.getTableList();
    },
    submitBTN(val, data) {
      let fun = val ? addWhiteList : editWhiteList;
      fun(data).then((res) => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.getTableList();
        }
      });
    },
    handleChangePage({ page, size }) {
      this.queryModule.page = page;
      this.queryModule.size = size;
      this.getTableList();
    },
    init() {
      this.getTableList();
      // this.getMarketList();
    },
    getTableList() {
      getWhiteList(this.queryModule).then((res) => {
        const { list = [], total } = res.data;
        this.modelTabelList = list;
        this.queryModule.total = total;
      });
    },
    open(row) {
      this.$confirm(`您确定${row.status == 1 ? "下线" : "上线"}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          offlinetWhiteList({ id: row.id }).then((res) => {
            if (res.code == 0) {
              this.$message.success(`${row.status == 1 ? "下线" : "上线"}成功`);
            } else {
              this.$message.error(res.msg);
            }
            this.getTableList();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: `已取消${row.status == 1 ? "下线" : "上线"}`,
          // });
        });
    },

    getMarketList() {
      getMarketList({ page: 1, size: 1000, isDelete: 0 }).then((res) => {
        if (res.code == 0) {
          this.versionModule = res.data.list;
        }
      });
    },
  },
  async created() {
    await this.$store.dispatch("updateDeviceList");
  },
  activated() {
    //每次进入页面请求数据
    // this.getMarketList();
  },
};
</script>
<style scoped lang="scss">
#modeManage {
}
</style>

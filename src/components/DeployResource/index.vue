<template>
  <!-- 部署资源拖拽公共组件 -----应用 -->
  <div class="deploy-resource">
    <el-row :gutter="5">
      <template v-if="otherSearchShow">
        <el-col :span="3">
          <el-select
            v-model="queryModule.labelId"
            size="small"
            placeholder="请选择标签"
            clearable
            filterable
          >
            <el-option
              v-for="i in apkLabelList"
              :key="i.labelId"
              :label="i.labelName"
              :value="i.labelId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-cascader
            placeholder="请选择分类"
            v-model="queryModule.cateId"
            :options="apkCategoryLista"
            :show-all-levels="false"
            clearable
            :props="{
              children: 'list',
              label: 'cateName',
              value: 'cateId',
              emitPath: false,
            }"
          ></el-cascader>
        </el-col>
      </template>
      <el-col :span="17">
        <!---->
        <div class="disfr ac">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryModule.keyword"
            class="input-with-select"
            @keydown.native.enter="search()"
            clearable
          >
            <el-select
              slot="prepend"
              v-model="queryModule.chooseType"
              placeholder="请选择类型"
              style="width: 100px"
            >
              <!-- <el-option label="APPID " :value="1"> </el-option> -->
              <el-option label="应用名称" :value="2"> </el-option>
              <el-option label="包名" :value="3"> </el-option>
            </el-select>
            <el-button
              type="primary"
              slot="append"
              icon="el-icon-search"
              @click="search()"
            ></el-button>
          </el-input>
          <div
            style="margin-left: 20px"
            class="disfr ac"
            v-if="!otherSearchShow"
          >
            <div style="width: 50px">分类：</div>
            <el-cascader
              style="width: 150px"
              placeholder="请选择分类"
              v-model="queryModule.cateId"
              :options="apkCategoryLista"
              :show-all-levels="false"
              clearable
              :props="{
                children: 'list',
                label: 'cateName',
                value: 'cateId',
                emitPath: false,
              }"
            ></el-cascader>
            <!-- <el-select
              v-model="queryModule.cateId"
              placeholder="请选择分类"
              style="width: 150px"
            >
              <el-option
                v-for="item in apkCategoryLista"
                :key="item.cateId"
                :label="item.cateName"
                :value="item.cateId"
              >
              </el-option>
            </el-select> -->
          </div>
          <div class="disfr ac" style="margin-left: 10px">
            <div style="width: 50px">语言：</div>
            <el-select
              slot="prepend"
              v-model="queryModule.language"
              placeholder="请选择语言"
              style="width: 100px"
              @change="search"
              clearable
            >
              <el-option
                v-for="item in languageDataList"
                :key="item.languageType"
                :label="item.languageName"
                :value="item.languageType"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <el-input
          size="small"
          v-model="queryModule.keyword"
          placeholder="请输入搜索内容"
          @keydown.native.enter="search()"
        ></el-input>
      </el-col> -->
      <!-- 
      > -->
    </el-row>
    <div>
      <div class="thead">
        <span class="appid">APPID</span>
        <span class="yymc">应用名称</span>
        <span class="tb">图标</span>
        <span class="bm">包名</span>
      </div>
    </div>
    <!-- 
          name 可跨越拖拽的类
          pull：clone 拖拽后不消失
          put：false 不允许拖进这里
          sort：不允许拖动排序
          animation 动画效果
          filter 不能拖动的类名
          chosen-class 选择时的样式
          ghost-class 拖拽时的样式
         -->
    <draggable
      :list="dragList"
      class="drag_list"
      :class="{ isImgType: otherSearchShow }"
      :group="{ name: groupName, pull: 'clone', put: false }"
      :sort="false"
      filter=".not-drag"
      ghost-class="ghost"
      chosen-class="chosen"
    >
      <div
        v-for="item in dragList"
        :key="item.id"
        class="list-group-item"
        :class="{
          'not-drag': item.notDrag || (type === 'JB' && item.isCorner),
        }"
      >
        <img
          v-if="item.notDrag || (type === 'JB' && item.isCorner)"
          class="has-deployed"
          src="@/assets/images/has-deployed.png"
          alt=""
        />
        <span class="appid">{{ item.apkId }}</span>
        <span class="yymc">{{ item.apkName }}</span>
        <span class="tb">
          <div class="icon">
            <img :src="item.iconUrl" alt="" v-if="item.iconUrl" />
          </div>
        </span>
        <span class="bm">{{ item.packageName }}</span>
      </div>
    </draggable>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <Pagination
        v-show="queryModule.total > 0"
        :total="queryModule.total"
        :page.sync="queryModule.page"
        :limit.sync="queryModule.size"
        @pagination="fetchList"
        layout="total, prev, pager, next"
      />
    </el-row>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { selectApplyList } from "@/api/common";
import {
  queryApkLabelList,
  queryApkCategoryList,
  queryApkCategoryLevelList,
} from "@/api/componentManage";
import { getLanguageList } from "@/api/common";
export default {
  components: { Pagination },
  props: {
    // 可拖拽的模块名
    groupName: {
      type: String,
      default: "drag",
    },
    otherSearchShow: Boolean,
    type: String, //用于角标部署时的数据禁用
  },
  watch: {
    "queryModule.chooseType"() {
      this.search();
    },
    "queryModule.labelId"() {
      this.search();
    },
    "queryModule.cateId"() {
      this.search();
    },
  },
  data() {
    return {
      queryModule: {
        page: 1,
        size: 10,
        total: 0,
        keyword: "",
        apkId: "",
        language: null,
        apkName: "",
        packageName: "",
        chooseType: 2,
        labelId: null,
        cateId: null,
      },
      dragList: [],
      apkLabelList: [], // 标签列表
      apkCategoryLista: [], // 分类列表
      languageDataList: [], // 语言列表
    };
  },
  created() {
    getLanguageList({}).then((res) => {
      if (res && res.code == 0) {
        this.languageDataList = res.data;
      }
    });
    this.fetchList();
    if (this.otherSearchShow) {
      // 标签
      queryApkLabelList({}).then((res) => {
        this.apkLabelList = res.data;
      });
      //分类
      // queryApkCategoryList({}).then((res) => {
      //   this.apkCategoryLista = res.data;
      // });
    }
    queryApkCategoryLevelList({}).then((res) => {
      this.apkCategoryLista = res.data;
    });
  },
  methods: {
    search() {
      this.queryModule.total = 0;
      this.queryModule.page = 1;
      this.fetchList();
    },
    fetchList() {
      const { chooseType, keyword } = this.queryModule;
      if (chooseType === 1) {
        this.queryModule.apkName = "";
        this.queryModule.packageName = "";
        // 后端说这里只能给数字类型，传字符串会报错，所以当用户输入非数字的搜索时传-1，让用户查不到数据 ---swx
        let apkId = "";
        if (keyword !== "") {
          apkId = Number(keyword) >= 0 ? Number(keyword) : -1;
        }
        this.queryModule.apkId = apkId;
      }
      if (chooseType === 2) {
        this.queryModule.apkId = "";
        this.queryModule.packageName = "";
        this.queryModule.apkName = keyword;
      }
      if (chooseType === 3) {
        this.queryModule.apkId = "";
        this.queryModule.apkName = "";
        this.queryModule.packageName = keyword;
      }
      if (!this.queryModule.language) {
        this.queryModule.language = null;
      }
      selectApplyList(this.queryModule).then((res) => {
        if (res.data) {
          const { list = [], total } = res.data;
          // list.unshift({
          //   apkId: "",
          //   apkName: "",
          //   iconUrl: "",
          //   isCorner: "",
          //   packageName: "",
          // });
          this.dragList = list;
          this.queryModule.total = total;
          this.$emit("change", this.dragList);
        } else {
          this.dragList = [];
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.list-group-item {
  position: relative;
}
.has-deployed {
  position: absolute;
  width: 57px;
  height: 40px;
  transform: scale(0.7);
  opacity: 0.8;
  // top: 10px;
  bottom: 0;
  right: 0;
}
</style>

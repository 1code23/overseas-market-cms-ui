<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :label="item.label"
        :name="item.name"
        :key="item.label"
      ></el-tab-pane>
    </el-tabs>
    <el-row class="contentWrapper">
      <el-col :xs="24" :sm="14" class="leftCard">
        <AppDrag
          v-for="item in tabList"
          :key="item.name"
          v-show="activeName == item.name"
          :sourceType="item.name"
          :selectList="selectList"
          :styleCode="styleCode"
          :moduleCode="moduleCode"
        ></AppDrag>
      </el-col>
      <el-col :xs="24" :sm="10" class="rightCard">
        <div>提交信息：</div>
        <div class="summitContent borderA">
          <AppReceiverFixCount
            v-if="styleCode == 201"
            :selectList="selectList"
            class="selectList"
          ></AppReceiverFixCount>
          <AppReceiver
            v-else
            v-model="selectList"
            class="selectList"
          ></AppReceiver>
        </div>
        <div class="optionArea">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button type="danger" @click="handleClear">清空</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import AppDrag from "@/components/deploy2/AppDrag";
import AppReceiver from "@/components/deploy2/AppReceiver";
import AppReceiverFixCount from "@/components/deploy2/AppReceiverFixCount";

import { getPageConfigDetail, savePageConfig } from "@/api/ozBlockConf";
import { getCompanyId, IsURL } from "@/common/utils/utils";
import { sourceTypeList, sourceTypeList1 } from "@/common/constant/constant";

export default {
  name: "keywordsAd",
  components: { AppDrag, AppReceiver, AppReceiverFixCount },
  props: ["blockId", "styleCode", "deployNum", "moduleCode"],
  data() {
    return {
      activeName: "app",
      selectList: [],
      tabList: sourceTypeList,
      tabList1: sourceTypeList1,
    };
  },
  created() {
    this.getKeywordAdDetail(this.blockId);
  },
  methods: {
    handleSubmit() {
      this.keywordAdAdd();
    },
    handleClear() {
      // this.selectList = [];
      if (this.styleCode != 201) {
        this.selectList = [];
      } else {
        let arr = [];
        for (var i = 0; i < 3; i++) {
          arr.push({
            imgUrl: "",
            webUrl: "",
            radio: 1,
            dragList: [],
          });
        }
        this.selectList = arr;
      }
    },
    async getKeywordAdDetail(id) {
      let res = await getPageConfigDetail({
        blockConfId: id,
      });
      const list = res.data || [];

      this.selectList = list.map((item) => {
        item.apkName = item.apkName || item.app.apkName;
        item.sourceType = this.tabList1.find(
          (tl) => tl.id == item.resType
        )?.name;

        if (this.styleCode == 201) {
          // if (item.resType == 1001 || item.resType == 1002) {
          //   item.dragList = [{ resName: item.resName, resType: item.resType }];
          // } else {
          item.dragList = [
            {
              apkId: item.apkId,
              apkName: item.apkName,
              packageName: item.packageName,
              iconUrl: item.iconUrl,
              webUrl: item.webUrl,
            },
          ];
          // }
          item.radio = item.webUrl ? 2 : 1;
        }
        return item;
      });
      // 默认循环指定数量数据
      // if (this.styleCode == 201 && this.selectList.length <= 0) {
      //   for (var i = 0; i < this.deployNum; i++) {
      //     this.selectList.push({
      //       imgUrl: "",
      //       webUrl: "",
      //       radio: 1,
      //       dragList: [],
      //     });
      //   }
      // }
      let selectListNum = this.selectList.length;
      // console.log(selectListNum);
      let deployNum;
      if (this.styleCode == 201 && selectListNum <= 0) {
        // deployNum =3; //默认三条
        deployNum = this.deployNum; //获取设置的条数
        for (var i = 0; i < deployNum; i++) {
          this.selectList.push({
            imgUrl: "",
            webUrl: "",
            radio: 1,
            dragList: [],
          });
        }
      } else if (this.styleCode == 201 && selectListNum < this.deployNum) {
        deployNum = this.deployNum - selectListNum;
        for (var j = 0; j < deployNum; j++) {
          this.selectList.push({
            imgUrl: "",
            webUrl: "",
            radio: 1,
            dragList: [],
          });
        }
      } else if (this.styleCode == 201 && selectListNum > this.deployNum) {
        this.selectList = this.selectList.slice(0, this.deployNum);
      }
    },

    async keywordAdAdd() {
      const list = this.selectList.map((item, index) => {
        if (!item.resType) {
          item.resType =
            getCompanyId(item.sourceType) == 0
              ? 1
              : getCompanyId(item.sourceType);
        }

        item.blockConfId = this.blockId;
        item.site = index + 1;

        if (item.dragList && item.dragList.length > 0 && item.radio == 1) {
          item = { ...item, ...item.dragList[0] };
        }
        if (item.radio == 1) {
          item.webUrl = "";
        }
        if (item.resTypeParams) {
          item.resType = item.resTypeParams; //1001推广-装机必备 推广-推荐位1002
        }
        // if (
        //   item.dragList &&
        //   item.dragList.length > 0 &&
        //   item.dragList[0].apkId
        // ) {
        //   item.resType = 1;
        // }
        if (item.radio == 2) {
          item.resType = 2001; //2001 外部链接
        }
        return item;
      });
      const data = {
        blockConfId: this.blockId,
        list,
      };
      // 图片合集校验
      if (this.styleCode == 201) {
        const isValid = list.some(function (item) {
          // if (
          //   !item.imgUrl ||
          //   (item.radio == 2 && !item.webUrl) ||
          //   (item.radio == 1 && !item.dragList[0].apkId)
          // ) {
          //   return true;
          // }
          if (
            !item.imgUrl ||
            (item.radio == 2 && !item.webUrl) ||
            (item.radio == 1 &&
              !item.dragList[0].apkId &&
              !item.dragList[0].resType)
          ) {
            return true;
          }
        });
        if (isValid) {
          this.$message.error("请检查数据是否填写完整");
          return;
        }
        let isNetwork = list.every(
          (item) => (item.radio == 2 && IsURL(item.webUrl)) || item.radio == 1
        );
        if (!isNetwork) {
          this.$message.error("请输入正确链接");
          return;
        }
      }
      const res = await savePageConfig(data);
      if (res) {
        this.$message.success("部署成功");
        this.$emit("closeBtn");
      }
    },
  },
};
</script>

<style lang="scss">
.contentWrapper {
  height: 400px;
  .leftCard,
  .rightCard {
    height: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
  }
  .rightCard {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .summitContent {
      flex: 1;
      margin: 10px 0;
      overflow: auto;
      .selectList {
        height: 100%;
      }
    }
    .optionArea {
      text-align: end;
    }
    .itemArea {
      width: 95%;
    }
  }
}
</style>

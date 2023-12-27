<template>
  <div class="app-card">
    <div class="appLeft" v-if="data.iconUrl">
      <img :src="data.iconUrl" />
    </div>
    <div class="appRight">
      <!-- app信息 -->
      <template v-if="sourceType != 'assembly'">
        <div v-if="sourceType == 'app' && data.resName" class="appTitle">
          <div class="textRel">
            <span class="textEllipsis">{{ data.resName }}</span>
          </div>
        </div>
        <div class="appTitle mb10" :title="data.apkName">
          <div class="textRel">
            <span class="textEllipsis">{{ data.apkName }}</span
            ><span
              class="textTry"
              v-if="data.product_type == 8 || data.release_status == 5"
              >试玩</span
            >
          </div>
        </div>
        <template v-if="sourceType != 'order' && data.packageName">
          <div class="appInfo" :title="data.packageName">
            <span>包名：</span>
            <span class="infoTxt textEllipsis">{{ data.packageName }}</span>
          </div>
        </template>
      </template>
      <!-- 组件信息 -->
      <template v-else>
        <div class="appTitle mb10" :title="data.assembly_name">
          {{ data.assembly_name }}
        </div>
        <div class="appInfo">
          <span>组件id：</span
          ><span class="infoTxt textEllipsis">{{ data.assembly_id }}</span>
        </div>
      </template>
      <img
        class="fixed_corner_mark"
        v-if="isShowDeployed && data.isDeployed"
        src="@/assets/images/has-deployed.png"
        alt=""
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "AppCard",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    isShowDeployed: {
      default: true,
    },
    // 应用来源：app--自营应用；yyb--应用宝；order--预约应用；
    sourceType: {
      type: String,
      default: "app",
    },
  },
};
</script>
<style scoped lang="scss">
.app-card {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 10px;
  border: 1px solid #dfdfdf;
  background: #fff;
  cursor: pointer;
  .appLeft {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .appRight {
    position: relative;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 45px;
  }
  .appInfo,
  .appTitle {
    text-align: left;
    font-size: 14px;
    display: flex;
  }
  .infoTxt {
    flex: 1;
    margin-left: 2px;
    color: #949191;
  }
  .textEllipsis {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .textRel {
    height: 24px;
    display: flex;
    align-items: center;
    position: relative;
    .textTry {
      position: absolute;
      right: -44px;
      top: 0;
      background-color: rgba(39, 202, 215, 1);
      color: #fff;
      font-size: 14px;
      width: 40px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 5px;
      letter-spacing: 1px;
    }
  }
  .fixed_corner_mark {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 46px;
  }
}
</style>

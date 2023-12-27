<template>
  <div>
    <div class="block" v-for="(item, blockIndex) in list" :key="blockIndex">
      <div class="msg">
        <p class="title">位置{{ blockIndex + 1 }}:</p>
      </div>
      <div class="msg">
        <p class="title">部署图片</p>
        <UploadImg
          :limSize="2"
          v-model="item.imgUrl"
          :limWidth="1248"
          :limHeight="702"
          :acceptType="['png', 'jpg', 'jpeg']"
          @success="
            (file) => {
              list[blockIndex].imgUrl = file.accessPath;
            }
          "
        >
          <p slot="hint" class="hint">
            大小：2MB以内；格式：PNG,JPG,JPEG；尺寸1248*702
          </p>
        </UploadImg>
      </div>
      <div class="msg">
        <p class="title">部署内容</p>
        <el-radio-group v-model="item.radio">
          <el-radio :label="1">应用</el-radio>
          <el-radio :label="2">外部链接</el-radio>
        </el-radio-group>
      </div>
      <div class="msg">
        <draggable
          v-if="item.radio === 1"
          :list="item.dragList"
          class="msg_drag"
          group="app"
          ghost-class="ghost"
          chosen-class="chosen"
          :animation="150"
          :scroll="true"
          :sort="true"
          :scrollSensitivity="50"
          :forceFallback="true"
          @change="msgDragChange($event, blockIndex)"
        >
          <div v-for="(item, index) in item.dragList" :key="index" class="tag">
            <div class="item">
              <div class="app" v-if="item.apkName">
                <!-- <div class="img">
                  <img :src="item.iconUrl" alt="" />
                </div> -->
                <div>
                  <p>
                    <span
                      class="tag-read"
                      @click="copy(item.apkName)"
                      :data-clipboard-text="item.apkName"
                      >{{ item.apkName }}</span
                    >
                  </p>
                  <p>
                    <span
                      class="tag-read"
                      @click="copy(item.packageName)"
                      :data-clipboard-text="item.packageName"
                      >包名：{{ item.packageName }}</span
                    >
                  </p>
                </div>
              </div>
              <!-- 占位符： -->
              <!-- <template
                v-if="
                  item.resType == 3 ||
                  item.resType == 1001 ||
                  item.resType == 1002
                "
              >
                <div>{{ item.resName }}</div>
              </template> -->
            </div>
            <span
              class="delete"
              @click="toDelete(item, index, blockIndex)"
              v-if="item.apkName"
            >
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </draggable>
        <el-input
          v-if="item.radio == 2"
          placeholder="请输入外部链接"
          v-model="item.webUrl"
        >
          <template slot="prepend">https://</template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import UploadImg from "@/components/UploadImg";
import Clipboard from "clipboard";
export default {
  name: "AppReceiverFixCount",
  props: {
    // 已选择的app列表
    selectList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      list: [],
    };
  },
  components: {
    draggable,
    UploadImg,
  },
  watch: {
    selectList: {
      immediate: true,
      handler() {
        // 已选择的列表变化时，重新检测当前tab页list的部署情况
        this.list = this.selectList;
        // console.log(this.list);
      },
    },
  },
  methods: {
    copy(val) {
      this.$message.success("复制成功");
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", () => {
        // this.$message.success("复制成功");
        //  释放内存
        // clipboard.destory();
      });
      clipboard.on("error", () => {
        // 不支持复制
        this.$message.error("该浏览器不支持复制");
        // 释放内存
        // clipboard.destory();
      });
    },
    // 右侧拖拽发生改变 --- 图片/视频
    msgDragChange(row, blockIndex) {
      if (row.added) {
        const { element } = row.added;
        // 拖拽列表只允许有一个
        this.list[blockIndex].dragList = [element];
      }
    },
    // 删除右侧部署内容
    toDelete(row, index, blockIndex) {
      if (blockIndex !== undefined) {
        this.list[blockIndex].dragList = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  border: 1px dashed #eeeeee;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
  position: relative;
  &:hover {
    border: 1px dashed #409eff;
  }
}

.msg {
  margin-bottom: 20px;
  &.bt {
    // border: 2px dashed #ccc;
    padding: 10px;
    box-sizing: border-box;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .hint {
    font-size: 12px;
    color: #cccccc;
    margin: 10px 0;
  }
  .msg_drag {
    height: 105px;
    max-height: 150px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 2px dashed #67c23a;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    background: url("~@/assets/images/market-app.png");
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
  }
}
.tag {
  margin-bottom: 0 !important;
  min-height: 80px;
  background: white;
  border: 2px dashed transparent;
  display: flex;
  align-items: center;
  .item {
    width: 100%;
    .app {
      display: flex;
      .img {
        width: 55px;
        height: 55px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      p {
        margin-bottom: 5px;
      }
    }
  }
  .delete {
    min-width: 10px;
  }
}
</style>

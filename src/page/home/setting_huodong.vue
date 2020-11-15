<template>
  <div class="w-100 orderTable" style="padding-left: 30px;">
    <!-- <div class="p-tb-30">
      <ul class="left orderUl" style="width: 400px;padding-top: 5px;">
        <li :class="orderNavActive == 0?'active':''" @click="orderTab(0)">分享裂变底图</li>
      </ul>
      <div class="right m-r-20"></div>
      <div class="clear"></div>
    </div> -->
    <div>
      底图共2张
      <span class="tianjia" @click="tianjiac">
        <i class="el-icon-plus"></i>添加
      </span>
    </div>
    <div class="imglist" v-for="(item,index) in tplist" :key="index" @click="xiugai(item)">
      <img class="imgs" :src="item.imgUrl" alt />
      <span>NO.{{item.id}} {{item.imgName}}</span>
    </div>
    <el-dialog title :visible.sync="centerDialogVisible" append-to-body width="20%" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="底图名称:">
          <el-input v-model="form.imgName"></el-input>
        </el-form-item>
      </el-form>
      <!-- :before-upload="beforeAvatarUpload" -->
      <el-upload
        class="avatar-uploader"
        action="/api/vehicle/file/uploadPicture"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="queding">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { template, dituupdate } from "../../request/api.js";
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      orderNavActive: 0,
      centerDialogVisible: false,
      imageUrl: "",
      form: {},
      tplist: []
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
  },
  methods: {
    tianjiac() {
        this.form = {}
      this.centerDialogVisible = true;
    },
    init() {
      template().then(res => {
        if (res.data.code == 200) {
          this.tplist = res.data.data;
        }
      });
    },
    xiugai(item) {
      this.form = {
        id: item.id,
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        templateNo: item.templateNo
      };
      this.centerDialogVisible = true;
    },
    queding() {
      dituupdate(this.form).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功！"
          });
          this.init();
        }
      });

      this.centerDialogVisible = false;
    },
    handleAvatarSuccess(row) {
      console.log(row);
      this.form.imgUrl = row.data;
      this.$forceUpdate();
    },
    orderTab(index) {
      this.orderNavActive = index;
    }
  }
};
</script>
<style scoped>
.orderUl li {
  float: left;
  padding: 4px 18px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}

.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
.letter a {
  color: #3b5998;
  border: 1px solid #eee;
  margin: 3px;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  display: inline-block;
}
.letter a:hover,
.letter a.active {
  background: #3b5998;
  color: #fff;
}
.tianjia {
  color: #0d906e;
  font-weight: bold;
  margin-left: 15px;
  cursor: pointer;
}
.overlay {
  position: absolute;
  z-index: 2000;
  background-color: hsla(0, 0%, 100%, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}
.avatar-uploader-icon {
  height: 300px;
  width: 210px;
}
.avatar {
  height: 300px;
  width: 210px;
}
.avatar-uploader {
  text-align: center;
}
.imgs {
  width: 180px;
  height: 300px;
  display: block;
}
.imglist {
  float: left;
  margin-top: 15px;
}
.imglist:nth-of-type(n + 3) {
  margin-left: 30px;
}

.avatar-uploader-icon {
  line-height: 250px;
}
</style>
<style >

</style>
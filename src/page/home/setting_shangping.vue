<template>
  <div class="w-100 orderTable" style="padding-left: 30px;">
    <div style=" overflow: hidden;">
      <div class="left" style=" overflow: hidden;">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="品牌名称">
            <el-input class="iut" v-model="form.brandName"></el-input>
            <span class="chazao" @click="chazhao">查找</span>
            <span class="tianjia" @click="tianjia">添加</span>
          </el-form-item>
        </el-form>
        <div class="shuju">
          <div class="list_can" v-for="item in list" :key="item.id">
            <span class="left">{{item.partBrand}}</span>
            <span class="right shanchu" @click="shanchu(item.id)">删除</span>
          </div>
        </div>
      </div>
      <div class="left" style=" overflow: hidden;margin-left: 60px; ">
        <el-form ref="form" :model="formc" label-width="70px">
          <el-form-item label="产品分类">
            <el-input class="iut" v-model="formc.classify"></el-input>
            <span class="chazao" @click="chazhao2">查找</span>
            <span class="tianjia" @click="tianjiafenlei">添加</span>
          </el-form-item>
        </el-form>
        <div class="shuju">
          <div class="list_can" v-for="item in fllist" :key="item.id">
            <span class="left">{{item.partClassify}}</span>
            <span class="right shanchu" @click="shanchuc(item.id)">删除</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  brandList,
  partBrand,
  shanchuupartBrand,
  classifyList,
  partClassify,
  shanchupartClassify
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      orderNavActive: 0,
      centerDialogVisible: false,
      imageUrl: "",
      form: {
        brandName: ""
      },
      formc: {
        classify: ""
      },
      list: [],
      fllist: []
    };
  },
  created() {
    this.init();
    this.fenlei();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
  },
  methods: {
    tianjiac() {
      this.form = {};
      this.centerDialogVisible = true;
    },
    fenlei() {
      classifyList().then(res => {
        if (res.data.code == 200) {
          this.fllist = res.data.data;
        }
      });
    },
    init() {
      brandList().then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
        }
      });
    },
    chazhao() {
      brandList({ brandName: this.form.brandName }).then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
        }
      });
    },
    chazhao2() {
      brandList({ classifyName: this.form.classify }).then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
        }
      });
    },
    //添加分类
    tianjiafenlei() {
      partClassify(this.formc).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "添加成功！"
          });
          this.formc.classify = "";
          this.fenlei();
        }
      });

      this.centerDialogVisible = false;
    },
    //添加品牌
    tianjia() {
      partBrand(this.form).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "添加成功！"
          });
          this.form.brandName = "";
          this.init();
        }
      });

      this.centerDialogVisible = false;
    },
    //删除品牌
    shanchu(id) {
      shanchuupartBrand({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.init();
        }
      });
    },
    //删除品牌分类
    shanchuc(id) {
      shanchupartClassify({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.fenlei();
        }
      });
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
.shuju {
  width: 300px;
  border: 2px solid #d3d3d3;
  height: 420px;
  overflow-y: auto;
}
.iut {
  width: 150px;
  height: 35px;
}
.list_can {
  overflow: hidden;
  padding: 5px 15px;
  font-size: 13px;
}
.chazao {
  color: #0d906e;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
}
.shanchu {
  cursor: pointer;
  color: red;
}
.tianjia {
  color: #6a5acd;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
}
</style>
<style>
.el-input__inner {
  height: 35px;
}
</style>

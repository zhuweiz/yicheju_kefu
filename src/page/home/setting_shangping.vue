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
            <span class="right xianqin" @click="xiangqin(item.id)">商品详情</span>
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

    <el-dialog
      title="品牌商品详情"
      :visible.sync="editStatus"
      center
      width="75%"
      :modal="false"
      close-on-click-modal="false"
      class="XGppjj"
    >
      <div class="mingc">
        品牌名称:
        <span class="pname">{{editPartsForm.partBrand}}</span>
      </div>
      <el-form :model="editPartsForm">
        <el-form-item label="产品说明" label-width="100px">
          <el-input type="textarea" :rows="4" v-model="editPartsForm.productExplain"></el-input>
        </el-form-item>
      </el-form>
      <div class="ssspp">
        <div class="sptup">
          <div>商品图片</div>
          <div class>(340x280)</div>
        </div>
        <el-upload
          class="upload-demo"
          action="/api/vehicle/file/uploadPicture"
          :on-preview="handlePreview"
          :show-file-list="false"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="tupanshangchuana"
          list-type="picture"
        >
          <el-button size="small" type="primary">添加图片</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          action="/api/vehicle/file/uploadPicture"
          :limit="1"
          :on-preview="handlePreview"
          :show-file-list="false"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="tupanshangchuana2"
          list-type="picture"
        >
          <el-button size="small" type="primary">添加图片</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          action="/api/vehicle/file/uploadPicture"
          :limit="1"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :show-file-list="false"
          :file-list="fileList"
          :on-success="tupanshangchuana3"
          list-type="picture"
        >
          <el-button size="small" type="primary">添加图片</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          action="/api/vehicle/file/uploadPicture"
          :limit="1"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :show-file-list="false"
          :file-list="fileList"
          :on-success="tupanshangchuana4"
          list-type="picture"
        >
          <el-button size="small" type="primary">添加图片</el-button>
        </el-upload>
      </div>
      <div class="sdssdv">
        <div class="imgoo">
          <el-image
            v-if="editPartsForm.coverImg1"
            :src="editPartsForm.coverImg1"
            :preview-src-list="[editPartsForm.coverImg1]"
          ></el-image>
          <img
            @click="shanchutu(1)"
            v-if="editPartsForm.coverImg1"
            src="../../assets/guan2.png"
            class="shanchutu"
            alt
          />
        </div>
        <div class="imgoo">
          <el-image
            v-if="editPartsForm.coverImg2"
            :src="editPartsForm.coverImg2"
            :preview-src-list="[editPartsForm.coverImg2]"
          ></el-image>

          <img
            @click="shanchutu(2)"
            v-if="editPartsForm.coverImg2"
            src="../../assets/guan2.png"
            class="shanchutu"
            alt
          />
        </div>
        <div class="imgoo">
          <el-image
            v-if="editPartsForm.coverImg3"
            :src="editPartsForm.coverImg3"
            :preview-src-list="[editPartsForm.coverImg3]"
          ></el-image>
          <img
            @click="shanchutu(3)"
            v-if="editPartsForm.coverImg3"
            src="../../assets/guan2.png"
            class="shanchutu"
            alt
          />
        </div>
        <div class="imgoo">
          <el-image
            v-if="editPartsForm.coverImg4"
            :src="editPartsForm.coverImg4"
            :preview-src-list="[editPartsForm.coverImg4]"
          ></el-image>
          <img
            @click="shanchutu(4)"
            v-if="editPartsForm.coverImg4"
            src="../../assets/guan2.png"
            class="shanchutu"
            alt
          />
        </div>
        <div class="imgoo2">
          <el-form ref="form" :model="editPartsForm" label-width="80px">
            <el-form-item label="标签1:">
              <el-input v-model="editPartsForm.title1"></el-input>
            </el-form-item>
            <el-form-item label="标签2:">
              <el-input v-model="editPartsForm.title2"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="xiangqin">
        <div class="xxqqs">商品详情:</div>
        <quill-editor
          v-model="editPartsForm.content"
          ref="myQuillEditor"
          class="fuwenben"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editStatus = false">取 消</el-button>
        <el-button type="success" @click="editFormSubmit">提 交</el-button>
      </div>
    </el-dialog>
    <el-upload
      multiple
      show-file-list
      ref="uploadImg"
      action="/api/vehicle/file/uploadPicture"
      list-type="picture-card"
      :limit="40"
      style="display: none"
      :before-upload="beforeAvatarUpload"
      :on-success="handleSuccess"
    >
      <i class="el-icon-plus ccddd"></i>
    </el-upload>
  </div>
</template>

<script>
import {
  brandList,
  partBrand,
  shanchuupartBrand,
  classifyList,
  partClassify,
  brandDetails,
  shanchupartClassify,
  partBrandDetails
} from "../../request/api.js";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["image"]
  // , "video"
];
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      orderNavActive: 0,
      centerDialogVisible: false,
      imageUrl: "",
      editStatus: false,
      editPartsForm: {},
      form: {
        brandName: ""
      },
      fileList: [],
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".ccddd").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
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
    //提交详情
    editFormSubmit() {
      partBrandDetails(this.editPartsForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
          this.editStatus = false;
        }
      });
    },
    //详情弹窗
    xiangqin(id) {
      brandDetails({ brandId: id }).then(res => {
        if (res.data.code == 200) {
          this.editPartsForm = res.data.data;
          this.editStatus = true;
        }
      });
    },
    //上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    //富文本
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {
      console.log(this.content);
    }, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveHtml: function(event) {
      alert(this.content);
    },
    //监听图片上传成功
    handleSuccess(res) {
      console.log(res);
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      console.log(quill);
      // 如果上传成功
      if (res.data) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, "image", res.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        // 提示信息，需引入Message
        Message.error("图片插入失败");
      }
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 4;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("图片文件大小不能超过 4MB!");
      }
      // return isJPG && isLt2M;
      return isLt2M;
    },
    //监听图片上传成功
    tupanshangchuana(e) {
      this.editPartsForm.coverImg1 = e.data;
      this.$forceUpdate();
    },
    tupanshangchuana2(e) {
      this.editPartsForm.coverImg2 = e.data;
      this.$forceUpdate();
    },
    tupanshangchuana3(e) {
      this.editPartsForm.coverImg3 = e.data;
      this.$forceUpdate();
    },
    tupanshangchuana4(e) {
      this.editPartsForm.coverImg4 = e.data;
      this.$forceUpdate();
    },
    shanchutu(row) {
      if (row == 1) {
        this.editPartsForm.coverImg1 = "";
        this.$forceUpdate();
      } else if (row == 2) {
        this.editPartsForm.coverImg2 = "";
        this.$forceUpdate();
      } else if (row == 3) {
        this.editPartsForm.coverImg3 = "";
        this.$forceUpdate();
      } else if (row == 4) {
        this.editPartsForm.coverImg4 = "";
        this.$forceUpdate();
      }
    },

    //
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
.xianqin {
  margin-right: 10px;
  color: #6a5acd;
  cursor: pointer;
}
.shanchu {
  cursor: pointer;
  z-index: 99;
  color: red;
}
.shanchutu {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  width: 20px;
  height: 20px;
}
.tianjia {
  color: #6a5acd;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
}
.mingc {
  padding-left: 30px;
  margin-bottom: 15px;
}
.pname {
  color: #0d906e;
}
/* XIANGQ */
.el-form {
  overflow: hidden;
}
.xgdddd .el-form-item {
  margin-bottom: 5px;
  width: 50%;
  float: left;
}
.el-image {
  width: 100%;
  height: 100%;
}
.sdssdv {
  overflow: hidden;
  margin-left: 100px;
}
.ssspp {
  overflow: hidden;
}
.sptup {
  width: 100px;
  float: left;
  text-align: right;
  padding-right: 12px;
}
.xiangqin {
  overflow: hidden;
}
.xxqqs {
  float: left;
  width: 100px;
  text-align: right;
  padding-right: 12px;
}
.fuwenben {
  float: left;
}

.imgoo {
  position: relative;
  width: 130px;
  height: 130px;
  border: 1px solid #999;
  float: left;
}
.imgoo2 {
  width: 35%;
  position: relative;
  float: left;
}
.imgoo:nth-of-type(n + 2) {
  margin-left: 30px;
}
.upload-demo:nth-of-type(n + 3) {
  margin-left: 30px;
}
.upload-demo {
  float: left;
  width: 130px;
  text-align: center;
}
</style>
<style>
.el-input__inner {
  height: 35px;
}
.fuwenben .ql-editor {
  height: 280px;
}
</style>

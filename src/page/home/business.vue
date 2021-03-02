<template>
  <div class="w-100 orderTable" style="padding-left: 30px;">
    <div class="p-tb-30">
      <!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;">| 服务记录列表</h2> -->
      <ul class="left orderUl" style="width: 400px;padding-top: 5px;">
        <li :class="orderNavActive == 0?'active':''" @click="orderTab(0)">待审核</li>
        <li :class="orderNavActive == 1?'active':''" @click="orderTab(1)">审核通过</li>
        <li :class="orderNavActive == 2?'active':''" @click="orderTab(2)">审核未通过</li>
      </ul>
      <div class="right m-r-20"></div>
      <div class="clear"></div>
    </div>
    <div class="p-20" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="修理厂名称" class="m-b-0">
              <el-input v-model="search.name" placeholder="请输入修理厂名称" style="width: 160px;"></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="init">查找</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-table :data="tableData" :max-height="maxHeight" style="width: 100%" id="printBox">
      <el-table-column prop="date" label="编号" width="80">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column prop="name" label="修理厂名称">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="所在城市">
        <template slot-scope="scope">{{scope.row.city}}</template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">{{scope.row.address}}</template>
      </el-table-column>
      <el-table-column label="法人姓名">
        <template slot-scope="scope">{{scope.row.legalPerson}}</template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template slot-scope="scope">{{scope.row.legalPersonPhone}}</template>
      </el-table-column>
      <el-table-column label="营业执照照片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.businessLicensePic"
            fit="fill"
            @click="viewPhoto(scope.row.businessLicensePic)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="门面照片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.doorPic"
            fit="fill"
            @click="viewPhoto(scope.row.doorPic)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="业务员">
        <template slot-scope="scope">{{scope.row.salesman}}</template>
      </el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="scope">{{scope.row.createdDate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" v-if="orderNavActive == 0">
        <template slot-scope="scope">
          <el-button
            type="success"
            plain
            class="xiugai"
            size="mini"
            @click="xiugai(scope.row)"
          >修改注册信息</el-button>
          <el-button type="success" size="mini" @click="agreeApply(scope.row)">同意</el-button>
          <el-button type="danger" size="mini" @click="refuseApply(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column label="二维码" width="180" align="center" v-if="orderNavActive == 1">
        <template slot-scope="scope">
          <el-upload
            class="avatar-uploader"
            action="/api/vehicle/file/uploadPicture"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            @click.native="getRow(scope.row)"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="scope.row.qrCodePic" :src="scope.row.qrCodePic" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p v-if="scope.row.qrcode" style="text-align:center;">
            <font color="red">点击图片可重新上传</font>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="母帐号密码" width="180" align="center" v-if="orderNavActive == 1">
        <template slot-scope="scope">
          <el-button
            type="success"
            plain
            class="xiugai"
            size="mini"
            @click="xiugai(scope.row)"
          >修改注册信息</el-button>
          <el-button
            type="danger"
            size="mini"
            class="xiugai"
            @click="sesetPassword(scope.row)"
          >重置母账号密码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="拒绝原因" width="180" align="center" v-if="orderNavActive == 2">
        <template slot-scope="scope">{{scope.row.rejectReason}}</template>
      </el-table-column>
    </el-table>
    <div class="p-tb-10 text-center">
      <el-pagination
        :hide-on-single-page="pageLength === 0"
        background
        layout="prev, pager, next"
        :page-size="size"
        @current-change="nextPage"
        :total="pageLength"
      ></el-pagination>
    </div>
    <el-dialog title="图片查看" center :visible.sync="dialogVisible" :modal="false" width="50%">
      <div style="text-align:center;">
        <el-image :src="src"></el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 支出记账弹窗 -->
    <el-dialog
      title="修改门店注册信息"
      :visible.sync="dialogVisible2"
      :modal-append-to-body="false"
      width="30%"
      :modal="false"
      center
      class="xiu"
    >
      <el-form :model="editPartsForm" ref="addFormRef" label-width="80px">
        <el-form-item label="公司名称" prop="receiveSide">
          <el-input v-model="editPartsForm.name" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="所在地" prop="amount">
          <el-input v-model="editPartsForm.city" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="amount">
          <el-input v-model="editPartsForm.address" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="法人名称" prop="amount">
          <el-input v-model="editPartsForm.legalPerson" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="amount">
          <el-input v-model="editPartsForm.legalPersonPhone" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="门店纬度" prop="amount">
          <el-input v-model="editPartsForm.positionWd" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="门店经度" prop="amount">
          <el-input v-model="editPartsForm.positionJd" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
           <el-form-item label="提现费率" prop="inCashRate">
          <el-input v-model="editPartsForm.inCashRate" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
           <el-form-item label="集客单价" prop="gcprice">
          <el-input v-model="editPartsForm.gcprice" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label label-width="120px">
          <div class="yinye">营业执照</div>
          <el-upload
            ref="uploadImg2"
            action="/api/vehicle/file/uploadPicture"
            list-type="picture-card"
            :limit="1"
            :file-list="editPartsForm.businessLicensePic"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label label-width="120px">
          <div class="yinye">门面照片</div>
          <el-upload
            ref="uploadImg"
            action="/api/vehicle/file/uploadPicture"
            list-type="picture-card"
            :limit="1"
            :on-remove="handleRemove2"
            :on-success="handleSuccess2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="业务员" prop="reason">
          <el-select v-model="editPartsForm.salesman" placeholder="请选择" style="width: 300px">
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.realName"
              :value="item.realName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleQ">取 消</el-button>
        <el-button type="success" @click="dialogVisibleT">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBusiness,
  auditGarage,
  resetPassword,
  updateQrCode,
  salesmanList,
  changeGarageInfo
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      tableData: [],
      list: [],
      editPartsForm: [],
      orderNavActive: 0,
      dialogVisible2: false,
      maxHeight: undefined,
      search: {
        name: ""
      },
      pageLength: null,
      size: 10,
      page: 0,
      dialogVisible: false,
      src: "",
      editPartsForm: {}, //修改修理厂
      uploadInfo: {}
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
  },
  methods: {
    //监听营业执照图片上传成功
    handleSuccess(e) {
      // console.log(e.data);
      this.editPartsForm.businessLicensePic = e.data;
    },
    //监听门店照片图片上传成功
    handleSuccess2(e) {
      // console.log(e.data);
      this.editPartsForm.doorPic = e.data;
    },
    //删除上传图片
    handleRemove(file, fileList) {
      // console.log(file);
      this.editPartsForm.businessLicensePic = "";
      const filepath = file.response.data;
      // console.log(file.response.data)
    },
    //删除上传图片
    handleRemove2(file, fileList) {
      // console.log(file);
      this.editPartsForm.doorPic = "";
      const filepath = file.response.data;
      // console.log(file.response.data)
    },
    //修改注册信息
    xiugai(row) {
      this.editPartsForm = row;
      console.log(row);
      salesmanList().then(res => {
        console.log(res.data.data);
        this.list = res.data.data;
      });
      this.dialogVisible2 = true;
    },
    dialogVisibleQ() {
      this.$refs.addFormRef.resetFields();
      this.$refs.uploadImg.clearFiles();
      this.$refs.uploadImg2.clearFiles();
      this.editPartsForm.doorPic = "";
      this.editPartsForm.businessLicensePic = "";

      this.dialogVisible2 = false;
    },
    //提交修改
    dialogVisibleT() {
      console.log(this.editPartsForm);
      if (!this.editPartsForm.name)
        return this.$message.error("请输入公司名称");
      if (!this.editPartsForm.city) return this.$message.error("请选择所在地");
      if (!this.editPartsForm.address)
        return this.$message.error("请输入公司地址");
      if (!this.editPartsForm.legalPerson)
        return this.$message.error("请输入法人名称");
      if (!this.editPartsForm.legalPersonPhone)
        return this.$message.error("请输入手机号码");
      if (!this.editPartsForm.positionJd)
        return this.$message.error("请填写当前经纬度");
      if (!this.editPartsForm.positionWd)
        return this.$message.error("请填写当前经纬度");
      // if (this.editPartsForm.businessLicensePic == "")
      //   return this.$message.error("请上传营业执照");
      // if (this.editPartsForm.doorPic == "")
      //   return this.$message.error("请上传门面照片");
      if (!this.editPartsForm.salesman)
        return this.$message.error("请选择业务员");
      changeGarageInfo(this.editPartsForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });

          this.$refs.addFormRef.resetFields();
          this.$refs.uploadImg.clearFiles();
          this.$refs.uploadImg2.clearFiles();
          this.editPartsForm.doorPic = "";
          this.editPartsForm.businessLicensePic = "";
          this.init();
          this.dialogVisible2 = false;
        }
      });
    },
    init() {
      const data = {
        size: this.size,
        page: this.page,
        status: this.orderNavActive,
        name: this.search.name
      };
      getBusiness(data).then(res => {
        console.log(res.data);
        const result = res.data;
        this.pageLength = result.pageInfo.total+10;
        this.tableData = result.data;
      });
    },
    nextPage(page) {
      this.page = page - 1;
      this.init();
    },
    orderTab(index) {
      this.orderNavActive = index;
      this.page = 0;
      this.init();
    },
    viewPhoto(url) {
      this.src = url;
      this.dialogVisible = true;
    },
    getRow(row) {
      this.uploadInfo = row;
    },
    handleAvatarSuccess(res, file) {
      const data = {
        id: this.uploadInfo.id,
        qrCodePic: res.data
      };
      updateQrCode(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "上传成功"
          });
          this.init();
        }
      });
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    agreeApply(row) {
      this.$confirm("确认通过审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = JSON.parse(JSON.stringify(row));
          data.status = 1;
          auditGarage(data).then(res => {
            const result = res.data;
            if (result.code == 200) {
              this.$message({
                type: "success",
                message: "审核成功"
              });
              this.init();
            } else {
              this.$message({
                type: "error",
                message: result.message
              });
            }
          });
        })
        .catch(() => {});
    },
    refuseApply(row) {
      this.$prompt("审核未通过原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let data = JSON.parse(JSON.stringify(row));
          data.status = 2;
          data.rejectReason = value;
          auditGarage(data).then(res => {
            const result = res.data;
            if (result.code == 200) {
              this.$message({
                type: "success",
                message: "审核成功"
              });
              this.init();
            } else {
              this.$message({
                type: "error",
                message: result.message
              });
            }
          });
        })
        .catch(() => {});
    },
    sesetPassword(row) {
      this.$confirm("确认重置密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resetPassword({ gid: row.id }).then(res => {
            const result = res.data;
            if (result.code == 200) {
              this.$message({
                type: "success",
                message: "重置密码成功"
              });
              this.init();
            } else {
              this.$message({
                type: "error",
                message: result.message
              });
            }
          });
        })
        .catch(() => {});
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
.yinye {
  float: left;
  width: 80px;
  padding: 0 12px 0 0;
  text-align: right;
  vertical-align: middle;
}
.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
.xiugai {
  margin-bottom: 8px;
  width: 125px;
  margin-left: 8px;
}
</style>
<style>
.xiu .el-form-item__content {
  margin-left: 0 !important;
}
.xiu .el-upload-list__item-actions {
  width: 80px;
  height: 80px;
}
.xiu .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 80px;
  height: 80px;
}
.xiu .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.xiu .el-dialog--center .el-dialog__body {
  padding: 5px 25px 30px;
}
.xiu .el-input__inner {
  height: 35px;
}
.xiu .el-form-item {
  margin-bottom: 10px;
}
.xiu .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>


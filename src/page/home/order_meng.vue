<template>
  <div class="w-100">
    <div class="p-20" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-link type="success" class="m-r-15" @click="toshijian(1)">今日</el-link>
            <el-link type="success" class="m-r-15" @click="toshijian(4)">本月</el-link>
            <el-link type="primary" class="m-r-15" @click="toshijian(2)">上日</el-link>
            <el-link type="primary" class="m-r-25" @click="toshijian(3)">下日</el-link>
            <el-form-item label="日期" class="m-b-0">
              <el-date-picker
                v-model="search.time[0]"
                type="date"
                placeholder="开始日期"
                style="width: 150px;"
              ></el-date-picker>至
              <el-date-picker
                v-model="search.time[1]"
                type="date"
                placeholder="结束日期"
                style="width: 150px;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="门店" class="m-b-0">
              <el-select v-model="xlgid" placeholder="请选择" @change="xuanzhe">
                <el-option
                  v-for="item in xlclist"
                  :key="item.id"
                  :label="item.garageName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="chazhao">查找</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-table :data="tableData" :max-height="maxHeight" style="width: 100%" class="orderTable">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="单号">
        <template slot-scope="scope">{{scope.row.orderNumber}}</template>
      </el-table-column>
      <el-table-column label="下单时间" prop="createTime" :formatter="timestampToTime">
        <!-- <template slot-scope="scope">{{(new Date(scope.row.createTime))}}</template> -->
      </el-table-column>
      <el-table-column label="订单金额">
        <template slot-scope="scope">{{scope.row.orderTotal}}</template>
      </el-table-column>
      <el-table-column label="车牌">
        <template slot-scope="scope">{{scope.row.carNo}}</template>
      </el-table-column>
      <el-table-column label="车型">
        <template slot-scope="scope">{{scope.row.carModel}}</template>
      </el-table-column>
      <el-table-column label="车主姓名">
        <template slot-scope="scope">{{scope.row.receiver}}</template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">{{scope.row.tel}}</template>
      </el-table-column>
      <el-table-column label="预约施工时间">
        <template slot-scope="scope">{{scope.row.appointmentTime}}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if></span>
          {{scope.row.businessScope}}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">{{scope.row.orderRemark}}</template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center" v-if="orderNavActive == 0">
        <template slot-scope="scope">
          <el-button size="mini" @click="topeijian(scope.row)">配件清单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="p-tb-10 text-center">
      <el-pagination
        :hide-on-single-page="pageLength === 0"
        background
        layout="prev, pager, next"
        :page-size="size"
        @current-change="nextPage"
        :total="pageLength"
      ></el-pagination>
    </div> -->
    <el-dialog
      title="编辑订货单"
      :visible.sync="dialogVisibleB"
      width="85%"
      :modal="false"
      top="14vh"
      class="fafangss"
      center
    >
      <div class style="margin-top:10px;">
        <div class="podd" style>
          <el-form :inline="true" class="demo-form-inline">
            <el-row>
              <el-col>
                <el-form-item label="门店" class="m-b-0">
                  <span>{{tableData2.garageName}}</span>
                </el-form-item>
                <el-form-item label="订单号" class="m-b-0">
                  <span>{{tableData2.orderNumber}}</span>
                </el-form-item>
                <el-form-item label="车牌" class="m-b-0">
                  <span>{{tableData2.carNo}}</span>
                </el-form-item>
                <el-form-item label="车架号" class="m-b-0">
                  <span>{{tableData2.carVin}}</span>
                </el-form-item>
                <el-form-item label="订单时间" class="m-b-0">
                  <span>{{tableData2.createTime}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="width:100%;padding-top:15px;" class id="printBox">
          <el-table
            :data="tableData2.partList"
            :height="350"
            style="width: 100%"
            class="orderTable"
          >
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
            <el-table-column prop="partName" label="配件名称" width="140"></el-table-column>
            <el-table-column prop="partNo" label="编码"></el-table-column>
            <el-table-column prop label="规格">
              <template slot-scope="scope">{{scope.row.norm}}</template>
            </el-table-column>
            <el-table-column prop label="型号">
              <template slot-scope="scope">{{scope.row.model}}</template>
            </el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column prop="inPrice" label="单价"></el-table-column>
            <el-table-column prop="carNo" label="金额">
              <template slot-scope="scope">{{scope.row.inPrice * scope.row.num}}</template>
            </el-table-column>
            <el-table-column prop label="供应商备注" width="150">
              <template slot-scope="scope">{{scope.row.remark}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-input class="left" v-model="search.name" placeholder="请输入" style="width:90%;"></el-input>
        <el-button class="right" @click type="success">发放</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dingdanlist, queryGarageInfo, qindanlist } from "../../request/api.js";
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      seriesOrBrand: "",
      letterIndex: "",
      tableData: [],
      tableData2: {},
      orderNavActive: 0,
      dialogVisibleB: false,
      maxHeight: undefined,
      search: {
        time: [
          moment(new Date()).format("YYYY-MM-01"),
          moment(new Date()).format("YYYY-MM-DD")
        ]
      },

      xlgid: 0,
      pageLength: null,
      size: 10,
      page: 0,
      dialogVisible: false,
      src: "",
      carVisible: false,
      addCarForm: {},
      xlclist: [],
      carInfo: {
        type: "1"
      },
      brandList: [],
      modelList: [],
      searchInfo: {},
      type: 5
    };
  },
  created() {
    this.xiulichang();
    this.init();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
  },
  methods: {
    init() {
      const data = {
        endTime: this.search.time[1],
        starTime: this.search.time[0],
        gid: this.xlgid,
        type: this.type
      };
      dingdanlist(data).then(res => {
        // const result = res.data;
        // this.pageLength = result.data.totalElements;
        this.tableData = res.data.data;
        // this.tableData = result.data.content;
      });
    },
    topeijian(row) {
      const data = {
        id: row.id,
        type: row.type
      };
      qindanlist(data).then(res => {
        // const result = res.data;
        // this.pageLength = result.data.totalElements;
        this.tableData2 = res.data.data;
        var date = new Date(this.tableData2.createTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        let h = date.getHours();
        h = h < 10 ? "0" + h : h;
        let m = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        let s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        this.tableData2.createTime =
          y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;

        this.dialogVisibleB = true;
        // this.tableData = result.data.content;
      });
    },
    xiulichang() {
      queryGarageInfo().then(res => {
        this.xlclist = res.data.data;
        var quan = {
          id: 0,
          garageName: "全部"
        };
        this.xlclist.unshift(quan);
      });
    },
    chazhao() {
      console.log(this.search.time[1]);
      if (
        this.search.time[1] != undefined &&
        this.search.time[1] != undefined
      ) {
        console.log("走这里了");
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
        this.type = 5;
      }
      this.init();
    },
    timestampToTime(row, column) {
      var date = new Date(row.createTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
    toshijian(val) {
      this.search.time = [];
      this.type = val;
      this.init();
    },
    xuanzhe(e){
      console.log(e)
      this.xlgid = e
      this.init();
    },
    nextPage(page) {
      this.page = page - 1;
      this.init();
      return;
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
.dialog-footer {
  margin-bottom: 20px;
  overflow: hidden;
}
</style>
<style >
</style>
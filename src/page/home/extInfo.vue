<template>
  <div class="w-100 order flex-col" style="padding-left: 30px;">
    <el-row type="flex" justify="space-between" style="padding: 10px 10px;">
      <el-col>券名：{{ activityName }}</el-col>
      <el-col style="text-align: right;">
        <router-link :to="{path: '/home/extension'}" style="color:#0D906E;">返回</router-link>
      </el-col>
    </el-row>

    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="日期" class="m-b-0">
              <el-date-picker
                v-model="search.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="门店" class="m-b-0">
              <el-select v-model="search.gid" placeholder="请选择">
                <el-option label="全部" value="0">全部</el-option>
                <el-option v-for="item in business" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="searchList()"
              >查找</el-button>
              <el-form-item label="" class="m-b-0 right m-r-20">
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column label="编号" prop="gid"></el-table-column>
        <el-table-column prop="garageName" label="门店名称"> </el-table-column>
        <el-table-column prop="count" label="已使用数"> </el-table-column>
        <el-table-column v-for="(item, index) in columns" :key="item.partId" :label="item.partName">
          <template slot-scope="scope">
            <div style="cursor:pointer;" @click="viewRecord(scope.row.gid, scope.row.partList[index].partId)">{{scope.row.partList[index].partCount}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="size"
          @current-change="handleCurrentChange"
          :total="pageLength"
        >
        </el-pagination>
      </div> -->
    </div>

    <el-dialog :title="title" :visible.sync="dialogShopVisible" center :modal="false"  width="40%">
      <el-table :data="recordList">
        <el-table-column label="车牌">
          <template slot-scope="scope">{{ scope.row.carNo }}</template>
        </el-table-column>
        <el-table-column label="使用日期">
          <template slot-scope="scope">{{ scope.row.userDate }}</template>
        </el-table-column>
        <el-table-column label="品名">
          <template slot-scope="scope">{{ scope.row.partName }}</template>
        </el-table-column>
        <el-table-column label="规格型号">
          <template slot-scope="scope">{{ scope.row.partModel }}</template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">{{ scope.row.partCount }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="dialogShopVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getActivitySummery, getActivityRecordListByGarage, getBusiness } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formG",
  data() {
    return {
      title: '',
      activityName: localStorage.getItem('activity_name'),
      dialogShopVisible: false,
      search: {
        time: [],
        gid: "0"
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime();
          if (maxDate) {
            this.selectDate = "";
          }
        },
        disabledDate: time => {
          if (this.selectDate !== "") {
            const one = 30 * 24 * 3600 * 1000;
            const minTime = this.selectDate - one;
            const maxTime = this.selectDate + one;
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
        },
        shortcuts: [{
            text: '今日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (Number(moment(new Date()).format("D")) - 1));
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      tableData: [],
      recordList: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      business: [],
      columns: []
    };
  },
  created() {
    const datas = {
      pageSize: 2000,
      pageNumber: 0,
      status: 1
    }
    getBusiness(datas).then(res => {
      const result = res.data
      this.business = result.data
    })

    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      // endDate: nowTime,
      // beginDate: nowTime,
      activityId: this.$route.params.id,
      gid: 0,
      page: this.page,
      size: this.size
    };
    this.getList(data);
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    viewRecord(gid, partid) {
      const data = {
        partId: partid,
        activityId: this.$route.params.id,
        gid: gid,
      }
      getActivityRecordListByGarage(data).then(res => {
        this.recordList = res.data.data
        this.dialogShopVisible = true
      })
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      if (
        this.search.time !== undefined &&
        this.search.time !== null &&
        this.search.time.length > 0
      ) {
        const data = {
          endDate: this.search.time[1],
          beginDate: this.search.time[0],
          activityId: this.$route.params.id,
          gid: this.search.gid,
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        this.$message({
          message: "请先选择查询日期！",
          type: "warning"
        });
      }
    },
    getList(data) {
      getActivitySummery(data).then(res => {
        this.tableData = res.data.data
        this.columns = this.tableData[0].partList
      })
    },
    searchList() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
      } else {
        this.$message({
          message: "请选择查询日期！",
          type: "warning"
        });
        return false;
      }

      const data = {
        endDate: this.search.time[1],
        beginDate: this.search.time[0],
        activityId: this.$route.params.id,
        gid: this.search.gid,
        page: this.page,
        size: this.size
      };
      this.getList(data);
    }
  }
};
</script>
<style scoped>
.navActive em:hover {
		color: #3AC29F;
		transition: .5s;
	}
	
	.navActive em.active {
		color: #3AC29F;
	}

</style>
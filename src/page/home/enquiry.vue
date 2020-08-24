<template>
  <div class="w-100 orderTable" style="padding-left: 30px;">
    <div class="p-tb-20" style="overflow: hidden;">
      <!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;">| 服务记录列表</h2> -->
      <ul class="left orderUl" style="width: 400px;padding-top: 5px;">
        <li :class="orderNavActive == 0?'active':''" @click="orderTab(0)">运行工单</li>
        <li :class="orderNavActive == 1?'active':''" @click="orderTab(1)">过去时工单</li>
        <li :class="orderNavActive == 2?'active':''" @click="orderTab(2)">订单</li>
      </ul>

      <div class="right m-r-20"></div>
      <div class="clear"></div>
      <ul class="left orderUl2" style="padding-top: 5px;" v-if="orderNavActive == 0">
        <li :class="orderNavActive2 == 0?'active':''" @click="orderTab2(0)">今日全部工单</li>
        <li :class="orderNavActive2 == 1?'active':''" @click="orderTab2(1)">已完成报价</li>
        <li>
          目前待报价工单数：
          <span style="font-weight: bold;color:#2E8B57">{{haveAskedCount}}</span>
        </li>
        <li>
          超时待处理：
          <span style="color:red">{{timeOutAskedCount}}</span>
        </li>
        <li>
          询价图片处理：
          <span style="color:#F4A460">{{picHaveAskedCount}}</span>
        </li>
      </ul>
      <ul class="left orderUl2" style="padding-top: 5px;" v-if="orderNavActive == 1">
        <li :class="orderNavActive2 == 0?'active':''" @click="orderTab2(0)">全部工单</li>
        <li :class="orderNavActive2 == 1?'active':''" @click="orderTab2(1)">已报价</li>
        <li :class="orderNavActive2 == 2?'active':''" @click="orderTab2(2)">部分报价</li>
        <li :class="orderNavActive2 == 3?'active':''" @click="orderTab2(3)">未报价</li>
        <li :class="orderNavActive2 == 4?'active':''" @click="orderTab2(4)">聊天模式未处理</li>
      </ul>
      <ul class="left orderUl2" style="padding-top: 5px;" v-if="orderNavActive == 2">
        <li :class="orderNavActive2 == 0?'active':''" @click="orderTab2(0)">全部工单</li>
        <li :class="orderNavActive2 == 5?'active':''" @click="orderTab2(5)">支付</li>
        <li :class="orderNavActive2 == 6?'active':''" @click="orderTab2(6)">未支付</li>
      </ul>
      <div
        class="left zidong"
        style="margin-top: 5px;"
        v-if="orderNavActive == 0"
        @click="ZDjiedan"
      >自动接单</div>
    </div>

    <div class="p-20" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="修理厂名称" class="m-b-0">
              <el-input v-model="search.garageName" placeholder="请输入修理厂名称" style="width: 160px;"></el-input>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="init">查找</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
      <el-table-column type="index" label="编号" width="80">
        <template slot-scope="scope">{{scope.row.index}}</template>
      </el-table-column>
      <el-table-column prop="oid" label="询价单号"></el-table-column>
      <el-table-column label="修理厂名称">
        <template slot-scope="scope">{{scope.row.garageName}}</template>
      </el-table-column>
      <el-table-column label="所在城市">
        <template slot-scope="scope">{{scope.row.address}}</template>
      </el-table-column>
      <el-table-column label="用户姓名">
        <template slot-scope="scope">{{scope.row.buyerName}}</template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template slot-scope="scope">{{scope.row.buyerPhone}}</template>
      </el-table-column>
      <el-table-column label="询价时间" width="135">
        <template slot-scope="scope">{{scope.row.createdDate}}</template>
      </el-table-column>
      <el-table-column label="配件数量">
        <template slot-scope="scope">{{scope.row.partCount}}</template>
      </el-table-column>
      <el-table-column label="询价模式">
        <template slot-scope="scope">{{scope.row.askType}}</template>
      </el-table-column>
      <el-table-column label="已报/发布数">
        <template slot-scope="scope">
          {{scope.row.askedCount}}
          <span v-if="scope.row.index != '合计:'">/</span>
          {{scope.row.askCount}}
        </template>
      </el-table-column>
      <el-table-column label="下订单时间" width="135">
        <template slot-scope="scope">{{scope.row.orderDate}}</template>
      </el-table-column>
      <el-table-column label="订单金额">
        <template slot-scope="scope">
          <span style="color:red">{{scope.row.totalAmount?'￥'+scope.row.totalAmount:''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="付款方式">
        <template
          slot-scope="scope"
        >{{scope.row.paySetting}}{{scope.row.payStatus?'('+scope.row.payStatus+')':''}}</template>
      </el-table-column>
      <el-table-column label width="90" align="center" v-if="orderNavActive == 2">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            v-if="scope.row.index != '合计:'"
            @click="editRow(scope.row)"
          >查看</el-button>
        </template>
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
    <el-dialog
      title
       :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="piliang"
      ref="img"
      class="c_dad"
      width="60%"
      top="12vh"
      center
      append-to-body
      
    >
    <!-- @close="closeDialog" -->
      <el-row class="dingdan_ls">
        <el-col :span="8">订单号：{{ListNow.billNumber}}</el-col>
        <el-col :span="8">修理厂名称：{{ListNow.garageName}}</el-col>
        <el-col :span="8">下单时间：{{ListNow.createdTime}}</el-col>
      </el-row>

      <div class="left pilian ptup previewP_main" id="test_3">
        <div class="tianjia" style="text-align: left;padding-left: 30px;">
          <div class="suoding">该单已被您锁定,请尽快处理发布或关闭此窗口！</div>
          <!-- <el-radio v-model="radio" label="1">图片模式</el-radio> -->
          <!-- <el-radio v-model="radio" label="2">聊天模式</el-radio> -->
        </div>
        <div style="height: 400px;overflow: hidden;cursor: pointer;background:#f5f5f5" class="hove">
          <button
            type="button"
            @click="Playjian"
            class="el-carousel__arrow el-carousel__arrow--left dd"
            style
          >
            <i class="el-icon-arrow-left"></i>
          </button>
          <!-- display: none; -->
          <button
            type="button"
            @click="autoPlay"
            class="el-carousel__arrow el-carousel__arrow--right"
            style
          >
            <i class="el-icon-arrow-right"></i>
          </button>

          <div v-for="(item, index) in ListNow.picList" v-show="index===mark" :key="index" class>
            <img
              :src="item"
              @mousedown="move"
              @mousewheel="rollImg(this)"
              ref="bigImage"
              class="imgd hove"
              :style="{transform:'rotateZ('+deg+'deg)',zoom:(zoom+'%')}"
            />
          </div>
        </div>
        <div style="height: 42px;    margin-top: 10px;">
          <img
            class="fan"
            style="vertical-align: middle;"
            @click.stop="fan()"
            src="../../assets/fanzhuan2.png"
            alt
          />
          <img
            class="fan"
            style="vertical-align: middle;"
            @click.stop="zheng()"
            src="../../assets/fanzhuan.png"
            alt
          />
        </div>
      </div>
      <div class="pilian right">
        <div class="tianjia">批量添加配件</div>
        <el-input
          type="textarea"
          :rows="2"
          style="width:100%"
          @blur="jiexi(2)"
          @keyup.space.native="jiexi"
          placeholder="请输入内容"
          v-model="textarea"
        ></el-input>
        <el-row>
          <el-col :span="24" class="dll">
            <div class="flllts">
              请输入配件名称，如有多个配件请用空格分开，如：
              <span style="color: #606266">大灯 下摆臂 前杠</span>
            </div>
            <div class="flll">解析结果共：{{szpeijian.length}}个配件</div>
          </el-col>
        </el-row>
        <el-row class="deng">
          <el-col :span="6" class="ddv" v-for="(item,index) in szpeijian" :key="'item'+index">
            <div class="grid-content bg-purple cs" style="text-align: center;">{{item.partName}}</div>
          </el-col>
        </el-row>
        <div slot="footer" style="text-align: center;">
           <el-button
            size="small"
            style="width: 30%;margin-top: 10px;"
            @click="closeDialog"
            type="danger"
          >取 消</el-button>
          <el-button
            size="small"
            style="width: 30%; margin-left: 20px;margin-top: 10px;"
            @click="tijiaopeijian"
            type="success"
          >发 布</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="发布成功！"
      close="ticd"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="centerDialogVisible"
      width="25%"
      center
    >
      <div class="duiliueshu">
        剩余队列数：
        <span style="color: red;">{{shuliang}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" plain @click="tuichu">退出</el-button>
        <el-button v-if="shuliang != 0" type="danger" @click="xiayidian" plain>处理下一单</el-button>
      </span>
    </el-dialog>

    <!-- 查看商家弹窗 -->
    <el-dialog
      title=" 商家报价"
      :visible.sync="editFormStatus"
      width="85%"
      top="12vh"
      center
      :modal="false"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col style="margin-bottom: 5px;">
            <ul class="left orderUl" style="width:40%;">
              <li
                :class="indexfl==switchActive?'active':''"
                v-for="(item,indexfl) in dispose"
                :key="'inf'+indexfl"
                @click="switchOF(indexfl)"
              >{{item}}</li>
            </ul>
            <div class="left orlist" v-if="PriceList != ''">
              <div>车牌：{{carNoname}}</div>
              <div>工单号：{{billNumber}}</div>
              <div>询价日期：{{createdDate}}</div>
            </div>
            <div class="right" @click="editRow2">
              <img class="shaimg" src="../../assets/shaxin.png" alt />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="tbode">
        <el-table
          :data="Noquotation"
          :max-height="360"
          style="width: 100%"
          ref="lists"
          id="printBox"
          v-if="switchActive == 2"
        >
          <el-table-column type="index" label="序号" width="80">
            <!-- <template slot-scope="scope">{{scope.row.index}}</template> -->
          </el-table-column>
          <el-table-column prop="name" label="供应商" width="200">
            <template slot-scope="scope">{{scope.row.companyName}}</template>
          </el-table-column>
          <el-table-column label="联系人" width="100">
            <template slot-scope="scope">{{scope.row.linkman}}</template>
          </el-table-column>
          <el-table-column label="联系电话" width="150">
            <template slot-scope="scope">{{scope.row.phone}}</template>
          </el-table-column>
          <el-table-column label="询价配件">
            <template slot-scope="scope">
              <span v-if="scope.row.sl == '手写单询价'">{{scope.row.sl}}</span>
              <span v-else>{{scope.row.askPart2}}等{{scope.row.sl}}个配件</span>
            </template>
          </el-table-column>
          <el-table-column label="询价时间">
            <template slot-scope="scope">{{scope.row.createdTime}}</template>
          </el-table-column>
          <el-table-column label="询价状态" width="110px">
            <template slot-scope="scope">
              <em style="color:#FF6757" v-if="scope.row.status ==0">未报价</em>
              <em style="color:#FF6757" v-if="scope.row.status ==1">缺货取消</em>
              <em style="color:#FF6757" v-if="scope.row.status ==2">超时取消</em>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="xuhao" v-if="switchActive != 2">
        <div class="xu1">序号</div>
        <div class="xu2" style="width:20%">供应商</div>
        <div class="xu8" v-if="switchActive == 1">数量</div>
        <div class="xu3" :style="{'width':switchActive == 1 ? '9%':''}">产地</div>
        <div class="xu4">单价</div>
        <div class="xu5" :style="{'width':switchActive == 1 ? '14%':''}">到货时间</div>
        <div class="xu6">保质期</div>
        <div class="xu7" :style="{'width':switchActive == 1 ? '13%':''}">备注</div>
      </div>
      <!-- 配件模式 -->
      <div class="huadong" v-if="switchActive == 0 " style="max-height: 470px;">
        <div
          v-for="(item,indexff) in PriceList"
          :key="'item'+indexff"
          class="tbcd"
          v-if="item.askPricePartDOS != null"
        >
          <el-row>
            <div class="xuhao2" v-if="switchActive == 0">
              <el-col :span="8">
                <div class="pj">配件名称：{{item.partName}}</div>
              </el-col>
              <el-col :span="8">
                <div class="sl" style="cursor: pointer;">
                  数量：
                  <span
                    v-if="item.askPricePartDOS[0][0].modifyCount"
                    style="color: #e56350;"
                  >{{item.askPricePartDOS[0][0].partCount}}</span>
                  <span v-else>{{item.askPricePartDOS[0][0].partCount}}</span>
                </div>
              </el-col>
              <el-col :span="8" style="text-align: right;">
                <div class="sl" style="margin-right: 30px;">{{indexff+1}}/{{PriceList.length}}</div>
              </el-col>
            </div>
          </el-row>

          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="tbbd"
            v-for="(items,idx) in item.askPricePartDOS"
            :key="'items'+idx"
          >
            <tr>
              <td class="td1">{{idx+1}}</td>
              <td class="td2" style="  text-align: left;">
                <div v-if="switchActive == 0">
                  <img src="../../assets/supplier.png" alt />
                  <span>{{items[0].supplierName}}</span>
                </div>
                <div v-if="switchActive == 0">
                  <img src="../../assets/phone.png" alt />
                  <span>{{items[1].supplierPhone}}</span>
                </div>
                <div v-if="switchActive == 0">
                  <img src="../../assets/dizi.png" alt />
                  <span>{{items[2].address}}</span>
                </div>
                <div v-if="switchActive == 1" style=" margin-left: 25px;">
                  <span>{{items[2].partName}}</span>
                </div>
              </td>
              <td class="td8" v-if="switchActive == 1">
                <div>{{items[0].partCount}}</div>
              </td>
              <td class="td3">
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <!-- <img
                    v-if="items[0].status == 0 ||items[0].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />-->
                  <span v-if="items[0].classify">{{items[0].classify}}</span>
                  <span v-else>{{items[0].price==0 ?'':'原厂件'}}</span>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <!-- <img
                    v-if="items[1].status == 0 ||items[1].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />-->
                  <span v-if="items[1].classify">{{items[1].classify}}</span>
                  <span v-else>{{items[1].price==0 ?'':'品牌件'}}</span>
                </div>
                <div>
                  <!-- <img
                    v-if="items[2].status == 0 ||items[2].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />-->
                  <span v-if="items[2].classify">{{items[2].classify}}</span>
                  <span v-else>{{items[2].price==0 ?'':'其它件'}}</span>
                </div>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[3].price">
                    <!-- <img
                      v-if="items[3].status == 0 ||items[3].status == 1"
                      class="gou"
                      src="../../assets/gou.png"
                      alt
                    />-->
                    <span v-if="items[3].classify">{{items[3].classify}}</span>
                    <span v-else>{{items[3].price==0 ?'':'其它件2'}}</span>
                  </div>
                </template>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[4].price">
                    <!-- <img
                      v-if="items[4].status == 0 ||items[4].status == 1"
                      class="gou"
                      src="../../assets/gou.png"
                      alt
                    />-->
                    <span v-if="items[4].classify">{{items[4].classify}}</span>
                    <span v-else>{{items[4].price==0 ?'':'其它件3'}}</span>
                  </div>
                </template>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[5].price">
                    <!-- <img
                      v-if="items[5].status == 0 ||items[5].status == 1"
                      class="gou"
                      src="../../assets/gou.png"
                      alt
                    />-->
                    <span v-if="items[5].classify">{{items[5].classify}}</span>
                    <span v-else>{{items[5].price==0 ?'':'其它件4'}}</span>
                  </div>
                </template>
              </td>
              <td class="td4">
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <span
                    v-if="items[0].talkStatus ==1"
                    :style="{'color': (items[0].talkStatus == 1 ? '#0D906E':'')}"
                  >{{items[0].talkPrice ?'￥':''}}{{items[0].talkPrice}}</span>
                  <span
                    v-if="items[0].talkStatus !=1"
                  >{{items[0].price ?'￥':''}}{{items[0].price ?items[0].price:''}}</span>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <span
                    v-if="items[1].talkStatus ==1"
                    :style="{'color': (items[1].talkStatus == 1 ? '#0D906E':'')}"
                  >{{items[1].talkPrice ?'￥':''}}{{items[1].talkPrice}}</span>
                  <span
                    v-if="items[1].talkStatus !=1"
                  >{{items[1].price ?'￥':''}}{{items[1].price ?items[1].price:''}}</span>
                </div>
                <div>
                  <span
                    v-if="items[2].talkStatus ==1"
                    :style="{'color': (items[2].talkStatus == 1 ? '#0D906E':'')}"
                  >{{items[2].talkPrice ?'￥':''}}{{items[2].talkPrice}}</span>
                  <span
                    v-if="items[2].talkStatus !=1"
                  >{{items[2].price ?'￥':''}}{{items[2].price ?items[2].price:''}}</span>
                </div>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[3].price">
                    <span
                      v-if="items[3].talkStatus ==1"
                      :style="{'color': (items[3].talkStatus == 1 ? '#0D906E':'')}"
                    >{{items[3].talkPrice ?'￥':''}}{{items[3].talkPrice}}</span>
                    <span
                      v-if="items[3].talkStatus !=1"
                    >{{items[3].price ?'￥':''}}{{items[3].price}}</span>
                  </div>
                </template>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[4].price">
                    <span
                      v-if="items[4].talkStatus ==1"
                      :style="{'color': (items[4].talkStatus == 1 ? '#0D906E':'')}"
                    >{{items[4].talkPrice ?'￥':''}}{{items[4].talkPrice}}</span>
                    <span
                      v-if="items[4].talkStatus !=1"
                    >{{items[4].price ?'￥':''}}{{items[4].price}}</span>
                  </div>
                </template>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[5].price">
                    <span
                      v-if="items[5].talkStatus ==1"
                      :style="{'color': (items[5].talkStatus == 1 ? '#0D906E':'')}"
                    >{{items[5].talkPrice ?'￥':''}}{{items[5].talkPrice}}</span>
                    <span
                      v-if="items[5].talkStatus !=1"
                    >{{items[5].price ?'￥':''}}{{items[5].price}}</span>
                  </div>
                </template>
              </td>
              <td class="td5">
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{items[0].price?items[0].arrivalTime:''}}</div>
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{items[1].price?items[1].arrivalTime:''}}</div>
                <div>{{items[2].price?items[2].arrivalTime:''}}</div>
                <template v-if="items.length > 3">
                  <div
                    v-if="items[3].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{items[3].price?items[3].arrivalTime:''}}</div>
                </template>
                <template v-if="items.length > 3">
                  <div
                    v-if="items[4].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{items[4].price?items[4].arrivalTime:''}}</div>
                </template>
                <template v-if="items.length > 3">
                  <div
                    style="border-top: 1px solid #dcdfe6;"
                    v-if="items[5].price"
                  >{{items[5].price?items[5].arrivalTime:''}}</div>
                </template>
              </td>
              <td class="td6">
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{items[0].price?items[0].qualityTime:''}}</div>
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{items[1].price?items[1].qualityTime:''}}</div>
                <div>{{items[2].price?items[2].qualityTime:''}}</div>
                <template v-if="items.length > 3">
                  <div
                    v-if="items[3].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{items[3].price?items[3].qualityTime:''}}</div>
                </template>
                <template v-if="items.length > 3">
                  <div
                    v-if="items[4].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{items[4].price?items[4].qualityTime:''}}</div>
                </template>
                <template v-if="items.length > 3">
                  <div
                    style="border-top: 1px solid #dcdfe6;"
                    v-if="items[5].price"
                  >{{items[5].price?items[5].qualityTime:''}}</div>
                </template>
              </td>
              <td class="td7">
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{items[0].remark}}</em>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{items[1].remark}}</em>
                </div>
                <div>
                  <em>{{items[2].remark}}</em>
                </div>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6; " v-if="items[3].price">
                    <em>{{items[3].remark}}</em>
                  </div>
                </template>
                <template v-if="items.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="items[4].price">
                    <em>{{items[4].remark}}</em>
                  </div>
                </template>
                <template v-if="items.length > 3">
                  <div v-if="items[5].price" style="border-top: 1px solid #dcdfe6;">
                    <em>{{items[5].remark}}</em>
                  </div>
                </template>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 商家模式-->
      <div class="huadong" v-show="switchActive == 1" style="max-height: 470px;">
        <div v-for="(itemst,indexlst) in ceshi" :key="'itemst'+indexlst" class="tbcd">
          <div class="xuhao2">
            <div class="pei1 pei" style="width: 240px;">
              <img src="../../assets/supplier.png" alt />
              <span>{{itemst.supplierName}}</span>
            </div>
            <div class="pei2 pei">
              <img src="../../assets/phone.png" alt />
              <span>{{itemst.supplierPhone}}</span>
            </div>
            <div class="pei3 pei">
              <img src="../../assets/dizi.png" alt />
              <span>{{itemst.address}}</span>
            </div>
            <div class="right ccrid">
              合计2:
              <span style="color: rgba(229, 99, 80, 1)">￥{{itemst.heji2}}</span>
            </div>

            <div class="right ccrid">
              合计1:
              <span style="color: rgba(229, 99, 80, 1)">￥{{itemst.heji1}}</span>
            </div>
            <!-- </div> -->
          </div>

          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="tbbd"
            v-for="(itemc,idxxx) in itemst.askPricePartDOS"
            :key="'itemc'+idxxx"
          >
            <tr>
              <td class="td1">{{idxxx+1}}</td>
              <td class="td2" style="  text-align: left;">
                <div v-if="switchActive == 1" style=" padding-left: 25px;">
                  <span>{{itemc[0].partName}}</span>
                </div>
              </td>
              <td class="td8" v-if="switchActive == 1">
                <div style="cursor: pointer;">
                  <span v-if="itemc[0].modifyCount" style="color: #e56350;">{{itemc[0].partCount}}</span>
                  <span v-else>{{itemc[0].partCount}}</span>
                </div>
              </td>
              <td class="td3">
                <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[0].partType==0">
                  <!-- <img
                    v-if="itemc[0].status == 0 ||itemc[0].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />-->
                  <span v-if="itemc[0].classify">{{itemc[0].classify}}</span>
                  <span v-else>{{itemc[0].price==0 ?'':'原厂件'}}</span>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[1].partType==1">
                  <!-- <img
                    v-if="itemc[1].status == 0 ||itemc[1].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />-->
                  <span v-if="itemc[1].classify">{{itemc[1].classify}}</span>
                  <span v-else>{{itemc[1].price==0 ?'':'品牌件'}}</span>
                </div>
                <div v-if="itemc[2].partType==2">
                  <!-- <img
                    v-if="itemc[2].status == 0 ||itemc[2].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />-->
                  <span v-if="itemc[2].classify">{{itemc[2].classify}}</span>
                  <span v-else>{{itemc[2].price==0 ?'':'其它件'}}</span>
                </div>
                <template v-if="itemc.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="itemc[3].price">
                    <img
                      v-if="itemc[3].status == 0 ||itemc[3].status == 1"
                      class="gou"
                      src="../../assets/gou.png"
                      alt
                    />
                    <span v-if="itemc[3].classify">{{itemc[3].classify}}</span>
                    <span v-else>{{itemc[3].price==0 ?'':'其它件2'}}</span>
                  </div>
                </template>
                <template v-if="itemc.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="itemc[4].price">
                    <!-- <img
                      v-if="itemc[4].status == 0 ||itemc[4].status == 1"
                      class="gou"
                      src="../../assets/gou.png"
                      alt
                    />-->
                    <span v-if="itemc[4].classify">{{itemc[4].classify}}</span>
                    <span v-else>{{itemc[4].price==0 ?'':'其它件3'}}</span>
                  </div>
                </template>
                <template v-if="itemc.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="itemc[5].price">
                    <!-- <img
                      v-if="itemc[5].status == 0 ||itemc[5].status == 1"
                      class="gou"
                      src="../../assets/gou.png"
                      alt
                    />-->
                    <span v-if="itemc[5].classify">{{itemc[5].classify}}</span>
                    <span v-else>{{itemc[5].price==0 ?'':'其它件4'}}</span>
                  </div>
                </template>
              </td>
              <td class="td4">
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                  v-if="itemc[0].partType==0"
                  @click="yijia(itemc[0])"
                >
                  <span
                    v-if="itemc[0].talkStatus ==1"
                    :style="{'color': (itemc[0].talkStatus == 1 ? '#0D906E':'')}"
                  >{{itemc[0].talkPrice ?'￥':''}}{{itemc[0].talkPrice}}</span>
                  <span
                    v-if="itemc[0].talkStatus !=1"
                  >{{itemc[0].price ?'￥':''}}{{itemc[0].price ?itemc[0].price:''}}</span>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[1].partType==1">
                  <span
                    v-if="itemc[1].talkStatus ==1"
                    :style="{'color': (itemc[1].talkStatus == 1 ? '#0D906E':'')}"
                  >{{itemc[1].talkPrice ?'￥':''}}{{itemc[1].talkPrice}}</span>
                  <span
                    v-if="itemc[1].talkStatus !=1"
                  >{{itemc[1].price ?'￥':''}}{{itemc[1].price ?itemc[1].price:''}}</span>
                </div>
                <div v-if="itemc[2]">
                  <span
                    v-if="itemc[2].talkStatus ==1"
                    :style="{'color': (itemc[2].talkStatus == 1 ? '#0D906E':'')}"
                  >{{itemc[2].talkPrice ?'￥':''}}{{itemc[2].talkPrice}}</span>
                  <span
                    v-if="itemc[2].talkStatus !=1"
                  >{{itemc[2].price ?'￥':''}}{{itemc[2].price ?itemc[2].price:''}}</span>
                </div>
                <template v-if="itemc.length > 3">
                  <div v-if="itemc[3].price" style="border-top: 1px solid #dcdfe6;">
                    <span
                      v-if="itemc[3].talkStatus ==1"
                      :style="{'color': (itemc[3].talkStatus == 1 ? '#0D906E':'')}"
                    >{{itemc[3].talkPrice ?'￥':''}}{{itemc[3].talkPrice}}</span>
                    <span
                      v-if="itemc[3].talkStatus !=1"
                    >{{itemc[3].price ?'￥':''}}{{itemc[3].price}}</span>
                  </div>
                </template>
                <template v-if="itemc.length > 3">
                  <div v-if="itemc[4].price" style="border-top: 1px solid #dcdfe6;">
                    <span
                      v-if="itemc[4].talkStatus ==1"
                      :style="{'color': (itemc[4].talkStatus == 1 ? '#0D906E':'')}"
                    >{{itemc[4].talkPrice ?'￥':''}}{{itemc[4].talkPrice}}</span>
                    <span
                      v-if="itemc[4].talkStatus !=1"
                    >{{itemc[4].price ?'￥':''}}{{itemc[4].price}}</span>
                  </div>
                </template>
                <template v-if="itemc.length > 3">
                  <div v-if="itemc[5].price" style="border-top: 1px solid #dcdfe6;">
                    <span
                      v-if="itemc[5].talkStatus ==1"
                      :style="{'color': (itemc[5].talkStatus == 1 ? '#0D906E':'')}"
                    >{{itemc[5].talkPrice ?'￥':''}}{{itemc[5].talkPrice}}</span>
                    <span
                      v-if="itemc[5].talkStatus !=1"
                    >{{itemc[5].price ?'￥':''}}{{itemc[5].price}}</span>
                  </div>
                </template>
              </td>
              <td class="td5">
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{itemc[0].price?itemc[0].arrivalTime:""}}</div>
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{itemc[1].price?itemc[1].arrivalTime:""}}</div>
                <div>{{itemc[2].price?itemc[2].arrivalTime:""}}</div>
                <template v-if="itemc.length > 3">
                  <div
                    v-if="itemc[3].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{itemc[3].price?itemc[3].arrivalTime:""}}</div>
                </template>
                <template v-if="itemc.length > 3">
                  <div
                    v-if="itemc[4].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{itemc[4].price?itemc[4].arrivalTime:""}}</div>
                </template>
                <template v-if="itemc.length > 3">
                  <div
                    v-if="itemc[5].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{itemc[5].price?itemc[5].arrivalTime:""}}</div>
                </template>
              </td>
              <td class="td6">
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{itemc[0].price?itemc[0].qualityTime:""}}</div>
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                >{{itemc[1].price?itemc[1].qualityTime:""}}</div>
                <div>{{itemc[2].price?itemc[2].qualityTime:""}}</div>
                <template v-if="itemc.length > 3">
                  <div
                    v-if="itemc[3].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{itemc[3].price?itemc[3].qualityTime:""}}</div>
                </template>
                <template v-if="itemc.length > 3">
                  <div
                    v-if="itemc[4].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{itemc[4].price?itemc[4].qualityTime:""}}</div>
                </template>
                <template v-if="itemc.length > 3">
                  <div
                    v-if="itemc[5].price"
                    style="border-top: 1px solid #dcdfe6;"
                  >{{itemc[5].price?itemc[5].qualityTime:""}}</div>
                </template>
              </td>
              <td class="td7" :style="{'width':switchActive == 1 ? '17%':''}">
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{itemc[0].remark}}</em>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{itemc[1].remark}}</em>
                </div>
                <div>
                  <em>{{itemc[2].remark}}</em>
                </div>
                <template v-if="itemc.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="itemc[3].price">
                    <em>{{itemc[3].remark}}</em>
                  </div>
                </template>
                <template v-if="itemc.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="itemc[4].price">
                    <em>{{itemc[4].remark}}</em>
                  </div>
                </template>
                <template v-if="itemc.length > 3">
                  <div style="border-top: 1px solid #dcdfe6;" v-if="itemc[5].price">
                    <em>{{itemc[5].remark}}</em>
                  </div>
                </template>
              </td>
            </tr>
          </table>
        </div>
        <!--  -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormStatus = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  querySupplierList,
  getorder,
  handAskInfo,
  AskQueue,
  addPart,
  saveHandAskPart,
  pcaskPriceList,
  askPriceList,
  unAskPriceList
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "enquiry",
  data() {
    return {
      tableData: [],
      orderNavActive: 0,
      orderNavActive2: 0,
      maxHeight: undefined,
      editFormStatus: false,
      centerDialogVisible: false,
      search: {
        garageName: ""
      },
      pageLength: null,
      size: 10,
      page: 0,
      dialogVisible: false,
      src: "",
      addCarForm: {},
      carInfo: {
        type: "1"
      },
      carNoname: "",
      billNumber: "",
      createdDate: "",
      oid: "",
      Noquotation: [], //未报价列表
      dispose: ["配件模式", "商家模式", "未报价"],
      PriceList: [], //商家报价，商家模式
      orderlist: [],
      switchActive: 0,
      ceshi: [],
      piliang: false,
      radio: "1",
      haveAskedCount: "", //待报价数量
      picHaveAskedCount: "", //图片待报价数量
      timeOutAskedCount: "", //超时待报价数量
      textarea: "", //文本
      mark: 0,
      zoom: 100,
      deg: 0,
      shuliang: 0,
      szpeijian: [],
      ListNow: {
        // askPricePicture: [
        //   "http://vehicle-repairs.oss-cn-hangzhou.aliyuncs.com/test/999/1596762431710u%3D3868878563%2C1470362585%26fm%3D26%26gp%3D0.jpg?Expires=1912122431&OSSAccessKeyId=LTAI4FhBMt2eaMxuMMSCECEm&Signature=m4tTx8L8oPfoe1u1U%2FEcfvHIHDs%3D",
        //   "http://vehicle-repairs.oss-cn-hangzhou.aliyuncs.com/test/999/1596762425090%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200703173314.jpg?Expires=1912122425&OSSAccessKeyId=LTAI4FhBMt2eaMxuMMSCECEm&Signature=9OEepzFo2FvD4EkJNyJ15hoeSyA%3D"
        // ]
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
  },
  methods: {
    // 自动接单
    ZDjiedan() {
      this.textarea = "";
      this.szpeijian = [];
      handAskInfo().then(res => {
        if (res.data.code == 200) {
          console.log(res.data);
          this.ListNow = res.data.data;
          this.piliang = true;
        }
      });
      // this.piliang = true;
    },
    //添加配件
    tijiaopeijian() {
      var _this = this;
      var shul = this.szpeijian.length;
      console.log(shul - 1);
      if (this.szpeijian.length == 0) {
        return this.$message({ message: "请先输入配件", type: "error" });
      }
      for (const i in this.szpeijian) {
        addPart(this.szpeijian[i]).then(e => {
          if (e.data.code == 200) {
            let dot = {
              askPriceId: this.ListNow.askPriceIdList,
              askPricePartDTO: {
                gid: this.ListNow.gid,
                partId: e.data.data.id,
                price: 0,
                partName: e.data.data.partName,
                partCount: 1
              },
              oid: this.ListNow.oid
            };
            if (i == shul - 1) {
            }
            saveHandAskPart(dot).then(res => {
              if (i == shul - 1) {
                this.shuliang = res.data.data;
                this.init();
                this.centerDialogVisible = true;
              }
            });
          }
        });
      }
    },
    //处理下一单
    xiayidian() {
      this.textarea = "";
      this.szpeijian = [];
      handAskInfo().then(res => {
        if (res.data.code == 200) {
          console.log(res.data);
          this.ListNow = res.data.data;
          this.piliang = true;
        }
      });
      this.centerDialogVisible = false;
    },
    //退出
    tuichu() {
      this.textarea = "";
      this.szpeijian = [];
      this.centerDialogVisible = false;
      this.piliang = false;
    },
    init() {
      const data = {
        garageName: this.search.garageName,
        size: this.size,
        page: this.page,
        status: this.orderNavActive2,
        type: this.orderNavActive
      };
      getorder(data).then(res => {
        console.log(res.data.data);
        if (this.orderNavActive2 == "0" && this.orderNavActive == "0") {
          this.haveAskedCount = res.data.data.haveAskedCount;
          this.picHaveAskedCount = res.data.data.picHaveAskedCount;
          this.timeOutAskedCount = res.data.data.timeOutAskedCount;
        }
        const result = res.data.data;
        if (result.page != null) {
          //   res.data.data.forEach(v => {

          //   });
          result.page.content.forEach((item, index) => {
            item.index = index + 1 + this.page * 10;
            if (item.createdDate) {
              item.createdDate = item.createdDate.substr(-14);
            }
            if (item.orderDate) {
              item.orderDate = item.createdDate.substr(-14);
            }
          });
          if (this.orderNavActive == 2) {
            result.page.content[result.page.content.length - 1].index = "合计:";
          }
          this.pageLength = result.page.totalElements;
          this.tableData = result.page.content;
        } else {
          this.tableData = [];
          this.pageLength = null;
        }
        // console.log(res.data.data);
      });
    },

    //关闭自动接单
    closeDialog() {
      // console.log('123')
      let data = {
        oid: this.ListNow.oid
      };
      AskQueue(data).then(res => {
        if (res.data.code == 200) {
          console.log(res.data);
        }
      });
      this.piliang = false
    },
    nextPage(page) {
      this.page = page - 1;
      this.init();
    },
    orderTab(index) {
      this.orderNavActive = index;
      this.orderNavActive2 = 0;
      this.page = 0;
      this.init();
    },
    orderTab2(index) {
      this.orderNavActive2 = index;
      this.page = 0;
      this.init();
    },
    viewPhoto(url) {
      this.src = url;
      this.dialogVisible = true;
    },

    //图片订单

    //切换图片
    start: function(e) {
      //鼠标左键点击
      if (e.button == 0) {
        this.canDrag = true;
        //记录鼠标指针位置
        this.x0 = e.clientX;
        this.y0 = e.clientY;
      }
    },
    stop: function(e) {
      this.canDrag = false;
    },

    //翻转
    fan() {
      this.deg -= 90;
      if (this.deg >= 360) {
        this.deg = 0;
      }
    },
    zheng() {
      this.deg += 90;
      if (this.deg >= 360) {
        this.deg = 0;
      }
    },

    // 缩放图片
    rollImg() {
      this.zoom += event.wheelDelta / 12;
      return false;
    },
    move(e) {
      let odiv = e.target; //获取目标元素
      console.log(e.target.style);
      //阻止默认事件的方法,如果不阻止默认事件onmouseup会无法触发
      e.preventDefault();
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        // console.log("移动")
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        //因为img居中对齐，所以还要减去目标元素距离body的偏移量
        let left = e.clientX - disX - odiv.offsetLeft;
        let top = e.clientY - disY;
        //移动当前元素
        odiv.style.marginLeft = left + "px";
        odiv.style.marginTop = top + "px";
      };
      document.onmouseup = e => {
        // console.log("停止")
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },

    //解析配件
    jiexi(row) {
      var _this = this;
      var peijian = this.textarea.trim().split(/\s+/);
      var gid = this.ListNow.gid;
      console.log(gid);
      var pj = [];
      if (row != 2) {
        if (peijian == "") {
          return this.$message({ message: "请先输入配件", type: "error" });
        }
      } else {
        if (peijian == "") {
          return;
        }
      }

      peijian.forEach(function(v, index) {
        pj.push({
          partName: v,
          gid: gid,
          isFactioryPartName: 1,
          sellPrice: 0,
          total: 1
        });
      });
      this.szpeijian = pj;
    },
    autoPlay() {
      if (this.mark < this.ListNow.picList.length - 1) {
        // console.log('123')
        this.mark++;
      }
    },

    //查看商家报价
    editRow(row) {
      this.orderlist = [];
      this.ceshi = [];
      this.switchActive = 0;
      this.carNoname = row.carNo;
      this.billNumber = row.billNumber;
      this.createdDate = row.createdDate;
      this.oid = row.oid;
      var _this = this;
      let listArr = [];
      pcaskPriceList({
        oid: this.oid
      }).then(res => {
        this.PriceList = res.data.data;
        var result = [];
        this.PriceList.map((v, i) => {
          v.askPricePartDOS.map((c, i) => {
            c.map((d, i) => {
              this.$set(d, "number", 0);
              if (d.supplierId == d.supplierId) {
                this.$set(d, "checked", false);
                result.push(d);
              }
              if (d.status == 0 || d.status == 1) {
                if (v.partName == d.partName) {
                  this.$set(v, "status2", 0);
                  // d.status = 0
                }
              }
            });
          });
        });
      });
      this.editFormStatus = true;
    },
    editRow2() {
      this.askPriceId = "";
      var _this = this;
      let listArr = [];
      this.orderlist = [];
      if (this.switchActive == 0) {
        pcaskPriceList({
          oid: this.oid
        }).then(res => {
          this.PriceList = res.data.data;
          // console.log(res.data.data);
          var result = [];
          this.PriceList.map((v, i) => {
            v.askPricePartDOS.map((c, i) => {
              c.map((d, i) => {
                this.$set(d, "number", 0);
                if (d.supplierId == d.supplierId) {
                  this.$set(d, "checked", false);
                  result.push(d);
                }
                if (d.status == 0 || d.status == 1) {
                  if (v.partName == d.partName) {
                    this.$set(v, "status2", 0);
                    // d.status = 0
                  }
                }
              });
            });
          });
        });
      } else if (this.switchActive == 1) {
        this.shangjia();
      } else if (this.switchActive == 2) {
        unAskPriceList({
          oid: this.oid
        }).then(res => {
          this.Noquotation = res.data.data;
          // console.log(res.data.data);
          this.Noquotation.forEach(function(el, index) {
            var arr;
            if (el.askPart) {
              arr = el.askPart.split("|");
              var sl = arr.length - 1;
              _this.$set(el, "askPart2", arr[0]);
              _this.$set(el, "sl", sl);
            } else {
              _this.$set(el, "sl", "手写单询价");
            }
          });
        });
      }
    },
    //点击切换退还货
    switchOF(i) {
      this.orderlist = [];
      var _this = this;
      this.switchActive = i;
      if (this.switchActive == 0) {
        this.orderlist = []; //生成订货单修改
        pcaskPriceList({
          oid: this.oid
        }).then(res => {
          this.PriceList = res.data.data;
          var result = [];
          this.PriceList.map((v, i) => {
            v.askPricePartDOS.map((c, i) => {
              c.map((d, i) => {
                this.$set(d, "number", 0);
                if (d.supplierId == d.supplierId) {
                  this.$set(d, "checked", false);
                  result.push(d);
                }
                if (d.status == 0 || d.status == 1) {
                  if (v.partName == d.partName) {
                    this.$set(v, "status2", 0);
                  }
                }
              });
            });
          });
        });
        this.showlist = true;
      } else if (this.switchActive == 1) {
        this.shangjia();
        this.showlist = false;
      } else if (this.switchActive == 2) {
        unAskPriceList({
          oid: this.oid
        }).then(res => {
          this.Noquotation = res.data.data;
          this.Noquotation.forEach(function(el, index) {
            var arr;
            if (el.askPart) {
              arr = el.askPart.split("|");
              var sl = arr.length - 1;
              _this.$set(el, "askPart2", arr[0]);
              _this.$set(el, "sl", sl);
            } else {
              _this.$set(el, "sl", "手写单询价");
            }
          });
        });
      }
    },
    //商家模式

    shangjia() {
      var _this = this;
      this.ceshi = [];
      var les = "";
      askPriceList({
        oid: this.oid
      }).then(res => {
        let listArr = [];
        res.data.data.map((v, i) => {
          var data = v.askPricePartDOList;
          if (data.length) {
            les = data.length;
          }
          data.map(function(el, index) {
            var nes = false;
            if (el.status == 0 || el.status == 1) {
              if (el.partName == v.partName) {
                _this.$set(v, "status2", v.partName);
              }
            }
            for (var i = 0; i < listArr.length; i++) {
              if (listArr[i].supplierName == el.supplierName) {
                listArr[i].askPricePartDOS.push(el);
                return;
              }
            }
            // 第一次对比没有参照，放入参照
            listArr.push({
              supplierName: el.supplierName,
              supplierPhone: el.supplierPhone,
              address: el.address,
              askPriceTime: el.askPriceTime,
              billNumber: el.billNumber,
              carNo: el.carNo,
              partId: el.partId,
              partName: el.partName,
              partTotalCount: el.partTotalCount,
              unPricedCount: el.unPricedCount,

              askPricePartDOS: [el]
            });
          });
        });
        var ceshi = [];
        var shangjia_lis = [];
        listArr.map((el, i) => {
          var res = el.askPricePartDOS;
          ceshi.push({
            heji3: 0,
            heji1: 0,
            heji2: 0,
            supplierName: el.supplierName,
            supplierPhone: el.supplierPhone,
            address: el.address,
            askPriceTime: el.askPriceTime,
            billNumber: el.billNumber,
            carNo: el.carNo,
            partId: el.partId,
            partName: el.partName,
            partTotalCount: el.partTotalCount,
            unPricedCount: el.unPricedCount,
            askPricePartDOS: []
          });
          var cddd = [];
          if (les == 3) {
            les = 3;
          } else if (les > 3) {
            les = 6;
          }
          for (var i = 0; i < el.askPricePartDOS.length; i += les) {
            cddd.push(el.askPricePartDOS.slice(i, i + les));
          }
          shangjia_lis.push(cddd);
        });
        shangjia_lis.forEach(function(v, index) {
          v.map((j, i) => {
            _this.$set(j, "number2", 1);
            for (var i = 0; i < ceshi.length; i++) {
              if (ceshi[i].supplierName == j[0].supplierName) {
                ceshi[i].askPricePartDOS.push(j);
              }
            }
          });
        });
        ceshi.forEach(function(v, index) {
          v.askPricePartDOS.forEach(function(j, index) {
            if (v.supplierName == j[0].supplierName) {
              v.heji1 += j[0].price;
              v.heji2 += j[1].price;
            }
            j.forEach(function(d, index) {
              res.data.data.forEach(function(f, index) {
                if (d.partName == f.status2) {
                  d.status2 = 0;
                }
              });
            });
          });
        });
        this.ceshi = ceshi;
        var result = [];
      });
    },
    Playjian() {
      if (this.mark != 0) {
        this.mark--;
      }
    }
  }
};
</script>
<style scoped>
/* 商家报价 */
.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}
.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
.orderUl li {
  float: left;
  padding: 0px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}
.orlist div {
  display: inline-block;
}

.orlist div:nth-child(2) {
  margin-left: 20px;
}

.orlist div:nth-child(3) {
  margin-left: 20px;
}
.shaimg {
  width: 20px;
  height: 20px;
  /* right: ; */
  cursor: pointer;
  margin-right: 8px;
  margin-top: 1px;
}
.xuhao {
  /* margin-top: 10px; */
  overflow: hidden;
  width: 100%;
  line-height: 40px;
  height: 40px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
}
.xuhao div {
  display: inline-block;
}
.xuhao .xu1 {
  width: 5%;
}

.xuhao .xu2 {
  width: 15%;
}

.xuhao .xu3 {
  width: 10%;
}

.xuhao .xu4 {
  width: 10%;
}

.xuhao .xu5 {
  width: 15%;
}

.xuhao .xu6 {
  width: 15%;
}

.xuhao .xu7 {
  width: 20%;
}

.xuhao .xu8 {
  width: 10%;
}
.huadong {
  /* height: 350px; */
  overflow-y: auto;
}
.xuhao2 {
  overflow: hidden;
  margin-top: 10px;
  width: 100%;
  line-height: 45px;
  height: 45px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
  border-bottom: none;
}
.tbcd table:nth-child(n + 1) {
  border-top: none;
}
table {
  width: 100%;
  border: 1px solid #dcdfe6;
}
.pei {
  margin-top: 5px;
  display: inline-block;
}
.pei1 {
  margin-left: 15px;
}

.pei2 {
  width: 155px;
}

.pei3 {
  margin-left: 100px;
}

.pei img {
  width: 22px;
  height: 22px;
}
.ccrid {
  margin-right: 20px;
}
.tbbd tr td div {
  height: 30px;
  line-height: 30px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tbbd tr td {
  text-align: center;
}
tr .td1 {
  width: 5%;
}
tr .td2 {
  /* width: 15%; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}

tr .td2 div {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

tr .td3 {
  width: 10%;
  border-right: 1px solid #dcdfe6;
}

tr .td4 {
  width: 10%;
  border-right: 1px solid #dcdfe6;
  color: rgba(229, 99, 80, 1);
}

tr .td5 {
  width: 15%;
  border-right: 1px solid #dcdfe6;
}

tr .td6 {
  width: 15%;
  border-right: 1px solid #dcdfe6;
}
.pj {
  margin-left: 10px;
  display: inline-block;
}
.yipic {
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
}
.sl {
  display: inline-block;
}
.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}
.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
.orderUl li {
  float: left;
  padding: 0px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}

tr .td7 {
  width: 25%;
  border-right: 1px solid #dcdfe6;
}

tr .td8 {
  width: 10%;
  border-right: 1px solid #dcdfe6;
}

tr .td9 {
  width: 3%;
}
.gou {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 8px;
}
.bodeee {
  border-top: 1px solid #dcdfe6;
}

.bodeee:nth-child(1) {
  border-top: none;
}
.el-checkbox {
  height: 35px;
  display: block;
  line-height: 35px;
  margin-right: 0px;
}
.tbbd tr td img {
  margin-left: 5px;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.huadong {
  max-height: 400px;
  overflow-y: auto;
}
/* 商家报价 */
.tianjia {
  height: 45px;
  line-height: 45px;
  text-align: center;
}
.duiliueshu {
  text-align: center;
  font-size: 16px;
}
.ticd {
  color: cornflowerblue;
}
.suoding {
  color: red;
  /* position: absolute; */
  display: inline-block;
  /* top: 60px; */
  /* left: 50%; */
  width: 280px;
  /* margin-left: -140px; */
  font-size: 13px;
}
.dingdan_ls {
  padding: 0 25px 5px 25px;
  border-bottom: 1px solid #dcdfe6;
}
.pilian {
  height: 100%;
  width: 49%;
  height: 500px;
  overflow: hidden;
  padding-bottom: 10px;
}
.ptup {
  position: absolute;
  top: 60px;
  left: 0;
  margin-left: 5px;
}
.previewP_main {
  text-align: center;
}
.previewP_main img {
  position: relative;
}
.imgd {
  height: 520px;
}
.fan {
  width: 30px;
  height: 30px;
}
.flllts {
  line-height: 15px;
  font-size: 12px;
  color: #f56c6c;
}
.dll {
  margin-top: 10px;
}
.flll {
  float: left;
}
.frrr {
  float: right;
}
.ddv {
  border: 1px solid #666;
  border-top: none;
  border-left: none;
}
.jx {
  margin-right: 25px;
}
.deng {
  border: 1px solid #666;

  margin-top: 5px;
  min-height: 250px;
}
.cs {
  /* //   margin-left: 3px; */
  line-height: 25px;
  min-height: 25px;
}

.zidong {
  padding: 4px 14px;
  cursor: pointer;
  color: #fff;
  background: #f56c6c;
  border-radius: 5px;
}
.orderUl li {
  float: left;
  padding: 4px 18px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}
.orderUl2 li {
  float: left;
  padding: 4px 18px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  /* transition: .5s; */
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
.orderUl2 li.active {
  /* background: #3AC29F; */
  border-bottom: 2px solid #3ac29f;
  /* color: #fff; */
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
</style>



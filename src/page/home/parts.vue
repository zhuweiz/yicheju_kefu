<template>
	<div class="w-100 orderTable" style="padding-left: 30px;">
		<div class="p-tb-30">
			<!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;">| 服务记录列表</h2> -->
			<ul class="left orderUl" style="width: 400px;padding-top: 5px;">
				<li :class="orderNavActive == 0?'active':''" @click="orderTab(0)">待审核</li>
				<li :class="orderNavActive == 1?'active':''" @click="orderTab(1)">审核通过</li>
				<li :class="orderNavActive == 2?'active':''" @click="orderTab(2)">审核未通过</li>
			</ul>
			 <div class="right m-r-20">
			</div> 
			<div class="clear"></div>
		</div>
		<div class="p-20" style="background:rgba(229,246,247,1);">
			<el-row :gutter="10">
				<el-form :inline="true" class="demo-form-inline">
					<el-col>
						<el-form-item label="配件商名称" class="m-b-0">
							<el-input v-model="search.name" placeholder="请输入配件商名称" style="width: 160px;"></el-input>
						</el-form-item>
						<el-button type="success" icon="el-icon-search" @click="init">查找</el-button>
					</el-col>
				</el-form>
			</el-row>
		</div>
		<el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
			<el-table-column prop="date" label="编号" width="80">
				<template slot-scope="scope">
					{{scope.row.id}}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="配件商名称">
				<template slot-scope="scope">
					{{scope.row.companyName}}
				</template>
			</el-table-column>
			<el-table-column  label="所在城市">
				<template slot-scope="scope">
					{{scope.row.city}}
				</template>
			</el-table-column>
			<el-table-column  label="地址">
				<template slot-scope="scope">
					{{scope.row.address}}
				</template>
			</el-table-column>
			<el-table-column label="法人姓名">
				<template slot-scope="scope">
					{{scope.row.legalPerson}}
				</template>
			</el-table-column>
			<el-table-column  label="手机号码">
				<template slot-scope="scope">
					{{scope.row.phone}}
				</template>
			</el-table-column>
      <el-table-column  label="经营范围">
				<template slot-scope="scope">
					{{scope.row.businessScope}}
				</template>
			</el-table-column>
			<el-table-column  label="营业执照照片">
				<template slot-scope="scope">
					<el-image
						style="width: 100px; height: 100px"
						:src="scope.row.businessLicensePic"
						fit="fill"
						@click="viewPhoto(scope.row.businessLicensePic)"
						></el-image>
				</template>
			</el-table-column>
			<el-table-column  label="申请时间">
				<template slot-scope="scope">
					{{scope.row.createdDate}}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center" v-if="orderNavActive == 0">
				<template slot-scope="scope">
					<el-button type="success" size="mini" @click="agreeApply(scope.row)">同意</el-button>
					<el-button type="danger" size="mini" @click="refuseApply(scope.row)">拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column label="帐号密码" width="180" align="center" v-if="orderNavActive == 1">
				<template slot-scope="scope">
					<el-button type="danger" size="mini" @click="sesetPassword(scope.row)">重置</el-button>
				</template>
			</el-table-column>
			<el-table-column label="拒绝原因" width="180" align="center" v-if="orderNavActive == 2">
				<template slot-scope="scope">
					{{scope.row.rejectReason}}
				</template>
			</el-table-column>
      <el-table-column label="类型" v-if="orderNavActive == 1">
				<template slot-scope="scope">
					{{scope.row.type === 1 ? '通用' : '专用'}}
				</template>
			</el-table-column>
      <!-- <el-table-column label="经营车型" v-if="orderNavActive == 1">
				<template slot-scope="scope">
					{{scope.row.type}}
				</template>
			</el-table-column> -->
      <el-table-column label="配型" v-if="orderNavActive == 1">
				<template slot-scope="scope">
					<el-button type="success" size="mini" @click="carDialog(scope.row)">配型</el-button>
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
			>
			</el-pagination>
		</div>

		<el-dialog
			title="图片查看"
			center
			:visible.sync="dialogVisible"
			:modal="false"
			width="50%">
			<div style="text-align:center;"><el-image :src="src"></el-image></div>
			<span slot="footer" class="dialog-footer">
				<el-button type="success" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>

    <el-dialog title="经营配型" :visible.sync="carVisible" center :modal="false">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-col :span="24">经营范围：{{addCarForm.businessScope}}</el-col>
          <el-col :span="24" class="p-20">
            <el-radio v-model="addCarForm.type" :label="1">通用配件供应商</el-radio>
            <el-radio v-model="addCarForm.type" :label="2">专用配件供应商</el-radio>
          </el-col>
          <el-col :span="24" class="p-20" style="position:relative;">
            经营车型：
            <el-table :data="addCarForm.brandList" :max-height="maxHeight" style="width: 100%">
              <el-table-column prop="name" label="品牌">
                <template slot-scope="scope">
                  {{scope.row.brandName}}
                </template>
              </el-table-column>
              <el-table-column  label="车型">
                <template slot-scope="scope">
                  {{scope.row.standard}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <a href="javascript:;" style="color:#0D906E;" @click="removeSub(scope.row, scope.$index)">删除</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="overlay" v-show="addCarForm.type === 1"></div>
          </el-col>
        </el-col>

        <el-col :span="12" style="position:relative;">
          <el-form :inline="true" class="demo-form-inline">
            <el-col>
              <el-input v-model="seriesOrBrand" placeholder="请输入汽车品牌或型号" style="width: 250px;"></el-input>
              <el-button type="success" icon="el-icon-search" @click="searchBrand">搜索</el-button>
            </el-col>
            <el-col style="margin-top:10px;">
              <label>品牌：</label>
              <div class="letter">
                <a href="javascript:;" v-for="(item, index) in letter" :key="index" :class="{ active: index ==  letterIndex}" @click="selectLetter(item, index)">{{item}}</a>
              </div>
            </el-col>
          </el-form>

          <el-col :span="12" style="padding:0;">
            <el-table :data="brandList" :max-height="350" :show-header="false" style="width: 100%"  highlight-current-row @current-change="selectBrand">
              <el-table-column prop="name" label="品牌">
                <template slot-scope="scope">
                  <el-image :src="scope.row.ppinpaiLogoUrl" style="width: 50px; height: 50px;display: inline-block;vertical-align: middle;"></el-image>
                  <span style="display: inline-block;vertical-align: middle;">{{scope.row.ppinpai}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" style="padding:0;">
            <el-table :data="modelList" :max-height="350" :show-header="false" style="width: 100%" :row-style="{height:'75px'}">
              <el-table-column prop="name" label="型号">
                <template slot-scope="scope">
                  {{scope.row.seriesName}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <a href="javascript:;" style="color:#0D906E;" @click="addModel(scope.row)">添加</a>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <div class="overlay" v-show="addCarForm.type === 1"></div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="carVisible = false">取 消</el-button>
        <el-button type="success" @click="addCarSubmit">提 交</el-button>
      </div>
    </el-dialog>
	</div>

</template>

<script>
	import { querySupplierList, supplierAudit, resetPassword, getbrandList, carSeriesFindList, findCarDataList, supplierUpdate, supplierResetPassword } from "../../request/api.js"
	import moment from "moment"
	export default {
		name: "order",
		data() {
			return {
				seriesOrBrand: '',
        letterIndex: '',
				tableData: [],
				orderNavActive: 0,
				maxHeight: undefined,
				search: {
					name:""
				},
				pageLength: null,
				size: 10,
				page: 0,
				dialogVisible: false,
				src: '',
        carVisible: false,
        addCarForm: {},
        letter: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        carInfo: {
          type: '1'
        },
        brandList: [],
				modelList: [],
				searchInfo: {}
			}
		},
		created() {
			this.init()
		},
		mounted() {
			this.maxHeight = $(".tabBox").height() - 230
		},
		methods: {
			init() {
				const data = {
					size: this.size,
					page: this.page,
					status: this.orderNavActive,
					supplierName: this.search.name
				}
				querySupplierList(data).then(res => {
					const result = res.data
					this.pageLength = result.data.totalElements
					this.tableData = result.data.content
				})
			},
			nextPage(page) {
				this.page = page - 1
				this.init()
			},
			orderTab(index) {
				this.orderNavActive = index
				this.page = 0
				this.init()
			},
			viewPhoto(url) {
				this.src = url
				this.dialogVisible = true
			},
			agreeApply(row) {
				this.$confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					let data = JSON.parse(JSON.stringify(row))
					data.status = 1
					data.supplierId = data.id
					supplierAudit(data).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '审核成功'
							})
							this.init()
						}else{
							this.$message({
								type: 'error',
								message: result.message
							})
						}
					})
          
        }).catch(() => {})
			},
			refuseApply(row) {
				this.$prompt('审核未通过原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
					let data = JSON.parse(JSON.stringify(row))
					data.status = 2
					data.rejectReason = value
					data.supplierId = data.id
					supplierAudit(data).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '审核成功'
							})
							this.init()
						}else{
							this.$message({
								type: 'error',
								message: result.message
							})
						}
					})
        }).catch(() => {})
			},
			sesetPassword(row) {
				this.$confirm('确认重置密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					supplierResetPassword({supplierId: row.id}).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '重置密码成功'
							})
							this.init()
						}else{
							this.$message({
								type: 'error',
								message: result.message
							})
						}
					})
        }).catch(() => {})
			},
      carDialog(row) {
        this.carVisible = true
				this.addCarForm = JSON.parse(JSON.stringify(row))
				this.addCarForm.type = row.type ? row.type : 1
        this.selectLetter('A', 0)
      },
      selectLetter(item, index){
        this.letterIndex = index
        getbrandList({firstLetter: item}).then(res => { 
					this.brandList = res.data.data
					this.selectBrand(this.brandList[0])
        })
      },
			searchBrand() {
				findCarDataList({seriesOrBrand: this.seriesOrBrand}).then(res => {
					this.brandList = res.data.data.map(v => {
						return {
							id: v.brandId,
							ppinpaiId: v.brandId,
							ppinpai: v.brandName,
							ppinpaiLogoUrl: v.brandLogoUrl,
							...v
						}
					})
					this.searchInfo = {
						brandId: this.brandList[0].brandId,
						brandName: this.brandList[0].brandName
					}
					this.modelList = this.brandList[0].carSeriesInfoList
				})
			},
			selectBrand(row){
				carSeriesFindList({brandId: row.ppinpaiId}).then(res => {
					this.modelList = res.data.data
				})
			},
      addModel(row) {
				const check = this.addCarForm.brandList.find(v => v.standard === row.seriesName)
				//if(check) return this.$message({message: `车型${row.seriesName}已存在`, type: "error"})
				this.addCarForm.brandList.push({
					brandId: row.brandId ? row.brandId : this.searchInfo.brandId,
					brandName: row.brandName ? row.brandName : this.searchInfo.brandName,
					standard: row.seriesName
				})
      },
			removeSub(row, index) {
				this.$confirm(`确认删除车型${row.standard}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.addCarForm.brandList.splice(index, 1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					})
				}).catch(() => console.log('已取消'))
			},
      addCarSubmit() {
				supplierUpdate(this.addCarForm).then(res => {
					if(res.data.code == 200){
						this.$message({
							type: 'success',
							message: '配型成功'
						})
						this.carVisible = false
						this.init()
					}
				})
      }
		}
	}
</script>
<style scoped>

	.orderUl li {
		float: left;
		padding: 4px 18px;
		border-radius: 5px;
		cursor: pointer;
		margin-left: 10px;
		transition: .5s;
		font-size: 16px;
	}
	
	.orderUl li:hover {
		background: rgba(0, 0, 0, 0.1);
		transition: .5s;
	}
	
	.orderUl li.active {
		background: #3AC29F;
		color: #fff;
	}
  .letter a{
    color: #3B5998;
    border: 1px solid #eee;
    margin: 3px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-weight: bold;
    display: inline-block;
  }
  .letter a:hover, .letter a.active{
    background: #3B5998;
    color: #fff;
  }
  .overlay {
    position: absolute;
    z-index: 2000;
    background-color: hsla(0,0%,100%,.9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
  }
</style>



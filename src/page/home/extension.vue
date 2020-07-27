<template>
	<div class="w-100 orderTable" style="padding-left: 30px;">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="p-tb-30">
          <!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;">| 服务记录列表</h2> -->
          <ul class="left orderUl" style="width: 400px;padding-top: 5px;">
            <li :class="orderNavActive == 0?'active':''" @click="orderTab(0, 1)">上架</li>
            <li :class="orderNavActive == 1?'active':''" @click="orderTab(1, 2)">下架</li>
          </ul>
          <div class="right m-r-20">
            <el-button type="success" @click="createExt">+创建推广券</el-button>
          </div> 
          <div class="clear"></div>
        </div>
        <el-table :data="tableData" :max-height="maxHeight" highlight-current-row @current-change="selectExt" style="width: 100%">
          <el-table-column prop="date" label="编号" width="80">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="活动名称" align="center">
            <template slot-scope="scope">
              {{scope.row.activityName}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="项目名称" align="center">
            <template slot-scope="scope">
              {{scope.row.itemName}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="兑换积分数" align="center">
            <template slot-scope="scope">
              {{scope.row.point}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="活动说明" align="center">
            <template slot-scope="scope">
              {{scope.row.activityRemark}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="已办理数" align="center">
            <template slot-scope="scope">
              <div style="cursor: pointer;" @click="changRoute(scope.row)">
                {{scope.row.count}}
                <font color="#0D906E">详情</font>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="状态" align="center">
            <template slot-scope="scope">
              {{scope.row.status == 1 ? '上架' : '下架'}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="创建时间" align="center">
            <template slot-scope="scope">
              {{scope.row.createdDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="start" align="middle">
                <el-col v-if="scope.row.status == 1">
                  <div style="cursor: pointer;" @click="offlineExt(scope.row, 2)">
                    <font color="#0D906E">下架</font>
                  </div>
                </el-col>
                <el-col v-if="scope.row.status == 2">
                  <div style="cursor: pointer;" @click="offlineExt(scope.row, 1)">
                    <font color="#0D906E">上架</font>
                  </div>
                </el-col>
                <el-col>
                  <div style="cursor: pointer;" @click="deleteExt(scope.row)">
                    <font color="#0D906E">删除</font>
                  </div>
                </el-col>
              </el-row>
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
      </el-col>

      <el-col :span="8">
        <div class="p-tb-30">
          <!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;">| 服务记录列表</h2> -->
          <ul class="left orderUl" style="width: 400px;padding-top: 5px;">
            <li>活动名称：{{selectExtForm.activityName}}</li>
          </ul>
          <div class="right m-r-20">
            <el-button type="success" @click="add_parts">+商品</el-button>
          </div> 
          <div class="clear"></div>
        </div>
        <el-table :data="tableData2" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="编号" width="80">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="品名" align="center">
            <template slot-scope="scope">
              {{scope.row.partName}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="规格型号" align="center">
            <template slot-scope="scope">
              {{scope.row.partModel}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90" align="center">
            <template slot-scope="scope">
              <div style="cursor: pointer;" @click="deleteShop(scope.row)">
                <img src="../../../static/img/delete.png" alt="" width="25">
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" center :modal="false" width="30%">
      <el-form :model="form">
        <el-form-item label="活动名称" label-width="100px">
          <el-input v-model="form.activityName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" label-width="100px">
          <el-input v-model="form.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="兑换积分" label-width="100px">
          <el-input v-model="form.point" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动说明" label-width="100px">
          <el-input type="textarea" :rows="3" v-model="form.activityRemark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click="addExtSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="商品库" :visible.sync="dialogShopVisible" center :modal="false"  width="40%">
      <el-table :data="shopData" @selection-change="selectShop">
        <el-table-column label="品名">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="编码">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogShopVisible = false">取 消</el-button>
        <el-button type="success" @click="addShopSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <div class="addProject">
				<el-dialog
					title="添加配件"
					:visible.sync="visible.addPartsVisible"
					width="30%"
					center
					:modal="false"
					:show-close="false"
					>
					<div style="width:100%;">
						<div class="lines">
							<el-input v-model="partSearch"  prefix-icon="el-icon-search" placeholder="请输入配件" style="width:78%;"></el-input>
							<el-button type="danger" style="margin-left:10px;" @click="createParts">创建配件</el-button>
						</div>
						<div class="lines">
						<el-table
							ref="partTable"
							:data="partList"
							tooltip-effect="dark"
							:show-header="false"
							style="width: 100%"
							max-height="250"
							@selection-change="selectPart"
							>
							<el-table-column
								label="">
								<template slot-scope="scope">{{ scope.row.partName }}</template>
							</el-table-column>
							<el-table-column
								prop="sellPrice"
								label="">
							</el-table-column>
							<el-table-column
								type="selection"
								width="50">
							</el-table-column>
						</el-table>
						</div>

						<div class="lines">
							<h2>已选配件：{{selectPartList.length}}个</h2>
							<el-table
								:data="selectPartList"
								tooltip-effect="dark"
								:show-header="false"
								style="width: 100%"
								max-height="250"
								>
								<el-table-column
									label="">
									<template slot-scope="scope">{{ scope.row.partName }}</template>
								</el-table-column>
								<el-table-column
									label="操作"
									width="50">
									<template slot-scope="scope">
										<el-button
											@click.native.prevent="deleteRows(scope.$index, scope.row)"
											type="text"
											size="small">
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>

					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="danger" @click="visible.addPartsVisible = false">取 消</el-button>
						<el-button type="success" @click="addPartsSubmit">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<el-dialog title="创建新配件" :visible.sync="visible.createPartsVisible" center width="30%" :modal="false">
				<el-form :model="createPartsForm">
					<el-form-item label="配件名称" label-width="100px">
						<el-input v-model="createPartsForm.partName"></el-input>
					</el-form-item>
					<el-form-item label="配件价格" label-width="100px">
						<el-input v-model.number="createPartsForm.sellPrice"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.createPartsVisible = false">取 消</el-button>
					<el-button type="success" @click="createPartsSubmit">提 交</el-button>
				</div>
			</el-dialog>
	</div>

</template>

<script>
  import { getActivityList, createActivity, deleteActivity, updateActivityStatus, getActivityPartDetail, addActivityPart, deleteActivityPart, getPart, addPart} from "../../request/api.js"

  const unique = function(arr, name) {
    let hash = {}
    return arr.reduce( function ( item, next ) {
      hash[next[name]] ? '' : hash[next[name]] = true && item.push( next )
      return item
    }, [] )
  }
	export default {
		name: "order",
		data() {
			return {
        visible: {
          addPartsVisible: false,
				  createPartsVisible: false,
        },
        partSearch: '',
        partList: [],
        partLists: [],
        selectPartList: [],
        selected1: [],
        title: '添加推广券',
        form: {},
        createPartsForm: {},
        selectPartItemId: '',
        dialogFormVisible: false,
        dialogShopVisible: false,
        orderNavActive: 0,
        tableData: [],
        tableData2: [],
        shopData: [],
        selectedShop: [],
        maxHeight: undefined,
        pageLength: null,
				size: 10,
        page: 0,
        status: 1,
        selectExtForm: {}
			}
		},
		created() {
      this.init()
		},
		mounted() {
			this.maxHeight = $(".tabBox").height() - 230
		},
    watch: {
      'partSearch': function(){
        this.partList = this.partLists.filter(data => !this.partSearch || data.partName.toLowerCase().includes(this.partSearch.toLowerCase()))
        this.autoSelects(this.selectPartList)
      }
    },
		methods: {
			init() {
				const data = {
					size: this.size,
					page: this.page,
          type: 2,
          status: this.status
				}
				getActivityList(data).then(res => {
          const result = res.data
					this.pageLength = result.data.totalElements
          this.tableData = result.data
          this.selectExt(this.tableData[0])
				})
			},
			nextPage(page) {
        this.page = page - 1
        this.init()
			},
      orderTab(index, status) {
        this.orderNavActive = index
        this.status = status
				this.page = 0
				this.init()
			},
      changRoute(row){
        localStorage.setItem('activity_name', row.activityName)
        this.$router.push({
					path: `../home/extInfo/${row.id}`
				})
      },
      addExtSubmit(){
        createActivity(this.form).then(e => {
          if(e.data.code == 200){
            this.dialogFormVisible = false
            this.$message({
                  message: "添加成功",
                  type: "success"
            })
            this.init()
          } 
        })
      },
      selectShop(event){
        this.selectedShop = event
      },
      addShopSubmit() {
        addProject(this.selectedShop).then(e => {
          if(e.data.code == 200){
            this.dialogShopVisible = false
            this.init()
          } 
        })
      },
      createExt() {
        this.dialogFormVisible = true
        this.title = "添加推广券"
      },
      updateExt(row) {
        this.form = row
        this.dialogFormVisible = true
        this.title = "修改推广券"
      },
      selectExt(val) {
        if(val){
          this.selectExtForm = val
          getActivityPartDetail({activityId: val.id}).then(e => {
            if(e.data.code == 200){
              this.tableData2 = e.data.data
            } 
          })
        }
      },
      getPart(){
        getPart({garageId: '-99', size: 2000}).then(res => {
          this.partList = this.partLists = res.data.data
        })
      },
      selectPart(event){
        this.selected1 = event
        this.selectPartList = unique(this.selectPartList.concat(this.selected1), 'id')
      },
      add_parts(params, index){
        if(this.selectPartList.length == 0)  this.getPart()
        this.selectPartItemId = params.id
        this.selectPartName = params.itemName
        this.visible.addPartsVisible = true
      },
      addPartsSubmit(){
        if(this.selectPartList.length == 0){
          return this.$message({message: "请先选择配件", type: "error"})
        }

        const data = {
          activityId: this.selectExtForm.id,
          parts: this.selectPartList.map(v => {
            return {
              partId: v.id,
              partModel: v.model,
              partName: v.partName
            }
          })
        }

        addActivityPart(data).then(e => {
          if(e.data.code == 200){
            this.selectPartList = this.selected1 = []
            this.partSearch = ''
            this.visible.addPartsVisible = false
            this.$message({
                  message: "创建成功",
                  type: "success"
            })
            this.selectExt(this.selectExtForm)
          } 
        })
        
      },
      createParts() {
        this.visible.createPartsVisible = true
      },
      createPartsSubmit(){
        const dto = {
          gid: 1,
          ...this.createPartsForm
        }
        addPart(dto).then(e => {
          if(e.data.code == 200){
            this.visible.createPartsVisible = false
            this.$message({
                  message: "创建成功",
                  type: "success"
            })
            this.getPart()
          } 
        })
      },
      autoSelects(arr) {
        this.$nextTick( () => {
          if ( this.partList !== undefined && arr !== undefined ) {
            this.partList.forEach( ( v, i ) => {
              arr.forEach(( _v, _i ) => {
                if ( v.id === _v.id ) {
                  this.$refs.partTable.toggleRowSelection(v, true )
                }
              })
            })
          }
        })
      },
      deleteRows(index, row) {
        this.selectPartList.splice(index, 1)
        this.$refs.partTable.toggleRowSelection(row, false)
      },
      deleteShop(row) {
        if(row.count > 0) return this.$message({type: 'error',message: '不允许删除已办理业务的商品'})
        this.$confirm(`确认删除${row.partName}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					deleteActivityPart({activityPartId: row.id}).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '删除成功'
							})
							this.selectExt(this.selectExtForm)
						}
					})
        }).catch(() => {})
      },
      deleteExt(row){
         if(row.count > 0) return this.$message({type: 'error',message: '不允许删除已办理业务的活动'})
        this.$confirm(`确认删除${row.activityName}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					deleteActivity({activityId: row.id}).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '删除成功'
							})
							this.init()
						}
					})
        }).catch(() => {})
      },
      offlineExt(row, status) {
        const status_name = status == 1 ? '上架' : '下架'
        this.$confirm(`确认要${status_name}${row.activityName}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					updateActivityStatus({activityId: row.id, status: status}).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: `${status_name}成功`
							})
							this.init()
						}
					})
        }).catch(() => {})
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



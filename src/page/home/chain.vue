<template>
	<div class="w-100 orderTable" style="padding-left: 30px;">
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="p-20" style="background:rgba(229,246,247,1);">
          <el-row :gutter="10">
            <el-form :inline="true" class="demo-form-inline">
              <el-col>
                <el-form-item label="母公司名称" class="m-b-0">
                  <el-input v-model="search.name" placeholder="请输入母公司名称" style="width: 160px;"></el-input>
                </el-form-item>
                <el-button type="success" icon="el-icon-search" @click="init">查找</el-button>

                <el-button type="success" style="float:right;" @click="addCompanyVisible = true">创建</el-button>
              </el-col>
            </el-form>
          </el-row>
        </div>

        <el-table :data="tableData" :max-height="maxHeight" style="width: 100%" id="printBox" highlight-current-row @current-change="selectCompany">
          <el-table-column prop="date" label="编号" width="80">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="母公司名">
            <template slot-scope="scope">
              {{scope.row.name}}
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
              {{scope.row.legalPersonPhone}}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="removeCompany(scope.row)">删除</el-button>
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

      <el-col :span="12">
        <div class="p-20" style="background:rgba(229,246,247,1);">
          <el-row :gutter="10">
            <el-form :inline="true" class="demo-form-inline">
              <el-col>
                已选母公司：{{selectedGarage.name}}
                <el-button type="success" style="float:right;" @click="addSubCompany">添加子公司</el-button>
              </el-col>
            </el-form>
          </el-row>
        </div>

        <el-table :data="sub.list" :max-height="maxHeight" style="width: 100%" id="printBox">
          <el-table-column prop="date" label="编号" width="80">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="修理厂名称">
            <template slot-scope="scope">
              {{scope.row.name}}
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
              {{scope.row.legalPersonPhone}}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="removeSub(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="sub.pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="sub.size"
          @current-change="subNextPage"
          :total="sub.pageLength"
        >
        </el-pagination>
      </div>
      </el-col>
    </el-row>


    <el-dialog title="创建母公司" :visible.sync="addCompanyVisible" center width="30%" :modal="false">
      <el-form :model="addCompanyForm">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="addCompanyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="城市" label-width="100px">
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="地址" label-width="100px">
          <el-input v-model="addCompanyForm.address"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" label-width="100px">
          <el-input v-model.number="addCompanyForm.legalPerson"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="100px">
          <el-input v-model.number="addCompanyForm.legalPersonPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addCompanyVisible = false">取 消</el-button>
        <el-button type="success" @click="addCompanySubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加子公司" :visible.sync="addSubCompanyVisible" center :modal="false">
      <el-table :data="subList" :max-height="maxHeight">
        <el-table-column prop="date" label="编号" width="80">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="修理厂名称">
          <template slot-scope="scope">
            {{scope.row.name}}
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
            {{scope.row.legalPersonPhone}}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.gcid || scope.row.gcid == 0" type="success" size="mini" @click="addSubSubmit(scope.row)">添加</el-button>
            <span v-else>已添加</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addSubCompanyVisible = false">取 消</el-button>
        <el-button type="success" @click="addSubCompanyVisible = false">提 交</el-button>
      </div>
    </el-dialog>

	</div>

</template>

<script>
	import { queryAllGarageList, queryGarageListByLevel, addSuperGarage, setSuperGarage, deleteSuperGarage } from "../../request/api.js"
  import { provinceAndCityData, CodeToText } from 'element-china-area-data'
	import moment from "moment"

	export default {
		name: "chain",
		data() {
			return {
        addCompanyVisible: false,
        addSubCompanyVisible: false,
        options: provinceAndCityData,
        selectedOptions: [],
				tableData: [],
				maxHeight: undefined,
				search: {
					name:""
				},
				pageLength: null,
				size: 10,
				page: 0,
				addCompanyForm: {
          city: ''
        },
        sub: {
          list: [],
          pageLength: null,
          size: 10,
				  page: 0,
        },
        subList: [],
        selectedGarage: {
          id: '',
          name: ''
        }
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
					name: this.search.name,
          level: 1,
          parentGid: 0
				}
				queryGarageListByLevel(data).then(res => {
					const result = res.data
					this.pageLength = result.pageInfo.total
					this.tableData = this.subList = result.data
				})
			},
      getSub() {
				const data = {
					size: this.sub.size,
					page: this.sub.page,
          level: 2,
          parentGid: this.selectedGarage.id
				}
				queryGarageListByLevel(data).then(res => {
					const result = res.data
					this.sub.pageLength = result.pageInfo.total
					this.sub.list = result.data
				})
			},
			nextPage(page) {
				this.page = page - 1
        this.init()
			},
      subNextPage(page) {
        this.sub.page = page - 1
        this.getSub()
      },
      selectCompany(val) {
        this.selectedGarage.id = val.id
        this.selectedGarage.name = val.name
        this.getSub()
      },
      handleChange (value) {
        this.addCompanyForm.city = CodeToText[value[0]] + CodeToText[value[1]]
      },
      addSubSubmit(row) {
        let data = JSON.parse(JSON.stringify(row))
        data.gcid = this.selectedGarage.id
        setSuperGarage(data).then(res => {
          if(res.data.code == 200){
            this.$message({
              message: "添加成功",
              type: "success"
            })
            this.addSubCompany()
            this.getSub()
          } 
        })
      },
      addCompanySubmit() {
        addSuperGarage(this.addCompanyForm).then(e => {
          if(e.data.code == 200){
            this.addCompanyVisible = false
            this.$message({
              message: "创建成功",
              type: "success"
            })
            this.init()
          } 
        })
      },
      addSubCompany() {
        queryAllGarageList().then(res => {
          const result = res.data.data
          this.subList = result
        })
        this.addSubCompanyVisible = true
      },
      removeCompany(row) {
        this.$confirm(`确认要删除${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					deleteSuperGarage({gid: row.id}).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '删除成功'
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
      removeSub(row) {
        this.$confirm(`确认要删除${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.gcid = 0
					setSuperGarage(row).then(res => {
						const result = res.data
						if(result.code == 200){
							this.$message({
								type: 'success',
								message: '删除成功'
							})
							this.getSub()
						}else{
							this.$message({
								type: 'error',
								message: result.message
							})
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
</style>



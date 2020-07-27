<template>
	<div class="w-100 orderTable" style="padding-left: 30px;width: 50%;">
		<div class="p-20" style="background:rgba(229,246,247,1);">
			<el-row :gutter="10" type="flex" justify="end">
				<el-form :inline="true" class="demo-form-inline">
					<el-col>
						<el-button type="success" icon="el-icon-plus" @click="dialogFormVisible = true">添加</el-button>
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
			<el-table-column prop="partName" label="品名">
				<template slot-scope="scope">
					{{scope.row.partName}}
				</template>
			</el-table-column>
			<el-table-column  label="规格型号">
				<template slot-scope="scope">
					{{scope.row.model}}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="120" align="center">
				<template slot-scope="scope">
          <div style="cursor: pointer;" @click="deleteShop(scope.row)">
            <img src="../../../static/img/delete.png" alt="" width="25">
          </div>
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

    <el-dialog title="添加商品" :visible.sync="dialogFormVisible" center :modal="false" width="30%">
      <el-form :model="form">
        <el-form-item label="品名" label-width="100px">
          <el-input v-model="form.partName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" label-width="100px">
          <el-input v-model="form.model" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click="addShopSubmit">确 定</el-button>
      </div>
    </el-dialog>
	</div>

</template>

<script>
	import { getPartList, addPart, deletePart } from "../../request/api.js"
	export default {
		name: "order",
		data() {
			return {
				form: {},
				dialogFormVisible: false,
				tableData: [],
				maxHeight: undefined,
				pageLength: null,
				size: 10,
				page: 0,
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
					garageId: '-99',
				}
				getPartList(data).then(res => {
					const result = res.data
					this.pageLength = result.pageInfo.total
					this.tableData = result.data
				})
			},
			nextPage(page) {
				this.page = page - 1
				this.init()
			},
			addShopSubmit(){
				const data = {
					gid: -99,
					isFactioryPartName: 0,
					...this.form
				}
				addPart(data).then(e => {
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
			deleteShop(row) {
				this.$confirm(`确认删除${row.partName}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletePart({id: row.id}).then(res => {
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
			}
		}
	}
</script>
<style scoped>
 
</style>



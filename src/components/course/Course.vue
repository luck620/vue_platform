<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          账户名称：<el-input placeholder="请输入内容" v-model="account.name" clearable></el-input>
          真实姓名：<el-input placeholder="请输入内容" v-model="account.realName" clearable></el-input>
          联系方式：<el-input placeholder="请输入内容" v-model="account.phone" clearable></el-input>
          <el-button type="success" square @click="getAccountListByOthers">查询</el-button>
          <el-button type="info" square @click="resetTextForm">重置</el-button>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="accountList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="账号名称" prop="name"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="手机" prop="phone"></el-table-column>
        <el-table-column label="备注" prop="commit"></el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAccountById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30 ,40, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加-->
    <el-dialog title="添加账户" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="账户名称" prop="name">
          <el-input v-model="addForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="commit">
          <el-input v-model="addForm.commit"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccount" >确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改账户信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="账户名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="commit">
          <el-input v-model="editForm.commit"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAccount" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      account: {
        name: '',
        realName: '',
        phone: ''
      },
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      accountList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        password: '',
        realName: '',
        phone: '',
        commit: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '账户名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '真实姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        commit: []
      },
      editForm: {
        name: '',
        password: '',
        realName: '',
        phone: '',
        commit: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '账户名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '真实姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        commit: []
      }
    }
  },
  created () {
    this.getAccountList()
    this.getAccountListByOthers()
  },
  methods: {
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('http://localhost:8080/account/findAccountById/' + id)
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    resetTextForm () {
      this.account.name = ''
      this.account.realName = ''
      this.account.phone = ''
    },
    async getAccountList () {
      await this.$http.get('http://localhost:8080/account/getAccountList/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '').then((res) => {
        console.log(res)
        console.log(res.data)
        if (res.status !== 200) return this.$message.error('获取账户列表失败')
        this.accountList = res.data.content
        this.total = res.data.totalElements
      })
    },
    async getAccountListByOthers () {
      const { data: res } = await this.$http.post('http://localhost:8080/account/getAccountListByOthers/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.account)
      console.log(res)
      this.accountList = res.content
      this.total = res.totalElements
    },
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      this.getAccountList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getAccountList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addAccount () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/account/addAccount', this.addForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('添加账户失败！')
        }
        this.$message.success('添加账户成功！')
        this.addDialogVisible = false
        this.getAccountList()
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editAccount () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/account/editAccountById/' + this.editForm.id, this.editForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('更新账户信息失败！')
        }
        this.$message.success('更新账户信息成功！')
        this.editDialogVisible = false
        this.getAccountList()
      })
    },
    async removeAccountById (id) {
      console.log(id)
      const confirmResult = await this.$confirm('确定删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.get('http://localhost:8080/account/deleteAccountById/' + id)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getAccountList()
    }
  }
}
</script>
<style lang="less" scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-card{
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }
  .el-table{
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 15px;
  }
  .el-input{
    width: 300px;
    margin-right: 10px;
    margin-bottom: 15px;
  }
</style>

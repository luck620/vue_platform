<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          学生姓名：<el-input placeholder="请输入内容" v-model="student.name" clearable></el-input>
          学生学号：<el-input placeholder="请输入内容" v-model="student.sno" clearable></el-input>
          联系方式：<el-input placeholder="请输入内容" v-model="student.phone" clearable></el-input>
        </el-row>
        <el-row :gutter="20" >
          电子邮箱：<el-input placeholder="请输入内容" v-model="student.mail" clearable></el-input>
          学生年级：<el-select v-model="grade" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
          <el-button type="success" square @click="getStudentListByOthers">查询</el-button>
          <el-button type="info" square @click="resetTextForm">重置</el-button>
        </el-row>
        <el-row :gutter="20" >
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="accountList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="学号" prop="sno"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="手机" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="mail"></el-table-column>
        <el-table-column label="年级" prop="grade"></el-table-column>
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
    <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="学生学号" prop="sno">
          <el-input v-model="addForm.sno"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="addForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="grade" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent" >确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改账户信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="sno">
          <el-input v-model="editForm.sno"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="editForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="editForm.grade" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStudent" >确 定</el-button>
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
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    return {
      student: {
        name: '',
        sno: '',
        phone: '',
        mail: '',
        grade: ''
      },
      options: [
        '大一', '大二', '大三', '大四'
      ],
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
        sno: '',
        phone: '',
        mail: '',
        grade: ''
      },
      grade: '',
      addFormRules: {
        name: [
          {
            required: true,
            message: '请输入学生姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '学生姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        sno: [
          {
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '学号在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        grade: []
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
          {
            required: true,
            message: '请输入学生姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '学生姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        sno: [
          {
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '学号在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        grade: [
          {
            required: true,
            message: '请输入年级',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getStudentList()
    this.getStudentListByOthers()
  },
  methods: {
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('http://localhost:8080/student/findStudentById/' + id)
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    resetTextForm () {
      this.student.name = ''
      this.student.sno = ''
      this.student.phone = ''
      this.student.mail = ''
      this.student.grade = ''
    },
    async getStudentList () {
      await this.$http.get('http://localhost:8080/student/getStudentList/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '').then((res) => {
        console.log(res)
        console.log(res.data)
        if (res.status !== 200) return this.$message.error('获取学生列表失败')
        this.accountList = res.data.content
        this.total = res.data.totalElements
      })
    },
    async getStudentListByOthers () {
      const { data: res } = await this.$http.post('http://localhost:8080/student/getStudentListByOthers/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.student)
      console.log(res)
      this.accountList = res.content
      this.total = res.totalElements
    },
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      this.getStudentList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getStudentList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addStudent () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        this.addForm.grade = this.grade
        const { data: res } = await this.$http.post('http://localhost:8080/student/addStudent', this.addForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('添加账户失败！')
        }
        this.$message.success('添加账户成功！')
        this.addDialogVisible = false
        this.getStudentList()
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editStudent () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/student/editStudentById/' + this.editForm.id, this.editForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('更新账户信息失败！')
        }
        this.$message.success('更新账户信息成功！')
        this.editDialogVisible = false
        this.getStudentList()
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
      const { data: res } = await this.$http.get('http://localhost:8080/student/deleteStudentById/' + id)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getStudentList()
    }
  }
}
</script>
<style scoped>
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
  .el-select{
    width: 300px;
    margin-right: 30px;
    margin-bottom: 15px;
  }
  .diaglog >>> .el-input__inner {
    width: 300px!important;
    margin-right: 30px;
    margin-bottom: 15px;
  }
</style>

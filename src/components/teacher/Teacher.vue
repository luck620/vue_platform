<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>教师列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          教师姓名：<el-input placeholder="请输入内容" v-model="teacherDTO.name" clearable></el-input>
          联系方式：<el-input placeholder="请输入内容" v-model="teacherDTO.phone" clearable></el-input>
          教师号：<el-input placeholder="请输入内容" v-model="teacherDTO.tno" clearable></el-input>
        </el-row>
        <el-row :gutter="20" >
          电子邮箱：<el-input placeholder="请输入内容" v-model="teacherDTO.mail" clearable></el-input>
          <el-button type="success" square @click="getTeacherListByOthers">查询</el-button>
          <el-button type="info" square @click="resetTextForm">重置</el-button>
        </el-row>
        <el-row :gutter="20" >
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加教师</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="teacherList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="头像" prop="imageUrl">
          <template scope="scope">
            <img :src="scope.row.imageUrl" width="120" height="100"/>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="教师号" prop="tno"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="邮箱" prop="mail"></el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeTeacherById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1,2,10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加-->
    <el-dialog title="添加教师" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        上传教师头像<el-upload
        class="avatar-uploader"
        :multiple="true"
        action="http://upload-z2.qiniup.com"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        :show-file-list="false"
        :data="postData"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="handleError">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="教师号" prop="tno">
          <el-input v-model="addForm.tno"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="addForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
<!--        <el-form-item label="教授课程" prop="courseName">-->
<!--          <el-select v-model="courseName" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item"-->
<!--              :label="item"-->
<!--              :value="item">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTeacher" >确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改账户信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        修改教师头像<el-upload
        class="avatar-uploader"
        :multiple="true"
        action="http://upload-z2.qiniup.com"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        :show-file-list="false"
        :data="postData"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="handleError">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="教师号" prop="tno">
          <el-input v-model="editForm.tno"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="editForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
<!--        <el-form-item label="教授课程" prop="courseName">-->
<!--          <el-select v-model="editForm.courseName" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item"-->
<!--              :label="item"-->
<!--              :value="item">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTeacher" >确 定</el-button>
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
    // const hasPhone = (rule, value, cb) => {
    //   const
    // }
    return {
      imageUrl: '',
      imageURL: '',
      postData: {
        token: '',
        key: ''
      },
      options: [],
      loading: false,
      courseName: '',
      teacherDTO: {
        name: '',
        phone: '',
        tno: '',
        mail: ''
      },
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      teacherList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        phone: '',
        tno: '',
        mail: '',
        password: '',
        imageUrl: ''
        // courseName: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        tno: [
          { required: true, message: '请输入教师号名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '教师号的长度在2~10个字符之间',
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
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      editForm: {
        name: '',
        phone: '',
        tno: '',
        mail: '',
        password: '',
        imageUrl: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        tno: [
          { required: true, message: '请输入教师号名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '教师号的长度在2~10个字符之间',
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
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.getTeacherList()
    this.getTeacherListByOthers()
    // this.remoteMethod()
    this.getToken()
  },
  methods: {
    async getToken () {
      await this.$http.get('http://localhost:8080/getUpToken').then((res) => {
        console.log(res)
        this.postData.token = res.data
      })
    },
    handleError: function (res) {
      console.log(res)
      this.$message({
        message: '上传失败',
        duration: 2000,
        type: 'warning'
      })
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      console.log(file)
      console.log(file.raw)
      this.$message.success('上传成功')
      this.imageUrl = 'http://qaath1lbd.bkt.clouddn.com/' + res.key
      this.imageURL = res.key
      console.log(this.imageUrl)
    },
    beforeAvatarUpload (file) {
      this.postData.key = file.name
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // async remoteMethod () {
    //   const { data: res } = await this.$http.get('http://localhost:8080/teacher/findAllType')
    //   console.log(res)
    //   this.options = res
    // },
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('http://localhost:8080/teacher/findTeacherById/' + id)
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    resetTextForm () {
      this.teacherDTO.name = ''
      this.teacherDTO.phone = ''
      this.teacherDTO.tno = ''
      this.teacherDTO.mail = ''
      this.teacherDTO.courseName = ''
      this.courseName = ''
    },
    // async getTeacherList () {
    //   const { data: res } = await this.$http.get('http://localhost:8080/teacher/getTeacherList/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '')
    //   console.log(res)
    //   console.log(res.content)
    //   this.teacherList = res.content
    //   this.total = res.totalElements
    // },
    async getTeacherListByOthers () {
      this.teacherDTO.courseName = this.courseName
      const { data: res } = await this.$http.post('http://localhost:8080/teacher/getTeacherListByOthers/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.teacherDTO)
      console.log(res)
      this.teacherList = res.content
      this.total = res.totalElements
    },
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      this.getTeacherListByOthers()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getTeacherListByOthers()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addTeacher () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        this.addForm.imageUrl = this.imageURL
        const { data: res } = await this.$http.post('http://localhost:8080/teacher/addTeacher', this.addForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('添加教师失败！')
        }
        this.$message.success('添加教师成功！')
        this.addDialogVisible = false
        this.getTeacherListByOthers()
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editTeacher () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        this.editForm.imageUrl = this.imageURL
        const { data: res } = await this.$http.post('http://localhost:8080/teacher/editTeacherById/' + this.editForm.id, this.editForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('更新教师信息失败！')
        }
        this.$message.success('更新教师信息成功！')
        this.editDialogVisible = false
        this.getTeacherListByOthers()
      })
    },
    async removeTeacherById (id) {
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
      const { data: res } = await this.$http.get('http://localhost:8080/teacher/deleteTeacherById/' + id)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getTeacherListByOthers()
    }
  }
}
</script>
<style scoped>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 1px dashed #5191d9;
    margin-left: 100px;
    margin-bottom: 30px;
  }
  .avatar {
    cursor: pointer;
    width: 100px;
    height: 100px;
    display: block;
  }
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
    margin-right: 30px;
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

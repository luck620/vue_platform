<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程测验详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--列表数据显示-->
      <el-table :data="examList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="作者" prop="author"></el-table-column>
        <el-table-column label="作者职位" prop="content"></el-table-column>
        <el-table-column label="视频封面" prop="imageUrl">
          <template scope="scope">
            <img :src="scope.row.imageUrl" width="250" height="140"/>
          </template>
        </el-table-column>
        <el-table-column label="视频外链" prop="videoUrl"></el-table-column>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      examList: []
    }
  },
  created () {
    this.findCourseDetailStu()
  },
  methods: {
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      this.findCourseDetailStu()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.findCourseDetailStu()
    },
    async findCourseDetailStu () {
      const { data: res } = await this.$http.get('http://localhost:8080/theme/getThemeDetailById/' + window.sessionStorage.getItem('themeId') + '/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.student)
      console.log(res)
      this.examList = res.content
      this.total = res.totalElements
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
    width: 150px;
    margin-right: 10px;
    margin-bottom: 15px;
  }
  .el-select{
    width: 150px;
    margin-right: 30px;
    margin-bottom: 15px;
  }
  .diaglog >>> .el-input__inner {
    width: 150px!important;
    margin-right: 30px;
    margin-bottom: 15px;
  }
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程公告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--列表数据显示-->
      <el-table :data="noticeDetailStuList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="发布日期" prop="date"></el-table-column>
        <el-table-column label="详细内容" prop="content"></el-table-column>
        <el-table-column label="附件外链" prop="wordUrl"></el-table-column>
<!--        <el-table-column label="操作" width="170px">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">-->
<!--            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>-->
<!--          </el-tooltip>-->
<!--          <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">-->
<!--            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAccountById(scope.row.id)"></el-button>-->
<!--          </el-tooltip>-->
<!--        </template>-->
<!--        </el-table-column>-->
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChangeStu"
        @current-change="handleCurrentChangeStu"
        :current-page="queryInfoStu.pageNum"
        :page-sizes="[10,20,30]"
        :page-size="queryInfoStu.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalStu">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfoStu: {
        pageNum: 1,
        pageSize: 10
      },
      noticeDetailStuList: [],
      totalStu: 0
    }
  },
  created () {
    this.findCourseDetailStu()
  },
  methods: {
    async findCourseDetailStu () {
      const { data: res } = await this.$http.get('http://localhost:8080/notice/getNoticeByCourseId/' + '/' + (this.queryInfoStu.pageNum - 1) + '/' + this.queryInfoStu.pageSize + '/' + window.sessionStorage.getItem('courseId') + '', this.student)
      console.log(res)
      this.noticeDetailStuList = res.content
      this.totalStu = res.totalElements
    },
    handleSizeChangeStu (newSize) {
      console.log(123)
      this.queryInfoStu.pageSize = newSize
      this.findCourseDetailStu()
    },
    handleCurrentChangeStu (newPage) {
      this.queryInfoStu.pageNum = newPage
      this.findCourseDetailStu()
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

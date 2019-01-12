<template>
    <div class="right-container">
			<div class="right-box"  v-loading="loading">
				<dashboard-top></dashboard-top>
				<dashboard-center></dashboard-center>
			</div>
		</div>
</template>

<script>
	require('./../../../assets/fontIcon/iconfont')
	
	import dashboardTop from './dashboardTop'
	import dashboardCenter from './dashboardCenter'
    export default {
			components:{dashboardTop,dashboardCenter},
			 data () {
        return {
          loading: false
        }
  }
  // before
    }
</script>

<style scoped>
/*********************
* 内容区布局
*********************/
.content .right-container{
    width: 100%;
    height: 100%;
    padding: 20px;
	background: #f0f2f5;
	overflow: auto;
}

.content .right-container .container-nav{
	float: left;
	width: 100%;
}
.content .container-nav li{
	height: 28px;
	float: left;
	text-align: center;
	padding-bottom: 6px;
	cursor: pointer;
	border-bottom: 4px solid transparent;
}
.content .container-nav li:hover{
	height: 28px;
	border-bottom: 4px solid #a8c4dd;
}
.right-box{
	width: 100%;
	height: 100%;
}

</style>
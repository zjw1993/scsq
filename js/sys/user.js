Admin.user = function(){

	var $table = $('#table');

	var _this = {
		initSearch: function(){
			$(".admin-content-search .btn-search").bind('click', function(){
				console.log("search btn click...")
				$table.bootstrapTable('refresh');
			});
		},
		
		getData : function(params){
			var parameters = params.data;
			parameters.userName = $(".admin-content-search input[name='userName']").val();
			parameters.mobile = $(".admin-content-search input[name='mobile']").val();
			parameters.email = $(".admin-content-search input[name='email']").val();
			
			Admin.ajaxJson(Admin.SERVER_URL + "/user/dataList.do", parameters, function(data){
				params.success(data)
			});
			/*Admin.ajaxJson(Admin.STATIC_URL + "/datas/pageList.json", parameters, function(data){
				params.success(data)
			});*/
		},
		
		initTable: function(){
			$table.bootstrapTable({
				ajax: _this.getData,    	// 自定义ajax获取数据
				undefinedText: "未知",   	// undefined字段默认显示
				striped: false,				// 隔行变色效果
				pagination: true,			// 显示分页
				paginationVAlign: "bottom", // 分页条显示位置
				sidePagination: "server",	// 分页数据来源  server服务器
				pageNumber: 1,				// 第一页
				pageSize: 5, 				// 每页显示数量
				pageList: [5, 10, 15, 20, 30, 50],	// 可选每页显示数量值
				idField: "id",				// id字段
				paginationPreText:"上一页",	// 上一页按钮显示文字 
				paginationNextText: "下一页", // 下一页按钮显示文字
				clickToSelect: true,		// 单击选中该行
				singleSelect: false,		// 单选
				checkboxHeader: true,		// 列头全选按钮
				//maintainSelected: true,		// 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
				silentSort: true,			// 点击分页按钮时，记住排序
				detailView: true,
				detailFormatter: function(index, row){
					return row.userName + "</br>" + row.mobile;
				},
			    columns: [{
			        field: '',
			        title: '',
			        checkbox: true
			    }, {
			        field: 'id',
			        title: 'ID',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'userName',
			        title: 'userName',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'userType',
			        title: 'userType',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'realName',
			        title: 'realName',
			        align: 'center'
			    }]
			    
			});
		},
		
		toolbar : [
			{
				name: "添加",
				icon: "save",
				btnType: "btnAdd",
				handler: function(){
					  layer.open({
						  type: 1,
						  title: "添加用户",
						  area: ['500px', '340px'],
						  shadeClose: false, //点击遮罩关闭
						  content: $("#edit-panel-templet").text(),
						  btnAlign: 'r',
						  btn: ['保存'],
						  yes:function(index, layero){
						  	  var $form = $(layero).find("form");
						      var param = $form.serialize();
						      Admin.ajaxJson(Admin.SERVER_URL + "/user/save.do", param, function(data){
						      	  if(data.success) {
						      	  	  Admin.alert("提示", data.msg, 1, function(){
						      	  	  	  layer.close(index);
						      	  	  	  $table.bootstrapTable("refresh");
						      	  	  });
						      	  }
						      });
						      
						    
						  }
					  });
				}
			},
			{
				name: "修改",
				icon: "edit",
				btnType: "btnEdit",
				handler: function(){
					var row = Admin.checkSingleRow($table);
					console.log("123123132313")
				}
			},
			{
				name: "删除",
				icon: "delete",
				btnType: "benDelete",
				handler: function(){
					alert("edit");
				}
			},
			{
				name: "角色分配",
				icon: "user",
				btnType: "btnRoleRel",
				handler: function(){
					alert("delete");
				}
			}
		],
		
		init : function(){
			_this.initSearch();
			_this.initTable();
			Page.initToolbar(_this.toolbar);
		}
	};
	
	
	return _this;
}();

$(function(){
	Admin.user.init();
})

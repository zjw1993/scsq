Admin.menu = function(){

	var dataListUrl = Admin.SERVER_URL + "/menu/dataList.do";
	var saveUrl = Admin.SERVER_URL + "/menu/save.do";
	var editUrl = Admin.SERVER_URL + "/menu/edit.do";
	var deleteUrl = Admin.SERVER_URL + "/menu/delete.do";
	
	var $table = $('#table');

	var _this = {
		initSearch: function(){
			$(".admin-content-search .btn-search").bind('click', function(){
				$table.bootstrapTable('refresh');
			});
		},
		
		getData : function(params){
			var parameters = params.data;
			parameters.name = $(".admin-content-search input[name='name']").val();
			parameters.type = $(".admin-content-search select[name='type']").val();
			
			Admin.ajaxJson(dataListUrl, parameters, function(data){
				params.success(data)
			});
		},
		
		initTable: function(){
			$table.bootstrapTable({
				ajax: _this.getData,    	// 自定义ajax获取数据
				undefinedText: "-",   		// undefined字段默认显示
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
				silentSort: true,			// 点击分页按钮时，记住排序
				detailView: true,
				/*detailFormatter: function(index, row){
					return row.userName + "</br>" + row.mobile;
				},*/
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
			        field: 'name',
			        title: 'name',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'url',
			        title: 'url',
			        width: '200px',
			        align: 'center'
			    }, {
			        field: 'parentId',
			        title: 'parentId',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'actions',
			        title: 'actions',
			        align: 'center'
			    }, {
			        field: 'type',
			        title: 'type',
			        align: 'center'
			    }, {
			        field: 'rank',
			        title: 'rank',
			        width: '',
			        align: 'center',
			        formatter: function(val){
			        	if(val == 0){
			        		return "正常";
			        	}else{
			        		return "禁用";
			        	}
			        }
			    }, {
			        field: 'createTime',
			        title: 'createTime',
			        width: '',
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
						      Admin.ajaxJson(saveUrl , param, function(data){
						      	  if(data.success) {
						      	  	  Admin.alert("提示", data.msg, 1, function(){
						      	  	  	  layer.close(index);
						      	  	  	  $table.bootstrapTable("refresh");
						      	  	  });
						      	  }else{
						      	  	Admin.alert("提示", data.msg, 1,)
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
					Admin.checkSingleRow($table, function(row){
						layer.open({
						  	type: 1,
						  	title: "编辑用户",
						  	area: ['500px', '340px'],
						  	shadeClose: false, //点击遮罩关闭
						  	content: $("#edit-panel-templet").text(),
						  	success:function(layero, index){
						  		var $form = $(layero).find("form");
						  		Admin.fillForm($form, row[0]);
						  	},
						  	btn: ['提交'],
						  	btnAlign: 'r',
						  	yes:function(index, layero){
						  	  	var $form = $(layero).find("form");
						      	var param = $form.serialize();
						      	Admin.ajaxJson(editUrl, param, function(data){
						      	  	if(data.success) {
						      	  	  	Admin.alert("提示", data.msg, 1, function(){
						      	  	  	  	layer.close(index);
						      	  	  	  	$table.bootstrapTable("refresh");
						      	  	  	});
						      	  	}
						      	});
						  	}
						  	
					  	});
					})
					
				}
			},
			{
				name: "删除",
				icon: "delete",
				btnType: "benDelete",
				handler: function(){
					Admin.checkSingleRow($table, function(row){
						console.log(row[0].id)
						Admin.confirm("删除后数据不可恢复，您确认要删除吗？", function(b){
							if(b){
								Admin.ajaxJson(deleteUrl, {id:row[0].id}, function(data){
						      	  	if(data.success) {
						      	  	  	Admin.alert("提示", data.msg, 1, function(){
						      	  	  	  	$table.bootstrapTable("refresh");
						      	  	  	});
						      	  	}
						      	});
							}
						});
					});
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
	Admin.menu.init();
})

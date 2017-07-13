Admin.user = function(){

	var dataListUrl = Admin.SERVER_URL + "/user/dataList.do";
	var saveUrl = Admin.SERVER_URL + "/user/save.do";
	var editUrl = Admin.SERVER_URL + "/user/edit.do";
	var deleteUrl = Admin.SERVER_URL + "/user/delete.do";
	var saveURelUrl = Admin.SERVER_URL + "/role/saveURel.do";
	var roleCheckList = Admin.SERVER_URL + "/role/roleCheckList.do";

	var $table = $('#table');

	var _this = {
		initSearch: function(){
			$(".admin-content-search .btn-search").bind('click', function(){
				$table.bootstrapTable('refresh');
			});
		},
		
		getData : function(params){
			var parameters = params.data;
			parameters.userName = $(".admin-content-search input[name='userName']").val();
			parameters.mobile = $(".admin-content-search input[name='mobile']").val();
			parameters.email = $(".admin-content-search input[name='email']").val();
			
			Admin.ajaxJson(dataListUrl, parameters, function(data){
				params.success(data)
			});
		},
		
		initTable: function(){
			$table.bootstrapTable({
				ajax: _this.getData,    	// 自定义ajax获取数据
				undefinedText: "未知",   		// undefined字段默认显示
				//striped: false,				// 隔行变色效果
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
				singleSelect: true,		// 单选
				checkboxHeader: true,		// 列头全选按钮
				//maintainSelected: true,	// 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
				//silentSort: true,			// 点击分页按钮时，记住排序
				//detailView: true,
				//detailFormatter: function(index, row){
				//	return row.userName + "</br>" + row.mobile;
				//},
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
			        title: '用户名',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'roleNames',
			        title: '角色',
			        width: '200px',
			        align: 'center'
			    }, {
			        field: 'email',
			        title: 'Email',
			        width: '100px',
			        align: 'center'
			    }, {
			        field: 'mobile',
			        title: '手机号码',
			        align: 'center'
			    }, {
			        field: 'realName',
			        title: '真实姓名',
			        align: 'center'
			    }, {
			        field: 'status',
			        title: '状态',
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
			        title: '创建时间',
			        width: '',
			        align: 'center'
			    }]
			    
			});
		},
		
		toolbar : [
			{
				name: "添加",
				icon: "save",
				btnType: "add",
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
						  	var bootstrapValidator = $('#edit-panel-templet').data('bootstrapValidator');
						  	
						  	bootstrapValidator.validate();
						   if(bootstrapValidator.isValid())
						     	
						   else return;
						  	
						  	  /*var $form = $(layero).find("form");
						      var param = $form.serialize();
						      Admin.ajaxJson(saveUrl, param, function(data){
						      	  if(data.success) {
						      	  	  Admin.alert("提示", data.msg, 1, function(){
						      	  	  	  layer.close(index);
						      	  	  	  $table.bootstrapTable("refresh");
						      	  	  });
						      	  }else{
						      	  	Admin.alert("提示", data.msg, 1)
						      	  }
						      });*/
						  }
					  });
				}
			},
			{
				name: "修改",
				icon: "edit",
				btnType: "edit",
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
				btnType: "delete",
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
			},
			{
				name: "角色分配",
				icon: "user",
				btnType: "btnRoleRel",
				handler: function(){
					Admin.checkSingleRow($table, function(row){
						layer.open({
						  	type: 1,
						  	title: "用户角色分配",
						  	area: ['500px', '500px'],
						  	shadeClose: false, //点击遮罩关闭
						  	content: $("#role-panel-templet").text(),
						  	success:function(layero, index){
						  		var $form = $(layero).find("form");
						  		$form.find("input[name='userId']").val(row[0].id);
						  		$form.find("input[name='userName']").val(row[0].userName);
						  		$('#roleId').multiselect({
						  			buttonWidth: '100%',
						  			numberDisplayed: 4,
						  			buttonText: function(options, select) {
								        if (options.length == 0) {
								          return '请选择用户角色';
								        } else {
								          	if (options.length > this.numberDisplayed) {
								            	return '已选择'+options.length+'个角色';
								          	} else {
								            	var selected = '';
								            	options.each(function() {
								             		var label = ($(this).attr('label') !== undefined) 
								             					? $(this).attr('label') 
								             					: $(this).html();
								              		selected += label + ', ';
								            	});
								            	return selected.substr(0, selected.length - 2);
								          	}
							        	}
							      	}
						  		});
						  		Admin.progress();
						  		Admin.ajaxJson(roleCheckList, {userId:row[0].id}, function(data){
						      	  	if(data.success) {
						      	  		var selectData = [];
						      	  	  	$.each(data.roles, function(i, item){
						      	  	  		var dataItem = {};
						      	  	  		dataItem.label = item.name;
						      	  	  		dataItem.value = item.id;
						      	  	  		selectData.push(dataItem);
						      	  	  	})
						      	  	  	$('#roleId').multiselect('dataprovider', selectData);
						      	  	  	if(data.userRoles) {
						      	  	  		$.each(data.userRoles, function(i, item){
						      	  	  			$('#roleId').multiselect('select', item.roleId);
						      	  	  		})
						      	  	  	}
						      	  	}
						      	});
						  		
						  	},
						  	btn: ['提交'],
						  	btnAlign: 'r',
						  	yes:function(index, layero){
						  	  	var $form = $(layero).find("form");
						      	var param = $form.serialize();
						      	console.log(param)
						      	Admin.ajaxJson(saveURelUrl, param, function(data){
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
			}
		],
		
		init : function(){
			_this.initSearch();
			_this.initTable();
			Page.initToolbar(_this.toolbar);
			
			$('#edit-panel-templet').bootstrapValidator({
				live: 'disabled',
				message: 'This value is not valid',
				feedbackIcons: {
				    valid: 'glyphicon glyphicon-ok',
				    invalid: 'glyphicon glyphicon-remove',
				    validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
					userName:{
						validators:{
							notEmpty:{
								message: 'The first name is required and cannot be empty'
							}
						}
					}
				}
			});
		}
	};
	
	
	return _this;
}();

$(function(){
	Admin.user.init();
})

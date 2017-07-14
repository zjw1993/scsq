Admin.menu = function(){

	var dataListUrl = Admin.SERVER_URL + "/menu/dataList.do";
	var subListUrl = Admin.SERVER_URL + "/menu/subList.do";
	var saveUrl = Admin.SERVER_URL + "/menu/save.do";
	var btnsUrl = Admin.SERVER_URL + "/menu/btnList.do";
	var deleteUrl = Admin.SERVER_URL + "/menu/delete.do";
	
	var $table = $('#table');
	
	var _this = {
		parentId : 0,
		parentName : "",
		
		initSearch: function(){
			$(".admin-content-search .btn-search").bind('click', function(){
				$table.bootstrapTable('refresh');
			});
		},
		
		getData : function(params){
			var parameters = params.data;
			parameters.parentId = 0;
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
				singleSelect: true,		// 单选
				checkboxHeader: false,		// 列头全选按钮
			    columns: [{
			        field: '',
			        title: '',
			        checkbox: true
			    }, {
			        field: 'id',
			        title: 'ID',
			        align: 'center'
			    }, {
			        field: 'name',
			        title: '菜单名称',
			        align: 'center'
			    }, {
			        field: 'spread',
			        title: '默认展开',
			        align: 'center',
			        formatter: function(val){
			        	if(val == 0){
			        		return "否";
			        	}else{
			        		return "是";
			        	}
			        }
			    }, {
			        field: 'rank',
			        title: '排序',
			        width: '',
			        align: 'center'
			    }, {
			        field: 'createTime',
			        title: '创建时间',
			        width: '',
			        align: 'center'
			    }, {
			    	field: 'childNum',
			    	title: '子菜单',
			    	align: 'center',
			    	formatter: function(val, row){
			    		return '<a href="javascript:void(0)" ' +
			    				  'onClick="Admin.menu.initSubTable('+ row.id +',\''+row.name+'\')">' +
			    				  '子菜单数量('+ val +')' +
			    			   '</a>';
			    	}
			    }]
			    
			});
		},
		
		getSubData : function(params){
			var parameters = params.data;
			parameters.parentId = _this.parentId;
			
			Admin.ajaxJson(subListUrl, parameters, function(data){
				params.success(data.rows)
			});
		},
		
		initSubTable : function (pid, pname) {
			console.log(pid + "--" + pname)
			$("#back-parent-btn").css('display', '');  // 返回按钮
			_this.parentId = pid;
			_this.parentName = pname;
			$table.bootstrapTable('destroy');
	        $table.bootstrapTable({
	            ajax: _this.getSubData,    	// 自定义ajax获取数据
				undefinedText: "-",   		// undefined字段默认显示
				clickToSelect: true,		// 单击选中该行
				singleSelect: true,			// 单选
				checkboxHeader: false,		// 列头全选按钮
			    columns: [{
			        field: '',
			        title: '',
			        checkbox: true
			    }, {
			        field: 'id',
			        title: 'ID',
			        align: 'center'
			    }, {
			        field: 'name',
			        title: '菜单名称',
			        align: 'center'
			    }, {
			        field: 'url',
			        title: '菜单链接',
			        align: 'center'
			    }, {
			        field: 'rank',
			        title: '排序',
			        width: '',
			        align: 'center'
			    }, {
			        field: 'createTime',
			        title: '创建时间',
			        width: '',
			        align: 'center'
			    }]
	        });
	    },
		
		menuValid:{
			rules:{
				name:{
					required: true,
					maxlength: 15
				},
				rank:{
					required: true,
					range:[0, 10000]
				},
				url:{
					required: true,
					maxlength: 200
				}
			}
		},
		
		btnsValid:{
			rules:{
				btnName:{
					required: true,
					maxlength: 15
				},
				btnType:{
					required:true,
					justEn: true,
					maxlength: 20
				},
				actionUrls:{
					required:true,
					maxlength:200
				}
			}
		},
		
		submitMenuEditForm: function(index, layero){
			var $menuForm = $("#menu-form");
			var $btnsForm = $("#btns-form");
			if(!Admin.validForm($menuForm, _this.menuValid, ":hidden")){
				return;
			}
			if(!Admin.validForm($btnsForm, _this.btnsValid)){
				return;
			}
		    var menuParam = $menuForm.serialize();
		    
		    var btngroups = $btnsForm.find("div[name='menu-btn-group']");
		    var btnArr = new Array();
		    if(btngroups != null && btngroups.length > 0) {
		    	$.each(btngroups, function(i, btngroup){
		    		var btn = {};
		    		btn.btnName = $(btngroup).find("input[name='btnName']").val();
		    		btn.btnType = $(btngroup).find("input[name='btnType']").val();
		    		btn.actionUrls = $(btngroup).find("input[name='actionUrls']").val();
		    		if(btn.btnName != null && btn.btnName != '' && btn.btnName != undefined){
		    			btnArr.push(btn);
		    		}
		    	})
		    }
		    menuParam = menuParam + "&btnsArr=" + JSON.stringify(btnArr);
		    
		    Admin.ajaxJson(saveUrl , menuParam, function(data){
		      	if(data.success) {
		      	  	Admin.alert("提示", data.msg, 1, function(){
		      	  	  	layer.close(index);
		      	  	  	$table.bootstrapTable("refresh");
		      	  	});
		      	}else{
		      	  	Admin.alert("提示", data.msg, 1)
		      	}
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
						title: "添加菜单",
						area: ['800px', '520px'],
						shadeClose: false, //点击遮罩关闭
						content: $("#edit-panel-templet").text(),
						success:function(layero, index){
							//var row = $table.bootstrapTable('getSelections');
							if(_this.parentId && _this.parentId != 0) {
								$(layero).find("form").find("input[name='parentId']").val(_this.parentId);
						  		$(layero).find("form").find("input[name='pName']").val(_this.parentName);
						  		$(layero).find("form").find("select[name='spread']").parent().css('display', 'none');
						  		$("#btns-form").css("display", "");
							}else{
								$(layero).find("form").find("input[name='pName']").parent().css('display', 'none');
								$(layero).find("form").find("input[name='url']").parent().css('display', 'none');
							}
							_this.addMenuBtns();
						},
						btn: ['保存'],
						yes:function(index, layero){
						  	_this.submitMenuEditForm(index, layero);
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
						console.log(row[0])
						layer.open({
						  	type: 1,
						  	title: "编辑菜单",
						  	area: ['800px', '520px'],
						  	shadeClose: false, //点击遮罩关闭
						  	content: $("#edit-panel-templet").text(),
						  	success:function(layero, index){
						  		var $form = $(layero).find("#menu-form");
						  		Admin.fillForm($form, row[0]);
						  		$(layero).find("form").find("select[name='spread']").val(Number(row[0].spread));
						  		
						  		if(_this.parentId && _this.parentId != 0) {
									$(layero).find("form").find("input[name='parentId']").val(_this.parentId);
							  		$(layero).find("form").find("input[name='pName']").val(_this.parentName);
							  		$(layero).find("form").find("select[name='spread']").parent().css('display', 'none');
							  		$("#btns-form").css("display", "");
							  		Admin.progress();
									Admin.ajaxJson(btnsUrl, {menuId:row[0].id}, function(data){
							      	  	if(data.success && data.btns && data.btns.length > 0) {
							      	  	  	$.each(data.btns, function(i, item){
							      	  	  		_this.addMenuBtns(item);
							      	  	  	})
							      	  	}
							      	});
								}else{
									$(layero).find("form").find("input[name='pName']").parent().css('display', 'none');
									$(layero).find("form").find("input[name='url']").parent().css('display', 'none');
								}
						  	},
						  	btn: ['提交'],
						  	btnAlign: 'r',
						  	yes:function(index, layero){
						  	  	_this.submitMenuEditForm(index, layero);
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
			}
		],
		
		backToParent: function(){
			$("#back-parent-btn").css('display', 'none');
			_this.parentId = 0;
			_this.parentName = "";
			$table.bootstrapTable('destroy');
			_this.initTable();
		},
		
		addMenuBtns: function(btnData){
			var btnNameVal = '';
			var btnTypeVal = '';
			var actionUrlsVal = '';
			if(btnData !== null && btnData!== undefined && btnData !== ''){
				btnNameVal = 'value="'+btnData.btnName+'"';
				btnTypeVal = 'value="'+btnData.btnType+'"';
				actionUrlsVal = 'value="'+btnData.actionUrls+'"';
			}
			var html = '';
			html += '<div name="menu-btn-group">';
			html += 	'<div class="col-sm-3 form-group">';
			html += 		'<input type="text" class="form-control" name="btnName" placeholder="btnName,例：添加" '+btnNameVal+'>';
			html += 	'</div>';
			html += 	'<div class="col-sm-3 form-group">';
			html += 		'<input type="text" class="form-control" name="btnType" placeholder="btnType,例：add" '+btnTypeVal+'>';
			html += 	'</div>';
			html += 	'<div class="col-sm-5 form-group">';
			html += 		'<input type="text" class="form-control" name="actionUrls" placeholder="actionUrls,例：/user/save.do" '+actionUrlsVal+'>';
			html += 	'</div>';
			html += 	'<div class="col-sm-1 form-group" style="">';
			html += 		'<button onclick="Admin.menu.removeMenuBtnGroup(this)" type="button" class="btn btn-default btn-sm">';
			html += 			'<span class="glyphicon glyphicon-trash"></span>';
			html += 		'</button>';
			html += 	'</div>';
			html += '</div>';
			
			$("#btns-form").append(html);
		},
		
		removeMenuBtnGroup: function(button){
			$(button).parent().parent().remove();
		},
		
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

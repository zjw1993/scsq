var Admin = {
	
	STATIC_URL: "http://127.0.0.1:8020/scsq",
	SERVER_URL: "http://localhost:9875/admin",
	
	ajaxJson: function(url, param, callback) {
		$.ajax(url, {
			type: 'get',
		 	dataType: 'json',
		 	data: param,
		 	xhrFields:{ withCredentials:true },
		 	success: function(data){
		 		Admin.closeProgress();
		 		//坚持登录
		 		/*if(!Admin.checkLogin(data)){
		 			return false;
		 		}*/
		 		if($.isFunction(callback)){
		 			callback(data);
		 		}
		 	},
		 	error: function(response, textStatus, errorThrown){
		 		try{
		 			var data = $.parseJSON(response.responseText);
			 		//检查登录
			 		if(!Admin.checkLogin(data)){
			 			return false;
			 		}else{
				 		Admin.alert('提示', data.msg || "请求出现异常,请联系管理员", 2);
				 	}
		 		}catch(e){
		 			console.info(e);
		 			Admin.alert('提示', "请求出现异常,请联系管理员.", 2);
		 		}
		 	},
		 	complete:function(){
		 	
		 	}
		});
	},
	
	ajaxJsonNew: function(url, param, async, callback) {
		$.ajax(url, {
			type: 'get',
		 	dataType: 'json',
		 	data: param,
		 	async: async || true,  // 默认异步
		 	xhrFields:{ withCredentials:true },
		 	success: function(data){
		 		Admin.closeProgress();
		 		//坚持登录
		 		/*if(!Admin.checkLogin(data)){
		 			return false;
		 		}*/
		 		if($.isFunction(callback)){
		 			callback(data);
		 		}
		 	},
		 	error: function(response, textStatus, errorThrown){
		 		try{
		 			var data = $.parseJSON(response.responseText);
			 		//检查登录
			 		if(!Admin.checkLogin(data)){
			 			return false;
			 		}else{
				 		Admin.alert('提示', data.msg || "请求出现异常,请联系管理员", 2);
				 	}
		 		}catch(e){
		 			console.info(e);
		 			Admin.alert('提示', "请求出现异常,请联系管理员.", 2);
		 		}
		 	},
		 	complete:function(){
		 	
		 	}
		});
	},
	
	ajaxHtml: function(url, param, callback){
		$.ajax(url, {
			type: 'post',
		 	dataType: 'html',
		 	data: param,
		 	success: function(html) {
		 		if($.isFunction(callback)){
		 			callback(html);
		 		}
		 	},
		 	error: function(response, textStatus, errorThrown){
		 		try{
		 			Admin.closeProgress();
		 		}catch(e){
		 			console.info(e);
		 			Admin.alert('提示', "请求出现异常,请联系管理员.", 2);
		 		}
		 	},
		 	complete:function(){
		 	
		 	}
		});
	},
	
	toLogin: function(){
		window.top.location = Admin.STATIC_URL + "/pages/login.html";
	},
	
	checkLogin: function(data) { //检查是否登录超时
		if(data.logoutFlag){
			Admin.alert('提示', "登录超时,点击确定重新登录.", 2, Admin.toLogin);
			return false;
		}
		return true;
	},
	
	alert: function(title, msg, icon, callback){
		if($.isFunction(callback)){
		 	layer.alert(msg, {title: title||'提示', icon: icon||1}, function(){
				callback();
			});
 		}else{
 			layer.alert(msg, {title: title||'提示', icon: icon||1});
 		}
	},
	
	warning: function(msg, callback){
		Admin.alert("警告", msg, "", callback);
	},
	
	confirm: function(msg, callback){
		layer.confirm(msg, {icon: 7, title:'提示', btn:['确定', '取消']}, 
			function(){
			  	if($.isFunction(callback)){
			  		callback(true);
			  	}
			},
			function(){
			  	if($.isFunction(callback)){
			  		callback(false);
			  	}
			}
		);
	},
	
	progress: function(msg){
		 layer.msg((msg||'玩儿命加载中...'), {
		  	icon: 16,
		  	shade: 0.01
		});
	},
	
	closeProgress:function(){
		layer.close(layer.index);
	},
	
	/**
	 * 检查已选择一行并且只能是一行数据， 成功则执行回调
	 * @param {Object} $table
	 * @param {Object} callback
	 */
	checkSingleRow: function($table, callback){
		var row = $table.bootstrapTable('getSelections');
		if(!row.length){
			Admin.alert("温馨提示", "请先选择要操作的数据", 7);
			return false;
		}
		if(row.length > 1){
			Admin.alert("温馨提示", "一次只能选择一行", 7);
			return false;
		}
		if($.isFunction(callback)){
			callback(row);
		}
	},
	
	/**
	 * 检查是否选择一行或者一行以上的数据， 成功则执行回调
	 * @param {Object} $table
	 * @param {Object} callback
	 */
	checkSelectRows: function($table, callback){
		var row = $table.bootstrapTable('getSelections');
		if(!row.length){
			Admin.alert("温馨提示", "请至少选择一行", 7);
			return false;
		}
		if($.isFunction(callback)){
			callback(row);
		}
	},
	
	/**
	 * 根据表单组件name 从data中取对应值填充val
	 * @param {Object} $form
	 * @param {Object} data
	 */
	fillForm: function($form, data){
		var inputs = $form.find(".form-control");
		$.each(inputs, function(index, item){
			if(item.tagName == 'INPUT') {
				$(item).val((data[item.name])||'');
			}
			if(item.tagName == 'SELECT') {
				$(item).val(data[item.name]);
			}
			// TODO
		});
	},
	
	checkAllTreeViewChilds: function($treeView, node){
		if(node.nodes != null) {
			$.each(node.nodes, function(i, item){
				$treeView.treeview('checkNode', [item.nodeId, {silent: true}]);
				Admin.checkAllTreeViewChilds($treeView, item);
			})
		}
	},
	unCheckAllTreeViewChilds: function($treeView, node){
		if(node.nodes != null) {
			$.each(node.nodes, function(i, item){
				$treeView.treeview('uncheckNode', [item.nodeId, {silent: true}]);
				Admin.unCheckAllTreeViewChilds($treeView, item);
			})
		}
	},
	
}

var Admin = {
	
	STATIC_URL: "http://127.0.0.1:8020/scsq",
	SERVER_URL: "http://localhost:8080/admin",
	
	
	ajaxJson: function(url, param, callback) {
		//Admin.progress();
		$.ajax(url, {
			type: 'get',
		 	dataType: 'json',
		 	data: param,
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
		 			Admin.closeProgress();
		 			var data = $.parseJSON(response.responseText);
			 		//检查登录
			 		if(!Admin.checkLogin(data)){
			 			return false;
			 		}else{
				 		Admin.alert('提示', data.msg || "请求出现异常,请联系管理员", 'error');
				 	}
		 		}catch(e){
		 			console.info(e);
		 			Admin.alert('提示', "请求出现异常,请联系管理员.", 'error');
		 		}
		 	},
		 	complete:function(){
		 	
		 	}
		});
	},
	
	ajaxHtml: function(url, param, callback){
		/*Admin.progress();*/
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
		 			Admin.alert('提示', "请求出现异常,请联系管理员.", 'error');
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
			Admin.closeProgress();
			Admin.alert('提示', "登录超时,点击确定重新登录.", 'error', Admin.toLogin);
			return false;
		}
		return true;
	},
	
	alert: function(title, msg, icon, callback){
		if($.isFunction(callback)){
		 	layer.alert(msg, {title: title, icon: 6}, function(){
				callback();
			});
 		}else{
 			layer.alert(msg, {title: title, icon: 6});
 		}
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
	
}

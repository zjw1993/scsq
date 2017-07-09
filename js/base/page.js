var Page = {

	/*var option = [
		{
			name: "",
			btnType: "",
			icon: "",
			handler: function(){
				
			}
		}
	],
	Page.initToolbar(option);
	*/

	/**
	 * 初始化搜索栏下方的toolbar  按钮组件
	 * @param {Object} toolbar
	 */
	initToolbar: function(toolbar){
		//var _url = Admin.SERVER_URL + "/sys/getActionBtn.do";
		var _url = Admin.STATIC_URL + "/datas/getActionBtn.json";
		console.log(window.location.href)
		var _data = {'url': window.location.href};
		
		var newBars = [];
		$.ajax(_url, {
			type: 'get',   // TODO 正式使用改成post
		 	dataType: 'json',
		 	data: _data,
		 	success: function(data){
		 		if(data.success) {
					$.each(toolbar, function(index, item){
						if($.inArray(item.name, data.btns) >= 0) {
							newBars.push({name:item.name, icon:item.icon, btnType:"admin-toolbar-btn"+index, handler:item.handler});
						}
					});
					Page.showToolbar(newBars);
					
				}else{
					Page.showToolbar(newBars);
					Admin.alert('提示', data.msg);
				}
		 	},
		 	error: function(response, textStatus, errorThrown){
		 		Page.showToolbar(newBars);
		 	},
		 	complete:function(){
		 		
		 	}
		});
	},
	
	showToolbar: function(toolbar) {
		var tbhtml = "";
		$.each(toolbar, function(index, item) {
			var iconClass = "";
			$.each(Page.icons, function(i, con) {
				if(con.name == item.icon) {
					iconClass = con.value;
				}
			});
			tbhtml += "<button class='btn btn-default btn-xs' id='" + item.btnType + "'>"
						+ "<span class='" + iconClass + "' aria-hidden='true'></span>"
						+ item.name
					+ "</button>";
		});
		var adminHeaderToolbar = $(".admin-content-toolbar");
		if(adminHeaderToolbar) {
			adminHeaderToolbar.empty();
			adminHeaderToolbar.append(tbhtml);
		}else {
			var adminHeaderSearch = $(".admin-content-search");
			if(adminHeaderSearch) {
				tbhtml = "<div class='admin-content-toolbar'>" + tbhtml + "</div>";
				adminHeaderSearch.after(tbhtml);
			}else {
				var adminContentHeader = $(".admin-content-header");
				if(adminContentHeader) {
					tbhtml = "<div class='admin-content-toolbar'>" + tbhtml + "</div>";
					adminContentHeader.append(tbhtml);
				}else {
					tbhtml = "<div class='admin-content-header'><div class='admin-content-toolbar'>" + tbhtml + "</div></div>";
					$("body").prepend(tbhtml);
				}
			}
		}
		$.each(toolbar, function(index, item){
			//console.log($(item.btnType))
			$("#"+item.btnType).click(function(){
				item.handler();
			});
		});
	},
	
	icons : [
		{
			name: "none",
			value: "",
		},
		{
			name:"search",
			value:"glyphicon glyphicon-search"
		},
		{
			name: "save",
			value: "glyphicon glyphicon-plus"
		},
		{
			name: "edit",
			value: "glyphicon glyphicon-pencil"
		},
		{
			name: "delete",
			value: "glyphicon glyphicon-minus"
		},
		{
			name: "download",
			value: "glyphicon glyphicon-download-alt"
		},
		{
			name: "export",
			value: "glyphicon glyphicon-share-alt"
		},
		{
			name: "user",
			value: "glyphicon glyphicon-user"
		}
	],
	
	
}

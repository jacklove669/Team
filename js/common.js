function getQueryString(t){return t?getParamsFromUrl(window.location.search)[t]:""}function getParamsFromUrl(t){var e=new Object;if(-1!=t.indexOf("?"))for(var r=t.substr(1).split("&"),a=0;a<r.length;a++)e[r[a].split("=")[0]]=decodeURI(r[a].split("=")[1]);return e}function reportStat(t){$.ajax({data:{city_id:t,app_id:998,channel_id:50003},url:"http://tool.zuimeitianqi.com/dataReport/report/reportH5Stat",dataType:"jsonp",jsonp:"callback",jsonpCallback:"callback",success:function(t){}},!1)}Date.prototype.Format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var r in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),e)new RegExp("("+r+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[r]:("00"+e[r]).substr((""+e[r]).length)));return t};
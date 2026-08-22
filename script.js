const restaurants=[
{id:1,name:"暖鍋日常",type:"火鍋",address:"台中市西區公益路 68 號",lat:24.1505,lng:120.6638,rating:4.8,h:["11:00","21:30"]},
{id:2,name:"川味小鍋",type:"火鍋",address:"台中市西屯區福星路 215 號",lat:24.1818,lng:120.6466,rating:4.3,h:["11:30","22:00"]},
{id:3,name:"東京拉麵所",type:"日式",address:"台中市北區學士路 120 號",lat:24.1614,lng:120.6831,rating:4.7,h:["11:30","21:30"]},
{id:4,name:"韓味食堂",type:"韓式",address:"台中市北區漢口路四段 35 號",lat:24.1672,lng:120.6762,rating:4.5,h:["11:30","21:30"]},
{id:5,name:"炭火燒肉町",type:"燒肉",address:"台中市南屯區大墩路 580 號",lat:24.1458,lng:120.6497,rating:4.9,h:["17:00","22:00"]},
{id:6,name:"小麥漢堡",type:"速食",address:"台中市西區公益路 155 號",lat:24.1501,lng:120.6571,rating:4.2,h:["10:30","22:00"]},
{id:7,name:"深夜拉麵屋",type:"日式",address:"台中市西區中美街 88 號",lat:24.1476,lng:120.6630,rating:4.6,h:["17:00","23:30"]},
{id:8,name:"台北小火鍋",type:"火鍋",address:"台北市大安區復興南路一段 120 號",lat:25.0435,lng:121.5438,rating:4.4,h:["11:00","21:30"]},
{id:9,name:"台北日和",type:"日式",address:"台北市大安區忠孝東路四段 180 號",lat:25.0412,lng:121.5460,rating:4.8,h:["11:30","21:30"]}
];

const $=id=>document.getElementById(id), type=$("type"), dist=$("distance"), sort=$("sort"), list=$("list"), empty=$("empty");
let loc=null,searched=false;
const demo={taichung:[24.151,120.663,"台中市區（展示位置）"],taipei:[25.042,121.545,"台北市區（展示位置）"]};

function km(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,A=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return R*2*Math.atan2(Math.sqrt(A),Math.sqrt(1-A))}
function min(t){let[a,b]=t.split(":").map(Number);return a*60+b}
function openNow(x){let n=new Date(),v=n.getHours()*60+n.getMinutes();return v>=min(x.h[0])&&v<min(x.h[1])}
function until(x){return min(x.h[1])-(new Date().getHours()*60+new Date().getMinutes())}
function esc(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function setLoc(a,b,label){loc={lat:a,lng:b};$("locationStatus").textContent="已取得目前位置："+label;$("locationStatus").style.color="#168653";update();if(searched)render()}
$("locationBtn").onclick=()=>{if(!navigator.geolocation){$("locationStatus").textContent="此瀏覽器不支援定位功能。";return}$("locationStatus").textContent="正在取得位置……";navigator.geolocation.getCurrentPosition(p=>setLoc(p.coords.latitude,p.coords.longitude,"GPS 定位"),()=>{$("locationStatus").textContent="無法取得目前位置，請允許瀏覽器使用定位功能。";$("locationStatus").style.color="#c84d58"})}
$("demoBtn").onclick=()=>{let x=demo[$("demoLocation").value];setLoc(...x)}
[type,dist,sort].forEach(x=>x.onchange=()=>{update();if(searched)render()})
$("pick").onclick=()=>{if(!loc){$("locationStatus").textContent="請先取得目前位置，再進行餐廳搜尋。";$("locationStatus").style.color="#c84d58";return}searched=true;render()}

function update(){let t=type.value==="all"?"不限類型":type.value;$("summary").textContent=loc?`${t}・${dist.value} km 內・${sort.value==="rating"?"評分最高":"距離最近"}`:"請先取得位置"}
function matches(){return restaurants.map(x=>({...x,d:km(loc.lat,loc.lng,x.lat,x.lng),o:openNow(x),u:until(x)})).filter(x=>(type.value==="all"||x.type===type.value)&&x.d<=+dist.value&&x.o).sort((a,b)=>sort.value==="distance"?a.d-b.d||b.rating-a.rating:b.rating-a.rating||a.d-b.d)}
function render(){let m=matches();list.innerHTML="";$("count").textContent=`符合條件的餐廳：${m.length} 家`;empty.hidden=m.length>0;if(!m.length){empty.querySelector("h3").textContent="目前沒有符合條件的餐廳";empty.querySelector("p").textContent="請調整餐廳類型或增加搜尋距離。";return}m.forEach(x=>{let close=x.u<=60&&x.u>0;let e=document.createElement("article");e.className="restaurant";e.innerHTML=`<div><h3>${esc(x.name)}</h3> <span class="tag">${esc(x.type)}</span> <span class="rating">⭐ ${x.rating.toFixed(1)}</span><div class="info"><span>📍 距離你 ${x.d.toFixed(1)} km</span><span>🕐 ${x.h[0]}～${x.h[1]}</span></div><p class="address">📍 ${esc(x.address)}</p><p class="hours"><b>完整營業時間：</b>每日 ${x.h[0]}～${x.h[1]}</p></div><div class="status ${close?"closing":""}">${close?`⚠️ 距離打烊約 ${x.u} 分鐘`:"🟢 營業中"}<br>營業時間 ${x.h[0]}～${x.h[1]}</div>`;list.appendChild(e)})}
function clock(){let n=new Date();$("clock").textContent=n.toLocaleString("zh-TW",{hour12:false});if(searched&&loc)render()}
setInterval(clock,1000);clock();update();
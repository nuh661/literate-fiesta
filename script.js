const MENU=[
{id:1,cat:"Кофе",name:"Эспрессо",desc:"Двойная порция, плотный вкус.",price:130},
{id:2,cat:"Кофе",name:"Капучино",desc:"Эспрессо и бархатная молочная пенка.",price:190},
{id:3,cat:"Кофе",name:"Раф с кардамоном",desc:"Сливки, ваниль и щепотка кардамона.",price:240},
{id:4,cat:"Кофе",name:"Фильтр-кофе",desc:"Сорт недели, спросите бариста.",price:170},
{id:5,cat:"Завтраки",name:"Сырники",desc:"Со сметаной и ягодным соусом.",price:280},
{id:6,cat:"Завтраки",name:"Омлет с зеленью",desc:"Три яйца, сыр и тосты.",price:310},
{id:7,cat:"Завтраки",name:"Овсяная каша",desc:"На молоке, с мёдом и орехами.",price:220},
{id:8,cat:"Десерты",name:"Круассан",desc:"Сливочный, из утренней выпечки.",price:150},
{id:9,cat:"Десерты",name:"Медовик",desc:"Домашний, с заварным кремом.",price:210},
{id:10,cat:"Напитки",name:"Чай с облепихой",desc:"Чайник на двоих.",price:260},
{id:11,cat:"Напитки",name:"Лимонад дня",desc:"Свежие фрукты и мята.",price:200}
];
const HOURS=[["Пн","08:00","22:00"],["Вт","08:00","22:00"],["Ср","08:00","22:00"],["Чт","08:00","22:00"],["Пт","08:00","23:00"],["Сб","09:00","23:00"],["Вс","09:00","21:00"]];
const $=s=>document.querySelector(s);
const cart={};let cat="Все";
const fmt=n=>n.toLocaleString("ru-RU")+" сом";

function renderTabs(){
  const cats=["Все",...new Set(MENU.map(m=>m.cat))];
  $("#tabs").innerHTML=cats.map(c=>`<button class="tab" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join("");
  $("#tabs").querySelectorAll(".tab").forEach(b=>b.onclick=()=>{cat=b.dataset.c;renderTabs();renderMenu()});
}
function renderMenu(){
  const list=MENU.filter(m=>cat==="Все"||m.cat===cat);
  $("#menu-grid").innerHTML=list.map(m=>`<article class="item"><h3>${m.name}</h3><p>${m.desc}</p>
  <div class="foot"><span class="price">${fmt(m.price)}</span><button class="add" data-id="${m.id}">Добавить</button></div></article>`).join("");
  $("#menu-grid").querySelectorAll(".add").forEach(b=>b.onclick=()=>change(+b.dataset.id,1));
}
function change(id,d){
  cart[id]=(cart[id]||0)+d;
  if(cart[id]<=0)delete cart[id];
  renderCart();
}
function renderCart(){
  const ids=Object.keys(cart).map(Number);
  let sum=0,cnt=0;
  $("#lines").innerHTML=ids.length?ids.map(id=>{
    const m=MENU.find(x=>x.id===id),q=cart[id];sum+=m.price*q;cnt+=q;
    return `<div class="line"><div>${m.name}<br><small>${fmt(m.price*q)}</small></div>
    <div class="qty"><button data-id="${id}" data-d="-1" aria-label="Убрать одну">−</button><span>${q}</span><button data-id="${id}" data-d="1" aria-label="Добавить одну">+</button></div></div>`}).join("")
    :`<p class="msg">Пока пусто. Добавьте блюда из меню.</p>`;
  $("#lines").querySelectorAll(".qty button").forEach(b=>b.onclick=()=>change(+b.dataset.id,+b.dataset.d));
  $("#sum").textContent=fmt(sum);$("#cnt").textContent=cnt;
}
function toggle(open){
  $("#drawer").classList.toggle("open",open);
  $("#drawer").setAttribute("aria-hidden",String(!open));
}
$("#openCart").onclick=()=>toggle(true);
$("#closeCart").onclick=()=>toggle(false);
$("#send").onclick=()=>{
  const msg=$("#msg"),name=$("#name").value.trim(),phone=$("#phone").value.trim();
  if(!Object.keys(cart).length){msg.textContent="Добавьте хотя бы одно блюдо.";return}
  if(!name||phone.replace(/\D/g,"").length<9){msg.textContent="Укажите имя и телефон, чтобы мы могли связаться с вами.";return}
  msg.textContent=`Спасибо, ${name}! Заказ принят, мы позвоним вам для подтверждения.`;
  for(const k in cart)delete cart[k];
  renderCart();
};
function hours(){
  const now=new Date(),d=(now.getDay()+6)%7;
  $("#hours").innerHTML=HOURS.map((h,i)=>`<div class="${i===d?"today":""}"><span>${h[0]}</span><span>${h[1]}–${h[2]}</span></div>`).join("");
  const [,o,c]=HOURS[d],mins=t=>+t.slice(0,2)*60+ +t.slice(3);
  const cur=now.getHours()*60+now.getMinutes(),isOpen=cur>=mins(o)&&cur<mins(c);
  $("#dot").className="dot"+(isOpen?" on":"");
  $("#open").textContent=isOpen?`Открыто до ${c}`:`Сейчас закрыто. Откроемся в ${o}`;
}
renderTabs();renderMenu();renderCart();hours();

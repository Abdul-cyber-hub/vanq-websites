/* VANQ: project vault, payment and unlock logic */
(function(){
  /* Owner settings: put your UPI ID here, for example "name@bank". */
  var UPI_ID="", UPI_NAME="Vanq", PRICE="100", WA="918056403555";
  var SALT="EUh5gxa24hMDZyzsZ+qEmQ==",IV="uWgOHwem8n/SKAr2",CT="P0LfXBj6fW+8blFzrr0htSg/M/A4JRls8N8Zdm69J8WX8KfgiqBxTQOIjEEws1wdpqgxuggWDd+M8GtA/bfQeuGi/eZE9ES/ltckcNbQ2hqbrkZAKIrVbw2c43iYge2XVn3j8o6IbT02FXLm1CnQ84pVM2Vd1MHm4H3nX+t8LNp/Q8oAq//RJk2umNLPhQpDpzQXnShfk04nhO/0pir8d4BekNdPgX7f+MZ1qEltWvMB3hP0TTxy6A5QZJDik139TDUb6vp6TgLXM+fv8WuuYPUpdYtnwwPLciDydg6shjuVPO7TjESaHFIITAsyP1/riLZ+HIYHky6c4CnD99WJSQ637rBVUmwkhX8GzefBIPovHvMac9wRAhw6yyVjRMmzmRiJj2cHUscl6Wz/q2mtGiyKWpyjKhnnc24SPAGkRVhVYilYbztrPifhH2C0nV0JxfeG8GT91gWL1CLIMG7aK9CfawHsBIASG63nvCZ4E8i/Jz+Om3HyveRPBqZoAYZVbPQSbtM5qBnbEGzjfZIl4SvaFjyiKuRnXgQVmL7pmTwbvHcy3yuwCFgOwu0jTVAWDCIWj+XRlNuRP/xcQXSaK7QyRUbmmu9Koc8X5KiNsqRBIx7RXpttND5B2ArLL784Wr73ca6iVEy1NkOdrhy8K8WZtn64pJdQtEhEnoI88fBbwkPhB57q2ZG7h3aX6k0qTRm5Tsy/eaJ6k9BvN3zAFdnRUnvq/hlf25+XBJtJTWwLcltpjhNSNEkmbxfDutVaCku39d1KBfOotQjPLVn477m4rM1OmnqJo6bTXIGKHoaZfsFiCa3pxq6+6UUIVfXJVmVoSL83pis899MfhtF4bUHTsF7L9nPoa+/Y+5e7Vp7dPxSY2udQC24RZhN1BpfrkGag15y3HBwdkxl/A43RM1HLq2RphSJamuloUyOgaFGnt2oU867voijE1iHmmvo8zAIuDngzk21vjhkXNY0Ma4NRyA6MsdinAnVpcHcAM89Zv35VSAehkXRIOIYo+9u5nmlA8Y0Fod9QdMUXvMHy0RDwQEM8SRHrHlWCQRIYSw369KuLCpJb0W3qQ7h4OSzQjIegGeLCOVaQT45fLG2ojVZU+Xp9Gf7kP8ktwBi3rgnfssKSiT128gaDJNG6BTQEYpsAxiOnFj2uOTKJpXA/v/a47ddx2oBSSFqZ2h/8rgviIJ4unUyWGdMtV/qJomycUDwueog9KVZe99dnAHXahcuvToKnWK29MS0j6A/MgO/LIWRDhX5SPcB37xRkt36TCAXVEOI6NfLEWuWZZYctt0SAL/X1RCtdJSjuRJ0/zvCQDzTuGYk6I2Al1M1dJ1bXrX4dJ6jxccEioa+PgTbAZM+gCVfWUeinAC09lcc1D+dujwC/o7nWXCCNfUpAvpq+DT3uGjTBx7YB3N7QYV34udnu3l43fMMukAwjuZdVQPevh4smZCZOgRWPikp1OyN2p9VqnbrCZi3dGB0AedTrlzLhicTuZER7X0iChaMIkZXkYp3nHOgpw/l3VQVzDwYwBoosD4wjSuHD0WhhnMohxOBr7Lp4YIGElqW73DM7a5VuBhAaJ7J9iNxNZFjIddrjTXq1k5lo55VQt6REGIZ1ovKDYQ2HtnwQdIz+aG90yYYIemNGhdp/toSBs5/EJdfK3dN6",N=12;
  var $=function(i){return document.getElementById(i)};
  var grid=$('vaultGrid');
  for(var i=0;i<N;i++){var d=document.createElement('div');d.className='card lock';d.innerHTML='<span aria-hidden="true">🔒</span><i></i><i></i><i></i>';grid.appendChild(d);}
  var modal=$('modal'),msg=$('msg');
  function payUrl(){
    if(UPI_ID) return 'upi://pay?pa='+encodeURIComponent(UPI_ID)+'&pn='+encodeURIComponent(UPI_NAME)+'&am='+PRICE+'&cu=INR&tn='+encodeURIComponent('Vanq project vault');
    return 'https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Vanq, I want to unlock the project vault for ₹'+PRICE+'. Please send payment details.');
  }
  $('payBtn').onclick=function(){$('payLink').href=payUrl();msg.textContent='';modal.classList.add('on');$('code').focus();};
  $('cl').onclick=function(){modal.classList.remove('on')};
  modal.addEventListener('click',function(e){if(e.target===modal)modal.classList.remove('on')});
  addEventListener('keydown',function(e){if(e.key==='Escape')modal.classList.remove('on')});
  function b64(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
  async function open(code){
    var km=await crypto.subtle.importKey('raw',new TextEncoder().encode(code),'PBKDF2',false,['deriveKey']);
    var k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(SALT),iterations:100000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
    var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(IV)},k,b64(CT));
    return JSON.parse(new TextDecoder().decode(pt));
  }
  function show(list){
    grid.innerHTML='';
    list.forEach(function(x){var c=document.createElement('div');c.className='card';
      var h=document.createElement('h3');h.textContent=x[0];var p=document.createElement('p');p.textContent=x[1];
      var a=document.createElement('a');a.className='sold';a.href='https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Vanq, I unlocked the vault and want this project: '+x[0]);a.target='_blank';a.rel='noopener';a.textContent='Choose this project';
      c.appendChild(h);c.appendChild(p);c.appendChild(a);grid.appendChild(c);});
    $('vt').textContent='Vault unlocked.';$('vp').textContent='Pick an idea and message us to start your project.';
    $('payBtn').style.display='none';modal.classList.remove('on');
    grid.scrollIntoView({behavior:'smooth',block:'start'});
  }
  $('go').onclick=async function(){
    var v=$('code').value.trim();if(!v){msg.textContent='Enter your unlock code.';return}
    msg.style.color='#8d93b0';msg.textContent='Checking…';
    try{var l=await open(v);try{localStorage.setItem('vq',v)}catch(e){}show(l);}
    catch(e){msg.style.color='#ff8aa0';msg.textContent='That code is not correct. Check it and try again.';}
  };
  $('code').addEventListener('keydown',function(e){if(e.key==='Enter')$('go').click()});
  try{var s=localStorage.getItem('vq');if(s)open(s).then(show).catch(function(){})}catch(e){}

  })();

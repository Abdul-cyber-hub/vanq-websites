/* VANQ: 3D power core (Three.js r128 must load first) */
(function(){
  var cv=document.getElementById('bg');
  if(typeof THREE==='undefined'){cv.style.display='none';return;}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  r.setPixelRatio(Math.min(devicePixelRatio,2));
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=9;
  var BLUE=0x2d7bff,VIO=0x8a4dff;
  function glowTex(){var c=document.createElement('canvas');c.width=c.height=128;var g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);
    gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
  sc.add(new THREE.AmbientLight(0x222244,1));
  var L1=new THREE.PointLight(0x2d7bff,3.2,40);L1.position.set(-6,4,6);sc.add(L1);
  var L2=new THREE.PointLight(0x8a4dff,3,40);L2.position.set(6,-3,5);sc.add(L2);
  var L3=new THREE.PointLight(0xffffff,1.6,40);L3.position.set(0,6,8);sc.add(L3);
  var tex=glowTex(),reactor=new THREE.Group();sc.add(reactor);
  reactor.add(new THREE.Mesh(new THREE.SphereGeometry(.7,32,32),new THREE.MeshBasicMaterial({color:0xe8f0ff})));
  var halos=[[4,BLUE,.9],[7,VIO,.55],[11,BLUE,.3]].map(function(h){
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:h[1],blending:THREE.AdditiveBlending,transparent:true,opacity:h[2],depthWrite:false}));
    sp.scale.set(h[0],h[0],1);sp.userData.o=h[2];sp.userData.s=h[0];reactor.add(sp);return sp;});
  var cage=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),new THREE.MeshBasicMaterial({color:VIO,wireframe:true,transparent:true,opacity:.5}));reactor.add(cage);
  var metal=new THREE.MeshPhongMaterial({color:0xb9c4d8,specular:0xffffff,shininess:140});
  var Q=new THREE.Group();
  Q.add(new THREE.Mesh(new THREE.TorusGeometry(2.9,.34,32,120),metal));
  var tail=new THREE.Mesh(new THREE.BoxGeometry(1.7,.42,.42),metal);tail.position.set(2.1,-2.1,0);tail.rotation.z=-Math.PI/4;Q.add(tail);
  var V=new THREE.Mesh(new THREE.ConeGeometry(.9,1.6,3),new THREE.MeshPhongMaterial({color:0x2d7bff,emissive:0x2d7bff,emissiveIntensity:.5,specular:0xffffff,shininess:100}));V.rotation.z=Math.PI;V.position.y=.1;Q.add(V);
  reactor.add(Q);
  var cage2=new THREE.Mesh(new THREE.IcosahedronGeometry(2.3,0),new THREE.MeshBasicMaterial({color:BLUE,wireframe:true,transparent:true,opacity:.35}));reactor.add(cage2);
  var rings=[[3.1,BLUE,0,0],[3.7,VIO,1.2,.4],[4.3,BLUE,.5,1.3]].map(function(c){
    var m=new THREE.Mesh(new THREE.TorusGeometry(c[0],.03,10,180),new THREE.MeshBasicMaterial({color:c[1],transparent:true,opacity:.8,blending:THREE.AdditiveBlending}));
    m.rotation.x=c[2];m.rotation.y=c[3];reactor.add(m);return m;});
  var n=1400,pos=new Float32Array(n*3),col=new Float32Array(n*3),seed=[];
  for(var i=0;i<n;i++){var rad=1.2+Math.pow(Math.random(),1.6)*5,a=Math.random()*6.283,y=(Math.random()-.5)*(.6+rad*.5);
    seed.push([rad,a,y,.4+Math.random()*1.2/(rad*.5+.5)]);
    var c=new THREE.Color(Math.random()<.35?VIO:BLUE);c.multiplyScalar(.6+Math.random()*.6);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
  var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));pg.setAttribute('color',new THREE.BufferAttribute(col,3));
  var plasma=new THREE.Points(pg,new THREE.PointsMaterial({size:.06,vertexColors:true,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));reactor.add(plasma);
  var mx=0,my=0,tx=0,ty=0,t=0,charge=0,hold=false;
  var arcs=[];for(var q=0;q<10;q++){var ag=new THREE.BufferGeometry();ag.setAttribute('position',new THREE.BufferAttribute(new Float32Array(36),3));
    var al=new THREE.Line(ag,new THREE.LineBasicMaterial({color:q%2?VIO:0x9cc4ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending}));reactor.add(al);arcs.push(al);}
  function zap(l){var p=l.geometry.attributes.position.array,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),R=2.4+Math.random()*.7,
    ex=R*Math.sin(b)*Math.cos(a),ey=R*Math.sin(b)*Math.sin(a),ez=R*Math.cos(b);
    for(var k=0;k<12;k++){var f=k/11,j=(k>0&&k<11)?.45:0;p[k*3]=ex*f+(Math.random()-.5)*j;p[k*3+1]=ey*f+(Math.random()-.5)*j;p[k*3+2]=ez*f+(Math.random()-.5)*j;}
    l.geometry.attributes.position.needsUpdate=true;}
  addEventListener('pointerdown',function(e){if(!e.target.closest('a,button,input,#modal'))hold=true});
  ['pointerup','pointercancel','blur'].forEach(function(n){addEventListener(n,function(){hold=false})});
  addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
  function size(){var w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
    var wide=w>820;reactor.position.set(wide?3.3:0,wide?0:2.5,0);reactor.scale.setScalar(wide?1:.8);}
  addEventListener('resize',size);size();
  function frame(){
    charge+=((hold?1:0)-charge)*(hold?.03:.05);t+=.016*(1+charge*2.5);tx+=(mx-tx)*.04;ty+=(my-ty)*.04;
    var p=pg.attributes.position.array;
    for(var i=0;i<n;i++){var s=seed[i],a=s[1]+t*s[3];p[i*3]=Math.cos(a)*s[0];p[i*3+1]=s[2]+Math.sin(t*s[3]*2+i)*.12;p[i*3+2]=Math.sin(a)*s[0];}
    pg.attributes.position.needsUpdate=true;
    var pulse=1+Math.sin(t*2.2)*.08+charge*.3;arcs.forEach(function(l){if(Math.random()<.05+charge*.5){zap(l);l.material.opacity=.95}else l.material.opacity*=.82});
    halos.forEach(function(h,i){var q=pulse+Math.sin(t*1.3+i)*.04;h.scale.set(h.userData.s*q,h.userData.s*q,1);h.material.opacity=h.userData.o*(.85+Math.sin(t*2.2+i)*.15)});
    cage.rotation.y=t*.7;cage.rotation.x=t*.4;cage2.rotation.y=-t*.35;cage2.rotation.z=t*.2;Q.rotation.y=Math.sin(t*.5)*.6;Q.rotation.x=Math.cos(t*.4)*.15;
    rings.forEach(function(m,i){m.rotation.z+=.004*(i+1)*(i%2?-1:1);m.rotation.x+=.002*(i+1)});
    reactor.rotation.y=tx*1.1;reactor.rotation.x=ty*.8;
    var s=Math.min(scrollY/innerHeight,1.3);cam.position.z=9+s*3.5;cam.position.y=-s*.7;cam.lookAt(0,0,0);
    r.render(sc,cam);if(!reduce)requestAnimationFrame(frame);
  }
  frame();
})();

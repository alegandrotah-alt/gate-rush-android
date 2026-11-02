// ---------- gamepad: left stick / d-pad to fly, A or RT for the Big One, Start to pause ----------
let padPrev={};
function pollPad(){
  const pads=navigator.getGamepads?navigator.getGamepads():[];const p=pads&&[...pads].find(x=>x);if(!p||!S)return;
  const ax=p.axes[0]||0,ay=p.axes[1]||0,b=i=>p.buttons[i]&&p.buttons[i].pressed;
  const dx=(Math.abs(ax)>.2?ax:0)+(b(15)?1:0)-(b(14)?1:0),dy=(Math.abs(ay)>.2?ay:0)+(b(13)?1:0)-(b(12)?1:0);
  if(S.running&&(dx||dy)){S.cannon.tx=S.cannon.x+dx*70;S.cannon.ty=S.cannon.y+dy*70}
  const press=i=>b(i)&&!padPrev[i];
  if(press(0)||press(7))fireBig();
  if(press(9))togglePause();
  if(press(3)&&S.running&&R.pendingPicks>0)openPick('Level up!');
  if(press(0)){const el=[...document.querySelectorAll('.overlay:not([hidden]) button:not([disabled])')][0];if(!S.running&&el&&document.activeElement&&document.activeElement.tagName==='BUTTON')document.activeElement.click()}
  for(let i=0;i<16;i++)padPrev[i]=b(i);
}

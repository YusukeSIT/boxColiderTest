var target = document.getElementById('target');
var pos = target.getAttribute('position');
var new_box = document.createElement('a-box');
new_box.setAttribute('color', 'yellow');
new_box.setAttribute('box-colider', '');
document.querySelector('a-scene').appendChild(new_box);
var cam = document.getElementById('camera');

var pipe = document.getElementById('1');


function zoom(event) {
  event.preventDefault();

  pos.z += event.deltaY * -0.003;

  // Restrict scale
  pos.z = Math.min(Math.max(-7, pos.z), -2);

  // Apply scale transform
  target.setAttribute('position', pos)
  console.log(pos);
}


document.body.addEventListener('wheel', zoom, {passive: false});
document.addEventListener('click', () => {
  document.querySelectorAll('.permission_ui').forEach((del) => {
    del.setAttribute('class', 'deleted_ui');
  });
  document.getElementById('main').removeAttribute('style');
  if (window.DeviceMotionEvent && window.DeviceMotionEvent.requestPermission) {
    DeviceMotionEvent.requestPermission()
                     .then((state) => {
                       if (state === 'granted') {
                         new_box.setAttribute('color', 'gray');
                       } else {
                         alert('動作と方向へのアクセスを許可してください');
                       }
                     })
                     .catch((err) => console.error(err));
                     new_box.setAttribute('color', 'white');
  } else {
    new_box.setAttribute('color', 'black');
  }
  init();
});

var target_area = document.createElement('a-plane');
target_area.setAttribute('color', 'red');
target_area.setAttribute('opacity', '0.5');
target_area.setAttribute('position', '0 0 2');
target_area.setAttribute('scale', '0.6 0.6 0.6');
target_area.setAttribute('rotation', '0 180 0');

document.querySelector('a-scene').appendChild(target_area);






const tpCache = [];

function init() {
  const el = document.querySelector('body');
  el.ontouchstart = start_handler;
  el.ontouchmove = move_handler;
  // touchcancel と touchend に同じハンドラーを使用
  el.ontouchcancel = end_handler;
  el.ontouchend = end_handler;

  //ランダムな位置に筒を配置

}

function handle_pinch_zoom(ev) {
  if (ev.targetTouches.length == 2) {
    // 2 つのタッチが、 2 タッチを開始したのと同じタッチかどうかを確認
    const point1 = tpCache.findLastIndex(
      (tp) => tp.identifier === ev.targetTouches[0].identifier,
    );
    const point2 = tpCache.findLastIndex(
      (tp) => tp.identifier === ev.targetTouches[1].identifier,
    );

    if (point1 >= 0 && point2 >= 0) {
      // 開始座標と移動座標の差を計算
      const diff1 = Math.abs(
        tpCache[point1].clientX - tpCache[point2].clientX,
      );
      const diff2 = Math.abs(
        ev.targetTouches[0].clientX - ev.targetTouches[1].clientX,
      );
      pos.z += (diff1 - diff2) * -0.003;
      // Restrict scale
    pos.z = Math.min(Math.max(-7, pos.z), -2);

    // Apply scale transform
    target.setAttribute('position', pos);

    } else {
      // empty tpCache
      tpCache = [];
    }
  }
}

function start_handler(ev) {
  ev.preventDefault();
  // 2タッチピンチ/ズームを後で処理するためにタッチ点をキャッシュする
  if (ev.targetTouches.length == 2) {
    for (let i = 0; i < ev.targetTouches.length; i++) {
      tpCache.push(ev.targetTouches[i]);
    }
  }   
  new_box.setAttribute('color', 'cyan');
}

function move_handler(ev) {
  ev.preventDefault();
  if (!(ev.touches.length === 2 && ev.targetTouches.length === 2)) {
    new_box.setAttribute('color', 'green');
  }

  // 2 タッチの移動/ピンチ/ズームジェスチャーでは、このイベントをチェックする
  handle_pinch_zoom(ev);
}

function end_handler(ev) {
  ev.preventDefault();

  if (ev.targetTouches.length === 0) {
    new_box.setAttribute('color', 'yellow');
  }
}

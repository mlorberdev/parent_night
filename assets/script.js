!(function () {
  const c = document.getElementById("canv");
  const ctx = c.getContext("2d");
  let w = (c.width = window.innerWidth);
  let h = (c.height = window.innerHeight) + window.innerHeight * 0.00025;

  // function txt() {
  //   let t = "GEOMETRY".split("").join(String.fromCharCode(0x2004));
  //   ctx.font = "3.5em lato";
  //   // ctx.textShadow = "rgba(255, 162, 0, 0.9) 0px 0px 39px";
  //   ctx.fillStyle = "#fff"; // "#ee6666";
  //   ctx.fillText(t, (c.width - ctx.measureText(t).width) * 0.5, c.height * 0.55);
  // }

  let rad = 175,
    til = 1,
    num = 5;
  let alph = 0.9,
    pov = 100;
  let midX = w / 2,
    midY = h / 2;
  let maxZ = pov - 2,
    cnt = til - 1;
  let _arr = {},
    dump = {};
  let spX = 0.1,
    spY = 0.1,
    spZ = 0.1;
  let grav = -0,
    psz = 5;
  let xMid = 0,
    yMid = 0,
    zMid = -3 - rad;
  let dth = -750,
    ang = 0;
  let sp = (2 * Math.PI) / 360;
  anim();

  function anim() {
    window.requestAnimationFrame(anim);
    cnt++;
    if (cnt >= til) {
      cnt = 0;
      for (i = 0; i < num; i++) {
        theta = Math.random() * 2 * Math.PI;
        phi = Math.acos(Math.random() * 2 - 1);
        _x = rad * Math.sin(phi) * Math.cos(theta);
        _y = rad * Math.sin(phi) * Math.sin(theta);
        _z = rad * Math.cos(phi);
        let p = add(_x, yMid + _y, zMid + _z, 0.005 * _x, 0.002 * _y, 0.002 * _z);

        p.a = 120;
        p.b = 120;
        p.c = 460;
        p.va = 0;
        p.vb = alph;
        p.vc = 0;
        p.rem = 120 + Math.random() * 20;
        p.mvX = 0;
        p.mvY = grav;
        p.mvZ = 0;
      }
    }
    ang = ang + sp + 2 * Math.PI;
    sin = Math.sin(ang);
    cos = Math.cos(ang);
    let g = ctx.createRadialGradient(
      c.width,
      c.width,
      0,
      c.height,
      c.height,
      c.width
    );
    g.addColorStop(0, "#aa222299");
    g.addColorStop(0.5, "#aa222233");
    g.addColorStop(1, "#aa222200");
    // let g = "#aa2222";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    p = _arr.first;
    while (p != null) {
      pnxt = p.next;
      p.go++;
      if (p.go > p.rem) {
        p.vx += p.mvX + spX * (Math.random() * 2 - 1);
        p.vy += p.mvY + spY * (Math.random() * 2 - 1);
        p.vz += p.mvZ + spZ * (Math.random() * 2 - 1);
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
      }
      rotX = cos * p.x + sin * (p.z - zMid);
      rotZ = -sin * p.x + cos * (p.z - zMid) + zMid;
      m = pov / (pov - rotZ);
      p.px = rotX * m + midX;
      p.py = p.y * m + midY;
      if (p.go < p.a + p.b + p.c) {
        if (p.go < p.a) p.alpha = ((p.vb - p.va) / p.a) * p.go + p.va;
        else if (p.go < p.a + p.b) p.alpha = p.vb / 2;
        else if (p.go < p.a + p.b + p.c)
          p.alpha = ((p.vc - p.vb) / p.c) * (p.go - p.a - p.b) + p.vb;
      } else p.end = true;
      if (p.px > w || p.px < 0 || p.py < 0 || p.py > h || rotZ > maxZ) rng = true;
      else rng = false;
      if (rng || p.end) fin(p);
      else {
        dalph = 1 - rotZ / dth;
        dalph = dalph > 1 ? 1 : dalph < 0 ? 0 : dalph;
        ctx.fillStyle = "hsla(0, 0%, 2%, " + p.alpha + ")";
        ctx.beginPath();
        ctx.fillRect(p.px, p.py, m * psz, m * psz);
        // ctx.arc(p.px, p.py, m * psz / 2, 0, 2 * Math.PI); // circles; is more computationally intense
        ctx.fill();
      }
      p = pnxt;
    }
    // txt();
  }

  function add(_x, _y, _z, vx0, vy0, vz0) {
    let np;
    if (dump.first != null) {
      np = dump.first;
      if (np.next != null) {
        dump.first = np.next;
        np.next.prev = null;
      } else dump.first = null;
    } else np = {};
    if (_arr.first == null) {
      _arr.first = np;
      np.prev = null;
      np.next = null;
    } else {
      np.next = _arr.first;
      _arr.first.prev = np;
      _arr.first = np;
      np.prev = null;
    }
    np.x = _x;
    np.y = _y;
    np.z = _z;
    np.vx = vx0;
    np.vy = vy0;
    np.vz = vz0;
    np.go = 0;
    np.end = false;
    if (Math.random() < 0.5) np.rt = true;
    else np.rt = false;
    return np;
  }

  function fin(p) {
    if (_arr.first == p) {
      if (p.next != null) {
        p.next.prev = null;
        _arr.first = p.next;
      } else _arr.first = null;
    } else {
      if (p.next == null) p.prev.next = null;
      else {
        p.prev.next = p.next;
        p.next.prev = p.prev;
      }
    }
    if (dump.first == null) {
      dump.first = p;
      p.prev = null;
      p.next = null;
    } else {
      p.next = dump.first;
      dump.first.prev = p;
      dump.first = p;
      p.prev = null;
    }
  }

  // RESIZE
  window.addEventListener("resize", function () {
    c.width = w = window.innerWidth;
    c.height = h = window.innerHeight;
  })

})();
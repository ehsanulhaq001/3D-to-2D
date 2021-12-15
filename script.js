let cnv;
let ctx;
let offsetX;
let offsetY;
let theta = 0;
let phi = 0;
let rotateT;
let rotateP;

window.onload = () => {
  cnv = document.getElementById("canvas");
  angleT = document.getElementById("theta").value;
  angleP = document.getElementById("phi").value;
  rotateT = document.getElementById("rotateT").checked;
  rotateP = document.getElementById("rotateP").checked;
  ctx = cnv.getContext("2d");
  cnv.style.backgroundColor = "white";
  cnv.width = 800;
  cnv.height = 800;
  gridX = 10;
  gridY = 10;
  gridZ = 10;
  offsetX = gridX / 2;
  offsetY = gridY / 2;
  cubeSide = 80;
  rotateP = false;
  rotateT = false;
  requestAnimationFrame(draw);
};

function _3d_to_2d(x, y, z, theta, phi) {
  rx = x * Math.cos(theta) - z * Math.sin(theta);
  ry =
    y * Math.cos(phi) -
    z * Math.sin(phi) * Math.cos(theta) -
    x * Math.sin(phi) * Math.sin(theta);
  return { x: rx, y: ry };
}

draw = () => {
  if (!rotateT && angleT != document.getElementById("theta").value) {
    angleT = document.getElementById("theta").value;
    theta = (angleT * Math.PI) / 180;
  }
  if (!rotateP && angleP != document.getElementById("phi").value) {
    angleP = document.getElementById("phi").value;
    phi = (angleP * Math.PI) / 180;
  }
  if (rotateT != document.getElementById("rotateT").checked) {
    rotateT = document.getElementById("rotateT").checked;
  }
  if (rotateP != document.getElementById("rotateP").checked) {
    rotateP = document.getElementById("rotateP").checked;
  }

  ctx.clearRect(0, 0, cnv.width, cnv.height);
  //draw origin
  ctx.beginPath();
  ctx.arc(
    (0 + offsetX) * cubeSide,
    (0 + offsetY) * cubeSide,
    6,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "lime";
  ctx.fill();
  let n = 2;
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      for (let k = -n; k <= n; k++) {
        makeCubeWithCenter(i, j, k, theta, phi, 1);
      }
    }
  }
  makeSphereWithCenter(2, 2, 2, theta, phi, 2, 64);
  if (rotateT) theta += 0.1;
  if (rotateP) phi += 0.1;
  requestAnimationFrame(draw);
};

makeCubeWithCenter = (cx, cy, cz, theta, phi, d) => {
  d /= 2;
  let cube = [
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, 1, 1],
    [1, 1, 1],

    [1, -1, 1],
    [1, -1, -1],
    [-1, -1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [-1, -1, 1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
  ];

  for (let i = 0; i < cube.length; i++) {
    cube[i][0] = cube[i][0] * d + cx;
    cube[i][1] = cube[i][1] * d + cy;
    cube[i][2] = cube[i][2] * d + cz;
  }

  let { x: ox, y: oy } = _3d_to_2d(cx, cy, cz, theta, -phi);

  ctx.beginPath();
  ctx.arc(
    (ox + offsetX) * cubeSide,
    (oy + offsetY) * cubeSide,
    1,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "red";
  ctx.fill();
  // ctx.strokeStyle = "red";
  // ctx.stroke();

  let { x, y } = _3d_to_2d(cube[0][0], cube[0][1], cube[0][2], theta, -phi);

  ctx.beginPath();
  ctx.moveTo((x + offsetX) * cubeSide, (y + offsetY) * cubeSide);

  for (let i = 1; i < cube.length; i++) {
    let { x, y } = _3d_to_2d(cube[i][0], cube[i][1], cube[i][2], theta, -phi);
    ctx.lineTo((x + offsetX) * cubeSide, (y + offsetY) * cubeSide);
  }
  ctx.strokeStyle = "blue";
  ctx.stroke();
};

makeSphereWithCenter = (cx, cy, cz, theta, phi, d, n) => {
  let alpha = 0;
  let beta = -Math.PI / 2;
  let sphere = new Array();
  let r = 1;
  let z = -1;
  for (let j = 0; j < n; j++) {
    let circle = new Array();
    b = (2 * beta) / Math.PI;
    r = Math.pow(1 - Math.pow(b, 2), 0.5);
    z = Math.pow(1 - Math.pow(r, 2), 0.5);
    if (beta < 0) z = -z;
    for (let i = 0; i < n * r; i++) {
      let x = r * Math.cos(alpha);
      let y = r * Math.sin(alpha);
      circle.push({ x, y, z });
      alpha += (2 * Math.PI) / (n * r);
    }
    sphere.push(circle);
    beta += Math.PI / n;
  }

  for (let i = 0; i < sphere.length; i++) {
    for (let j = 0; j < sphere[i].length; j++) {
      let { x, y, z } = sphere[i][j];
      let { x: px, y: py } = _3d_to_2d(
        x * d + cx,
        y * d + cy,
        z * d + cz,
        theta,
        -phi
      );
      ctx.beginPath();
      ctx.arc(
        (px + offsetX) * cubeSide,
        (py + offsetY) * cubeSide,
        1,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = "hsl(" + z * 180 + ",50%, 50%)";
      ctx.stroke();
    }
  }
};

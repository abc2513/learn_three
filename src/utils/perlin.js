class Perlin2d {
  static p = new Array(512);
  //生成哈希表
  static getPermutation(){
    let permutation = new Array(256);
    for (let i = 0; i < 256; i++) {
      permutation[i] = i;
    }
    for(let i=0;i<256;i++){
      let r = Math.floor(Math.random() * (256 - i));
      let temp = permutation[i];
      permutation[i] = permutation[r];
      permutation[r] = temp;
    }
    this.p=[...permutation,...permutation];
  }
  //缓和曲线函数
  static fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  //直接计算点击的函数
  static dot(hash, x, y) {
    switch (hash % 4) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      default: return 0;
    }
  }
  //插值函数
  static lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
  static perlin2d(x, y) {
    //晶格左下角顶点坐标
    let xn = Math.floor(x) ;
    let yn = Math.floor(y) ;
    //点在晶格内的坐标
    let xf = x - xn;
    let yf = y - yn;
    //缓和曲线计算权重
    let u = this.fade(xf);
    let v = this.fade(yf);
    //防止溢出255
    xn= xn & 255;
    yn= yn & 255;
    //计算哈希值
    let n00 = this.p[this.p[xn] + yn];
    let n01 = this.p[this.p[xn] + yn + 1];
    let n10 = this.p[this.p[xn + 1] + yn];
    let n11 = this.p[this.p[xn + 1] + yn + 1];
    //计算点积并插值
    let v1 = this.lerp(this.dot(n00, xf, yf), this.dot(n10, xf - 1, yf), u);
    let v2 = this.lerp(this.dot(n01, xf, yf - 1), this.dot(n11, xf - 1, yf - 1), u);
    return this.lerp(v1, v2, v);

  }
}
export { Perlin2d };
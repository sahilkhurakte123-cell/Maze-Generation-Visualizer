let setsize = document.querySelector('#setsize');
let n , m;
setsize.addEventListener("click" , function(){    
    n = document.querySelector("#sizen").value;
    n -= 0;
    m = document.querySelector("#sizem").value;
    m -= 0;
    console.log(n , m);
    createGrid(n , m);
});
let inx , iny ;
function createGrid(n , m){
    inx=Math.floor(n/2); iny=Math.floor(m/2);
    var maze = new Array(n);
    var visited=new Array(n);
    for (var i = 0; i < maze.length; i++) {
    maze[i] = new Array(m);
    visited[i]=new Array(m);
    }
    const cont = document.createElement("container");
    cont.style.background = "white";
    cont.style.display = "inline-block";
    cont.style.border = "0px solid #252423";
    const body = document.body;
    body.append(cont);
    let rows = "";
    for(let i = 0 ; i < n ; i++) {
    rows += "20px ";
    }
    let cols = "";
    for(let i = 0 ; i < m ; i++) {
    cols += "20px ";
    }

    const grid = document.createElement("grid");
    grid.id = "yo1";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = cols;
    grid.style.gridTemplateRows = rows;
    grid.style.gap = "0px";
    body.append(grid);
    cont.append(grid);

    let k ;
    for (let i=0; i<n; i++) {
        for (let j=0; j<m; j++) {
        visited[i][j]=0;
            k = document.createElement("cell");
            k.id=`${i * m + j}`;
            maze[i][j] = k;
            maze[i][j].classList.add("grid");
            body.append(k);
            cont.append(k);
            grid.append(k);
            k.style.border = "1px solid #252423";
            k.style.justifyContent = "center";
            k.style.alignItems = "center";
            k.style.display = "flex";
            k.style.fontSize= "3rem";
            k.style.fontWeight = "bold";
            k.style.background = "#393e46";
            k.className="cell";
        }
    }

    const yo = document.querySelector('.left');
    yo.innerHTML += cont.innerHTML;
    cont.innerHTML = "";


    // document.getElementById(`${n * m - 1}`).style.borderRight = "";
    // document.getElementById(`${n * m - 1}`).style.borderBottom = "";

}

let ord=[];
let ord2=[];
let cur=[];



function clickHandler(event) {
  preprocess();
  setTimeout(function(){
    let sw=0;
if (sw==1) ord=ord2;
    animate(0);
  },5000);
}
  
const btn = document.querySelector('#go');
btn.addEventListener('click', clickHandler);

let nb=[];

function preprocess() {
    cur.push([inx,iny]);

  function calc_nb (cur) {
      const fa=new Set();
      for (let i of cur){
          let fl4=0, fl1=0, fl2=0, fl3=0;
          for (let j of cur){
              if (j[0]-1==i[0] && j[1]==i[1]) fl1=1;
              if (j[0]+1==i[0] && j[1]==i[1]) fl2=1;
              if (j[0]==i[0] && j[1]-1==i[1]) fl3=1;
              if (j[0]==i[0] && j[1]+1==i[1]) fl4=1;
          }
          if (i[0]<n-1 && fl1==0) fa.add([i[0]+1,i[1]]);
          if (i[0]>0 && fl2==0) fa.add([i[0]-1,i[1]]);
          if (i[1]<m-1 && fl3==0) fa.add([i[0],i[1]+1]);
          if (i[1]>0 && fl4==0) fa.add([i[0],i[1]-1]);
      }
      let ffa=[];
      for (let i of fa) ffa.push(i);
      return ffa;
  }

  ord.push([cur,calc_nb(cur),[inx,iny],[inx,iny]]);

  function is_present(i,cur) {
    for (let j of cur){
      if (j[0]==i[0] && j[1]==i[1]) return true;
    }
    return false;
  }

  while ((ord[ord.length-1][1]).length > 0){
      let nsize=ord[ord.length-1][1].length;
      let ind=Math.floor((Math.random())*(nsize));
      let pcell=ord[ord.length-1][1][ind];
      let ppar=[];
      if (is_present([pcell[0]+1,pcell[1]],cur) && pcell[0]<n-1) ppar.push([pcell[0]+1,pcell[1]]);
      if (is_present([pcell[0]-1,pcell[1]],cur) && pcell[0]>0) ppar.push([pcell[0]-1,pcell[1]]);
      if (is_present([pcell[0],pcell[1]+1],cur) && pcell[1]<m-1) ppar.push([pcell[0],pcell[1]+1]);
      if (is_present([pcell[0],pcell[1]-1],cur) && pcell[1]>0) ppar.push([pcell[0],pcell[1]-1]);
      let ind2=Math.floor((Math.random())*(ppar.length));
      cur.push(pcell);
      temp=calc_nb(cur);
      const x1=cur, x2=temp, x3=pcell, x4=ppar[ind2];
      ord.push([x1,x2,x3,x4]);
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  class DSU {
    constructor(nums){
        this.parents = Object.create(null);
        for (let num of nums)
            this.parents[num] = num;
    }
    find(x){
        if (this.parents[x] !== x)
            this.parents[x] = this.find(this.parents[x]);
        return this.parents[x];
    }
    union(x, y) {
        this.parents[this.find(x)] = this.find(y);
    }
    groups(){
        let res = {};
        for (let num in this.parents) {
            let parent = this.find(num);
            res[parent] = res[parent] || [];
            res[parent].push(num);
        }
        return res;
    }
  }

  ord2.push([cur,calc_nb(cur),[inx,iny],[inx,iny]]);

  let walls=[];
  let cells=[];

  for (let i=0; i<n; i++){
    for (let j=0; j<m; j++){
      cells.push((i*m)+j);
      let mov=[[1,0],[0,1],[-1,0],[0,-1]];
      for (let k of mov){
        if (i+k[0]>=0 && i+k[0]<n && j+k[1]>=0 && j+k[1]<m){
          walls.push([[i,j],[i+k[0],j+k[1]]]);
        }
      }
    }
  }

  shuffle(walls);

  var dsu=new DSU(cells);

  for (let i of walls){
    if (dsu.find(i[0][0]*m+i[0][1])!=dsu.find(i[1][0]*m+i[1][1])){
      ord2.push([[],[],i[0],i[1]]);
      dsu.union(i[0][0]*m+i[0][1],i[1][0]*m+i[1][1]);
    }
  }

  for (let i of ord){
  let te=new Set();
  for (let j of i[1]){
      te.add(document.getElementById(`${j[0]*m+j[1]}`));
    }
  let te2=[];
  for (let i of te) te2.push(i);
  nb.push(te2);
  }

  // console.log(ord);
  // console.log(nb);

}

function animate(index){
  let sz=ord.length;
  
  console.log(nb[index]);

  if (index==sz) return;
  let cidc=ord[index][2];
  let parentc;
  parentc=ord[index][3];

  let cid=cidc[0]*m+cidc[1];
  let parent
  parent=parentc[0]*m+parentc[1];


  let borlef = document.getElementById(`${cid}`).style.borderLeft;
  let borri = document.getElementById(`${cid}`).style.borderRight;
  let borto = document.getElementById(`${cid}`).style.borderTop;
  let borbo = document.getElementById(`${cid}`).style.borderBottom;

  let Pborlef = document.getElementById(`${parent}`).style.borderLeft;
  let Pborri = document.getElementById(`${parent}`).style.borderRight;
  let Pborto = document.getElementById(`${parent}`).style.borderTop;
  let Pborbo = document.getElementById(`${parent}`).style.borderBottom;

  let direction;
  if (cidc[0]-parentc[0]==1) direction=2;
  if (cidc[0]-parentc[0]==-1) direction=1;
  if (cidc[1]-parentc[1]==1) direction=4;
  if (cidc[1]-parentc[1]==-1) direction=3;

  if(direction == 1) { 
    borbo = "0px solid black ";
  }
  if(direction == 2) { 
    borto = "0px solid black ";
  } 
  if(direction == 3) { 
    borri = "0px solid black ";
  } 
  if(direction == 4) { 
    borlef = "0px solid black ";
  }  

  if(direction == 1) { 
    Pborto = "0px solid black";
  }
  if(direction == 2) { 
    Pborbo = "0px solid black";
  }
  if(direction == 3) { 
    Pborlef = "0px solid black";
  }
  if(direction == 4) { 
    Pborri = "0px solid black";
  }

  let abcd=document.getElementById(`${parent}`);

  var also1 = function () {anime({
    targets : abcd,
    backgroundColor : '#00D672',
    borderBottom : Pborbo,
    borderTop : Pborto,
    borderLeft : Pborlef,
    borderRight : Pborri,
    duration : 10,
    complete: () => {
      myanimation();
    }
  }).play()};

  var also2=function () {anime({
    targets: nb[index],
    backgroundColor: '#61C3FF',
    duration: 10,
    complete: () => {
      also1();
    }
  }).play()};

  var myanimation = function () {anime({
    targets: document.getElementById(`${cid}`),
    backgroundColor : '#00D672',
    scale: [
      {value: .1, easing: 'easeOutSine', duration: 10},
      {value: 1, easing: 'easeInOutQuad', duration: 10}
    ],
    borderBottom : borbo,
    borderTop : borto,
    borderLeft : borlef,
    borderRight : borri,
    duration : 5,
    delay : 1,
    complete: ()=> {
      if(index + 1 == sz) return;
      animate(index + 1);
  }}).play()};
  console.log(true);
  // also1();
  also2();
  // myanimation.play();
}
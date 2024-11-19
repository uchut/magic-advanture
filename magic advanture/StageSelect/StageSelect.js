const Stage1 = document.getElementById('Stage1');         //Stage1 Button id 따오기
const Stage2 = document.getElementById('Stage2');         //Stage2 Button id 따오기

Stage1.addEventListener("click", Stage1Start);            //Stage1 Button에 클릭 이벤트리스너 추가
Stage2.addEventListener("click", Stage2Start);            //Stage2 Button에 클릭 이벤트리스너 추가

window.localStorage.setItem("score", "0");
window.localStorage.setItem("time", "15");

//Stage1Button localstorage test
function Stage1Start(event) {
  //match 3 구현에 필요한 변수 값 localstorage에 넣기
  //개발 방향에 따라 이 부분은 삭제 될 수 있음
  window.localStorage.setItem("score", "30");
  window.localStorage.setItem("time", "45");
  
  window.location.href = "../3match.html"     //여기에 Stage1 시작할 html 파일 넣기, 경로 확인 필수
}

//Stage2Button localstorage test
function Stage2Start(event) {
  //match 3 구현에 필요한 변수 값 localstorage에 넣기
  //개발 방향에 따라 이 부분은 삭제 될 수 있음
  window.localStorage.setItem("score", "60");
  window.localStorage.setItem("time", "90");

  window.location.href = "../3match.html"     //여기에 Stage2 시작할 html 파일 넣기, 경로 확인 필수
}
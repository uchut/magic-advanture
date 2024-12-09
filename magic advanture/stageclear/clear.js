const curScore = localStorage.getItem("score");

const scoreBoard = document.getElementById("score-board");
const Scorethousand = Math.floor(curScore / 1000);
let tempcurScore = curScore % 1000;
const Scorehundread = Math.floor(tempcurScore / 100);
tempcurScore = curScore % 100;
const Scoreten = Math.floor(tempcurScore / 10);
const Scoreone = curScore % 10;

        
document.getElementById('score1').src = `../images/numbers/${Scorethousand}.png`;
document.getElementById('score2').src = `../images/numbers/${Scorehundread}.png`;
document.getElementById('score3').src = `../images/numbers/${Scoreten}.png`;
document.getElementById('score4').src = `../images/numbers/${Scoreone}.png`;

const StartButton = document.getElementById('StartButton');       //게임 스타트 버튼 id 따오기
const CloseButton = document.getElementById('CloseButton');       //게임 나가기 버튼 id 따오기

StartButton.addEventListener("click", StartClick);                //StartButton에 클릭 이벤트리스너 추가
CloseButton.addEventListener("click", ExitClick);                 //CloseButton에 클릭 이벤트리스너 추가

//StartButton 누르면 StageSelect웹창으로 이동
function StartClick(event) {
  window.location.href = "../3match.html"
}

//CloseButton 누르면 창이 닫힘
function ExitClick(event) {
  alert("Are you sure you want to exit this page?");
  window.open('','_self').close();
}
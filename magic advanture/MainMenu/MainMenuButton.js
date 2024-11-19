const StartButton = document.getElementById('StartButton');       //게임 스타트 버튼 id 따오기
const CloseButton = document.getElementById('CloseButton');       //게임 나가기 버튼 id 따오기

StartButton.addEventListener("click", StartClick);                //StartButton에 클릭 이벤트리스너 추가
CloseButton.addEventListener("click", ExitClick);                 //CloseButton에 클릭 이벤트리스너 추가

//StartButton 누르면 StageSelect웹창으로 이동
function StartClick(event) {
    window.location.href = "../StageSelect/StageSelect.html"
}

//CloseButton 누르면 창이 닫힘
function ExitClick(event) {
  window.close();
}
// Swiper 초기화

const visualSlide = new Swiper('.visual_slide', {
    // Optional parameters
    speed: 1000,
    allowTouchMove: true,
    loop: true,
    loopAdditionalSlides: 0,
    autoplay: {
    delay: 3000,
    disableOnInterraction:false, //스와이프 후 자동 재생이 비활성화 되지 않게
  },
  on: {
        progress() { // 슬라이드가 움직이는 중 배경 위치 이동
          this.slides.forEach(slide => {
            const slideProgress = slide.progress;
            const innerOffset = this.width * 0.5;
            const innerTranslate = slideProgress * innerOffset;
            slide.querySelector('.bg').style.transition = `translate3d(${innerTranslate}px, 0, 0)`;
          });
        },
        setTransition(swiper, speed) { // 슬라이드 전환시 애니메이션 시간 설정
          this.slides.forEach(slide => {
            slide.style.transition = `${speed}ms`;
            slide.querySelector('.bg').style.transition = `${speed}ms`;
          });
        },
        slideChange() { // 슬라이드 변경 시 클래스 토글
          const idx = this.realIndex;
          $('.visual_slide .slide_paging li').eq(idx).addClass('active').siblings().removeClass('active on');
          $('.visual_slide .slogan span').eq(idx).addClass('active').siblings().removeClass('active');

          // change span on 클래스 제어
          const $changes = $('.visual_slide .holding .change');
          $changes.removeClass('on').eq(idx).addClass('on');
        },
        slideChangeTransitionEnd() { // 슬라이드 전환 끝난 후 클래스 추가
          $('.slide_paging li').eq(this.realIndex).addClass('on')
        }
     }     
});

// 슬라이드 페이징 버튼
$('.slide_paging li button').on('click', function() {
  const index = $(this).parent().index();
  visualSlide.slideToLoop(index)
});

// Waypoint 효과
$('.waypoint').each((i, el) =>{
  $(el).waypoint(() => $(el).addClass('on'), {offset : '90%'});  
});

// 브랜드 탭 클릭시 이벤트
$('.sec02 .tab_box .brand_tab').on('click', function(){
  const index = $(this).index() + 1;

  $(this).addClass('active').siblings().removeClass('active');
  $('.sec02 .mask_text')
    .removeClass('type1 type2 type3 type4 type5 type6 type7 type8')
    .addClass(`type${index}`)
    .find(`.zoom_circle${index}`).addClass('on').siblings().removeClass('on');
  $('.sec02 .matchbox .matchtext').eq(index - 1).addClass('active').siblings().removeClass('active');

  // 브랜드 탭 링크 이벤트
  let href = '/02_product_8.html';
  if (index === 1) href = `/02_product_1.html`;
  else if (index === 2) href = `/02_product_2.html`;
  else if (index === 3) href = `/02_product_3.html`;
  else if (index === 4) href = `/02_product_4.html`;
  else if (index === 5) href = `/02_product_5.html`;
  else if (index === 6) href = `/02_product_6.html`;
  else if (index === 7) href = `/02_product_7.html`;
  $('.sec02 .linkbox a').attr('href', href);
});

// notice 슬라이드
$('.sec04 .slide').slick({
  fade: false,
  infinite: true,
  dots: true,
  arrows: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1001,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 641,
      settings: {
        slidesToShow: 1,
        slidesToScroll:1, 
      }
    }
  ]
}).on('afterChange', function(event, slick, currenSlide){
  $('.sec04 .slide .slick-slide[aria-hidden = "true"]').find('*:focus').blur();
});

// Family site 열고 닫기
const langOpen = '열기';
const langClose = '닫기';

$('.link_open').on('click', function(){
  const $this = $(this); // 현재 클릭한 요소를 변수에 저장
  const isOpen = $this.attr('title') === langOpen; //현재 상태가 "열기" 상태인지 확인

  $this
      .attr('title', isOpen ? langClose : langOpen) // 상태에 따라 title을 "닫기" 또는 "열기"로 변환
      .toggleClass('on', isOpen)// 열기 상태면 'on' 클래스 추가, 닫기면 제거
      .siblings('ul').toggleClass('active', isOpen) // 형제 ul에 'active' 클래스 토글
}); 


// 하단 현재 년도 출력
// document.getElementById('this_year').textContent = new Date().getFullYear()

$('#this_year').text(new Date().getFullYear());
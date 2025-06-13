(function($){
  const lang = document.documentElement.lang || 'ko';

  const pathParts = window.location.pathname.split('/');
  const fileName = pathParts.pop(); //pop():배열의 가장 마지막 요소 제거하고 그 값을 반환

  // const urlBase = '/inc/menu_' + lang + '.json'
  const urlBase = `/inc/menu_${lang}.json`

  $.ajax({ //ajax: jQuery의 브라우저에서 서버로 데이터를 주고 받기 위한 요청 함수
    type:'GET', // HTTP 요청 방식(GET, POST 등) => GET(서버에서 정보를 가져올 때) / POST(서버에 정보를 제출, 생성, 전송)
    url:urlBase,
    async:false, // 비동기 여부(기본은 true:권장)
    dataType: 'json',
    success: function(data){
      const { link, depth2 } = data;

      const menuKeys = Object.keys(link);
      const nowPageKey = menuKeys.find(key => link[key].endsWith('/'+fileName));

      if (!nowPageKey) return;

      const parentKey = Object.keys(depth2).find(depth1 => depth2[depth1].includes(nowPageKey));
      if (!parentKey) return;

      // page_name은 depth1 출력
      const pageNameEl = document.querySelector('h2.page_name');
      if (pageNameEl) pageNameEl.innerText = parentKey;

      // title은 그대로 depth2 제목 출력
      const titlePrefix = '|회사소개';
      document.title = `${nowPageKey}${titlePrefix}`;

      // path_list 랜드링
      const html = depth2[parentKey].map(key => {
        const isActive = key === nowPageKey;
        return `<li class="path_item${isActive ? ' active' : ''}">
           <a class="path_text" href="${link[key]}"><span>${key}</span></a>
           </li>`;
      }).join('');

      const pathLineEl = document.querySelector('.path_wrap .path_list');
      if (pathLineEl) pathLineEl.innerHTML = html;      
    }
  });
  const url = location.href.split('#')[0];

  // tab 메뉴 처리
  function activeTab(index) {
    $('.sub_tabbox .tab_list li').eq(index).addClass('active').siblings().removeClass('active');
    $('.tab_match .matchbox').eq(index).addClass('active').siblings().removeClass('active');

    // 탭 목록 스크롤 이동
    const $tab = $('.sub_tabbox .tab_list li').eq(index).find('.tab_btn');
    $('.sub_tabbox .tab_list').animate({
      scrollLeft:$tab.offset().left
    },200);

    // 화면 스크롤 이동
    $('html, body').animate({
      scrollTop: $('.sub_tabbox').offset().top + 10
    },300, 'swing');
  }

  // 1. 해시값이 있을 경우 해당 탭 활성화
  if (location.hash) { // 현재 url에 # 해시값이 있는지 확인
    const hashNumber = Number(location.hash.replace('#','')); // Number함수 사용해서 해시를 제거하고 숫자로 변환
    if (!isNaN(hashNumber) && hashNumber > 0) {
      activeTab(hashNumber - 1);
    }
  }

  // 2. 탭 클릭 이벤트
  $('.sub_tabbox').on('click', '.tab_list li .tab_btn', function(){
    const index = $(this).parent().index();
    activeTab(index);
    history.replaceState(null, null, url + '#' + (index+1)); //해시 업데이트
  });

  // 3. 스크롤 고정
  if ($('.sub_tabbox').length > 0) {
    $(window).on('scroll', function(){
      const nowTop = $(document).scrollTop();
      const tabTop = $('.sub_tabbox').offset().top;
      $('.sub_tabbox .tab_list').toggleClass('fixed', nowTop > tabTop);
    });
  }

  //반응형 테이블
  $('.table.responsive').each(function(){
    const $table = $(this);
    const $header = $table.find('thead th');

    $table.find('tbody tr').each(function(){
      const $cells = $(this).find('td');

      $cells.each(function (index){
        const headerText = $header.eq(index).text().trim();
        $(this).attr('data-content', `${headerText} : `);
      });
    });
  });

  // open_table
  $('.open_table').on('click', function(){
    const $btn = $(this);
    const $target = $btn.next('.conbox');
    const isOpen = $btn.attr('title') ==='열기';

    if (window.innerWidth < 1001) {
      $btn
        .attr('title', isOpen ? '닫기' : '열기')
        .toggleClass('on', isOpen);

        $target.stop(true).slideToggle(300);
    }
  });
})(jQuery);

  // 브랜드 상품 팝업처리
  const urlParams = new URL(location.href).searchParams;
  const brandId = urlParams.get('brandId');

  // 팝업 열기 함수
  function openBrandPopup(brand){
    const $popup = $('.brand_layer_popup');
    $popup.addClass('on')
      .find('ly_' + brand).addClass('active')
      .siblings().removeClass('active');

    $popup.find('.layer_close').focus();
    $('body').addClass('lock');
  }

  // 팝업 닫기 함수
  function closeBrandPopup(){
    const activeBrand = $('.layer_con.active').data('brand');
    $('.brnad_layer_popup').removeClass('on');
    $(`.brand_box button[data-brand = "$(activeBrand)"]`).focus();
    // $('.brand_box button[data-brand = "' + activeBrand + '"]').focus()
    $('body').removeClass('lock');
  }

  // url에 브랜드 id가 있으면 팝업 자동 오픈
  if (brandId) {
    openBrandPopup(brandId);
  }
  
  // 브랜드 버튼 클릭시 팝업 오픈
  $('.brand_box button').on('click', function (){
    const brand = $(this).data('brand');
    openBrandPopup(brand);
  });

  // 닫기 버튼 클릭시 팝업 닫기
  $('.layer_close').on('click', closeBrandPopup);

  // 바깥 영역 클릭시 팝업 오픈
  $('.brand_layer_popup').on('click', function (e){
    if (!$(e.target).closest('.layer_con').length) {
      $(this).removeClass('on');
      $('body').removeClass('lock')
    }
  });

  // 문의하기 입력정보 처리 및 개인정보보호 팝업 관련 
  document.addEventListener('DOMContentLoaded', () => { //html이 완전히 화면로딩
    const qs = (sel, ctx = document) => ctx.querySelector(sel); 
    //선택자 하나에 해당하는 요소를 가져오는 단축 함수
    //qs('#company') = document.querySelector('#company')와 동일
    const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    //선택자에 해당하는 모든 요소를 배열로 반환하는 함수
    const body = document.body;

    /* 1. input filter 관련 */
    qs('#phone')?.addEventListener('input', ({ target }) => {
      target.value = target.value.replace(/\D/g, '')
    });
    // ?. = optional chaining으로, 해당요소가 존재할 경우에만 이벤트 리스너 진행
    // /\D/g(정규식)는 숫자가 아닌 문자를 모두 제거함
    // qs / qsa : 유틸함수(다른 요소들에도 활용 가능하며, html 접근 코드를 간결하게 유지해주는 역할)

    /* max-length 300초과하지 않고 입력필드 글자수 제한 + 실시간 카운트 */
    const inquireInput = qs('#inquire');

    if (inquireInput) {
      const counterEl = qs('.word_count .current');
      inquireInput.addEventListener('input', ({target}) => {
        if (target.value.length > 300) target.value = target.value.slice(0, 300); // 입력값이 300자를 초과하지 않도록 자름
        counterEl && (counterEl.textContent = `${target.value.length}`);
      });

    }

    /* privacy popup 관련 */
    const popup = qs('.privacy_popup');
    const openBtn = qs('.fake_chk .label button');
    const closeBtns = qsa('.privacy_popup .pop_close, .privacy_popup .close');
    const confirmBtn = qs('.privacy_popup .pop_confirm');
    const privacyChk = qs('#privacy')

    // 팝업이 열렸을 때 뒷배경 스크롤 방지 위한 lock 클래스 추가/제거
    // .lock이 css에서 반드시 overflow:hidden 으로 설정 되어 있어야 효과
    const lockBody = () => body.classList.add('lock');
    const unlockBody = () => body.classList.remove('lock');
    const openPopup = () => { popup?.classList.add('active'); lockBody(); };
    const closePopup = () => { popup?.classList.remove('active'); unlockBody(); };

    /* openPopup */
    openBtn?.addEventListener('click',openPopup);
    closeBtns.forEach(btn => btn.addEventListener('click', ()=>{
      closePopup(); openBtn?.focus();
    }));
    confirmBtn?.addEventListener('click', () => {
      closePopup(); privacyChk && (privacyChk.checked = true);
    });  

    const MAX_SIZE = 30 * 1024 * 1024;
    // 업로드 가능한 최대 용량 30Mb = 30 x 1024 x 1024Byte
    qsa('.con_input .upload-hidden')?.forEach(input => {
      input.addEventListener('change', ({ target }) => {
        const file = target.files?.[0];
        if (!file) return;
        if (file.size > MAX_SIZE) {
          alert('30MB 이하의 파일만 업로드 가능합니다.');
          target.value = ''; // 파일 초기화
          return;
        }
        const label = target.closest('.con_input')?.querySelector('.upload-name');
        label && (label.value = file.name);
      });
    });

    /* form 중복 및 입력값 체크 관련 */
    let submitting = false; //서버에 요청이 들어가 있는 동안에는 두번 눌러도 무시
    
    // 버턴 클릭 이벤트
    qsa('.btn_submit').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.preventDefault(); // 폼 기본 제출 동작 차단(submit 이벤트 차단)
        if (submitting) return;
        
        const form = btn.closest('form');
        if(!form) return;

        // 입력 검증을 간결하게 처리할 수 있도록 도와주는 헬퍼 함수(get, must)
        const get = name => form.querySelector(`[name="${name}"]`);
        const must = (name, msg) => {
          const el = get(name);
          if (!el || !el.value.trim()){
            alert(msg); // 경고창 출력
            el?.focus(); // 해당 input으로 포커스 이동
            throw msg; //이후 코드 중단
          }
          return el.value.trim(); //값이 존재하면 제거후 반환
        };

        // try { 입력값의 유효성 검사, FormData 생성 및 서버 전송, 응답결과 처리.}
        // catch { 필수 입력값 누락 시 throw 로 중단하고 아무 처리 안함.}

        try {
          must('name', '이름을 입력해주세요.');
          must('company', '업체명을 입력해주세요.');
          must('phone', '연락처를 입력해주세요.');
          
          const email  = must('email', '이메일을 입력해 주세요.')
          if (!emailCheck(email)) {alert('이메일을 확인해 주세요.'); get('email')?.focus(); return;}

          must('inqure', '문의 내용을 입력해 주세요.')
          if(!privacyChk?.checked) {alert('개인정보 이용정책을 동의해주세요.'); return;}

          const fd = new FormData(form); // Formdata: 내무 모든 입력값을 자동 수집
          fd.append('req_type','bizCollabo');

          submitting = true;
          
          const res = await fetch('/test.html', {method: 'POST', body: fd });
          const json = await res.json();
          submitting = false;

          if (json.SUCCESS) {
            qs()
          }
          
        } catch {}
      });
    });

    // util
    const emailCheck = email => /^[\w.-]+@[\w.-]+$/.test(email);
  });
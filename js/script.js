$(document).ready(function(){
    $("#crush").change(function(){
        var $crush_val=$(this).val();
        $(".result_opt_01").text($crush_val);
    });
    $("#gram").change(function(){
        var $gram_val=$(this).val();
        $(".result_opt_02").text($gram_val);
    });
    var $str_price=$(".det_price span").text();
    var $num_price=parseFloat($str_price.replace(",", ""));

    var $total=0; // 총 금액의 숫자형 데이터
    var $final_total=""; // 총 금액의 문자형 데이터

    var $each_price=0; // 각 선택 박스의 금액
    var $each_calc_price=[]; // 각 아이템별 단가;기본값, 대기값(배열 데이터)
    var $amount=[]; // 각 아이템별 수량(배열 데이터)
    var $each_total_price=[]; // 각 아이템별 최종값(배열 데이터)

    $(".total_price_num span").text($total); // 초기 총 금액

    var $each_box=`
        <li class="my_item">
            <div class="det_count">
                <div class="det_count_opt">
                    <p class="opt_01">원두(분쇄없음)</p>
                    <p class="opt_02">200g</p>
                </div>
                <div class="det_count_box">
                    <a class="minus" href="#">－</a>
                    <input type="text" value="1" readonly>
                    <a class="plus" href="#">＋</a>
                </div>
                <div class="det_count_price"><span class="each_price">14,000</span>원</div>
                <div class="item_del"><span>×</span></div>
            </div>
        </li>
    `;

    $(".det_total_price").hide();
    $("#crush option:eq(0), #gram option:eq(0)").prop("selected", true); /* 각각 작성 */
    function calc_price(){
        if($each_total_price.length==0){
            $(".det_total_price").hide();
            $("select option").prop("selected", false);
            $("#crush option:eq(0), #gram option:eq(0)").prop("selected", true);
        }else{
            $(".det_total_price").show();
            $total=0; // 이벤트 발생 시 마다 값 초기화 후 다시 계산
            for(i=0;i<$each_total_price.length;i++){
                $total+=$each_total_price[i]; // 최종 배열 데이터 내부의 값을 모두 더한다
            }
            $final_total=$total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $(".total_price_num span").text($final_total); // 총 금액을 문자형 데이터로 표기
        }
    };

    // 조건 : 1번 셀렉트 박스가 선택이 된 상태에서 2번 셀렉트 박스가 선택이 되었을 때 change 이벤트를 걸어서 각 세부항목인 my_item을 ul 아래의 마지막 자식으로 추가
    /* 
    pop( )              배열에 저장된 데이터 중 마지막 인덱스에 저장된 데이터를 삭제
    push(new data)      배열 객체 마지막 인덱스에 새 데이터를 삽입
    shift( )            배열 객체에 저장된 데이터 중 첫 번째 인덱스에 저장된 데이터 삭제
    unshift(new data)   배열 객체의 가장 앞의 인덱스에 새 데이터를 삽입
    */
   $("#crush").change(function(){
        $("#gram").removeAttr("disabled", "");
   });
    $("#gram").change(function(){
        $(".opt_box").append($each_box);
        var $opt_01=$("#crush option:selected").text();
        console.log("나의 첫번째 선택 : "+$opt_01);
        var $opt_02=$("#gram option:selected").text();
        console.log("나의 두번째 선택 : "+$opt_02);
        var $opt_02_val=parseFloat($(this).val()); // select value값은 문자형 데이터로, 숫자형 데이터로 변경
        console.log("나의 두번째 선택 value 값 : "+$opt_02_val);

        $(".opt_box li:last .opt_01").text($opt_01);
        $(".opt_box li:last .opt_02").text($opt_02);

        $present_price=$num_price+$opt_02_val; /* var 선언? */
        console.log("선택을 마친 기본가 + 옵션가"+$present_price);

        $each_total_price.push($present_price);
        console.log($each_total_price); // 수량 변경에 따른 가격을 배열 데이터로 저장(변동값)

        $each_calc_price.push($present_price);
        console.log($each_calc_price); // 단가;옵션가 포함한 가격을 배열 데이터로 저장(고정값)

        $amount.push(1);
        console.log($amount); // 초기 수량

        var $result_opt=$present_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".opt_box li:last .each_price").text($result_opt);

        calc_price()
    });
    
    $(document).on("click", ".minus", function(){
        var $index=$(this).closest("li").index();
        if($amount[$index]>1){
            $amount[$index]--;
            console.log($amount);
            $(this).siblings("input").val($amount[$index]);
            $each_total_price[$index]=$each_calc_price[$index]*$amount[$index];
            console.log($each_total_price);

            var $result_price=$each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $(this).closest(".det_count_box").siblings(".det_count_price").find(".each_price").text($result_price);
            calc_price()
            return false;
        }
    });
    $(document).on("click", ".plus", function(){
        var $index=$(this).closest("li").index();
        $amount[$index]++;
        console.log($amount);
        $(this).siblings("input").val($amount[$index]);
        $each_total_price[$index]=$each_calc_price[$index]*$amount[$index];
        console.log($each_total_price);

        var $result_price=$each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(this).closest(".det_count_box").siblings(".det_count_price").find(".each_price").text($result_price);
        calc_price()
        return false;
    });

    /* 
    slice(index1, index2)   배열 객체에 데이터 중 원하는 인덱스 구간만큼 잘라서 배열 객체로 가져옴
    splice( )               배열 객체에 지정 데이터를 삭제하고 그 구간에 새 데이터를 삽입
    empty( ) $("요소선택").empty();     선택한 요소의 하위 내용들을 모두 삭제
    remove( ) $("요소선택").remove();   선택한 요소를 삭제
    */
    $(document).on("click", ".item_del", function(){
        var $del_index=$(this).closest("li").index();
        $each_total_price.splice($del_index, 1); // 배열 데이터에서 해당하는 인덱스 번호로부터 몇 번째까지 삭제
        $each_calc_price.splice($del_index, 1);
        $amount.splice($del_index, 1);
        console.log($each_total_price);
        console.log($amount);


        $(this).closest("li").remove();
        calc_price()
    });
















































});
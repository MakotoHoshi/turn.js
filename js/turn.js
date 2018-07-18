function Turn(){
	var counter = 2;
	// スライドが入っている要素
	var turnBody = $('#turn');
	// スライド要素
	var movingWrap = $('#turn .moving_wrap');
	// スライドの中身
	var det = $('#turn .moving_wrap .det');
	// スライドの中身の数
	var detLen = det.length;
	// スライド要素の幅
	var wrapWidth = 100*(det.length*2);
	// prevコントローラーのボタン
	var prev = $('#turn .prev');
	// nextコントローラーのボタン
	var next = $('#turn .next');
	// スライドの間隔
	var interval = 6000;
	// 移動するスピード
	var speed = 600;
	var defaultPosition = -100;
	// 連打防止用フラッグ
	var click_flg = true;
	// スライド用関数
	function move(){
		// ホバーしていなければスライドさせる
		if(!turnBody.hasClass('hover') && click_flg==true){
			click_flg = false;
			movingWrap.animate({
				'left':-(100*counter)+'%'
			},speed,function(){
				click_flg = true;
			});
			// prevで初期位置より前に移動したら、こっそり最後尾に移動する
			if(counter == 0){
				movingWrap.animate({
					'left':-(100*detLen)+'%'
				},{duration:0});
				counter = detLen;
			}
			// 最後までスライドしたら、こっそり初期位置に戻る
			if(counter == detLen+1){
				movingWrap.animate({
					'left':defaultPosition+'%'
				},{duration:0});
				counter = 2;
			}else{
				counter++;
			}
		}
	}

	// スライドの最後尾に先頭のスライドのクローンを作る
	movingWrap.children().eq(0).clone(true).insertAfter(det.eq(detLen-1));
	// スライドの先頭に最後尾のスライドのクローンを作る
	movingWrap.children().eq(detLen-1).clone(true).insertBefore(det.eq(0));
	// 改めてスライド要素を取得
	detAfter = $('#turn .moving_wrap .det');

	// ロード時とリサイズをする度に実行
	$(window).on('load resize', function(){
		// ウィンドウサイズを取得
		var windowSize = $(window).width();
		// turnBodyの親のサイズを取得
		var parentSize = turnBody.parent().width();
		turnBody.css({
			// css指定
			'width':parentSize+'px'
		});
		detAfter.css({
			// css指定
			'width':parentSize+'px'
		});
	});

	// CSS
	movingWrap.css({
		// スライドの初期位置
		'width':wrapWidth+'%',
		'left':defaultPosition+'%'
	});

	// Prev処理
	prev.on('click',function(){
		counter = counter-2;
		move();
		if(counter == 0){
			movingWrap.animate({
				'left':-300+'%'
			},{duration:0});
			counter = 3;
		}
	});

	// Next処理
	next.on('click',function(){
		move();
	});

	// スライド関数実行
	var intervalID = setInterval(move,interval);

	//ユーザーエージェント判定
	$(function(){
		var _ua = (function(u){
			return{
				Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
				|| u.indexOf("ipad") != -1
				|| (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
		        || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
		        || u.indexOf("kindle") != -1
		        || u.indexOf("silk") != -1
		        || u.indexOf("playbook") != -1,
		      Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
		        || u.indexOf("iphone") != -1
		        || u.indexOf("ipod") != -1
		        || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
		        || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
		        || u.indexOf("blackberry") != -1
		    }
		})(window.navigator.userAgent.toLowerCase());
		if(!_ua.Mobile && !_ua.Tablet){
		    //PC
			// ホバーしたらスライドを停止
			movingWrap.hover(function(){
				turnBody.addClass('hover');
			},function(){
				turnBody.removeClass('hover');
			});
		}else{
			//モバイル
			//フリック
			movingWrap.bind('touchstart', function(){
				//フリック開始時にX座標を取得
				startX = event.changedTouches[0].pageX;
			});
			movingWrap.bind('touchmove', function(e){
				//フリック終了時のX軸の座標
				endX = event.changedTouches[0].pageX;
				//フリックの移動距離
				diffX = Math.round(startX - endX);
			});
			movingWrap.bind('touchend', function(e){
				//指を離した時
				if(startX > endX){
					//左
					move();
				}
				else if(startX < endX){
					//右
					counter = counter-2;
					move();
					if(counter == 0){
						movingWrap.animate({
							'left':-300+'%'
						},{duration:0});
						counter = 3;
					}
				}
			});
		}
	});
}

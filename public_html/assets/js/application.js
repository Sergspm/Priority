
$(function () {
	function isMobile() {
		return Win.width() <= 768;
	}
	var Win = $(window);

	// Tabs
	$('.s-tabs .b-tabs .tab').click(function () {
		var self = $(this);
		if (!self.hasClass('active')) {
			self.addClass('active').siblings().removeClass('active');
			self.closest('.s-tabs').find('.b-tabs-content').removeClass('active').eq(self.index()).addClass('active');
		}
		return false;
	});

	// Go to top button
	$('.a-go-top').click(function () {
		$('html, body').animate({ scrollTop: 0 }, 500);
	});

	// Swipe slider
	$('.a-swipe-slide').each(function () {
		(function (slider) {
			var inner = slider.find('.a-inner'),
				only_mobile = slider.hasClass('a-only-mobile'),
				speed = 500,
				init_inner_x = null,
				init_x = null,
				total_slides_width = null,
				inner_width = null;

			function move(e) {
				var x = getX(e);
				var max = Math.max(inner_width - total_slides_width, init_inner_x + (x - init_x));
				var left = Math.min(0, max);
				inner.css({ left: left + 'px' });
			}

			function stop(e) {
				Win.off('touchend', stop);
				Win.off('touchmove', move);
			}

			function getX(e) {
				return e.originalEvent.touches[0] ? e.originalEvent.touches[0].pageX : null;
			}

			function setX(x) {
				inner.css({ left: x + 'px' });
			}

			function calcTotalSlidesWidth() {
				var slide = inner.find('.a-slide').last(),
					inner_x = getInnerX(),
					total = 0;
				setX(0);
				total = slide.offset().left + slide.outerWidth(true);
				setX(inner_x);
				return total;
			}

			function getInnerX() {
				var left = parseInt(inner.css('left'));
				return isFinite(left) ? left : 0;
			}

			function getInnerWidth() {
				return inner.width();
			}

			slider.on('touchstart', function (e) {
				if (only_mobile && !isMobile()) {
					return;
				}
				Win.on('touchend', stop);
				Win.on('touchmove', move);
				init_x = getX(e);
				init_inner_x = getInnerX();
				total_slides_width = calcTotalSlidesWidth();
				inner_width = getInnerWidth();
			});
		})($(this));
	});

	// Slider with arrows
	$('.a-slider-arrows').each(function () {
		(function (slider) {
			var inner = slider.find('.a-inner'),
				in_progress = false,
				only_mobile = slider.hasClass('a-only-mobile'),
				only_fullwide = slider.hasClass('a-only-fullwide'),
				speed = 500;
			slider.find('.a-arrow').click(function () {
				var is_mobile = isMobile();
				if (in_progress || (only_mobile && !is_mobile) || (only_fullwide && is_mobile)) {
					return;
				}
				in_progress = true;
				var slides = inner.find('.a-slide');
				if ($(this).hasClass('right')) {
					inner
						.append(slides.first().clone(true))
						.animate({ left: -slides.first().outerWidth(true) + 'px'}, speed, function () {
							slides.first().remove();
							inner.css({ left: 0 });
							in_progress = false;
						});
				} else {
					inner
						.prepend(slides.last().clone(true))
						.css({ left: -slides.last().outerWidth(true) + 'px' })
						.animate({ left: 0 }, speed, function () {
							slides.last().remove();
							in_progress = false;
						});
				}
			});
		})($(this));
	});
});

$(function () {
	function isMobile() {
		return Win.width() <= 768;
	}
	var Win = $(window),
		Doc = $(document),
		Body = $('body');

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

	// Modal forms
	(function () {
		var modal = $('.s-modals'),
			modals = $('.s-modal'),
			class_active = 'active';
		$('[data-action="modal-show"]').click(function () {
			Body.addClass('m-overflow-hide');
			modal.addClass('active');
			modals.removeClass('active').filter('.' + ($(this).attr('data-action-target') || 'a')).addClass('active');
			return false;
		});
		$('[data-action="modal-hide"]').click(close);
		Doc.keyup(function (e) {
			if (e.keyCode === 27) {
				close();
			}
		});
		function close() {
			modal.removeClass('active');
			return false;
		}
	})();

	// Switch password field visibility
	$('.el-input-password .eye').click(function () {
		var input = $(this).siblings('input');
		input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
		return false;
	});

	// Fadein arrows slider
	$('.a-slider-arrows-fadein').each(function () {
		(function (slider) {
			var inner = slider.find('.a-inner'),
				in_progress = false,
				duration = 500;
			slider.find('.a-arrow').click(function () {
				if (in_progress) {
					return;
				}
				in_progress = true;
				var slides = slider.find('.a-slide'),
					inner_width = inner.width(),
					cur_width = 0,
					fade_in_slide = null;
				slides.each(function () {
					var slide = $(this);
					cur_width += slide.outerWidth(true);
					if (inner_width - cur_width + 30 < 0 && !fade_in_slide) {
						fade_in_slide = slide;
					}
				});
				if ($(this).hasClass('right')) {
					var first = slides.first(),
						clone = first.clone(true);
					if (!fade_in_slide) {
						fade_in_slide = clone;
					}
					inner
						.append(clone)
						.animate({ left: -first.outerWidth(true) + 'px' }, duration, function () {
							first.remove();
							inner.css({ left: 0 });
							in_progress = false;
							recheck();
						});
						fade_in_slide.css({ visibility: 'visible' }).animate({ opacity: 1 }, duration);
						first.animate({ opacity: 0 }, duration);
				} else {
					var last = slides.last(),
						clone = last.clone(true);
					if (!fade_in_slide) {
						fade_in_slide = last;
					} else {
						fade_in_slide = fade_in_slide.prev();
					}
					inner
						.prepend(clone.css({ visibility: 'visible', opacity: 0 }))
						.css({ left: -clone.outerWidth(true) + 'px' })
						.animate({ left: 0 }, duration, function () {
							last.remove();
							in_progress = false;
							recheck();
						});
					fade_in_slide.animate({ opacity: 0 }, duration);
					clone.animate({ opacity: 1 }, duration);
				}
			});
			recheck();
			Win.resize(recheck);
			function recheck() {
				if (in_progress) {
					return;
				}
				var inner_width = inner.width(),
					cur_width = 0;
				slider.find('.a-slide').each(function () {
					var slide = $(this);
					cur_width += slide.outerWidth(true);
					if (inner_width - cur_width + 30 < 0) {
						slide.css({ opacity: 0, visibility: 'hidden' });
					}
				});
			}
		})($(this));
	});

	// Counter in cart
	$('.s-main-cart .m-tbl.row .counter a').click(function () {
		var self = $(this),
			num = self.siblings('.num'),
			input = self.siblings('input'),
			value = Math.max(1, (parseInt(input.val()) || 1) + (1 * (self.hasClass('plus') ? 1 : -1)));
		num.html(value);
		input.val(value).change();
		return false;
	});
});
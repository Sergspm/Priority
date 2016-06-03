
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
			Body.removeClass('m-overflow-hide');
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
				var slides = slider.find('.a-slide');
				if (isMobile()) {
					slides.css({ opacity: 1, visibility: 'visible' });
				} else {
					var inner_width = inner.width(),
						cur_width = 0;
					slides.each(function () {
						var slide = $(this);
						cur_width += slide.outerWidth(true);
						if (inner_width - cur_width + 30 < 0) {
							slide.css({ opacity: 0, visibility: 'hidden' });
						}
					});
				}
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

	// Right panel show/hide
	(function () {
		var panel = $('.s-float-right-panel');
		if (panel.size()) {
			panel.find('.s-float-right-panel-tabs .tab').click(function () {
				panel.addClass('active');
				return false;
			});
			Body.click(function (e) {
				if (!$(e.target).closest(panel).size()) {
					panel.removeClass('active');
				}
			});
		}
	})();

	// Search panel show/hide
	(function () {
		var panel = $('.s-header-search');
		$('.s-header-nav .search a').click(function () {
			panel.toggleClass('active');
			return false;
		});
	})();

	// Animate from anchor-links to related blocks
	$('a.a-anchor').click(function () {
		var related = $('#' + this.href.split('#')[1]);
		if (related.size()) {
			$('html, body').animate({ scrollTop: related.offset().top + 'px' }, 500);
			return false;
		}
	});

	// Switch photos in card gallery
	$('.s-card-content .gallery .preview').click(function () {
		var self = $(this);
		self.closest('.gallery').find('.main-img').css({ 'background-image': "url('" + self.attr('href') + "')" });
		return false;
	});

	// Toggle main mobile menu
	$('.s-header-mobile .menu-hamb, .s-header-mobile .menu-arrow').click(function () {
		$('.s-main-mobile-menu, .s-header-mobile').toggleClass('active');
		Body.toggleClass('m-overflow-hide');
		return false;
	});

	// Price slider
	$('.el-slider-range').each(function () {
		var slider = $(this),
			input_min = slider.find('.inputs .start'),
			input_max = slider.find('.inputs .end'),
			stripe_outer = slider.find('.stripe-outer'),
			stripe = slider.find('.stripe'),
			hands = slider.find('.hand'),
			price_min = parseInt(slider.attr('data-price-min')),
			price_max = parseInt(slider.attr('data-price-max')),
			price_cur_min, price_cur_max, changed, stripe_outer_width,
			move_property, move_start_x, move_start_offset_right, move_start_offset_left, outer_offset_x;

		readPrices();
		updateStripeOuterWidth();
		translateFromValToStripe();

		Win.on('resize', function () {
			updateStripeOuterWidth();
		});
		input_min.on('change', function () {
			changeViaInput('min');
		});
		input_max.on('change', function () {
			changeViaInput('max');
		});
		hands.mousedown(initMove);

		function initMove(e) {
			move_start_x = e.clientX;
			outer_offset_x = stripe_outer.offset().left;
			move_start_offset_right = parseInt(stripe.css('right')) || 0;
			move_start_offset_left = parseInt(stripe.css('left')) || 0;
			move_property = $(e.target).hasClass('right') ? 'right' : 'left';
			Doc.on('mousemove', move);
			Doc.on('mouseup', stopMove);
		}

		function move(e) {
			var x = e.clientX,
				delta = x - move_start_x,
				new_offset = move_property === 'right'
					? Math.min(stripe_outer_width - move_start_offset_left, Math.max(0, move_start_offset_right - delta))
					: Math.max(0, Math.min(stripe_outer_width - move_start_offset_right, move_start_offset_left + delta));
			stripe.css(move_property, new_offset + 'px');
			translateFromOffsetsToVal(
				move_property === 'right' ? new_offset : move_start_offset_right,
				move_property !== 'right' ? new_offset : move_start_offset_left
			);
		}

		function stopMove() {
			Doc.off('mousemove', move);
			Doc.off('mouseup', stopMove);
		}

		function translateFromOffsetsToVal(right, left) {
			right = isFinite(right) ? right : parseInt(stripe.css('right')) || 0;
			left = isFinite(left) ? left : parseInt(stripe.css('left')) || 0;
			var perc_width = stripe_outer_width / 100,
				perc_price = (price_max - price_min) / 100;
			input_min.val(parseInt(Math.min(price_cur_max, price_min + (left / perc_width) * perc_price)));
			input_max.val(parseInt(Math.max(price_cur_min, price_max - (right / perc_width) * perc_price)));
		}

		function translateFromValToStripe() {
			var total_delta = price_max - price_min,
				current_min_delta = price_cur_min - price_min,
				current_max_delta = price_max - price_cur_max;
			stripe.css({
				left: ((stripe_outer_width / 100) * (current_min_delta / (total_delta / 100))) + 'px',
				right: ((stripe_outer_width / 100) * (current_max_delta / (total_delta / 100))) + 'px'
			});
		}

		function translateValToInputs() {
			input_min.val(price_cur_min);
			input_max.val(price_cur_max);
		}

		function changeViaInput(mode) {
			changed = mode;
			readPrices();
			translateValToInputs();
			translateFromValToStripe();
		}

		function validatePrices() {
			if (!isFinite(price_cur_min) || price_cur_min < price_min) {
				price_cur_min = price_min;
			}
			if (!isFinite(price_cur_max) || price_cur_max > price_max) {
				price_cur_max = price_max;
			}
			if (price_cur_min > price_cur_max) {
				if (changed === 'min') {
					price_cur_min = price_cur_max;
				} else {
					price_cur_max = price_cur_min;
				}
			}
		}

		function readPrices() {
			price_cur_min = parseInt(input_min.val()) || price_min;
			price_cur_max = parseInt(input_max.val()) || price_max;
			validatePrices();
		}

		function updateStripeOuterWidth() {
			stripe_outer_width = stripe_outer.width();
		}
	});

	// Scrollers
	$('.s-scroller').each(function () {
		var scroller = $(this),
			stripe_outer = scroller.find('.scroller-outer'),
			stripe = stripe_outer.find('.stripe'),
			hand = stripe.find('.hand'),
			inner = scroller.find('.inner'),
			init_y, init_stripe_height, stripe_outer_height, scroller_height, inner_height;

		if (scroller.height() >= inner.height()) {
			return;
		}

		stripe_outer.addClass('active');

		hand.on('mousedown', start);

		function start(e) {
			init_y = e.clientY;
			stripe_outer_height = stripe_outer.height();
			init_stripe_height = stripe.height();
			scroller_height = scroller.outerHeight();
			inner_height = inner.outerHeight();
			Doc.on('mousemove', move);
			Doc.on('mouseup', stop);
		}

		function move(e) {
			var y = e.clientY,
				delta = y - init_y,
				new_height = Math.max(0, Math.min(stripe_outer_height, init_stripe_height + delta)),
				inner_top =  -1 * parseInt(((inner_height - scroller_height) / 100) * (new_height / (stripe_outer_height / 100)));
			stripe.css({ height: new_height + 'px' });
			inner.css({ top: inner_top + 'px' });
			return false;
		}

		function stop() {
			Doc.off('mousemove', move);
			Doc.off('mouseup', stop);
		}
	});

	// Show ghost's blocks
	(function () {
		var handlers = $('[data-action="ghost"]');
		var close_handlers = $('[data-action="ghost-close"]');
		handlers.click(function () {
			var ghost = $($(this).attr('data-action-target'));
			if (ghost.size()) {
				resetAll();
				Body.addClass('m-overflow-hide');
				ghost.addClass('active').css({ top: Math.max(0, $('.s-header-mobile').height() - Win.scrollTop()) + 'px' });
			}
			return false;
		});
		close_handlers.click(function () {
			var ghost = $($(this).attr('data-action-target'));
			if (ghost.size()) {
				Body.removeClass('m-overflow-hide');
				ghost.removeClass('active');
			}
			return false;
		});
		$('.s-left-catalog-menu .main-nav .item > a.m-tbl').click(function () {
			if (!isMobile()) {
				return;
			}
			$(this)
				.siblings('.popup-nav')
				.addClass('active')
				.css({ top: Math.max(0, $('.s-header-mobile').height() - Win.scrollTop()) + 'px' });
			return false;
		});
		$('.s-left-catalog-menu .main-nav .item .popup-nav .close').click(function () {
			$(this).closest('.popup-nav').removeClass('active');
			return false;
		});
		function resetAll() {
			handlers.each(function () {
				$($(this).attr('data-action-target')).removeClass('active');
			});
		}
	})();
});
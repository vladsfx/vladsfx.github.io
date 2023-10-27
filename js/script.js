'use strict';
// --- Слайдер ---
window.addEventListener('DOMContentLoaded', () => {
	const slider = tns({
		container: '.carusel__inner',
		items: 1,
		slideBy: 'page',
		// speed: 500,
		autoplay: false,
		controls: false,
		navPosition: 'bottom',
		responsive: {
			768: {
				nav: true,
			},
			992: {
				nav: false,
			},
		},
	});

	document.querySelector('.prev').addEventListener('click', () => {
		slider.goTo('prev');
	});

	document.querySelector('.next').addEventListener('click', () => {
		slider.goTo('next');
	});

	// --- Табы ---
	const tabs = document.querySelectorAll('.catalog__tab');
	const contents = document.querySelectorAll('.catalog__content');

	for (let i = 0; i < tabs.length; i++) {
		tabs[i].addEventListener('click', (event) => {
			// Удаление класса активности у табов и блоков контента
			for (let j = 0; j < tabs.length; j++) {
				tabs[j].classList.remove('catalog__tab_active');
				contents[j].classList.remove('catalog__content_active');
			}

			tabs[i].classList.add('catalog__tab_active');
			contents[i].classList.add('catalog__content_active');
		});
	}

	// --- Ссылки ---

	function followLink(className) {
		const items = document.querySelectorAll('.catalog-item');
		items.forEach((item) => {
			item.querySelector(className).addEventListener('click', (event) => {
				event.preventDefault();
				item.querySelector('.catalog-item__content').classList.toggle('catalog-item__content_active');
				item.querySelector('.catalog-item__list').classList.toggle('catalog-item__list_active');
			});
		});
	}

	followLink('.catalog-item__link');
	followLink('.catalog-item__back');

	// --- Модальные окна ---

	const consults = document.querySelectorAll('.button[data-modal="consultation"]');
	const orders = document.querySelectorAll('.button[data-modal="order"]');
	const closes = document.querySelectorAll('.modal__close');
	const modals = document.querySelectorAll('.modal');
	const titles = document.querySelectorAll('.catalog-item__subtitle');

	consults.forEach((item) => {
		item.addEventListener('click', () => {
			document.querySelector('.overlay').style.display = 'block';
			document.querySelector('#consultation').style.display = 'block';
			document.body.style.overflow = 'hidden';
		});
	});

	orders.forEach((item, id) => {
		item.addEventListener('click', () => {
			document.querySelector('.overlay').style.display = 'block';
			const order = document.querySelector('#order');
			order.querySelector('.modal__descr').textContent = titles[id].textContent;
			order.style.display = 'block';
			document.body.style.overflow = 'hidden';
		});
	});

	closes.forEach((item) => {
		item.addEventListener('click', () => {
			document.querySelector('.overlay').style.display = 'none';
			modals.forEach((item) => {
				item.style.display = 'none';
			});
			document.body.style.overflow = '';
		});
	});

	// --- Валидация формы ---

	function validateForm(form) {
		$(form).validate({
			rules: {
				name: {
					required: true,
					minlength: 2,
				},
				phone: 'required',
				email: {
					required: true,
					email: true,
				},
			},
			messages: {
				name: {
					required: 'Пожалуйства, введите ваше имя',
					minlength: jQuery.validator.format('Имя не менее {0} символов'),
				},
				phone: 'Пожалуйства, введите ваш телефон',
				email: {
					required: 'Пожалуйства, введите ваш email',
					email: 'Введите email в формате name@domain.com',
				},
			},
		});
	}

	validateForm('#consultation-form');
	validateForm('#consultation form');
	validateForm('#order form');

	// --- Мвска ввода телефона ---
	$('input[name=phone]').mask('+7 (999) 999-99-99');

	// --- Отправка данных формы ---

	const forms = document.querySelectorAll('form');

	forms.forEach((item) => {
		postData(item);
	});

	function postData(form) {
		form.addEventListener('submit', (e) => {
			if ($(form).valid()) {
				e.preventDefault();

				const currentFormId = form.id;

				if (currentFormId != 'consultation-form') {
					form.parentNode.style.display = 'none';
				} else {
					form.reset();
				}
				
				document.querySelector('.overlay').style.display = 'block';
				document.querySelector('#thanks').style.display = 'block';

				const request = new XMLHttpRequest();
				request.open('POST', 'php/server.php');

				// В связке XMLHttpRequest->FormData не устанавливать!!!!
				//request.setRequestHeader('Content-type', 'multipart/form-data');

				const formData = new FormData(form);

				request.send(formData);
				request.addEventListener('load', () => {
					if (request.status === 200) {
						console.log(request.response);
					} else {
						console.log('Передать данные не удалось');
					}
				});
			}
		});
	}
});

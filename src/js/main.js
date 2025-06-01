document.addEventListener("DOMContentLoaded", function () {
    let bodyEl = document.body;
   
    //PROMO SLIDER
    let promoSlider = new Swiper('.promo-swiper',{
      spaceBetween: 10,
      speed:600,
      navigation: {
        nextEl: ".promo-swiper-next",
        prevEl: ".promo-swiper-prev",
      },
      pagination: {
        el: ".promo-swiper-pagination",
        clickable: true,
      },
    });
  
    const productSwipers = document.querySelectorAll('.product-swiper');

    productSwipers.forEach((swiperEl, index) => {
      new Swiper(swiperEl, {
        slidesPerView: 2,
        spaceBetween: 12,
        scrollToSlides:2,
        speed:600,
        navigation: {
          nextEl: swiperEl.querySelector('.product-swiper-next'),
          prevEl: swiperEl.querySelector('.product-swiper-prev'),
        },
        breakpoints: {
          768: {
            slidesPerView: 4,
             spaceBetween: 18,
          }
        }
      });
    });

    
    // СЧЕТЧИК
    let counters = document.querySelectorAll('.counter');

      counters.forEach((counter) => {
        const minusButton = counter.querySelector('.counter-minus');
        const plusButton = counter.querySelector('.counter-plus');
        const counterValue = counter.querySelector('.counter-value'); // <input type="number">

        // Обновляет кнопку "-" в зависимости от текущего значения
        const updateMinusButtonState = (value) => {
          if (value <= 0) {
            minusButton.setAttribute('disabled', 'disabled');
          } else {
            minusButton.removeAttribute('disabled');
          }
        };

        // Слушаем клик на кнопку "-"
        minusButton.addEventListener('click', () => {
          let currentValue = parseInt(counterValue.value, 10) || 0;
          if (currentValue > 0) {
            currentValue -= 1;
            counterValue.value = currentValue;
            updateMinusButtonState(currentValue);
          }
        });

        // Слушаем клик на кнопку "+"
        plusButton.addEventListener('click', () => {
          let currentValue = parseInt(counterValue.value, 10) || 0;
          currentValue += 1;
          counterValue.value = currentValue;
          updateMinusButtonState(currentValue);
        });

        // Обработка ручного ввода
        counterValue.addEventListener('input', () => {
          let value = parseInt(counterValue.value, 10);
          if (isNaN(value) || value < 0) {
            counterValue.value = 0;
            value = 0;
          }
          updateMinusButtonState(value);
        });
      });
          
    // INPUT TYPE="FILE"
    const fileInputs = document.querySelectorAll(".fileUploadInput");

    if (fileInputs) {
      fileInputs.forEach((input) => {
        input.addEventListener("change", (event) => {
          const label = input.closest(".fileUpload-label");
          const labelTxt = label.querySelector(".fileUpload-name");
         
    
          // Получаем файл и его размер
          const file = input.files[0];
          const fileName = file?.name || "Заменить фото";
    
          if (file) {
            // Если файл соответствует требованиям
            labelTxt.textContent = fileName; // Отображаем имя файла
           
          }
          
        });
      });
    
      
    }
    /* =============== modal с атрибутом [data-modal] ===============*/ 
    const modalOpen = document.querySelectorAll('[data-btn]');
    const modalFrames = document.querySelectorAll('[data-modal]');
    
    if (modalFrames.length > 0) {
        const modalFramesClose = document.querySelectorAll('[data-close]');
    
        // Открытие модального окна
        for (let item of modalOpen) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем всплытие
    
                const itemAttr = item.getAttribute('data-btn');
    
                for (let frame of modalFrames) {
                    const frameAttr = frame.getAttribute('data-modal');
                    if (frameAttr === itemAttr) {
                        frame.classList.add('visible');
                        document.body.classList.add('lock');
                    }
                }
            });
        }
    
        // Закрытие модального окна при клике на крестик (data-close)
        for (let item of modalFramesClose) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем всплытие
    
                const parentModal = item.closest('[data-modal]');
                if (parentModal) {
                    // Закрываем текущее модальное окно
                    parentModal.classList.remove('visible');
    
                    // Закрываем все дочерние модальные окна внутри родителя
                    const childModals = parentModal.querySelectorAll('[data-modal].visible');
                    for (let child of childModals) {
                        child.classList.remove('visible');
                    }
    
                    // Проверяем, остались ли открытые модальные окна
                    const anyModalVisible = document.querySelector('[data-modal].visible');
                    if (!anyModalVisible) {
                        document.body.classList.remove('lock');
                    }
                }
            });
        }
    
        // Закрытие модальных окон по клику вне их
        document.addEventListener('click', function (e) {
            const target = e.target;
    
            // Проверяем, кликнули ли мы по data-modal, но не по data-btn внутри него
            if (target.matches('[data-modal]') && !target.querySelector('[data-btn]:hover')) {
                // Закрываем и текущее модальное окно, и его дочерние модалки
                target.classList.remove('visible');
                const childModals = target.querySelectorAll('[data-modal].visible');
                for (let child of childModals) {
                    child.classList.remove('visible');
                }
    
                // Проверяем, остались ли открытые модальные окна
                const anyModalVisible = document.querySelector('[data-modal].visible');
                if (!anyModalVisible) {
                    document.body.classList.remove('lock');
                }
            }
        });
    }
    // DROP SELECT
    document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
    const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
    const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
    const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
    const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

    // Клик по кнопке. Открыть/Закрыть select
    dropDownBtn.addEventListener('click', function (e) {
      dropDownList.classList.toggle('dropdown__list--visible');
      this.classList.toggle('dropdown__button--active');
    });
      

    // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
    dropDownListItems.forEach(function (listItem) {
      
      listItem.addEventListener('click', function (e) {
        e.stopPropagation();
        dropDownBtn.innerText = this.innerText;
        dropDownBtn.focus();
        dropDownInput.value = this.dataset.value;
        
        dropDownList.classList.remove('dropdown__list--visible');
        dropDownBtn.classList.remove('dropdown__button--active');
        
      });
    });

    // Клик снаружи дропдауна. Закрыть дропдаун
    document.addEventListener('click', function (e) {
      if (e.target !== dropDownBtn) {
        dropDownBtn.classList.remove('dropdown__button--active');
        dropDownList.classList.remove('dropdown__list--visible');
      }
    });

    // Нажатие на Tab или Escape. Закрыть дропдаун
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' || e.key === 'Escape') {
        dropDownBtn.classList.remove('dropdown__button--active');
        dropDownList.classList.remove('dropdown__list--visible');
      }
    });
  });

    
});


document.addEventListener('DOMContentLoaded', function() {
  // const tabsContainers = document.querySelectorAll('.tabs-container');
  
  //   tabsContainers.forEach(container => {
  //     const tabs = container.querySelectorAll('.tab');
  //     const contents = container.querySelectorAll('.tab-content');
  
  //     tabs.forEach(tab => {
  //       tab.addEventListener('click', () => {
  //         tabs.forEach(innerTab => innerTab.classList.remove('active'));
  //         tab.classList.add('active');
  
  //         contents.forEach(content => content.classList.remove('active'));
  //         const activeContent = container.querySelector(tab.getAttribute('data-tab-target'));
  
  //         // Проверяем, существует ли элемент activeContent перед добавлением класса
  //         if (activeContent) {
  //           activeContent.classList.add('active');
  //         } else {
  //           console.error('Ошибка: Нет элемента соответствующего data-tab-target:', tab.getAttribute('data-tab-target'));
  //         }
  //       });
  //     });
  //   });

   //
  const catalogyItems = document.querySelectorAll('.catalogy-item');
			if(catalogyItems.length>0){
				catalogyItems.forEach((item)=>{
					catalogyHasDrop = item.querySelector('.has-drop');
					catalogyDropContent = item.querySelector('.has-drop-content');
					catalogyHasSub = item.querySelectorAll('.has-subdrop');
					console.log('555');

					catalogyHasDrop.addEventListener('click', ()=>{
						if(item.classList.contains('active')){
							item.classList.remove('active');
						}else{
							item.classList.add('active');
							catalogyDropContent.classList.add('active');
						}
					});

					catalogyHasSub.forEach((sub)=>{
						catalogySubContent = sub.querySelector('.has-subdrop-content');
					
							sub.addEventListener('click', ()=>{
								if(sub.classList.contains('active')){
									sub.classList.remove('active');
								}else{
									sub.classList.add('active');
									
								}
							});
					});
				});
			}
   
});

document.addEventListener('DOMContentLoaded', function() {


  //
  const acordions = document.querySelectorAll('.acordion');
  if(acordions.length >0){
    acordions.forEach((acor)=>{
      const acorGroups = acor.querySelectorAll('.acordion-group');
        acorGroups.forEach((gr)=>{
          acorItemHeader = gr.querySelector('.acordion-header');
          acorItemHeader.addEventListener('click', ()=>{
            if(gr.classList.contains('active')){
              gr.classList.remove('active');
            }else{
              gr.classList.add('active');
            }
          })
        });
    });
  }
})


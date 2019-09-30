export function getCloseButton(targetModal) {
    let fragment = document.createDocumentFragment(),
        closeBtnTemplate = document.createElement('div'),
        firstLine = document.createElement('div'),
        secondLine = document.createElement('div');

    firstLine.classList.add('first-line');
    secondLine.classList.add('second-line');
    closeBtnTemplate.classList.add('close-btn');
    closeBtnTemplate.appendChild(firstLine);
    closeBtnTemplate.appendChild(secondLine);
    fragment.appendChild(closeBtnTemplate);

    closeBtnTemplate.addEventListener('click', function () {
        targetModal.classList.add('hidden');
        targetModal.innerHTML = '';
        document.querySelector('.editor').classList.remove('blury');
    });

    return fragment;
}

export function modalFunction(modalElements) {
    for (let element in modalElements) {
        modalElements[element].addEventListener('click', function (e) {
            const target = document.getElementById(e.target.dataset.target);
            if (target) {
                if (target.id === 'loadedMaps' && loadMap.length > 0) {
                    loadMapsPreview(loadMap);
                }
                target.classList.remove('hidden');
                target.prepend(getCloseButton(target));
                document.querySelector('.editor').classList.add('blury');
            }
        });
    }
}
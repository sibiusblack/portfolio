// Gallery pop-up: opens case study images in a viewer with previous/next navigation.
// Works for any page with images inside .gallery-frame links.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery-frame'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var items = links.map(function (a) {
    var img = a.querySelector('img');
    var cap = a.closest('figure') ? a.closest('figure').querySelector('figcaption') : null;
    return { src: a.getAttribute('href'), alt: img ? img.alt : '', caption: cap ? cap.textContent : '' };
  });

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML =
    '<div class="lightbox-inner">' +
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous image">&larr;</button>' +
      '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" alt="">' +
        '<figcaption><span class="lightbox-caption"></span><span class="lightbox-count"></span></figcaption>' +
      '</figure>' +
      '<button type="button" class="lightbox-next" aria-label="Next image">&rarr;</button>' +
    '</div>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector('.lightbox-img');
  var caption = dialog.querySelector('.lightbox-caption');
  var count = dialog.querySelector('.lightbox-count');
  var current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.caption;
    count.textContent = (current + 1) + ' / ' + items.length;
  }

  links.forEach(function (a, i) {
    a.removeAttribute('target');
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dialog.showModal();
      document.body.classList.add('lightbox-open');
    });
  });

  dialog.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
  dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });

  // Click on the dark background closes the viewer
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.classList.contains('lightbox-inner')) dialog.close();
  });
  dialog.addEventListener('close', function () { document.body.classList.remove('lightbox-open'); });

  // Arrow keys to navigate (Esc closes automatically)
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });

  // Swipe on phones
  var startX = null;
  dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

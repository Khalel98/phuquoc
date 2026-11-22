/**
 * Общая оболочка приложения: панель при прокрутке и «лист снизу».
 * AppSheet.open(sheetEl, { onClose }) / AppSheet.close(sheetEl)
 * Лист закрывается крестиком, фоном, Escape или свайпом вниз за «ручку».
 */
(function (global) {
  /* Спрайт иконок встроен, чтобы работать и с file://, и офлайн. Источник — icons.svg. */
  var SPRITE = "<svg xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" style=\"position:absolute;width:0;height:0;overflow:hidden\"><symbol id=\"route\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"6\" cy=\"19\" r=\"3\"/><path d=\"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15\"/><circle cx=\"18\" cy=\"5\" r=\"3\"/></symbol><symbol id=\"docs\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z\"/><path d=\"M14 2v6h6\"/><path d=\"M8 13h8M8 17h5\"/></symbol><symbol id=\"phrases\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/><path d=\"M8 9h8M8 13h5\"/></symbol><symbol id=\"currency\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\"/><path d=\"M6 12h.01M18 12h.01\"/></symbol><symbol id=\"more\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/></symbol><symbol id=\"navigate\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 11l19-9-9 19-2-8z\"/></symbol><symbol id=\"headphones\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 18v-6a9 9 0 0 1 18 0v6\"/><path d=\"M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z\"/></symbol><symbol id=\"play\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z\"/></symbol><symbol id=\"pause\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"5.5\" y=\"4\" width=\"4.5\" height=\"16\" rx=\"1.2\"/><rect x=\"14\" y=\"4\" width=\"4.5\" height=\"16\" rx=\"1.2\"/></symbol><symbol id=\"prev\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M18 5.5v13a1 1 0 0 1-1.55.83L7.7 13.2a1.5 1.5 0 0 1 0-2.4l8.75-6.13A1 1 0 0 1 18 5.5z\"/><rect x=\"5\" y=\"5\" width=\"2.4\" height=\"14\" rx=\"1\"/></symbol><symbol id=\"next\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M6 5.5v13a1 1 0 0 0 1.55.83l8.75-6.13a1.5 1.5 0 0 0 0-2.4L7.55 4.67A1 1 0 0 0 6 5.5z\"/><rect x=\"16.6\" y=\"5\" width=\"2.4\" height=\"14\" rx=\"1\"/></symbol><symbol id=\"rewind\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5\"/></symbol><symbol id=\"forward\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12a9 9 0 1 1-3-6.7L21 8\"/><path d=\"M21 3v5h-5\"/></symbol><symbol id=\"volume\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 5L6 9H2v6h4l5 4z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14\"/></symbol><symbol id=\"mute\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 5L6 9H2v6h4l5 4z\"/><path d=\"M22 9l-6 6M16 9l6 6\"/></symbol><symbol id=\"close\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M18 6L6 18M6 6l12 12\"/></symbol><symbol id=\"chevron\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 6l6 6-6 6\"/></symbol><symbol id=\"chevron-left\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 6l-6 6 6 6\"/></symbol><symbol id=\"search\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></symbol><symbol id=\"phone\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z\"/></symbol><symbol id=\"message\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22z\"/></symbol><symbol id=\"download\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"M7 10l5 5 5-5M12 15V3\"/></symbol><symbol id=\"plane\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"/></symbol><symbol id=\"bed\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9\"/></symbol><symbol id=\"shield\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"M12 9v6M9 12h6\"/></symbol><symbol id=\"passport\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/><path d=\"M8 17h8\"/></symbol><symbol id=\"book\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20\"/></symbol><symbol id=\"receipt\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/></symbol><symbol id=\"ticket\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z\"/><path d=\"M13 5v2M13 17v2M13 11v2\"/></symbol><symbol id=\"alert\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z\"/><path d=\"M12 9v4M12 17h.01\"/></symbol><symbol id=\"sun\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></symbol><symbol id=\"cloud\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z\"/></symbol><symbol id=\"cloud-sun\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4\"/><path d=\"M15.9 13A4.5 4.5 0 0 0 8.2 9.2\"/><path d=\"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z\"/></symbol><symbol id=\"rain\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2\"/><path d=\"M16 14v6M8 14v6M12 16v6\"/></symbol><symbol id=\"storm\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 16.3A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 .5 9\"/><path d=\"M13 11l-4 6h6l-4 6\"/></symbol><symbol id=\"fog\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2\"/><path d=\"M16 17H7M17 21H9\"/></symbol><symbol id=\"speaker\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 5L6 9H2v6h4l5 4z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7\"/></symbol><symbol id=\"expand\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7\"/></symbol><symbol id=\"swap\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4\"/></symbol><symbol id=\"refresh\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12a9 9 0 0 1-15 6.7L3 16\"/><path d=\"M3 12a9 9 0 0 1 15-6.7L21 8\"/><path d=\"M21 3v5h-5M3 21v-5h5\"/></symbol><symbol id=\"music\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/></symbol><symbol id=\"trophy\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0z\"/></symbol><symbol id=\"check\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6L9 17l-5-5\"/></symbol><symbol id=\"cake\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01\"/></symbol><symbol id=\"info\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4M12 8h.01\"/></symbol></svg>";
  if (!document.getElementById("app-sprite")) {
    var holder = document.createElement("div");
    holder.id = "app-sprite";
    holder.innerHTML = SPRITE;
    document.body.insertBefore(holder, document.body.firstChild);
  }

  var bar = document.querySelector(".appbar");
  if (bar) {
    var onScroll = function () {
      bar.classList.toggle("is-scrolled", global.scrollY > 4);
    };
    global.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var openStack = [];
  var lastFocus = null;

  function panelOf(sheet) {
    return sheet.querySelector(".sheet-panel");
  }

  function close(sheet) {
    if (!sheet || sheet.hidden) return;
    var panel = panelOf(sheet);
    var done = function () {
      sheet.hidden = true;
      panel.style.transform = "";
      panel.style.transition = "";
      var i = openStack.indexOf(sheet);
      if (i !== -1) openStack.splice(i, 1);
      if (!openStack.length) document.documentElement.style.overflow = "";
      if (sheet._onClose) sheet._onClose();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (global.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }
    panel.style.transition = "transform 0.28s cubic-bezier(0.4, 0, 1, 1)";
    panel.style.transform = "translateY(100%)";
    setTimeout(done, 260);
  }

  function open(sheet, opts) {
    if (!sheet) return;
    opts = opts || {};
    lastFocus = document.activeElement;
    sheet._onClose = opts.onClose || null;
    sheet.hidden = false;
    var panel = panelOf(sheet);
    panel.scrollTop = 0;
    if (openStack.indexOf(sheet) === -1) openStack.push(sheet);
    document.documentElement.style.overflow = "hidden";
    var focusEl = sheet.querySelector(".sheet-close") || panel;
    setTimeout(function () {
      focusEl.focus({ preventScroll: true });
    }, 30);
    if (!sheet._wired) wire(sheet);
  }

  function wire(sheet) {
    sheet._wired = true;
    var panel = panelOf(sheet);
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("[data-sheet-close]")) close(sheet);
    });
    var grip = sheet.querySelector(".sheet-grip");
    if (!grip) return;
    var startY = 0;
    var dy = 0;
    var dragging = false;
    grip.addEventListener("pointerdown", function (e) {
      dragging = true;
      startY = e.clientY;
      dy = 0;
      panel.style.transition = "none";
      grip.setPointerCapture(e.pointerId);
    });
    grip.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      panel.style.transform = "translateY(" + dy + "px)";
    });
    var end = function () {
      if (!dragging) return;
      dragging = false;
      if (dy > 110) {
        close(sheet);
      } else {
        panel.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        panel.style.transform = "";
      }
    };
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openStack.length) {
      e.preventDefault();
      close(openStack[openStack.length - 1]);
    }
  });

  global.AppSheet = { open: open, close: close };

  /** Иконка из спрайта: AppIcon("play", "ic ic-sm") */
  global.AppIcon = function (id, cls) {
    return (
      '<svg class="' +
      (cls || "ic") +
      '" aria-hidden="true"><use href="icons.svg#' +
      id +
      '"/></svg>'
    );
  };
})(window);

/**
 * BTT Bridgewater - Data-driven rendering
 * Builds dynamic sections from data/site.json so content updates only require editing JSON.
 */

(function () {
  'use strict';

  fetch('/data/site.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      renderPrograms(data.programs);
      renderSchedule(data.schedule);
      renderInstructors(data.instructors);
      renderPricing(data.pricing);
      renderContact(data.contact);
      renderFooterContact(data.contact);
      renderCopyrightYear();
    })
    .then(function () {
      // Trigger reveal observer for dynamically rendered elements
      document.dispatchEvent(new Event('contentRendered'));
    })
    .catch(function (err) {
      console.error('Failed to load site data:', err);
    });

  // ===== Programs =====
  function renderPrograms(programs) {
    var grid = document.querySelector('.programs-grid');
    if (!grid || !programs) return;
    grid.innerHTML = programs.map(function (p) {
      return '<article class="card">' +
        '<div class="card-icon"><svg><use href="#' + p.icon + '"/></svg></div>' +
        '<h3>' + p.title + '</h3>' +
        '<p>' + p.description + '</p>' +
        '<a href="#contact" class="card-link">Learn More <span>&rarr;</span></a>' +
        '</article>';
    }).join('');
  }

  // ===== Schedule =====
  function renderSchedule(schedule) {
    var tbody = document.querySelector('.schedule-table tbody');
    if (!tbody || !schedule) return;
    tbody.innerHTML = schedule.slots.map(function (slot) {
      var cells = '<td class="time-col">' + slot.time + '</td>';
      schedule.days.forEach(function (day) {
        var cls = slot.classes[day];
        if (cls) {
          cells += '<td><div class="class-info">' +
            '<span class="class-name">' + cls.name + '</span>' +
            '<span><span class="belt-dot belt-' + cls.belt + '"></span>' + cls.level + '</span>' +
            '</div></td>';
        } else {
          cells += '<td></td>';
        }
      });
      return '<tr>' + cells + '</tr>';
    }).join('');
  }

  // ===== Instructors =====
  function renderInstructors(instructors) {
    var grid = document.querySelector('.instructors-grid');
    if (!grid || !instructors) return;
    grid.innerHTML = instructors.map(function (i) {
      return '<article class="instructor-card">' +
        '<img src="' + i.image + '" alt="' + i.alt + '" loading="lazy" width="400" height="280">' +
        '<div class="info">' +
        '<h3>' + i.name + '</h3>' +
        '<p class="rank">' + i.rank + '</p>' +
        '<p>' + i.bio + '</p>' +
        '</div></article>';
    }).join('');
  }

  // ===== Pricing =====
  function renderPricing(pricing) {
    var grid = document.querySelector('.pricing-grid');
    if (!grid || !pricing) return;
    grid.innerHTML = pricing.map(function (p) {
      var cls = 'pricing-card' + (p.featured ? ' pricing-featured' : '');
      var badge = p.badge ? '<div class="pricing-badge">' + p.badge + '</div>' : '';
      var features = p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('');
      return '<article class="' + cls + '">' +
        badge +
        '<h3>' + p.title + '</h3>' +
        '<div class="price"><span class="price-amount">' + p.price + '</span></div>' +
        '<ul class="pricing-features">' + features + '</ul>' +
        '<a href="#contact" class="btn btn-primary btn-full">Get Started</a>' +
        '</article>';
    }).join('');
  }

  // ===== Contact Info =====
  function renderContact(contact) {
    var infoEl = document.querySelector('.contact-info');
    if (!infoEl || !contact) return;

    var hoursRows = contact.hours.map(function (h) {
      return '<tr><td>' + h.days + '</td><td>' + h.time + '</td></tr>';
    }).join('');

    infoEl.innerHTML =
      '<div class="contact-info-item">' +
        '<div class="contact-info-icon"><svg><use href="#icon-map-pin"/></svg></div>' +
        '<div class="contact-info-content"><h4>Location</h4><p>' + contact.location + '</p></div>' +
      '</div>' +
      '<div class="contact-info-item">' +
        '<div class="contact-info-icon"><svg><use href="#icon-phone"/></svg></div>' +
        '<div class="contact-info-content"><h4>Phone</h4><p><a href="' + contact.phoneHref + '">' + contact.phone + '</a></p></div>' +
      '</div>' +
      '<div class="contact-info-item">' +
        '<div class="contact-info-icon"><svg><use href="#icon-mail"/></svg></div>' +
        '<div class="contact-info-content"><h4>Email</h4><p><a href="mailto:' + contact.email + '">' + contact.email + '</a></p></div>' +
      '</div>' +
      '<div class="contact-info-hours">' +
        '<h4>Hours of Operation</h4>' +
        '<table>' + hoursRows + '</table>' +
      '</div>' +
      '<div class="contact-social">' +
        '<a href="' + contact.social.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram"><svg><use href="#icon-instagram"/></svg></a>' +
        '<a href="' + contact.social.facebook + '" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><svg><use href="#icon-facebook"/></svg></a>' +
      '</div>';
  }

  // ===== Footer Contact =====
  function renderFooterContact(contact) {
    var footerContact = document.querySelector('.footer-contact');
    if (!footerContact || !contact) return;

    footerContact.innerHTML =
      '<h3 class="footer-heading">Contact</h3>' +
      '<div class="footer-contact-item"><svg><use href="#icon-map-pin"/></svg><p>' + contact.location + '</p></div>' +
      '<div class="footer-contact-item"><svg><use href="#icon-phone"/></svg><p><a href="' + contact.phoneHref + '">' + contact.phone + '</a></p></div>' +
      '<div class="footer-contact-item"><svg><use href="#icon-mail"/></svg><p><a href="mailto:' + contact.email + '">' + contact.email + '</a></p></div>';
  }

  // ===== Copyright Year =====
  function renderCopyrightYear() {
    var el = document.getElementById('copyright-year');
    if (el) el.textContent = new Date().getFullYear();
  }

})();

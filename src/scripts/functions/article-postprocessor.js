PtRegister(
  "article-postprocessor",
  (w, c, end) => {

    // Time formatting
    w.formatTime = () => {
      const timeTargets = document.querySelectorAll('[data-rfc-time]');
      const tsTimeTargets = document.querySelectorAll('[data-tistory-time]');

      const now = new Date();
      const nowMS = now.getTime();

      const timeReformatter = (target, addSeconds = true) => {

        const date = new Date(target.dataset.rfcTime);
        const dateMS = date.getTime();

        let detailedDateString = '';
        if (now.getFullYear() === date.getFullYear()) {
          detailedDateString += '올해 ';
        } else if (now.getFullYear() === (date.getFullYear() + 1)) {
          detailedDateString += '작년 ';
        } else {
          detailedDateString += `${date.getFullYear()}년 `;
        }
        detailedDateString += `${date.getMonth() + 1}월 ${date.getDate()}일`

        if (addSeconds) {
          target.title = `${detailedDateString} ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초 (대한민국 표준시)`;
        } else {
          target.title = `${detailedDateString} ${date.getHours()}시 ${date.getMinutes()}분 (대한민국 표준시)`;
        }

        let timeString = '';
        if (nowMS - dateMS >= 86400000) {
          timeString = detailedDateString;

          if (target.dataset.tistoryTimeDetail && target.dataset.tistoryTimeDetail === 'true') {
            timeString += date.getHours() >= 12 ? ' 오후 ' : ' 오전 ';
            timeString += `${date.getHours() % (date.getHours() >= 13 ? 12 : 24)}시 `;
            timeString += `${date.getMinutes()}분`;
          }
        } else {
          const hours = Math.floor((nowMS - dateMS) / 3600000);
          const minutes = Math.floor((nowMS - dateMS - 3600000 * hours) / 60000);

          if (hours > 0) {
            timeString += `${hours}시간 `;
          }
          timeString += `${minutes}분 전`;
        }

        const innerTarget = target.querySelector('span.no-effect');
        if (innerTarget && (innerTarget.childNodes[0] instanceof Text)) {
          innerTarget.childNodes[0].data = timeString + ' ';
        } else {
          target.innerHTML = `<span class="no-effect">${timeString}</span>`;
        }

      };

      timeTargets.forEach(timeReformatter);
      tsTimeTargets.forEach((tsTimeTarget) => {
        let canReformatted = false;
        let tistoryTime = '';

        if (tsTimeTarget.dataset.tistoryTime="PARSE_NEEDED") {
          const innerTarget = tsTimeTarget.querySelector('span.no-effect');
          if (tsTimeTarget.dataset.rfcTime && tsTimeTarget.dataset.rfcTime.length > 0) {
            canReformatted = true;
          } else if (innerTarget && (innerTarget.childNodes[0] instanceof Text)) {
            tistoryTime = innerTarget.childNodes[0].data.trim();
            canReformatted = true;
          }
        } else {
          tistoryTime = tsTimeTarget.dataset.tistoryTime;
          canReformatted = true;
        }

        if (tistoryTime.length > 0) {
          tsTimeTarget.dataset.rfcTime = tistoryTime.replace(' ', 'T').replace(/\./g, '-');
        }

        if (canReformatted) {
          timeReformatter(tsTimeTarget, false);
        }
      });
    };
    w.formatTime();
    window.setInterval(w.formatTime, 60000);

    // Comment counting
    const commentTargets = document.querySelectorAll('.comments-count[data-count]');
    commentTargets.forEach((target) => {

      const count = Number.parseInt(target.dataset.count);
      if (target.dataset.count.length === 0 || (!Number.isNaN(count) && count === 0)) {
        target.querySelector('.count-text').textContent = '댓글 없음';
      } else if (target.dataset.count[0] === '(') {
        target.querySelector('.count-text').textContent =
          `${target.dataset.count.substring(1, target.dataset.count.length - 1)}개`;
      }

    });

    // Add space on "No category"
    const cgTargets = document.querySelectorAll('.meta .category > a, .meta .category > span, .meta.category');
    cgTargets.forEach((target) => {
      if (target.textContent === '분류없음') {
        target.textContent = '분류 없음';
      }
    });

    end(commentTargets, cgTargets);

  },
)

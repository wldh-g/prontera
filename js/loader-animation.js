PtRegister(
  "loader-animation",
  (w, c, end) => {

    w.identityImage = document.querySelector("header.global #identity img");

    if (w.identityImage) {
      w.identityImage.style.setProperty("animation", "none");

      window.addEventListener("beforeunload", function () {
        w.identityImage.style.setProperty("animation", "shiney 2.4s infinite");
      });
    }

    end();

  },
);

<script>
  window.MathJax = {
    startup: {
      typeset: false,
      pageReady: () => {
        const typesetAndLayout = (() => {
          let busy = false;
          let queued = false;

          const run = async () => {
            if (busy) {
              queued = true;
              return;
            }
            busy = true;
            queued = false;

            try {
              await MathJax.typesetPromise();
              if (window.Reveal && typeof Reveal.layout === "function") {
                Reveal.layout();
              }
            } finally {
              busy = false;
              if (queued) {
                requestAnimationFrame(run);
              }
            }
          };

          return () => requestAnimationFrame(run);
        })();

        return MathJax.startup.defaultPageReady().then(() => {
          if (window.Reveal) {
            Reveal.on("ready", typesetAndLayout);
            Reveal.on("slidechanged", typesetAndLayout);
            Reveal.on("fragmentshown", typesetAndLayout);
            Reveal.on("fragmenthidden", typesetAndLayout);
          }
          typesetAndLayout();
        });
      }
    },
    
    chtml: {
      mtextInheritFont: true
    },
    tex: {
      macros: {

        frag: ["{\\class{fragment}{#2}}", 2],

        success: "{\\operatorname{succ}}",
        sinc:    "{\\operatorname{sinc}}",
        sech:    "{\\operatorname{sech}}",
        csch:    "{\\operatorname{csch}}",

        Prob: "{\\mathbb{P}}",
        Ex:   "{\\mathbb{E}}",

        dist:  "{\\operatorname{dist}}",
        spn:   "{\\operatorname{span}}",
        sgn:   "{\\operatorname{sgn}}",
        rmse:  "{\\operatorname{rmse}}",
        rank:  "{\\operatorname{rank}}",
        erfc:  "{\\operatorname{erfc}}",
        erf:   "{\\operatorname{erf}}",
        cov:   "{\\operatorname{cov}}",
        cost:  "{\\operatorname{cost}}",
        comp:  "{\\operatorname{comp}}",
        corr:  "{\\operatorname{corr}}",
        diag:  "{\\operatorname{diag}}",
        var:   "{\\operatorname{var}}",
        opt:   "{\\operatorname{opt}}",
        brandnew: "{\\operatorname{new}}",
        std:   "{\\operatorname{std}}",
        kurt:  "{\\operatorname{kurt}}",
        med:   "{\\operatorname{med}}",
        vol:   "{\\operatorname{vol}}",
        bias:  "{\\operatorname{bias}}",

        Bern:  "{\\operatorname{Bern}}",
        Bin:   "{\\operatorname{Bin}}",
        Unif:  "{\\operatorname{Unif}}",
        Norm:  "{\\operatorname{N}}",
        Exp:   "{\\operatorname{Exp}}",
        Pois:  "{\\operatorname{Pois}}",
        Geom:  "{\\operatorname{Geom}}",
        Cauchy:"{\\operatorname{Cauchy}}",
        Laplace:"{\\operatorname{Laplace}}",
        Gamma: "{\\operatorname{Gamma}}",
        Beta:  "{\\operatorname{Beta}}",
        Weibull:"{\\operatorname{Weibull}}",
        Lognorm:"{\\operatorname{Lognormal}}",

        Var: "{\\operatorname{Var}}",
        Cov: "{\\operatorname{Cov}}",

        argmax: "{\\mathop{\\operatorname{argmax}}\\limits}",
        argmin: "{\\mathop{\\operatorname{argmin}}\\limits}",

        sign:  "{\\operatorname{sign}}",
        spann: "{\\operatorname{span}}",
        cond:  "{\\operatorname{cond}}",
        trace: "{\\operatorname{trace}}",
        Si:    "{\\operatorname{Si}}",
        col:   "{\\operatorname{col}}",
        nullspace: "{\\operatorname{null}}",
        Order: "{\\mathcal{O}}",

        IIDsim: "\\mathrel{\\stackrel{\\mathrm{IID}}{\\sim}}",
        LDsim:  "\\mathrel{\\stackrel{\\mathrm{LD}}{\\sim}}",
        appxsim: "\\mathrel{\\stackrel{\\cdot}{\\sim}}",

        naturals:  "{\\mathbb{N}}",
        natzero:   "{\\mathbb{N}_0}",
        integers:  "{\\mathbb{Z}}",
        rationals: "{\\mathbb{Q}}",
        reals:     "{\\mathbb{R}}",
        complex:   "{\\mathbb{C}}",

        abs:  ["{\\left\\lvert #1 \\right\\rvert}", 1],
        norm: ["{\\left\\lVert #1 \\right\\rVert}", 1],
        ip:   ["{\\left\\langle #1, #2 \\right\\rangle}", 2],

        bvec: ["{\\boldsymbol{#1}}", 1],
        avec: ["{\\vec{#1}}", 1],
        vecsym: ["{\\boldsymbol{#1}}", 1],

        vzero: "{\\boldsymbol{0}}",
        vone:  "{\\boldsymbol{1}}",
        vinf:  "{\\boldsymbol{\\infty}}",

        barX: "{\\overline{X}}",
        barY: "{\\overline{Y}}",
        barZ: "{\\overline{Z}}",

        me:  "{\\mathrm{e}}",
        mi:  "{\\mathrm{i}}",
        mpi: "{\\mathrm{\\pi}}",

        dif: "{\\mathrm{d}}"
      }
    }
  };

  (() => {
    if (sessionStorage.getItem("fh_slide_refreshed_once")) return;
    sessionStorage.setItem("fh_slide_refreshed_once", "1");
    window.addEventListener("load", () => {
      setTimeout(() => location.reload(), 250);
    });
  })();
</script>
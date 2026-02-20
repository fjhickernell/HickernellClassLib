#!/usr/bin/env python3

import sys
from pathlib import Path

OUTPUT = Path("build/distributions.tex")

DISTRIBUTIONS = {
    "uniform": {
        "name": r"Uniform --- $\Unif[a,b]$",
        "space": r"[a,b]",
        "rho": r"\frac{1}{b-a}",
        "mu": r"\frac{a+b}{2}",
        "var": r"\frac{(b-a)^2}{12}",
    },
    "geometric": {
        "name": r"Geometric --- $\Geom(p)$",
        "space": r"\{1,2,\ldots\}",
        "rho": r"p(1-p)^{x-1}",
        "mu": r"\frac{1}{p}",
        "var": r"\frac{1-p}{p^2}",
    },
}

def main():
    selected = sys.argv[1:]
    if not selected:
        raise SystemExit("Specify distributions")

    OUTPUT.parent.mkdir(exist_ok=True)

    with OUTPUT.open("w") as f:
        f.write(r"\begin{center}" + "\n")
        f.write(r"\small" + "\n")
        f.write(r"\begin{tabular}{" + "\n")
        f.write("c" + "\n")
        f.write(">{$ \\displaystyle}c<{$}" + "\n")
        f.write(">{$ \\displaystyle}c<{$}" + "\n")
        f.write(">{$ \\displaystyle}c<{$}" + "\n")
        f.write(">{$ \\displaystyle}c<{$}" + "\n")
        f.write("}" + "\n")

        f.write(
            r"Distribution & \text{Sample Space} & \varrho(x) & \mu & \sigma^2 \\"
            + "\n"
        )
        f.write(r"\toprule" + "\n")

        for dist in selected:
            d = DISTRIBUTIONS[dist]
            f.write(
                f"{d['name']} & {d['space']} & {d['rho']} & {d['mu']} & {d['var']} \\\\\n"
            )

        f.write(r"\bottomrule" + "\n")
        f.write(r"\end{tabular}" + "\n")
        f.write(r"\end{center}" + "\n")

    print(f"Wrote {OUTPUT}")

if __name__ == "__main__":
    main()

    
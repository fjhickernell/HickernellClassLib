from __future__ import annotations

from typing import Iterable, Sequence, Optional, Union, List

import numpy as np


def annotate_xaxis_marks(
    ax,
    xs: Sequence[float],
    labels: Sequence[str],
    *,
    colors: Optional[Sequence[Optional[str]]] = None,
    tick_height: float = 0.05,
    tick_linewidth: float = 2.0,
    tick_kwargs: Optional[dict] = None,
    text_offset_pts: float = -18.0,
    fontsize: Optional[float] = None,
    ha: str = "center",
    va: str = "top",
):
    """
    Place math labels under the x-axis at specified x-positions, with small ticks.

    This is designed to work reliably in both:
      - Quarto revealjs slides (Matplotlib backend in render)
      - Jupyter notebooks

    Parameters
    ----------
    ax : matplotlib Axes
    xs, labels : same length
      Positions (data coords) and text (usually math strings like r"$\\mu$").
    colors : optional list matching xs
      Color per mark; None means Matplotlib default.
    tick_height : float
      Tick extends from y=0 down to y=-tick_height in "xaxis transform" coords.
    text_offset_pts : float
      Vertical offset for label in points (negative puts below axis).
    """
    xs = np.asarray(xs, dtype=float)
    if len(xs) != len(labels):
        raise ValueError("xs and labels must have the same length")

    if colors is None:
        colors = [None] * len(xs)
    if len(colors) != len(xs):
        raise ValueError("colors must be None or have the same length as xs")

    if tick_kwargs is None:
        tick_kwargs = {}

    artists: List[object] = []
    xtr = ax.get_xaxis_transform()

    for x, lab, col in zip(xs, labels, colors):
        line = ax.plot(
            [x, x],
            [0.0, -tick_height],
            transform=xtr,
            clip_on=False,
            linewidth=tick_linewidth,
            color=col,
            **tick_kwargs,
        )[0]
        artists.append(line)

        ann = ax.annotate(
            lab,
            xy=(x, 0.0),
            xycoords=("data", "axes fraction"),
            xytext=(0.0, text_offset_pts),
            textcoords="offset points",
            ha=ha,
            va=va,
            fontsize=fontsize,
            color=col,
        )
        artists.append(ann)

    return artists


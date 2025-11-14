import numpy as np
import warnings

class TensorProductGrid:
    """
    Tensor-product grid in [0,1]^d with a QMCPy-like interface.
    Minimal notebook version — safe to paste anywhere.
    """

    def __init__(
        self,
        levels_per_dim,
        dimension=None,
        *,
        centered=True,
        endpoint=False,
    ):
        # Normalize dim + levels
        if np.isscalar(levels_per_dim):
            if dimension is None:
                raise ValueError("If scalar levels_per_dim is used, you must specify dimension.")
            L = int(levels_per_dim)
            if L <= 0:
                raise ValueError("levels_per_dim must be positive.")
            self.levels_per_dim = np.full(int(dimension), L, dtype=int)
        else:
            levels = np.asarray(levels_per_dim, dtype=int)
            if levels.ndim != 1:
                raise ValueError("levels_per_dim must be a 1D sequence of ints.")
            if np.any(levels <= 0):
                raise ValueError("All entries of levels_per_dim must be positive.")
            self.levels_per_dim = levels
            if dimension is None:
                dimension = len(levels)
            elif dimension != len(levels):
                raise ValueError("dimension does not match len(levels_per_dim).")

        self.dimension = int(dimension)
        self.centered = bool(centered)
        self.endpoint = bool(endpoint)

        # Build axes
        axes = []
        for L in self.levels_per_dim:
            if self.centered:
                k = np.arange(L, dtype=float)
                axis = (k + 0.5) / L          # midpoints in [0,1]
            else:
                axis = np.linspace(0.0, 1.0, num=L, endpoint=self.endpoint)
            axes.append(axis)

        # Tensor product grid: N × d
        mesh = np.meshgrid(*axes, indexing="ij")
        self.points = np.stack([m.ravel(order="C") for m in mesh], axis=1)
        self.n_total = self.points.shape[0]

        # For compatibility with TrueMeasure-like attributes
        self.lower_bound = np.zeros(self.dimension)
        self.upper_bound = np.ones(self.dimension)

    def gen_samples(self, n=None, warn=True):
        """
        Returns an n × d NumPy array of grid points.
        If n is None or >= total, returns full grid.
        """
        if n is None or n >= self.n_total or n < 0:
            return self.points.copy()

        n = int(n)
        if n == 0:
            return np.empty((0, self.dimension))

        if warn and n != self.n_total:
            warnings.warn(
                f"TensorProductGrid: returning first {n} of {self.n_total} grid points.",
                RuntimeWarning,
            )
        return self.points[:n].copy()

    # >>> This is the key new bit for qp.plot_proj <<<
    def __call__(self, n, **kwargs):
        """Allow instances to be called like a QMCPy sampler: sampler(n)."""
        return self.gen_samples(n)

    def __repr__(self):
        return (f"TensorProductGrid(dim={self.dimension}, "
                f"levels={self.levels_per_dim.tolist()}, "
                f"n_total={self.n_total})")
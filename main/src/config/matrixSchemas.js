export const matrixSchemas = [
  {
    name: "Tridiagonal System",
    handler: ({ size, inputs }) => {
      // Convert 2D matrix to flat Vec<f64>
      const mat = inputs["matrix a"].flat();
      const vec = inputs["vector b"].flat();
      return { method: "cramer", mat, vec, size };
    }
  },
  {
    name: "Diagonal Dominant",
    handler: ({ size, inputs }) => {
      const mat = inputs["matrix a"].flat();
      const vec = inputs["vector b"].flat();
      return { method: "cramer", mat, vec, size };
    }
  }
];
